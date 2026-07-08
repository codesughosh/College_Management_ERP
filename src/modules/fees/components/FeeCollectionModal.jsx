import { useMemo, useState } from 'react';
import SearchSelect from '../../../components/SearchSelect';
import {
  calculateDueAmount,
  feeComponentFields,
  formatCurrency,
  getFeeComponentValues,
  manualDueItemOptions,
  normalizeManualDueItems,
  totalFeeComponents,
} from '../feeUtils';

function totalFromForm(form = {}) {
  return totalFeeComponents(form);
}

function getInitialFeeValues({ assignment, collection, structure }) {
  if (collection?.feeStructureId || collection?.totalAmount) return getFeeComponentValues(collection);
  if (assignment) return getFeeComponentValues(assignment);
  if (structure) return getFeeComponentValues(structure);
  return getFeeComponentValues({});
}

export default function FeeCollectionModal({
  assignments,
  initialAssignmentId = '',
  initialCollection = null,
  onClose,
  onSave,
  students = [],
  structures = [],
}) {
  const initialAssignment = assignments.find((item) => item.id === (initialCollection?.assignmentId || initialAssignmentId));
  const initialStructure = structures.find((item) => item.id === (initialCollection?.feeStructureId || initialAssignment?.feeStructureId));
  const initialFeeValues = getInitialFeeValues({
    assignment: initialAssignment,
    collection: initialCollection,
    structure: initialStructure,
  });
  const [form, setForm] = useState({
    entryMode: 'structure',
    collectionId: initialCollection?.id || '',
    assignmentId: initialAssignment?.id || '',
    studentRecordId: initialCollection?.studentRecordId || initialAssignment?.studentRecordId || '',
    feeStructureId: initialCollection?.feeStructureId || initialAssignment?.feeStructureId || '',
    ...initialFeeValues,
    amount: initialCollection?.amount || '',
    paymentMode: initialCollection?.paymentMode || 'Cash',
    referenceNo: initialCollection?.referenceNo || '',
    paymentDate: initialCollection?.paymentDate || new Date().toISOString().slice(0, 10),
    collectedBy: initialCollection?.collectedBy || 'Admin Office',
    manualDueItems: normalizeManualDueItems(initialCollection?.manualDueItems || initialAssignment?.manualDueItems || []),
  });

  const selectedStructure = structures.find((item) => item.id === form.feeStructureId);
  const matchingAssignment = assignments.find((item) => (
    item.id === form.assignmentId ||
    (item.studentRecordId === form.studentRecordId && item.feeStructureId === form.feeStructureId)
  ));
  const editedTotal = totalFromForm(form);
  const paidBeforeThisPayment = Math.max(
    0,
    Number(matchingAssignment?.paidAmount || 0) - (
      initialCollection?.assignmentId && initialCollection.assignmentId === matchingAssignment?.id
        ? Number(initialCollection.amount || 0)
        : 0
    )
  );
  const dueBeforeThisPayment = calculateDueAmount(editedTotal, paidBeforeThisPayment, matchingAssignment?.adjustmentAmount);
  const dueAfterThisPayment = calculateDueAmount(editedTotal, paidBeforeThisPayment + Number(form.amount || 0), matchingAssignment?.adjustmentAmount);

  const studentOptions = useMemo(() => students.map((item) => ({
    value: item.id,
    label: `${item.name} - ${item.studentId || item.admissionNo}`,
  })), [students]);
  const structureOptions = useMemo(() => structures.map((item) => ({
    value: item.id,
    label: `${item.name} - ${item.classKey} - ${formatCurrency(item.totalAmount)}`,
  })), [structures]);

  const applyFeeSource = (nextForm, nextStructureId = nextForm.feeStructureId, nextStudentId = nextForm.studentRecordId) => {
    const nextAssignment = assignments.find((item) => item.studentRecordId === nextStudentId && item.feeStructureId === nextStructureId);
    const nextStructure = structures.find((item) => item.id === nextStructureId);
    const feeValues = getInitialFeeValues({ assignment: nextAssignment, structure: nextStructure });
    return {
      ...nextForm,
      assignmentId: nextAssignment?.id || '',
      ...feeValues,
      manualDueItems: normalizeManualDueItems(nextAssignment?.manualDueItems || []),
    };
  };

  const updateStudent = (studentRecordId) => {
    setForm((prev) => applyFeeSource({ ...prev, studentRecordId }, prev.feeStructureId, studentRecordId));
  };

  const updateStructure = (feeStructureId) => {
    setForm((prev) => applyFeeSource({ ...prev, feeStructureId }, feeStructureId, prev.studentRecordId));
  };

  const updateFeeComponent = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleManualDueItem = (item) => {
    setForm((prev) => {
      const currentItems = normalizeManualDueItems(prev.manualDueItems);
      const exists = currentItems.some((currentItem) => currentItem.id === item.id);
      return {
        ...prev,
        manualDueItems: exists
          ? currentItems.filter((currentItem) => currentItem.id !== item.id)
          : [...currentItems, item],
      };
    });
  };

  const submit = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      totalAmount: editedTotal,
      feeStructureName: selectedStructure?.name || '',
      manualDueItems: normalizeManualDueItems(form.manualDueItems),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-4xl max-h-[92vh] overflow-hidden bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{initialCollection ? 'Edit Fee Collection' : 'Record Fee Collection'}</h2>
            <p className="text-sm text-slate-500">Select a student and fee structure, then edit fees if needed.</p>
          </div>
          <button type="button" onClick={onClose} className="h-9 w-9 rounded-full hover:bg-slate-100 text-slate-500">x</button>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-4 overflow-y-auto">
          <label className="sm:col-span-2">
            <span className="block text-xs font-semibold text-slate-500 mb-1.5">Student</span>
            <SearchSelect
              value={form.studentRecordId}
              onChange={updateStudent}
              options={studentOptions}
              placeholder="Search student..."
            />
          </label>
          <label className="sm:col-span-2">
            <span className="block text-xs font-semibold text-slate-500 mb-1.5">Fee Structure</span>
            <SearchSelect
              value={form.feeStructureId}
              onChange={updateStructure}
              options={structureOptions}
              placeholder="Search fee structure..."
            />
          </label>

          {selectedStructure && (
            <div className="sm:col-span-2 rounded-lg border border-emerald-100 bg-emerald-50/60 p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-xs font-bold uppercase text-emerald-700">Selected Structure</div>
                  <div className="font-bold text-slate-900">{selectedStructure.name}</div>
                  <div className="text-xs text-slate-500">{selectedStructure.classKey} | {selectedStructure.academicYear}</div>
                </div>
                <div className="text-sm font-bold text-slate-900">{formatCurrency(selectedStructure.totalAmount)}</div>
              </div>
            </div>
          )}

          <div className="sm:col-span-2 grid sm:grid-cols-2 md:grid-cols-3 gap-3 rounded-lg border border-slate-100 bg-[#f5f5f6] p-4">
            {feeComponentFields.map(({ label, key }) => (
              <label key={key}>
                <span className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</span>
                <input
                  type="number"
                  min="0"
                  value={form[key]}
                  onChange={(event) => updateFeeComponent(key, event.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
                />
              </label>
            ))}
            <div className="rounded-lg bg-white p-3">
              <div className="text-xs font-semibold text-slate-500">Edited Total</div>
              <div className="text-lg font-extrabold text-slate-900">{formatCurrency(editedTotal)}</div>
            </div>
          </div>

          <div className="sm:col-span-2 rounded-lg border border-amber-100 bg-amber-50/60 p-4">
            <div className="text-xs font-bold uppercase text-amber-700 mb-3">Pending Due Items</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {manualDueItemOptions.map((item) => {
                const checked = normalizeManualDueItems(form.manualDueItems).some((currentItem) => currentItem.id === item.id);
                return (
                  <label key={item.id} className="min-h-10 rounded-lg bg-white border border-amber-100 px-3 py-2 text-xs font-semibold text-slate-700 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleManualDueItem(item)}
                      className="h-4 w-4 rounded border-slate-300 accent-[#026c36]"
                    />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="sm:col-span-2 grid sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg bg-[#f5f5f6] p-3">
              <div className="text-xs font-semibold text-slate-500">Paid Before</div>
              <div className="font-bold text-slate-900">{formatCurrency(paidBeforeThisPayment)}</div>
            </div>
            <div className="rounded-lg bg-[#f5f5f6] p-3">
              <div className="text-xs font-semibold text-slate-500">Due Before</div>
              <div className="font-bold text-rose-700">{formatCurrency(dueBeforeThisPayment)}</div>
            </div>
            <div className="rounded-lg bg-[#f5f5f6] p-3">
              <div className="text-xs font-semibold text-slate-500">Due After</div>
              <div className="font-bold text-emerald-700">{formatCurrency(dueAfterThisPayment)}</div>
            </div>
          </div>

          <label>
            <span className="block text-xs font-semibold text-slate-500 mb-1.5">Payment Amount</span>
            <input
              type="number"
              min="0"
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
              placeholder={dueBeforeThisPayment || 0}
              className="w-full h-11 rounded-lg border border-slate-200 px-3 text-sm"
            />
          </label>
          <label>
            <span className="block text-xs font-semibold text-slate-500 mb-1.5">Payment Mode</span>
            <select value={form.paymentMode} onChange={(event) => setForm((prev) => ({ ...prev, paymentMode: event.target.value }))} className="w-full h-11 rounded-lg border border-slate-200 px-3 text-sm">
              {['Cash', 'Cheque', 'Bank Transfer', 'UPI Manual Entry', 'Card Swipe Offline'].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span className="block text-xs font-semibold text-slate-500 mb-1.5">Payment Date</span>
            <input type="date" value={form.paymentDate} onChange={(event) => setForm((prev) => ({ ...prev, paymentDate: event.target.value }))} className="w-full h-11 rounded-lg border border-slate-200 px-3 text-sm" />
          </label>
          <label>
            <span className="block text-xs font-semibold text-slate-500 mb-1.5">Reference No.</span>
            <input value={form.referenceNo} onChange={(event) => setForm((prev) => ({ ...prev, referenceNo: event.target.value }))} className="w-full h-11 rounded-lg border border-slate-200 px-3 text-sm" />
          </label>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="h-10 px-5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">Cancel</button>
          <button type="submit" className="h-10 px-5 rounded-lg bg-[#033500] text-white font-bold text-sm shadow-[0_10px_22px_rgba(3,53,0,0.25)]">
            {initialCollection ? 'Save Changes' : 'Post Collection'}
          </button>
        </div>
      </form>
    </div>
  );
}

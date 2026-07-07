import StatusBadge from '../../students/components/StatusBadge';
import { formatCurrency } from '../feeUtils';

const feeComponentLabels = [
  ['Admission', 'admissionFee'],
  ['Year Fee', 'tuitionFee'],
  ['Library', 'libraryFee'],
  ['Lab', 'labFee'],
  ['Transport', 'transportFee'],
];

function getExtraChargesSummary(note = '') {
  if (!note) return '';
  return 'Extra charges apply: books, uniform, pocket articles, eligibility certificate, university exam fees, and hostel/transport charges as applicable.';
}

export default function FeeStructurePanel({ structures, canEdit, onEdit, onAssign, layout = 'inspector' }) {
  const isGrid = layout === 'grid';

  return (
    <section className={isGrid ? 'w-full space-y-4' : 'xl:w-[32%] erp-sticky-inspector space-y-4'}>
      <div className="bg-white border border-slate-100 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Fee Structures</h3>
          <span className="text-xs text-slate-500">{structures.length} active</span>
        </div>
        <div className={isGrid ? 'grid gap-4 md:grid-cols-2 2xl:grid-cols-3' : 'space-y-3'}>
          {structures.map((item) => {
            const visibleComponents = feeComponentLabels.filter(([, key]) => Number(item[key] || 0) > 0);
            const extraChargesSummary = getExtraChargesSummary(item.extraChargesNote);
            return (
              <div key={item.id} className="rounded-lg bg-[#f5f5f6] p-4 flex flex-col min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 leading-snug">{item.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{item.classKey} | {item.academicYear}</div>
                    {item.courseName && <div className="text-xs text-slate-500 mt-0.5">{item.courseName}</div>}
                  </div>
                  <span className="shrink-0"><StatusBadge value={item.status} /></span>
                </div>
                <div className={isGrid ? 'grid grid-cols-2 xl:grid-cols-3 gap-2 mt-4 text-xs text-slate-600' : 'grid grid-cols-2 gap-2 mt-4 text-xs text-slate-600'}>
                  {visibleComponents.map(([label, key]) => (
                    <div key={key} className="rounded-md bg-white p-2">{label}<br /><b>{formatCurrency(item[key])}</b></div>
                  ))}
                </div>
                {extraChargesSummary && (
                  <div className="mt-3 text-[11px] leading-relaxed text-slate-500" title={item.extraChargesNote}>{extraChargesSummary}</div>
                )}
                <div className="flex items-center justify-between gap-3 mt-auto pt-4">
                  <div>
                    <div className="text-xs text-slate-500">Total</div>
                    <div className="font-bold text-slate-900">{formatCurrency(item.totalAmount)}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => onAssign(item)} disabled={!canEdit} className="h-8 px-3 rounded-md bg-white border border-slate-200 text-xs font-semibold disabled:text-slate-300">Assign</button>
                    <button onClick={() => onEdit(item)} disabled={!canEdit} className="h-8 px-3 rounded-md bg-[#33373e] text-white text-xs font-semibold disabled:bg-slate-300">Edit</button>
                  </div>
                </div>
              </div>
            );
          })}
          {!structures.length && <div className="rounded-lg bg-[#f5f5f6] p-4 text-sm text-slate-500">No fee structures created yet.</div>}
        </div>
      </div>
    </section>
  );
}

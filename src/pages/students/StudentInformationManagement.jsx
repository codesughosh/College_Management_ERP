import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  FileText,
  GraduationCap,
  IdCard,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,
  TrendingUp,
  Upload,
  UserRound,
  Users,
  Wallet,
  LogOut,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  createStudent,
  createStudentAdmission,
  createStudentDocument,
  createStudentIdCard,
  createStudentPromotion,
  createStudentTransfer,
  getStudentInformationData,
  updateStudent,
} from '../../firebase/db';
import { isFirebaseConfigured } from '../../firebase/config';

const demoStudents = [
  {
    id: 'demo-4449',
    admissionNo: 'ADM-2026-04449',
    studentId: 'STU-4449',
    name: 'Vivek Sharma',
    className: 'Class XII',
    section: 'A',
    program: 'CBSE Science',
    institute: 'COLLEGE NAME',
    guardianName: 'Rajesh Sharma',
    phone: '+91 98765 43210',
    email: 'vivek.sharma@student.genius.edu',
    status: 'Active',
    documents: ['Aadhaar Card', 'Marks Card', 'Transfer Certificate'],
    promotionStatus: 'Eligible',
    transferStatus: 'Not Requested',
    createdAtText: '03 Jun 2026',
  },
  {
    id: 'demo-4450',
    admissionNo: 'ADM-2026-04450',
    studentId: 'STU-4450',
    name: 'Vaibhavi Aggarwal',
    className: 'Class XI',
    section: 'B',
    program: 'PU Commerce',
    institute: 'COLLEGE NAME',
    guardianName: 'Anita Aggarwal',
    phone: '+91 99887 77665',
    email: 'vaibhavi@student.genius.edu',
    status: 'Admission Review',
    documents: ['Aadhaar Card', 'Admission Form'],
    promotionStatus: 'Pending Review',
    transferStatus: 'Not Requested',
    createdAtText: '01 Jun 2026',
  },
  {
    id: 'demo-4451',
    admissionNo: 'ADM-2026-04451',
    studentId: 'STU-4451',
    name: 'Aditya Rao',
    className: 'Class X',
    section: 'C',
    program: 'CBSE General',
    institute: 'COLLEGE NAME',
    guardianName: 'Meera Rao',
    phone: '+91 91234 56780',
    email: 'aditya.rao@student.genius.edu',
    status: 'Active',
    documents: ['Aadhaar Card', 'Birth Certificate', 'Previous School Record'],
    promotionStatus: 'Eligible',
    transferStatus: 'Certificate Ready',
    createdAtText: '29 May 2026',
  },
];

function relationMatches(record, student) {
  return record.studentRecordId === student.id || record.studentId === student.studentId;
}

function latestRecord(records) {
  return records[records.length - 1] || null;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'academics', label: 'Academics', icon: <GraduationCap size={18} />, hasChildren: true },
  { id: 'batch', label: 'Batch Section', icon: <BookOpen size={18} />, hasChildren: true },
  { id: 'reports', label: 'Reports', icon: <TrendingUp size={18} /> },
  { id: 'payments', label: 'Payments', icon: <Wallet size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

const tabs = [
  { id: 'admissions', label: 'Admissions', icon: <Plus size={15} /> },
  { id: 'profiles', label: 'Profiles', icon: <UserRound size={15} /> },
  { id: 'documents', label: 'Documents', icon: <FileText size={15} /> },
  { id: 'ids', label: 'ID Cards', icon: <IdCard size={15} /> },
  { id: 'promotion', label: 'Promotion & Transfer', icon: <GraduationCap size={15} /> },
];

function SelectBox({ label, width = 'w-64' }) {
  return (
    <button
      onClick={() => toast.success(`${label.replace('*', '')} selector opened`)}
      className={`${width} h-11 bg-white border border-slate-200 rounded-lg shadow-[0_2px_8px_rgba(15,23,42,0.04)] px-4 flex items-center justify-between text-sm text-slate-600`}
    >
      <span>{label}<span className="text-orange-500">*</span></span>
      <ChevronDown size={15} className="text-slate-400" />
    </button>
  );
}

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="w-[276px] bg-white border-r border-slate-200 shrink-0 hidden lg:flex flex-col">
      <div className="px-9 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full border-2 border-emerald-700 flex items-center justify-center text-emerald-700">
            <GraduationCap size={26} />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-bold text-slate-900">COLLEGE NAME</div>
            <div className="text-[10px] text-slate-500">ERP Management Suite</div>
          </div>
        </div>
      </div>

      <div className="px-9 pb-5">
        <div className="relative bg-[#33373e] text-white rounded-lg p-4 min-h-[84px] overflow-hidden">
          <div className="text-sm font-bold mb-3">Academic Curriculum</div>
          <button
            onClick={() => {
              onNavigate('calendar');
              toast.success('Academic calendar opened');
            }}
            className="bg-[#5a5d66] h-10 px-4 rounded-md flex items-center gap-3 text-sm"
          >
            View Calendar <ChevronRight size={15} />
          </button>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
            <CalendarDays size={24} />
          </div>
        </div>
      </div>

      <nav className="px-9 py-3 flex flex-col">
        {navItems.map(({ id, label, icon, hasChildren }) => {
          const active = activePage === id;
          return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`h-16 border-b border-slate-100 flex items-center justify-between text-[15px] ${
              active ? 'text-slate-800' : 'text-slate-600'
            }`}
          >
            <span className={`flex items-center gap-3 ${active ? 'bg-[#e7e7ea] rounded-md px-3 py-3 w-full' : ''}`}>
              {icon}
              {label}
            </span>
            {hasChildren && <ChevronDown size={14} />}
          </button>
          );
        })}
      </nav>
    </aside>
  );
}

function TopHeader({ user, onLogout }) {
  return (
    <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-5 lg:px-10 shrink-0">
      <div className="flex items-center gap-5 min-w-0">
        <button
          onClick={() => toast.success('Menu toggled')}
          className="h-12 w-12 rounded-full bg-[#fb9a5b] text-slate-800 flex items-center justify-center shadow-sm shrink-0"
        >
          <Menu size={20} />
        </button>
        <div className="hidden md:flex items-center gap-3">
          <SelectBox label="Select Institute" />
          <SelectBox label="Academic Year" width="w-44" />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button onClick={() => toast.success('No new notifications')} className="relative text-slate-500">
          <Bell size={19} />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-orange-500 border border-white" />
        </button>
        <div className="hidden sm:block h-9 w-px bg-slate-200" />
        <div className="hidden sm:block text-xs text-slate-700 leading-5">
          <div>Admin ID : ADM-001</div>
          <div>Institute ID : 97</div>
        </div>
        <div className="hidden sm:block h-9 w-px bg-slate-200" />
        <div className="text-right leading-tight">
          <div className="text-sm font-bold text-slate-900">{user?.name || 'Admin'}</div>
          <span className="inline-flex bg-[#ff9f68] text-white text-[9px] px-2 py-0.5 rounded-sm font-bold uppercase">
            Admin
          </span>
        </div>
        <div className="h-10 w-10 rounded-full bg-[#2e333b] text-emerald-300 flex items-center justify-center">
          <UserRound size={22} />
        </div>
        <button
          onClick={onLogout}
          className="h-10 w-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

function StatusBadge({ value }) {
  const classes = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Admission Review': 'bg-orange-50 text-orange-700 border-orange-200',
    Eligible: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Pending Review': 'bg-amber-50 text-amber-700 border-amber-200',
    'Certificate Ready': 'bg-sky-50 text-sky-700 border-sky-200',
    'Not Requested': 'bg-slate-50 text-slate-600 border-slate-200',
    Promoted: 'bg-violet-50 text-violet-700 border-violet-200',
  };
  return (
    <span className={`inline-flex rounded-md border px-2.5 py-1 text-[11px] font-semibold ${classes[value] || classes.Active}`}>
      {value}
    </span>
  );
}

function StudentModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    className: 'Class XI',
    section: 'A',
    program: 'PU Science',
    guardianName: '',
    phone: '',
    email: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">New Student Admission</h2>
            <p className="text-sm text-slate-500">Creates profile, admission number, and student ID.</p>
          </div>
          <button type="button" onClick={onClose} className="h-9 w-9 rounded-full hover:bg-slate-100 text-slate-500">x</button>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          {[
            ['name', 'Student Name'],
            ['guardianName', 'Guardian Name'],
            ['phone', 'Phone'],
            ['email', 'Email'],
            ['className', 'Class'],
            ['section', 'Section'],
            ['program', 'Program'],
          ].map(([key, label]) => (
            <label key={key} className={key === 'program' ? 'sm:col-span-2' : ''}>
              <span className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</span>
              <input
                required={['name', 'guardianName', 'phone'].includes(key)}
                value={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                className="w-full h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#fb9a5b] focus:ring-2 focus:ring-orange-100"
              />
            </label>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="h-10 px-5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">
            Cancel
          </button>
          <button type="submit" className="h-10 px-5 rounded-lg bg-[#33373e] text-white font-semibold text-sm">
            Save Admission
          </button>
        </div>
      </form>
    </div>
  );
}

function DemoModulePage({ page, onOpenStudents }) {
  const content = {
    academics: {
      title: 'Academics',
      subtitle: 'Academic curriculum, subject plans, batch sections, and timetable readiness.',
      actions: ['Open Curriculum', 'Create Subject Plan', 'Publish Timetable'],
      rows: [
        ['Academic Curriculum', '6 subjects mapped', 'Active'],
        ['Batch Section', 'Class XI-A / XII-A configured', 'Active'],
        ['Calendar', '12 academic events', 'Published'],
      ],
    },
    batch: {
      title: 'Batch Section',
      subtitle: 'Manage classes, sections, class teachers, and student allocations.',
      actions: ['Create Batch', 'Assign Students', 'Export Sections'],
      rows: [
        ['Class XI - A', '42 students', 'Assigned'],
        ['Class XII - A', '38 students', 'Assigned'],
        ['PU Science', '2 sections', 'Review'],
      ],
    },
    reports: {
      title: 'Reports',
      subtitle: 'MIS snapshots for admissions, documents, ID cards, promotions, and transfers.',
      actions: ['Generate Report', 'Download MIS', 'Schedule Email'],
      rows: [
        ['Admission Report', 'This academic year', 'Ready'],
        ['Document Pending Report', 'Verification queue', 'Ready'],
        ['Promotion Report', 'Class-wise summary', 'Draft'],
      ],
    },
    payments: {
      title: 'Payments',
      subtitle: 'Fee status, receipts, outstanding balances, and transaction activity.',
      actions: ['Record Payment', 'View Receipts', 'Download Ledger'],
      rows: [
        ['Quarter 1 Fee', '₹29,999.00', 'Paid'],
        ['Admission Fee', '₹12,000.00', 'Pending'],
        ['Transport Fee', '₹8,500.00', 'Scheduled'],
      ],
    },
    settings: {
      title: 'Settings',
      subtitle: 'Institute profile, academic year, modules, and student ID configuration.',
      actions: ['Save Institute', 'Configure IDs', 'Manage Roles'],
      rows: [
        ['Institute', 'COLLEGE NAME', 'Active'],
        ['Academic Year', '2026-2027', 'Active'],
        ['Student ID Format', 'STU-{number}', 'Active'],
      ],
    },
    calendar: {
      title: 'Academic Calendar',
      subtitle: 'Calendar view for classes, tests, holidays, admissions, and academic events.',
      actions: ['Add Event', 'Publish Calendar', 'Download Calendar'],
      rows: [
        ['Orientation Day', '01 Jun 2026', 'Published'],
        ['Internal Test - Physics', '13 Jun 2026', 'Active'],
        ['Holiday - Festival', '21 Jun 2026', 'Published'],
        ['Promotion Review', '28 Jun 2026', 'Draft'],
      ],
    },
  };

  const current = content[page] || content.academics;

  return (
    <div>
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="text-sm font-bold text-slate-500 mb-2">ERP / <span className="text-[#f39a5f]">{current.title}</span></div>
          <h1 className="text-2xl font-bold text-slate-900">{current.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{current.subtitle}</p>
        </div>
        <button
          onClick={onOpenStudents}
          className="h-10 px-5 rounded-full bg-[#fb9a5b] text-white font-semibold text-sm flex items-center gap-2"
        >
          <Users size={16} /> Back to Students
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 py-5">
        {current.actions.map((action) => (
          <button
            key={action}
            onClick={() => toast.success(`${action} clicked`)}
            className="bg-[#f5f5f6] rounded-lg p-5 text-left hover:bg-[#eeeeef] transition-colors"
          >
            <div className="h-11 w-11 bg-white rounded-lg flex items-center justify-center text-[#34363d] shadow-sm mb-4">
              <Plus size={20} />
            </div>
            <div className="font-bold text-slate-900">{action}</div>
            <div className="text-xs text-slate-500 mt-1">Demo action is clickable and ready for real workflow wiring.</div>
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-3 bg-[#e7e7e9] text-sm font-bold text-slate-900">
          <div className="px-5 py-3">Item</div>
          <div className="px-5 py-3">Details</div>
          <div className="px-5 py-3">Status</div>
        </div>
        {current.rows.map(([item, detail, status]) => (
          <button
            key={item}
            onClick={() => toast.success(`${item} opened`)}
            className="grid grid-cols-3 w-full text-left border-t border-slate-100 hover:bg-slate-50 text-sm"
          >
            <div className="px-5 py-4 font-semibold text-slate-900">{item}</div>
            <div className="px-5 py-4 text-slate-600">{detail}</div>
            <div className="px-5 py-4"><StatusBadge value={status === 'Paid' ? 'Active' : status} /></div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function StudentInformationManagement({ user, onLogout }) {
  const [students, setStudents] = useState(demoStudents);
  const [activePage, setActivePage] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('admissions');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(demoStudents[0].id);
  const [admissions, setAdmissions] = useState([]);
  const [studentDocuments, setStudentDocuments] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [idCards, setIdCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadStudentInformation = async () => {
      try {
        const data = await getStudentInformationData();
        if (data.students.length) {
          setStudents(data.students);
          setSelectedId(data.students[0].id);
        }
        setAdmissions(data.admissions);
        setStudentDocuments(data.documents);
        setPromotions(data.promotions);
        setTransfers(data.transfers);
        setIdCards(data.idCards);
      } catch (error) {
        console.warn('Using demo students because Firestore is not reachable.', error);
      } finally {
        setLoading(false);
      }
    };
    loadStudentInformation();
  }, []);

  const selectedStudent = students.find((student) => student.id === selectedId) || students[0];
  const selectedAdmissions = admissions.filter((record) => relationMatches(record, selectedStudent));
  const selectedDocuments = studentDocuments.filter((record) => relationMatches(record, selectedStudent));
  const selectedPromotions = promotions.filter((record) => relationMatches(record, selectedStudent));
  const selectedTransfers = transfers.filter((record) => relationMatches(record, selectedStudent));
  const selectedIdCards = idCards.filter((record) => relationMatches(record, selectedStudent));
  const latestAdmission = latestRecord(selectedAdmissions);
  const latestPromotion = latestRecord(selectedPromotions);
  const latestTransfer = latestRecord(selectedTransfers);
  const latestIdCard = latestRecord(selectedIdCards);
  const selectedDocumentLabels = selectedDocuments.length
    ? selectedDocuments.map((item) => item.documentType || item.fileName || 'Student Document')
    : selectedStudent.documents || [];

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;
    return students.filter((student) =>
      [student.name, student.studentId, student.admissionNo, student.className, student.program]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [search, students]);

  const stats = [
    { label: 'Admissions', value: admissions.length || students.length, icon: <Users size={22} /> },
    { label: 'Profiles Completed', value: students.filter((s) => s.email && s.guardianName).length, icon: <UserRound size={22} /> },
    { label: 'Documents Stored', value: studentDocuments.length || students.reduce((sum, s) => sum + (s.documents?.length || 0), 0), icon: <FileText size={22} /> },
    { label: 'Generated IDs', value: idCards.length || students.filter((s) => s.studentId).length, icon: <IdCard size={22} /> },
  ];

  const saveStudent = async (form) => {
    const nextNumber = String(4450 + students.length).padStart(5, '0');
    const createdAtText = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const payload = {
      ...form,
      admissionNo: `ADM-2026-${nextNumber}`,
      studentId: `STU-${nextNumber}`,
      institute: 'COLLEGE NAME',
      status: 'Admission Review',
      createdAtText,
    };

    try {
      const id = await createStudent(payload);
      const created = { id: id || `local-${Date.now()}`, ...payload };
      const admission = {
        studentRecordId: created.id,
        studentId: created.studentId,
        admissionNo: created.admissionNo,
        academicYear: '2026-2027',
        status: 'Admission Review',
        submittedAtText: createdAtText,
      };
      const admissionForm = {
        studentRecordId: created.id,
        studentId: created.studentId,
        documentType: 'Admission Form',
        fileName: `${created.admissionNo}-admission-form.pdf`,
        verificationStatus: 'Pending Review',
        uploadedAtText: createdAtText,
      };
      const idCard = {
        studentRecordId: created.id,
        studentId: created.studentId,
        cardNumber: created.studentId,
        issuedAtText: createdAtText,
        validUntil: '31 Mar 2027',
        status: 'Ready',
      };

      if (id) {
        const [admissionId, documentId, idCardId] = await Promise.all([
          createStudentAdmission(admission),
          createStudentDocument(admissionForm),
          createStudentIdCard(idCard),
        ]);
        setAdmissions((prev) => [{ id: admissionId, ...admission }, ...prev]);
        setStudentDocuments((prev) => [{ id: documentId, ...admissionForm }, ...prev]);
        setIdCards((prev) => [{ id: idCardId, ...idCard }, ...prev]);
      } else {
        setAdmissions((prev) => [{ id: `local-admission-${Date.now()}`, ...admission }, ...prev]);
        setStudentDocuments((prev) => [{ id: `local-document-${Date.now()}`, ...admissionForm }, ...prev]);
        setIdCards((prev) => [{ id: `local-card-${Date.now()}`, ...idCard }, ...prev]);
      }

      setStudents((prev) => [created, ...prev]);
      setSelectedId(created.id);
      toast.success(id ? 'Student admission saved' : 'Student added locally. Add Firebase keys to persist.');
    } catch {
      const local = { id: `local-${Date.now()}`, ...payload };
      const admission = {
        id: `local-admission-${Date.now()}`,
        studentRecordId: local.id,
        studentId: local.studentId,
        admissionNo: local.admissionNo,
        academicYear: '2026-2027',
        status: 'Admission Review',
        submittedAtText: createdAtText,
      };
      const admissionForm = {
        id: `local-document-${Date.now()}`,
        studentRecordId: local.id,
        studentId: local.studentId,
        documentType: 'Admission Form',
        fileName: `${local.admissionNo}-admission-form.pdf`,
        verificationStatus: 'Pending Review',
        uploadedAtText: createdAtText,
      };
      const idCard = {
        id: `local-card-${Date.now()}`,
        studentRecordId: local.id,
        studentId: local.studentId,
        cardNumber: local.studentId,
        issuedAtText: createdAtText,
        validUntil: '31 Mar 2027',
        status: 'Ready',
      };

      setStudents((prev) => [local, ...prev]);
      setAdmissions((prev) => [admission, ...prev]);
      setStudentDocuments((prev) => [admissionForm, ...prev]);
      setIdCards((prev) => [idCard, ...prev]);
      setSelectedId(local.id);
      toast.success('Student added locally. Check Firebase setup to persist it.');
    } finally {
      setShowModal(false);
    }
  };

  const markDocumentUploaded = async () => {
    const uploadedAtText = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const payload = {
      studentRecordId: selectedStudent.id,
      studentId: selectedStudent.studentId,
      documentType: 'Uploaded Document',
      fileName: `${selectedStudent.studentId}-uploaded-document.pdf`,
      verificationStatus: 'Pending Review',
      uploadedAtText,
    };
    const id = await createStudentDocument(payload);
    setStudentDocuments((prev) => [{ id: id || `local-document-${Date.now()}`, ...payload }, ...prev]);
    toast.success('Document repository updated');
  };

  const promoteStudent = async () => {
    const fromClass = selectedStudent.className;
    const toClass = selectedStudent.className.replace('XI', 'XII');
    const actionDateText = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const updates = { className: toClass };
    const promotion = {
      studentRecordId: selectedStudent.id,
      studentId: selectedStudent.studentId,
      fromClass,
      toClass,
      academicYear: '2026-2027',
      status: 'Promoted',
      approvedBy: 'Academic Office',
      approvedAtText: actionDateText,
    };
    const transfer = {
      studentRecordId: selectedStudent.id,
      studentId: selectedStudent.studentId,
      transferType: 'Internal Class Transfer',
      reason: `Promoted from ${fromClass} to ${toClass}`,
      status: 'Not Requested',
      requestedAtText: actionDateText,
      certificateUrl: '',
    };

    setStudents((prev) => prev.map((student) => student.id === selectedStudent.id ? { ...student, ...updates } : student));
    const [promotionId, transferId] = await Promise.all([
      createStudentPromotion(promotion),
      createStudentTransfer(transfer),
      updateStudent(selectedStudent.id, updates),
    ]);
    setPromotions((prev) => [{ id: promotionId || `local-promotion-${Date.now()}`, ...promotion }, ...prev]);
    setTransfers((prev) => [{ id: transferId || `local-transfer-${Date.now()}`, ...transfer }, ...prev]);
    toast.success('Promotion status updated');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
        <div className="flex min-h-screen">
          <Sidebar activePage={activePage} onNavigate={setActivePage} />
          <main className="flex-1 min-w-0 bg-[#f0f1f3] flex flex-col">
            <TopHeader user={user} onLogout={onLogout} />

            <div className="flex-1 p-4 lg:p-5">
              <section className="bg-white min-h-full p-5 lg:p-7">
                {activePage === 'dashboard' ? (
                <>
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="text-sm font-bold text-slate-500 mb-2">Academics / <span className="text-[#f39a5f]">Student Information Management</span></div>
                    <h1 className="text-2xl font-bold text-slate-900">Student Information Management</h1>
                    <p className="text-sm text-slate-500 mt-1">Admissions, profiles, documents, ID generation, promotion and transfer management.</p>
                    {!isFirebaseConfigured && <p className="text-xs text-orange-600 mt-2">Demo mode: add Firebase keys to persist records.</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActivePage('reports')}
                      className="h-10 px-5 rounded-lg bg-[#33373e] text-white font-semibold text-sm flex items-center gap-2"
                    >
                      <Eye size={16} /> View Report
                    </button>
                    <button onClick={() => setShowModal(true)} className="h-10 px-5 rounded-full bg-[#fb9a5b] text-white font-semibold text-sm flex items-center gap-2">
                      <Plus size={16} /> New Admission
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 py-5">
                  {stats.map(({ label, value, icon }) => (
                    <div key={label} className="bg-[#f5f5f6] rounded-lg p-4 flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center text-[#34363d] shadow-sm">
                        {icon}
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">{label}</div>
                        <div className="text-xl font-bold text-slate-900">{loading ? '...' : value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col xl:flex-row gap-5">
                  <div className="xl:w-[70%] min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      {tabs.map(({ id, label, icon }) => (
                        <button
                          key={id}
                          onClick={() => setActiveTab(id)}
                          className={`h-10 px-4 rounded-md border text-sm flex items-center gap-2 ${
                            activeTab === id
                              ? 'bg-[#33373e] text-white border-[#33373e]'
                              : 'bg-white text-slate-600 border-slate-200'
                          }`}
                        >
                          {icon} {label}
                        </button>
                      ))}
                    </div>

                    <div className="relative mb-4">
                      <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by student name, ID, admission no, class..."
                        className="w-full h-11 rounded-lg bg-[#f0f0f2] border-0 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-100"
                      />
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-separate border-spacing-y-2">
                        <thead>
                          <tr className="bg-[#e7e7e9] text-left text-slate-900">
                            <th className="px-5 py-3 rounded-l-lg">Student</th>
                            <th className="px-5 py-3">Admission / ID</th>
                            <th className="px-5 py-3">Class</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3 rounded-r-lg text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((student) => (
                            <tr key={student.id} className="bg-white shadow-[0_0_0_1px_rgba(226,232,240,0.9)] rounded-lg">
                              <td className="px-5 py-4 rounded-l-lg">
                                <button onClick={() => setSelectedId(student.id)} className="flex items-center gap-3 text-left">
                                  <span className="h-10 w-10 rounded-full bg-[#30343c] text-emerald-300 flex items-center justify-center">
                                    <UserRound size={20} />
                                  </span>
                                  <span>
                                    <span className="block font-bold text-slate-900">{student.name}</span>
                                    <span className="block text-xs text-slate-500">{student.guardianName}</span>
                                  </span>
                                </button>
                              </td>
                              <td className="px-5 py-4">
                                <div className="font-semibold">{student.admissionNo}</div>
                                <div className="text-xs text-slate-500">{student.studentId}</div>
                              </td>
                              <td className="px-5 py-4">
                                <div>{student.className} - {student.section}</div>
                                <div className="text-xs text-slate-500">{student.program}</div>
                              </td>
                              <td className="px-5 py-4"><StatusBadge value={student.status} /></td>
                              <td className="px-5 py-4 rounded-r-lg">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => setSelectedId(student.id)} className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center">
                                    <Eye size={15} />
                                  </button>
                          <button
                            onClick={() => toast.success(`${student.name} record downloaded`)}
                            className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center"
                          >
                            <Download size={15} />
                          </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <aside className="xl:w-[30%]">
                    <div className="bg-[#f0f0f2] rounded-lg p-4 mb-5">
                      <div className="bg-white rounded-lg p-5">
                        <div className="flex items-center justify-between mb-5">
                          <h2 className="font-bold text-slate-900">Student Profile</h2>
                          <StatusBadge value={selectedStudent.status} />
                        </div>
                        <div className="flex items-center gap-4 mb-5">
                          <div className="h-20 w-20 rounded-full bg-[#30343c] text-emerald-300 flex items-center justify-center">
                            <UserRound size={38} />
                          </div>
                          <div>
                            <div className="text-lg font-bold">{selectedStudent.name}</div>
                            <div className="text-sm text-slate-500">{selectedStudent.className} - {selectedStudent.section}</div>
                            <div className="text-xs text-slate-500">{selectedStudent.program}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-xs text-slate-500">Admission No</div>
                            <div className="font-semibold">{selectedStudent.admissionNo}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Student ID</div>
                            <div className="font-semibold">{selectedStudent.studentId}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-xs text-slate-500">Guardian</div>
                            <div className="font-semibold">{selectedStudent.guardianName}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-xs text-slate-500">Contact</div>
                            <div className="font-semibold">{selectedStudent.phone}</div>
                            <div className="text-slate-500">{selectedStudent.email}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-sm">
                      <h3 className="font-bold mb-4">
                        {activeTab === 'documents' ? 'Document Repository' : activeTab === 'ids' ? 'ID Generation' : activeTab === 'promotion' ? 'Promotion & Transfer' : 'Module Actions'}
                      </h3>
                      {activeTab === 'documents' && (
                        <div className="space-y-3">
                          {selectedDocumentLabels.map((item) => (
                            <div key={item} className="h-11 rounded-lg bg-[#f5f5f6] px-3 flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2"><FileText size={16} /> {item}</span>
                              <StatusBadge value="Active" />
                            </div>
                          ))}
                          <button onClick={markDocumentUploaded} className="w-full h-10 rounded-full bg-[#fb9a5b] text-white font-semibold text-sm flex items-center justify-center gap-2">
                            <Upload size={16} /> Upload Document
                          </button>
                        </div>
                      )}
                      {activeTab === 'ids' && (
                        <div className="space-y-4">
                          <div className="rounded-lg bg-[#33373e] text-white p-4">
                            <div className="text-xs opacity-70">Generated Student ID</div>
                            <div className="text-2xl font-bold mt-1">{latestIdCard?.cardNumber || selectedStudent.studentId}</div>
                            <div className="text-xs opacity-70 mt-3">
                              {selectedStudent.name} | {selectedStudent.className} | Valid until {latestIdCard?.validUntil || '31 Mar 2027'}
                            </div>
                          </div>
                          <button
                            onClick={() => toast.success('ID card downloaded')}
                            className="w-full h-10 rounded-full bg-[#33373e] text-white font-semibold text-sm flex items-center justify-center gap-2"
                          >
                            <Download size={16} /> Download ID Card
                          </button>
                        </div>
                      )}
                      {activeTab === 'promotion' && (
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between h-11 rounded-lg bg-[#f5f5f6] px-3">
                            <span>Promotion Status</span>
                            <StatusBadge value={latestPromotion?.status || selectedStudent.promotionStatus || 'Pending Review'} />
                          </div>
                          <div className="flex items-center justify-between h-11 rounded-lg bg-[#f5f5f6] px-3">
                            <span>Transfer Status</span>
                            <StatusBadge value={latestTransfer?.status || selectedStudent.transferStatus || 'Not Requested'} />
                          </div>
                          <button onClick={promoteStudent} className="w-full h-10 rounded-full bg-[#fb9a5b] text-white font-semibold">
                            Promote / Update Transfer
                          </button>
                        </div>
                      )}
                      {!['documents', 'ids', 'promotion'].includes(activeTab) && (
                        <div className="space-y-3 text-sm text-slate-600">
                          <div className="rounded-lg bg-[#f5f5f6] p-3">
                            Admission status: {latestAdmission?.status || selectedStudent.status}. Created on {selectedStudent.createdAtText || latestAdmission?.submittedAtText || 'today'}.
                          </div>
                          <div className="rounded-lg bg-[#f5f5f6] p-3">Profile management keeps guardian, class, contact, and academic details together.</div>
                          <button onClick={() => setShowModal(true)} className="w-full h-10 rounded-full bg-[#fb9a5b] text-white font-semibold">Create Another Admission</button>
                        </div>
                      )}
                    </div>
                  </aside>
                </div>
                </>
                ) : (
                  <DemoModulePage page={activePage} onOpenStudents={() => setActivePage('dashboard')} />
                )}
              </section>
            </div>

            <footer className="h-14 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-xs text-slate-500">
              <span>Copyright © 2026 Devloft Technologies | College ERP</span>
              <div className="hidden sm:flex gap-2">
                {['f', 'x', 'in', 'ig', 'yt'].map((item) => (
                  <span key={item} className="h-7 min-w-7 px-2 rounded-md bg-[#34363d] text-white flex items-center justify-center font-bold">
                    {item}
                  </span>
                ))}
              </div>
            </footer>
          </main>
        </div>
      {showModal && <StudentModal onClose={() => setShowModal(false)} onSave={saveStudent} />}
    </div>
  );
}

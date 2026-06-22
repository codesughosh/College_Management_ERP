import { AlertCircle, Bell, CalendarDays, FileText, GraduationCap, Search, TrendingUp, Users, Wallet } from 'lucide-react';
import { demoStudents } from '../students/demoStudents';
import { demoStaffMembers } from '../facultyStaff/demoFacultyStaff';
import { demoStudentAttendance, demoAttendanceNotifications } from '../attendance/demoAttendance';
import { demoFeeAssignments, demoFeeCollections } from '../fees/demoFees';
import { demoManagedDocuments } from '../documents/demoDocuments';
import { demoExamSchedules } from '../exams/demoExams';
import { formatCurrency } from '../fees/feeUtils';

function DashboardCard({ icon, label, value, helper, onClick }) {
  return (
    <button
      onClick={onClick}
      className="erp-dashboard-card min-h-28 rounded-lg border border-slate-100 bg-white p-4 text-left flex items-center gap-4 shadow-sm"
    >
      <span className="h-13 w-13 rounded-lg bg-[#f5f5f6] text-[#fb8d49] flex items-center justify-center shrink-0">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold text-slate-500">{label}</span>
        <span className="block text-2xl font-extrabold text-slate-900 mt-1">{value}</span>
        <span className="block text-xs text-slate-500 mt-1">{helper}</span>
      </span>
    </button>
  );
}

export default function DashboardManagement({ academicYear = '2026-2027', onNavigate }) {
  const activeStudents = demoStudents.filter((student) => student.status !== 'Archived');
  const facultyCount = demoStaffMembers.filter((member) => member.staffType === 'Faculty' && member.status !== 'Archived').length;
  const presentAttendance = demoStudentAttendance.filter((record) => record.status === 'Present').length;
  const attendancePercent = demoStudentAttendance.length
    ? Math.round((presentAttendance / demoStudentAttendance.length) * 100)
    : 0;
  const collectedAmount = demoFeeCollections.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const dueCount = demoFeeAssignments.filter((item) => Number(item.dueAmount || 0) > 0).length;
  const pendingDocuments = demoManagedDocuments.filter((item) => item.verificationStatus === 'Pending Review');
  const upcomingExams = demoExamSchedules.filter((item) => item.status !== 'Archived');
  const collectionMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const collectionValues = [18, 24, 16, 28, 22, 40];

  const quickActions = [
    { label: 'Add student', helper: 'Open admissions', icon: <GraduationCap size={18} />, page: 'students' },
    { label: 'Mark attendance', helper: 'Students or faculty', icon: <Bell size={18} />, page: 'attendance' },
    { label: 'Collect payment', helper: 'Search dues', icon: <Wallet size={18} />, page: 'fees' },
    { label: 'Upload document', helper: 'Repository', icon: <FileText size={18} />, page: 'document-management' },
  ];

  return (
    <div className="erp-dashboard">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Today&apos;s college overview for {academicYear}.</p>
        </div>
        <div className="relative w-full xl:w-[420px]">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search students, faculty, documents, receipts..."
            className="w-full h-11 rounded-lg bg-[#f0f0f2] border-0 pl-10 pr-4 text-sm outline-none"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4 py-5">
        <DashboardCard icon={<Users size={22} />} label="Students" value={activeStudents.length} helper="Active records" onClick={() => onNavigate?.('students')} />
        <DashboardCard icon={<GraduationCap size={22} />} label="Faculty" value={facultyCount} helper="Teaching staff" onClick={() => onNavigate?.('faculty-staff')} />
        <DashboardCard icon={<Bell size={22} />} label="Attendance" value={`${attendancePercent}%`} helper="Marked today" onClick={() => onNavigate?.('attendance')} />
        <DashboardCard icon={<Wallet size={22} />} label="Collection" value={formatCurrency(collectedAmount)} helper={`${dueCount} due students`} onClick={() => onNavigate?.('fees')} />
        <DashboardCard icon={<FileText size={22} />} label="Documents" value={pendingDocuments.length} helper="Pending review" onClick={() => onNavigate?.('document-management')} />
      </div>

      <div className="grid xl:grid-cols-[1.5fr_.9fr] gap-5">
        <section className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="font-bold text-slate-900">Payment Trend</h2>
              <p className="text-xs text-slate-500 mt-1">Simple monthly collection view.</p>
            </div>
            <span className="rounded-full bg-[#f5f5f6] px-3 py-1 text-xs font-semibold text-slate-600">2026</span>
          </div>
          <div className="h-64 flex items-end gap-4">
            {collectionMonths.map((month, index) => (
              <div key={month} className="flex-1 h-full flex flex-col justify-end gap-2">
                <div className="rounded-t-lg bg-[#34363d] min-h-6" style={{ height: `${collectionValues[index] * 2.2}%` }} />
                <div className="rounded-t-lg bg-[#fb9a5b] min-h-6" style={{ height: `${Math.max(collectionValues[index] - 8, 8) * 1.7}%` }} />
                <span className="text-[11px] text-center text-slate-500">{month}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-5">
            <h2 className="font-bold text-slate-900">Pending Work</h2>
            <AlertCircle size={18} className="text-[#fb8d49]" />
          </div>
          <div className="space-y-3">
            <button onClick={() => onNavigate?.('document-management')} className="w-full rounded-lg bg-[#f5f5f6] p-4 text-left">
              <span className="block font-bold text-sm text-slate-900">{pendingDocuments.length} documents need review</span>
              <span className="block text-xs text-slate-500 mt-1">Open verification queue</span>
            </button>
            <button onClick={() => onNavigate?.('attendance')} className="w-full rounded-lg bg-[#f5f5f6] p-4 text-left">
              <span className="block font-bold text-sm text-slate-900">{demoAttendanceNotifications.length} parent notifications queued</span>
              <span className="block text-xs text-slate-500 mt-1">Review absent student alerts</span>
            </button>
            <button onClick={() => onNavigate?.('examination-results')} className="w-full rounded-lg bg-[#f5f5f6] p-4 text-left">
              <span className="block font-bold text-sm text-slate-900">{upcomingExams.length} upcoming exams</span>
              <span className="block text-xs text-slate-500 mt-1">View exam schedule</span>
            </button>
          </div>
        </section>
      </div>

      <div className="grid xl:grid-cols-[.9fr_1.1fr] gap-5 mt-5">
        <section className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4">Attendance Snapshot</h2>
          <div className="flex items-center gap-6">
            <div className="h-32 w-32 rounded-full border-[14px] border-[#fb9a5b] flex items-center justify-center">
              <span className="text-2xl font-extrabold">{attendancePercent}%</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-[#f5f5f6] px-4 py-3">Students present: {presentAttendance}</div>
              <div className="rounded-lg bg-[#f5f5f6] px-4 py-3">Records marked: {demoStudentAttendance.length}</div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="font-bold text-slate-900">Quick Actions</h2>
            <CalendarDays size={18} className="text-slate-400" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button key={action.label} onClick={() => onNavigate?.(action.page)} className="rounded-lg bg-[#f5f5f6] p-4 text-left flex items-center gap-3">
                <span className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-[#fb8d49]">{action.icon}</span>
                <span>
                  <span className="block text-sm font-bold text-slate-900">{action.label}</span>
                  <span className="block text-xs text-slate-500 mt-1">{action.helper}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm mt-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="font-bold text-slate-900">Upcoming Exams</h2>
          <TrendingUp size={18} className="text-slate-400" />
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {upcomingExams.map((exam) => (
            <button key={exam.id} onClick={() => onNavigate?.('examination-results')} className="rounded-lg bg-[#f5f5f6] p-4 text-left">
              <span className="block text-sm font-bold text-slate-900">{exam.examName}</span>
              <span className="block text-xs text-slate-500 mt-1">{exam.classKey} - {exam.subject}</span>
              <span className="block text-xs font-semibold text-[#fb8d49] mt-3">{exam.examDate}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

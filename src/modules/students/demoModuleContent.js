export const demoModuleContent = {
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
  'faculty-staff': {
    title: 'Faculty & Staff Management',
    subtitle: 'Faculty records, staff records, departments, leave, and staff attendance.',
    actions: ['Add Faculty', 'Add Staff', 'Allocate Department'],
    rows: [
      ['Faculty Records', 'Teacher profiles and academic responsibilities', 'Draft'],
      ['Staff Records', 'Administrative and support staff profiles', 'Draft'],
      ['Leave Management', 'Leave requests and approvals', 'Draft'],
    ],
  },
  attendance: {
    title: 'Attendance Management',
    subtitle: 'Student and faculty attendance tracking with summaries available in Reports.',
    actions: ['Mark Attendance', 'Open Reports', 'Notify Parents'],
    rows: [
      ['Student Attendance', 'Class-wise attendance tracking', 'Draft'],
      ['Faculty Attendance', 'Faculty check-in and absence tracking', 'Draft'],
      ['Attendance Summaries', 'Daily, monthly, and yearly views in Reports', 'Ready'],
    ],
  },
  timetable: {
    title: 'Timetable Management',
    subtitle: 'Class timetables, faculty timetables, classroom allocation, and publishing.',
    actions: ['Create Timetable', 'Assign Classroom', 'Publish Timetable'],
    rows: [
      ['Class Timetable', 'Class and section schedule builder', 'Draft'],
      ['Faculty Timetable', 'Faculty-wise teaching schedule', 'Draft'],
      ['Classroom Allocation', 'Room availability and allocation', 'Draft'],
    ],
  },
  'examination-results': {
    title: 'Examination & Result Management',
    subtitle: 'Exam scheduling, assessment, marks entry, grades, results, and report cards.',
    actions: ['Schedule Exam', 'Enter Marks', 'Generate Result'],
    rows: [
      ['Examination Scheduling', 'Exam plans and subject schedules', 'Draft'],
      ['Marks Entry', 'Internal and final marks entry', 'Draft'],
      ['Report Cards', 'Student result and report card generation', 'Draft'],
    ],
  },
  'user-roles': {
    title: 'User & Role Management',
    subtitle: 'Role-based access control, user permissions, and multi-level administration.',
    actions: ['Create Role', 'Invite User', 'Assign Permission'],
    rows: [
      ['Admin', 'Full ERP access', 'Draft'],
      ['Faculty', 'Academic and attendance access', 'Draft'],
      ['Parent', 'Portal access only', 'Draft'],
    ],
  },
  communication: {
    title: 'Communication',
    subtitle: 'Announcements, circulars, and event communication.',
    actions: ['Create Announcement', 'Publish Circular', 'Announce Event'],
    rows: [
      ['Digital Notices', 'Institute-wide notice publishing', 'Draft'],
      ['Circular Management', 'Circular creation and tracking', 'Draft'],
      ['Event Announcements', 'Academic and campus event posts', 'Draft'],
    ],
  },
  'document-management': {
    title: 'Document Management',
    subtitle: 'Student documents, staff documents, and academic records archive.',
    actions: ['Upload Document', 'Create Archive', 'Review Records'],
    rows: [
      ['Student Documents', 'Student files and certificates', 'Draft'],
      ['Staff Documents', 'Employment and verification files', 'Draft'],
      ['Academic Records', 'Archived academic records', 'Draft'],
    ],
  },
  fees: {
    title: 'Fees Management',
    subtitle: 'Fee structure setup, manual fee collection records, and due tracking.',
    actions: ['Create Fee Structure', 'Record Collection', 'View Dues'],
    rows: [
      ['Fee Structure', 'Class and program-wise fee setup', 'Draft'],
      ['Manual Collection', 'Offline payment record keeping', 'Draft'],
      ['Due Tracking', 'Outstanding fee monitoring', 'Draft'],
    ],
  },
  'parent-portal': {
    title: 'Parent Portal',
    subtitle: 'Parent access for attendance, academic performance, fee status, and communication view.',
    actions: ['View Attendance', 'View Performance', 'View Fee Status'],
    rows: [
      ['Attendance Monitoring', 'Student attendance visibility', 'Draft'],
      ['Performance Tracking', 'Assessment and result visibility', 'Draft'],
      ['Fee Status', 'Due and collection status visibility', 'Draft'],
    ],
  },
  reports: {
    title: 'Reports',
    subtitle: 'Category-wise reports for students, attendance, documents, exams, and financials.',
    actions: ['Student Reports', 'Attendance Reports', 'Financial Reports'],
    rows: [
      ['Student Reports', 'Admissions, approvals, and documents', 'Ready'],
      ['Attendance Reports', 'Daily, monthly, and yearly summaries', 'Ready'],
      ['Financial Reports', 'Collections, outstanding dues, and analytics', 'Ready'],
    ],
  },
  payments: {
    title: 'Payments',
    subtitle: 'Fee status, receipts, outstanding balances, and transaction activity.',
    actions: ['Record Payment', 'View Receipts', 'Download Ledger'],
    rows: [
      ['Quarter 1 Fee', 'INR 29,999.00', 'Paid'],
      ['Admission Fee', 'INR 12,000.00', 'Pending'],
      ['Transport Fee', 'INR 8,500.00', 'Scheduled'],
    ],
  },
  settings: {
    title: 'Settings',
    subtitle: 'Institute profile, academic year, modules, and student ID configuration.',
    actions: ['Save Institute', 'Configure IDs', 'Manage Roles'],
    rows: [
      ['Institute', 'Maurya Institute of Allied Health Sciences', 'Active'],
      ['Academic Year', '2026-2027', 'Active'],
      ['Student ID Format', 'STU-{number}', 'Active'],
    ],
  },
  calendar: {
    title: 'Curriculum',
    subtitle: 'Curriculum view for classes, tests, holidays, admissions, and academic events.',
    actions: ['Add Event', 'Publish Curriculum', 'Download Curriculum'],
    rows: [
      ['Orientation Day', '01 Jun 2026', 'Published'],
      ['Internal Test - Physics', '13 Jun 2026', 'Active'],
      ['Holiday - Festival', '21 Jun 2026', 'Published'],
      ['Promotion Review', '28 Jun 2026', 'Draft'],
    ],
  },
};

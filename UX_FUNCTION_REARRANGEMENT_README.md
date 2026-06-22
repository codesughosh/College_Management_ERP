# ERP Function Rearrangement And Minimal UX Plan

## Goal

Keep every current ERP function, but place each one where a non-technical college user expects to find it. The sidebar should feel simple, and deeper actions should appear only after the user chooses a module, then a task, then a record when needed.

Primary visible modules:

1. Dashboard
2. Students
3. Faculty
4. Attendance
5. Exams
6. Timetable
7. Payment
8. Documents
9. Financial Report

Admin-only support areas such as Settings, Users & Roles, Notice Board, Parent Portal, Curriculum, Programs, Subjects, Batches, ID formats, and academic year setup should not compete with daily modules in the main sidebar. They should be nested where they naturally belong or shown under an admin Settings area.

## UX Pattern For The Whole App

Use the same interaction pattern everywhere:

1. Module landing page
   - Show 3 to 6 large task cards only.
   - Keep cards action-oriented, for example "Student List", "New Admission", "Fee Collection", "Exam Results".
   - Do not show tables, forms, reports, and action buttons all together.

2. Task page
   - Show only the selected task.
   - If it needs a list, show the list first.
   - If it needs a form, show the form first.
   - If it needs approval, show approval queue first.

3. Record detail page
   - Open detail only after a user clicks a record.
   - Use a strong header area with the person's name, ID, class/department, photo/avatar, and status.
   - Put detail sections in simple tabs or segmented controls.
   - Show edit buttons only inside the relevant detail page.

4. Navigation
   - Every nested page needs a Back button.
   - Browser back should move one level up in the flow.
   - Avoid hidden dead ends.

5. Visual behavior
   - Use subtle animation when entering a task or opening a record detail.
   - Animate detail panels with fade and slide.
   - Animate dashboard cards lightly on load.
   - Avoid heavy motion that slows daily work.

6. Information density
   - One page should answer one question.
   - Lists should show only enough columns to identify a record.
   - Full information belongs in the detail page.
   - Advanced actions belong in nested pages, not row action clutter.

## Dashboard Direction

Take inspiration from the provided school dashboard reference, but adapt it for this ERP.

Dashboard should show:

- Top search across students, faculty, documents, receipts, and exams.
- KPI cards:
  - Total students
  - Faculty count
  - Attendance today
  - Fee collection this month
  - Pending documents
  - Upcoming exams
- Main visual cards:
  - Collection trend chart
  - Attendance snapshot
  - Upcoming events and exam calendar
  - Top alerts or pending approvals
  - Quick actions
- Quick actions:
  - Add student
  - Mark attendance
  - Collect payment
  - Upload document
  - Publish notice
- Keep dashboard read-only by default.
- Only use quick actions for common work, not every possible function.

Dashboard should not become a settings or data entry page. It is a command center.

## Student Detail Direction

Take inspiration from the provided student profile reference.

Students module should work like:

Student List -> Click Student -> Student Detail

Student list should show:

- Student photo/avatar
- Name
- Student ID
- Class and section
- Status

Student information should not be visible until a student is clicked.

Student detail should show:

- Hero header:
  - Student name
  - Class and section
  - Student ID
  - Status
  - Photo/avatar
- Basic details card:
  - Guardian
  - Contact
  - Address
  - Admission number
  - ID holder
  - Program
- Detail tabs:
  - Profile
  - Attendance
  - Exams
  - Payment
  - Documents
  - Notes

Important: documents, attendance, exams, and payments can be visible as read-only summaries inside student detail, but the main actions should live in their own modules.

Examples:

- View document summary in Student Detail.
- Upload and verify documents in Documents.
- View payment summary in Student Detail.
- Collect payment in Payment.
- View attendance summary in Student Detail.
- Mark attendance in Attendance.

## Final Function Placement

### 1. Dashboard

Purpose: daily overview and fast navigation.

Keep here:

- Overall KPIs.
- Today attendance summary.
- Monthly fee collection summary.
- Pending document count.
- Upcoming exams.
- Notices/events preview.
- Quick links to common tasks.
- Global search.

Move out of Dashboard:

- Full student management.
- Full fee collection tables.
- Full attendance marking.
- Settings forms.
- Detailed reports.

Nested dashboard flow:

Dashboard -> KPI Card -> Related Module Filter

Examples:

- Click "Pending Documents" -> Documents -> Pending Review.
- Click "Fee Due" -> Payment -> Due Students.
- Click "Upcoming Exams" -> Exams -> Exam Schedule.

### 2. Students

Purpose: student identity and profile management.

Keep here:

- Student list.
- Student profile view.
- Add new admission.
- Edit student profile.
- Archive and restore student record.
- Admission details.
- Student ID and admission number display.
- Read-only summaries of attendance, exams, payment, and documents.

Move out:

- Document upload, verification, rejection -> Documents.
- Promotion and class movement setup -> Settings or Academic Setup.
- Fee collection -> Payment.
- Attendance marking -> Attendance.
- Marks entry -> Exams.

Recommended student flow:

Students -> Student List -> Student Detail

Students -> New Admission -> Admission Form -> Save -> Student Detail

Students -> Archived Students -> Student Detail -> Restore

Student detail tabs:

- Profile
- Admission
- Attendance Summary
- Exam Summary
- Payment Summary
- Document Summary

### 3. Faculty

Purpose: faculty and staff records.

Keep here:

- Faculty list.
- Staff list.
- Faculty/staff profile view.
- Add faculty/staff.
- Edit faculty/staff.
- Archive and restore faculty/staff.
- Leave request view.
- Leave approval summary.
- Department display.
- Read-only attendance summary.

Move out:

- Department creation and editing -> Settings.
- Staff attendance marking -> Attendance.
- Faculty document upload -> Documents.
- Role assignment -> Settings or Users & Roles.

Recommended faculty flow:

Faculty -> Faculty List -> Faculty Detail

Faculty -> Staff List -> Staff Detail

Faculty -> Leave Requests -> Request Detail -> Approve or Reject

Faculty detail tabs:

- Profile
- Department
- Attendance Summary
- Leave
- Documents

### 4. Attendance

Purpose: all attendance actions and reports.

Keep here:

- Mark student attendance.
- Mark faculty/staff attendance.
- Daily attendance view.
- Monthly attendance report.
- Yearly attendance report.
- Absent student notification queue.
- Attendance filters by class, section, date, and staff type.

Move out:

- Student profile editing -> Students.
- Faculty profile editing -> Faculty.
- Academic year or class setup -> Settings.

Recommended attendance flow:

Attendance -> Choose Type

- Students
- Faculty/Staff
- Reports
- Notifications

Attendance -> Students -> Select Class -> Mark Attendance

Attendance -> Faculty/Staff -> Select Department -> Mark Attendance

Attendance -> Reports -> Choose Daily, Monthly, Yearly -> Filter -> View

### 5. Exams

Purpose: exam scheduling, marks, results, and report cards.

Keep here:

- Exam schedule.
- Exam creation.
- Marks entry.
- Result generation.
- Report cards.
- Result analytics.
- Subject-wise and class-wise result views.

Move out:

- Subject creation -> Settings.
- Batch/class creation -> Settings.
- Student profile changes -> Students.
- Exam document upload -> Documents.

Recommended exams flow:

Exams -> Exam Schedule -> Create or Edit Exam

Exams -> Marks Entry -> Select Exam -> Select Class -> Enter Marks

Exams -> Results -> Select Exam -> Generate Result -> Publish

Exams -> Report Cards -> Select Class -> Download or Print

### 6. Timetable

Purpose: class and faculty timetable planning.

Keep here:

- Timetable grid.
- Add timetable entry.
- Edit timetable entry.
- Archive timetable entry.
- Publish timetable.
- Conflict checks.
- Class timetable view.
- Faculty timetable view.

Move out:

- Classroom setup -> Settings.
- Subject setup -> Settings.
- Faculty profile setup -> Faculty.
- Batch setup -> Settings.

Recommended timetable flow:

Timetable -> Choose View

- Class Timetable
- Faculty Timetable
- Create/Edit Timetable
- Publish Timetable

Timetable -> Create/Edit -> Select Class -> Add Period -> Save

### 7. Payment

Purpose: fee setup, fee assignment, payment collection, and receipts.

Rename current Fees module to Payment in the sidebar for client clarity.

Keep here:

- Fee structure view.
- Fee assignment to students.
- Payment collection.
- Receipt generation.
- Discounts and adjustments.
- Due students.
- Payment history.
- Student-wise fee status.

Move out:

- Financial summaries and analytics -> Financial Report.
- Student profile editing -> Students.
- ID format for receipts -> Settings.

Recommended payment flow:

Payment -> Collect Payment -> Search Student -> Select Due -> Pay -> Receipt

Payment -> Due Students -> Filter Class -> Student Fee Detail

Payment -> Fee Setup -> Fee Structure -> Assign To Class

Payment -> Adjustments -> Select Student -> Add Discount/Fine/Waiver

### 8. Documents

Purpose: all document storage, verification, and retrieval.

Keep here:

- Upload student documents.
- Upload faculty/staff documents.
- Upload institute documents.
- Document preview.
- Document verification.
- Document rejection.
- Document archive.
- Owner filters.
- Category filters.
- Status filters.

Move out:

- Student profile editing -> Students.
- Faculty profile editing -> Faculty.
- Payment receipt generation -> Payment.
- Financial report generation -> Financial Report.

Recommended documents flow:

Documents -> Upload Document -> Choose Owner Type -> Select Owner -> Upload

Documents -> Verification Queue -> Document Detail -> Verify or Reject

Documents -> Repository -> Filter -> Preview

Documents -> Archive -> Restore or View

### 9. Financial Report

Purpose: finance analytics and exports.

Keep here:

- Collection reports.
- Outstanding reports.
- Class-wise fee analytics.
- Payment mode summaries.
- Adjustment summaries.
- Revenue trend charts.
- Export CSV/PDF.
- Print reports.

Move out:

- Payment collection -> Payment.
- Fee setup -> Payment.
- Student record editing -> Students.

Recommended financial report flow:

Financial Report -> Choose Report

- Collection Report
- Outstanding Report
- Class Analytics
- Payment Mode Summary
- Adjustment Report

Financial Report -> Report Type -> Filters -> View -> Export

## Settings And Admin Placement

Settings should be admin-only and should hold setup work that normal daily users should not see.

Keep in Settings:

- Institute profile.
- Academic year setup.
- Programs.
- Subjects.
- Batches.
- Sections.
- Departments.
- Classrooms.
- ID formats.
- Receipt format.
- Module defaults.
- User and role management.
- Permission setup.

Settings nested flow:

Settings -> Institute Setup

Settings -> Academic Setup

- Academic Year
- Programs
- Subjects
- Batches
- Sections

Settings -> People Setup

- Departments
- Designations
- User Roles
- Permissions

Settings -> System Setup

- ID Formats
- Receipt Formats
- Module Defaults

This matches the user's example: creating/editing batches and similar academic setup belongs in Settings, not as a daily Academics page.

## What To Do With Current Extra Modules

### Current Academics module

Move into Settings -> Academic Setup:

- Programs
- Subjects
- Batches
- Calendar event setup if it is academic setup

If the app still needs an Academics area later, it should be a read-only academic overview, not setup-heavy.

### Current Curriculum module

Merge into Timetable or Settings depending on the function:

- Academic calendar setup -> Settings -> Academic Setup.
- Class schedules and working calendar -> Timetable.
- Events visible to everyone -> Dashboard preview and Notice Board publishing.

### Current Notice Board

Do not keep it as a primary sidebar item for this simplified client version.

Place it under:

- Dashboard -> Notices preview.
- Settings/Admin -> Notice Board management.

Optional future module:

- Communication, if SMS/email/app notifications become a major feature.

### Current Parent Portal

Do not show in the admin daily sidebar unless the logged-in user is a parent.

For parents, the parent portal can become their Dashboard:

- Child profile.
- Attendance.
- Exam results.
- Fees.
- Documents.
- Notices.

For admins, parent-related data appears inside Students and Payment as summaries.

### Current Users & Roles

Move into Settings -> People Setup -> Users & Roles.

This should be visible only to super admin/admin users.

## Sidebar Recommendation

Main daily sidebar:

1. Dashboard
2. Students
3. Faculty
4. Attendance
5. Exams
6. Timetable
7. Payment
8. Documents
9. Financial Report

Footer/admin sidebar:

- Settings
- Logout

Role-specific sidebar rules:

- Parent users see Parent Dashboard instead of the admin sidebar.
- Faculty users see only Dashboard, Students read-only if allowed, Attendance, Exams, Timetable, Documents if allowed.
- Finance users see Dashboard, Payment, Documents, Financial Report.
- Admin users see all modules plus Settings.

## Detailed Function Map

| Function | Final Home | Why |
| --- | --- | --- |
| Student list | Students | Core student identity work. |
| Add admission | Students | Starts a student record. |
| Edit student profile | Students | Profile ownership belongs here. |
| Archive/restore student | Students | Record lifecycle belongs here. |
| Student document upload | Documents | All document actions should be centralized. |
| Student document verification | Documents | Verification queue should not be hidden inside Students. |
| Student promotion | Settings -> Academic Setup, or Students -> Admission if kept per-student | It depends on whether promotion is batch setup or individual lifecycle. Prefer batch/class movement under Settings or a later dedicated Academic Year Closing flow. |
| Student attendance mark | Attendance | Daily attendance work. |
| Student attendance summary | Students detail, Attendance reports | Summary can appear in student detail, action stays in Attendance. |
| Faculty/staff list | Faculty | Core faculty/staff identity work. |
| Add/edit faculty/staff | Faculty | Profile ownership belongs here. |
| Departments | Settings | Setup data should not clutter Faculty. |
| Faculty/staff leave | Faculty | Leave belongs to people management. |
| Faculty/staff attendance mark | Attendance | Attendance should be centralized. |
| Programs | Settings -> Academic Setup | Setup function. |
| Subjects | Settings -> Academic Setup | Setup function. |
| Batches/sections | Settings -> Academic Setup | Setup function. |
| Academic calendar setup | Settings -> Academic Setup | Setup function. |
| Public events preview | Dashboard | Quick awareness. |
| Timetable entries | Timetable | Core scheduling work. |
| Timetable publish | Timetable | Core scheduling work. |
| Classroom setup | Settings -> Academic Setup | Setup function. |
| Exam schedule | Exams | Core exam work. |
| Marks entry | Exams | Core exam work. |
| Result generation | Exams | Core exam work. |
| Report cards | Exams | Output of exam work. |
| Fee structure | Payment | Fee setup is directly tied to collection. |
| Fee assignment | Payment | Payment workflow. |
| Collect payment | Payment | Primary finance operation. |
| Receipts | Payment | Generated during collection. |
| Fee adjustments | Payment | Student payment operation. |
| Collection analytics | Financial Report | Reporting, not transaction entry. |
| Outstanding report | Financial Report | Reporting, not transaction entry. |
| Document repository | Documents | Centralized storage. |
| Document archive | Documents | Centralized storage lifecycle. |
| Institute profile | Settings | Admin setup. |
| Academic year | Settings | Admin setup. |
| ID formats | Settings | Admin setup. |
| Users and roles | Settings | Admin setup. |
| Module defaults | Settings | Admin setup. |
| Notices | Dashboard preview, Settings/Admin management | Read on dashboard, manage in admin area. |
| Parent view | Parent-specific dashboard | Different user role experience. |

## Minimal Page Blueprints

### Dashboard Blueprint

Top row:

- Page title
- Global search
- Notification icon
- User menu

KPI row:

- Students
- Faculty
- Attendance
- Fee Collection
- Pending Documents

Main grid:

- Revenue or payment trend
- Attendance circle/chart
- Upcoming exams/events calendar
- Pending work queue
- Top quick actions

### Students Blueprint

Initial state:

- Header
- Search
- Active/Archived filter
- Student list
- No detail panel until click

After selecting a student:

- Student list becomes left panel
- Student hero/detail becomes right panel
- Detail animates in
- Edit button appears inside detail

### Faculty Blueprint

Initial state:

- Choose Faculty, Staff, Leave Requests

After choosing Faculty or Staff:

- List first
- Detail only after click
- Edit button inside detail

### Payment Blueprint

Initial state:

- Collect Payment
- Due Students
- Fee Setup
- Adjustments
- Receipts

Collect Payment flow:

Search Student -> Select Student -> Select Due Items -> Payment Details -> Receipt

### Documents Blueprint

Initial state:

- Upload
- Verification Queue
- Repository
- Archive

Document detail:

- Preview
- Owner info
- Status
- Verify/Reject actions

## Implementation Priority

1. Sidebar simplification
   - Rename Fees to Payment.
   - Hide Academics, Curriculum, Notice Board, Parent Portal, Users & Roles from main daily sidebar.
   - Keep Settings in footer/admin area.

2. Dashboard redesign
   - Build school-dashboard-inspired layout.
   - Add KPI cards and summary charts.
   - Add quick actions that deep-link into modules.

3. Students redesign
   - Keep current list-first behavior.
   - Add richer student detail hero like the reference image.
   - Add tabs for read-only summaries.

4. Faculty redesign
   - Use same list -> detail pattern as Students.
   - Move department setup to Settings.

5. Attendance redesign
   - Split into Students, Faculty/Staff, Reports, Notifications.

6. Payment redesign
   - Rename module.
   - Use guided flow for collection, dues, setup, receipts.

7. Documents redesign
   - Centralize all document upload and verification.

8. Exams and Timetable redesign
   - Keep daily work in the module.
   - Move setup dependencies to Settings.

9. Settings expansion
   - Add Academic Setup, People Setup, System Setup.
   - Move programs, subjects, batches, departments, classrooms, users, roles, and formats here.

## Success Criteria

- A non-technical user can understand each module from its name.
- No page shows every action at once.
- Tables do not show unnecessary action buttons.
- Details appear only after a user selects a record.
- Forms appear only after a user chooses the relevant action.
- Setup functions are separated from daily work.
- Existing permissions still apply.
- Existing data collections can remain the same even if UI placement changes.
- No function is removed, only relocated or nested.


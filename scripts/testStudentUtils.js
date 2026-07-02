import assert from 'node:assert/strict';
import {
  PENDING_ADMISSION_STATUS,
  buildCourseOptionsFromStudents,
  canApproveStudentAdmission,
  getNextClassName,
  isAdmittedStatus,
  latestRecord,
  normalizeCreatedAdmissionStatus,
  normalizeEditableStudentStatus,
  relationMatches,
  validateStudentProfile,
} from '../src/modules/students/studentUtils.js';

const student = { id: 'student-doc-id', studentId: 'STU-10001' };

assert.equal(relationMatches({ studentRecordId: 'student-doc-id' }, student), true);
assert.equal(relationMatches({ entityRecordId: 'student-doc-id' }, student), true);
assert.equal(relationMatches({ ownerId: 'STU-10001' }, student), true);
assert.equal(relationMatches({ studentId: 'STU-10001' }, student), true);
assert.equal(relationMatches({ studentId: 'STU-99999' }, student), false);

assert.equal(normalizeCreatedAdmissionStatus(), PENDING_ADMISSION_STATUS);
assert.equal(canApproveStudentAdmission('super-admin'), true);
assert.equal(canApproveStudentAdmission('admin'), false);
assert.equal(isAdmittedStatus('Approved'), true);
assert.equal(normalizeEditableStudentStatus('Active', 'admin'), PENDING_ADMISSION_STATUS);
assert.equal(normalizeEditableStudentStatus('Active', 'super-admin'), 'Active');

assert.deepEqual(latestRecord([{ id: 1 }, { id: 2 }]), { id: 2 });
assert.equal(latestRecord([]), null);

assert.equal(getNextClassName('Class X'), 'Class XI');
assert.equal(getNextClassName('Class XI'), 'Class XII');
assert.equal(getNextClassName('Class XII'), 'Class XII');

assert.deepEqual(buildCourseOptionsFromStudents([
  { courseCode: 'BSCN', courseName: 'BSC Nursing', courseYear: '1 St Year', admissionType: 'Regular' },
  { courseCode: 'BPT', courseName: 'BPT', className: '1 St Year' },
], [{ courseCode: 'BSCN', courseName: 'BSC Nursing' }]).map((course) => course.courseCode), ['BSCN', 'BPT']);

assert.equal(
  validateStudentProfile({
    name: 'Asha Rao',
    guardianName: 'Meera Rao',
    idHolder: 'Asha Rao',
    phone: '+91 98765 43210',
    email: 'asha@student.edu',
    className: 'Class XI',
    section: 'A',
    program: 'PU Science',
    academicYear: '2026-2027',
  }),
  ''
);

assert.equal(validateStudentProfile({}), 'Student name is required.');
assert.equal(
  validateStudentProfile({
    name: 'Asha Rao',
    guardianName: 'Meera Rao',
    idHolder: 'Asha Rao',
    phone: 'bad',
    email: 'asha@student.edu',
    className: 'Class XI',
    section: 'A',
    program: 'PU Science',
    academicYear: '2026-2027',
  }),
  'Enter a valid phone number.'
);

console.log('Student utility tests passed.');

import assert from 'node:assert/strict';
import {
  getClassOptions,
  hasTimetableConflict,
  validateTimetableEntry,
} from '../src/modules/timetable/timetableUtils.js';

const students = [
  { className: 'Class XI', section: 'A', status: 'Active' },
  { className: 'Class XI', section: 'A', status: 'Active' },
  { className: 'Class XII', section: 'B', status: 'Active' },
  { className: 'Class X', section: 'C', status: 'Archived' },
];

assert.deepEqual(getClassOptions(students), ['Class XI - A', 'Class XII - B']);
assert.equal(validateTimetableEntry({}), 'Class is required.');
assert.equal(
  validateTimetableEntry({
    classKey: 'Class XI - A',
    subject: 'Physics',
    facultyId: 'staff-1',
    classroomId: 'room-1',
    day: 'Monday',
    timeSlot: '09:00 - 10:00',
  }),
  ''
);

const entries = [
  {
    id: 'entry-1',
    classKey: 'Class XI - A',
    facultyId: 'staff-1',
    classroomId: 'room-1',
    day: 'Monday',
    timeSlot: '09:00 - 10:00',
    status: 'Draft',
  },
];

assert.equal(hasTimetableConflict(entries, {
  classKey: 'Class XI - A',
  facultyId: 'staff-2',
  classroomId: 'room-2',
  day: 'Monday',
  timeSlot: '09:00 - 10:00',
}), true);

assert.equal(hasTimetableConflict(entries, {
  classKey: 'Class XII - B',
  facultyId: 'staff-2',
  classroomId: 'room-2',
  day: 'Tuesday',
  timeSlot: '09:00 - 10:00',
}), false);

console.log('Timetable tests passed.');

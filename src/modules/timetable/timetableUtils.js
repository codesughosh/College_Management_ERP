export const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const timeSlots = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:15 - 12:15',
  '12:15 - 01:15',
  '02:00 - 03:00',
  '03:00 - 04:00',
];

export function formatDisplayDate(date = new Date()) {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getClassKey(student) {
  return `${student.className} - ${student.section}`;
}

export function getClassOptions(students) {
  return [...new Set(students.filter((student) => student.status !== 'Archived').map(getClassKey))].sort();
}

export function hasTimetableConflict(entries, candidate, ignoreId = '') {
  return entries.some((entry) => {
    if (entry.id === ignoreId || entry.status === 'Archived') return false;
    const sameSlot = entry.day === candidate.day && entry.timeSlot === candidate.timeSlot;
    if (!sameSlot) return false;
    return entry.classKey === candidate.classKey || entry.facultyId === candidate.facultyId || entry.classroomId === candidate.classroomId;
  });
}

export function validateTimetableEntry(form) {
  const requiredFields = [
    ['classKey', 'Class'],
    ['subject', 'Subject'],
    ['facultyId', 'Faculty'],
    ['classroomId', 'Classroom'],
    ['day', 'Day'],
    ['timeSlot', 'Time slot'],
  ];
  const missing = requiredFields.find(([key]) => !String(form[key] || '').trim());
  return missing ? `${missing[1]} is required.` : '';
}

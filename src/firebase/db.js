import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './config';

const SCHEMA_DOC_ID = '__schema';

async function listCollection(collectionName) {
  if (!db) return [];
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs
    .filter((item) => item.id !== SCHEMA_DOC_ID)
    .map((item) => ({ id: item.id, ...item.data() }));
}

async function createCollectionDocument(collectionName, data) {
  if (!db) return null;
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getStudentInformationData() {
  const [
    students,
    admissions,
    documents,
    promotions,
    transfers,
    idCards,
  ] = await Promise.all([
    listCollection('students'),
    listCollection('studentAdmissions'),
    listCollection('studentDocuments'),
    listCollection('studentPromotions'),
    listCollection('studentTransfers'),
    listCollection('studentIdCards'),
  ]);

  return {
    students,
    admissions,
    documents,
    promotions,
    transfers,
    idCards,
  };
}

export async function createStudent(data) {
  return createCollectionDocument('students', data);
}

export async function createStudentAdmission(data) {
  return createCollectionDocument('studentAdmissions', data);
}

export async function createStudentDocument(data) {
  return createCollectionDocument('studentDocuments', data);
}

export async function updateStudentDocument(id, data) {
  if (!db || !id || id.startsWith('demo-') || id.startsWith('local-')) return;
  await updateDoc(doc(db, 'studentDocuments', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function createStudentPromotion(data) {
  return createCollectionDocument('studentPromotions', data);
}

export async function createStudentTransfer(data) {
  return createCollectionDocument('studentTransfers', data);
}

export async function createStudentIdCard(data) {
  return createCollectionDocument('studentIdCards', data);
}

export async function updateStudent(id, data) {
  if (!db || !id || id.startsWith('demo-') || id.startsWith('local-')) return;
  await updateDoc(doc(db, 'students', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function archiveStudent(id, data = {}) {
  if (!db || !id || id.startsWith('demo-') || id.startsWith('local-')) return;
  await updateDoc(doc(db, 'students', id), {
    ...data,
    status: 'Archived',
    archivedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function restoreStudent(id, data = {}) {
  if (!db || !id || id.startsWith('demo-') || id.startsWith('local-')) return;
  await updateDoc(doc(db, 'students', id), {
    ...data,
    status: 'Active',
    restoredAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserRoleData() {
  const [users, roles] = await Promise.all([
    listCollection('users'),
    listCollection('roles'),
  ]);

  return { users, roles };
}

export async function getUserProfile(uid) {
  if (!db || !uid) return null;
  const snapshot = await getDoc(doc(db, 'users', uid));
  if (!snapshot.exists()) return null;
  return { uid: snapshot.id, ...snapshot.data() };
}

export async function createUserProfile(uid, data) {
  if (!db || !uid) return null;
  await setDoc(doc(db, 'users', uid), {
    ...data,
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return uid;
}

export async function updateUserProfile(uid, data) {
  if (!db || !uid || uid.startsWith('demo-') || uid.startsWith('local-')) return;
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function createRole(data) {
  if (!db) return null;
  const roleId = data.id || `role-${Date.now()}`;
  await setDoc(doc(db, 'roles', roleId), {
    ...data,
    id: roleId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return roleId;
}

export async function updateRole(id, data) {
  if (!db || !id || id.startsWith('demo-') || id.startsWith('local-')) return;
  await updateDoc(doc(db, 'roles', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function getFacultyStaffData() {
  const [staff, departments, leaveRecords, attendanceRecords] = await Promise.all([
    listCollection('staffMembers'),
    listCollection('departments'),
    listCollection('staffLeaveRecords'),
    listCollection('staffAttendanceRecords'),
  ]);

  return { staff, departments, leaveRecords, attendanceRecords };
}

export async function createStaffMember(data) {
  return createCollectionDocument('staffMembers', data);
}

export async function updateStaffMember(id, data) {
  if (!db || !id || id.startsWith('demo-') || id.startsWith('local-')) return;
  await updateDoc(doc(db, 'staffMembers', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function archiveStaffMember(id, data = {}) {
  if (!db || !id || id.startsWith('demo-') || id.startsWith('local-')) return;
  await updateDoc(doc(db, 'staffMembers', id), {
    ...data,
    status: 'Archived',
    archivedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function restoreStaffMember(id, data = {}) {
  if (!db || !id || id.startsWith('demo-') || id.startsWith('local-')) return;
  await updateDoc(doc(db, 'staffMembers', id), {
    ...data,
    status: 'Active',
    restoredAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function createDepartment(data) {
  return createCollectionDocument('departments', data);
}

export async function createStaffLeaveRecord(data) {
  return createCollectionDocument('staffLeaveRecords', data);
}

export async function updateStaffLeaveRecord(id, data) {
  if (!db || !id || id.startsWith('demo-') || id.startsWith('local-')) return;
  await updateDoc(doc(db, 'staffLeaveRecords', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function createStaffAttendanceRecord(data) {
  return createCollectionDocument('staffAttendanceRecords', data);
}

export async function getAttendanceManagementData() {
  const [students, staff, studentAttendance, staffAttendance, notifications] = await Promise.all([
    listCollection('students'),
    listCollection('staffMembers'),
    listCollection('studentAttendanceRecords'),
    listCollection('staffAttendanceRecords'),
    listCollection('attendanceNotifications'),
  ]);

  return { students, staff, studentAttendance, staffAttendance, notifications };
}

export async function createStudentAttendanceRecord(data) {
  return createCollectionDocument('studentAttendanceRecords', data);
}

export async function updateStudentAttendanceRecord(id, data) {
  if (!db || !id || id.startsWith('demo-') || id.startsWith('local-')) return;
  await updateDoc(doc(db, 'studentAttendanceRecords', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function createAttendanceNotification(data) {
  return createCollectionDocument('attendanceNotifications', data);
}

export async function getTimetableManagementData() {
  const [students, staff, classrooms, timetableEntries, publications] = await Promise.all([
    listCollection('students'),
    listCollection('staffMembers'),
    listCollection('classrooms'),
    listCollection('timetableEntries'),
    listCollection('timetablePublications'),
  ]);

  return { students, staff, classrooms, timetableEntries, publications };
}

export async function createClassroom(data) {
  return createCollectionDocument('classrooms', data);
}

export async function createTimetableEntry(data) {
  return createCollectionDocument('timetableEntries', data);
}

export async function updateTimetableEntry(id, data) {
  if (!db || !id || id.startsWith('demo-') || id.startsWith('local-')) return;
  await updateDoc(doc(db, 'timetableEntries', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function archiveTimetableEntry(id, data = {}) {
  if (!db || !id || id.startsWith('demo-') || id.startsWith('local-')) return;
  await updateDoc(doc(db, 'timetableEntries', id), {
    ...data,
    status: 'Archived',
    archivedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function createTimetablePublication(data) {
  return createCollectionDocument('timetablePublications', data);
}

export async function getExaminationResultData() {
  const [students, staff, examSchedules, assessments, marks, results, reportCards] = await Promise.all([
    listCollection('students'),
    listCollection('staffMembers'),
    listCollection('examSchedules'),
    listCollection('internalAssessments'),
    listCollection('marksEntries'),
    listCollection('studentResults'),
    listCollection('reportCards'),
  ]);

  return { students, staff, examSchedules, assessments, marks, results, reportCards };
}

export async function createExamSchedule(data) {
  return createCollectionDocument('examSchedules', data);
}

export async function updateExamSchedule(id, data) {
  if (!db || !id || id.startsWith('demo-') || id.startsWith('local-')) return;
  await updateDoc(doc(db, 'examSchedules', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function createInternalAssessment(data) {
  return createCollectionDocument('internalAssessments', data);
}

export async function createMarksEntry(data) {
  return createCollectionDocument('marksEntries', data);
}

export async function updateMarksEntry(id, data) {
  if (!db || !id || id.startsWith('demo-') || id.startsWith('local-')) return;
  await updateDoc(doc(db, 'marksEntries', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function createStudentResult(data) {
  return createCollectionDocument('studentResults', data);
}

export async function createReportCard(data) {
  return createCollectionDocument('reportCards', data);
}

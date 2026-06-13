import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
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

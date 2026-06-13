import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp } from 'firebase/app';
import { getFirestore, serverTimestamp, setDoc, doc } from 'firebase/firestore';

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env');
  const raw = readFileSync(envPath, 'utf8');
  const env = {};

  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const index = trimmed.indexOf('=');
    if (index === -1) return;
    env[trimmed.slice(0, index)] = trimmed.slice(index + 1);
  });

  return env;
}

const env = loadEnv();

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missing = requiredKeys.filter((key) => !firebaseConfig[key]);

if (missing.length) {
  throw new Error(`Missing Firebase config values: ${missing.join(', ')}`);
}

const collections = {
  students: {
    purpose: 'Main student profile records',
    fields: ['admissionNo', 'studentId', 'name', 'className', 'section', 'program', 'guardianName', 'phone', 'email', 'status'],
  },
  studentAdmissions: {
    purpose: 'Admission form, admission workflow, and status history',
    fields: ['studentId', 'admissionNo', 'academicYear', 'status', 'submittedAt', 'approvedAt'],
  },
  studentDocuments: {
    purpose: 'Student document repository',
    fields: ['studentId', 'documentType', 'fileName', 'fileUrl', 'verificationStatus', 'uploadedAt'],
  },
  studentPromotions: {
    purpose: 'Student promotion records',
    fields: ['studentId', 'fromClass', 'toClass', 'academicYear', 'status', 'approvedBy'],
  },
  studentTransfers: {
    purpose: 'Student transfer requests and certificate tracking',
    fields: ['studentId', 'transferType', 'reason', 'status', 'requestedAt', 'certificateUrl'],
  },
  studentIdCards: {
    purpose: 'Generated student ID card metadata',
    fields: ['studentId', 'cardNumber', 'issuedAt', 'validUntil', 'status', 'downloadUrl'],
  },
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

for (const [collectionName, schema] of Object.entries(collections)) {
  await setDoc(doc(db, collectionName, '__schema'), {
    ...schema,
    createdBy: 'CollegeERP bootstrap',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  console.log(`Created/updated ${collectionName}/__schema`);
}

console.log('Student Information Management collections are ready.');

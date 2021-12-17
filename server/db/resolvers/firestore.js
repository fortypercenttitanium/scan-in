import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.CREDS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export default async function createRefs() {
  const classesRef = await db.collection('classes');
  const usersRef = await db.collection('users');
  const studentsRef = await db.collection('students');
  const downloadsRef = await db.collection('downloads');
  const sessionsRef = await db.collection('sessions');

  return {
    classesRef,
    usersRef,
    studentsRef,
    downloadsRef,
    sessionsRef,
    db,
  };
}

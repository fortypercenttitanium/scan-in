const admin = require('firebase-admin');
const { ApolloError } = require('apollo-server');

const serviceAccount = require('./serviceAccountKey.json');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 16);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
let classesRef;
let usersRef;
let studentsRef;
let downloadsRef;
let sessionsRef;

async function createRefs() {
  classesRef = await db.collection('classes');
  usersRef = await db.collection('users');
  studentsRef = await db.collection('students');
  downloadsRef = await db.collection('downloads');
  sessionsRef = await db.collection('sessions');
}

createRefs();

const resolvers = {
  Query: {
    async user(_, args) {
      const { email } = args;
      try {
        const snapshot = await usersRef.where('email', '==', email).get();

        const user = snapshot.docs[0].data() || null;
        return user;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async userByID(_, args) {
      try {
        const { id } = args;
        const snapshot = await usersRef.doc(id).get();

        const user = snapshot.data() || null;

        return user;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async class(_, args) {
      try {
        const { id, userID } = args;

        const snapshot = await classesRef
          .where('owner', '==', userID)
          .where('id', '==', id)
          .get();

        const result = snapshot.docs[0].data() || null;

        return result;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async classByName(_, args) {
      try {
        const { name, userID, id } = args;

        const snap = await classesRef
          .where('owner', '==', userID)
          .where('name', '==', name)
          .where('id', '!=', id)
          .get();

        const docs = snap.docs.map((doc) => doc.data());

        const result = docs[0] || null;

        return result;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async classList(_, args) {
      try {
        const { userID } = args;

        const snapshot = await classesRef.where('owner', '==', userID).get();

        const result = snapshot.docs.map((doc) => doc.data()) || null;
        return result;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async sessionList(_, args) {
      try {
        const { userID } = args;

        const snapshot = await sessionsRef.where('owner', '==', userID).get();

        const result = snapshot.docs.map((doc) => doc.data()) || null;
        return result.sort((session) => Number(session.startTime));
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async csvDownload(_, args) {
      try {
        const { token } = args;

        const result = await downloadsRef.doc(token).get();
        return result.data();
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async studentList(_, args) {
      try {
        const snapshot = await studentsRef.get();
        const data = snapshot.docs.map((doc) => doc.data());

        if (args.classID) {
          return data.filter((student) =>
            student.classes.includes(args.classID),
          );
        }

        return data;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async studentsByID(_, args) {
      try {
        const { ids } = args;

        const snapshot = await studentsRef.get();
        const data = snapshot.docs.map((doc) => doc.data());

        return data.filter((student) => ids.includes(student.id));
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async session(_, args) {
      try {
        const { id } = args;

        const snapshot = await sessionsRef.where('id', '==', id).get();

        return snapshot.docs[0].data();
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async sessionRecap(_, args) {
      try {
        const { id, userID } = args;
        console.log('id: ', userID, id);
        const snapshot = await sessionsRef
          .where('owner', '==', userID)
          .where('id', '==', id)
          .get();

        return snapshot.docs[0].data();
      } catch (err) {
        throw new ApolloError(err);
      }
    },
  },
  Mutation: {
    async addUser(parent, args) {
      try {
        const { firstName, lastName, email, id } = args;
        await usersRef
          .doc(id)
          .set({ firstName, lastName, email, id, classes: [] });
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async deleteUser(parent, args) {
      try {
        const { id } = args;
        await usersRef.doc(id).delete();
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async addStudents(_, args) {
      try {
        const { students } = args;
        const batch = db.batch();

        students.forEach((student) => {
          batch.set(studentsRef.doc(student.id), student, { merge: true });
        });

        await batch.commit();

        return students;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async addClass(_, args) {
      try {
        const { name, students, owner, id } = args;
        const studentBatch = db.batch();

        // set new class
        const newClass = {
          name,
          students,
          owner,
          id,
        };

        await classesRef.doc(id).set(newClass);

        // get all students in class and add this class
        const studentsSnap = await studentsRef.get();
        const studentsToEdit = studentsSnap.docs.filter(({ id }) =>
          students.includes(id),
        );

        const studentsWithClass = studentsToEdit
          .map((student) => ({
            ...student.data(),
          }))
          .map((student) => ({
            ...student,
            classes: student.classes ? [...student.classes, id] : [id],
          }));

        studentsWithClass.forEach((student) => {
          studentBatch.set(studentsRef.doc(student.id), student, {
            merge: true,
          });
        });

        studentBatch.commit();

        const classSnap = await classesRef.doc(id);
        const classQuery = await classSnap.get();

        return classQuery.data();
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async editClass(_, args) {
      try {
        const { name, students, owner, id } = args;
        const editedData = {
          name,
          students,
        };

        await classesRef.doc(id).set(editedData, { merge: true });

        const snap = await classesRef.where('id', '==', id).get();
        const newClassList = snap.docs[0].data();

        return newClassList;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async deleteClass(_, args) {
      try {
        const { id } = args;

        await classesRef.doc(id).delete();

        return { id };
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async removeClassFromStudents(_, args) {
      try {
        const batch = db.batch();
        const { classID, studentIDs } = args;

        // get all students in query
        const studentsSnap = await studentsRef.get();
        const queriedStudents = studentsSnap.docs
          .map((doc) => doc.data())
          .filter((student) => studentIDs.includes(student.id));

        // remove the class from their list
        const newStudents = queriedStudents.map((student) => ({
          ...student,
          classes: student.classes.filter(
            (currentClass) => currentClass !== classID,
          ),
        }));

        newStudents.forEach((student) => {
          batch.set(studentsRef.doc(student.id), student);
        });

        await batch.commit();

        return newStudents;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async csvDownload(_, args) {
      try {
        const { data } = args;
        const token = nanoid();

        // create expiration date
        const minutesToExpiration = 15;
        const expires = new Date().getTime() + minutesToExpiration * 60000;

        await downloadsRef.doc(token).set({
          token,
          expires,
          data,
        });

        return {
          token,
          expires,
          data,
        };
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async clearDownloads() {
      try {
        // filter down to all downloads that  have expired
        const now = new Date().getTime();
        const expiredDownloads = await db;
        downloadsRef.where('expires', '<', now).get();

        // get the IDs of downloads deleted
        const result = expiredDownloads.docs.map((doc) => doc.data().token);
        // delete each doc
        expiredDownloads.docs.forEach((download) => download.ref.delete());

        return result;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async updateStudents(_, args) {
      try {
        const [students] = args;
        const batch = db.batch();

        students.forEach((student) => {
          batch.set(studentsRef, student);
        });

        await batch.commit();

        return students;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async addSession(_, args) {
      try {
        const { classID } = args;

        const classSnap = await classesRef.doc(classID).get();
        const classData = classSnap.data();

        const studentsQuery = await studentsRef.get();
        const studentsSnap = await studentsQuery.docs;
        const studentsData = studentsSnap
          .map((doc) => doc.data())
          .filter((student) => classData.students.includes(student.id))
          .map((student) => ({
            firstName: student.firstName,
            lastName: student.lastName,
            id: student.id,
          }));

        const startTime = new Date().getTime();
        const endTime = startTime + 1000 * 60 * 60 * 2;
        const id = nanoid();
        console.log('id in resolver: ', id);
        const session = {
          id,
          classID,
          className: classData.name,
          owner: classData.owner,
          startTime: startTime.toString(),
          endTime: endTime.toString(),
          log: [
            {
              event: 'session-open',
              timeStamp: startTime.toString(),
              payload: id,
            },
          ],
          students: studentsData,
        };

        await sessionsRef.doc(session.id).set(session);

        return session;
      } catch (err) {
        throw new ApolloError(err);
      }
    },

    async addLogEntry(_, args) {
      try {
        const { event, payload, sessionID } = args;
        const timeStamp = new Date().getTime().toString();

        await sessionsRef.doc(sessionID).update({
          log: admin.firestore.FieldValue.arrayUnion({
            event,
            payload,
            timeStamp,
          }),
        });

        const updatedSession = await sessionsRef.doc(sessionID).get();

        return updatedSession.data();
      } catch (err) {
        throw new ApolloError(err);
      }
    },

    async closeSession(_, args) {
      try {
        const { id } = args;
        const timeStamp = new Date().getTime().toString();

        await sessionsRef.doc(id).update({
          log: admin.firestore.FieldValue.arrayUnion({
            event: 'session-closed',
            payload: timeStamp,
            timeStamp,
          }),
          endTime: timeStamp,
        });

        const updatedSession = await sessionsRef.doc(id).get();

        return updatedSession.data();
      } catch (err) {
        throw new ApolloError(err);
      }
    },
  },
};

module.exports = resolvers;

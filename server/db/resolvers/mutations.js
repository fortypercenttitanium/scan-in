import { customAlphabet } from 'nanoid';
import admin from 'firebase-admin';
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 16);

export default function mutations({
  classesRef,
  usersRef,
  studentsRef,
  downloadsRef,
  sessionsRef,
  db,
}) {
  return {
    async addUser(parent, args) {
      try {
        const { firstName, lastName, email, id } = args;
        await usersRef
          .doc(id)
          .set({ firstName, lastName, email, id, classes: [] });
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteUser(parent, args) {
      try {
        const { id } = args;
        await usersRef.doc(id).delete();
      } catch (err) {
        throw new Error(err);
      }
    },
    async addStudents(_, args) {
      try {
        const { students } = args;

        const studentsReadyForDB = students.map((student) => ({
          ...student,
          classes: [],
        }));

        const batch = db.batch();

        studentsReadyForDB.forEach((student) => {
          batch.set(studentsRef.doc(student.id), student, { merge: true });
        });

        await batch.commit();

        return studentsReadyForDB;
      } catch (err) {
        throw new Error(err);
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
        throw new Error(err);
      }
    },
    async editClass(_, args) {
      try {
        const { name, students, id } = args;
        const editedData = {
          name,
          students,
        };

        const studentBatch = db.batch();

        await classesRef.doc(id).set(editedData, { merge: true });

        // get all students in class and add this class
        const studentsSnap = await studentsRef.get();
        const studentsToEdit = studentsSnap.docs
          .map((student) => student.data())
          .filter(({ id: studentID, classes }) => {
            return students.includes(studentID) && !classes.includes(id);
          });

        const studentsWithClass = studentsToEdit.map((student) => ({
          ...student,
          classes: [...student.classes, id],
        }));

        studentsWithClass.forEach((student) => {
          studentBatch.set(studentsRef.doc(student.id), student, {
            merge: true,
          });
        });

        await studentBatch.commit();

        const newClassSnap = await classesRef.doc(id).get();
        const newClass = await newClassSnap.data();

        return newClass;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteClass(_, args) {
      try {
        const { id } = args;

        await classesRef.doc(id).delete();

        return { id };
      } catch (err) {
        throw new Error(err);
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

        // remove students from class list
        const classSnap = await classesRef.doc(classID).get();

        const classData = await classSnap.data();

        const newStudentList = classData.students.filter(
          (student) => !studentIDs.includes(student),
        );

        const newClassData = {
          ...classData,
          students: newStudentList,
        };

        await classesRef.doc(classID).set(newClassData);

        return newStudents;
      } catch (err) {
        throw new Error(err);
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
        throw new Error(err);
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
        throw new Error(err);
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
        throw new Error(err);
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
        throw new Error(err);
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
        throw new Error(err);
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
        throw new Error(err);
      }
    },
  };
}

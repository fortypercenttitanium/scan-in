import { ApolloError } from 'apollo-server-express';

export default function queries({
  classesRef,
  usersRef,
  studentsRef,
  downloadsRef,
  sessionsRef,
}) {
  return {
    async user(_, args) {
      const { email } = args;
      try {
        const snapshot = await usersRef.where('email', '==', email).get();
        if (snapshot.empty) return null;
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
          return data.filter((student) => {
            student.classes.includes(args.classID);
          });
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

        const snapshot = await sessionsRef
          .where('owner', '==', userID)
          .where('id', '==', id)
          .get();

        return snapshot.docs[0].data();
      } catch (err) {
        throw new ApolloError(err);
      }
    },
  };
}

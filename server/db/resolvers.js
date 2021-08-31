const admin = require('firebase-admin');
const { ApolloError } = require('apollo-server');

const serviceAccount = require('./serviceAccountKey.json');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 16);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const resolvers = {
  Query: {
    async user(_, args) {
      const { email } = args;
      try {
        const users = await db.collection('users');
        const snapshot = await users.where('email', '==', email).get();

        const user = snapshot.docs[0].data() || null;
        return user;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async userById(_, args) {
      try {
        const { id } = args;
        const users = await db.collection('users');
        const snapshot = await users.doc(id).get();

        const user = snapshot.data() || null;

        return user;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async class(_, args) {
      const { id, userId } = args;

      const classesRef = await db.collection('classes');
      const snapshot = await classesRef
        .where('owner', '==', userId)
        .where('id', '==', id)
        .get();

      const result = snapshot.docs[0].data() || null;

      return result;
    },
    async classList(_, args) {
      const { userId } = args;
      const classesRef = await db.collection('classes');

      const snapshot = await classesRef.where('owner', '==', userId).get();

      const result = snapshot.docs.map((doc) => doc.data()) || null;
      return result;
    },
    async download(_, args) {
      const { token } = args;

      const result = await db.collection('downloads').doc(token).get();
      return result.data();
    },
  },
  Mutation: {
    async addUser(parent, args) {
      try {
        const { firstName, lastName, email, id } = args;
        await db
          .collection('users')
          .doc(id)
          .set({ firstName, lastName, email, id, classes: [] });
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async deleteUser(parent, args) {
      try {
        const { id } = args;
        await db.collection('users').doc(id).delete();
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async addClass(_, args) {
      try {
        const { name, students, owner, id } = args;
        const newClass = {
          name,
          students,
          owner,
          id,
        };

        await db.collection('classes').doc(id).set(newClass);

        const snap = await db
          .collection('classes')
          .where('owner', '==', owner)
          .get();

        const newClassList = snap.docs.map((doc) => doc.data());
        return newClassList;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async editClass(parent, args) {
      try {
        const { name, students, owner, id } = args;
        const editedData = {
          name,
          students,
        };

        await db.collection('classes').doc(id).set(editedData, { merge: true });

        const snap = await db
          .collection('classes')
          .where('owner', '==', owner)
          .get();

        const newClassList = snap.docs.map((doc) => doc.data());
        return newClassList;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async addDownload(_, args) {
      try {
        const { data } = args;
        const token = nanoid();

        // create expiration date
        const minutesToExpiration = 15;
        const expires = new Date().getTime() + minutesToExpiration * 60000;

        await db.collection('downloads').doc(token).set({
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
        const expiredDownloads = await db
          .collection('downloads')
          .where('expires', '<', now)
          .get();

        // get the IDs of downloads deleted
        const result = expiredDownloads.docs.map((doc) => doc.data().token);
        // delete each doc
        expiredDownloads.docs.forEach((download) => download.ref.delete());

        return result;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
  },
};

module.exports = resolvers;

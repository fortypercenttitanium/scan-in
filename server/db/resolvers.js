const admin = require('firebase-admin');
const { ApolloError } = require('apollo-server');

const serviceAccount = require('./serviceAccountKey.json');

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
      const { id } = args;
      const classes = await db.collection('classes');
      const snapshot = await classes.doc(id).get();

      const result = snapshot.data() || null;

      return result;
    },
    async classList(_, args) {
      const { userId } = args;
      const list = await db.collection('classes');
      const snapshot = await list.where('userId', '==', userId).get();

      const result = snapshot.docs || null;
      return result;
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
  },
};

module.exports = resolvers;

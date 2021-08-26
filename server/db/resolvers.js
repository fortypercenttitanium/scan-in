const admin = require('firebase-admin');
const { ApolloError } = require('apollo-server');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const resolvers = {
  Query: {
    async user(parent, args) {
      const { email } = args;
      try {
        const users = await db.collection('users');
        const snapshot = await users.where('email', '==', email).get();

        if (!snapshot.docs.length || !snapshot.docs[0].data()) {
          return null;
        }

        const user = snapshot.docs[0].data();
        return user;
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    async userById(parent, args) {
      const { id } = args;
      try {
        const users = await db.collection('users');
        const snapshot = await users.doc(id).get();

        if (!snapshot.data()) {
          return null;
        }

        const user = snapshot.data();
        return user;
      } catch (err) {
        throw new ApolloError(err);
      }
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
  },
};

module.exports = resolvers;

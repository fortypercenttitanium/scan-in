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
  },
  Mutation: {
    async addUser(parent, args) {
      const { firstName, lastName, email, id } = args;

      db.collection('users')
        .doc(id)
        .set({ firstName, lastName, email, id, classes: [] });
    },
  },
};

module.exports = resolvers;

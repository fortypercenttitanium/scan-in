import firestoreRefs from './firestore.js';
import queries from './queries.js';
import mutations from './mutations.js';

const refs = await firestoreRefs();

const resolvers = {
  Query: queries(refs),
  Mutation: mutations(refs),
};

export default resolvers;

import { ApolloServer } from 'apollo-server-express';
import typeDefs from './schemas/schemas.js';
import resolvers from './resolvers/resolvers.js';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

export default apolloServer;

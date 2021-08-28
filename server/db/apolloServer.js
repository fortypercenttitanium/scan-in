const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');

const apolloServer = new ApolloServer({ typeDefs, resolvers });

apolloServer.listen().then(({ url }) => {
  console.log(`
    Apollo server is running!
    Listening at ${url}.
    Query at https://studio.apollographql.com/dev
  `);
});

module.exports = apolloServer;

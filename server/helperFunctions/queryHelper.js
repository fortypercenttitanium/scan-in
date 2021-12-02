const { request } = require('graphql-request');
const { ApolloError } = require('apollo-server-express');

const PORT = process.env.PORT || 5000;

async function query(q, variables) {
  try {
    return await request(`http://localhost:${PORT}/graphql`, q, variables);
  } catch (err) {
    throw new ApolloError(err);
  }
}

module.exports = query;

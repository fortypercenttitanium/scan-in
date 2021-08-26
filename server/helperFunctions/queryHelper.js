const { request } = require('graphql-request');
const { ApolloError } = require('apollo-server');

async function query(q, variables) {
  try {
    return await request('http://localhost:4000/', q, variables);
  } catch (err) {
    throw new ApolloError(err);
  }
}

module.exports = query;

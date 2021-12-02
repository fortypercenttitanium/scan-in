const { request } = require('graphql-request');
const { ApolloError } = require('apollo-server-express');

const PORT = process.env.PORT || 5000;

console.log('port ', PORT);

async function query(q, variables) {
  try {
    return await request(`/graphql`, q, variables);
  } catch (err) {
    throw new ApolloError(err);
  }
}

module.exports = query;

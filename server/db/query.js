const { request } = require('graphql-request');

async function query(q, variables) {
  try {
    return await request('http://localhost:4000/', q, variables);
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = query;

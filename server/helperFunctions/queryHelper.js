import { request } from 'graphql-request';
import { ApolloError } from 'apollo-server-express';

const PORT = process.env.PORT || 5000;

const url = `http://localhost:${PORT}/graphql`;
// process.env.NODE_ENV === 'development'
//   ? `http://localhost:${PORT}/graphql`
//   : `https://scan-in.herokuapp.com/graphql`;

async function query(q, variables) {
  try {
    return await request(url, q, variables);
  } catch (err) {
    throw new ApolloError(err);
  }
}

export default query;

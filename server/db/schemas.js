const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    user(email: String!): User
    classList: [Class]!
    studentList: [Student]!
  }

  type Mutation {
    addUser(
      firstName: String!
      lastName: String!
      id: ID!
      email: String!
    ): User
  }

  type Class {
    id: ID!
    "The name of the class"
    name: String!
    "The teacher or user who created the class"
    teacher: User!
    "Students in the class"
    students: [Student]!
    log: [String]!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    classes: [Class]!
  }

  type Student {
    id: ID!
    firstName: String!
    lastName: String!
    classes: [Class]!
  }
`;

module.exports = typeDefs;

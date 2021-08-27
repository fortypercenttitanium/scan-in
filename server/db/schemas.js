const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    user(email: String!): User
    userById(id: ID!): User
    class(id: ID!): Class
    classList(userId: ID!): [Class]!
    student(id: ID!): Student
    studentList: [Student]!
    session(id: ID!): Session
    sessionList(userId: ID!): [Session]!
  }

  type Mutation {
    addUser(
      firstName: String!
      lastName: String!
      id: ID!
      email: String!
    ): User
    deleteUser(id: ID!): User
    addClass(name: String!, students: [ID]!, owner: ID!, id: ID!): [Class!]!
    editClass(name: String!, students: [ID]!, owner: ID!, id: ID!): [Class!]!
    deleteClass(id: ID!): [Class]!
    addStudents(input: [StudentInput!]!): Class
    editStudents(input: [StudentInput]!): Class
    addLogEntry(
      id: ID!
      event: String!
      timeStamp: String!
      studentName: String!
      studentId: ID!
      sessionId: ID!
      teacherId: ID!
    ): Session
    addSession(teacherId: ID!, classId: ID!, startTime: String!): Session
    editSession(teacherId: ID!, sessionId: ID!, endTime: String): Session
    deleteSession(id: ID!): [Session]!
  }

  input StudentInput {
    firstName: String!
    lastName: String!
  }

  type Class {
    id: ID!
    "The name of the class"
    name: String!
    "The teacher who created the class"
    owner: ID!
    "Students in the class"
    students: [ID]!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Student {
    id: ID!
    firstName: String!
    lastName: String!
  }

  type Session {
    id: ID!
    classId: ID!
    startTime: String!
    endTime: String
    log: [LogEntry]!
  }

  type LogEntry {
    time: String!
    event: String!
    payload: String
  }
`;

module.exports = typeDefs;

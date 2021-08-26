const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    user(email: String!): User
    userById(id: ID!): User
    classList(userId: ID!): [Class]!
    studentList(classId: ID!): [Student]!
    sessionHistory(userId: ID!): [Session]!
  }

  type Mutation {
    addUser(
      firstName: String!
      lastName: String!
      id: ID!
      email: String!
    ): User
    deleteUser(id: ID!): User
    addClass(name: String!, id: ID!): Class
    editClass(name: String, id: ID!): Class
    deleteClass(id: ID!): User
    addStudents(students: [StudentInput!]!): Class
    editStudents(students: [StudentInput]!): Class
    addLogEntry(
      event: String!
      timeStamp: String!
      studentName: String
      id: ID!
      studentId: ID!
      sessionId: ID!
      teacherId: ID!
    ): Session
    addSession(teacherId: ID!, classId: ID!, startTime: String!): Session
    editSession(teacherId: ID!, sessionId: ID!, endTime: String): Session
    deleteSession(teacherId: ID!, sessionId: ID!): User
  }

  input StudentInput {
    firstName: String!
    lastName: String!
  }

  type Class {
    id: ID!
    "The name of the class"
    name: String!
    "The teacher or user who created the class"
    teacher: User!
    "Students in the class"
    students: [Student]!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    classes: [Class]!
    sessionHistory: [Session]!
  }

  type Student {
    id: ID!
    firstName: String!
    lastName: String!
  }

  type Session {
    id: ID!
    teacherId: ID!
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

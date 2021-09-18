const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    user(email: String!): User
    userById(id: ID!): User
    class(id: ID!, userId: ID!): Class
    classList(userId: ID!): [Class]!
    student(id: ID!): Student
    studentsById(ids: [ID]!): [Student]!
    studentList(classId: ID): [Student]!
    session(id: ID!): Session
    sessionList(userId: ID!): [Session]!
    download(token: ID!): Download
  }

  type Mutation {
    addUser(
      firstName: String!
      lastName: String!
      id: ID!
      email: String!
    ): User
    deleteUser(id: ID!): ID
    addClass(name: String!, students: [ID]!, owner: ID!, id: ID!): [Class!]!
    editClass(name: String!, students: [ID]!, owner: ID!, id: ID!): [Class!]!
    deleteClass(id: ID!): [Class]!
    updateStudents(input: [StudentInput!]!): [Student]!
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
    addDownload(data: [String]!): Download
    clearDownloads: [ID]!
  }

  input StudentInput {
    id: ID!
    firstName: String!
    lastName: String!
    classes: [ID]!
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
    timeStamp: String!
    event: String!
    payload: String
  }

  type Download {
    expires: String!
    token: ID!
    data: [String!]
  }
`;

module.exports = typeDefs;

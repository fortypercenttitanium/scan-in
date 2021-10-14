const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    user(email: String!): User
    userByID(id: ID!): User
    class(id: ID!, userID: ID!): Class
    classList(userID: ID!): [Class]!
    classByName(name: String!, userID: ID!, id: ID): Class
    student(id: ID!): Student
    studentsByID(ids: [ID]!): [Student]!
    studentList(classID: ID): [Student]!
    session(id: ID!): Session
    sessionList(userID: ID!): [Session]!
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
    addClass(name: String!, students: [ID]!, owner: ID!, id: ID!): Class!
    editClass(name: String!, students: [ID]!, owner: ID!, id: ID!): Class!
    deleteClass(id: ID!): [Class]!
    addStudents(students: [StudentInput!]!): [Student]!
    updateStudents(input: [StudentInput!]!): [Student]!
    editStudents(input: [StudentInput]!): Class
    removeClassFromStudents(classID: ID!, studentIDs: [ID!]!): [Student]!
    addLogEntry(event: String!, payload: String, sessionID: ID!): Session
    addSession(classID: ID!): Session
    editSession(teacherID: ID!, sessionID: ID!, endTime: String): Session
    deleteSession(id: ID!): [Session]!
    addDownload(data: [String]!): Download
    clearDownloads: [ID]!
  }

  input StudentInput {
    id: ID!
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
    classes: [ID]
  }

  type Session {
    id: ID!
    classID: ID!
    startTime: String!
    endTime: String!
    log: [LogEntry!]!
    students: [Student]!
    className: String!
    owner: ID!
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

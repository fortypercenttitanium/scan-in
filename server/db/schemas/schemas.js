import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    user(email: String!): User
    userByID(id: ID!): User
    class(id: ID!, userID: ID!): Class
    classList(userID: ID!): [Class]!
    studentsByID(ids: [ID]!): [Student]!
    studentList(classID: ID): [Student]!
    session(id: ID!): Session
    sessionRecap(id: ID!, userID: ID!): Session
    sessionList(userID: ID!): [Session]!
    csvDownload(token: ID!): CsvDownload
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
    editClass(name: String!, students: [ID]!, id: ID!): Class!
    deleteClass(id: ID!): Class!
    addStudents(students: [StudentInput!]!): [Student]!
    removeClassFromStudents(classID: ID!, studentIDs: [ID!]!): [Student]!
    addLogEntry(event: String!, payload: String, sessionID: ID!): Session
    addSession(classID: ID!): Session
    closeSession(id: ID!): Session!
    csvDownload(data: String!): CsvDownload
  }

  input StudentInput {
    id: ID!
    firstName: String!
    lastName: String!
  }

  type Class {
    id: ID!
    name: String!
    owner: ID!
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
    classes: [ID]!
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

  type CsvDownload {
    expires: String!
    token: ID!
    data: String
  }
`;

export default typeDefs;

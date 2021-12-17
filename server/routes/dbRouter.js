import { Router } from 'express';
import passport from '../auth/passport.js';
import jwt from 'jsonwebtoken';
import { gql } from 'graphql-request';
import query from '../helperFunctions/queryHelper.js';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
dotenv.config();

const router = Router();

router.use(passport.authenticate('jwt', { session: false }));

router.get('/userData', (req, res) => {
  res.json(req.user);
});

router.get('/classes', async (req, res, next) => {
  try {
    const CLASS_LIST = gql`
      query ClassList($userID: ID!) {
        classList(userID: $userID) {
          id
          name
          students
        }
      }
    `;

    const result = await query(CLASS_LIST, { userID: req.user.id });

    res.json(result.classList);
  } catch (err) {
    return next(err);
  }
});

router.get('/sessions', async (req, res, next) => {
  try {
    const SESSION_LIST = gql`
      query ($userID: ID!) {
        sessionList(userID: $userID) {
          id
          className
          startTime
          endTime
          log {
            event
            payload
            timeStamp
          }
        }
      }
    `;

    const result = await query(SESSION_LIST, { userID: req.user.id });

    res.json(result.sessionList);
  } catch (err) {
    return next(err);
  }
});

router.get('/openSessions', async (req, res, next) => {
  try {
    const SESSION_LIST = gql`
      query ($userID: ID!) {
        sessionList(userID: $userID) {
          id
          className
          startTime
          endTime
          classID
          log {
            event
            payload
            timeStamp
          }
        }
      }
    `;

    const result = await query(SESSION_LIST, { userID: req.user.id });

    const openSessions = result.sessionList.filter(
      (session) => Number(session.endTime) > Number(new Date().getTime()),
    );
    res.json(openSessions);
  } catch (err) {
    return next(err);
  }
});

router.post('/studentIDs', async (req, res, next) => {
  try {
    const { students } = req.body;

    const GET_STUDENTS_BY_IDS = gql`
      query getStudentsByID($ids: [ID!]!) {
        studentsByID(ids: $ids) {
          id
          firstName
          lastName
        }
      }
    `;

    const { studentsByID: currentStudents } = await query(GET_STUDENTS_BY_IDS, {
      ids: students,
    });

    res.json(currentStudents);
  } catch (err) {
    return next(err);
  }
});

router.post('/students', async (req, res, next) => {
  try {
    const { students } = req.body;

    const GET_STUDENTS_BY_IDS = gql`
      query getStudentsByID($ids: [ID!]!) {
        studentsByID(ids: $ids) {
          id
        }
      }
    `;

    const ids = students.map((student) => student.id);

    const { studentsByID: currentStudents } = await query(GET_STUDENTS_BY_IDS, {
      ids,
    });

    const newStudents = students.filter(
      (student) =>
        !currentStudents.some(
          (currentStudent) => student.id === currentStudent.id,
        ),
    );

    if (newStudents.length) {
      const ADD_STUDENTS = gql`
        mutation ($students: [StudentInput!]!) {
          addStudents(students: $students) {
            firstName
            lastName
            id
          }
        }
      `;

      await query(ADD_STUDENTS, { students: newStudents });
      const { studentsByID } = await query(GET_STUDENTS_BY_IDS, { ids });
      return res.json(studentsByID);
    }

    res.json(currentStudents);
  } catch (err) {
    return next(err);
  }
});

router.post('/class', async (req, res, next) => {
  try {
    const { classData } = req.body;

    classData.id = nanoid();
    classData.owner = req.user.id;

    const NEW_CLASS = gql`
      mutation AddClass(
        $name: String!
        $students: [ID]!
        $owner: ID!
        $id: ID!
      ) {
        addClass(name: $name, students: $students, owner: $owner, id: $id) {
          id
          owner
          students
        }
      }
    `;

    const classResult = await query(NEW_CLASS, {
      ...classData,
      students: classData.students.map((student) => student.id),
    });

    res.json(JSON.stringify(classResult));
  } catch (err) {
    return next(err);
  }
});

router.put('/class', async (req, res, next) => {
  try {
    const { classData } = req.body;
    classData.owner = req.user.id;

    const STUDENTS_IN_CLASS = gql`
      query ($classID: ID!) {
        studentList(classID: $classID) {
          id
        }
      }
    `;

    // get student ids submitted in request
    const newStudentIDs = classData.students.map((student) => student.id);

    // get student ids in db class
    const currentStudentIDs = await query(STUDENTS_IN_CLASS, {
      classID: classData.id,
    });

    // compare, remove students not in current list
    const removeStudents = currentStudentIDs.studentList.filter(
      (id) => !newStudentIDs.includes(id),
    );

    if (removeStudents.length) {
      // remove class from students and students from class
      const REMOVE_CLASS_FROM_STUDENTS = gql`
        mutation ($studentIDs: [ID!]!, $classID: ID!) {
          removeClassFromStudents {
            id
            classes
          }
        }
      `;

      await query(REMOVE_CLASS_FROM_STUDENTS, {
        studentIDs: removeStudents,
        classID: classData.id,
      });
    }

    const EDIT_CLASS = gql`
      mutation ($id: ID!, $students: [ID]!, $name: String!) {
        editClass(id: $id, name: $name, students: $students) {
          id
          students
          owner
          name
        }
      }
    `;

    const classResult = await query(EDIT_CLASS, {
      ...classData,
      students: classData.students.map((student) => student.id),
    });

    res.json(JSON.stringify(classResult));
  } catch (err) {
    return next(err);
  }
});

router.get('/class', async (req, res) => {
  try {
    const CLASS = gql`
      query Class($id: ID!, $userID: ID!) {
        class(id: $id, userID: $userID) {
          id
          name
          students
        }
      }
    `;

    const result = await query(CLASS, { id: req.body.id, userID: req.user.id });

    res.json(result.class);
  } catch (err) {
    return next(err);
  }
});

router.delete('/class', async (req, res, next) => {
  try {
    const { classData } = req.body;

    const DELETE_CLASS = gql`
      mutation ($id: ID!) {
        deleteClass(id: $id) {
          id
        }
      }
    `;

    const confirmation = await query(DELETE_CLASS, { id: classData });

    res.json(confirmation);
  } catch (err) {
    return next(err);
  }
});

router.get('/session/:id', async (req, res, next) => {
  try {
    const SESSION = gql`
      query ($id: ID!, $userID: ID!) {
        session(id: $id, userID: $userID) {
          id
          className
          students {
            id
            firstName
            lastName
          }
          owner
          log {
            timeStamp
            event
            payload
          }
          startTime
          endTime
        }
      }
    `;

    const result = await query(SESSION, {
      id: req.params.id,
      userID: req.user.id,
    });

    res.json(result.session);
  } catch (err) {
    return next(err);
  }
});

router.get('/sessionrecap/:id', async (req, res, next) => {
  try {
    const SESSION = gql`
      query ($id: ID!, $userID: ID!) {
        sessionRecap(id: $id, userID: $userID) {
          id
          className
          students {
            id
            firstName
            lastName
          }
          owner
          log {
            timeStamp
            event
            payload
          }
          startTime
          endTime
        }
      }
    `;

    const result = await query(SESSION, {
      id: req.params.id,
      userID: req.user.id,
    });

    const now = new Date();
    const sessionIsExpired =
      Number(result.sessionRecap.endTime) < Number(now.getTime());

    res.json(sessionIsExpired ? result.sessionRecap : null);
  } catch (err) {
    return next(err);
  }
});

router.post('/sessionDownload', async (req, res, next) => {
  try {
    const { data } = req.body;

    const CSV_DOWNLOAD = gql`
      mutation ($data: String!) {
        csvDownload(data: $data) {
          data
          token
          expires
        }
      }
    `;

    const result = await query(CSV_DOWNLOAD, { data });

    res.json(result.csvDownload.token);
  } catch (err) {
    return next(err);
  }
});

// router.post('/barcodes', async (req, res, next) => {
//   try {
//     // TODO: use IDs to get all student info, send to barcodes for custom text
//     // Modify class mutation to take student first and last names, assign ID, and create new student

//     const ids = req.body.ids;

//     const GET_STUDENTS_BY_ID = gql`
//       query GetStudents($ids: [String]!) {
//         getStudentsByID(ids: $ids) {
//           id
//           firstName
//           lastName
//         }
//       }
//     `;

//     const ADD_DOWNLOAD = gql`
//       mutation AddDownload($data: [String]!) {
//         addDownload(data: $data) {
//           data
//           token
//           expires
//         }
//       }
//     `;

//     const result = await query(ADD_DOWNLOAD, { data: ids });

//     res.json(result.addDownload.token);
//   } catch (err) {
//     return next(err);
//   }
// });

router.post('/session', (req, res, next) => {});

router.use('*', (req, res) => {
  res.redirect('/');
});

export default router;

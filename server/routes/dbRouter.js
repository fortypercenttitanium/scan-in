const router = require('express').Router();
const passport = require('../auth/passport');
const { gql } = require('graphql-request');
const query = require('../helperFunctions/queryHelper');
const { nanoid } = require('nanoid');
require('dotenv').config();

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
        mutation AddStudents($students: [StudentInput!]!) {
          addStudents(students: $students) {
            firstName
            lastName
            id
          }
        }
      `;

      await query(ADD_STUDENTS, { students: newStudents });
      const { studentsByID } = await query(GET_STUDENTS_BY_IDS, { ids });
      res.json(studentsByID);
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

    const CLASS_BY_NAME = gql`
      query Class($name: String!, $userID: ID!) {
        classByName(name: $name, userID: $userID, id: null) {
          id
        }
      }
    `;

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

    const nameTaken = await query(CLASS_BY_NAME, {
      name: classData.name,
      userID: req.user.id,
      id: null,
    });

    if (nameTaken.classByName) {
      return res.json(JSON.stringify({ error: 'Class name already exists' }));
    }

    const classResult = await query(NEW_CLASS, {
      ...classData,
      students: classData.students.map((student) => student.id),
    });

    res.json(JSON.stringify(classResult));
  } catch (err) {
    return next(err);
  }
});

router.put('/students', async (req, res, next) => {
  try {
    const { students, classID } = req.body;

    const GET_STUDENTS_BY_IDS = gql`
      query getStudentsByID($ids: [ID!]!) {
        studentsByID(ids: $ids) {
          id
        }
      }
    `;

    const GET_STUDENTS_BY_CLASS = gql`
      query ($classID: ID!) {
        studentList(classID: $classID) {
          id
        }
      }
    `;

    // gather student IDs from students objects
    const updatedStudentIDs = students.map((student) => student.id);

    // get list of students in the class, remove students who aren't included in the payload
    const classStudents = await query(GET_STUDENTS_BY_CLASS, { classID });
    const studentsToRemove = classStudents.studentList
      .filter(({ id }) => !updatedStudentIDs.includes(id))
      .map((student) => student.id);

    if (studentsToRemove.length) {
      const REMOVE_CLASS_FROM_STUDENTS = gql`
        mutation ($classID: ID!, $studentIDs: [ID!]!) {
          removeClassFromStudents(classID: $classID, studentIDs: $studentIDs) {
            id
            classes
          }
        }
      `;

      await query(REMOVE_CLASS_FROM_STUDENTS, {
        classID,
        studentIDs: studentsToRemove,
      });
    }

    const { studentsByID: currentStudents } = await query(GET_STUDENTS_BY_IDS, {
      ids: updatedStudentIDs,
    });

    const newStudents = students.filter(
      (student) =>
        !currentStudents.some(
          (currentStudent) => student.id === currentStudent.id,
        ),
    );

    if (newStudents.length) {
      const ADD_STUDENTS = gql`
        mutation AddStudents($students: [StudentInput!]!) {
          addStudents(students: $students) {
            firstName
            lastName
            id
          }
        }
      `;

      await query(ADD_STUDENTS, { students: newStudents });
      const { studentsByID } = await query(GET_STUDENTS_BY_IDS, {
        ids: updatedStudentIDs,
      });
      return res.json(studentsByID);
    }

    res.json(currentStudents);
  } catch (err) {
    return next(err);
  }
});

router.put('/class', async (req, res, next) => {
  try {
    const { classData } = req.body;
    classData.owner = req.user.id;

    const EDIT_CLASS = gql`
      mutation ($id: ID!, $students: [ID]!, $name: String!, $owner: ID!) {
        editClass(id: $id, name: $name, students: $students, owner: $owner) {
          id
          students
          owner
          name
        }
      }
    `;

    const CLASS_BY_NAME = gql`
      query Class($name: String!, $userID: ID!, $id: ID) {
        classByName(name: $name, userID: $userID, id: $id) {
          id
        }
      }
    `;

    const nameTaken = await query(CLASS_BY_NAME, {
      name: classData.name,
      userID: req.user.id,
      id: classData.id,
    });

    if (nameTaken.classByName) {
      return res.json(JSON.stringify({ error: 'Class name already exists' }));
    }

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

router.post('/barcodes', async (req, res, next) => {
  try {
    // TODO: use IDs to get all student info, send to barcodes for custom text
    // Modify class mutation to take student first and last names, assign ID, and create new student

    const ids = req.body.ids;

    const GET_STUDENTS_BY_ID = gql`
      query GetStudents($ids: [String]!) {
        getStudentsByID(ids: $ids) {
          id
          firstName
          lastName
        }
      }
    `;

    const ADD_DOWNLOAD = gql`
      mutation AddDownload($data: [String]!) {
        addDownload(data: $data) {
          data
          token
          expires
        }
      }
    `;

    const result = await query(ADD_DOWNLOAD, { data: ids });

    res.json(result.addDownload.token);
  } catch (err) {
    return next(err);
  }
});

router.post('/session', (req, res, next) => {});

router.use('*', (req, res) => {
  res.redirect('/');
});

module.exports = router;

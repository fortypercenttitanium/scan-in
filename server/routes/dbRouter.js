const router = require('express').Router();
const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');
const passport = require('../auth/passport');
const { gql } = require('graphql-request');
const query = require('../helperFunctions/queryHelper');
const { nanoid } = require('nanoid');
const idToBarcode = require('../helperFunctions/idToBarcode');
const zipFiles = require('../helperFunctions/zipFiles');
require('dotenv').config();

router.use(passport.authenticate('jwt', { session: false }));

router.get('/userData', (req, res) => {
  res.json(req.user);
});

router.get('/classes', async (req, res, next) => {
  try {
    const CLASS_LIST = gql`
      query ClassList($userId: ID!) {
        classList(userId: $userId) {
          id
          name
          students
        }
      }
    `;

    const result = await query(CLASS_LIST, { userId: req.user.id });

    res.json(result.classList);
  } catch (err) {
    return next(err);
  }
});

router.post('/students', async (req, res, next) => {
  try {
    const { students } = req.body;

    const GET_STUDENTS_BY_IDS = gql`
      query getStudentsById($ids: [ID!]!) {
        studentsById(ids: $ids) {
          id
        }
      }
    `;

    const ids = students.map((student) => student.id);

    const { studentsById: currentStudents } = await query(GET_STUDENTS_BY_IDS, {
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
      const { studentsById } = await query(GET_STUDENTS_BY_IDS, { ids });
      res.json(studentsById);
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
      query Class($name: String!, $userId: ID!) {
        classByName(name: $name, userId: $userId) {
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
      userId: req.user.id,
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

router.get('/class', async (req, res) => {
  const CLASS = gql`
    query Class($id: ID!, $userId: ID!) {
      class(id: $id, userId: $userId) {
        id
        name
        students
      }
    }
  `;

  const result = await query(CLASS, { id: req.body.id, userId: req.user.id });

  res.json(result.class);
});

router.post('/barcodes', async (req, res, next) => {
  try {
    // TODO: use IDs to get all student info, send to barcodes for custom text
    // Modify class mutation to take student first and last names, assign ID, and create new student

    const ids = req.body.ids;

    const GET_STUDENTS_BY_ID = gql`
      query GetStudents($ids: [String]!) {
        getStudentsById(ids: $ids) {
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

router.use('*', (req, res) => {
  res.redirect('/');
});

module.exports = router;

import React from 'react';
import Box from '@mui/material/Box';
import Faq from 'react-faq-component';

const data = {
  title: 'Help',
  rows: [
    {
      title: 'How do I use this application?',
      content:
        'Create a class, add your students manually or by pasting data from OnCourse, then "Take Attendance" for your class. Students can manually enter their student ID on the Numpad or you can hook up a USB barcode scanner to your computer to scan students in.',
    },
    {
      title: 'How is this better than just taking attendance manually?',
      content:
        'Larger classes can be quite tedious to take attendance for. Having students scan in makes it so you can simply view which students are absent and take attendance that way. Also, some teachers may want the students to work on a do-now at the beginning of class and taking attendance verbally can be an interruption. This app allows you to take attendance quickly and silently while students work.',
    },
    {
      title: 'How can I quickly import my entire class from OnCourse?',
      content:
        '1. Log into OnCourse and open the Reporting tab<br />2. Click "Class Roster Sheet"<br />3. Under "Print Student Name", select "Yes - Name and Local ID"<br />4. Run the report<br />5. Copy the data in the first column with the student info by highlighting it and using the copy function (ctrl + c)<br />6. Click "Add Class", paste the list in, and click "Format List"<br />7. Your list should be properly formatted to create your class.',
    },
    {
      title: "Why can't I change a student's name in my class?",
      content:
        "Once a student has been added to the system, there is no way to edit it from the teacher dashboard. Use the Contact link in the site's footer to request a student name change.",
    },
  ],
};

const config = {
  tabFocus: true,
};

function Help() {
  return (
    <Box sx={{ height: '100%', width: '100%', px: 8, py: 3 }}>
      <Faq data={data} config={config} />
    </Box>
  );
}

export default Help;

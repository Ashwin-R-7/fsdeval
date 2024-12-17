const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:5173', 
  })
);


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'employee_management', 
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Database connected!');
});

app.post('/employees', (req, res) => {
  const { name, employeeId, email, phoneNumber, department, dateOfJoining, role } = req.body;

  if (
    !name ||
    !employeeId ||
    !email ||
    !phoneNumber ||
    !department ||
    !dateOfJoining ||
    !role
  ) {
    return res.status(400).send({ error: 'All fields are required.' });
  }

  const query = `
    INSERT INTO employees (name, employee_id, email, phone_number, department, date_of_joining, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, employeeId, email, phoneNumber, department, dateOfJoining, role],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).send({ error: 'Employee ID or Email already exists.' });
        }
        return res.status(500).send({ error: 'Database error occurred.' });
      }
      res.send({ message: 'Employee added successfully!' });
    }
  );
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

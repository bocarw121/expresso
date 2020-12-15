const express = require('express');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const employeesRouter = express.Router();

const timesheetsRouter = require('./timesheets');


employeesRouter.param('employeeId', (req, res, next, employeeId) => {
  const sql = 'SELECT * FROM employee WHERE id = $employeeId';
  const value = { $employeeId: employeeId };
  db.get(sql, value, (err, employee) => {
    if (err) {
      next(err);
    } else if (employee) {
      req.employee = employeeId;
      return next();
    } else {
      res.sendStatus(404);
    }
  });
});

employeesRouter.use('/:employeeId/timesheets', timesheetsRouter)

// Gets all current active employees
employeesRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM Employee WHERE is_current_employee = 1'
  db.all(sql, (error, employees) => {
    if (error) {
      next(error)
    } else {
      res.status(200).send({ employees })
    }
  });
});

// Returns selected active employee
employeesRouter.get('/:employeeId', (req, res, next) => {
  const sql = 'SELECT * FROM Employee WHERE id = $employeeId';
  const value = { $employeeId: req.employee };
  db.get(sql, value, (err, employee) => {
    if (err) {
      next(err)
    } else {
      res.status(200).json({
        employee
      });
    }
  });
});


// Creates a new employee
employeesRouter.post('/', (req, res, next) => {
  const { name, position, wage } = req.body.employee;
  
  if (!name || !position || !wage) {
    return res.sendStatus(400);
  }

  const sql = 'INSERT INTO Employee (name, position, wage) VALUES ($name, $position, $wage)'
  const values = {
    $name: name,
    $position: position,
    $wage: wage
  } // This.lastID does not work with arrow function
  db.run(sql, values, function (err) {
    if (err) {
      next(err);
    } else {
      console.log(this.lastID)
      db.get(`SELECT * FROM Employee WHERE Employee.id = ${this.lastID}`, (err, employee) => {
        console.log(employee)
        res.status(201).json({ employee });
      });
    }
  });
});


// updates employee
employeesRouter.put('/:employeeId', (req, res, next) => {
  const { name, position, wage } = req.body.employee;
  if (!name || !position, !wage) {
    return res.sendStatus(404);
  }
  const sql = `UPDATE Employee SET name = $name, position = $position, wage = $wage`;
  const value = {
    $name: name,
    $position: position,
    $wage: wage
  }
  db.run(sql, value, (err) => {
    if (err) {
      res.sendStatus(400)
    } else {
      db.get(`SELECT * FROM Employee WHERE id = ${req.params.employeeId}`, (err, employee) => {
        if (err) {
          next(err)
        } else if (!employee) {
          return res.sendStatus(404)
        }
        res.status(200).json({ employee })
      });
    }
  });
});

employeesRouter.delete('/:employeeId', (req, res, next) => {

  const sql = `UPDATE Employee SET is_current_employee = 0 WHERE id = $employeeId`;
  const value = { $employeeId: req.params.employeeId };

  db.run(sql, value, (err) => {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Employee WHERE id = ${req.params.employeeId}`, (err, employee) => {
        res.status(200).json({ employee });
      });
    } 
  });
});


module.exports = employeesRouter;
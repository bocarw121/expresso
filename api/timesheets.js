const express = require('express');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const timesheetsRouter = express.Router({ mergeParams: true });



timesheetsRouter.param('timesheetId', (req, res, next, timesheetId) => {
  const sql = 'SELECT * FROM timesheet WHERE id = $timesheetId';
  const value = { $timesheetId: timesheetId };
  db.get(sql, value, (err, timesheet) => {
    if (err) {
      next(err);
    } else if (timesheet) {
      req.timesheet = timesheet // existing id
      next()
    } else {
      res.sendStatus(404);
    }
  });

});



// returns all timesheets that mathc employee's id
timesheetsRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM Timesheet WHERE employee_id = $employeeId';
  const value = { $employeeId: req.params.employeeId };
  db.all(sql, value, function (err, timesheets) {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ timesheets });
    }
  });
});

timesheetsRouter.post('/', (req, res, next) => {
  const { hours, rate, date } = req.body.timesheet;
  if (!hours || !rate || !date) {
    res.sendStatus(400);
  }
  console.log(req.body)
  const timesheetSql = `INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES ($hours, $rate, $date, $employeeId)`;
  const timesheetValues = {
    $hours: hours,
    $rate: rate,
    $date: date,
    $employeeId: req.params.employeeId
  };
  db.run(timesheetSql, timesheetValues, function (err) { // using name function as opposed to an arrow function to be able to use the this keyword 
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Timesheet WHERE id = ${this.lastID}`, (err, timesheet) => {
      res.status(201).json({ timesheet });
    });
    }
    
  });

});

// Updates employee timesheet
timesheetsRouter.put('/:timesheetId', (req, res, next) => {
  const { hours, rate, date, employeeId } = req.body.timesheet;

  
  if (!hours || !rate || !date) {
    res.sendStatus(400);
  }
    const sql = `UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date, employee_id = $employeeId`;
    const values = {
      $hours: hours,
      $rate: rate,
      $date: date,
      $employeeId: req.params.employeeId
  }
  console.log(req.params.employeeId)
    db.run(sql, values, function (err) {
      if (err) {
        next(err)
      } else {
        db.get(`SELECT * FROM Timesheet WHERE id = ${req.params.employeeId}`, (err, timesheet)  => {
          res.status(200).json({ timesheet });
        });
      }
    });


});

timesheetsRouter.delete










module.exports = timesheetsRouter;
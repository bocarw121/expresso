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
      req.timesheet = timesheetId
    } else {
      res.sendStatus(404);
    }
  });

});




timesheetsRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM Timesheet WHERE employee_id = $employeeId';
  const value = { $employeeId: req.params.employeeId };
  
  db.get(sql, value, (err, timesheet) => {
    if (err) {
      next(err);
    }
  })
})

















module.exports = timesheetsRouter;
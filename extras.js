// const {
//   hours,
//   rate,
//   date,
//   employeeId
// } = req.body.timesheets;
// const employeeId = req.params.employeeId;

// if (!hours || !rate || !date) {
//   next(err)
// }
// const sql = 'SELECT * FROM Timesheet WHERE employee_id = $employeeId';
// const value = {
//   $employeeId: req.params.employeeId
// };

// db.all(sql, value, (err, timesheet) => {
//   if (err) {
//     next(err);
//   }
// })
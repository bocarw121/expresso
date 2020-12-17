const express = require('express');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const menusRouter = express.Router();



menusRouter.param('menuId', (req, res, next, menuId) => {
  const sql = 'SELECT * FROM Menu WHERE id = $menuId';
  const value = { $menuId: menuId };
  db.get(sql, value, (err, menu) => {
    if (err) {
      next(err);
    } else if (menu) {
      req.menu = menu;
      next()
    } else {
      res.sendStatus(404);
    }
  })
})

// Returns all menus
menusRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Menu', (err, menus) => {
    if (err) {
      next(err);
    }
    res.status(200).send({ menus });
  });
});

// return menu for specific menuItemId
menusRouter.get('/:menuId', (req, res, next) => {
  db.get(`SELECT * FROM Menu WHERE id = ${req.params.menuId}`, (err, menu) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ menu });
    }
  })
})

menusRouter.post('/', (req, res, next) => {
  const { title } = req.body.menu;
  console.log(req.body.menu)
  if (!title) {
    res.sendStatus(400)
  }
  const sql = 'INSERT INTO Menu (title) VALUES ($title)';
  const value = { $title: title }
  db.run(sql, value, function (err) {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Menu WHERE id = ${this.lastID}`, (err, menu) => {
        console.log(this.lastID)
        res.status(201).json({ menu });
      });
    }
  });

});

menusRouter.put('/:menuId', (req, res, next) => {
  const { title } = req.body.menu;
  
  if (!title) {
    res.sendStatus(400)
  }

  const sql = 'UPDATE Menu SET title = $tile WHERE id = $menuId';
  const value = { $tile: title, $menuId: req.params.menuId };
  db.run(sql, value, (err) => {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Menu WHERE id = ${req.params.menuId}`, (err, menu) => {
        res.status(200).json({ menu });
      });
    }
  });
});

// delete Menu
menusRouter.delete('/:menuId', (req, res, next) => {
  db.get(`SELECT * FROM MenuItem WHERE menu_id = ${req.params.menuId}`, (err, menuItem) => {
    if (err) {
      next(err);
    } else if (menuItem) {
      res.sendStatus(400);
    } else {
      const sql = 'DELETE FROM Menu WHERE id = $menuId';
      const value = { $menuId: req.params.menuId };

      db.run(sql, value, (err) => {
        if (err) {
          next(err);
        } else {
          res.sendStatus(204);
        }
      })
    }
  });
});






module.exports = menusRouter;
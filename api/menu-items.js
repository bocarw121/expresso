const express = require('express');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const menuItemsRouter = express.Router({ mergeParams: true });


menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
  const sql = 'SELECT * FROM MenuItem WHERE id = $menuItemId';
  const value = { $menuItemId: menuItemId };
  db.get(sql, value, (err, menuItem) => {
    if (err) {
      next(err);
    } else if (menuItem) {
      req.menuItem = menuItem;
      next()
    } else {
      res.sendStatus(404);
    }
  });
});


menuItemsRouter.get('/', (req, res, next) => {

  db.all(`SELECT * FROM MenuItem WHERE menu_id = ${req.params.menuId}`, (err, menuItems) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ menuItems });
    }
  });
});


menuItemsRouter.post('/', (req, res, next) => {
  const {name, description, inventory, price} = req.body.menuItem;
  if (!name || !description || !inventory || !price) {
    res.sendStatus(400);
  }

  const sql = 'INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $menuId)';

  const values = {
    $name: name,
    $description: description,
    $inventory: inventory,
    $price: price,
    $menuId: req.params.menuId
  }
  db.run(sql, values, function (err) {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM MenuItem WHERE id = ${this.lastID}`, (err, menuItem) => {
          res.status(201).json({ menuItem });
      });
    }
  });
});

menuItemsRouter.put('/:menuItemId', (req, res, next) => {
  console.log(req.params.menuId)
  const { name, description, inventory, price} = req.body.menuItem;
  if (!name || !description || !inventory || !price) {
    res.sendStatus(400);
  }

  const sql = `UPDATE MenuItem SET name = $name, description = $description, inventory = $inventory, price = $price, menu_id = $menuId`;
  const values = {
    $name: name,
    $description: description,
    $inventory: inventory,
    $price: price,
    $menuId: req.params.menuId
  }

  db.run(sql, values, function (err) {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM MenuItem WHERE id = ${req.params.menuItemId}`, (err, menuItem) => {
        if (err) {
        }
        res.status(200).json({ menuItem });
      });
    }
  });
});


menuItemsRouter.delete('/:menuItemId', (req, res, next) => {
  db.run(`DELETE FROM MenuItem WHERE id = ${req.params.menuItemId}`, (err) => {
    if (err) {
      next(err);
    }
    res.sendStatus(204)
  });
});



module.exports = menuItemsRouter;
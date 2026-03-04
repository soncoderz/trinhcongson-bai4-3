var express = require('express');
var router = express.Router();
let { dataRole, dataUser } = require('../utils/data2');
let { getItemById } = require('../utils/idHandler');

// Hàm tạo ID tự động cho user (dạng "u1", "u2", ...)
function genUserID(data) {
  let ids = data.map(function (e) {
    return Number.parseInt(e.id.replace('u', ''));
  });
  return 'u' + (Math.max(...ids) + 1);
}

// GET - Lấy tất cả users
router.get('/', function (req, res, next) {
  let result = dataUser.filter(function (e) {
    return !e.isDeleted;
  });
  res.send(result);
});

// GET - Lấy user theo ID
router.get('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataUser.filter(function (e) {
    return e.id == id && !e.isDeleted;
  });
  if (result.length) {
    res.send(result[0]);
  } else {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  }
});

// POST - Tạo user mới
router.post('/', function (req, res, next) {
  // Kiểm tra role có tồn tại không
  let getRole = dataRole.filter(function (e) {
    return e.id == req.body.role && !e.isDeleted;
  });
  if (!getRole.length) {
    res.status(404).send({ message: "ROLE ID NOT FOUND" });
    return;
  }
  let newUser = {
    id: genUserID(dataUser),
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl || "https://i.sstatic.net/l60Hf.png",
    status: req.body.status !== undefined ? req.body.status : true,
    loginCount: 0,
    role: {
      id: getRole[0].id,
      name: getRole[0].name,
      description: getRole[0].description
    },
    creationAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  };
  dataUser.push(newUser);
  res.send(newUser);
});

// PUT - Cập nhật user theo ID
router.put('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataUser.filter(function (e) {
    return e.id == id && !e.isDeleted;
  });
  if (result.length) {
    result = result[0];
    let keys = Object.keys(req.body);
    for (const key of keys) {
      if (key == 'role') {
        let getRole = dataRole.filter(function (e) {
          return e.id == req.body.role && !e.isDeleted;
        });
        if (!getRole.length) {
          res.status(404).send({ message: "ROLE ID NOT FOUND" });
          return;
        }
        result.role = {
          id: getRole[0].id,
          name: getRole[0].name,
          description: getRole[0].description
        };
        continue;
      }
      if (key !== 'id' && key !== 'creationAt') {
        result[key] = req.body[key];
      }
    }
    result.updatedAt = new Date(Date.now());
    res.send(result);
  } else {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  }
});

// DELETE - Xoá user theo ID (soft delete)
router.delete('/:id', function (req, res, next) {
  let id = req.params.id;
  let result = dataUser.filter(function (e) {
    return e.id == id && !e.isDeleted;
  });
  if (result.length) {
    result = result[0];
    result.isDeleted = true;
    result.updatedAt = new Date(Date.now());
    res.send(result);
  } else {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  }
});

module.exports = router;

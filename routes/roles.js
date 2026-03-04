var express = require('express');
var router = express.Router();
let { dataRole, dataUser } = require('../utils/data2');

// Hàm tạo ID tự động cho role (dạng "r1", "r2", ...)
function genRoleID(data) {
    let ids = data.map(function (e) {
        return Number.parseInt(e.id.replace('r', ''));
    });
    return 'r' + (Math.max(...ids) + 1);
}

// GET - Lấy tất cả roles
router.get('/', function (req, res, next) {
    let result = dataRole.filter(function (e) {
        return !e.isDeleted;
    });
    res.send(result);
});

// GET - Lấy role theo ID
router.get('/:id', function (req, res, next) {
    let id = req.params.id;
    let result = dataRole.filter(function (e) {
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

// GET - Lấy tất cả users trong role
router.get('/:id/users', function (req, res, next) {
    let id = req.params.id;
    // Kiểm tra role có tồn tại không
    let roleResult = dataRole.filter(function (e) {
        return e.id == id && !e.isDeleted;
    });
    if (roleResult.length) {
        // Lọc tất cả users có role.id trùng với id
        let users = dataUser.filter(function (e) {
            return e.role.id == id && !e.isDeleted;
        });
        res.send(users);
    } else {
        res.status(404).send({
            message: "ROLE ID NOT FOUND"
        });
    }
});

// POST - Tạo role mới
router.post('/', function (req, res, next) {
    let newRole = {
        id: genRoleID(dataRole),
        name: req.body.name,
        description: req.body.description,
        creationAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
    };
    dataRole.push(newRole);
    res.send(newRole);
});

// PUT - Cập nhật role theo ID
router.put('/:id', function (req, res, next) {
    let id = req.params.id;
    let result = dataRole.filter(function (e) {
        return e.id == id && !e.isDeleted;
    });
    if (result.length) {
        result = result[0];
        let keys = Object.keys(req.body);
        for (const key of keys) {
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

// DELETE - Xoá role theo ID (soft delete)
router.delete('/:id', function (req, res, next) {
    let id = req.params.id;
    let result = dataRole.filter(function (e) {
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

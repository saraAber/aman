const express = require('express');
const router = express.Router();

var mysql = require('mysql');

var con = mysql.createPool(
    {
        connectionLimit: 30,
        host: "127.0.0.1",
        port: 33061,
        user: "root",
        password: "1qaz@WSX",
        database: "haman",

    });

con.getConnection((err) => {
    if (err) throw err;
    con.query("CREATE DATABASE haman", (err, result) => {
        if (err.errno != 1007) throw err;
        con.query('CREATE TABLE IF NOT EXISTS `callers` ( `Id` int NOT NULL AUTO_INCREMENT,' +
            ' `Phone` varchar(12) DEFAULT NULL,`DateCall` datetime DEFAULT NULL,' +
            ' PRIMARY KEY (`Id`))', (err, result) => {
                if (err) throw err;
            })

    });
});

router.get('/', (req, res) => {
    const { countShowInPage, page } = req.query;
    var sql = `SELECT * FROM callers;`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.set('page-size', result.length)
        res.set('Access-Control-Expose-Headers', 'page-size');
        res.send(result.sort((a, b) => a.DateCall < b.DateCall).slice(page * countShowInPage, (parseInt(page) + 1) * countShowInPage));

    });
});


router.post('/', (req, res) => {
    const { Phone } = req.body;
    const isoDate = new Date();
    const mySQLDateString = isoDate.toJSON().slice(0, 19).replace('T', ' ');
    var sql = `INSERT INTO callers (Phone, DateCall) VALUES ('${Phone}','${mySQLDateString}')`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send({ Phone, DateCall: mySQLDateString, Id: result.insertId });
    });
});

router.post('/:id', (req, res) => {
    const { Phone } = req.body;
    const { id } = req.params;
    var sql = `UPDATE callers SET Phone = '${Phone}' WHERE (Id = ${id})`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    var sql = `DELETE FROM callers WHERE (Id =  ${id})`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});


module.exports = router;
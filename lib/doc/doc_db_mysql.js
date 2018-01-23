/*
 * =================================================
 * doc.js
 * All functions related to document management in
 * database MYSQL
 * ==================================================
*/
var mysql = require('mysql'),
    fs = require("fs"),
    glob = require("glob"),
    path = require("path");
    //  leer la configurción de MySQL
var config = require("../../configMySQL.json");
var sql = "";

// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    });
    connection.connect(function(err) {
        if (err) throw err;
    });
    return connection;
}

// closeConnection
// función auxiliar para cerrar una conexión
function closeConnection(connection) {
    connection.end(function(err) {
        if (err) {
            throw err;
        }
    });
}

function closeConnectionCallback(connection, callback) {
    connection.end(function(err) {
        if (err) callback(err);
    });
}


    module.exports.get = function (done) {
        getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId ";
            con.query(sql, function (err, res) {
                closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        });
    }

    module.exports.getDocs = function (done) {
        getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId ";
            sql += " WHERE ext NOT IN ('jpg','png','gif');"
            con.query(sql, function (err, res) {
                closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        });
    }

    module.exports.getImages =  function (done) {
        getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId ";
            sql += " WHERE ext IN ('jpg','png','gif');"
            con.query(sql, function (err, res) {
                closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        });
    }

    module.exports.getById = function (id, done) {
        getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId WHERE docId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        });
    }

    module.exports.getByPwId = function (id, done) {
        getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId WHERE d.pwId = ? AND d.woId IS NULL";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        });
    }

    module.exports.getByPwIdDocs = function (id, done) {
        getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId WHERE d.pwId = ? AND d.woId IS NULL";
            sql += " AND ext NOT IN ('jpg','png','gif');"
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        });
    }

    module.exports.getByPwIdImages = function (id, done) {
        getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName";
            sql += " FROM doc As d";
            sql += " LEFT JOIN wo ON wo.woId = d.woId";
            sql += " LEFT JOIN pw ON pw.pwId = wo.pwId";
            sql += " LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId";
            sql += " WHERE pw.pwId = ?";
            sql += " AND ext IN ('jpg','png','gif');"
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        });
    }

    module.exports.getByWoId = function (id, done) {
        getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId WHERE d.woId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        });
    }

    module.exports.getByWoIdImages = function (id, done) {
        getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT d.*, pw.name as pwName, doc_type.name as typeName FROM doc As d LEFT JOIN pw ON pw.pwId = d.pwId LEFT JOIN doc_type ON doc_type.docTypeId = d.docTypeId WHERE d.woId = ?";
            sql += " AND ext IN ('jpg','png','gif');"
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                closeConnection(con);
                if (err) return done(err);
                var docs = [];
                res.forEach(function (gdb) {
                    docs.push(fnCompanyDbToJs(gdb));
                });
                done(null, docs);
            });
        });
    }

    module.exports.post = function (doc, done) {
        // obtain db record
        //var gdb = fnCompanyJsToDb(doc);
        var connection = getConnection();
        var ext = doc.file.split('.').pop().toLowerCase();
        doc.ext = ext; // assing doc extension to a specific column
        doc.docId = '1';
        var fromFile = path.join(__dirname, '../public/ficheros/uploads/' + doc.file);
        var toFile = path.join(__dirname, '../public/ficheros/facturas_proveedores/' + doc.docId + "." + ext);
        fs.renameSync(fromFile, toFile);
        done(null, fnCompanyDbToJs(doc));
        
    }

    module.exports.put = function (doc, done) {
        var gdb = fnCompanyJsToDb(doc);
        getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "UPDATE doc SET ? WHERE docId = ?";
            sql = mysql.format(sql, [gdb, gdb.docId]);
            con.query(sql, function (err, res) {
                closeConnection(con);
                if (err) return done(err);
                done(null, fnCompanyDbToJs(doc));
            });
        });
    }

    module.exports.delete = function (id, file, done) {
        getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "DELETE FROM doc WHERE docId = ?";
            sql = mysql.format(sql, id);
            con.query(sql, function (err, res) {
                closeConnection(con);
                if (err) return done(err);
                var ext = file.split('.').pop().toLowerCase();
                var filename = path.join(__dirname, '../public/docs/' + id + "." + ext);
                fs.unlinkSync(filename);
                done(null);
            });
        });
    }

    module.exports.deleteUploads = function (id, done) {
        // delete user files un uploads directory
        var appDir = path.dirname(require.main.filename);
        var pathToFiles = path.join(appDir, '/public/uploads/', id + "@*.*");
        glob(pathToFiles, function (err, files) {
            if (err) return done(err);
            files.forEach(function (f) {
                fs.unlinkSync(f);
            });
            done(null, "OK");
        });
    }


// fnCompanyDbToJs:
// transfors a db record into a js object
var fnCompanyDbToJs = function (gdb) {
    var g = gdb;
    return g;
}

// fnCompanyJsToDb
// transforms a js object into a db record
var fnCompanyJsToDb = function (g) {
    return g;
}

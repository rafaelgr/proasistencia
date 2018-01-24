/*
 * =================================================
 * doc.js
 * All functions related to document management in
 * database MYSQL
 * ==================================================
*/
var fs = require("fs"),
    path = require("path");
    
    //  leer la configurción de MySQL
var config = require("../../configMySQL.json");
var sql = "";



    module.exports.post = function (doc, done) {
        var fromFile = path.join(__dirname, '../../public/ficheros/uploads/' + doc.file);
        var toFile = path.join(__dirname, '../../public/ficheros/facturas_proveedores/' + doc.docId + "." + doc.ext);
        fs.renameSync(fromFile, toFile);
        done(null, fnCompanyDbToJs(doc));
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

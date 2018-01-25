/*
 * =================================================
 * doc.js
 * All functions related to document management
 * ==================================================
*/
var fs = require("fs"),
    path = require("path");
    
    module.exports.post = function (doc, done) {
        var fromFile = path.join(__dirname, '../../public/ficheros/uploads/' + doc.file);
        var toFile = path.join(__dirname, '../../public/ficheros/facturas_proveedores/' + doc.docId + "." + doc.ext);
        fs.renameSync(fromFile, toFile);
        done(null, fnCompanyDbToJs(doc));
    }

    module.exports.delete = function (file, done) {
        var filename = path.join(__dirname, '../../public/ficheros/facturas_proveedores/' + file);
        fs.unlinkSync(filename);
        done(null);
    }

    

// fnCompanyDbToJs:
// transfors a db record into a js object
var fnCompanyDbToJs = function (gdb) {
    var g = gdb;
    return g;
}


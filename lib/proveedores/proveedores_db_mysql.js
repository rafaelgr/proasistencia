// proveedores_db_mysql
// Manejo de la tabla proveedores en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var com = require("../comun/comun");

//  leer la configurción de MySQL
var config = require("../../configMySQL.json");
var sql = "";



// comprobarProveedor
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarProveedor(proveedor) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof proveedor;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && proveedor.hasOwnProperty("proveedorId"));
    comprobado = (comprobado && proveedor.hasOwnProperty("nombre"));
    comprobado = (comprobado && proveedor.hasOwnProperty("nif"));
    return comprobado;
}



// getProveedores
// lee todos los registros de la tabla proveedores y
// los devuelve como una lista de objetos
module.exports.getProveedores = function (callback) {
    var connection = com.getConnection();
    var proveedores = null;
    sql = "SELECT * FROM proveedores ORDER BY nombre";
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        proveedores = result;
        callback(null, proveedores);
    });
}

module.exports.getProveedorById = function(id, callback){
    var connection = com.getConnection();
    sql = "SELECT * FROM proveedores where proveedorId = ?";
    sql = mysql.format(sql, id);
    

}

// postProveedor
// crear en la base de datos el proveedor pasado
module.exports.postProveedor = function (proveedor, callback) {
    if (!comprobarProveedor(proveedor)) {
        var err = new Error("El proveedor pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = com.getConnection();
    proveedor.proveedorId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO proveedores SET ?";
    sql = mysql.format(sql, proveedor);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        proveedor.proveedorId = result.insertId;
        updateComisionista(proveedor.proveedorId, function (err) {
            if (err) return callback(err);
            updateProveedorConta(proveedor, function (err) {
                if (err) return callback(err);
                callback(null, proveedor);
            });
        })
    });
}

// putProveedor
// Modifica el proveedor según los datos del objeto pasao
module.exports.putProveedor = function (id, proveedor, callback) {
    if (!comprobarProveedor(proveedor)) {
        var err = new Error("El proveedor pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != proveedor.proveedorId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = com.getConnection();
    sql = "UPDATE proveedores SET ? WHERE proveedorId = ?";
    sql = mysql.format(sql, [proveedor, proveedor.proveedorId]);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        updateProveedorConta(proveedor, function (err) {
            if (err) return callback(err);
            callback(null, proveedor);
        });
    });
}

// deleteProveedor
// Elimina el proveedor con el id pasado
module.exports.deleteProveedor = function (id, proveedor, callback) {
    deleteProveedorConta(id, function (err) {
        if (err) return callback(err);
        var connection = com.getConnection();
        sql = "DELETE from proveedores WHERE proveedorId = ?";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            com.closeConnection(connection);
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    });
}

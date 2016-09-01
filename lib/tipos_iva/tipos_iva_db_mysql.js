// tipos_iva_db_mysql
// Manejo de la tabla tipos_iva de la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var comun = require("../comun/comun");
var contabilidadDb = require("../contabilidad/contabilidad_db_mysql");

//  leer la configurción de MySQL
var config = require("../../configMySQL.json");
var sql = "";

// comprobarTipoIva
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTipoIva(tipoIva) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof tipoIva;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && tipoIva.hasOwnProperty("tipoIvaId"));
    comprobado = (comprobado && tipoIva.hasOwnProperty("nombre"));
    return comprobado;
}


// getTipoIvas
// lee todos los registros de la tabla tipoIvas y
// los devuelve como una lista de objetos
module.exports.getTiposIva = function (callback) {
    var connection = comun.getConnection();
    var tipoIvas = null;
    sql = "SELECT * FROM tipos_iva";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        tiposIva = result;
        callback(null, tiposIva);
    });
}

// getTipoIvasBuscar
// lee todos los registros de la tabla tipoIvas cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getTiposIvaBuscar = function (nombre, callback) {
    var connection = comun.getConnection();
    var tipoIvas = null;
    var sql = "SELECT * from tipos_iva";
    if (nombre !== "*") {
        sql = "SELECT * from tipos_iva";
        sql += "  WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        tiposIvas = result;
        callback(null, tiposIvas);
    });
}

// getTipoIva
// busca  el tipoIva con id pasado
module.exports.getTipoIva = function (id, callback) {
    var connection = comun.getConnection();
    var tipoIvas = null;
    sql = "SELECT * from tipos_iva";
    sql += "  WHERE tipoIvaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}


// postTipoIva
// crear en la base de datos el tipoIva pasado
module.exports.postTipoIva = function (tipoIva, callback) {
    if (!comprobarTipoIva(tipoIva)) {
        var err = new Error("El tipo de IVA pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = comun.getConnection();
    tipoIva.tipoIvaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO tipos_iva SET ?";
    sql = mysql.format(sql, tipoIva);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        tipoIva.tipoIvaId = result.insertId;
        updateTipoIvaConta('post', tipoIva, function (err) {
            if (err) return callback(err);
            callback(null, tipoIva);
        })
    });
}

// putTipoIva
// Modifica el tipoIva según los datos del objeto pasao
module.exports.putTipoIva = function (id, tipoIva, callback) {
    if (!comprobarTipoIva(tipoIva)) {
        var err = new Error("El tipo de IVA pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != tipoIva.tipoIvaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = comun.getConnection();
    sql = "UPDATE tipos_iva SET ? WHERE tipoIvaId = ?";
    sql = mysql.format(sql, [tipoIva, tipoIva.tipoIvaId]);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        updateTipoIvaConta('put', tipoIva, function (err) {
            if (err) return callback(err);
            callback(null, tipoIva);
        })

    });
}

// deleteTipoIva
// Elimina el tipoIva con el id pasado
module.exports.deleteTipoIva = function (id, tipoIva, callback) {
    var connection = comun.getConnection();
    sql = "DELETE from tipos_iva WHERE tipoIvaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// updateTipoIvaConta
// actualiza el tipo de iva pasado en todas las contabilidades
// si en el parámetro modo se le ha pasdo 'post' los intentará crear
// si se le ha pasado 'put' lo intentará modificar.
var updateTipoIvaConta = function (mode, tipoIva, done) {
    // obtenemos la información contable que nos interesa
    contabilidadDb.getInfContable(function (err, result) {
        if (err) return done(err);
        var infContable = result;
        // primero trasformamos el tipo de iva de gestión en uno de contabilidades
        var tipoIvaConta = transformaIvaGestionContable(tipoIva, infContable.numDigitos);
        // obtenemos todas las contabilidades a actualizar
        var dbContas = [];
        for (var i = 0; i < infContable.contas.length; i++) {
            dbContas.push(infContable.contas[i].contabilidad);
        }
        // segun el modo creamos la plantilla de sql que se usará
        var sql = "";
        switch (mode) {
            case "post":
                sql = "INSERT INTO tiposiva SET ?";
                break;
            case "put":
                sql = "UPDATE tiposiva SET ? WHERE tiposiva.codigiva = ?";
                break;
            default:
                sql = "UPDATE tiposiva SET ? WHERE tiposiva.codigiva = ?";
                break;
        }
        // actualizamos todas las contabilidades
        async.each(dbContas, function (conta, callback) {
            var connection = comun.getConnectionDb(conta);
            sql = mysql.format(sql, [tipoIvaConta, tipoIvaConta.codigiva]);
            connection.query(sql, function (err) {
                comun.closeConnection(connection);
                if (err) return callback(err);
                callback();
            })
        }, function (err) {
            if (err) return done(err);
            done();
        })
    })
}

// transformaIvaGestionContable
// a partir de un objeto tipoIva de la gestión crea y devuelve
// un objeto de tipo iva de la contabilidad
var transformaIvaGestionContable = function (tipoIva, numdigitos) {
    // tipo en contabilidad 
    var tipoIvaConta = {
        codigiva: tipoIva.codigoContable,
        nombriva: tipoIva.nombre,
        tipodiva: 0,
        porceiva: tipoIva.porcentaje,
        cuentare: montaCuentaContable('477', tipoIva.codigoContable, numdigitos),
        cuentarr: montaCuentaContable('477', tipoIva.codigoContable, numdigitos),
        cuentaso: montaCuentaContable('472', tipoIva.codigoContable, numdigitos),
        cuentasr: montaCuentaContable('472', tipoIva.codigoContable, numdigitos),
        cuentasn: montaCuentaContable('477', tipoIva.codigoContable, numdigitos)
    };
    return tipoIvaConta;
}
// montaCuentaContable
// encadena el inicio y final añadiendo en medio tantos ceros
// como sean necesarios para llegar a longitud de numdigitos
var montaCuentaContable = function (inicio, final, numdigitos) {
    var s1 = '' + inicio + final;
    var n1 = s1.length;
    var n2 = numdigitos - n1;
    var s2 = Array(n2).join('0');
    return '' + inicio + s2 + final;
}
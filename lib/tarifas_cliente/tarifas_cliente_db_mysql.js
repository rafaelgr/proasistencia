// tarifas_db_mysql 
// Manejo de la tabla tarifas_cliente en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS


var sql = "";

// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
    var connection = mysql.createConnection({
		host: process.env.BASE_MYSQL_HOST,
		user: process.env.BASE_MYSQL_USER,
		password: process.env.BASE_MYSQL_PASSWORD,
		database: process.env.BASE_MYSQL_DATABASE,
		port: process.env.BASE_MYSQL_PORT
    });
    connection.connect(function(err) {
        if (err) throw err;
    });
    return connection;
}
// closeConnection
// función auxiliar para cerrar una conexión
function closeConnection(connection) {
    connection.end(function (err) {
        if (err) {
            throw err;
        }
    });
}

function closeConnectionCallback(connection, callback) {
    connection.end(function (err) {
        if (err) callback(err);
    });
}

// comprobartarifa
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTarifa(tarifa_cliente) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof tarifa_cliente;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && tarifa_cliente.hasOwnProperty("tarifaClienteId"));
    comprobado = (comprobado && tarifa_cliente.hasOwnProperty("nombre"));
    return comprobado;
}


// getTarifasCliente
// lee todos los registros de la tabla tarifas_cliente 
// los devuelve como una lista de objetos
module.exports.getTarifasCliente = function (callback) {
    var connection = getConnection();
    var tarifas_cliente = null;
    sql = "SELECT * FROM tarifas_cliente";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        tarifas_cliente = result;
        callback(null, tarifas_cliente);
    });
}

// getTarifa
// busca  el tarifa_cliente con id pasado
module.exports.getTarifaCliente = function (id, callback) {
    var connection = getConnection();
    var tarifas_cliente = null;
    sql = "SELECT  * FROM tarifas_cliente";
    sql += " WHERE tarifaClienteId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}






module.exports.getTarifasGrupo = function(grupoId, callback){
    var connection = getConnection();
    sql = "SELECT * FROM tarifas_cliente";
    sql += " WHERE grupoTarifaId = ?";
    sql = mysql.format(sql, grupoId);
    connection.query(sql, function (err, result){
        closeConnectionCallback(connection, callback);
        if(err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}


// postTarifa
// crear en la base de datos el tarifa_cliente pasado
module.exports.postTarifaCliente = function (tarifa_cliente, callback) {
    if (!comprobarTarifa(tarifa_cliente)) {
        var err = new Error("la tarifa pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    tarifa_cliente.tarifaClienteId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO tarifas_cliente SET ?";
    sql = mysql.format(sql, tarifa_cliente);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        tarifa_cliente.tarifaClienteId = result.insertId;
        callback(null, tarifa_cliente);
    });
}

module.exports.postContabilizarTarifasCliente = function (dFecha, hFecha, done) {
    var con = getConnection();
    var sql = "";
    sql = "SELECT * FROM empresas;";
    con.query(sql, function (err, empresas) {
        async.eachSeries(empresas, function (empresa, callback) {
            contabilizarEmpresa(dFecha, hFecha, empresa, function (err) {
                if (err) return callback(err);
                callback();
            });
        }, function (err) {
            if (err) return done(err);
            done(null, 'OK');
        });
    });
}




// putTarifa
// Modifica el tarifa_cliente según los datos del objeto pasao
module.exports.putTarifaCliente = function (id, tarifa_cliente, callback) {
    if (!comprobarTarifa(tarifa_cliente)) {
        var err = new Error("El tarifa pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != tarifa_cliente.tarifaClienteId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE tarifas_cliente SET ? WHERE tarifaClienteId = ?";
    sql = mysql.format(sql, [tarifa_cliente, tarifa_cliente.tarifaClienteId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, tarifa_cliente);
    });
}

// deleteTarifa
// Elimina el tarifa_cliente con el id pasado
module.exports.deleteTarifaCliente = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE from tarifas_cliente WHERE tarifaClienteId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// deleteTarifasContrato
// Elimina todas las tarifas_cliente pertenecientes a un contrato.
module.exports.deleteTarifasClienteContrato = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE from tarifas_cliente WHERE contratoClienteMantenimientoId = ? AND generada = 1";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


/*
|---------------------------------------|
|                                       |
|  LINEAS TARIFAS                       |
|                                       |
|---------------------------------------|
*/


// comprobartarifaClienteLinea
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobartarifaClienteLinea(tarifaClienteLinea) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof tarifaClienteLinea;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && tarifaClienteLinea.hasOwnProperty("tarifaClienteLineaId"));
    comprobado = (comprobado && tarifaClienteLinea.hasOwnProperty("tarifaClienteId"));
    comprobado = (comprobado && tarifaClienteLinea.hasOwnProperty("articuloId"));
    comprobado = (comprobado && tarifaClienteLinea.hasOwnProperty("precioUnitario"));
    return comprobado;
}


// gettarifaClienteLineas
// Devuelve todas las líneas de una tarifa_cliente
module.exports.getTarifaClienteLineas = function (id, callback) {
    var connection = getConnection();
    sql = "SELECT a.nombre AS unidadConstructiva, tf.*, tp.nombre AS profesion, a.codigoReparacion, u.abrev AS unidad";
    sql += " FROM tarifas_cliente_lineas AS tf"
    sql += " LEFT JOIN articulos AS a ON a.articuloId = tf.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = a.unidadId";
    sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = a.tipoProfesionalId";
    sql += " WHERE tf.tarifaClienteId = ?";
    sql += " ORDER BY tp.nombre";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        } 
        callback(null, result);
    });
}

// gettarifaClienteLinea
// Devuelve la línea de tarifa_cliente solcitada por su id.
module.exports.getTarifaClienteLinea = function (id, callback) {
    var connection = getConnection();
    var tarifas_cliente = null;
    sql = "SELECT pfl.*, a.grupoArticuloId FROM tarifas_cliente_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " WHERE pfl.tarifaClienteLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// gettarifaClienteLinea
// Devuelve la línea de tarifa_cliente solcitada por su id.
module.exports.getTarifaClienteLineasProfesion = function (tarifaClienteId, tiposProfesionales, callback) {
    var connection = getConnection();
    
    sql = "SELECT a.nombre AS unidadConstructiva, tf.*, tp.nombre AS profesion, a.codigoReparacion, u.abrev AS unidad";
    sql += "  FROM tarifas_cliente_lineas AS tf"
    sql += " LEFT JOIN articulos AS a ON a.articuloId = tf.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = a.unidadId";
    sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = a.tipoProfesionalId";
    sql += " WHERE tf.tarifaClienteId = ? AND tp.tipoProfesionalId IN (?)";
    sql += " ORDER BY tp.nombre";
    sql = mysql.format(sql, [tarifaClienteId, tiposProfesionales]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        } 
        callback(null, result);
    });
}

module.exports.getArticuloTarifa= function (articuloId, tarifaClienteId, callback){
    var connection = getConnection();
    sql = "SELECT * FROM tarifas_cliente_lineas";
    sql += " WHERE articuloId = ?";
    sql += " AND tarifaClienteId = ?";
    sql = mysql.format(sql, [articuloId, tarifaClienteId]);
    connection.query(sql, function(err, result){
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    })

}

// posttarifaClienteLinea
// crear en la base de datos la linea de tarifa_cliente pasada
module.exports.postTarifaClienteLinea = function (tarifaClienteLinea, callback) {
    if (!comprobartarifaClienteLinea(tarifaClienteLinea)) {
        var err = new Error("La linea de tarifa pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    tarifaClienteLinea.tarifaClienteLineaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO tarifas_cliente_lineas SET ?";
    sql = mysql.format(sql, tarifaClienteLinea);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, tarifaClienteLinea);
    });
}

module.exports.postTarifaClienteLineaMultiple = function (tarifaClienteLinea, callback) {
    var connection = getConnection();
    sql = "INSERT INTO tarifas_cliente_lineas (tarifaClienteId, articuloId, precioUnitario)";
    sql += " SELECT ?, articuloId, precioUnitario * ? AS nuevoPrecio FROM articulos"
    sql += " WHERE grupoArticuloId = ?"
    sql = mysql.format(sql, [tarifaClienteLinea.tarifaClienteId, tarifaClienteLinea.porcentaje, tarifaClienteLinea.grupoArticuloId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, tarifaClienteLinea);
    });
}

module.exports.postTarifaClienteLineaMultipleTodos= function(tarifaClienteLinea, callback) {
    var connection = getConnection();
    sql = "INSERT INTO tarifas_cliente_lineas (tarifaClienteId, articuloId, precioUnitario)";
    sql += " SELECT ?, articuloId, precioUnitario * ? AS nuevoPrecio FROM articulos"
    sql = mysql.format(sql, [tarifaClienteLinea.tarifaClienteId, tarifaClienteLinea.porcentaje, tarifaClienteLinea.capitulo]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, tarifaClienteLinea);
    });
}

module.exports.postTarifaClienteCopia = function(tarifaCliente, callback) {
    var connection = getConnection();
    sql = "INSERT INTO tarifas_cliente_lineas (tarifaClienteId,precioUnitario,articuloId)";
    sql += " SELECT tmp.tarifaClienteId, tmp.precioUnitario, tmp.articuloId FROM ";
    sql += " (SELECT tp.tarifaClienteId, tpl.articuloId, tpl.precioUnitario FROM tarifas_cliente as  tp";
    sql += " LEFT JOIN tarifas_cliente_lineas AS tpl ON tpl.tarifaClienteId = ?";
    sql += " LEFT JOIN articulos AS ar ON ar.articuloId = tpl.articuloId";
    sql += " WHERE tp.tarifaClienteId = ?"
    if(tarifaCliente.tiposProfesionalesId.length > 0) {
        sql += " AND ar.tipoProfesionalId IN (?)) AS tmp";
        sql = mysql.format(sql, [tarifaCliente.tarifaClienteId, tarifaCliente.nuevaTarifaClienteId, tarifaCliente.tiposProfesionalesId]);
    } else {
        sql += ") AS tmp";
        sql = mysql.format(sql, [tarifaCliente.tarifaClienteId, tarifaCliente.nuevaTarifaClienteId]);
    }
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
}



// puttarifaClienteLinea
// Modifica la linea de tarifa según los datos del objeto pasao
module.exports.putTarifaClienteLinea = function (id, tarifaClienteLinea, callback) {
    if (!comprobartarifaClienteLinea(tarifaClienteLinea)) {
        var err = new Error("La linea de tarifa pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != tarifaClienteLinea.tarifaClienteLineaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE tarifas_cliente_lineas SET ? WHERE tarifaClienteLineaId = ?";
    sql = mysql.format(sql, [tarifaClienteLinea, tarifaClienteLinea.tarifaClienteLineaId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, tarifaClienteLinea);
    });
}

// deletetarifaClienteLinea
// Elimina la linea de tarifa con el id pasado
module.exports.deleteTarifaClienteLinea = function (id, tarifaClienteLinea, callback) {
    var connection = getConnection();
    sql = "DELETE from tarifas_cliente_lineas WHERE tarifaClienteLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}



// deleteTarifaClienteLineaPorTipos
module.exports.deleteTarifaClienteLineaPorTipos = function (tarifaClienteId, tipos, callback) {
    var connection = getConnection();
    
    sql = "DELETE tcl";
    sql += " FROM tarifas_cliente_lineas AS tcl "
    sql += " LEFT JOIN articulos AS ar ON ar.articuloId = tcl.articuloId";
    sql += " WHERE tcl.tarifaClienteId = ?";
    sql = mysql.format(sql, tarifaClienteId);
    if(tipos.tiposProfesionales.length > 0) {
        sql += " AND ar.tipoProfesionalId IN (?)";
        sql = mysql.format(sql, [tipos.tiposProfesionales]);
    }
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

module.exports.putTarifaClienteLineaPorcentaje= function(porcentaje, tipos, tarifaId,callback) {
    var connection = getConnection();
    sql = "UPDATE tarifas_cliente_lineas AS tcl";
    sql += " LEFT JOIN articulos AS ar ON ar.articuloId = tcl.articuloId ";
    sql += " SET tcl.precioUnitario = tcl.precioUnitario + (tcl.precioUnitario * "+porcentaje+")";
    sql += " WHERE  tcl.tarifaClienteId = " + tarifaId
    if(tipos.length > 0) {
        sql += " AND ar.tipoProfesionalId IN (?)";
        sql = mysql.format(sql, [tipos])
    }
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
}

module.exports.getTarifaClienteAgente = function (id, esCliente, callback) {
    var connection = getConnection();
    var sql = "SELECT DISTINCT tc.*, a.tipoProfesionalId, tp.nombre AS tipoProfesionalNombre";
    sql += " FROM tarifas_cliente tc";
    sql += " LEFT JOIN `tarifas_cliente_lineas` AS tcl ON tcl.tarifaClienteId = tc.tarifaClienteId";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = tcl.articuloId";
    sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = a.tipoProfesionalId";
    if(esCliente == 'true') {
        sql += " LEFT JOIN clientes AS c ON c.tarifaId = tc.tarifaClienteId";
        sql += "  WHERE c.clienteId = ?";
        sql = mysql.format(sql, id);
    } else {
        sql += " LEFT JOIN comerciales AS co ON co.tarifaId = tc.tarifaClienteId";
        sql += "  WHERE co.comercialId = ?";
        sql = mysql.format(sql, id);
    }
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        callback(null, result);
    })
}




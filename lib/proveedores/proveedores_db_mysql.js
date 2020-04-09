// proveedores_db_mysql
// Manejo de la tabla proveedores en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

var contabilidadDb = require("../contabilidad/contabilidad_db_mysql");
var com = require("../comun/comun");

//  leer la configurción de MySQL

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
    var connection = getConnection();
    var proveedores = null;
    sql = "SELECT * FROM proveedores";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        proveedores = result;
        callback(null, proveedores);
    });
}

// getProveedoresBuscar
// lee todos los registros de la tabla proveedores cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getProveedoresBuscar = function (nombre, callback) {
    var connection = getConnection();
    var proveedores = null;
    var sql = " SELECT p.*, tp.nombre AS profesion, d.nombre AS departamento  FROM proveedores AS p";
    sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = p.tipoProfesionalId";
    sql += " LEFT JOIN departamentos AS d ON d.departamentoId = p.departamentoId";
    if (nombre !== "*") {
        sql += " WHERE p.nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        proveedores = result;
        callback(null, proveedores);
    });
}

// getProveedor
// busca  el proveedor con id pasado
module.exports.getProveedor = function (id, callback) {
    var connection = getConnection();
    var proveedores = null;
    sql = "SELECT p.*, tp.inicioCuenta, tp2.nombre AS profesion, d.nombre AS departamento FROM proveedores AS p";
    sql += " LEFT JOIN tipos_proveedor AS tp ON tp.tipoProveedorId = p.tipoProveedor";
    sql += " LEFT JOIN tipos_profesionales AS tp2 ON tp2.tipoProfesionalId = p.tipoProfesionalId";
    sql += " LEFT JOIN departamentos AS d ON d.departamentoId = p.departamentoId";
    sql += " WHERE p.proveedorId = ?"
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


module.exports.getProveedorCuentaContable = function (cuentaContable, callback) {
    var connection = getConnection();
    var proveedores = null;
    sql = "SELECT * FROM proveedores WHERE cuentaContable = ?";
    sql = mysql.format(sql, cuentaContable);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        if (result[0] == null) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}

// getNuevoCodigo
// busca la siguiente id en la tabla
module.exports.getNuevoCodProveedor = function (callback) {
    var connection = getConnection();
    var proveedores = null;
    sql = "SELECT COALESCE(MAX(codigo) +1, 1) codigo FROM proveedores";
    sql += " WHERE codigo < 9000";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result[0]);
    });
}



module.exports.getProveedorPorNif = function (nif, callback) {
    var connection = getConnection();
    sql = "SELECT * FROM proveedores WHERE nif = ? AND fechaBaja IS NULL";
    sql = mysql.format(sql, nif);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        if (result[0] == null) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}


module.exports.getProveedorPorTipo = function (nif, callback) {
    var connection = getConnection();
    sql = "SELECT * FROM proveedores WHERE tipoProfesionalId = ?";
    sql = mysql.format(sql, nif);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// getProveedoresActivos
// devuelve los proveedores que no estén dados de baja
module.exports.getProveedoresActivos = function (nombre, callback) {
    var connection = getConnection();
    var proveedores = null;
    if(nombre !== "*") {
        sql = "SELECT *, CONCAT(nombre, '  ', cuentaContable) AS nomconcat FROM proveedores WHERE nombre LIKE ? AND fechaBaja IS NULL";
        sql = mysql.format(sql, '%' + nombre + '%');
    } else {
        sql = "SELECT *, CONCAT(nombre, '  ', cuentaContable) AS nomconcat FROM proveedores WHERE  fechaBaja IS NULL";
    }
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        proveedores = result;
        callback(null, proveedores);
    });
}

// getProveedoresActivos
// devuelve los proveedores que no estén dados de baja
module.exports.getProveedoresActivosNif = function (nif, callback) {
    var connection = getConnection();
    var proveedores = null;
   
        sql = "SELECT * FROM proveedores WHERE nif LIKE ? AND fechaBaja IS NULL";
        sql = mysql.format(sql, '%' + nif + '%');
    
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        proveedores = result;
        callback(null, proveedores);
    });
}

//DEVUELVE LOS DEPARTAMENTOS ASOCIADOS A UN PROVEEDOR
module.exports.getDepartamentosAsociados = function (proveedorId, callback) {
    var connection = getConnection();
    sql = "SELECT pd.departamentoId FROM departamentos AS dep";
    sql += " LEFT JOIN proveedores_departamentos as pd on pd.departamentoId = dep.departamentoId";
    sql += " WHERE pd.proveedorId = ?"
    sql = mysql.format(sql, proveedorId);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}
// postProveedor
// crear en la base de datos el proveedor pasado
module.exports.postProveedor = function (proveedor, callback) {
    var departamentos = proveedor.departamentos.departamentos;
    var proveedor = proveedor.proveedor;
    if (!comprobarProveedor(proveedor)) {
        var err = new Error("El proveedor pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    proveedor.proveedorId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO proveedores SET ?";
    sql = mysql.format(sql, proveedor);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        proveedor.proveedorId = result.insertId;
        /*callback(null, proveedor);*/
        updateProveedorConta(proveedor, function (err) {
            if (err) return callback(err);
            updateDepartamentosAsociados(departamentos, proveedor.proveedorId, function (err) {
                if (err) return callback(err);
            });
            callback(null, proveedor);
        });
    });
}

// putProveedor
// Modifica el proveedor según los datos del objeto pasao
module.exports.putProveedor = function (id, proveedor, callback) {
    var departamentos = proveedor.departamentos.departamentos;
    var proveedor = proveedor.proveedor;
    delete proveedor.departamentos;
    if (!comprobarProveedor(proveedor)) {
        var err = new Error("El proveedor pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != proveedor.proveedorId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE proveedores SET ? WHERE proveedorId = ?";
    sql = mysql.format(sql, [proveedor, proveedor.proveedorId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        /*callback(null, proveedor);*/
        updateProveedorConta(proveedor, function (err) {
            if (err) return callback(err);
            updateDepartamentosAsociados(departamentos,proveedor.proveedorId, function (err) {
                if (err) return callback(err);
                callback(null, proveedor);
            });
        });
    });
}

// deleteProveedor
// Elimina el proveedor con el id pasado
module.exports.deleteProveedor = function (id, proveedor, callback) {
    deleteProveedorConta(id, function (err) {
        if (err) return callback(err);
        var connection = getConnection();
        sql = "DELETE from proveedores WHERE proveedorId = ?";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            closeConnectionCallback(connection, callback);
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    });
}

module.exports.getPrecioUnitario = function (id, codigoReparacion, callback) {
    var connection = com.getConnection();
    var clienteComisionistas = null;
    var sql = "SELECT   tpl.precioUnitario AS precioProveedor";
    sql += " FROM articulos AS ar";
    sql += " LEFT JOIN tarifas_proveedor_lineas AS tpl ON tpl.articuloId = ar.articuloId";
    sql += " LEFT JOIN tarifas_proveedor AS tp ON tp.tarifaProveedorId = tpl.tarifaProveedorId";
    sql += " LEFT JOIN proveedores AS pro ON pro.tarifaId = tp.tarifaProveedorId"
    sql += "  WHERE proveedorId = ? AND ar.codigoReparacion = ?";
    sql = mysql.format(sql, [id, codigoReparacion]);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result);
    });
}

module.exports.getPrecioUnitarioPorArticuloId = function (proveedorId, articuloId, callback) {
    var connection = com.getConnection();
    var clienteComisionistas = null;
    var sql = "SELECT   tpl.precioUnitario AS precioProveedor";
    sql += " FROM articulos AS ar";
    sql += " LEFT JOIN tarifas_proveedor_lineas AS tpl ON tpl.articuloId = ar.articuloId";
    sql += " LEFT JOIN tarifas_proveedor AS tp ON tp.tarifaProveedorId = tpl.tarifaProveedorId";
    sql += " LEFT JOIN proveedores AS pro ON pro.tarifaId = tp.tarifaProveedorId"
    sql += "  WHERE proveedorId = ? AND ar.articuloId = ?";
    sql = mysql.format(sql, [proveedorId, articuloId]);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result);
    });
}

//DEVUELVE codigos de pais
module.exports.getCodPais = function (callback) {
    var connection = getConnection();
    sql = "SELECT  paisId, CONCAT(`codpais`,' // ',`nompais`) AS nombre FROM paises";
    sql += " WHERE intracom = 1 OR paisId = 66"
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

var updateDepartamentosAsociados = function (departamentos, proveedorId, done) {
    //primero borramos todos los departamentos asociados al proveedor
    var connection = com.getConnection();
    //var deps = []
    /*for (var i = 0; i < departamentos.departamentos.length; i++){
        deps.push(departamentos[i])
    }*/
   
    var sql = "DELETE FROM proveedores_departamentos WHERE proveedorId = ?";
    sql = mysql.format(sql, proveedorId);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return done(err);
        }
        //asociamos ahora los departamentos al proveedor
       
        async.forEachSeries(departamentos, function (departamento, callback) {
            var proveedor_departamentos = {
                ProveedorDepartamentoId: 0,
                departamentoId: departamento,
                proveedorId: proveedorId
            }
            var connection2 = com.getConnection();
            var sql2 = "INSERT INTO proveedores_departamentos SET ?";
            sql2 = mysql.format(sql2, proveedor_departamentos);
            connection2.query(sql2, function (err) {
                com.closeConnection(connection2);
                if (err) return callback(err);
                callback();
            })
        }, function (err) {
            if (err) return done(err);
            done();
        });
        
    });
    
}
var updateDepartamentosAsociados = function (departamentos, proveedorId, done) {
    //primero borramos todos los departamentos asociados al proveedor
    var connection = com.getConnection();
    //var deps = []
    /*for (var i = 0; i < departamentos.departamentos.length; i++){
        deps.push(departamentos[i])
    }*/
   
    var sql = "DELETE FROM proveedores_departamentos WHERE proveedorId = ?";
    sql = mysql.format(sql, proveedorId);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err) {
            return done(err);
        }
        //asociamos ahora los departamentos al proveedor
       
        async.forEachSeries(departamentos, function (departamento, callback) {
            var proveedor_departamentos = {
                ProveedorDepartamentoId: 0,
                departamentoId: departamento,
                proveedorId: proveedorId
            }
            var connection2 = com.getConnection();
            var sql2 = "INSERT INTO proveedores_departamentos SET ?";
            sql2 = mysql.format(sql2, proveedor_departamentos);
            connection2.query(sql2, function (err) {
                com.closeConnection(connection2);
                if (err) return callback(err);
                callback();
            })
        }, function (err) {
            if (err) return done(err);
            done();
        });
        
    });
    
}
var updateProveedorConta = function (proveedor, done) {
    var proveedorConta = null;
    // Si no tiene cuenta contable no va a contabilidad+
    if (!proveedor.cuentaContable) {
        return done(null, proveedor);
    }
    // formatemos el proveedor para contabilidad
    transformaProveedorConta(proveedor, function (err, c) {
        if (err) return done(err);
        proveedorConta = c;
        // obtenemos la información general contable y seguimos desde ahí.
        contabilidadDb.getInfContable(function (err, result) {
            if (err) return done(err);
            var infContable = result;
            var contasDb = [];
            result.contas.forEach(function (c) {
                contasDb.push(c.contabilidad);
            });
            // ya tenemos todas las contabilidades ahora montamos actualizamos
            // el proveedor en todas ellas
            async.each(contasDb, function (conta, callback) {
                var connection = com.getConnectionDb(conta);
                var sql = "INSERT INTO cuentas SET ? ON DUPLICATE KEY UPDATE ?";
                sql = mysql.format(sql, [proveedorConta, proveedorConta]);
                connection.query(sql, function (err) {
                    com.closeConnection(connection);
                    if (err) return callback(err);
                    callback();
                })
            }, function (err) {
                if (err) return done(err);
                done();
            });
        });
    });
}


var asignaNobreConta = function(conta) {
    switch(conta) {
        case "ariconta11":
            nomConta = "PROASISTENCIA, S.L.";
            break;
            
        case "ariconta12":
        nomConta = "ROMÁN ALONSO GARCÍA";
        break;

        case "ariconta13":
        nomConta = "FONDOGAR S.L.";
        break;

        case "ariconta14":
        nomConta = "GRUPO INMOBILIARIO METROPOLITANO S.A.";
        break;

        case "ariconta15":
        nomConta = "REABITA OBRAS DE REHABILITACIÓN, S.L.";
        break;

        case "ariconta16":
        nomConta = "SIERRA DEL GUADARRAMA C.B.";
        break;

        case "ariconta17":
        nomConta = "ADMINISTRADORES DE FINCAS REDFINCAS S.L.";
        break;

        case "ariconta18":
        nomConta = "REPARALAR - CLAUDIA ALONSO GOMEZ";
        break;

        case "ariconta19":
        nomConta = "PROYECTA MEDIACIÓN EN INGENIERÍA Y ARQUITECTURA S.L.";
        break;

        case "ariconta21":
        nomConta = "RENTAVIVA, S.L..";
    }

    return nomConta;

}



// transformaProveedorConta
// transforma un objecto proveedor de gestión a proveedor de contabilidad
var transformaProveedorConta = function (proveedor, done) {
    var proveedorConta = null;
    // asumimos que la cuentaContable es correcta
    // buscamos el código contable de la forma de pago 
    var connection = getConnection();
    var sql = "SELECT * FROM formas_pago where formaPagoId = ?";
    sql = mysql.format(sql, proveedor.formaPagoId);
    connection.query(sql, function (err, result) {
        if (err) return done(err);
        var codigoContable = result[0].codigoContable;
        // ya podemos ir montando el proveedor de contabilidad
        proveedorConta = {
            codmacta: proveedor.cuentaContable,
            nommacta: proveedor.nombre,
            apudirec: 'S',
            model347: 1,
            razosoci: proveedor.nombre,
            dirdatos: proveedor.direccion,
            codposta: proveedor.codPostal,
            despobla: proveedor.poblacion,
            desprovi: proveedor.provincia,
            nifdatos: proveedor.nif,
            maidatos: proveedor.correo,
            obsdatos: proveedor.observaciones,
            iban: proveedor.IBAN,
            forpa: codigoContable
        };
        done(err, proveedorConta);
    });
}


// deleteProveedorConta
// elimina el proveedor de todas las contabilidades usadas
var deleteProveedorConta = function (id, done) {
    // debemos  el proveedor para sacar su cuenta contable
    var codmacta = null;
    var connection = getConnection();
    var sql = "SELECT * FROM proveedores WHERE proveedorId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        if (err) return done(err);
        codmacta = result[0].cuentaContable;
        if (!codmacta) {
            // no hay nada que borrar
            return done();
        }
        // obtenemos la información general contable y seguimos desde ahí.
        contabilidadDb.getInfContable(function (err, result) {
            if (err) return done(err);
            var infContable = result;
            var contasDb = [];
            result.contas.forEach(function (c) {
                contasDb.push(c.contabilidad);
            });
            // ya tenemos todas las contabilidades ahora borramos
            // el proveedor en todas ellas
            async.each(contasDb, function (conta, callback) {
                var connection = com.getConnectionDb(conta);
                var sql = "DELETE FROM cuentas WHERE codmacta = ?";
                sql = mysql.format(sql, codmacta);
                connection.query(sql, function (err) {
                    com.closeConnection(connection);
                    if (err) return callback(err);
                    callback();
                })
            }, function (err) {
                if (err) return done(err);
                done();
            });
        });
    });
}


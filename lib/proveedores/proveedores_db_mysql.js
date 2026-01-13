// proveedores_db_mysql
// Manejo de la tabla proveedores en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
const mysql2 = require('mysql2/promise') ;

var contabilidadDb = require("../contabilidad/contabilidad_db_mysql");
var com = require("../comun/comun");



//  leer la configurción de MySQL

var sql = "";


const obtenerConfiguracion = function() {
    return configuracion = {
        host: process.env.BASE_MYSQL_HOST,
        user: process.env.BASE_MYSQL_USER,
        password: process.env.BASE_MYSQL_PASSWORD,
        database: process.env.BASE_MYSQL_DATABASE,
        port: process.env.BASE_MYSQL_PORT,
        charset: process.env.BASE_MYSQL_CHARSET
    }
}




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
module.exports.getProveedoresBuscar = function (nombre, activos, callback) {
    var connection = getConnection();
    var proveedores = null;
    var sql = " SELECT p.*, tp.nombre AS profesion, d.nombre AS departamento  FROM proveedores AS p";
    sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = p.tipoProfesionalId";
    sql += " LEFT JOIN departamentos AS d ON d.departamentoId = p.departamentoId";
    if(activos == 'false') {
        sql += " WHERE (fechaBaja IS NULL OR activa = 1) "

        if (nombre !== "*") {
            sql += " AND p.nombre LIKE ?";
            sql = mysql.format(sql, '%' + nombre + '%');
        }
    } else {
        if (nombre !== "*") {
            sql += " WHERE p.nombre LIKE ?";
            sql = mysql.format(sql, '%' + nombre + '%');
        }
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
    var proveedor = null;
    sql = "SELECT p.*, tp.inicioCuenta, tp2.nombre AS profesion, d.nombre AS departamento,";
    sql += " tp.nombre AS tipoProfesionalNombre, t.nombre AS tarifaNombre, fp.nombre AS nomForpa, mb.nombre AS motivoBaja,";
    sql += " tv.nombre AS tipoViaProfesional,";
    sql += " ti.nombre AS tipoIvaProfesional, ti.porcentaje AS porcentajeIvaProfesional,"; 
    sql += " w.descripcion AS tipoRetencionProfesional, w.porcentajePorDefecto AS porcentajePordefectoRetencion, w.cuentaPorDefecto AS cuentaPorDefectoRetencion,";
    sql += " em.nombre AS empresaFacturacionProfesional,  pp.tipoProfesionalId AS tipoProveedorId, pu.playerId AS playerIdUsuario";
    sql += " FROM proveedores AS p";
    sql += " LEFT JOIN tipos_proveedor AS tp ON tp.tipoProveedorId = p.tipoProveedor";
    sql += " LEFT JOIN tipos_profesionales AS tp2 ON tp2.tipoProfesionalId = p.tipoProfesionalId";
    sql += " LEFT JOIN departamentos AS d ON d.departamentoId = p.departamentoId";
    sql += " LEFT JOIN tarifas_proveedor AS t ON t.tarifaProveedorId = p.tarifaId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = p.formaPagoId";
    sql += " LEFT JOIN motivos_baja AS mb ON mb.motivoBajaId = p.motivoBajaId";
    sql += " LEFT JOIN tipos_via AS tv ON tv.tipoViaId = p.tipoViaId";
    sql += " LEFT JOIN tipos_iva AS ti ON ti.tipoIvaId = p.tipoIvaId";
    sql += " LEFT JOIN usuarios.wtiporeten AS w ON w.codigo = p.codigoRetencion";
    sql += " LEFT JOIN empresas AS em ON em.empresaId = p.empresaId";
    sql += " LEFT JOIN proveedores_profesiones AS pp ON pp.proveedorId = p.proveedorId"
    sql += " LEFT JOIN proveedor_usuariospush AS pu ON pu.proveedorId = p.proveedorId"
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
        proveedor = creaProObj(result);
        callback(null, proveedor);
    });
}

var creaProObj = function(data) {
    var pro = data[0];
    var tiposProfesionales = [];
    var tiposProfesionalesUnicos = []
    var playerId = [];
    var playerIdUnicos = [];
    data.forEach( function(p) {
        tiposProfesionales.push(p.tipoProveedorId);
        if(p.playerIdUsuario) {
            playerId.push(p.playerIdUsuario);
        }
    });
    //eliminamos los elementos duplicados
    tiposProfesionalesUnicos = tiposProfesionales.filter((valor, indice) => {
        return tiposProfesionales.indexOf(valor) === indice;
      }
    );
    playerIdUnicos = playerId.filter((valor, indice) => {
        return playerId.indexOf(valor) === indice;
      }
    );
    //asignamos los valores resultantes
    pro.tiposProfesionales = tiposProfesionalesUnicos;
    pro.playerIds = playerIdUnicos;
    delete pro.tipoProveedorId;
    delete pro.playerIdUsuario;
    return pro;
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
module.exports.getNuevoCodProveedor = function (inicioCuenta, callback) {
    var connection = getConnection();
    //excepciones
    var sqlBis = "";
    if(inicioCuenta == '41') sqlBis = " AND codigo not IN (9999, 922, 999, 1314, 1428, 702)";
    if(inicioCuenta == '40') sqlBis = " AND codigo < 9000";

   
    sql = "SELECT COALESCE(MAX(codigo) +1, 1) codigo FROM proveedores";
    sql += " WHERE cuentaContable LIKE " + "'"+ inicioCuenta + "%'";
    sql += sqlBis;
    
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result[0]);
    });
}

// getNuevoCodigo
// busca la siguiente id en la tabla
module.exports.getNuevoCodProveedorAcreedor = function (callback) {
    var connection = getConnection();
    var inicioCuenta = "410";
    var finalCuenta = ""
    var array = [];
    sql = "SELECT COALESCE(MAX(codigo) +1, 1) codigo FROM proveedores";
    sql += " WHERE codigo < 9000";
    sql += " AND cuentaContable LIKE '410%'"
    sql += "  AND codigo not IN (9999, 922, 999, 1314, 1428, 702)";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err)  return callback(err, null);
        //comprobamos que la cuenta contable no exista
        if(result.length > 0) {
            finalCuenta = result[0].codigo;
            for(var i = 0; i < 5; i++) {
                array.push(finalCuenta);
                finalCuenta++;
            }
                async.forEachSeries(array, function (a, done) {
                    recuperaProveedorCuentaContable( inicioCuenta, a,function(err, hecho) {
                        if(err) return  done(err);
                        if(!hecho) return callback(null, a);
                        done()
                    });
                }, function (err) {
                    if (err) return callback(err);
                    callback(err);
                });
        } else {
            callback(err);
        }
    });
}


var recuperaProveedorCuentaContable = function (inicioCuenta, finalCuenta, callback) {
    var connection = getConnection();
    var codmacta = inicioCuenta + "%" + finalCuenta;
    sql = "SELECT * FROM proveedores WHERE cuentaContable like ('" + codmacta + "')";
    connection.query(sql, function (err, result) {
        connection.end();
        if (err)    return callback(err, null);
        if (result.length > 0)  return callback(null, result);
        callback(null, null);
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


module.exports.getProveedorPorTipo = function (tipoProfesionalId, departamentoId, fechaSolicitud, callback) {
    var connection = getConnection();
    if(tipoProfesionalId == 'null') tipoProfesionalId = null;
    sql = "SELECT p.* FROM proveedores AS p ";
    sql += " INNER JOIN proveedores_profesiones AS pp ON pp.proveedorId = p.proveedorId"
    sql += " WHERE  p.proveedorId IN";
    sql += " (SELECT DISTINCT proveedorId FROM proveedores_departamentos WHERE departamentoId = ?)";
    if(tipoProfesionalId) {
        sql += " AND pp.tipoProfesionalId = " + tipoProfesionalId;
    }
    sql += " AND (p.fechaBaja IS NULL OR p.fechaBaja > ? )"
    sql = mysql.format(sql, [departamentoId, fechaSolicitud]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

module.exports.getProveedorPorTipoPlayerId = function (tipoProfesionalId, departamentoId, fechaSolicitud, callback) {
    var connection = getConnection();
    if(tipoProfesionalId == 'null') tipoProfesionalId = null;
    sql = "SELECT DISTINCT p.nombre AS proveedorNombre, pu.*  FROM proveedores AS p ";
    sql += " INNER JOIN proveedores_profesiones AS pp ON pp.proveedorId = p.proveedorId"
    sql += " INNER JOIN proveedor_usuariospush AS pu ON pu.proveedorId = p.proveedorId"
    sql += " WHERE  p.proveedorId IN";
    sql += " (SELECT DISTINCT proveedorId FROM proveedores_departamentos WHERE departamentoId = ?)";
    if(tipoProfesionalId) {
        sql += " AND pp.tipoProfesionalId = " + tipoProfesionalId;
    }
    sql += " AND (p.fechaBaja IS NULL OR p.fechaBaja > ? ) AND NOT pu.playerId IS NULL"
    sql = mysql.format(sql, [departamentoId, fechaSolicitud]);
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
module.exports.getProveedoresActivos = function (nombre, proIds,callback) {
    var connection = getConnection();
    var proveedores = null;
    if(nombre !== "*") {
        sql = "SELECT *, CONCAT(nombre, '  ', cuentaContable) AS nomconcat FROM proveedores WHERE nombre LIKE ? AND fechaBaja IS NULL";
        sql = mysql.format(sql, '%' + nombre + '%');
        if(proIds) {
            sql += " AND proveedorId IN (?)";
            sql = mysql.format(sql, [proIds]);
        }
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
module.exports.getProveedoresActivosComerciales = function (nombre, proIds,callback) {
    var connection = getConnection();
    var proveedores = null;
    if(nombre !== "*") {
        sql = "SELECT *, CONCAT(p.nombre, '  ', p.cuentaContable) AS nomconcat"; 
        sql += " FROM proveedores AS p";
        sql += " INNER JOIN comerciales as c on c.proveedorId = p.proveedorId"
        sql += " WHERE p.nombre LIKE ? AND p.fechaBaja IS NULL";
        sql = mysql.format(sql, '%' + nombre + '%');
        if(proIds) {
            sql += " AND proveedorId IN (?)";
            sql = mysql.format(sql, [proIds]);
        }
    } else {
        sql = "SELECT *, CONCAT(p.nombre, '  ', p.cuentaContable) AS nomconcat";
        sql += " FROM proveedores AS p";
        sql += " INNER JOIN comerciales as c on c.proveedorId = p.proveedorId"
        sql += " WHERE  p.fechaBaja IS NULL";
        
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


// getProveedoresActivosConTipo
// devuelve los proveedores que no estén dados de baja con su tipo de comercial
module.exports.getProveedoresActivosComercialesConTipo = function (nombre, callback) {
    var connection = getConnection();
    var proveedores = null;
    if(nombre !== "*") {
        sql = "SELECT p.*, c.comercialId, t.nombre AS tipoComercialNombre, t.tipoComercialId, CONCAT(p.nombre, '  ', p.cuentaContable, ' ', t.nombre) AS nomconcat"; 
        sql += " FROM proveedores AS p";
        sql += " INNER JOIN comerciales as c on c.proveedorId = p.proveedorId"
        sql += " LEFT  JOIN tipos_comerciales as t on t.tipocomercialId = c.tipoComercialId"
        sql += " WHERE p.nombre LIKE ? AND p.fechaBaja IS NULL";
        sql = mysql.format(sql, '%' + nombre + '%');
    } else {
        sql = "SELECT p.*, c.comercialId, t.nombre AS tipoComercialNombre, t.tipoComercialId, CONCAT(p.nombre, '  ', p.cuentaContable, ' ', t.nombre) AS nomconcat";
        sql += " FROM proveedores AS p";
        sql += " INNER JOIN comerciales as c on c.proveedorId = p.proveedorId"
        sql += " LEFT  JOIN tipos_comerciales as t on t.tipocomercialId = c.tipoComercialId"
        sql += " WHERE  p.fechaBaja IS NULL";
        
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

// getProveedoresActivosSinNombre
// devuelve los proveedores que no estén dados de baja y que tengan la id que se pasa
module.exports.getProveedoresActivosSinNombre = function (proIds, callback) {
    var connection = getConnection();
    var proveedores = null;
   
    sql = "SELECT * FROM proveedores WHERE fechaBaja IS NULL";
    if(proIds) {
        sql += " AND proveedorId IN (?)";
        sql = mysql.format(sql, [proIds]);
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
module.exports.getProveedoresActivosNif = function (datos, callback) {
    var connection = getConnection();
    var proveedores = null;
   
    sql = "SELECT * FROM proveedores WHERE nif IN (?) AND fechaBaja IS NULL";
    sql = mysql.format(sql, [datos]);
    
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
//DEVUELVE LAS PROFESIONES ASOCIADAS A UN PROVEEDOR
module.exports.getProfesionesAsociadas = function (proveedorId, callback) {
    var connection = getConnection();
    sql = "SELECT pp.tipoProfesionalId, tp.nombre FROM tipos_profesionales AS tp";
    sql += " LEFT JOIN proveedores_profesiones as pp on pp.tipoProfesionalId = tp.tipoProfesionalId";
    sql += " WHERE pp.proveedorId = ?"
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
    var profesiones = proveedor.profesiones.profesiones;
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
        proveedor.method = "POST";
        /*callback(null, proveedor);*/
        updateProveedorConta(proveedor, function (err) {
            if (err) return callback(err);
            updateDepartamentosAsociados(departamentos, proveedor.proveedorId, function (err) {
                if (err) return callback(err);
                updateProfesionesAsociadas(profesiones, proveedor.proveedorId, function (err) {
                    if (err) return callback(err);
                    callback(null, proveedor);
                });
            });
            
        });
    });
}

// putProveedor
// Modifica el proveedor según los datos del objeto pasao
module.exports.putProveedor = function (id, proveedor, callback) {
    var departamentos = proveedor.departamentos.departamentos;
    var profesiones = proveedor.profesiones.profesiones;
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
                updateProfesionesAsociadas(profesiones, proveedor.proveedorId, function (err) {
                    if (err) return callback(err);
                    callback(null, proveedor);
                });
            });
        });
    });
}

// putProveedor
// Modifica el proveedor según los datos del objeto pasao
module.exports.putProveedorPlayerId = function (id, proveedor, callback) {
    proveedor.proveedorId = proveedor.usuarioId;
    delete proveedor.usuarioId
    if (id != proveedor.proveedorId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE proveedores SET playerId = ? WHERE proveedorId = ?";
    sql = mysql.format(sql, [proveedor.playerId, proveedor.proveedorId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, proveedor);
        
    });
}

// putProveedor
// Modifica el proveedor según los datos del objeto pasao
module.exports.putProveedorUsupushPlayerId = function (id, proveedor, callback) {
    proveedor.proveedorId = proveedor.usuarioId;
    delete proveedor.usuarioId;
    if (id != proveedor.proveedorId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE proveedor_usuariospush SET playerId = ? WHERE proveedorUsuarioPushId = ?";
    sql = mysql.format(sql, [proveedor.playerId, proveedor.proveedorUsuarioPushId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, proveedor);
        
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

// getProveedoresActivos
// devuelve los proveedores que no estén dados de baja
module.exports.getProveedoresActivosNifBis = function (nif, callback) {
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
// getProveedoresActivos
// devuelve los proveedores que no estén dados de baja
module.exports.getProveedoresColaboradoresActivosNif = function (nif, callback) {
    var connection = getConnection();
    var proveedores = null;
        sql = "SELECT p.* FROM proveedores AS p";
        sql += " INNER JOIN comerciales as c on c.proveedorId = p.proveedorId"
        sql += " WHERE p.nif LIKE ? AND p.fechaBaja IS NULL";
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
var updateProfesionesAsociadas = function (profesiones, proveedorId, done) {
    //primero borramos todos las profesiones asociadas al proveedor
    var connection = com.getConnection();
   
    var sql = "DELETE FROM proveedores_profesiones WHERE proveedorId = ?";
    sql = mysql.format(sql, proveedorId);
    connection.query(sql, function (err, result) {
        com.closeConnection(connection);
        if (err)    return done(err);
        
        //asociamos ahora las profesiones al proveedor
        async.forEachSeries(profesiones, function (profesion, callback) {
            var proveedor_profesiones = {
                proveedorProfesionId: 0,
                tipoProfesionalId: profesion,
                proveedorId: proveedorId
            }
            var connection2 = com.getConnection();
            var sql2 = "INSERT INTO proveedores_profesiones SET ?";
            sql2 = mysql.format(sql2,  proveedor_profesiones);
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
                delete proveedorConta.model347;
                var connection = com.getConnectionDb(conta);
                var sql = "UPDATE cuentas SET ? WHERE codmacta = ?";
                sql = mysql.format(sql, [proveedorConta, proveedorConta.codmacta]);
                connection.query(sql, function (err, result) {
                    com.closeConnection(connection);
                    if (err) return callback(err);
                    if(result.affectedRows == 0) {
                        var connection2 = com.getConnectionDb(conta);
                        proveedorConta.model347 =  1;
                        var sql2 = "INSERT INTO cuentas SET ?";
                        sql2 = mysql.format(sql2, proveedorConta);
                        connection2.query(sql2, function (err, result) {
                            com.closeConnection(connection2);
                            if (err) return callback(err);
                            callback();
                        })
                    } else {
                        callback();
                    }
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
        connection.end();
        if (err) return done(err);
        var codigoContable = result[0].codigoContable;
        // ya podemos ir montando el proveedor de contabilidad
        proveedorConta = {
            codmacta: proveedor.cuentaContable,
            nommacta: proveedor.nombre,
            apudirec: 'S',
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
        delete proveedor.method;
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
        connection.end();
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
module.exports.postLoginArquitectura = function (password, callback) {
    var connection = getConnection();
    sql = "SELECT ";
    sql += " proveedorId,";
    sql += " nombre,";
    sql += " nif,";
    sql += " direccion,";
    sql += " codPostal,";
    sql += " poblacion,";
    sql += " provincia";
    sql += " FROM proveedores";
    sql += " WHERE nif = ?"
    sql = mysql.format(sql, password);
    connection.query(sql, function (err, rows) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        if(rows.length == 0) {
             callback(null, rows);
        }
        
        callback(null, rows[0]);
    });
}

module.exports.postLogin = function (login, password, callback) {
    var connection = getConnection();
    sql = "SELECT p.*, t.porcentaje from proveedores AS p ";
    sql += " LEFT JOIN tipos_iva as t on t.tipoIvaId = p.tipoIvaId"
    sql += " WHERE login = ? AND password = ?"
    sql = mysql.format(sql, [login, password]);
    connection.query(sql, function (err, rows) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        if(rows.length == 0) {
            try{
                throw new Error("Usuario o contraseña incorrectos");
            } catch(e) {
                return callback(e, null);
            }
        }
        var data  = { 
            profesional: {
                nomusu: rows[0].nombre,
                usuarioId: rows[0].proveedorId,
                tipoIvaId: rows[0].tipoIvaId,
                tarifaId: rows[0].tarifaId,
                usuarioLogin: rows[0].login,
                usuarioPassword: rows[0].password,
                porcentajeIva: rows[0].porcentaje,
                empresaId: rows[0].empresaId,
                playerId: rows[0].playerId
            }
            
        }
        callback(null, data);
    });
}

module.exports.postLoginUsuPush = function (login, password, callback) {
    var connection = getConnection();
    sql = "SELECT p.nombre,";
    sql += " p.proveedorId,";
    sql += " p.tipoIvaId,";
    sql += " p.tarifaId,";
    sql += " p.empresaId,"
    sql += " pu.proveedorUsuarioPushId,"
    sql += " pu.login,";
    sql += " pu.password,";
    sql += " pu.playerId,";
    sql += " t.porcentaje";
    sql += " FROM proveedores AS p ";
    sql += " LEFT JOIN tipos_iva as t on t.tipoIvaId = p.tipoIvaId"
    sql += " LEFT JOIN proveedor_usuariospush as pu on pu.ProveedorId = p.proveedorId"
    sql += " WHERE pu.login = ? AND pu.password = ?"
    sql = mysql.format(sql, [login, password]);
    connection.query(sql, function (err, rows) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        if(rows.length == 0) {
            try{
                throw new Error("Usuario o contraseña incorrectos");
            } catch(e) {
                return callback(e, null);
            }
        }
        var data  = { 
            profesional: {
                nomusu: rows[0].nombre,
                usuarioId: rows[0].proveedorId,
                tipoIvaId: rows[0].tipoIvaId,
                tarifaId: rows[0].tarifaId,
                usuarioLogin: rows[0].login,
                usuarioPassword: rows[0].password,
                porcentajeIva: rows[0].porcentaje,
                empresaId: rows[0].empresaId,
                playerId: rows[0].playerId,
                proveedorUsuarioPushId: rows[0].proveedorUsuarioPushId
            }
            
        }
        callback(null, data);
    });
}

module.exports.getLoginUsuPush = function (login, password, callback) {
    var connection = getConnection();
    sql = "SELECT p.nombre,";
    sql += " p.proveedorId,";
    sql += " p.tipoIvaId,";
    sql += " p.tarifaId,";
    sql += " p.empresaId,"
    sql += " pu.proveedorUsuarioPushId,"
    sql += " pu.login,";
    sql += " pu.password,";
    sql += " pu.playerId,";
    sql += " t.porcentaje";
    sql += " FROM proveedores AS p ";
    sql += " LEFT JOIN tipos_iva as t on t.tipoIvaId = p.tipoIvaId"
    sql += " LEFT JOIN proveedor_usuariospush as pu on pu.ProveedorId = p.proveedorId"
    sql += " WHERE pu.login = ? AND pu.password = ?"
    sql = mysql.format(sql, [login, password]);
    connection.query(sql, function (err, rows) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        callback(null, rows);
    });
}
module.exports.getusuariosProveedor = function (proveedorId, callback) {
    var connection = getConnection();
    var sql = " SELECT pu.* FROM proveedor_usuariospush AS pu";
    sql += " LEFT JOIN proveedores AS p ON p.proveedorId = pu.proveedorId";
    sql += " WHERE p.proveedorId = ?";
    sql = mysql.format(sql, proveedorId);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err, null);
        callback(null, result);
    });
}

module.exports.getusuarioProveedor = function (id, callback) {
    var connection = getConnection();
    var sql = " SELECT pu.* FROM proveedor_usuariospush AS pu";
    sql += " WHERE pu.proveedorUsuarioPushId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err, null);
        callback(null, result);
    });
}


module.exports.postUsuarioPush = function (usuarioPush, callback) {
    var connection = getConnection();
    usuarioPush.proveedorUsuarioPushId = 0;
    var sql = "INSERT INTO proveedor_usuariospush SET ?";
    sql = mysql.format(sql, usuarioPush);
    connection.query(sql, function (err, data) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err, null);
        callback(null, data);
    });
}

module.exports.putProveedorUsuarioPush = function (id, usuarioPush, callback) {
    var connection = getConnection();
    sql = "UPDATE proveedor_usuariospush SET  ? WHERE proveedorUsuarioPushId = ?";
    sql = mysql.format(sql, [usuarioPush, id]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) return callback(err);
        callback(null, result);
        
    });
}

// deleteProveedor
// Elimina el proveedor con el id pasado
module.exports.deleteProveedorUsuarioPush = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE FROM proveedor_usuariospush WHERE proveedorUsuarioPushId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

//NUEVA LLAMADA PARA LOS PROVEEDORES ACTIVOS CON DEPARTAMENTO
module.exports.getProveedoresActivoDepTipo = function (tipoProveedorId, departamentoId) {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try{
            connection = await mysql2.createConnection(obtenerConfiguracion());
            var sql = " SELECT p.* FROM proveedores AS p";
            sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = p.tipoProfesionalId";
            sql += " LEFT JOIN proveedores_departamentos AS d ON d.proveedorId = p.proveedorId";
            sql += " LEFT JOIN proveedores_profesiones AS pr ON pr.proveedorId = p.proveedorId";
            sql += " WHERE (p.fechaBaja IS NULL OR p.activa = 1)";
            sql += " AND d.departamentoId = " + departamentoId
            if(tipoProveedorId > 0) {
                sql += " AND pr.tipoProfesionalId = " + tipoProveedorId
            }
            const [proveedores] = await connection.query(sql)
                await connection.end();
                resolve (proveedores);

        } catch(err) {
            if(connection) await connection.end();
            reject (err);
        }

    });
}


//FUNCIONES DE LOS INDICES CORRECTORES

module.exports.getIndicesCorectoresProveedor = async (proveedorId) => {
    let connection = null;
    let sql = "";
    return new Promise(async (resolve, reject) => {
        try{
            connection = await mysql2.createConnection(obtenerConfiguracion());
            sql = " SELECT";
            sql += " ic.indiceCorrectorId,";
            sql += " ic.proveedorId,";
            sql += " ic.nombre,";
            sql += " ic.minimo,";
            sql += " ic.maximo,";
            sql += " ic.porcentajeDescuento,";
            sql += " tp.tipoProfesionalId,"
            sql += " tp.nombre AS nombreProfesion"
            sql += " FROM indices_correctores AS ic";
            sql += " LEFT JOIN indicecorrector_profesiones AS ip on ip.indiceCorrectorId = ic.indiceCorrectorId";
            sql += " LEFT JOIN tipos_profesionales AS tp on tp.tipoProfesionalId = ip.tipoProfesionalId"
            sql += " WHERE ic.proveedorId = ?";
            sql = mysql2.format(sql, proveedorId);
            let [indices] = await connection.query(sql);
            await connection.end();
            if(indices.length > 0) {
                indices = procesaIndices(indices);
                resolve (indices);
            } else {
                resolve(null);
            }
            
        } catch(err) {
            if(connection) await connection.end();
            reject (err);
        }

    });
}

module.exports.getIndicesCorectoresProveedorProfesion = async (proveedorId, tipoProfesionalId) => {
    let connection = null;
    let sql = "";
    return new Promise(async (resolve, reject) => {
        try{
            connection = await mysql2.createConnection(obtenerConfiguracion());
            sql = " SELECT";
            sql += " ic.indiceCorrectorId,";
            sql += " ic.proveedorId,";
            sql += " ic.nombre,";
            sql += " ic.minimo,";
            sql += " ic.maximo,";
            sql += " ic.porcentajeDescuento,";
            sql += " tp.tipoProfesionalId,"
            sql += " tp.nombre AS nombreProfesion"
            sql += " FROM indices_correctores AS ic";
            sql += " LEFT JOIN indicecorrector_profesiones AS ip on ip.indiceCorrectorId = ic.indiceCorrectorId";
            sql += " LEFT JOIN tipos_profesionales AS tp on tp.tipoProfesionalId = ip.tipoProfesionalId"
            sql += " WHERE ic.proveedorId = ? AND tp.tipoProfesionalId = ?";
            sql = mysql2.format(sql, [ proveedorId, tipoProfesionalId ]);
            let [indices] = await connection.query(sql);
            //indices = procesaIndices(indices);
            await connection.end();
            resolve (indices);

        } catch(err) {
            if(connection) await connection.end();
            reject (err);
        }

    });
}





module.exports.getIndiceCorector = function (indiceCorrectorId) {
    let connection = null;
    let sql = "";
    return new Promise(async (resolve, reject) => {
        try{
            connection = await mysql2.createConnection(obtenerConfiguracion());
            sql = " SELECT";
            sql += " ic.indiceCorrectorId,";
            sql += " ic.proveedorId,";
            sql += " ic.nombre,";
            sql += " ic.minimo,";
            sql += " ic.maximo,";
            sql += " ic.porcentajeDescuento,";
            sql += " tp.tipoProfesionalId,"
            sql += " tp.nombre AS nombreProfesion"
            sql += " FROM indices_correctores AS ic";
            sql += " LEFT JOIN indicecorrector_profesiones AS ip on ip.indiceCorrectorId = ic.indiceCorrectorId";
            sql += " LEFT JOIN tipos_profesionales AS tp on tp.tipoProfesionalId = ip.tipoProfesionalId"
            sql += " WHERE ic.indiceCorrectorId = ?";
            sql = mysql2.format(sql, indiceCorrectorId);
            let [indices] = await connection.query(sql);
            indices = procesaIndices(indices);
            await connection.end();
            resolve (indices[0]);

        } catch(err) {
            if(connection) await connection.end();
            
            reject (err);
        }

    });
}

var procesaIndices = function (rows) {
    var antReg = null;
    var objInd = {};
    var objTiPro = {};
    var regs = [];

    rows.forEach(e => {
        if(antReg == null) {//el primer registro se procesa siempre
            objInd = {
                indiceCorrectorId: e.indiceCorrectorId,
                nombre:  e.nombre, 
                proveedorId:  e.proveedorId, 
                minimo:  e.minimo, 
                maximo:  e.maximo, 
                porcentajeDescuento: e.porcentajeDescuento,
                lin: [],
            };
            //linea profesion
            objTiPro = {
                tipoProfesionalId: e.tipoProfesionalId,
                nombreProfesion: e.nombreProfesion
                
            }
         
            objInd.lin.push(objTiPro);
            objTiPro = {}; //una vez incluida la linea de hlinapu limpiamos los datos
            antReg = e.indiceCorrectorId;
        } else  {
            if(antReg == e.indiceCorrectorId) {
                // si se trata del mismo indice
                //añadimos la profesion
                objTiPro = {
                    tipoProfesionalId: e.tipoProfesionalId,
                    nombreProfesion: e.nombreProfesion
                }
                objInd.lin.push(objTiPro);
                objTiPro = {}; //una vez incluida la linea de hlinapu limpiamos los datos
            } else {
                //si se trata de otro indice guardamos el anterior, creamos uno nuevo  y añadimos la primera profesión
                regs.push(objInd);
                objInd = {
                    indiceCorrectorId: e.indiceCorrectorId,
                    proveedorId:  e.proveedorId, 
                    nombre:  e.nombre, 
                    minimo:  e.minimo, 
                    maximo:  e.maximo, 
                    porcentajeDescuento: e.porcentajeDescuento,
                    lin: [],
                };
                //linea profesion
                objTiPro = {
                    tipoProfesionalId: e.tipoProfesionalId,
                    nombreProfesion: e.nombreProfesion
                    
                }
             
                objInd.lin.push(objTiPro);
                objTiPro = {}; //una vez incluida la linea de hlinapu limpiamos los datos
                antReg = e.indiceCorrectorId;
            }
        } 
    });
    //el ultimo registro se incluye siempre
    regs.push(objInd);
    
    return regs;
}



module.exports.postIndiceCorectoreProveedor = function (indiceCorrector) {
    let connection = null;
    let sql = "";
    let profesiones = [];
    let indiceId = 0;
    return new Promise(async (resolve, reject) => {
        try{
            connection = await mysql2.createConnection(obtenerConfiguracion());
            connection.beginTransaction();
            profesiones = indiceCorrector.profesiones;
            delete indiceCorrector.profesiones;
            sql = "INSERT INTO indices_correctores";
            sql += " SET ?";
            sql = mysql2.format(sql, indiceCorrector);
            const indice = await connection.query(sql);
            indiceId = indice[0].insertId;
            const result = await postProfesionesIndice(indiceId, profesiones, connection);
            if(!result) throw new Error("Fallo al crear las profesiones del indice");
            await connection.commit();
            await connection.end();
            resolve (indice);

        } catch(err) {
            if(connection) {
                await connection.rollback();
                await connection.end();
            }
            reject (err);
        }

    });
}

module.exports.putIndiceCorectoreProveedor = function (indiceCorrector, id) {
    let connection = null;
    let sql = "";
    let profesiones = [];
    return new Promise(async (resolve, reject) => {
        try{
            connection = await mysql2.createConnection(obtenerConfiguracion());
            connection.commit();
            profesiones = indiceCorrector.profesiones;
            delete indiceCorrector.profesiones;
            sql = "UPDATE indices_correctores";
            sql += " SET ?  WHERE indiceCorrectorId = ?";
            sql = mysql2.format(sql, [indiceCorrector, id]);
            const result = await connection.query(sql);
            const result2 = await postProfesionesIndice(id, profesiones, connection);
            if(!result2) throw new Error("Fallo al crear las profesiones del indice");
            await connection.commit();
            await connection.end();
            resolve (result);

        }  catch(err) {
            if(connection) {
                await connection.rollback();
                await connection.end();
            }
            reject (err);
        }
    });
}

module.exports.deleteIndiceCorector = function (id) {
    let connection = null;
    let sql = "";
    return new Promise(async (resolve, reject) => {
        try{
            connection = await mysql2.createConnection(obtenerConfiguracion());
            await connection.beginTransaction();
            //BORRAMOS PRIMERO TODAS LAS PROFESIONES ASOCIADAS AL INDICE SI EXISTEN
            sql = "DELETE FROM indicecorrector_profesiones WHERE indiceCorrectorId = ?";
            sql = mysql2.format(sql, id);
            const result = await connection.query(sql);
            sql = "DELETE FROM indices_correctores";
            sql += " WHERE indiceCorrectorId = ?";
            sql = mysql2.format(sql, id);
            const result2 = await connection.query(sql);
            await connection.commit();
            await connection.end();
            resolve (result);

        } catch(err) {
            if(connection) {
                await connection.rollback();
                await connection.end();
            } 
            reject (err);
        }

    });
}

let postProfesionesIndice = async (indiceId, profesiones, connection) => {
    let sql = "";
    return new Promise(async (resolve, reject) => {
        try{
            //BORRAMOS PRIMERO TODAS LAS PROFESIONES ASOCIADAS AL INDICE SI EXISTEN
            sql = "DELETE FROM indicecorrector_profesiones WHERE indiceCorrectorId = ?";
            sql = mysql2.format(sql, indiceId);
            const result = await connection.query(sql);
            //INSERT EN LA TABLA indiceCorrector_profesiones
            for(let p of profesiones){
                var indicecorrector_profesiones = {
                    indiceCorrectorProfesionId: 0,
                    indiceCorrectorId: indiceId,
                    tipoProfesionalId: p
                }
                sql = "INSERT INTO indicecorrector_profesiones SET ?";
                sql = mysql2.format(sql, indicecorrector_profesiones);
                let  result3 = await connection.query(sql);
            }
            resolve(true)
        } catch(err) {
            resolve(false);
        }
    });
}


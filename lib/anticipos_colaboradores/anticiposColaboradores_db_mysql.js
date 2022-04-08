// anticiposColaboradores_db_mysql
// Manejo de la tabla anticipos de comerciales en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
const mysql2 = require('mysql2/promise') ;

var fs = require("fs"),
    path = require("path");

//  leer la configurción de MySQL

//var config2 = require("../../config.json");
var fs = require('fs');



var sql = "";
var Stimulsoft = require('stimulsoft-reports-js');

var ioAPI = require('../ioapi/ioapi');

var correoAPI = require('../correoElectronico/correoElectronico');
const { throws, rejects } = require("assert");
const { resolve } = require("dns");
const { reject } = require("async");


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

// comprobarPreanttura
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarAntCol(antcol) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof antcol;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && antcol.hasOwnProperty("antcolId"));
    comprobado = (comprobado && antcol.hasOwnProperty("empresaId"));
    comprobado = (comprobado && antcol.hasOwnProperty("comercialId"));
    comprobado = (comprobado && antcol.hasOwnProperty("fecha"));
    return comprobado;
}




module.exports.getAnticiposContrato = async (contratoId) => {
    let connection = null;
        return new Promise(async (resolve, reject) => {
            try {
                connection = await mysql2.createConnection(obtenerConfiguracion());
                sql = "SELECT pf.*, fps.importe AS importeServiciado, fp.nombre AS vFPago, cm.referencia AS ref";
                sql += " FROM antcol AS pf";
                sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
                sql += " LEFT JOIN antcol_serviciados AS fps ON fps.antcolId = pf.antcolId";
                sql += " LEFT JOIN contratos AS cm ON cm.contratoId = fps.contratoId";
                sql += " LEFT JOIN empresas AS c ON c.empresaId = cm.empresaId ";
                sql += " WHERE fps.contratoId = ?";
                sql += " ORDER BY pf.fecha";
                const [anticipos] = await connection.query(sql, contratoId);
                resolve(anticipos)
            } catch(error) {
                if(connection) await connection.end();
                reject (error)
            }
        });
}


// getAnticipoColaboradore
// busca  la anttura con id pasado
module.exports.getAnticipoColaborador = async (id) => {
    let conn = undefined
    return new Promise(async (resolve, reject) => {
        var ant = null;
        try {
            conn = await mysql2.createConnection(obtenerConfiguracion());
            var sql = "SELECT pf.*,";
            sql += " fp.nombre AS vFPago, p.IBAN";
            sql += " FROM antcol AS pf";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
            sql += " LEFT JOIN comerciales as p ON p.comercialId = pf.comercialId";
            sql += " WHERE pf.antcolId = ?";
            const [resp] = await conn.query(sql, id);
            await conn.end();
            if(resp.length > 0) var ant = resp[0]
            resolve (ant);
        } catch (error) {
            if (conn) await conn.end()
            reject (error)
        }
    });
}


/* module.exports.getAnticipoColaborador = async (id) => {
        // Vamos a devolver una promesa
        return new Promise(async (resolve, reject) => {
            var conn = undefined // conn lleva la conexión con la base de datos
            try {
                conn = await mysql.createConnection(obtenerConfiguracion());
                const [resp] = await conn.query("INSERT INTO usuarios SET ?", usuario)
                console.log(resp)
                usuario.usuarioId = resp.insertId
                await conn.end()
                resolve (usuario)
            } catch (error) {
                if (conn) await conn.end()
                reject (error)
            }
        })

    }
 */


// getAnticipoColaboradore
// busca  la anttura con id pasado
module.exports.getAnticipoPorNumero = function (numeroAnticipoColaborador, proId,callback) {
    var connection = getConnection();
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago";
    sql += " FROM antcol AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " WHERE pf.numeroAnticipoColaborador = ? AND pf.comercialId = ?";
    sql = mysql.format(sql, [numeroAnticipoColaborador, proId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}

// getAnticipoColaboradoreId
// busca  las anticipos con id del comercial pasado que sean completos
module.exports.getAnticipoColaboradorId = function (id) {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try{
            connection = await mysql2.createConnection(obtenerConfiguracion());
            sql = "SELECT pf.*,";
            sql += " fp.nombre AS vFPago";
            sql += " FROM antcol AS pf";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
            sql += " WHERE pf.comercialId = ?";
            const [anticipos] = await connection.query(sql, id)
                connection.end();
                resolve (anticipos);

        } catch(err) {
            if(connection) await connection.end();
            reject (err);
        }

    });
}

// postAnticipo
// crear en la base de datos la anttura de comercial pasada
module.exports.postAnticipo = function (antcol) {
            let connection = null;
            return new Promise(async (resolve, reject) => {
                try {
                    antcol.antcolId = 0; // fuerza el uso de autoincremento
                if (!comprobarAntCol(antcol)) {
                    var err = new Error("El anticipo del comercial pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
                    throw err;
                }
                connection = await mysql2.createConnection(obtenerConfiguracion());
                sql = "INSERT INTO antcol SET ?";
                sql = mysql2.format(sql, antcol);
                const [result] = await connection.query(sql);
                connection.end();
                antcol.antcolId = result.insertId;
                resolve(antcol);

                } catch(error) {
                    if(connection) connection.end();
                    reject(error)
                }
                
            });
}

// putAnticipo
// Modifica la anttura de comercial según los datos del objeto pasado
// y guarda un documento adjunto a dicha anttura si este existe
module.exports.putAnticipo = async (id, antcol) => {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            if (id != antcol.antcolId) {
                var err = new Error("El ID del objeto y de la url no coinciden");
                throw err;
            }
            connection = await mysql2.createConnection(obtenerConfiguracion());
            sql = "UPDATE antcol SET ? WHERE antcolId = ?";
            const [result] = await connection.query(sql, [antcol, antcol.antcolId])
                connection.end();
                resolve (antcol);
        } catch(err) {
            if (connection) await connection.end();
            reject (err);
        }
    });
}



// deleteAnticipo
// Elimina el prefactura con el id pasado
module.exports.deleteAnticipo = function (id) {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try{
            connection = await mysql2.createConnection(obtenerConfiguracion());
            sql = "DELETE from antcol WHERE antcolId = ?;";
            const [result] = await connection.query(sql, id)
                connection.end();
                resolve (result);

        } catch(err) {
            if(connection) await connection.end();
            reject (err);
        }
    });
}



module.exports.getAnticiposCliente = function (clienteId, callback) {
    var connection = getConnection();
    var sql = "SELECT * FROM antClien WHERE clienteId = ?";
    sql = mysql.format(sql,clienteId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        if(result.length == 0) return callback(null, null);
        callback(null, result);
    })
}


var roundToTwo = function (num) {
    return +(Math.round(num + "e+2") + "e-2");
};




/*
|---------------------------------------|
|                                       |
|  LINEAS SERVICIADAS                   |
|                                       |
|---------------------------------------|
*/

function comprobarAnticipoServiciada(serviciada) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof serviciada;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && serviciada.hasOwnProperty("antcolServiciadoId"));
    comprobado = (comprobado && serviciada.hasOwnProperty("antcolId"));
    comprobado = (comprobado && serviciada.hasOwnProperty("empresaId"));
    comprobado = (comprobado && serviciada.hasOwnProperty("contratoId"));
    comprobado = (comprobado && serviciada.hasOwnProperty("importe"));
    return comprobado;
}

module.exports.getserviciadasAnticipo = function (antcolId, callback) {
    var connection = getConnection();
    sql = "SELECT serv.antcolServiciadoId, emp.nombre as empresa, CONCAT(cont.referencia, ' / ', cont.direccion, ' / ', tpro.nombre) AS referencia, serv.importe";
    sql += " FROM antcol_serviciados AS serv";
    sql += " INNER JOIN empresas AS emp ON emp.empresaId = serv.empresaId";
    sql += " INNER JOIN contratos AS cont ON cont.contratoId = serv.contratoId";
    sql += " INNER JOIN tipos_proyecto AS tpro ON tpro.tipoProyectoId = cont.tipoProyectoId";
    sql += " WHERE antcolId = ?";
    sql = mysql.format(sql, antcolId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

module.exports.getserviciadaAnticipo = function (id, callback) {
    var connection = getConnection();
    sql = "SELECT * FROM antcol_serviciados";
    sql += " WHERE antcolServiciadoId = ?"
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result[0]);
    });
}


module.exports.postServiciada = function (serviciada, callback) {
    serviciada.antcolServiciadoId = 0; // fuerza el uso de autoincremento
    if (!comprobarAnticipoServiciada(serviciada)) {
        var err = new Error("La Empresa serviciada de anttura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    sql = "INSERT INTO antcol_serviciados SET ?";
    sql = mysql.format(sql, serviciada);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
}

module.exports.putServiciada = function (id, serviciada, callback) {
    var connection = getConnection();
    sql = "UPDATE antcol_serviciados SET ? WHERE antcolServiciadoId = ?";
    sql = mysql.format(sql, [serviciada, id]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, 'OK');
    });
}

module.exports.deleteServiciadas = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE FROM antcol_serviciados";
    sql += " WHERE antcolServiciadoId = ?"
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        callback(null);
    });
}




// getPreContaAnticipos
// obtiene las anticipos no contabilizadas entre las fechas indicadas
module.exports.getPreContaAnticipos = function (dFecha, hFecha, departamentoId, usuarioId, callback) {
    if(dFecha == "null" || hFecha == "null") {
        dFecha = 0;
        hFecha = 0;
    }
    var connection = getConnection();
    var anticipos = null;
    // primero las marcamos por defeto como contabilizables
    var sql = "UPDATE antcol SET sel = 1";
    sql += " WHERE noContabilizar = 0";
    sql += " AND contabilizada = 0";
    if(departamentoId && departamentoId > 0) {
        sql += " AND departamentoId =" + departamentoId;
    } else {
        sql += " AND departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
    }
    if(dFecha && hFecha) {
        sql += "  AND fecha >= ? AND fecha <= ?";
        sql = mysql.format(sql, [dFecha, hFecha]);
    }
    connection.query(sql, function (err, res) {
        connection.end()
        if (err) return callback(err);
        connection = getConnection();
        sql = "SELECT f.*, f.numeroAnticipoColaborador AS vNum";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo, pro.IBAN as IBAN"
        sql += "  FROM antcol AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId";
        sql += " LEFT JOIN comerciales AS pro ON pro.comercialId = f.comercialId";
        sql += " WHERE noContabilizar = 0";
        sql += " AND contabilizada = 0";
        if(departamentoId && departamentoId > 0) {
            sql += " AND f.departamentoId = "+ departamentoId;
        } else {
            sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
        }
        if(dFecha && hFecha) {
            sql += " AND f.fecha >= ? AND f.fecha <= ?";
            sql = mysql.format(sql, [dFecha, hFecha]);
        }
        sql += " ORDER BY  f.fecha ASC";
        connection.query(sql, function (err, res) {
            closeConnection(connection);
            if (err) return callback(err);
            anticipos = res;
            callback(null, anticipos);
        });
    });
}


//METODOS RELACIONADOS CON LOS DEPARTAMENTOS DE USUARIO

// getFacturasColaboradoresUsuario
// lee los registros de la tabla facprove cuyo departamento tenga asignado el usuario logado y
// los devuelve como una lista de objetos
module.exports.getAnticiposColaboradoresUsuario = function (usuarioId, departamentoId) {
    let connection = null;
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            sql = "SELECT pf.*,";
            sql += " fp.nombre AS vFPago";
            sql += " FROM antcol AS pf";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
            sql += " WHERE"
            if(departamentoId > 0) {
                sql += " pf.departamentoId = " + departamentoId;
            } else {
                sql += " pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
            }
            sql += " ORDER BY  pf.fecha DESC";
            const [anticipos] = await connection.query(sql)
            connection.end();
            resolve (anticipos);
        } catch(error) {
            if (connection) await connection.end();
            reject (err);
        }
    });
}


module.exports.getAnticiposColaborador = function (comercialId, callback) {
    var connection = getConnection();
    var sql = "SELECT * FROM AntCol WHERE comercialId = ?";
    sql = mysql.format(sql,comercialId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        callback(null, result);
    })
}











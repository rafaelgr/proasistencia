// anticiposColaboradores_db_mysql
// Manejo de la tabla anticipos de colaboradores en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment");
var contabilidadDb = require("../contabilidad/contabilidad_db_mysql");

var fs = require("fs"),
    path = require("path");

//  leer la configurción de MySQL

//var config2 = require("../../config.json");
var fs = require('fs');



var sql = "";
var Stimulsoft = require('stimulsoft-reports-js');

var ioAPI = require('../ioapi/ioapi');

var correoAPI = require('../correoElectronico/correoElectronico');
var conexion = require('../comun/comun')

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
    comprobado = (comprobado && antcol.hasOwnProperty("colaboradorId"));
    comprobado = (comprobado && antcol.hasOwnProperty("fecha"));
    return comprobado;
}


// getAnticiposColaboradores
// lee  los registros de la tabla anticipos  que tienen alguna factura asociada y 
// los devuelve como una lista de objetos
module.exports.getAnticiposColaboradores = function (callback) {
    var connection = getConnection();
    var anticipos = null;
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago";
    sql += " FROM antcol AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " ORDER BY pf.fecha DESC";
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        anticipos = result;
        callback(null, anticipos);
    });
}

module.exports.getAnticiposContrato = function (contratoId, callback) {
    var connection = getConnection();
    var antcol = null;
    sql = "SELECT pf.*, fps.importe AS importeServiciado, fp.nombre AS vFPago, cm.referencia AS ref";
    sql += " FROM antcol AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN antcol_serviciados AS fps ON fps.antcolId = pf.antcolId";
    sql += " LEFT JOIN contratos AS cm ON cm.contratoId = fps.contratoId";
    sql += " LEFT JOIN empresas AS c ON c.empresaId = cm.empresaId ";
    sql += " WHERE fps.contratoId = ?";
    sql += " ORDER BY pf.fecha";
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        antcol = result;
        callback(null, antcol);
    });
}



module.exports.getTipoCliente = function (contratoId, callback) {
    var connection = getConnection();
    sql = "SELECT con.clienteId as cliente, cli.tipoclienteId as tipoCliente FROM contratos AS con INNER JOIN clientes AS cli ON con.clienteId = cli.clienteId";
    sql += " WHERE con.contratoId = ?";
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        } else {
            callback(null, result);
        }
    });

}
// getAnticipoColaboradore
// busca  la anttura con id pasado
module.exports.getAnticipoColaborador = function (id, callback) {
    var connection = getConnection();
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, p.IBAN";
    sql += " FROM antcol AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN colaboradores as p ON p.colaboradorId = pf.colaboradorId";
    sql += " WHERE pf.antcolId = ?";
    sql = mysql.format(sql, id);
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

// getAnticipoColaboradore
// busca  la anttura con id pasado
module.exports.getAnticipoPorNumero = function (numeroAnticipoColaborador, proId,callback) {
    var connection = getConnection();
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago";
    sql += " FROM antcol AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " WHERE pf.numeroAnticipoColaborador = ? AND pf.colaboradorId = ?";
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
// busca  las anticipos con id del colaborador pasado que sean completos
module.exports.getAnticipoColaboradorId = function (id, callback) {
    var connection = getConnection();
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo";
    sql += " FROM antcol AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " WHERE pf.colaboradorId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result);
    });
}



// getAnticipoColaboradoreId
// busca  las anticipos con id del colaborador pasado que esten vinculados
module.exports.getAnticipoColaboradorTodos = function (id, contratoId,callback) {
    var connection = getConnection();
    var sql = "SELECT DISTINCT"; 
    sql += " pf.antcolId,";
    sql += " pf.numeroAnticipoColaborador,";
    sql += " pf.emisorNombre,";
    sql += " pf.receptorNombre,";
    sql += " pf.fecha,";
    sql += " s.importe AS totalConIva, ";
    sql += " fp.nombre AS vFPago, ";
    sql += " cm.referencia";
    sql += " FROM antcol AS pf ";
    sql += " INNER JOIN `antcol_serviciados` AS s ON s.antcolId = pf.antcolId";
    sql += " INNER JOIN `facprove_serviciados` AS s2 ON s2.contratoId = s.contratoId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId ";
    sql += " LEFT JOIN contratos AS cm ON cm.contratoId = s.contratoId ";
    sql += " LEFT JOIN empresas AS en ON en.empresaId = cm.empresaId ";
    sql += " WHERE pf.colaboradorId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result);
    });
}




// getAnticiposAll
// lee todos los registros de la tabla anticipos y
// los devuelve como una lista de objetos
module.exports.getAnticiposAll = function (callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago";
    sql += " FROM antcol AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " ORDER BY pf.fecha DESC";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        facturas = result;
        callback(null, facturas);
    });
}





// postAnticipo
// crear en la base de datos la anttura de colaborador pasada
module.exports.postAnticipo = function (antcol, callback) {
    antcol.antcolId = 0; // fuerza el uso de autoincremento
    if (!comprobarAntCol(antcol)) {
        var err = new Error("El anttura del colaborador pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    sql = "INSERT INTO antcol SET ?";
    sql = mysql.format(sql, antcol);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        antcol.antcolId = result.insertId;
        callback(null, antcol);
    });
}

// putAnticipo
// Modifica la anttura de colaborador según los datos del objeto pasado
// y guarda un documento adjunto a dicha anttura si este existe
module.exports.putAnticipo = function (id, antcol, callback) {
    /*if (!comprobarAntCol(antcol)) {
        var err = new Error("la anttura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }*/
    if (id != antcol.antcolId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    if (err) {
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE antcol SET ? WHERE antcolId = ?";
    sql = mysql.format(sql, [antcol, antcol.antcolId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        callback(null, antcol);
       
    });
}





module.exports.putAntColAnticipoToNull = function (facprove, callback) {
    facprove.contratoId = null;
    var connection = getConnection();
    sql = "UPDATE antcol SET ? WHERE antcolId = ?";
    sql = mysql.format(sql, [facprove, facprove.antcolId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        } else {
            callback(null, result);
        }
    });
}


// deleteAnticipo
// Elimina el prefactura con el id pasado
module.exports.deleteAnticipo = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE from antcol WHERE antcolId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
}



module.exports.getAnticiposCliente = function (clienteId, callback) {
    var connection = comun.getConnectionDb(conta);
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
        sql += " LEFT JOIN colaboradores AS pro ON pro.colaboradorId = f.colaboradorId";
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

// ----------------- CONTABILIZACION
module.exports.postContabilizarAnticipos = function (dFecha, hFecha, departamentoId, usuarioId,done) {
    var con = getConnection();
    if(dFecha == "null" || hFecha == "null") {
        dFecha = 0;
        hFecha = 0;
    }
    var listas = [];
    var sql = "SELECT f.*, ser.antcolId AS serviciada, SUM(ser.importe) AS totalServiciado";
    sql += " FROM antcol as f";
    sql += " LEFT JOIN antcol_serviciados AS ser ON ser.antcolId = f.antcolId";
    sql += " WHERE sel = 1 AND contabilizada = 0  AND noContabilizar = 0";
    if(departamentoId && departamentoId > 0) {
        sql += " AND f.departamentoId =" + departamentoId;
    } else {
        sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
    }
    if(dFecha && hFecha) {
        sql += "  AND f.fecha >= ? AND f.fecha <= ?";
        sql = mysql.format(sql, [dFecha, hFecha]);
    }
    sql += "  GROUP BY f.antcolId, serviciada  ORDER BY  f.fecha ASC"
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        var numantcol = [];//guardara los numeros de anttura de colaborador no contabilizados por no tener serviciadas
        for(var i=0; i < rows.length; i++) {
            if(rows[i].total != rows[i].totalServiciado && rows[i].departamentoId != 7 && rows[i].completo == 1){
                numantcol.push(rows[i].numeroAnticipoColaborador);
                rows.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
                i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
            }
        }
        listas.push(numantcol);
        if(rows.length > 0) {
             //eliminamos la propiedad serviciada para contabilizar la anttura
             for(var j = 0; j < rows.length; j++) {
                delete rows[j].serviciada
                delete rows[j].totalServiciado
            }
            contabilidadDb.contabilizarFacturasColaboradorSoloPagos(rows, function (err, result) {
                if (err) return done(err);
                listas.push(result);
                done(null, listas);
            });
        } else {
            done(null, listas);
        }
    });
}

//------------------------VISADAS----------------
module.exports.getVisadasAnticipo = function (visada, callback) {
    var connection = getConnection();
    sql = "SELECT f.*, f.numeroAnticipoColaborador AS vNum";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo"
        sql += "  FROM antcol AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
        sql += " WHERE visada = ?";
        sql += " order by f.fecha DESC, f.antcolId ASC"
        sql = mysql.format(sql, visada);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}


// putAnticipo
// Modifica el anticipo de colaborador según los datos del objeto pasado
module.exports.putAnticipoVisada = function (id, antcol,  callback) {
    if (!comprobarAntCol(antcol)) {
        var err = new Error("la anttura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != antcol.antcolId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    if (err) {
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE antcol SET ? WHERE antcolId = ?";
    sql = mysql.format(sql, [antcol, antcol.antcolId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, antcol);
    });
}

//METODOS RELACIONADOS CON LOS DEPARTAMENTOS DE USUARIO

// getFacturasColaboradoresUsuario
// lee los registros de la tabla facprove cuyo departamento tenga asignado el usuario logado y
// los devuelve como una lista de objetos
module.exports.getAnticiposColaboradoresUsuario = function (usuarioId, departamentoId,callback) {
    var connection = getConnection();
    var prefacturas = null;
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
    sql = mysql.format(sql, usuarioId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        prefacturas = result;
        callback(null, prefacturas);
    });
}

// getAnticiposAll
// lee todos los registros de la tabla anticipos y
// los devuelve como una lista de objetos
module.exports.getAnticiposAllUsuario = function (usuarioId, departamentoId, callback) {
    var connection = getConnection();
    var facturas = null;
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago";
    sql += " FROM antcol AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    if(departamentoId > 0) {
        sql += " WHERE pf.departamentoId = " + departamentoId;
    } else {
        sql += " WHERE pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
    }
    sql += " ORDER BY  pf.fecha DESC";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        facturas = result;
        callback(null, facturas);
    });
}


module.exports.getAnticiposColaborador = function (colaboradorId, callback) {
    var connection = getConnection();
    var sql = "SELECT * FROM AntCol WHERE colaboradorId = ?";
    sql = mysql.format(sql,colaboradorId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return callback(err);
        callback(null, result);
    })
}











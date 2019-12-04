// anticiposProveedores_db_mysql
// Manejo de la tabla anticipos de proveedores en la base de datos
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
function comprobarAntclien(antclien) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof antclien;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && antclien.hasOwnProperty("antclienId"));
    comprobado = (comprobado && antclien.hasOwnProperty("empresaId"));
    comprobado = (comprobado && antclien.hasOwnProperty("proveedorId"));
    comprobado = (comprobado && antclien.hasOwnProperty("fecha"));
    return comprobado;
}


// getAnticiposProveedores
// lee  los registros de la tabla anticipos  que tienen alguna factura asociada y 
// los devuelve como una lista de objetos
module.exports.getAnticiposProveedores = function (callback) {
    var connection = getConnection();
    var anticipos = null;
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo";
    sql += " FROM antclien AS pf";
    sql += " LEFT JOIN antclien AS f ON f.antclienId = pf.antclienId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " WHERE pf.facturaId IS NULL"
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
    var antclien = null;
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, cm.referencia, c.direccion as dirTrabajo";
    sql += " FROM antclien AS pf";
    sql += " LEFT JOIN antclien AS f ON f.antclienId = pf.antclienId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId"
    sql += " LEFT JOIN empresas as c ON c.empresaId = cm.empresaId";
    sql += " LEFT JOIN antclien_serviciados AS fps ON fps.antclienId = pf.antclienId"
    sql += " WHERE fps.contratoId = ?";
    sql += " ORDER BY pf.fecha";
    sql = mysql.format(sql, contratoId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        antclien = result;
        callback(null, antclien);
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

// getNuevaRefAntclien
// busca la siguiente id en la tabla
module.exports.getNuevaRefAntclien = function (fecha, callback) {
    var antclien = fnGetNumeroAntclien(fecha);
    return antclien;
}




// getAnticipoProveedore
// busca  la anttura con id pasado
module.exports.getAnticipoProveedor = function (id, callback) {
    var connection = getConnection();
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo";
    sql += " FROM antclien AS pf";
    sql += " LEFT JOIN antclien AS f ON f.antclienId = pf.antclienId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " WHERE pf.antclienId = ?";
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

// getAnticipoProveedoreId
// busca  las anticipos con id del proveedor pasado
module.exports.getAnticipoProveedorId = function (id, callback) {
    var connection = getConnection();
    var preanticipos = null;
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo";
    sql += " FROM antclien AS pf";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " WHERE pf.proveedorId = ? AND pf.completo = 1";
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
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo";
    sql += " FROM antclien AS pf";
    sql += " LEFT JOIN antclien AS f ON f.antclienId = pf.antclienId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
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
// crear en la base de datos la anttura de proveedor pasada
module.exports.postAnticipo = function (antclien, callback) {
    antclien.antclienId = 0; // fuerza el uso de autoincremento
    if (!comprobarAntclien(antclien)) {
        var err = new Error("El anttura del proveedor pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    fnGetNumeroAntclien(antclien, function (err, res) {
        if (err) return callback(err);
        

        sql = "INSERT INTO antclien SET ?";
        sql = mysql.format(sql, antclien);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) {
                return callback(err);
            }
            antclien.antclienId = result.insertId;
            callback(null, antclien);
        });
    });
}

// putAnticipo
// Modifica la anttura de proveedor según los datos del objeto pasado
// y guarda un documento adjunto a dicha anttura si este existe
module.exports.putAnticipo = function (id, antclien, callback) {
    /*if (!comprobarAntclien(antclien)) {
        var err = new Error("la anttura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }*/
    if (id != antclien.antclienId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    if (err) {
        return callback(err);
    }
    sql = "UPDATE antclien SET ? WHERE antclienId = ?";
    sql = mysql.format(sql, [antclien, antclien.antclienId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        } 
        callback(null, antclien);
    });
}

// getNuevaRef
// obtine la referencIA cuando se cambia la empresa
module.exports.getNuevaRef = function (antclien, callback) {
    fnGetNumeroAntclien(antclien, function (err, res) {
        if (err) return callback(err);
        callback(null, res);
        
    });
}

module.exports.putAntProveAnticipoToNull = function (facprove, callback) {
    facprove.facturaId = null;
    var connection = getConnection();
    sql = "UPDATE antclien SET ? WHERE antclienId = ?";
    sql = mysql.format(sql, [facprove, facprove.antclienId]);
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
    sql = "DELETE from antclien WHERE antclienId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
}

module.exports.del = function (file, done) {
    var filename = path.join(__dirname, '../../public/ficheros/anticipos_proveedores/' + file);
    fs.unlinkSync(filename);
    done(null);
}

// deletePreanticiposContrato
// Elimina todas las prefacturas pertenecientes a un contrato.
module.exports.deletePreanticiposContrato = function (id, callback) {
    var connection = getConnection();
    sql = "DELETE from prefacturas WHERE contratoClienteMantenimientoId = ? AND generada = 1";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


// -- Obtener número de anttura de proveedor
// La idea es devolver la anttura de proveedor con los campos ano y numero.
//luego creamos la referencia concatenendo dichos campos. El numero constará de 6 digitos
//completados con ceros
var fnGetNumeroAntclien = function (antclien, done) {
    var con = getConnection();
    var ano = moment(antclien.fecha_recepcion).year();
    sql = "SELECT MAX(numero) AS n FROM antclien";
    sql += " WHERE ano = ? AND empresaId = ?";
    sql = mysql.format(sql, [ano, antclien.empresaId]);
    con.query(sql, function (err, res) {
        con.end()
        if (err) return done(err);
        // actualizar los campos del objeto antclien
        antclien.numero = res[0].n +1;
        antclien.ano = ano;
        var referencia = estableceRef(antclien.numero, 7);
        antclien.ref = antclien.ano  + '-' + antclien.empresaId + referencia;
        done(null, antclien);
    });
}



var estableceRef = function (final, numdigitos) {
    var s1 = '-' + final;
    var n1 = s1.length;
    var n2 = numdigitos - n1 + 1;
    var s2 = Array(n2).join('0');
    var ref = '-' + s2 + final;
    return ref;
}

var roundToTwo = function (num) {
    return +(Math.round(num + "e+2") + "e-2");
};



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
    var sql = "UPDATE antclien SET sel = 1";
    sql += " WHERE noContabilizar = 0";
    sql += " AND contabilizada = 0";
    if(departamentoId && departamentoId > 0) {
        sql += " AND departamentoId =" + departamentoId;
    } else {
        sql += " AND departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
    }
    if(dFecha && hFecha) {
        sql += "  AND fecha_recepcion >= ? AND fecha_recepcion <= ?";
        sql = mysql.format(sql, [dFecha, hFecha]);
    }
    connection.query(sql, function (err, res) {
        if (err) return callback(err);
        sql = "SELECT f.*, f.numeroAnticipoProveedor AS vNum";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo, pro.IBAN as IBAN"
        sql += "  FROM antclien AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId";
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId";
        sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = f.proveedorId";
        sql += " WHERE noContabilizar = 0";
        sql += " AND contabilizada = 0";
        if(departamentoId && departamentoId > 0) {
            sql += " AND f.departamentoId = "+ departamentoId;
        } else {
            sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
        }
        if(dFecha && hFecha) {
            sql += " AND f.fecha_recepcion >= ? AND f.fecha_recepcion <= ?";
            sql = mysql.format(sql, [dFecha, hFecha]);
        }
        sql += " ORDER BY f.ref ASC, f.fecha ASC";
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
    var sql = "SELECT f.*, ser.antclienId AS serviciada, SUM(ser.importe) AS totalServiciado";
    sql += " FROM antclien as f";
    sql += " LEFT JOIN antclien_serviciados AS ser ON ser.antclienId = f.antclienId";
    sql += " WHERE sel = 1 AND contabilizada = 0  AND noContabilizar = 0";
    if(departamentoId && departamentoId > 0) {
        sql += " AND f.departamentoId =" + departamentoId;
    } else {
        sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId+")"
    }
    if(dFecha && hFecha) {
        sql += "  AND f.fecha_recepcion >= ? AND f.fecha_recepcion <= ?";
        sql = mysql.format(sql, [dFecha, hFecha]);
    }
    sql += "  GROUP BY f.antclienId, serviciada  ORDER BY f.ref ASC, f.fecha ASC"
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        var numantclien = [];//guardara los numeros de anttura de proveedor no contabilizados por no tener serviciadas
        for(var i=0; i < rows.length; i++) {
            if(rows[i].total != rows[i].totalServiciado && rows[i].departamentoId != 7){
                numantclien.push(rows[i].numeroAnticipoProveedor);
                rows.splice(i,1);//eliminamos un elemto del array y modificamops su tamaño
                i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
            }
        }
        if(numantclien.length > 0)  done(null, listas);
        if(rows.length > 0) {
             //eliminamos la propiedad serviciada para contabilizar la anttura
             for(var j = 0; j < rows.length; j++) {
                delete rows[j].serviciada
                delete rows[j].totalServiciado
            }
            contabilidadDb.contabilizarFacturasProveedorSoloPagos(rows, function (err) {
                if (err) return done(err);
                done(null, numantclien);
            });
        } else {
            done(null, numantclien);
        }
    });
}

//------------------------VISADAS----------------
module.exports.getVisadasAnticipo = function (visada, callback) {
    var connection = getConnection();
    sql = "SELECT f.*, f.numeroAnticipoProveedor AS vNum";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo"
        sql += "  FROM antclien AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
        sql += " WHERE visada = ?";
        sql += " order by f.fecha DESC, f.antclienId ASC"
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
// Modifica la anttura de proveedor según los datos del objeto pasado
module.exports.putAnticipoVisada = function (id, antclien,  callback) {
    if (!comprobarAntclien(antclien)) {
        var err = new Error("la anttura pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != antclien.antclienId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    if (err) {
        return callback(err);
    }
    
    sql = "UPDATE antclien SET ? WHERE antclienId = ?";
    sql = mysql.format(sql, [antclien, antclien.antclienId]);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err);
        }
        callback(null, antclien);
    });
}

//METODOS RELACIONADOS CON LOS DEPARTAMENTOS DE USUARIO

// getFacturasProveedoresUsuario
// lee los registros de la tabla facprove cuyo departamento tenga asignado el usuario logado y
// los devuelve como una lista de objetos
module.exports.getFacturasProveedoresUsuario = function (usuarioId, departamentoId,callback) {
    var connection = getConnection();
    var prefacturas = null;
    sql = "SELECT pf.*,";
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo";
    sql += " FROM antclien AS pf";
    sql += " LEFT JOIN antclien AS f ON f.antclienId = pf.antclienId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    sql += " WHERE pf.facturaIdfinal dia IS NULL"
    if(departamentoId > 0) {
        sql += " AND pf.departamentoId = " + departamentoId;
    } else {
        sql += " AND pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
    }
    sql += " ORDER BY  pf.fecha_recepcion DESC";
    sql = mysql.format(sql, usuarioId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        result.forEach(function (pf) {
            pf.vNum = pf.serie + '-' + pf.ano + '-' + pf.numero;
        });
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
    sql += " fp.nombre AS vFPago, cm.referencia, en.direccion as dirTrabajo";
    sql += " FROM antclien AS pf";
    sql += " LEFT JOIN antclien AS f ON f.antclienId = pf.antclienId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = pf.formaPagoId";
    sql += " LEFT JOIN contratos as cm ON cm.contratoId = pf.contratoId";
    sql += " LEFT JOIN empresas as en ON en.empresaId = cm.empresaId";
    if(departamentoId > 0) {
        sql += " WHERE pf.departamentoId = " + departamentoId;
    } else {
        sql += " WHERE pf.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
    }
    sql += " ORDER BY  pf.fecha_recepcion DESC";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        facturas = result;
        callback(null, facturas);
    });
}

//------------------------VISADAS----------------
module.exports.getVisadasAnticipoUsuario = function (visada, usuarioId, departamentoId, callback) {
    var connection = getConnection();
    sql = "SELECT f.*, f.numeroAnticipoProveedor AS vNum";
        sql += " , fp.nombre as formaPago, cnt.direccion as dirTrabajo"
        sql += "  FROM antclien AS f";
        sql += " LEFT JOIN formas_pago as fp ON fp.formaPagoId = f.formaPagoId"
        sql += " LEFT JOIN contratos as cnt ON cnt.contratoId = f.contratoId"
        sql += " WHERE visada = ?";
        if(departamentoId > 0) {
            sql += " AND f.departamentoId = " + departamentoId;
        } else {
            sql += " AND f.departamentoId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
        }
        sql += " order by f.fecha_recepcion DESC"
        sql = mysql.format(sql, visada);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}









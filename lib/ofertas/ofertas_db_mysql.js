var cm = require('../comun/comun'),
    mysql = require('mysql'),
    async = require('async')
    const mysql2 = require('mysql2/promise') ;

var comercialesDb = require('../comerciales/comerciales_db_mysql');
var articulosDb = require('../articulos/articulos_db_mysql');
var correoAPI = require('../correoElectronico/correoElectronico');
var Stimulsoft = require('stimulsoft-reports-js');
var fs = require('fs');

var AWS = require('aws-sdk');

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

module.exports.getOfertas = function (done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT of.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM ofertas AS of";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = of.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = of.clienteId";
        sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = of.tipoOfertaId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = of.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = of.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = of.formaPagoId";
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getOfertasUsuario = function (usuarioId, departamentoId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT of.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente,"
        sql += " tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago, co.nombre AS comercialCliente";
        sql += " FROM ofertas AS of";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = of.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = of.clienteId";
        sql += " LEFT JOIN comerciales AS co ON co.comercialId = cl.colaboradorId";
        sql += " LEFT JOIN departamentos AS tp ON tp.departamentoId = of.tipoOfertaId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = of.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = of.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = of.formaPagoId";
        if(departamentoId > 0) {
            sql += " WHERE of.tipoOfertaId = " + departamentoId;
        } else {
            sql += " WHERE of.tipoOfertaId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
        }
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getOfertasUsuarioLineal = function (usuarioId, departamentoId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT of.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente,"
        sql += " tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago, co.nombre AS comercialCliente";
        sql += " FROM ofertas AS of";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = of.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = of.clienteId";
        sql += " LEFT JOIN comerciales AS co ON co.comercialId = cl.colaboradorId";
        sql += " LEFT JOIN departamentos AS tp ON tp.departamentoId = of.tipoOfertaId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = of.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = of.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = of.formaPagoId";
        sql += " WHERE beneficioLineal = 1"
        if(departamentoId > 0) {
            sql += " AND of.tipoOfertaId = " + departamentoId;
        } else {
            sql += " AND of.tipoOfertaId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
        }
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getOfertasUsuarioComercial = async (usuarioId, departamentoId, comercialId) => {
    let con = null;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            var sql = "SELECT of.*,";
            sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
            sql += " FROM ofertas AS of";
            sql += " LEFT JOIN empresas AS em ON em.empresaId = of.empresaId";
            sql += " LEFT JOIN clientes AS cl ON cl.clienteId = of.clienteId";
            sql += " LEFT JOIN departamentos AS tp ON tp.departamentoId = of.tipoOfertaId";
            sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = of.mantenedorId";
            sql += " LEFT JOIN comerciales AS com ON com.comercialId = of.agenteId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = of.formaPagoId";
            if(departamentoId > 0) {
                sql += " WHERE of.tipoOfertaId = " + departamentoId;
            } else {
                sql += " WHERE of.tipoOfertaId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
            }
            if(comercialId > 0) {
                sql += " AND of.agenteId = " + comercialId
            }
            const [ofertas] = await con.query(sql);
            await con.end();
            resolve(ofertas)

        } catch(e) {
            if(con) {
                if (!con.connection._closing) {
                    await con.end();
                } 
            }
            reject (e);
        }
    });
}

module.exports.getOfertasNoAceptadas = function (done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT of.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM ofertas AS of";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = of.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = of.clienteId";
        sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = of.tipoOfertaId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = of.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = of.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = of.formaPagoId";
        sql += " WHERE of.fechaAceptacionOferta IS NULL"
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getOfertasNoAceptadasClienteReparaciones = function (clienteId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT of.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
        sql += " FROM ofertas AS of";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = of.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = of.clienteId";
        sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = of.tipoOfertaId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = of.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = of.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = of.formaPagoId";
        sql += " WHERE of.servicioId IS NULL AND of.clienteId = ? AND of.tipoOfertaId = 7";
        sql = mysql.format(sql, clienteId);
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}


module.exports.getOfertasNoAceptadasDepartamentos = function (usuarioId, departamentoId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT of.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo,"; 
        sql += " cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago, co.nombre AS comercialCliente";
        sql += " FROM ofertas AS of";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = of.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = of.clienteId";
        sql += " LEFT JOIN comerciales AS co ON co.comercialId = cl.colaboradorId";
        sql += " LEFT JOIN departamentos AS tp ON tp.departamentoId = of.tipoOfertaId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = of.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = of.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = of.formaPagoId";
        sql += " WHERE of.fechaAceptacionOferta IS NULL";
        if(departamentoId > 0) {
            sql += " AND of.tipoOfertaId = " + departamentoId;
        } else {
            sql += " AND of.tipoOfertaId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
        }
        sql += " ORDER BY of.fechaOferta DESC"
        con.query(sql, function (err, ofertas) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, ofertas);
        })
    });
}

module.exports.getOfertasNoAceptadasDepartamentosLineal = function (usuarioId, departamentoId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT of.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo,"; 
        sql += " cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago, co.nombre AS comercialCliente";
        sql += " FROM ofertas AS of";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = of.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = of.clienteId";
        sql += " LEFT JOIN comerciales AS co ON co.comercialId = cl.colaboradorId";
        sql += " LEFT JOIN departamentos AS tp ON tp.departamentoId = of.tipoOfertaId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = of.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = of.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = of.formaPagoId";
        sql += " WHERE of.fechaAceptacionOferta IS NULL AND of.beneficioLineal = 1";
        if(departamentoId > 0) {
            sql += " AND of.tipoOfertaId = " + departamentoId;
        } else {
            sql += " AND of.tipoOfertaId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
        }
        sql += " ORDER BY of.fechaOferta DESC"
        con.query(sql, function (err, ofertas) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, ofertas);
        })
    });
}

module.exports.getOfertasNoAceptadasDepartamentosComercial = async (usuarioId, departamentoId, comercialId) => {
    let con = null;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            var sql = "SELECT of.*,";
            sql += " em.nombre AS empresa, cl.nombre AS cliente, tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago";
            sql += " FROM ofertas AS of";
            sql += " LEFT JOIN empresas AS em ON em.empresaId = of.empresaId";
            sql += " LEFT JOIN clientes AS cl ON cl.clienteId = of.clienteId";
            sql += " LEFT JOIN departamentos AS tp ON tp.departamentoId = of.tipoOfertaId";
            sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = of.mantenedorId";
            sql += " LEFT JOIN comerciales AS com ON com.comercialId = of.agenteId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = of.formaPagoId";
            sql += " WHERE of.fechaAceptacionOferta IS NULL"
            if(departamentoId > 0) {
                sql += " AND of.tipoOfertaId = " + departamentoId;
            } else {
                sql += " AND of.tipoOfertaId IN (SELECT departamentoId FROM usuarios_departamentos WHERE usuarioId = "+ usuarioId +")"
            }
            if(comercialId > 0) {
                sql += " AND of.agenteId = " + comercialId
            }
            const [ofertas] = await con.query(sql);
            await con.end();
            resolve(ofertas)

        }catch(e) {
            if(con) {
                if (!con.connection._closing) {
                    await con.end();
                } 
            }
            reject (e);
        }
    });
}


module.exports.getOferta = function (ofertaId, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT of.*,";
        sql += " em.nombre AS empresa,"
        sql += " cl.nombre AS cliente,"
        sql += " cl.direccion2 AS direccion,";
        sql += " cl.codPostal2 AS codpostal,"
        sql += " cl.poblacion2 AS poblacion,";
        sql += " cl.provincia2 AS provincia,";
        sql += " cl.tipoViaId2 AS tipoViaId,";
        sql += " tp.nombre AS tipo,"; 
        sql += " cl2.nombre AS mantenedor,"; 
        sql += " com.nombre AS agente,";
        sql += " co.nombre AS comercialCliente,"
        sql += " fp.nombre AS formaPago,";
        sql += " of.beneficioLineal AS beneficioLineal"
        sql += " FROM ofertas AS of";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = of.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = of.clienteId";
        sql += " LEFT JOIN tipos_mantenimiento AS tp ON tp.tipoMantenimientoId = of.tipoOfertaId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = of.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = of.agenteId";
        sql += " LEFT JOIN comerciales AS co ON co.comercialId = cl.colaboradorId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = of.formaPagoId";
        sql += " WHERE of.ofertaId = ?";
        sql = mysql.format(sql, ofertaId);
        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}

module.exports.getSiguienteReferencia = function (abrv, arquitectura, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT MAX(referencia) as mxref FROM ofertas WHERE referencia LIKE '" + abrv + "-%'";
        con.query(sql, function (err, reg) {
            cm.closeConnection(con);
            if (err) return done(err);
            var numero = 1;
            //formato normal
            var digitos = 6;
            var s1 = '000000';
            //formato arquitectura
            if(arquitectura == 'true') {
                digitos = 5;
                s1 = '00000'
            }
            
            if (reg.length > 0) {
                var mxref = reg[0].mxref;
                if (mxref) {
                    var campos = mxref.split('-');
                    numero = parseInt(campos[1]) + 1;
                }
            }
            var s = s1 + numero;
            var nuevaReferencia = abrv + "-" + s.substr(s.length - digitos);
            done(null, nuevaReferencia);
        });
    });
}

module.exports.getSiguienteReferenciaReparaciones = function (empresaId, comision, ano, done) {
    //cada empresa tiene su formato
    if(empresaId == 2) {
        formatoProas(comision, ano, empresaId,function(err, result) {
            if(err) return done(err);
            done(null, result);
        });
    }
    else if(empresaId == 3) {
        formatoFondo(comision, ano, empresaId, function(err, result) {
            if(err) return done(err);
            done(null, result);
        });
    } else {
        formatoRea(comision, ano, empresaId,function(err, result) {
            if(err) return done(err);
            done(null, result);
        });
    }
}

var formatoProas = function(comision, ano, empresaId, callback) {
    var connection = cm.getConnection();
    var nuevaReferencia = "";
        sql = " SELECT COALESCE(MAX(SUBSTRING_INDEX(referencia, '-',1)),0) +1  AS mxref FROM ofertas";
        sql += " WHERE empresaId = ? AND tipoOfertaId = 7";
        sql += " AND YEAR(fechaOferta) = ?";
        sql = mysql.format(sql, [empresaId, ano]);
        connection.query(sql, function (err, reg) {
            cm.closeConnection(connection);
            if (err)    return callback(err);
            if (reg.length > 0) {
                ano = ano.substring(2,4);
                var mxref = reg[0].mxref;
                if (mxref) {
                    var s = "0000" + mxref;
                    nuevaReferencia =  s.substr(s.length - 4) + "-" + comision + "/" + ano;
                }
            }
            callback(null, nuevaReferencia);
        });
}

var formatoFondo = function(comision, ano, empresaId, callback) {
    var connection = cm.getConnection();
    var nuevaReferencia = "";
        sql = " SELECT COALESCE(MAX(SUBSTRING_INDEX(SUBSTRING_INDEX(referencia, '-',1),'/', -1)),0) +1  AS mxref FROM ofertas";
        sql += " WHERE empresaId = ? AND tipoOfertaId = 7";
        sql += " AND YEAR(fechaOferta) = ?";
        sql = mysql.format(sql, [empresaId, ano]);
        connection.query(sql, function (err, reg) {
            cm.closeConnection(connection);
            if (err)    return callback(err);
            if (reg.length > 0) {
                var mxref = reg[0].mxref;
                if (mxref) {
                    var s = "000" + mxref;
                    nuevaReferencia = ano + "/" + s.substr(s.length - 3) + "-" + comision;
                }
            }
            callback(null, nuevaReferencia);
        });
}

var formatoRea =  function(comision, ano, empresaId, callback) {
    var connection = cm.getConnection();
    var nuevaReferencia = "";
        sql = " SELECT COALESCE(MAX(SUBSTRING_INDEX(SUBSTRING_INDEX(referencia, '-',-1),'/', 1)),0) +1  AS mxref FROM ofertas";
        sql += " WHERE empresaId = ? AND tipoOfertaId = 7";
        sql += " AND YEAR(fechaOferta) = ?";
        sql = mysql.format(sql, [empresaId, ano]);
        connection.query(sql, function (err, reg) {
            cm.closeConnection(connection);
            if (err)    return callback(err);
            if (reg.length > 0) {
                ano = ano.substring(2,4);
                var mxref = reg[0].mxref;
                if (mxref) {
                    var s = "000" + mxref;
                    nuevaReferencia = "R"+ "-" + s.substr(s.length - 3) + "/" + comision;
                }
            }
            callback(null, nuevaReferencia);
        });
}

module.exports.postOferta = function (oferta, done) {
    actualizarEnBaseDeDatos('POST', oferta, done);
}

module.exports.putOferta = function (oferta, done) {
    actualizarEnBaseDeDatos('PUT', oferta, done);
}

module.exports.deleteOferta = function (oferta, done) {
    actualizarEnBaseDeDatos('DELETE', oferta, done);
}

/*
|---------------------------------------|
|                                       |
|  LINEAS PREFACTURA                    |
|                                       |
|---------------------------------------|
*/


// comprobarOfertaLinea
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarOfertaLinea(ofertaLinea) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof ofertaLinea;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("ofertaId"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("ofertaLineaId"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("linea"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("articuloId"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("tipoIvaId"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("porcentaje"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("descripcion"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("cantidad"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("importe"));
    comprobado = (comprobado && ofertaLinea.hasOwnProperty("totalLinea"));
    return comprobado;
}

// getNextOfertaLine
// busca el siguiente número de línea de la oferta pasada
module.exports.getNextOfertaLineas = function (id, callback) {
    var connection = cm.getConnection();
    var ofertas = null;
    sql = "SELECT MAX(linea) as maxline FROM ofertas_lineas"
    sql += " WHERE ofertaId = ?;";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        var maxline = result[0].maxline;
        if (!maxline) {
            return callback(null, 1.1);
        }
        callback(null, roundToTwo(maxline + 0.1));
    });
}

// getOfertaLineas
// Devuelve todas las líneas de una prefacttura
module.exports.getOfertaLineas = function (id, desdeparte, proveedorId, callback) {
    var boolValue; 
    boolValue = (/true/i).test(desdeparte);
    var proveedorId = parseInt(proveedorId);
    if(isNaN(proveedorId)) proveedorId = false;


    var connection = cm.getConnection();
    var sql = "SELECT pfl.*, a.grupoArticuloId, a.codigoReparacion,u.abrev as unidades,"; 
    sql += " p.nombre AS proveedorNombre, pfl.coste AS costeLinea, of.* FROM ofertas_lineas as pfl";
    sql += " LEFT JOIN ofertas AS of ON of.ofertaId = pfl.ofertaId";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId";
    sql += " LEFT JOIN proveedores AS p ON p.proveedorId = pfl.proveedorId";
    sql += " WHERE pfl.ofertaId = " + id;
    if(proveedorId) {
        sql += " ORDER by FIELD(pfl.proveedorId, ?) DESC";
        sql = mysql.format(sql, proveedorId);
    } else if(boolValue) {
        sql += " ORDER by pfl.proveedorId";
    } else {
        sql += " ORDER by linea";
        sql = mysql.format(sql, id);
    }
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// getOfertaLineas
// Devuelve todas las líneas de una oferta
module.exports.getOfertaLineas = function (id, desdeparte, proveedorId, callback) {
    var boolValue; 
    boolValue = (/true/i).test(desdeparte);
    var proveedorId = parseInt(proveedorId);
    if(isNaN(proveedorId)) proveedorId = false;


    var connection = cm.getConnection();
    var sql = "SELECT pfl.*, a.grupoArticuloId, a.codigoReparacion,u.abrev as unidades, p.tipoProfesionalId, p.nombre AS proveedorNombre, pfl.coste AS costeLinea, of.* FROM ofertas_lineas as pfl";
    sql += " LEFT JOIN ofertas AS of ON of.ofertaId = pfl.ofertaId";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId";
    sql += " LEFT JOIN proveedores AS p ON p.proveedorId = pfl.proveedorId";
    sql += " WHERE pfl.ofertaId = " + id;
    if(proveedorId) {
        sql += " ORDER by FIELD(pfl.proveedorId, ?) DESC";
        sql = mysql.format(sql, proveedorId);
    } else if(boolValue) {
        sql += " ORDER by pfl.proveedorId";
    } else {
        sql += " ORDER by linea";
        sql = mysql.format(sql, id);
    }
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// getOfertaLineas
// Devuelve todas las líneas de una oferta para la app móvil
module.exports.getOfertaLineasProveedorMovil = async (id, proveedorId) => {
    let con = null;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
          
            var sql = "SELECT";
            sql += " pfl.ofertaLineaId AS ofertaLineaId,";
            sql += " pfl.ofertaId AS ofertaId,";
            sql += " pfl.capituloLinea AS capituloLinea,";
            sql += " pfl.linea AS linea,";
            sql += " pfl.unidadId AS  unidadId,";
            sql += " pfl.articuloId AS articuloId, ";
            sql += " a.nombre AS nombreArticulo,";
            sql += " a.codigoReparacion AS codigoArticulo,";
            //cliente
            sql += " pfl.tipoIvaId AS tipoIvaClienteId,";
            sql += " pfl.porcentaje AS ivaCliente,";
             //
            sql += " pfl.cantidad AS unidades,";
            sql += " pfl.importe AS precioCliente,";
            sql += " pfl.totalLinea AS importeCliente,";
            sql += " pfl.coste AS importeCliente,";
            sql += " pfl.perdto AS perdto,";
            sql += " pfl.dto AS dto,";
            sql += " pfl.precio AS importeCliente,";
            //proveedor
            sql += " pfl.tipoIvaProveedorId AS tipoIvaProveedorId,";
            sql += " pfl.porcentajeProveedor AS ivaProveedor,";
            sql += " pfl.proveedorId AS proveedorId,";
             //
            sql += " pfl.importeProveedor AS precioProveedor,";
            sql += " pfl.perdtoProveedor AS perdtoProveedor,";
            sql += " pfl.dtoProveedor AS dtoProveedor,";
            sql += " pfl.precioProveedor AS importeProveedor,";
            sql += " pfl.totalLineaProveedorIva AS importeProveedorIva,";
            sql += " pfl.costeLineaProveedor AS costeLineaProveedor,";
               
            sql += " pfl.descripcion AS descripcion";
            sql += " FROM ofertas_lineas as pfl";
            sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
            sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId";
            sql += " LEFT JOIN proveedores AS p ON p.proveedorId = pfl.proveedorId";
            sql += " WHERE pfl.ofertaId = ?";
            sql = mysql2.format(sql, id);
            if(proveedorId != 0) {
                sql += " AND pfl.proveedorId = ?";
                sql = mysql2.format(sql, proveedorId);
            }
            sql += " ORDER BY pfl.proveedorId"
            let  [result] = await con.query(sql);
            await con.end();
            //let ofertalineaFormat = await this.transformOfertaLineaParte(result)
            resolve(result);
        } catch(e) {
            if(con) {
                if (!con.connection._closing) {
                    await con.end();
                } 
            }
            reject (e);
        }
    });
}

// getOfertaLinea
// Devuelve la línea de oferta solcitada por su id.
module.exports.getOfertaLinea = function (id, callback) {
    var connection = cm.getConnection();
    var ofertas = null;
    sql = "SELECT pfl.*, a.grupoArticuloId, u.abrev as unidades FROM ofertas_lineas as pfl";
    sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
    sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId"
    sql += " WHERE pfl.ofertaLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

// postOfertaLinea
// crear en la base de datos la linea de oferta pasada
module.exports.postOfertaLinea = function (ofertaLinea, callback) {
    if (!comprobarOfertaLinea(ofertaLinea)) {
        var err = new Error("La linea de oferta pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = cm.getConnection();
    ofertaLinea.ofertaLineaId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO ofertas_lineas SET ?";
    sql = mysql.format(sql, ofertaLinea);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        ofertaLinea.ofertaLineaId = result.insertId;
        // actualizar las bases y cuotas
        fnActualizarBases(ofertaLinea.ofertaId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, ofertaLinea);
        })
    });
}

// transformParteOfertaLinea
// crea un abjeto de oferta_linea a prtir de otro de parteLinea
module.exports.transformParteOfertaLinea = function (p, callback) {
    //Recuparamos el articulo a partir de codigoArticulo para obtener su Id
    articulosDb.getArticuloPorCodigo(p.codigoArticulo, function(err, result) {
        if(err) return callback(err, null);
        if(result) {
            p.articuloId = result.articuloId;
            return callback(null, ofertaLinea);
        }
        return callback(null, null);
    });
}


// transformOfertaLineaParte
// crea un abjeto de parteLinea a prtir de otro de ofertaLinea
module.exports.transformOfertaLineaParte = async (lineas) => {
    var arrObj = [];
    for(let o of lineas) {
        //Recuparamos el articulo a partir de su id
        try {
            let result = await articulosDb.getArticulo(o.articuloId) 
            if(result) {
                let ofertaLinea = {
                    //
                    //parteLineaId: o.ofertaLineaId,
                    ofertaLineaId: o.ofertaLineaId,
                    //parteId: o.ofertaId,
                    ofertaId: o.ofertaId,
                    capituloLinea: o.capituloLinea,
                    linea: o.linea,
                    unidadId:  o.unidadId,
                    articuloId: result.articuloId, 
                    nombreArticulo: result.nombre,
                    codigoArticulo: result.codigoReparacion,
                    //cliente
                    tipoIvaClienteId: o.tipoIvaId,		
                    ivaCliente: o.porcentaje,
                    //
                    unidades: parseFloat(o.cantidad),
                    precioCliente: parseFloat(o.importe),
                    importeCliente: parseFloat(o.totalLinea),
                    importeCliente: parseFloat(o.coste),
                    perdto: parseFloat(o.perdto),
                    dto: parseFloat(o.dto),
                    importeCliente: parseFloat(o.precio),
                    
                    
                    
                    //proveedor
                    tipoIvaProveedorId: o.tipoIvaProveedorId,
                    ivaProveedor: o.porcentajeProveedor,
                    proveedorId: o.proveedorId,
                    //
                    precioProveedor: parseFloat(o.importeProveedor),
                    //importeProveedor: o.totalLineaProveedor,
                    //importeProveedor: o.costeLineaProveedor,
                    perdtoProveedor: parseFloat(o.perdtoProveedor),
                    dtoProveedor: parseFloat(o.dtoProveedor),
                    importeProveedor: parseFloat(o.precioProveedor),
                    importeProveedorIva: parseFloat(o.totalLineaProveedorIva),
                    costeLineaProveedor: parseFloat(o.costeLineaProveedor),
                    
                    //calculadora
                    // porcentajeBeneficio: o.porcentajeBeneficio,
                    // importeBeneficioLinea: o.importeBeneficioLinea,
                    // porcentajeAgente: o.porcentajeAgente,
                    // importeAgenteLinea: o.importeAgenteLinea,
                    // ventaNetaLinea: o.ventaNetaLinea,
                    
                    descripcion: o.descripcion
                }
                arrObj.push(ofertaLinea);
            }
        } catch(err) {
            return err;
        }
    }
    return arrObj;
}


// putOfertaLinea
// Modifica la linea de oferta según los datos del objeto pasao
module.exports.putOfertaLinea = function (id, ofertaLinea, callback) {
    if (!comprobarOfertaLinea(ofertaLinea)) {
        var err = new Error("La linea de oferta pasada es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != ofertaLinea.ofertaLineaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = cm.getConnection();
    sql = "UPDATE ofertas_lineas SET ? WHERE ofertaLineaId = ?";
    sql = mysql.format(sql, [ofertaLinea, ofertaLinea.ofertaLineaId]);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(ofertaLinea.ofertaId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, ofertaLinea);
        })
    });
}

// putOfertaLinea
// Modifica la linea de oferta según los datos del objeto pasao
module.exports.putOfertaLineaDescuentosMovil = function (id, ofertaLinea, callback) {
   
    if (id != ofertaLinea.ofertaLineaId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = cm.getConnection();
    sql = "UPDATE ofertas_lineas SET ? WHERE ofertaLineaId = ?";
    sql = mysql.format(sql, [ofertaLinea, ofertaLinea.ofertaLineaId]);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(ofertaLinea.ofertaId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null, ofertaLinea);
        })
    });
}

// deleteOfertaLinea
// Elimina la linea de oferta con el id pasado
module.exports.deleteOfertaLinea = function (id, ofertaLinea, callback) {
    var connection = cm.getConnection();
    sql = "DELETE from ofertas_lineas WHERE ofertaLineaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        // actualizar las bases y cuotas
        fnActualizarBases(ofertaLinea.ofertaId, function (err, res) {
            if (err) {
                return callback(err);
            }
            callback(null);
        })
    });
}

// getOfertasProveedor
module.exports.getOfertasProveedor = async (proveedorId, estado, dFecha, hFecha, direccionTrabajo) => {
	let con = null;
    var ofertas = null;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());

            var sql = "SELECT o.*, c.nombre AS cliNombre, emp.usuCorreo AS email,"; 
            sql +=  " emp.nombre AS empresa, pa.estadoParteProfesionalId, pa.parteId,"; 
            sql += " pa.tipoProfesionalId";
            sql += " FROM ofertas AS o";
            sql += " LEFT JOIN ofertas_lineas AS ol ON ol.ofertaId = o.ofertaId";
            sql += " LEFT JOIN proveedores AS p ON p.proveedorId = ol.proveedorId ";
            sql += " LEFT JOIN clientes AS c ON c.clienteId = o.clienteId";
            sql += " LEFT JOIN empresas AS emp ON emp.empresaId = o.empresaId";
            sql += " INNER JOIN partes AS pa ON pa.ofertaId = o.ofertaId";
            sql += " WHERE NOT pa.proveedorId IS NULL AND pa.proveedorId = ? AND o.tipoOfertaId = 7";
            sql = mysql2.format(sql, proveedorId)
            
            //if(asignados == 'false') { sql += " AND o.servicioId IS NULL " };
            switch(estado) {
                case "1": {
                    break;
                }
                case "2": {
                    sql += " AND (pa.estadoParteProfesionalId <> 1 AND pa.estadoParteProfesionalId <> 4)";
                    break;
                }
                case "3": {
                    sql += " AND (pa.estadoParteProfesionalId = 1 OR pa.estadoParteProfesionalId = 4)";
                    break;
                }
                case "4": {
                    sql += " AND NOT o.servicioId IS NULL";
                    break;
                }
                default:
                    break;
            }
        
        
            if(dFecha != 'null' && hFecha != 'null') sql += " AND o.fechaOferta BETWEEN '" + dFecha + " 00:00:00' AND '" + hFecha + " 00:00:00'";
            if(dFecha != 'null' && hFecha == 'null') sql += " AND o.fechaOferta >= '" + dFecha + " 00:00:00'";

            if(direccionTrabajo != 'null') sql += " AND c.direccion2 LIKE '%" + direccionTrabajo + "%'";
        
            sql += " GROUP BY o.ofertaId";
            sql += " ORDER BY o.fechaOferta DESC";
            let [result] = await con.query(sql);
            await con.end();
            if(result.length == 0){
                return resolve(null);
            }
            return resolve(result);
        } catch(e) {
            if(con) {
                if (!con.connection._closing) {
                    await con.end();
                } 
            }
            reject (e);
        }
    });
}

// getOfertaParte
module.exports.getOfertaParte = async (ref, clienteId, ofertaId) => {
	let con = null;
    var ofertas = null;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());

            var sql = "SELECT o.*, e.nombre AS empresa, e.usuCorreo As email FROM ofertas AS o";
            sql += " LEFT JOIN partes AS p on p.ofertaId = o.ofertaId"
            sql += " LEFT JOIN empresas As e ON e.empresaId = o.empresaId";
            sql += " WHERE o.referencia = ? AND o.tipoOfertaId = 7 AND o.clienteId = ? AND p.ofertaId = ?";
            sql = mysql2.format(sql, [ref, clienteId, ofertaId])
          
            let [result] = await con.query(sql);
            await con.end();
            if(result.length == 0){
                return resolve(null);
            }
            return resolve(result[0]);
        } catch(e) {
            if(con) {
                if (!con.connection._closing) {
                    await con.end();
                } 
            }
            reject (e);
        }
    });
}


// getOfertaParte
module.exports.getParteOferta = async (ofertaId, proId) => {
	let con = null;
    var ofertas = null;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());

            var sql = "SELECT";
            sql += " p.parteId,";
            sql += " pr.proveedorId,";
            sql += " p.numParte,"; 
            sql += " p.tipoProfesionalId,";
            sql += " pr.nombre AS proveedorNombre";
            sql += " FROM partes AS p";
            sql += " LEFT JOIN proveedores as pr On pr.proveedorId = p.proveedorId";
            sql += " WHERE p.ofertaId = ? and p.proveedorId = ?";
            sql = mysql2.format(sql, [ofertaId, proId]);
          
            let [result] = await con.query(sql);
            await con.end();
            if(result.length == 0){
                return resolve(null);
            }
            return resolve(result[0]);
        } catch(e) {
            if(con) {
                if (!con.connection._closing) {
                    await con.end();
                } 
            }
            reject (e);
        }
    });
}

module.exports.postOfertaVinculaParte = async (oferta) => {
	let con = null;
    let datos = {};
    let sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            //Montamos el objeto con el que actualizaremos el parte
            let datos = {
                parteId: oferta.parteId,
                presupuesto: 1,
                refPresupuesto: oferta.referencia,
                estadoPresupuesto: 1,
                estadoParteProfesionalId: oferta.estadoParteProfesionalId
            }
            delete oferta.parteId;
            delete oferta.estadoParteProfesionalId;
            con = await mysql2.createConnection(obtenerConfiguracion());
            await con.beginTransaction();
            //creamos la oferta
            sql = "INSERT INTO ofertas SET ?";
            sql = mysql2.format(sql, oferta);
            let [result] = await con.query(sql);
            oferta.ofertaId = result.insertId;
            datos.ofertaId = result.insertId;
            //vinculamos la oferta con un parte de trabajo
            sql = " UPDATE partes SET ? WHERE parteId = ?";
            sql = mysql2.format(sql, [datos, datos.parteId]);
            let [result2] = await con.query(sql);
            await con.commit();
            await con.end();
            return resolve(oferta);
        } catch(e) {
            if(con) {
                if (!con.connection._closing) {
                    await con.rollback();
					await con.end();
                } 
            }
            reject (e);
        }
    });
}


module.exports.putOfertaActulizaParte = async (oferta) => {
	let con = null;
    let sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            //Montamos el objeto con el que actualizaremos el parte
            let datos = {
                parteId: oferta.parteId,
                estadoParteProfesionalId: oferta.estadoParteProfesionalId
            }
            delete oferta.parteId;
            delete oferta.estadoParteProfesionalId;
            con = await mysql2.createConnection(obtenerConfiguracion());
            await con.beginTransaction();
            //creamos la oferta
            sql = "UPDATE ofertas SET ? WHERE ofertaId = ?";
            sql = mysql2.format(sql, [ oferta, oferta.ofertaId ]);
            let [result] = await con.query(sql);
            
            //vinculamos la oferta con un parte de trabajo
            sql = " UPDATE partes SET ? WHERE parteId = ?";
            sql = mysql2.format(sql, [datos, datos.parteId]);
            let [result2] = await con.query(sql);
            await con.commit();
            await con.end();
            return resolve(oferta);
        } catch(e) {
            if(con) {
                if (!con.connection._closing) {
                    await con.rollback();
					await con.end();
                } 
            }
            reject (e);
        }
    });
}




// recalculo de línea de oferta
module.exports.recalculoLineasOferta = function (ofertaId, coste, porcentajeBeneficio, porcentajeAgente, done) {
    var con = cm.getConnection();
    // Buscamos la líneas de la oferta
    sql = " SELECT pf.coste as costeOfertaCompleta, pfl.*";
    sql += " FROM ofertas as pf";
    sql += " LEFT JOIN ofertas_lineas as pfl ON pfl.ofertaId = pf.ofertaId";
    sql += " WHERE pf.ofertaId = ?";
    sql = mysql.format(sql, ofertaId);
    con.query(sql, function (err, lineas) {
        con.end();
        if (err) return done(err);
        // Tratamos secuencialmente sus líneas
        async.eachSeries(lineas, function (linea, callback) {
            // Obtenemos el porcentaje del nuevo coste que le corresponde a esa línea
           /*  var porcentajeDelCoste = linea.coste / linea.costeOfertaCompleta;
            var importeDelNuevoCoste = coste * porcentajeDelCoste;
            linea.coste = importeDelNuevoCoste; */
            linea.porcentajeBeneficio = porcentajeBeneficio;
            linea.porcentajeAgente = porcentajeAgente;
            // Recalculamos el total de la línea en base a los nuevos datos
            linea.totalLinea = obtenerImporteAlClienteDesdeCoste( linea.coste, porcentajeBeneficio, porcentajeAgente);
            // Eliminamos la propiedad que sobra para que la línea coincida con el registro
            delete linea.costeOfertaCompleta;
            // Actualizamos la línea lo que actualizará de paso la oferta
            exports.putOfertaLinea(linea.ofertaLineaId, linea, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })
        }, function (err) {
            if (err) return done(err);
            done(null);
        });
    });

}

// recalculo de línea de oferta
module.exports.recalculoLineasOfertaLineal = function (ofertaId, porcentajeAgente, done) {
    var con = cm.getConnection();
    // Buscamos la líneas de la oferta
    sql = " SELECT pf.coste as costeOfertaCompleta, pfl.*";
    sql += " FROM ofertas as pf";
    sql += " LEFT JOIN ofertas_lineas as pfl ON pfl.ofertaId = pf.ofertaId";
    sql += " WHERE pf.ofertaId = ?";
    sql = mysql.format(sql, ofertaId);
    con.query(sql, function (err, lineas) {
        con.end();
        if (err) return done(err);
        // Tratamos secuencialmente sus líneas
        async.eachSeries(lineas, function (linea, callback) {
            // Obtenemos el porcentaje del nuevo coste que le corresponde a esa línea
           /*  var porcentajeDelCoste = linea.coste / linea.costeOfertaCompleta;
            var importeDelNuevoCoste = coste * porcentajeDelCoste;
            linea.coste = importeDelNuevoCoste; */
            linea.porcentajeAgente = porcentajeAgente;
            // Recalculamos el total de la línea en base a los nuevos datos
            var obj = obtenerImporteAlClienteDesdeCosteLineal( linea, porcentajeAgente);
            linea.totalLinea = obj.totalLinea;
            linea.importeAgenteLinea = obj.importeAgenteLinea;
            linea.coste = obj.coste,
            linea.importe = obj.importe
            // Eliminamos la propiedad que sobra para que la línea coincida con el registro
            delete linea.costeOfertaCompleta;
            // Actualizamos la línea lo que actualizará de paso la oferta
            exports.putOfertaLinea(linea.ofertaLineaId, linea, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })
        }, function (err) {
            if (err) return done(err);
            done(null);
        });
    });

}


var ProcesaDocumObj = function(doc, carpeta) {
	//if((doc.length == 1 && !doc[0].facproveId) || (doc.length == 1 && !doc[0].antproveId)) return doc;
	var antdir = null;
	var cont = 1;
	var regs = [];
	var docObj = {
		
	};
	var dirObj = {
		
	};

	carpeta.forEach(d => {
        doc.forEach(e => {
		if(antdir) {
			if(antdir == d.carpetaId ) {
				if(e.ofertaDocumentoId) {//procesamos las facturas
					docObj = {
                        ofertaDocumentoId: e.ofertaDocumentoId,
						location: e.location,
                        key: e.key
						
					};
                    if(d.carpetaId == e.carpetaId) {
                        dirObj.documentos.push(docObj);
                    }
					docObj = {}; //una vez incluida la factura en el documento se limpian los datos
				}
                antdir = d.carpetaId;
				
			} else  {
				//si es otro documento de pago guardamos el anterior y creamos otro
				regs.push(dirObj);
				dirObj = {
					carpetaNombre: d.carpetaNombre,
                    carpetaId: d.carpetaId,
					documentos: [],
				};
				if(e.ofertaDocumentoId) {//procesamos las facturas
					docObj = {
                        ofertaDocumentoId: e.ofertaDocumentoId,
						location: e.location,
                        key: e.key
						
					};
					
                    if(d.carpetaId == e.carpetaId) {
                        dirObj.documentos.push(docObj);
                    }
					docObj = {}; //una vez incluida la factura en el documento se limpian los datos
				}

				
				antdir = d.carpetaId;
			} 

		}
		if(!antdir) {
			dirObj = {
				carpetaNombre: d.carpetaNombre,
                carpetaId: d.carpetaId,
				documentos: [],
			};
			if(e.ofertaDocumentoId) {
				docObj = {
                    ofertaDocumentoId: e.ofertaDocumentoId,
                    location: e.location,
                    key: e.key
                    
                };
                
				if(d.carpetaId == e.carpetaId) {
                    dirObj.documentos.push(docObj);
                }
				docObj = {};
			}
            antdir = d.carpetaId;
		}
        });
        //si se trata del ultimo registro lo guardamos
		if(cont == carpeta.length) {
			regs.push(dirObj);
		}
		cont++;

	});
    

	return regs;
}

var obtenerImporteAlClienteDesdeCoste = function (coste, porcentajeBeneficio, porcentajeAgente) {
    var importeBeneficio = 0;
    var ventaNeta = 0;
    var importeAlCliente = 0;
    var importeAgente = 0;
    if (coste != null) {
        if (porcentajeBeneficio) {
            importeBeneficio = roundToTwo(porcentajeBeneficio * coste / 100);
        }
        ventaNeta = roundToTwo((coste * 1) + (importeBeneficio * 1));
    }
    if (porcentajeAgente) {
        importeAlCliente = roundToTwo(ventaNeta / ((100 - porcentajeAgente) / 100));
        importeAgente = roundToTwo(importeAlCliente - ventaNeta);
    }
    importeAlCliente = roundToTwo((ventaNeta * 1) + (importeAgente * 1));
    return importeAlCliente;
}



var obtenerImporteAlClienteDesdeCosteLineal = function (linea, porcentajeAgente) {
    var totalLinea = 0;
    var importeAgenteLinea = 0;
   
    if (porcentajeAgente) {
        //vm.importeCliente(roundToTwo(vm.ventaNeta() / ((100 - vm.porcentajeAgente()) / 100)));
        totalLinea = roundToTwo(linea.ventaNetaLinea / ((100 - porcentajeAgente) / 100));
        coste = roundToTwo((linea.ventaNetaLinea / ((100 - porcentajeAgente) / 100))/linea.cantidad);
        importe = roundToTwo((linea.ventaNetaLinea / ((100 - porcentajeAgente) / 100))/linea.cantidad);
        importeAgenteLinea = roundToTwo(totalLinea - linea.ventaNetaLinea);
    }
    var obj = {
        totalLinea: totalLinea,
        importeAgenteLinea: importeAgenteLinea,
        coste: coste,
        importe: importe
    }
    return obj;
}


// fnActualizarBases
// Actuliza la tabla de bases y cuotas de la oferta pasada
// basándose en los tipos y porcentajes de las líneas
var fnActualizarBases = function (id, callback) {
    fnBorraBases(id, function (err, res) {
        if (err) {
            return callback(err);
        }
        var connection = cm.getConnection();
        sql = "INSERT INTO ofertas_bases (ofertaId, tipoIvaId, porcentaje, base, cuota)";
        sql += " SELECT pl.ofertaId, pl.tipoIvaId, pl.porcentaje, pl.base, pl.cuota";
        sql += " FROM";
        sql += " (SELECT ofertaId, tipoIvaId, porcentaje, SUM(totalLinea) AS base,";
        sql += " ROUND((SUM(totalLinea) * (porcentaje /100)),2) AS cuota";
        sql += " FROM ofertas_lineas";
        sql += " WHERE ofertaId = ?";
        sql += " GROUP BY tipoIvaId) AS pl";
        sql += " ON DUPLICATE KEY UPDATE base = pl.base, cuota = pl.cuota";
        sql = mysql.format(sql, id);
        connection.query(sql, function (err, result) {
            cm.closeConnection(connection);
            if (err) {
                return callback(err);
            }
            // Antes de volver actualizamos los totales y así está hecho
            fnActualizarTotales(id, function (err, result) {
                if (err) return callback(err);
                callback(null);
            })
        });
    })
}

// fnActualizarTotales
// Actuliza los campos de totales de la cabecera de factura
// basándose en los tipos y porcentajes de las líneas
var fnActualizarTotales = function (id, callback) {
    var connection = cm.getConnection();
    sql = "UPDATE ofertas AS pf,";
    sql += " (SELECT ofertaId, SUM(base) AS b, SUM(cuota) AS c";
    sql += " FROM ofertas_bases GROUP BY 1) AS pf2,";
    sql += " (SELECT ofertaId, SUM(coste) AS sc";
    sql += " FROM ofertas_lineas GROUP BY 1) AS pf3";
    sql += " SET pf.importeCliente = pf2.b, pf.total = pf2.b, pf.totalConIva = pf2.b + pf2.c,";
    sql += " pf.coste = pf3.sc";
    sql += " WHERE pf.ofertaId = ?";
    sql += " AND pf2.ofertaId = pf.ofertaId";
    sql += " AND pf3.ofertaId = pf.ofertaId";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// fnBorraBases
// elimina las bases y cuotas de una oferta
// antes de actualizarlas
var fnBorraBases = function (id, callback) {
    var connection = cm.getConnection();
    sql = "DELETE FROM ofertas_bases";
    sql += " WHERE ofertaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

// getOfertaBases
// devuelve los regitros de bases y cutas de la 
// oferta con el id pasado
module.exports.getOfertaBases = function (id, callback) {
    var connection = cm.getConnection();
    var ofertas = null;
    sql = "SELECT pb.*, ti.nombre as tipo";
    sql += " FROM ofertas_bases as pb";
    sql += " LEFT JOIN tipos_iva as ti ON ti.tipoIvaId = pb.tipoIvaId"
    sql += " WHERE ofertaId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        cm.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
}

module.exports.generarContratoDesdeOferta = function (ofertaId, datosAceptacion, beneficioLineal, done) {
    var nuevoContrato = null;
    // obtener un conector para transacciones
    cm.getConnectionCallbackTransaction(function (err, con) {
        if (err) return con.rollback(function () { done(err) });
        async.series({
            paso1: function (callback) {
                // insertar la cabecera del nuevo contrato
                insertarCabeceraNuevoContrato(ofertaId, datosAceptacion, con, function (err, contrato) {
                    if (err) return callback(err);
                    nuevoContrato = contrato;
                    callback();
                });
            },
            paso2: function (callback) {
                // insertar las líneas del nuevo contratos
                if(beneficioLineal == 0) {
                    insertarLineasNuevoContrato(ofertaId, nuevoContrato.contratoId, con, function (err) {
                        if (err) return callback(err);
                        callback();
                    });
                } else {
                    insertarLineasNuevoContratoLineal(ofertaId, nuevoContrato.contratoId, con, function (err) {
                        if (err) return callback(err);
                        callback();
                    });
                }
            },
            paso3: function (callback) {
                // insertar las bases del nuevo contraro
                insertarBasesNuevoContrato(ofertaId, nuevoContrato.contratoId, con, function (err) {
                    if (err) return callback(err);
                    callback();
                });
            },
            paso4: function (callback) {
                // crear como comisionista el colaborador asociado al agente con su comisión
                crearComisionistasNuevoContrato(nuevoContrato, con, function (err) {
                    if (err) return callback(err);
                    callback();
                });

            },
            paso5: function (callback) {
                // actualizar la cabecera de oferta con el identificador de contrato
                actualizarCabeceraOferta(nuevoContrato, datosAceptacion, con, function (err) {
                    if (err) return callback(err);
                    callback();
                });
            }
        }, function (err) {
            if (err) return con.rollback(function () { done(err) });
            con.commit(function (err) {
                if (err) return con.rollback(function () { done(err) });
                done(null, nuevoContrato);
            })
        });
    })
}

var insertarCabeceraNuevoContrato = function (ofertaId, datosAceptacion, con, done) {
    module.exports.getOferta(ofertaId, function (err, ofertas) {
        if (err) return done(err);
        var oferta = ofertas[0];
        var nuevoContrato = obtenerContratoDesdeOfertaYDatosAceptacion(oferta, datosAceptacion);

        sql = "INSERT INTO contratos SET ?";
        sql = mysql.format(sql, nuevoContrato);

        con.query(sql, function (err, res) {
            if (err) return done(err);
            nuevoContrato.contratoId = res.insertId;
            done(null, nuevoContrato);
        })
    });
}

var obtenerContratoDesdeOfertaYDatosAceptacion = function (oferta, datosAceptacion) {
    var nuevoContrato = oferta;
    nuevoContrato.contratoId = 0; // es un alta

    nuevoContrato.tipoContratoId = oferta.tipoOfertaId;
    nuevoContrato.fechaContrato = datosAceptacion.fechaAceptacionOferta;

    delete nuevoContrato.tipoOfertaId;
    delete nuevoContrato.fechaOferta;
    delete nuevoContrato.fechaAceptacionOferta;
    delete nuevoContrato.empresa;
    delete nuevoContrato.cliente;
    delete nuevoContrato.tipo;
    delete nuevoContrato.mantenedor;
    delete nuevoContrato.agente;
    delete nuevoContrato.formaPago;
    delete nuevoContrato.rappelAgente;
    delete nuevoContrato.comercialCliente;
    delete nuevoContrato.conceptosExcluidos;
    delete nuevoContrato.creadaApp;

    nuevoContrato.fechaInicio = datosAceptacion.fechaInicio;
    nuevoContrato.fechaFinal = datosAceptacion.fechaFinal;
    nuevoContrato.fechaOriginal = datosAceptacion.fechaOriginal;
    nuevoContrato.preaviso = datosAceptacion.preaviso;
    nuevoContrato.facturaParcial = datosAceptacion.facturaParcial;
    nuevoContrato.fechaPrimeraFactura = datosAceptacion.fechaPrimeraFactura;

    

    //parametros de obras
    nuevoContrato.contratoIntereses = 0;
    nuevoContrato.firmaActa = 0;
    nuevoContrato.fechaFirmaActa = null;
    nuevoContrato.certificacionFinal = 0;
    nuevoContrato.intereses = 0;



    return nuevoContrato;
}

var insertarLineasNuevoContrato = function (ofertaId, contratoId, con, done) {
    var sql = "INSERT INTO contratos_lineas";
    sql += " SELECT 0 AS contratoLineaId, ofl.linea, ? AS contratoId, ofl.unidadId,";
    sql += " ofl.articuloId, ofl.tipoIvaId, ofl.porcentaje, ofl.descripcion, ofl. cantidad, ofl.importe,";
    sql += " ofl.totalLinea,  0  AS costeUnidad,  ofl.coste, ofl.porcentajeBeneficio, 0 AS importeBeneficioLinea,";  
    sql += " ofl.porcentajeAgente, 0 AS importeAgenteLinea, 0 AS ventaNetaLinea, ofl.capituloLinea"
    sql += " FROM ofertas_lineas AS ofl";
    sql += " WHERE ofl.ofertaId = ?";
    sql = mysql.format(sql, [contratoId, ofertaId]);

    con.query(sql, function (err, res) {
        if (err) return done(err);
        done(null);
    });
}

var insertarLineasNuevoContratoLineal = function (ofertaId, contratoId, con, done) {
    var sql = "INSERT INTO contratos_lineas";
    sql += " SELECT 0 AS contratoLineaId, ofl.linea, ? AS contratoId, ofl.unidadId,";
    sql += " ofl.articuloId, ofl.tipoIvaId, ofl.porcentaje, ofl.descripcion, ofl. cantidad, ofl.importe,";
    sql += " ofl.totalLinea,  ofl.importeProveedor  AS costeUnidad,  ofl.costeLineaProveedor As coste, ofl.porcentajeBeneficio, ofl.importeBeneficioLinea," 
    sql += " ofl.porcentajeAgente, ofl.importeAgenteLinea, ofl.ventaNetaLinea, ofl.capituloLinea";
    sql += " FROM ofertas_lineas AS ofl";
    sql += " WHERE ofl.ofertaId = ?";
    sql = mysql.format(sql, [contratoId, ofertaId]);

    con.query(sql, function (err, res) {
        if (err) return done(err);
        done(null);
    });
}

var insertarBasesNuevoContrato = function (ofertaId, contratoId, con, done) {
    var sql = "INSERT INTO contratos_bases";
    sql += " SELECT 0 AS contratoBaseId, ? AS contratoId,";
    sql += " ofb.tipoIvaId, ofb.porcentaje, ofb.base, ofb.cuota";
    sql += " FROM ofertas_bases AS ofb";
    sql += " WHERE ofb.ofertaId = ?"
    sql = mysql.format(sql, [contratoId, ofertaId]);

    con.query(sql, function (err, res) {
        if (err) return done(err);
        done(null);
    });
}

var crearComisionistasNuevoContrato = function (nuevoContrato, con, done) {
    var comision = 0;
    var comisionistaId = null;
    // buscar el comercial asociado al comisionista
    comercialesDb.getComercial(nuevoContrato.agenteId, function (err, comercial) {
        if (err) return done(err);
        if (!comercial) return done(null);
        comisionistaId = comercial.ascComercialId;
        // buscar la comision de ese comercial en base al contrato
        comercialesDb.buscarComision(comisionistaId, nuevoContrato.clienteId, nuevoContrato.empresaId, nuevoContrato.tipoContratoId,
            function (err, res) {
                if (err) return done(err);
                // dar de alta en contratos_comisionistas la línea correspondiente
                comision = res;
                var sql = "INSERT INTO contratos_comisionistas";
                sql += " VALUES(0, ?, ?, ?, 0, 0)";
                sql = mysql.format(sql, [nuevoContrato.contratoId, comisionistaId, comision]);

                con.query(sql, function (err, res) {
                    if (err) return done(err);
                    done(null);
                });
            });
    });
}



var actualizarCabeceraOferta = function (nuevoContrato, datosAceptacion, con, done) {
    var sql = "UPDATE ofertas SET contratoId = ? , fechaAceptacionOferta = ?"
    sql += " WHERE ofertaId = ?";
    sql = mysql.format(sql, [nuevoContrato.contratoId, datosAceptacion.fechaAceptacionOferta, nuevoContrato.ofertaId]);

    con.query(sql, function (err, res) {
        if (err) return done(err);
        done(null);
    });
}

// private functions
var actualizarEnBaseDeDatos = function (comando, oferta, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "";
        switch (comando) {
            case 'POST':
                sql = "INSERT INTO ofertas SET ?";
                sql = mysql.format(sql, oferta);
                break;
            case 'PUT':
                sql = "UPDATE ofertas SET ? WHERE ofertaId = ?";
                sql = mysql.format(sql, [oferta, oferta.ofertaId]);
                break;
            case 'DELETE':
                sql = "DELETE FROM ofertas WHERE ofertaId = ?";
                sql = mysql.format(sql, oferta.ofertaId);
                break;
            default:
                return done(new Error('Comado de actualización incorrecto'));
                break;
        }
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) return done(err);
            if (comando == 'POST') oferta.ofertaId = result.insertId;
            done(null, oferta);
        })
    });
}

var roundToTwo = function (num) {
    return +(Math.round(num + "e+2") + "e-2");
};

//CONCEPTOS COBROS

// getConceptoCobroLineas
module.exports.getConceptoCobroLineas = function (id, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        sql = "SELECT cp.*, fp.nombre AS formaPagoNombre FROM oferta_porcentajes AS cp";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = cp.formaPagoId";
        sql += "  WHERE cp.ofertaId = ? ORDER BY cp.fecha ASC";
        sql = mysql.format(sql, id);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) {
                return callback(err, null);
            }
            if (result.length == 0) {
                return callback(null, null);
            }
            callback(null, result);
        });
    });
}

// getConceptoCobroLineas
module.exports.getConceptoCobroLinea = function (id, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        sql = "SELECT * FROM oferta_porcentajes ";
        sql += "  WHERE ofertaPorcenId = ?";
        sql = mysql.format(sql, id);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) {
                return callback(err, null);
            }
            if (result.length == 0) {
                return callback(null, null);
            }
            callback(null, result);
        });
    });
}

// postConceptoCobro
// crear en la base de datos el ConceptoCobro pasado
module.exports.postConceptoCobroLineas = function (ConceptoCobroLinea, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        ConceptoCobroLinea.ofertaPorcenId = 0; // fuerza el uso de autoincremento
        sql = "INSERT INTO oferta_porcentajes SET ?";
        sql = mysql.format(sql, ConceptoCobroLinea);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) {
                return callback(err);
            }
            ConceptoCobroLinea.ofertaPorcenId = result.insertId;
            callback(null, ConceptoCobroLinea);
        });
    });
}

// putConceptoCobro
// Modifica el ConceptoCobro según los datos del objeto pasao
module.exports.putConceptoCobroLinea = function (id, ConceptoCobroLinea, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        sql = "UPDATE oferta_porcentajes SET ? WHERE ofertaPorcenId = ?";
        sql = mysql.format(sql, [ConceptoCobroLinea, id]);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) {
                return callback(err);
            }
            callback(null, ConceptoCobroLinea);
        });
    });
}

// deletetarifaClienteLinea
// Elimina la linea de tarifa con el id pasado
module.exports.deleteConceptoCobroLinea = function (id, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        sql = "DELETE from oferta_porcentajes WHERE ofertaPorcenId = ?";
        sql = mysql.format(sql, id);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) return callback(err);
            callback(null);
        });
    });
}


module.exports.generarLineasConceptoDesdeOferta = function (datosAceptacion, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        sql = "INSERT INTO contrato_porcentajes (concepto, porcentaje, importe, formaPagoId, fecha, contratoId)";
        sql += " SELECT concepto, porcentaje, importe, formaPagoId, fecha, ? AS contratoId   FROM oferta_porcentajes WHERE ofertaId = ?"
        sql = mysql.format(sql, [datosAceptacion.contratoId, datosAceptacion.ofertaId]);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) {
                return done(err);
            }
            done(null, result);
        });
    });
}

// getConceptoCobroLineas
module.exports.getProveedoresTotales = function (id, callback) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        sql = "SELECT SUM(ol.totalLineaProveedor) AS totalProveedor, SUM(ol.totalLinea) AS totalLinea,"; 
        sql += " SUM(ol.totalLineaProveedorIva) AS totalProveedorIva,";
        sql += " ol.proveedorId, ol.ofertaLineaId, ol.ofertaId, p.nombre AS proveedornombre FROM ofertas_lineas AS ol";
        sql += " LEFT JOIN proveedores AS p ON p.proveedorId = ol.proveedorId";
        sql += " WHERE ol.ofertaId = ? GROUP BY ol.proveedorId";
         sql = mysql.format(sql, id);
        con.query(sql, function (err, result) {
            cm.closeConnection(con);
            if (err) {
                return callback(err, null);
            }
            if (result.length == 0) {
                return callback(null, null);
            }
            callback(null, result);
        });
    });
}

//ENVIO PRESUPUESTO ENVIADO
// crearCorreosAEnviar
module.exports.crearCorreoEnviar = (datos, callback) => {
	//RECUPERAMOS EL CORREO DE LA EMPRESA

    // 1- creamos un correo con un asunto por defecto y sin texto
    var correo = {};
   
        var asunto = 'PRESUPUESTO ENVIADO'
        var texto = "El proveedor " + datos.proveedorNombre  + " ha enviado el presupuesto " + datos.referencia + " Para su estudio";
		var enlace = "<br>" + process.env.ADM_CLIEN + "OfertaDetalle.html?OfertaId=" + datos.ofertaId;
    
    
    correo = {
		emisor: datos.email,
		destinatario: process.env.EMAIL_REP,
		asunto: asunto,
		cuerpo: texto + enlace
	}

    correoAPI.sendCorreo(correo, null, false, false, (err) => {
		if (err) {
			return callback(err);
		} else {
			callback(null, null);
		}
	});

}

//CREAR MRT OFERTA PROVEEDOR Y SUBIR A S3

// putParte
// Modifica el parte según los datos del objeto pasao
module.exports.postMrtUploadOferta = async (ofertaId, referencia, proveedorId, departamentoId, codigo) =>{
	let connection = null;
	let sql = "";
	return new Promise(async (resolve, reject) => {
		try {
			connection = await mysql2.createConnection(obtenerConfiguracion());
            let obj = await crearObjJsonOfertaAsync(ofertaId, proveedorId, connection)
			let result = await exportToPdfAsync(ofertaId, proveedorId, departamentoId, codigo, obj);
			if(!result) throw new Error("Fallo al crear el PDF");
			let result2 = await uploadParteAsync(result, connection);
			if(!result2) throw new Error("Fallo al crear el PDF");
			await connection.end();
			resolve(result2);

		} catch(err) {
			if(connection) {
				if (!connection.connection._closing) {
					await connection.end();
				} 
			}
			reject (err)
		}
	});
}

//version asincrona
//CREAR OBJETO PARA PARTE APPMOVIL
var crearObjJsonOfertaAsync = async (ofertaId, proveedorId, connection) => {
	//let connection = null;
	let sql = "";
	return new Promise(async (resolve, reject) => {
		//connection = await mysql2.createConnection(obtenerConfiguracion());
		try{
			var obj = 
			{
				ofertas: "",
				ofertas_lineas: "",
				ofertas_bases: "",
			}
			//cabecera de la oferta
			sql = "SELECT o.ofertaId, o.referencia, DATE_FORMAT(o.fechaOferta,'%d-%m-%Y') AS fechaOferta,";
            sql += " e.nombre AS nombreEmpresa, e.nif AS nifEmpresa,";
            sql += " TRIM(CONCAT(COALESCE(tv1.nombre, ''), ' ', e.direccion)) AS empresaDireccion, ";
            sql += " TRIM(CONCAT(COALESCE(tv3.nombre, ''), ' ', p.direccion)) AS proveedorDireccion, ";
            sql += " e.codPostal AS empresaCodPostal, e.poblacion AS empresaPoblacion, e.provincia AS empresaProvincia,";
            sql += " c.nombre AS clienteNombre, c.nif AS clienteNif, ol.importeProveedor,";
            sql += " TRIM(CONCAT(COALESCE(tv2.nombre, ''), ' ', c.direccion)) AS clienteDireccion, ";
            sql += " c.codPostal AS clienteCodPostal, c.poblacion AS clientePoblacion, c.provincia AS clienteProvincia,";
            sql += " o.total, o.totalConIva, o.observaciones, ";
            sql += " fp.nombre AS formaPago, ol.proveedorId, p.nombre as proveedornombre, p.nif AS proveedorNif, p.codPostal AS proveedorCodpostal, p.poblacion AS proveedorPoblación,";
            sql += " p.provincia AS proveedorProvincia";
            sql += " FROM ofertas AS o";
            sql += " LEFT JOIN empresas AS e ON e.empresaId = o.empresaId";
            sql += " LEFT JOIN clientes AS c ON c.clienteId = o.clienteId";
            sql += " LEFT JOIN ofertas_lineas AS ol ON ol.ofertaId = o.ofertaId";
            sql += " LEFT JOIN proveedores AS p ON p.proveedorId = ol.proveedorId";
            sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = o.formaPagoId";
            sql += " LEFT JOIN tipos_via AS tv1 ON tv1.tipoViaId = e.tipoViaId";
            sql += " LEFT JOIN tipos_via AS tv2 ON tv2.tipoViaId = c.tipoViaId";
            sql += " LEFT JOIN tipos_via AS tv3 ON tv3.tipoViaId = p.tipoViaId";
            sql += " WHERE o.ofertaId IN (" + ofertaId + ") AND ol.proveedorId = " + proveedorId;
            sql += " GROUP BY ol.proveedorId"
			let [result] = await connection.query(sql);
            if(result[0].fechaOferta) {
				result[0].fechaOferta = result[0].fechaOferta.toString();
			}
			obj.ofertas = result[0];
			//lineas
			sql = " SELECT ol.ofertaId, ol.ofertaLineaId,";
	        sql += " ol.linea, ol.capituloLinea, ol.descripcion,";
            sql += " ol.cantidad, ol.totalLinea, ol.totalLinea / ol.cantidad AS importe,";
            sql += " ol.importe, ol.perdto,  ol.importeProveedor,";
	        sql += " ol.totalLineaProveedor, ol.dto, ol.dtoProveedor, ";
            sql += " ol.precioProveedor, ol.proveedorId, u.abrev as unidad, a.nombre AS articulo,";
            sql += " ROUND(ol.importeProveedor - (ol.importeProveedor * (ol.perdtoProveedor / 100)), 2) AS  impDescUni,";
            //sql += " ol.costeLineaProveedor / ol.cantidad AS impDescUni,";
            sql += " SUBSTRING_INDEX(ol.descripcion, '\n', 1) AS primera_linea,";
	        sql += " CASE ";
            sql += "     WHEN LOCATE('\n', ol.descripcion) > 0 THEN SUBSTRING(ol.descripcion, LOCATE('\n', ol.descripcion) + 1)";
            sql += "     ELSE ''";
            sql += " END AS resto_lineas";
            sql += " FROM ofertas_lineas AS ol";
            sql += " LEFT JOIN unidades AS u on u.unidadId = ol.unidadId";
            sql += " LEFT JOIN articulos AS a ON a.articuloId = ol.articuloId";
            sql += " WHERE ol.ofertaId = ? AND ol.proveedorId = ?";
            sql += " ORDER BY 4,3";
			sql = mysql2.format(sql, [ofertaId, proveedorId]);
			let [result2] = await connection.query(sql);
			obj.ofertas_lineas = result2;
			//bases
            sql = "SELECT op.*, op.porcentaje/100 as porcen FROM oferta_porcentajes AS op";
            sql += " WHERE op.ofertaId = ?";
            sql = mysql2.format(sql, ofertaId);
            let [result3] = await connection.query(sql);
            obj.ofertas_bases = result3;
            resolve(obj);
		}catch(err) {
			resolve(null);
		}
	});                
}

var exportToPdfAsync = async (ofertaId, proveedorId, departamentoId, codigo, obj) => {
    return new Promise(async (resolve, reject) => {
        try {
            var nomfich = ofertaId + "_" + proveedorId + "_" + codigo + ".pdf";
            Stimulsoft.Base.StiLicense.key = process.env.STI_KEY;
            Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
            var report = new Stimulsoft.Report.StiReport();
            var file = process.env.REPORTS_DIR + "\\oferta_general_proveedores_json.mrt";
            if(departamentoId == 7) file =  process.env.REPORTS_DIR + "\\oferta_reparaciones_proveedor_json.mrt";
            report.loadFile(file);
            
            var dataSet = new Stimulsoft.System.Data.DataSet("ofert");
			dataSet.readJson(obj);
					
			// Remove all connections from the report template
			report.dictionary.databases.clear();
				
			//
			report.regData(dataSet.dataSetName, "", dataSet);
			report.dictionary.synchronize();
					
            // Renreding report
            report.renderAsync(function () {
                // Creating export settings
                var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                
                // Creating export service
                var service = new Stimulsoft.Report.Export.StiPdfExportService();
                // Creating MemoryStream
                var stream = new Stimulsoft.System.IO.MemoryStream();
    
                // Exportong report into the MemoryStream
                service.exportToAsync(function () {
                    // Converting MemoryStream into Array
                    var data = stream.toArray();
                    // Converting Array into buffer
                    var buffer = new Buffer.from(data, "utf-8")
    
                    try {
                        // Saving string with rendered report in PDF into a file
                        var pdf = process.env.PARTE_DIR + "\\" + nomfich;
                        fs.writeFileSync(process.env.PARTE_DIR + "\\" + nomfich, buffer);
                        var nom = nomfich.toString();
                        var data = {
                            ofertaId: ofertaId,
                            proveedorId: proveedorId,
                            nomfich: nom,
                            pdf: pdf
                        }
                        resolve(data);
                    } catch(err) {
                        return resolve(null);
                    }
    
                }, report, stream, settings);
            });

        }catch(err) {
			resolve(null);
		}
    });
}

var uploadParteAsync = async (data, connection) => {
	let sql = "";
	return new Promise(async (resolve, reject) => {
		try {
			sql = "SELECT * FROM parametros";
			let [parametros] = await connection.query(sql);
			var p = parametros[0];
			//AWS
			AWS.config.region = p.bucket_region;
			AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			  IdentityPoolId:  p.identity_pool,
			});
			var fileKey =  data.nomfich;
			const fileContent = fs.readFileSync(data.pdf);
			var params = {
				Bucket: p.bucket,
				Key: fileKey,
				IdentityPoolId: p.identity_pool,
				Body: fileContent,
				ACL: "public-read",
				ContentType: 'application/pdf'
			}
			// Use S3 ManagedUpload class as it supports multipart uploads
			var upload = new AWS.S3.ManagedUpload({
				params: params
			});
			var promise = upload.promise();
			promise
			.then (
				data2 => {
					if(data2) {
						try {
							fs.unlinkSync(data.pdf);
							//actualizamos el parte con la localización del archivo subido
							data.url = data2.Location
							resolve(data);
						} catch(err) {
							resolve(null);
						}
						
					}
					
				},
				err =>{
				 resolve(null)
				}
			);
		} catch(err) {
			resolve(null);
		}
		
	});
}

var rptOfertaParametros = function (ofertaId, proveedorId) {
    var sql = " SELECT o.ofertaId, o.referencia, DATE_FORMAT(o.fechaOferta,'%d-%m-%Y') AS fechaOferta,";
    sql += " e.nombre AS nombreEmpresa, e.nif AS nifEmpresa,";
    sql += " TRIM(CONCAT(COALESCE(tv1.nombre, ''), ' ' , e.direccion)) AS empresaDireccion, ";
    sql += " TRIM(CONCAT(COALESCE(tv3.nombre, ''), ' ' , p.direccion)) AS proveedorDireccion, ";
    sql += " e.codPostal AS empresaCodPostal, e.poblacion AS empresaPoblacion, e.provincia AS empresaProvincia,";
    sql += " c.nombre AS clienteNombre, c.nif AS clienteNif, ol.importeProveedor,";
    sql += " TRIM(CONCAT(COALESCE(tv2.nombre, ''), ' ' , c.direccion)) AS clienteDireccion, ";
    sql += " c.codPostal AS clienteCodPostal, c.poblacion AS clientePoblacion, c.provincia AS clienteProvincia,";
    sql += " o.total, o.totalConIva, o.observaciones, ";
    sql += " fp.nombre AS formaPago, ol.proveedorId, p.nombre as proveedornombre, p.nif AS proveedorNif, p.codPostal AS proveedorCodpostal, p.poblacion AS proveedorPoblación,";
    sql += " p.provincia AS proveedorProvincia";
    sql += " FROM ofertas AS o";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = o.empresaId";
    sql += " LEFT JOIN clientes AS c ON c.clienteId = o.clienteId";
    sql += " LEFT JOIN ofertas_lineas AS ol ON ol.ofertaId = o.ofertaId";
    sql += " LEFT JOIN proveedores AS p ON p.proveedorId = ol.proveedorId";
    sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = o.formaPagoId";
    sql += " LEFT JOIN tipos_via AS tv1 ON tv1.tipoViaId = e.tipoViaId";
    sql += " LEFT JOIN tipos_via AS tv2 ON tv2.tipoViaId = c.tipoViaId";
    sql += " LEFT JOIN tipos_via AS tv3 ON tv3.tipoViaId = p.tipoViaId";
    sql += " WHERE TRUE"
    if (ofertaId) {
        sql += " AND o.ofertaId IN (" + ofertaId + ") AND ol.proveedorId = " + proveedorId;
        sql += " GROUP BY ol.proveedorId"
    } 
    return sql;
}

module.exports.getOfertasExpediente = function ( expedienteId, esCoste, done) {
    cm.getConnectionCallback(function (err, con) {
        if (err) return done(err);
        var sql = "SELECT of.*,";
        sql += " em.nombre AS empresa, cl.nombre AS cliente,"
        sql += " tp.nombre AS tipo, cl2.nombre AS mantenedor, com.nombre AS agente, fp.nombre AS formaPago, co.nombre AS comercialCliente";
        sql += " FROM ofertas AS of";
        sql += " LEFT JOIN empresas AS em ON em.empresaId = of.empresaId";
        sql += " LEFT JOIN clientes AS cl ON cl.clienteId = of.clienteId";
        sql += " LEFT JOIN comerciales AS co ON co.comercialId = cl.colaboradorId";
        sql += " LEFT JOIN departamentos AS tp ON tp.departamentoId = of.tipoOfertaId";
        sql += " LEFT JOIN clientes AS cl2 ON cl2.clienteId = of.mantenedorId";
        sql += " LEFT JOIN comerciales AS com ON com.comercialId = of.agenteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = of.formaPagoId";
        sql += " WHERE of.tipoOfertaId = " + 5 + " AND of.esCoste = " + esCoste;
        if(expedienteId > 0) {
           sql += " AND of.expedienteId = " + expedienteId
        } 

        con.query(sql, function (err, contratos) {
            cm.closeConnection(con);
            if (err) return done(err);
            done(null, contratos);
        })
    });
}







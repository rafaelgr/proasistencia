// liquidacion_db_mysql
// Manejo de la tabla liquidacion_comercial en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS

//  leer la configurción de MySQL
var config = require("../../configMySQL.json");
var sql = "";

// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    });
    connection.connect(function (err) {
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

// comprobarLiquidacion
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarLiquidacion(liquidacion) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof liquidacion;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && liquidacion.hasOwnProperty("liquidacionId"));
    return comprobado;
}


// getLiquidaciones
// lee todos los registros de la tabla liquidacion_comercial y
// los devuelve como una lista de objetos
module.exports.getLiquidaciones = function (callback) {
    var connection = getConnection();
    var liquidacion_comercial = null;
    sql = "SELECT * FROM liquidacion_comercial";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        formasPago = result;
        callback(null, formasPago);
    });
}

// getLiquidacionesBuscar
// lee todos los registros de la tabla liquidacion_comercial cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getLiquidacionesBuscar = function (nombre, callback) {
    var connection = getConnection();
    var liquidacion_comercial = null;
    var sql = "SELECT * FROM liquidacion_comercial";
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err, null);
        }
        formasPagos = result;
        callback(null, formasPagos);
    });
}

// getLiquidacion
// busca  el liquidacion con id pasado
module.exports.getLiquidacion = function (id, callback) {
    var connection = getConnection();
    var liquidacion_comercial = null;
    sql = "SELECT * FROM liquidacion_comercial as lc";
    sql += "  WHERE lc.liquidacionId = ?";
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


// postLiquidacion
// crear en la base de datos el liquidacion pasado
module.exports.postLiquidacion = function (liquidacion, callback) {
    if (!comprobarLiquidacion(liquidacion)) {
        var err = new Error("El liquidacion pasado es incorrecta, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = getConnection();
    liquidacion.liquidacionId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO liquidacion_comercial SET ?";
    sql = mysql.format(sql, liquidacion);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        liquidacion.liquidacionId = result.insertId;
        callback(null, liquidacion);
    });
}


// putLiquidacion
// Modifica el liquidacion según los datos del objeto pasao
module.exports.putLiquidacion = function (id, liquidacion, callback) {
    if (id != liquidacion.liquidacionId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = getConnection();
    sql = "UPDATE liquidacion_comercial SET ? WHERE liquidacionId = ?";
    sql = mysql.format(sql, [liquidacion, liquidacion.liquidacionId]);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null, liquidacion);
    });
}

// deleteLiquidacion
// Elimina el liquidacion con el id pasado
module.exports.deleteLiquidacion = function (id, liquidacion, callback) {
    var connection = getConnection();
    sql = "DELETE from liquidacion_comercial WHERE liquidacionId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        closeConnectionCallback(connection, callback);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}

module.exports.getLiquidacionAcumulada = function (dFecha, hFecha, done) {
    var con = getConnection();
    var sql = "SELECT lf.comercialId, c.nombre, tc.nombre AS tipo, SUM(lf.impCliente) AS totFactura, SUM(lf.base) AS totBase, SUM(lf.comision) AS totComision";
    sql += " FROM liquidacion_comercial AS lf";
    sql += " LEFT JOIN facturas AS f ON f.facturaId = lf.facturaId";
    sql += " LEFT JOIN comerciales AS c ON c.comercialId = lf.comercialId";
    sql += " LEFT JOIN tipos_comerciales AS tc ON tc.tipoComercialId = c.tipoComercialId";
    sql += " WHERE f.fecha >= ? AND f.fecha <= ?";
    sql += " GROUP BY lf.comercialId";
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, res) {
        closeConnection(con);
        if (err) return done(err);
        done(null, res);
    });
}

module.exports.getLiquidacionDetalle = function (dFecha, hFecha, comercialId, done) {
    var con = getConnection();
    var sql = "SELECT c.nombre, tc.nombre AS tipo, lf.*,";
    sql += " CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(f.numero AS CHAR(50)),' ')) AS facNum, f.fecha AS fechaFactura,";
    sql += " ccm.referencia AS contrato";
    sql += " FROM liquidacion_comercial AS lf";
    sql += " LEFT JOIN facturas AS f ON f.facturaId = lf.facturaId";
    sql += " LEFT JOIN comerciales AS c ON c.comercialId = lf.comercialId";
    sql += " LEFT JOIN tipos_comerciales AS tc ON tc.tipoComercialId = c.tipoComercialId";
    sql += " LEFT JOIN contrato_cliente_mantenimiento AS ccm ON ccm.contratoClienteMantenimientoId = lf.contratoClienteMantenimientoId";
    sql += " WHERE lf.comercialId = ?";
    sql += " AND f.fecha >= ? AND f.fecha <= ?";
    sql = mysql.format(sql, [comercialId, dFecha, hFecha]);
    con.query(sql, function (err, res) {
        closeConnection(con);
        if (err) return done(err);
        done(null, res);
    });
}



// postFacturaLiquidacion
module.exports.postFacturaLiquidacion = function (dFecha, hFecha, tipoComercial, comercialId, done) {
    var con = getConnection();
    var sql = "";
    con.beginTransaction(function (err) {
        if (err) return done(err);
        // el primer paso es eliminar las posibles liquidaciones de las mismas facturas
        sql = "DELETE FROM liquidacion_comercial WHERE facturaId IN";
        sql += " (SELECT facturaId FROM facturas WHERE fecha >= ? AND fecha <= ?)"
        sql = mysql.format(sql, [dFecha, hFecha]);
        con.query(sql, function (err, res) {
            if (err) return con.rollback(function (err2) { done(err) });
            sql = "SELECT f.facturaId, f.fecha, f.serie, f.ano, f.numero, f.totalAlCliente, f.coste,";
            sql += " cm.contratoClienteMantenimientoId, cm.referencia, cm.tipoMantenimientoId,";
            sql += " cmc.comercialId AS comercialId, c.nombre AS nombreComercial, c.nif AS nifComercial, c.tipoComercialId AS tipoComercial, cmc.porComer,";
            sql += " cm.comercialId AS agenteId, c2.nombre AS nombreAgente, c2.nif AS nifAgente, c2.tipoComercialId AS tipoAgente, cm.manPorComer AS porAgente,";
            sql += " manComisAgente, manPorImpCliente, manPorImpClienteAgente, manPorCostes, manCostes, manJefeObra, manOficinaTecnica, manAsesorTecnico, manComercial,";
            sql += " segComisAgente, segPorImpCliente, segPorImpClienteAgente, segPorCostes, segCostes, segJefeObra, segOficinaTecnica, segAsesorTecnico, segComercial";
            sql += " FROM facturas AS f";
            sql += " LEFT JOIN contrato_cliente_mantenimiento AS cm ON cm.contratoClienteMantenimientoId = f.contratoClienteMantenimientoId";
            sql += " LEFT JOIN contrato_cliente_mantenimiento_comisionistas AS cmc ON cmc.contratoClienteMantenimientoId = cm.contratoClienteMantenimientoId";
            sql += " LEFT JOIN contrato_comercial AS cc ON cc.comercialId = cmc.comercialId AND cc.empresaId = f.empresaId";
            sql += " LEFT JOIN comerciales AS c ON c.comercialId = cmc.comercialId";
            sql += " LEFT JOIN comerciales AS c2 ON c2.comercialId = cm.comercialId";
            sql += " WHERE f.fecha <= ? AND f.fecha >= ? AND f.sel = 1";
            sql += " ORDER BY f.facturaId";
            sql = mysql.format(sql, [hFecha, dFecha]);
            // hay que revisar los criterios de búsqueda
            /*
            if (tipoComercial) {
                if (tipoComercial == 1) {
                    sql += " AND c2.tipoComercial = " + tipoComercial;
                } else {
                    sql += " AND c.tipoComercial = " + tipoComercial;
                }
            }
            if (comercialId) {
                sql += " AND c.comercialId = " + comercialId;
            }
            */
            con.query(sql, function (err, res) {
                if (err) return con.rollback(function (err2) { done(err) });
                if (res.length == 0) {
                    // la consulta no ha devuelto registros
                    return con.rollback(function (err2) { done(new Error('No hay facturas con estos criterios')) });
                }
                // hay que montar ir procesando factura a factura
                // como varios registros pueden formar parte de una misma factura hay que mandarlas agrupadas a su procesamiento
                var antFactura = res[0].facturaId;
                var fs = [];
                var regs = [];
                res.forEach(function (f) {
                    if (f.facturaId != antFactura) {
                        var ls = fnProcesarFacturasLiquidacion(fs);
                        ls.forEach(function (l) { regs.push(l.registro) });
                        fs = [];
                    }
                    fs.push(f);
                    antFactura = f.facturaId
                })
                if (fs.length > 0) {
                    var ls = fnProcesarFacturasLiquidacion(fs);
                    ls.forEach(function (l) { regs.push(l.registro) });
                }
                async.eachSeries(regs, function (r, callback) {
                    sql = "INSERT INTO liquidacion_comercial SET ?";
                    sql = mysql.format(sql, r);
                    con.query(sql, function (err, res) {
                        if (err) return callback(err);
                        callback(null);
                    });
                }, function (err) {
                    if (err) return con.rollback(function (err2) { done(err) });
                    con.commit(function (err) {
                        if (err) return con.rollback(function (err2) { done(err) });
                        done(null, null); // todo correcto
                    });
                });
            })
        })


    });
}

module.exports.checkFacturasLiquidadas = function (dFecha, hFecha, done) {
    var con = getConnection();
    var sql = "SELECT * ";
    sql += " FROM liquidacion_comercial AS lq";
    sql += " WHERE lq.facturaId IN";
    sql += " (SELECT facturaId FROM facturas WHERE fecha >= ? AND fecha <= ?)"
    sql = mysql.format(sql, [dFecha, hFecha]);
    con.query(sql, function (err, res) {
        closeConnection(con);
        if (err) return done(err);
        done(null, res);
    })
}

var fnProcesarFacturasLiquidacion = function (fs) {
    var ls = [];
    // calculamos la correspondiente al agente
    var f = fs[0];
    var l1 = fnUnaLineaVacia(f);
    l1.registro.facturaId = f.facturaId;
    l1.registro.comercialId = f.agenteId;
    l1.registro.contratoClienteMantenimientoId = f.contratoClienteMantenimientoId;
    l1.registro.impCliente = f.totalAlCliente;
    l1.registro.coste = f.coste;
    l1.registro.base = f.totalAlCliente;
    l1.registro.porComer = f.porAgente;
    l1.registro.comision = (f.totalAlCliente * f.porAgente) / 100.0;
    l1.tipoComercial = 1; // es un agente
    ls.push(l1);
    var comisAgente = l1.registro.comision;
    // vamos a crear una lista de objetos con dos propiedades que a su vez son objetos
    // origen: lo que se ha leido de la base de datos
    // registro: lo que se guardará como registro de liquidación
    fs.forEach(function (f) {
        var l = fnUnaLineaVacia(f);
        l.registro.facturaId = f.facturaId;
        l.registro.comercialId = f.comercialId;
        l.registro.contratoClienteMantenimientoId = f.contratoClienteMantenimientoId;
        l.registro.impCliente = f.totalAlCliente;
        l.registro.coste = f.coste;
        l.registro.porComer = f.porComer;
        // el caso es diferente si se trata de seguro o mantenimiento
        if (f.tipoMantenimientoId == 1) {
            // mantenimiento
            if (f.manComisAgente && f.manComisAgente != 0) {
                l.registro.CA = comisAgente;
            }
            if (f.manPorImpCliente && f.manPorImpCliente != 0) {
                l.registro.PC = (f.totalAlCliente * f.manPorImpCliente) / 100.0;
            }
            if (f.manPorImpClienteAgente && f.manPorImpClienteAgente != 0) {
                l.registro.PCA = ((f.totalAlCliente - comisAgente) * f.manPorImpClienteAgente) / 100.0;
            }
            if (f.manPorCostes && f.manPorCostes != 0) {
                l.registro.PCO = (f.coste * f.manPorCostes) / 100.0;
            }
            if (f.manCostes && f.manCostes != 0) {
                l.registro.ICO = f.coste;
            }
            // verificamos que no dependa de nadie para calcular, si podemos, 
            // la comision directamente.
            if ((!f.manJefeObra || f.manJefeObra == 0) &&
                (!f.manOficinaTecnica || f.manOficinaTecnica == 0) &&
                (!f.manAsesorTecnico || f.manAsesorTecnico == 0) &&
                (!f.manComercial || f.manComercial == 0)) {
                fnCalculoComisionDeUnRegistro(l.registro);
            }
        }
        if (f.tipoMantenimientoId == 2) {
            // seguro
            if (f.segComisAgente && f.segComisAgente != 0) {
                l.registro.CA = comisAgente;
            }
            if (f.segPorImpCliente && f.segPorImpCliente != 0) {
                l.registro.PC = (f.totalAlCliente * f.segPorImpCliente) / 100.0;
            }
            if (f.segPorImpClienteAgente && f.segPorImpClienteAgente != 0) {
                l.registro.PCA = ((f.totalAlCliente - comisAgente) * f.segPorImpClienteAgente) / 100.0;
            }
            if (f.segPorImpCostes && f.segPorImpCostes != 0) {
                l.registro.PCO = (f.coste * f.segPorCostes) / 100.0;
            }
            if (f.segCostes && f.segCostes != 0) {
                l.registro.ICO = f.coste;
            }
            // verificamos que no dependa de nadie para calcular, si podemos, 
            // la comision directamente.
            if ((!f.segJefeObra || f.segJefeObra == 0) &&
                (!f.segOficinaTecnica || f.segOficinaTecnica == 0) &&
                (!f.segAsesorTecnico || f.segAsesorTecnico == 0) &&
                (!f.segComercial || f.segComercial == 0)) {
                fnCalculoComisionDeUnRegistro(l.registro);
            }
        }
        // en un primer paso calculamos al agente que figura en todos los registros
        ls.push(l);
    });
    // hay que reordernar los registros para se calculen las dependencias en el orden correcto
    var l2 = [];
    ls.forEach(function (l) {
        switch (l.tipoComercial) {
            case 1:
                l.orden = 1;
                break;
            case 2:
                l.orden = 2;
                break;
            case 3:
                l.orden = 7;
                break;
            case 4:
                l.orden = 3;
                break;
            case 5:
                l.orden = 4;
                break;
            case 6:
                l.orden = 6;
                break;
            case 7:
                l.orden = 5;
                break;
        }
        l2.push(l);
    })
    l2.sort(function(a,b) {return (a.orden > b.orden) ? 1 : ((b.orden > a.orden) ? -1 : 0);} ); 
    // Ahora hay que revisar las comisiones pendientes de calcular porque tenían dependencias.
    l2.forEach(function (l) {
        if (l.registro.comision == 0) {
            // si no le hemos calculado la comisión es que tenía una dependencia que no concíamos
            // en un primer momento.
            // nuevamente es distinto según el tipo de contrato de mantenimiento o seguro
            if (l.origen.tipoMantenimientoId == 1) {
                // mantenimento
                if (l.origen.manJefeObra && l.origen.manJefeObra != 0) {
                    l.registro.IJO = fnCalculoDeComisionDeUnTipo(l2, 5);
                }
                if (l.origen.manOficinaTecnica && l.origen.manOficinaTecnica != 0) {
                    l.registro.IOT = fnCalculoDeComisionDeUnTipo(l2, 6);
                }
                if (l.origen.manAsesorTecnico && l.origen.manAsesorTecnico != 0) {
                    l.registro.IAT = fnCalculoDeComisionDeUnTipo(l2, 7);
                }
                if (l.origen.manComercial && l.origen.manComercial != 0) {
                    l.registro.IC = fnCalculoDeComisionDeUnTipo(l2, 2);
                }
            }
            if (l.origen.tipoMantenimientoId == 2) {
                // seguros
                if (l.origen.segJefeObra && l.origen.segJefeObra != 0) {
                    l.registro.IJO = fnCalculoDeComisionDeUnTipo(l2, 5);
                }
                if (l.origen.segOficinaTecnica && l.origen.segOficinaTecnica != 0) {
                    l.registro.IOT = fnCalculoDeComisionDeUnTipo(l2, 6);
                }
                if (l.origen.segAsesorTecnico && l.origen.segAsesorTecnico != 0) {
                    l.registro.IAT = fnCalculoDeComisionDeUnTipo(l2, 7);
                }
                if (l.origen.segComercial && l.origen.segComercial != 0) {
                    l.registro.IC = fnCalculoDeComisionDeUnTipo(l2, 2);
                }
            }
            fnCalculoComisionDeUnRegistro(l.registro);
        }
    })
    return l2;
}

var fnUnaLineaVacia = function (l) {
    var l1 = {
        origen: l,
        registro: {
            liquidacionComercialId: 0,
            facturaId: 0,
            comercialId: 0,
            contratoClienteMantenimientoId: 0,
            impCliente: 0,
            coste: 0,
            CA: 0,
            PC: 0,
            PCA: 0,
            PCO: 0,
            ICO: 0,
            IJO: 0,
            IOT: 0,
            IAT: 0,
            IC: 0,
            base: 0,
            porComer: 0,
            comision: 0
        },
        tipoComercial: l.tipoComercial
    };
    return l1;
}

var fnCalculoComisionDeUnRegistro = function (r) {
    var base = r.impCliente - r.CA - r.PC - r.PCA - r.PCO - r.ICO - r.IJO - r.IOT - r.IAT - r.IC;
    r.base = base;
    r.comision = (base * r.porComer) / 100.0;
}

var fnCalculoDeComisionDeUnTipo = function (ls, tipoComercial) {
    var comisionTipo = 0;
    ls.forEach(function (l) {
        // comprobamos si corresponde al tipo buscado
        if (l.tipoComercial == tipoComercial) {
            comisionTipo += l.registro.comision;
        }
    });
    return comisionTipo;
}
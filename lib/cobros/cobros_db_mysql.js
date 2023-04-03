var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var mysql2 = require("mysql2/promise");
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var moment = require("moment");
const e = require("cors");

//  leer la configurción de MySQL

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

module.exports.getCobrosFactura = function (id, done) {
    fnCobrosDeUnaFactura(id, null, null, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}

module.exports.getCobrosCliente = function (id, done) {
    fnCobrosDeUnCliente(id, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}

module.exports.getCobrosContrato = function (id, done) {
    fnCobrosDeUnContrato(id, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
}

module.exports.getCobrosContratoPlanificacion = async (contratoId) => {
    let connection = null;
    //var cobros = [];
    var numCobros = [];
    var antcobro = 0;
    var datos = {};
    var [result3] = [];
    return new Promise(async (resolve, reject) => {
        try {
            connection = await mysql2.createConnection(obtenerConfiguracion());
            //establecemos primero los importes cobrados a cero de la tabla contrato_planificacion
            var sql = "UPDATE contrato_planificacion SET importeCobrado = 0 WHERE contratoId = ?"
            sql = mysql.format(sql, contratoId);
            await connection.query(sql);
            //recupatamos las facturas del contrato
            sql = "SELECT * FROM facturas WHERE contratoId = ?";
            sql = mysql.format(sql, contratoId);
            const [result] = await connection.query(sql);
            if(result.length > 0) {
                for(let f of result){ 
                    //recuperamos la serie, numero, fecha, contabilidad, y id  de una factura
                    sql = "SELECT f.facturaId, pf.contPlanificacionId, f.ano, f.numero, CONCAT(f.ano, LPAD(f.numero,6, '0')) AS numfac, f.serie, f.fecha, f.empresaId, e.nombre, e.contabilidad, f.total, f.totalConIva";
                    sql += " FROM facturas AS f";
                    sql += " INNER JOIN prefacturas AS pf ON pf.facturaId = f.facturaId"
                    sql += " INNER JOIN empresas AS e ON e.empresaId = f.empresaId"
                    sql += " WHERE f.facturaId = ?";
                    sql = mysql.format(sql, f.facturaId);
                    var [result2] = await connection.query(sql);
                    var f1 = result2[0];
                    var numserie = f1.serie;
                    var numfactu = f1.numfac.toString();
                    var fecfactu = f1.fecha;
                    var conta = f1.contabilidad;
                    var facturaId = f1.facturaId;
                    var contPlanificacionId = f1.contPlanificacionId
                    //recuparamos los cobros de una factura
                    sql = "SELECT SUM(COALESCE(c.impcobro, 0)) AS impcobro, " + facturaId +" AS facturaId, count(*) as num";
                    sql += " FROM " + conta + ".cobros AS c";
                    sql += " WHERE ";
                    sql += "(numserie =  ?";
                    sql += " AND numfactu = ?)";
                    sql += " AND fecfactu = ?";
                    sql = mysql.format(sql, [numserie, numfactu, fecfactu]);
                    sql += " OR";
                    sql += " (numserie = 'ANT'";
                    sql += " AND (numfactu, fecfactu) IN (SELECT CONCAT(ano,LPAD(numero, 6, 0)) AS numfactu, a.fecha AS fecfactu";
                    sql += " FROM factura_antcliens AS fa";
                    sql += " LEFT JOIN antClien AS a ON a.antclienId = fa.antclienId";
                    sql += " WHERE fa.facturaId =  ?))";
                    sql += " GROUP BY facturaId"
                    sql = mysql.format(sql, facturaId);
                    var [result3] = await connection.query(sql);
                    if(result3.length > 0) {
                        var  importeCobrado =  result3[0].impcobro
                        //con la cantidad de cobros y su total actulizamos la tabla contrato_planificacion
                        sql = "UPDATE contrato_planificacion SET importeCobrado = importeCobrado + ? WHERE contPlanificacionId = ? ";
                        sql = mysql.format(sql, [importeCobrado, contPlanificacionId]);
                        var [result4] = await connection.query(sql);
                     
                        if(!antcobro) {
                            datos = {
                                contPlanificacionId: contPlanificacionId,
                                numCobros: parseInt(result3[0].num)
                            }
                        } 
                        if(antcobro) {
                            if(antcobro == contPlanificacionId) {
                                datos.numCobros =  datos.numCobros + parseInt(result3[0].num)
                            } else if(antcobro != contPlanificacionId) {
                                numCobros.push(datos);
                                datos = {
                                    contPlanificacionId: contPlanificacionId,
                                    numCobros: parseInt(result3[0].num)
                                }
                            }
                        }
                        antcobro = contPlanificacionId;
                    }
                };
                if(result3.length > 0) {
                    numCobros.push(datos);
                }
            }
            
            await connection.end();
            resolve(numCobros);
        } catch(e) {
            if(connection) {
                if (!connection.connection._closing) {
                    await connection.rollback();
                    await connection.end();
                } 
            }
            reject (e);
        }
        
    });
}

module.exports.vinculaAntProves = async (antProve) => {
    let connection = null;
        var num = 0;
        var contador = 0;
        return new Promise(async (resolve, reject) => {
            try {
                connection = await mysql2.createConnection(obtenerConfiguracion());
                await connection.beginTransaction();
                for(let e of antProve){ 
                    var sql;
                    e.facproveAntproveId = 0 //forzamos el autoincremento
                    sql = "INSERT INTO  facprove_antproves SET ?";
                    sql = mysql.format(sql, e);
                    let [result] = await connection.query(sql);
                    //comprobamos que el anticipo no se encuentre vinculado en un documento de pago
                     vinculaDocpago2(e, connection) 
                    .then((result) => {
                      
                            num = num + result;
                            contador ++
                            if(contador == antProve.length) {
                                connection.commit();
                                connection.end();
                                resolve(num);
                            }
                        
                        
                    })
                    .catch( (err) => {
                        if(connection) {
                            if (!connection.connection._closing) {

                                connection.rollback();
                                connection.end();
                                reject(err);
                            }    
                           
                        } else {
                            reject (err);
                        }
                       
                    });  
                }
            } catch(e) {
                if(connection) {
                    if (!connection.connection._closing) {
                        await connection.rollback();
                        await connection.end();
                    } 
                }
                reject (e);
            }
        });
}


module.exports.isFacturaCobrada = function (id, dFecha, hFecha, done) {
    fnFacturaCobradaSegura(id, dFecha, hFecha, function (err, cobrada) {
        if (err) return done(err);
        done(null, cobrada);
    });
}


// zona de funciones auxiliares

var fnCobrosDeUnCliente = function (id, done) {
    var cobros = [];
    var con = getConnection();
    sql = "SELECT * FROM facturas WHERE clienteId = ?";
    sql = mysql.format(sql, id);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        async.eachSeries(rows, function (f, callback) {
            fnCobrosDeUnaFactura(f.facturaId, null, null, function (err, cobs) {
                if (err) return callback(err);
                cobs.forEach(function (c) {
                    cobros.push(c);
                });
                callback();
            });
        }, function (err) {
            if (err) return done(err);
            var cobrosOrdenados = fnOrdenarCobrosPorFechaVencimiento(cobros);
            done(null, cobrosOrdenados);
        });
    })
};


var fnCobrosDeUnContrato = function (id, done) {
    var cobros = [];
    var con = getConnection();
    sql = "SELECT * FROM facturas WHERE contratoId = ?";
    sql = mysql.format(sql, id);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        async.eachSeries(rows, function (f, callback) {
            fnCobrosDeUnaFacturaContrato(f.facturaId, null, null, function (err, cobs) {
                if (err) return callback(err);
                cobs.forEach(function (c) {
                    cobros.push(c);
                });
                callback();
            });
        }, function (err) {
            if (err) return done(err);
            var cobrosOrdenados = fnOrdenarCobrosPorFechaVencimiento(cobros);
            done(null, cobrosOrdenados);
        });
    })
};

var fnCobrosDeUnaFactura = function (id, dFecha, hFecha, done) {
    var cobros = null;
    fnFacturaConta(id, function (err, rows) {
        if (err) return done(err);
        if (rows.length == 0) return done(null, cobros);
        var f = rows[0];
        var numserie = f.serie;
        var numfactu = f.numfac;
        var fecfactu = f.fecha;
        var conta = f.contabilidad;
        var facturaId = f.facturaId;
        fnCobroEnConta(conta, numserie, numfactu, fecfactu, facturaId,function (err, rows) {
            if (err) return done(err);
            cobros = fnCobroSeguro(rows, dFecha, hFecha);
            done(null, cobros, f);
        });
    });
};


var fnCobrosDeUnaFacturaContrato = function (id, dFecha, hFecha, done) {
    var cobros = null;
    fnFacturaContaContrato(id, function (err, rows) {
        if (err) return done(err);
        if (rows.length == 0) return done(null, cobros);
        var f = rows[0];
        var numserie = f.serie;
        var numfactu = f.numfac;
        var fecfactu = f.fecha;
        var conta = f.contabilidad;
        var facturaId = f.facturaId;
        fnCobroEnContaContrato(conta, numserie, numfactu, fecfactu, facturaId,function (err, rows) {
            if (err) return done(err);
            cobros = fnCobroSeguro(rows, dFecha, hFecha);
            done(null, cobros, f);
        });
    });
};


// fnFacturaConta
// devuelve la información sobre la factura y la contabilidad
// en la que debe estar su cobro según la empresa emisora
var fnFacturaConta = function (facturaId, done) {
    var con = getConnection();
    sql = "SELECT f.facturaId, ano, numero, CONCAT(ano, LPAD(f.numero,6, '0')) AS numfac, serie, fecha, f.empresaId, e.nombre, e.contabilidad, f.total, f.totalConIva";
    sql += " FROM facturas AS f";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = f.empresaId"
    sql += " WHERE f.facturaId = ?";
    sql = mysql.format(sql, facturaId);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        done(null, rows);
    })
}


// fnFacturaConta
// devuelve la información sobre la factura y la contabilidad
// en la que debe estar su cobro según la empresa emisora
var fnFacturaContaContrato = function (facturaId, done) {
    var con = getConnection();
    sql = "SELECT f.facturaId, ano, numero, CONCAT(ano, LPAD(f.numero,6, '0')) AS numfac, serie, fecha, f.empresaId, e.nombre, e.contabilidad, f.total, f.totalConIva";
    sql += " FROM facturas AS f";
    sql += " LEFT JOIN empresas AS e ON e.empresaId = f.empresaId"
    sql += " WHERE f.facturaId = ?";
    sql = mysql.format(sql, facturaId);
    con.query(sql, function (err, rows) {
        con.end();
        if (err) return done(err);
        done(null, rows);
    })
}


// fnCobroEnConta
// Obtiene los cobros de la factura pasada en la contabilidad indicada
var fnCobroEnConta = function (conta, numserie, numfactu, fecfactu, facturaId, done) {
    numfactu = numfactu.toString();
        var con = getConnection();
        sql = "SELECT c.*, fp.nomforpa ";
        sql += " FROM " + conta + ".cobros AS c";
        sql += " LEFT JOIN " + conta + ".formapago AS fp ON fp.codforpa = c.codforpa";
        sql += " WHERE ";
        sql += "(numserie =  ?";
        sql += " AND numfactu = ?)";
        sql += " AND fecfactu = ?";
        sql = mysql.format(sql, [numserie, numfactu, fecfactu]);
        sql += " OR";
        sql += " (numserie = 'ANT'";
        sql += " AND (numfactu, fecfactu) IN (SELECT CONCAT(ano,LPAD(numero, 6, 0)) AS numfactu, a.fecha AS fecfactu";
        sql += " FROM factura_antcliens AS fa";
        sql += " LEFT JOIN antClien AS a ON a.antclienId = fa.antclienId";
        sql += " WHERE fa.facturaId =  ?))";
        sql = mysql.format(sql, facturaId);
        
        sql += " ORDER BY c.fecvenci DESC";
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            done(null, rows);
        });
}

// fnCobroEnContaContrato
// Obtiene los cobros de la factura pasada en la contabilidad indicada
var fnCobroEnContaContrato = function (conta, numserie, numfactu, fecfactu, facturaId, done) {
    numfactu = numfactu.toString();
        var con = getConnection();
        sql = "SELECT c.numorden,";
        sql += " c.numserie,";
        sql += " c.numfactu,";
        sql += " c.fecfactu,";
        sql += " c.fecvenci,";
        sql += " c.fecultco,";
        sql += " c.impvenci,";
        sql += " c.impcobro,";
        sql += " h.fechaent,";
        sql += " COALESCE(h.numasien,  0) AS numasien,";
        sql += " COALESCE(h.linliapu, 0) AS linliapu,";
        sql += " COALESCE(h.numdocum, ' ') AS numdocum,";
        sql += " COALESCE(h.ampconce, ' ') AS ampconce,";
        sql += " COALESCE(h.timporteD, 0) AS timporteD,";
        sql += " COALESCE(h.timporteH, 0) AS timporteH,";
        sql += " IF(COALESCE(h.esdevolucion, 0) = 0,'NO', 'SI') AS esdevolucion,";
        sql += " fp.nomforpa";
        sql += " FROM " + conta + ".cobros AS c";
        sql += " LEFT JOIN " + conta + ".formapago AS fp ON fp.codforpa = c.codforpa";
        sql += " LEFT JOIN " + conta + ".hlinapu AS h ";
        sql += " ON h.numserie = c.numserie AND h.numfaccl = c.numfactu AND h.fecfactu = c.fecfactu AND h.numorden = c.numorden ";
        sql += " AND (idcontab = 'COBRO' OR idcontab = 'COBROS')";
        sql += " WHERE ";
        sql += "(c.numserie =  ?";
        sql += " AND c.numfactu = ?)";
        sql += " AND c.fecfactu = ?";
        sql = mysql.format(sql, [numserie, numfactu, fecfactu]);
        sql += " OR";
        sql += " (c.numserie = 'ANT'";
        sql += " AND (c.numfactu, c.fecfactu) IN (SELECT CONCAT(ano,LPAD(numero, 6, 0)) AS numfactu, a.fecha AS fecfactu";
        sql += " FROM factura_antcliens AS fa";
        sql += " LEFT JOIN antClien AS a ON a.antclienId = fa.antclienId";
        sql += " WHERE fa.facturaId =  ?))";
        sql = mysql.format(sql, facturaId);
        
        sql += " ORDER BY c.fecvenci DESC";
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            rows = procesaCobro(rows)
            done(null, rows);
        });
}

var procesaCobro = function (rows) {
    var antReg = null;
    var objCo = {};
    var objHl = {};
    var regs = [];

    rows.forEach(e => {
        if(antReg == null) {//el primer registro se procesa siempre
            objCo = {
                numorden: e.numorden,
                numserie: e.numserie,
                numfactu: e.numfactu,
                fecfactu: e.fecfactu,
                fecvenci: e.fecvenci,
                fecultco: e.fecultco,
                impvenci: e.impvenci,
                impcobro: e.impcobro,
                nomforpa: e.nomforpa,
                lin: [],
            };
            //lineas hlinapu
            objHl = {
                fechaent: e.fechaent,
                numasien: e.numasien,
                linliapu: e.linliapu,
                numdocum: e.numdocum,
                ampconce: e.ampconce,
                timporteD: e.timporteD,
                timporteH: e.timporteH,
                esdevolucion: e.esdevolucion
            }
         
            objCo.lin.push(objHl);
            //regs.push(objCo);
            objHl = {}; //una vez incluida la linea de hlinapu limpiamos los datos
            antReg = 0;
    
           
    
        } else  {
          
            // si se trata del mismo cobro
            //linea hlinapu
            objHl = {
                fechaent: e.fechaent,
                numasien: e.numasien,
                linliapu: e.linliapu,
                numdocum: e.numdocum,
                ampconce: e.numdocum,
                timporteD: e.timporteD,
                timporteH: e.timporteH,
                esdevolucion: e.esdevolucion
            }
           
            objCo.lin.push(objHl);
            objHl = {}; //una vez incluida la linea de hlinapu limpiamos los datos
        } 
        if(regs.length == 0) {
            //objCo.lin.push(objHl);
            regs.push(objCo);
		}
    });
    
    return regs;
}

        
var fnCobroSeguro = function (cobros, dFecha, hFecha,) {
    var c2 = [];
    cobros.forEach(function (c) {
        c.seguro = false;
        if (c.fecultco) {
            var df = moment().diff(c.fecultco, 'days');
            if (df > 65) {
                c.seguro = true;
            }
        }
        c2.push(c);
    }); 
    return c2;
    /* var c2 = [];
    var fec = new Date(hFecha);
    fec.setDate(fec.getDate() + 90)
    cobros.forEach(function (c) {
        c.seguro = false;
        if (c.fecultco) {
            var df = moment(fec).diff(c.fecultco, 'days');
            if (df > 65) {
                c.seguro = true;
            }
        }
        c2.push(c);
    });
    return c2; */
};


// fnOrdenarCobrosPorFechaVencimiento
var fnOrdenarCobrosPorFechaVencimiento = function (cobros) {
    if (!cobros || cobros.length == 0) return cobros;
    cobros.sort(function (a, b) { return (a.fecvenci < b.fecvenci) ? 1 : ((b.fecvenci < a.fecvenci) ? -1 : 0); });
    return cobros;
};

var fnFacturaCobradaSegura = function (facturaId, dFecha, hFecha, done) {
    fnCobrosDeUnaFactura(facturaId,  dFecha, hFecha, function (err, cobros, factura) {
        if (err) return done(err);
        var facturado = factura.totalConIva;
        var cobrado = 0;
        var seguro = true;
        if(cobros.length == 0) { 
            seguro = false;
        } else {
            for(var i= 0; i < cobros.length; i++) {
                var gastos = 0
                if(cobros[i].seguro == false) {
                    seguro = false;
                    break;
                }
                /* if(!cobros[i].impcobro) cobros[i].impcobro = 0;
                if(cobros[i].gastos) gastos = cobros[i].gastos;
                cobrado += cobros[i].impcobro - gastos; */
            }
        }
       /*  cobrado = cobrado.toFixed(2);
        cobrado = parseFloat(cobrado);

        var cobradoRedMas = cobrado+0.01;
        cobradoRedMas = cobradoRedMas.toFixed(2);
        cobradoRedMas = parseFloat(cobradoRedMas);

        var cobradoRedMenos = cobrado-0.01;
        cobradoRedMenos = cobradoRedMenos.toFixed(2);
        cobradoRedMenos = parseFloat(cobradoRedMenos); */
        if(!seguro) {
            done(null, false);
        } else {
            done(null, true);
        }


      /*   else if (facturado == cobrado || facturado == cobradoRedMas ||  facturado == cobradoRedMenos) {
            done(null, true);
        } else {
            done(null, false);
        } */
    });
}
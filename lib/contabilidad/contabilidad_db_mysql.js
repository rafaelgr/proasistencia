/*
 * contabilidad_db_mysql.js
 * Funciones de utilidad para enlace contable con aricontas
 * en MYSQL
*/

var comun = require('../comun/comun.js'),
    mysql = require('mysql'),
    async = require('async'),
    moment = require('moment');


var contabilidadApi = {
    // getContas
    // devuelve un vector con los nombres de base de datos de todas
    // las contabilidades asociadas a empresas.
    getContas: function (done) {
        var connection = comun.getConnection();
        var sql = "SELECT DISTINCT contabilidad FROM empresas WHERE NOT contabilidad IS NULL";
        connection.query(sql, function (err, result) {
            comun.closeConnection(connection);
            if (err) return done(err);
            // si no hay ninguna contabilidad lanzamos un error
            if (result.length == 0) return done(new Error('No hay ninguna empresa ligada a la contabilidad'));
            done(null, result);
        });
    },
    getContaEmpresa: function (empresaId, done) {
        var con = comun.getConnection();
        var sql = "SELECT * FROM empresas WHERE empresaId = ?";
        sql = mysql.format(sql, empresaId);
        con.query(sql, function (err, regs) {
            con.end();
            if (err) return done(err);
            if (regs.length == 0) return done(new Error('Empresa no encontrada'));
            done(null, regs[0].contabilidad);
        });
    },
    getNumDigitos: function (done) {
        async.waterfall([
            // obtiene una contabilidad 
            function (callback) {
                module.exports.getContas(function (err, result) {
                    if (err) return callback(err);
                    // le pasamos la contabilidad a la siguiente
                    callback(null, result[0].contabilidad);
                });
            },
            // de esa contabilidad se obtiene el máximo número de dígitos
            // se suponen que todas son iguales
            function (conta, callback) {
                var connection = comun.getConnectionDb(conta);
                sql = "SELECT * FROM empresa";
                connection.query(sql, function (err, result) {
                    comun.closeConnection(connection);
                    if (err) return callback(err);
                    // suponemos hay dada de alta una empresa
                    var empresa = result[0];
                    var numDigitos = empresa['numdigi' + empresa.numnivel];
                    callback(null, numDigitos);
                });
            }
        ],
            // después de ejecutar la cascada esta es la funcion resumen
            function (err, result) {
                if (err) return done(err);
                done(null, result);
            })
    },
    getNumDigitosNivelSup: function (done) {
        async.waterfall([
            // obtiene una contabilidad 
            function (callback) {
                module.exports.getContas(function (err, result) {
                    if (err) return callback(err);
                    // le pasamos la contabilidad a la siguiente
                    callback(null, result[0].contabilidad);
                });
            },
            // de esa contabilidad se obtiene el máximo número de dígitos
            // se suponen que todas son iguales
            function (conta, callback) {
                var connection = comun.getConnectionDb(conta);
                sql = "SELECT * FROM empresa";
                connection.query(sql, function (err, result) {
                    comun.closeConnection(connection);
                    if (err) return callback(err);
                    // suponemos hay dada de alta una empresa
                    var empresa = result[0];
                    var numDigitosSup = empresa['numdigi' + empresa.numnivel - 1];
                    callback(null, numDigitosSup);
                });
            }
        ],
            // después de ejecutar la cascada esta es la funcion resumen
            function (err, result) {
                if (err) return done(err);
                done(null, result);
            })
    },
    getInfContable: function (done) {
        async.series([
            function (callback) {
                module.exports.getContas(function (err, result) {
                    if (err) return callback(err);
                    callback(null, result);
                });
            },
            function (callback) {
                module.exports.getNumDigitos(function (err, result) {
                    if (err) return callback(err);
                    callback(null, result);
                });
            },
            function (callback) {
                module.exports.getNumDigitosNivelSup(function (err, result) {
                    if (err) return callback(err);
                    callback(null, result);
                });
            }
        ],
            function (err, result) {
                if (err) return done(err);
                done(null, {
                    contas: result[0],
                    numDigitos: result[1],
                    numDigitosSup: result[2]
                })
            })
    },
    getCuentasDeVentas: function (done) {
        async.waterfall([
            function (callback) {
                contabilidadApi.getInfContable(function (err, infContable) {
                    if (err) return callback(err);
                    callback(null, infContable);
                })
            },
            function (infContable, callback) {
                var connection = comun.getConnectionDb(infContable.contas);
                sql = "SELECT * FROM cuentas WHERE LENGTH(codmacta) = ? AND codmacta LIKE '7%'";
                sql = mysql(sql, infContable.numDigitosSup);
                connection.query(sql, function (err, registros) {
                    comun.closeConnection(connection);
                    if (err) return callback(err);
                    // suponemos hay dada de alta una empresa
                    callback(null, registros);
                });
            }
        ], function (err, result) {
            if (err) return done(err);
            done(null, result);
        });
    },
    getCuentasDeCompras: function (done) {
        async.waterfall([
            function (callback) {
                contabilidadApi.getInfContable(function (err, infContable) {
                    if (err) return callback(err);
                    callback(null, infContable);
                })
            },
            function (infContable, callback) {
                var connection = comun.getConnectionDb(infContable.contas);
                sql = "SELECT * FROM cuentas WHERE LENGTH(codmacta) = ? AND codmacta LIKE '6%'";
                sql = mysql(sql, infContable.numDigitosSup);
                connection.query(sql, function (err, registros) {
                    comun.closeConnection(connection);
                    if (err) return callback(err);
                    // suponemos hay dada de alta una empresa
                    callback(null, registros);
                });
            }
        ], function (err, result) {
            if (err) return done(err);
            done(null, result);
        });
    },
    contabilizarFacturasProveedor(facturas, done) {
        async.series(facuras, function(f, callback){
            contabilizarUnaFacturaProveedor(f, function(err){
                if (err) return callback(err);
                callback();
            })
        }, function(err){
            if (err) done(err);
            done();
        });
    },
    contabilizarUnaFacturaProveedor(factura, done) {
        // obtener la contabilidad a la que pertenece la factura
        contabilidadApi.getContaEmpresa(factura.empresaId, function (err, conta) {
            if (err) return done(err);
            var con = comun.getConnectionDb(conta);
            con.beginTransaction(function (err) {
                if (err) return done(err);
                async.waterfall([
                    // Obtener el número de registro necesario para las altas
                    function (callback) {
                        contabilidadApi.getNumRegis(1, 1, factura.fecha_recepcion, con, function (err, numregis) {
                            if (err) return callback(err);
                            callback(null, numregis);
                        });
                    },
                    // Obtener la cabecera de factura
                    function (numregis, callback) {
                        contabilidadApi.getFactPro(factura, numregis, function (err, facconta) {
                            if (err) return callback(err);
                            callback(null, facconta);
                        });
                    },
                    // Dar de alta la cabecera de factura
                    function (facconta, callback) {
                        contabilidadApi.postFactPro(facconta, numregis, function (err) {
                            if (err) return callback(err);
                            callback(null, numregis);
                        });
                    },
                    // Obtener las lineas de factura
                    function (numregis, callback) {
                        contabilidadApi.getFactProLineas(factura, numregis, function (err, faccontalineas) {
                            if (err) return callback(err);
                            callback(null, faccontalineas);
                        });
                    },
                    // Dar de alta las líneas de factura
                    function (faccontalineas, callback) {
                        contabilidadApi.postFactProLineas(faccontalineas, con, function (err) {
                            if (err) return callback(err);
                            callback();
                        });
                    },
                    // Obtener los totales de factura
                    function (numregis, callback) {
                        contabilidadApi.getFactProTotales(factura, numregis, function (err, faccontatotales) {
                            if (err) return callback(err);
                            callback(null, faccontatotales);
                        });
                    },
                    // Dar de alta los totales de factura
                    function (faccontatotales, callback) {
                        contabilidadApi.postFactProTotales(faccontatotales, con, function (err) {
                            if (err) return callback(err);
                            callback();
                        });
                    }
                ], function (err) {
                    if (err) {
                        con.rollback();
                        con.end();
                        return done(err);
                    }
                    con.commit(function (err) {
                        if (err) {
                            con.rollback();
                            con.end();
                            return done(err);
                        }
                        con.end();
                        done();
                    })
                });
            });
        });
    },
    getNumRegis: function (tiporegi, numserie, fecha, con, done) {
        // el llamante es responsable de crear y cerrar la conexión 'con'
        async.waterfall([
            function (callback) {
                var sql = "SELECT * FROM parametros";
                con.query(sql, function (err, rows) {
                    if (err) return callback(err);
                    callback(null, rows[0]);
                })
            },
            function (param, callback) {
                var fechaini = param.fechaini;
                var fechafin = param.fechafin;
                var fechafin2 = moment(fechafin).add('years', 1).toDate();
                if (fecha > fechafin2 || fecha < fechaini) {
                    var err = new Error('La fecha de la factura ' + moment(fecha).format('DD/MM/YYY') + ' está fuera de los periodos contables');
                    return callback(err);
                }
                var periodo = 1
                if (fecha > fechafin) {
                    periodo = 2
                }
                callback(null, periodo);
            },
            function (periodo, callback) {
                var contador = 0;
                var sql = "SELECT * FROM contadores WHERE tiporegi = ?";
                sql = mysql.format(sql, tiporegi);
                con.query(sql, function (err, rows) {
                    if (err) return callback(err);
                    if (rows.length == 0) return callback(new Error('No se han encontrado contadores para tiporegi = ' + tiporegi));
                    contador = row[0]['contado' + periodo] + 1;
                    callback(null, periodo, contador);
                })
            },
            function (periodo, contador, callback) {
                var sql = "UPDATE contadores SET contador" + periodo + " = " + contador + " WHERE tiporegi = ?";
                sql = mysql.format(sql, tiporegi);
                con.query(sql, function (err) {
                    if (err) return callback(err);
                    callback(null, contador);
                })
            }
        ], function (err, result) {
            if (err) done(err);
            done(null, contador);
        })
    },
    // Obtiene la factura de la gestión con los campos necesarios para darla de alta
    // ene la contabilidad
    getFactPro: function (factura, numregis, done) {
        var con = comun.getConnection();
        var sql = "SELECT";
        sql += " 1 AS numserie, ? AS numregis, f.fecha_recepcion AS fecharec, f.numeroFacturaProveedor AS numfactu,";
        sql += " f.fecha AS fecfactu, 0 AS codconce340, 0 AS codopera,";
        sql += " p.cuentaContable AS codmacta, f.ano AS anofactu, fp.codigoContable AS codforpa, f.observaciones AS observa,";
        sql += " b.bases AS totbases, b.bases AS totbasesret, b.cuotas AS totivas, f.totalConIva AS totfacpr, ";
        sql += " f.porcentajeRetencion AS retfacpr, f.importeRetencion AS trefacpr, prm.cuentaretencion AS cuereten, 1 AS tiporeten,";
        sql += " f.emisorNombre AS nommacta, f.emisorDireccion AS dirdatos, f.emisorCodPostal AS codpobla, f.emisorPoblacion AS despobla,";
        sql += " f.emisorProvincia AS desprovi, f.emisorNif AS nifdatos, 'ES' AS codpais, NULL AS codintra";
        sql += " FROM facprove AS f"
        sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = f.formaPagoId";
        sql += " LEFT JOIN (SELECT facproveId, SUM(base) AS bases, SUM(cuota) AS cuotas FROM facprove_bases GROUP BY facproveId) AS b ON b.facProveId = f.facproveId";
        sql += " LEFT JOIN parametros AS prm ON 1=1";
        sql += " WHERE f.facproveId = ?";
        sql = mysql.format(sql, [numregis, factura.facproveId]);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            if (rows.length == 0) return done(new Error('No se ha encontrado la factura de proveedor ' + factura.facproveId));
            done(null, rows[0]);
        });
    },
    postFactPro: function (factura, con, done) {
        var sql = "INSERT INTO factpro SET ?";
        sql = mysql.format(sql, factura);
        con.query(sql, function (err, row) {
            if (err) return done(err);
            done(null);
        });
    },
    getFactProLineas: function (factura, numregis, done) {
        var con = comun.getConnection();
        var sql = "SELECT";
        sql += " 1 AS numserie, ? AS numregis, f.fecha_recepcion AS fecharec, f.ano AS anofactu, fl.facproveLineaId AS numlinea,";
        sql += " ga.cuentacompras AS codmacta, fl.totalLinea AS baseimpo, tp.codigoContable AS codigiva, fl.porcentaje AS porciva, 0 AS porcrec,";
        sql += " ROUND((fl.totalLinea * fl.porcentaje) / 100.0, 2) AS impoiva, 0 AS imporec, NULL AS aplicret, NULL AS codcost";
        sql += " FROM facprove_lineas AS fl";
        sql += " LEFT JOIN facprove AS f ON f.facproveId = fl.facproveId";
        sql += " LEFT JOIN articulos AS a ON a.articuloId = fl.articuloId"
        sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoArticuloId = a.grupoArticuloId";
        sql += " LEFT JOIN tipos_iva AS tp ON tp.tipoIvaId = fl.tipoIvaId";
        sql += " WHERE f.facproveId = ?";
        sql = mysql.format(sql, [numregis, factura.facproveId]);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            done(null, rows);
        });
    },
    postFactProLineas: function (facturas, con, done) {
        async.series(facturas, function (f, callback) {
            var sql = "INSERT INTO factpro_lineas SET ?";
            sql = mysql.format(sql, f);
            con.query(sql, function (err) {
                if (err) callback(err);
                callback();
            })
        }, function (err) {
            if (err) done(err);
            done();
        });
    },
    getFactProTotales: function (factura, numregis, done) {
        var con = comun.getConnection();
        var sql = "SELECT";
        sql += " 1 AS numserie, ? AS nuregis, f.fecha_recepcion AS fecharec, f.ano AS anofactu, fb.facproveBaseId AS numlinea,";
        sql += " fb.base AS baseimpo, tp.codigoContable AS codigiva, tp.porcentaje AS porciva, 0 AS porcrec, fb.cuota AS impoiva, 0 AS imporec";
        sql += " FROM facprove_bases AS fb";
        sql += " LEFT JOIN facprove AS f ON f.facproveId = fb.facproveId";
        sql += " LEFT JOIN tipos_iva AS tp ON tp.tipoIvaId = fb.tipoIvaId";
        sql += " WHERE f.facproveId = ?";
        sql = mysql.format(sql, [numregis, factura.facproveId]);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            done(null, rows);
        });
    },
    postFactProTotales: function (facturas, con, done) {
        async.series(facturas, function (f, callback) {
            var sql = "INSERT INTO factpro_totales SET ?";
            sql = mysql.format(sql, f);
            con.query(sql, function (err) {
                if (err) callback(err);
                callback();
            })
        }, function (err) {
            if (err) done(err);
            done();
        });
    }
};



module.exports = contabilidadApi;
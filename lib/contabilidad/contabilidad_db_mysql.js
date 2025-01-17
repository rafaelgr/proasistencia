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
        var sql = "SELECT contabilidad FROM empresas WHERE empresaId = ?";
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
        var cuentas = []
        async.eachSeries(facturas, function (f, callback) {
            if(f.antproveId || f.restoPagar == 0) {
                contabilidadApi.comprobarCuentasCreadasCompras(f, function (err, result) {
                    if (err) return callback(err);
                    if (result) {
                        cuentas.push(result)
                        callback();
                    } else {
                        contabilidadApi.comprobarCuentaContableProveedor(f, function (err, result) {
                            if(err) return callback(err);
                            if (result) {
                                cuentas.push(result)
                                callback();
                            } else {
                                contabilidadApi.contabilizarUnaFacturaProveedorSoloLibro(f,function (err) {
                                    if (err) return callback(err);
                                    //quitamos la marca de seleccionada
                                    contabilidadApi.updateSel(f.facproveId, function(err) {
                                        if (err) return callback(err);
                                        callback();
                                    });
                                });
                            }
                        });
                    }
                });

            } else {
                contabilidadApi.comprobarCuentasCreadasCompras(f, function (err, result) {
                    if (err) return callback(err);
                    if (result) {
                        cuentas.push(result)
                        callback();
                    }  
                    else {
                        contabilidadApi.comprobarCuentaContableProveedor(f, function (err, result) {
                            if(err) return callback(err);
                            if (result) {
                                cuentas.push(result)
                                callback();
                            } else {
                                contabilidadApi.comprobarCuentaContableFianzas(f, function(err, cuentasCont) {
                                    if(err) return callback(err);
                                    if(cuentasCont) {f.cuentaContableFianza = cuentasCont.cuentaContableFianza; f.cuentaContable = cuentasCont.cuentaContable}
                                    contabilidadApi.contabilizarUnaFacturaProveedor(f,function (err) {
                                        if (err) return callback(err);
                                        //quitamos la marca de seleccionada
                                        contabilidadApi.updateSel(f.facproveId, function(err) {
                                            if (err) return callback(err);
                                            callback();
                                    });
                                    });
                                });
                            }
                        });
                    }
                });
            }
            
        }, function (err) {
            if (err) return done(err);
            done(null, cuentas);
        });
    },


    comprobarCuentaContableFianzas(factura, callback) {
        if(factura.fianza > 0) {
            contabilidadApi.getProveedor(factura, function (err, cuentas) {
                if(err) return callback(err);
                callback(null, cuentas);
            });
        } else {
            callback(null, null);
        }
    },

    getProveedor(f, callback) {
        var con = comun.getConnection();
        var sql = "SELECT p.*, tp.inicioCuentaFianza";
        sql += " FROM proveedores AS p";
        sql += " LEFT JOIN tipos_proveedor AS tp ON tp.tipoProveedorId = p.tipoProveedor";
        sql += " WHERE p.proveedorId = ?";
        sql = mysql.format(sql, f.proveedorId);
        con.query(sql, function (err, row) {
            con.end();
            if (err) return callback(err);
            contabilidadApi.getContaEmpresa(f.empresaId, function (err, conta) {
                if (err) return callback(err);
                contabilidadApi.getNumDigitos(function(err, result) {
                    var  cuentaContable = contabilidadApi.getCuentaFianza(row[0], result);
                    contabilidadApi.buscaCuentaFianza(cuentaContable, conta, function(err, result2) {
                        if(err) return callback(err);
                        if(!result2) {
                            contabilidadApi.transformaProveedorConta(row[0], cuentaContable,function(err, result3) {
                                if(err) return callback(err);
                                contabilidadApi.postProveedorConta(result3, conta,function(err, result4) {
                                    if(err) return callback(err);
                                    var data = {
                                       
                                            cuentaContableFianza: cuentaContable,
                                            cuentaContable: row[0].cuentaContable
                                        
                                    }
                                    callback(null, data);
                                });
                            });
                        } else {
                            var data = 
                                {
                                    cuentaContableFianza: cuentaContable,
                                    cuentaContable: row[0].cuentaContable
                                }
                            
                             callback(null, data);
                        }
                    });
                });
            });
        });
    },

    buscaCuentaFianza(codmacta, conta, done) {
        var connection = comun.getConnectionDb(conta);
        var sql = "SELECT codmacta FROM cuentas WHERE codmacta = ?";
        sql = mysql.format(sql, codmacta);
        connection.query(sql, function (err, result) {
            connection.end();
            if (err) return done(err);
            if(result.length == 0) return done(null, null);
            done(null, true);
        })
    },
    postProveedorConta(proveedorConta,conta, callback) {
        var connection = comun.getConnectionDb(conta);
                var sql = "INSERT INTO cuentas SET ?";
                sql = mysql.format(sql,proveedorConta);
                connection.query(sql, function (err) {
                    connection.end();
                    if (err) return callback(err);
                    callback();
                })
    },

    getCuentaFianza: function (infpro, numdigitos) {
        var s1 = '' + infpro.inicioCuentaFianza + infpro.codigo;
        var n1 = s1.length;
        var n2 = numdigitos - n1 + 1;
        var s2 = Array(n2).join('0');
        var codmacta = '' + infpro.inicioCuentaFianza + s2 + infpro.codigo;
        //var sql = "SELECT codmacta FROM cuentas WHERE codmacta = ?";
        //sql = mysql.format(sql, codmacta);
        return codmacta;
    },

    // transformaProveedorConta
// transforma un objecto proveedor de gestión a proveedor de contabilidad
transformaProveedorConta(proveedor, codmacta, done) {
    var proveedorConta = null;
    // asumimos que la cuentaContable es correcta
    // buscamos el código contable de la forma de pago 
    var connection = comun.getConnection();
    var sql = "SELECT * FROM formas_pago where formaPagoId = ?";
    sql = mysql.format(sql, proveedor.formaPagoId);
    connection.query(sql, function (err, result) {
        connection.end();
        if (err) return done(err);
        var codigoContable = result[0].codigoContable;
        // ya podemos ir montando el proveedor de contabilidad
        proveedorConta = {
            codmacta: codmacta,
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
},

    comprobarCuentaContableProveedor(factura, callback) {
        var facconta = [];
        contabilidadApi.getContaEmpresa(factura.empresaId, function (err, conta) {
            if (err) return callback(err);
            var con = comun.getConnectionDb(conta);
            contabilidadApi.getFactPro(factura, 1,function (err, resultado) {//recuperamos la cuenta contable del cliente
                if (err) return callback(err);
                facconta.push(resultado);
                contabilidadApi.getCuentasLineas(facconta, factura, con,function (err, result) {
                    con.end();
                    if (err) return callback(err);
                    callback(null, result);
                });
                
            });
        });
    },

    comprobarCuentaContableProveedorAnticipo(anticipo, callback) {
        var antconta = [];
        contabilidadApi.getContaEmpresa(anticipo.empresaId, function (err, conta) {
            if (err) return callback(err);
            var con = comun.getConnectionDb(conta);
            contabilidadApi.getModeloPagoAnt(anticipo,function (err, resultado) {//recuperamos la cuenta contable del cliente
                if (err) return callback(err);
                antconta = resultado
                contabilidadApi.getCuentaAnticipo(antconta, anticipo, con,function (err, result) {
                    con.end();
                    if (err) return callback(err);
                    callback(null, result);
                });
                
            });
        });
    },
    coprobarAnticipos(factura, callback) {
        var con = comun.getConnection();
        var sql = "SELECT";
        sql += " * FROM facprove_antproves";
        sql += " WHERE facproveId = ?";
        sql = mysql.format(sql, factura.facproveId);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return callback(err);
            callback(null, rows);
        });
    },
    comprobarCuentasCreadasCompras(factura, callback) {
        contabilidadApi.getContaEmpresa(factura.empresaId, function (err, conta) {
            if (err) return callback(err);
            var con = comun.getConnectionDb(conta);
            contabilidadApi.getFactProLineas(factura, null, null, function (err, faccontalineas) {
                if (err) return callback(err);
                contabilidadApi.getCuentasLineas(faccontalineas, factura, con,function (err, result) {
                    con.end();
                    if (err) return callback(err);
                    callback(null, result);
                });
                
            });
        });
    },
    contabilizarUnaFacturaProveedor(factura, done) {
        // obtener la contabilidad a la que pertenece la factura
        contabilidadApi.getContaEmpresa(factura.empresaId, function (err, conta) {
            if (err) return done(err);
            var con = comun.getConnectionDb(conta);
            var numreg;
            var fianza;
            con.beginTransaction(function (err) {
                if (err) return done(err);
                async.waterfall([
                    // Obtener el número de registro necesario para las altas
                    function (callback) {
                        contabilidadApi.getNumRegis(1, 1, factura.fecha_recepcion, con, function (err, numregis) {
                            if (err) return callback(err);
                            if(numregis) {
                                numreg = numregis;
                            }
                            callback(null, numregis);
                        });
                    },
                    // Obtener la cabecera de factura
                    function (numregis, callback) {
                        contabilidadApi.getFactPro(factura, numregis, function (err, facconta) {
                            if (err) return callback(err);
                            callback(null, facconta, numregis);
                        });
                    },
                    // Dar de alta la cabecera de factura
                    function (facconta, numregis, callback) {
                        fianza = facconta.fianza;
                        delete facconta.fianza;
                        contabilidadApi.postFactPro(facconta, con, function (err) {
                            if (err) return callback(err);
                            callback(null, numregis);
                        });
                    },
                    // Obtener las lineas de factura
                    function (numregis, callback) {
                        contabilidadApi.getFactProLineas(factura, numregis, fianza, function (err, faccontalineas) {
                            if (err) return callback(err);
                            callback(null, faccontalineas, numregis);
                        });
                    },
                    // Dar de alta las líneas de factura
                    function (faccontalineas, numregis, callback) {
                        contabilidadApi.postFactProLineas(faccontalineas, con, function (err) {
                            if (err) return callback(err);
                            callback(null, numregis);
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
                    },
                    // Obtener el modelo de pago
                    function (callback) {
                        contabilidadApi.getModeloPago(factura, function (err, modelo) {
                            if (err) return callback(err);
                            callback(null, modelo);
                        })
                    },
                    // Obtener los pagos de esa factura
                    function (modelo, callback) {
                        contabilidadApi.getPagosConModelo(factura, modelo, function (err, pagos) {
                            if (err) return callback(err);
                            callback(null, pagos, factura);
                        })
                    },
                    // Dar de alta los pagos en la contabilidad
                    function (pagos, factura, callback) {
                        contabilidadApi.postPagosConta(pagos, con, factura, function (err) {
                            if (err) return callback(err);
                            callback();
                        })
                    },
                    // Actualizar como contabilizada
                    function (callback) {
                        contabilidadApi.actualizarComoContabilizada(factura, numreg, function (err) {
                            if (err) return callback(err);
                            callback();
                        })
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
    // APUNTE DE ANTICIPO  PROVEEDOR EN CONTABILIDAD
    contabilizarFacturasProveedorSoloPagos(facturas, done) {
        var cuentas = [];
        async.eachSeries(facturas, function (f, callback) {
            contabilidadApi.comprobarCuentaContableProveedorAnticipo(f, function(err, result) {
                if (result) {
                    cuentas.push(result)
                    callback();
                } else {
                    contabilidadApi.contabilizarUnaFacturaProveedorSoloPagos(f, function (err) {
                        if (err) return callback(err);
                        callback(null, cuentas);
                    });
                }
            });
            
        }, function (err) {
            if (err) return done(err);
            done(null, cuentas);
        });
    },

    contabilizarUnaFacturaProveedorSoloPagos(factura, done) {
        // obtener la contabilidad a la que pertenece la factura
        contabilidadApi.getContaEmpresa(factura.empresaId, function (err, conta) {
            if (err) return done(err);
            var con = comun.getConnectionDb(conta);
            con.beginTransaction(function (err) {
                if (err) return done(err);
                async.waterfall([
                    // Obtener el modelo de pago
                    function (callback) {
                        contabilidadApi.getModeloPagoAnt(factura, function (err, modelo) {
                            if (err) return callback(err);
                            callback(null, modelo);
                        })
                    },
                    // Obtener los pagos de esa factura
                    function (modelo, callback) {
                        contabilidadApi.getPagosConModeloAnt(factura, modelo, function (err, pagos) {
                            if (err) return callback(err);
                            callback(null, pagos);
                        })
                    },
                    // Dar de alta los pagos en la contabilidad
                    function (pagos, callback) {
                        contabilidadApi.postPagosContaAnt(pagos, con, factura, function (err) {
                            if (err) return callback(err);
                            callback();
                        })
                    },
                    // Actualizar como contabilizada
                    function (callback) {
                        contabilidadApi.actualizarComoContabilizadaAnt(factura, function (err) {
                            if (err) return callback(err);
                            callback();
                        })
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
    
    /// Da de alta una factura de proveedor SOLO en el libro de facturas recibidas
    contabilizarUnaFacturaProveedorSoloLibro(factura, done) {
        // obtener la contabilidad a la que pertenece la factura
        contabilidadApi.getContaEmpresa(factura.empresaId, function (err, conta) {
            if (err) return done(err);
            var numreg;
            var fianza;
            var con = comun.getConnectionDb(conta);
            con.beginTransaction(function (err) {
                if (err) return done(err);
                async.waterfall([
                    // Obtener el número de registro necesario para las altas
                    function (callback) {
                        contabilidadApi.getNumRegis(1, 1, factura.fecha_recepcion, con, function (err, numregis) {
                            if(numregis) {
                                numreg = numregis
                            }
                            if (err) return callback(err);
                            callback(null, numregis);
                        });
                    },
                    // Obtener la cabecera de factura
                    function (numregis, callback) {
                        contabilidadApi.getFactPro(factura, numregis, function (err, facconta) {
                            if (err) return callback(err);
                            callback(null, facconta, numregis);
                        });
                    },
                    // Dar de alta la cabecera de factura
                    function (facconta, numregis, callback) {
                        fianza = facconta.fianza;
                        delete facconta.fianza;
                        contabilidadApi.postFactPro(facconta, con, function (err) {
                            if (err) return callback(err);
                            callback(null, numregis);
                        });
                    },
                    // Obtener las lineas de factura
                    function (numregis, callback) {
                        contabilidadApi.getFactProLineas(factura, numregis, null, function (err, faccontalineas) {
                            if (err) return callback(err);
                            callback(null, faccontalineas, numregis);
                        });
                    },
                    // Dar de alta las líneas de factura
                    function (faccontalineas, numregis, callback) {
                        contabilidadApi.postFactProLineas(faccontalineas, con, function (err) {
                            if (err) return callback(err);
                            callback(null, numregis);
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
                    },
                    // Actualizar como contabilizada
                    function (callback) {
                        contabilidadApi.actualizarComoContabilizada(factura, numreg,function (err) {
                            if (err) return callback(err);
                            callback();
                        })
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
                 var fechaini = new Date(moment(param.fechaini).format('YYYY-MM-DD'));
                var fechafin = new Date(moment(param.fechafin).format('YYYY-MM-DD'));
                var fechafin2 = moment(fechafin).add(1, 'years').toDate();
                if (fecha > fechafin2 || fecha < fechaini) {
                    var err = new Error('La fecha de la factura ' + moment(fecha).format('DD/MM/YY') + ' está fuera de los periodos contables');
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
                    contador = rows[0]['contado' + periodo] + 1;
                    callback(null, periodo, contador);
                })
            },
            function (periodo, contador, callback) {
                var sql = "UPDATE contadores SET contado" + periodo + " = " + contador + " WHERE tiporegi = '" + tiporegi + "'";
                sql = mysql.format(sql, tiporegi);
                con.query(sql, function (err) {
                    if (err) return callback(err);
                    callback(null, contador);
                })
            }
        ], function (err, result) {
            if (err) return done(err);
            done(null, result);
        })
    },
    //FACTURAS PROVEEDORES
    // Obtiene la factura de la gestión con los campos necesarios para darla de alta
    // ene la contabilidad
    getFactPro: function (factura, numregis, done) {
        var con = comun.getConnection();
        var sql = "SELECT";
        sql += " 1 AS numserie, ? AS numregis, f.fecha_recepcion AS fecharec, f.numeroFacturaProveedor AS numfactu,";
        sql += " f.fecha AS fecfactu, 0 AS codconce340, io.codopera AS codopera, f.fecha_recepcion AS fecliqpr,";
        sql += " p.cuentaContable AS codmacta, f.ano AS anofactu, fp.codigoContable AS codforpa, CONCAT('REFERENCIA: ',f.ref,' ',COALESCE(f.observaciones, ' ')) AS observa,";
        sql += " b.bases AS totbases, b.cuotas AS totivas, f.totalConIva AS totfacpr, ";
        sql += " f.emisorNombre AS nommacta, f.emisorDireccion AS dirdatos, f.emisorCodPostal AS codpobla, f.emisorPoblacion AS despobla,";
        sql += " f.emisorProvincia AS desprovi, f.emisorNif AS nifdatos, pa.codpais AS codpais, NULL AS codintra,";
        sql += " fr.totRet AS trefacpr, fr.baseRet AS totbasesret, fr.porRet AS retfacpr, fr.codRet AS tiporeten, fr.cuenRet  AS cuereten, f.fianza AS fianza,  b.suplidos AS suplidos"
        sql += " FROM facprove AS f"
        sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = f.formaPagoId"; 
        sql += " LEFT JOIN (SELECT bases.facproveId, SUM(bases.base) AS bases, SUM(bases.cuota) AS cuotas , SUM(bases.suplidos) AS suplidos FROM (SELECT facproveId, IF(tipoIvaId != 6, base, 0) AS base, IF(tipoIvaId != 6, 0, base) AS suplidos ,cuota FROM facprove_bases) AS bases GROUP BY facproveId) AS b ON b.facProveId = f.facproveId ";
        sql += " LEFT JOIN tipos_operaciones AS io ON io.tipoOperacionId = f.tipoOperacionId";
        sql += " LEFT JOIN paises AS pa ON pa.paisId = p.paisId";
        sql += " LEFT JOIN (SELECT facproveId, importeRetencion AS totRet, baseRetencion AS baseRet, porcentajeRetencion AS porRet,";
        sql += " codigoRetencion AS codRet, cuentaRetencion AS cuenRet FROM facprove_retenciones) AS fr ON fr.facProveId = f.facproveId";
        sql += " LEFT JOIN parametros AS prm ON 1=1";
        sql += " WHERE f.facproveId = ?";
        sql = mysql.format(sql, [numregis, factura.facproveId]);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            if (rows.length == 0) return done(new Error('No se ha encontrado la factura de proveedor ' + factura.facproveId));
            var result;
            if(rows.length > 1) {
                for(var i=0; i < rows.length; i++){
                    if(rows[i].retfacpr > 0) {
                        result = rows[i];
                        break;
                    }
                }
            }else {
                result = rows[0]
            }
            if(result.retfacpr == 0) {
                result.totbasesret = null;
                result.trefacpr = null;
                result.totbasesret = null;
                result.retfacpr = null;
                result.cuereten = null
            }
            if(result.tiporeten == null) {
                result.tiporeten = 0;
            }
            //Procesamos la factura en caso de que sea intracomunitaria
            if(result.codopera == 1) {
                result.codintra = "A";
                result.codconce340 = "P"
            }
            //Procesamos la factura en caso de que sea IVA REPERCUTIDO
            if(result.codopera == 4) {
                result.codconce340 = "I"
            }
            done(null, result);
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
    getFactProLineas: function (factura, numregis, fianza, done) {
        var con = comun.getConnection();
        var numLineas = 0;
        var sql = "SELECT";
        sql += " 1 AS numserie, ? AS numregis, f.fecha_recepcion AS fecharec, f.ano AS anofactu, @rownum:=@rownum+1 AS numlinea,  fl.porcentajeRetencion,";
        sql += " ga.cuentacompras AS codmacta, fl.totalLinea AS baseimpo, tp.codigoContable AS codigiva, fl.porcentaje AS porciva, 0 AS porcrec,";
        sql += " ROUND((fl.totalLinea * fl.porcentaje) / 100.0, 2) AS impoiva, 0 AS imporec, 0 AS aplicret, NULL AS codccost";
        sql += " FROM facprove_lineas AS fl";
        sql += " LEFT JOIN facprove AS f ON f.facproveId = fl.facproveId";
        sql += " LEFT JOIN articulos AS a ON a.articuloId = fl.articuloId"
        sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoArticuloId = a.grupoArticuloId";
        sql += " LEFT JOIN tipos_iva AS tp ON tp.tipoIvaId = fl.tipoIvaId";
        sql += " ,(SELECT @rownum:=0) r"
        sql += " WHERE f.facproveId = ?";
        sql = mysql.format(sql, [numregis, factura.facproveId]);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            numLineas = rows.length;
            for(var j=0; j < rows.length; j++) {
                if(rows[j].porcentajeRetencion > 0){//evaluamos si hay retencion
                    rows[j].aplicret = 1;
                    delete rows[j].porcentajeRetencion//como la propiedad no existe en la tabla que vamos a actualizar la eliminamos
                } else {
                   delete rows[j].porcentajeRetencion
                }
            }
            if(fianza > 0) {
                if (numLineas > 1) {
                    for( var k = 0; k < rows.length; k++) {
                        if(k > 0) {
                            if(rows[k-1].numlinea > rows[k].numlinea) {
                                numLineas = rows[k-1].numlinea;
                            } else {
                                numLineas = rows[k].numlinea;
                            }
                        }
                    }
                }
                
                numLineas++
                var con2 = comun.getConnection();
                sql = "SELECT 1 AS numserie, ? AS numregis, f.fecha_recepcion AS fecharec, f.ano AS anofactu, " + numLineas + " AS numlinea,"; 
                sql += " ? AS codmacta, ? AS baseimpo, 4 AS codigiva, 0 porciva, 0 AS porcrec,";
                sql += " 0 AS impoiva, 0 AS imporec, 0 AS aplicret, NULL AS codccost";
                sql += " FROM facprove_lineas AS fl";
                sql += " LEFT JOIN facprove AS f ON f.facproveId = fl.facproveId";
                sql += " LEFT JOIN proveedores AS pro ON pro.proveedorId = f.proveedorId";
                sql += " WHERE f.facproveId = ?";
                sql = mysql.format(sql, [numregis, factura.cuentaContable, fianza, factura.facproveId]);
                con2.query(sql, function (err, result) {
                    con2.end();
                    if(err) return done(err);
                    rows.push(result[0]);
                    numLineas++
                fianza = (fianza*(-1));
                    var con3 = comun.getConnection();
                    sql = "SELECT 1 AS numserie, ? AS numregis, f.fecha_recepcion AS fecharec, f.ano AS anofactu, " + numLineas + " AS numlinea,"; 
                    sql += " ? AS codmacta, ? AS baseimpo, 4 AS codigiva, 0 porciva, 0 AS porcrec,";
                    sql += " 0 AS impoiva, 0 AS imporec, 0 AS aplicret, NULL AS codccost";
                    sql += " FROM facprove_lineas AS fl";
                    sql += " LEFT JOIN facprove AS f ON f.facproveId = fl.facproveId";
                    sql += " WHERE f.facproveId = ?";
                    sql = mysql.format(sql, [numregis, factura.cuentaContableFianza, fianza, factura.facproveId]);
                    con3.query(sql, function (err, result2) {
                        con3.end();
                        if(err) return done(err);
                        rows.push(result2[0]);
                        done(null, rows);        
                    }); 
                }); 
            } else {
                done(null, rows);
            }
        });
    },
    getCuentasLineas(faccontalineas, factura, con, done) {
        var cuentas = [];
        var resultado = {};
        var contador = 0;
        var encontrado = 0;
        async.eachSeries(faccontalineas,
            (linea, done1) => {
                if(!linea.codmacta) linea.codmacta = '';
                contador ++;
                var sql = "SELECT codmacta FROM cuentas WHERE codmacta = ?";
                sql = mysql.format(sql, linea.codmacta);
                con.query(sql, (err, result) => {
                    if (err) return done1(err);
                    if(result.length == 0) {
                        if(cuentas.length == 0) {
                            resultado = {
                                cuenta: linea.codmacta
                            }
                            if(factura.facproveId) {
                                resultado.factura = factura.ref;
                                resultado.empresa = factura.receptorNombre
                            } else {
                                var compuesto = factura.serie + '-' + factura.ano  + '-' + factura.numero
                                resultado.factura = compuesto;
                                resultado.empresa = factura.emisorNombre;
                            }
                            cuentas.push(resultado);
                        } else {
                            for(var i = 0; i < cuentas.length; i++) {
                                if(cuentas[i].cuenta == linea.codmacta) { 
                                    encontrado = 1;
                                    break;
                                }

                            }
                            if(encontrado ==  0) {
                                resultado = {
                                    cuenta: linea.codmacta,
                                }
                                if(factura.facproveId) {
                                    resultado.factura = factura.ref;
                                    resultado.empresa = factura.receptorNombre;
                                } else {
                                    var numero = factura.ano + '-' + factura.serie + '-' + factura.numero
                                    resultado.factura = factura.numero;
                                    resultado.empresa = factura.emisorNombre;
                                }
                                cuentas.push(resultado);
                            }
                        }
                        if(contador == faccontalineas.length) {
                            return done(null, cuentas);
                        } else {
                            return done1();
                        }
                    } else {
                        done1();
                    }
                   
                })
            },
            (err) => {
                if (err) return done(err);
                done();
            });
    },

    getCuentaAnticipo(antconta, anticipo, con, done) {
        var cuentas = [];
        var resultado = {};
                var sql = "SELECT codmacta FROM cuentas WHERE codmacta = ?";
                sql = mysql.format(sql, antconta.codmacta);
                con.query(sql, (err, result) => {
                    if (err) return done(err);
                    if(result.length == 0) {
                        if(cuentas.length == 0) {
                            resultado = {
                                cuenta: antconta.codmacta
                            }
                            if(anticipo.antproveId) {
                                resultado.anticipo = anticipo.numeroAnticipoProveedor;
                                resultado.empresa = anticipo.emisorNombre
                            } else {
                                var compuesto = anticipo.serie + '-' + anticipo.ano  + '-' + anticipo.numero
                                resultado.anticipo = compuesto;
                                resultado.empresa = anticipo.emisorNombre;
                            }
                        }
                        done(null, resultado);
                    } else {
                        done();
                    }
                   
                })
    },
    postFactProLineas: function (facturas, con, done) {
        async.eachSeries(facturas, function (f, callback) {
            var sql = "INSERT INTO factpro_lineas SET ?";
            sql = mysql.format(sql, f);
            con.query(sql, function (err) {
                if (err) return callback(err);
                callback();
            })
        }, function (err) {
            if (err) return done(err);
            done();
        });
    },
    getFactProTotales: function (factura, numregis, done) {
        var con = comun.getConnection();
        var sql = "SELECT";
        sql += " 1 AS numserie, ? AS numregis, f.fecha_recepcion AS fecharec, f.ano AS anofactu, fb.facproveBaseId AS numlinea,";
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
        async.eachSeries(facturas, function (f, callback) {
            var sql = "INSERT INTO factpro_totales SET ?";
            sql = mysql.format(sql, f);
            con.query(sql, function (err) {
                if (err) return callback(err);
                callback();
            })
        }, function (err) {
            if (err) return  done(err);
            done();
        });
    },
    actualizarComoContabilizada: function (factura, numregis, done) {
        var con = comun.getConnection();
        var sql = "UPDATE facprove SET contabilizada = 1,  numregisconta = ? WHERE facproveId = ?";
        sql = mysql.format(sql, [numregis, factura.facproveId]);
        con.query(sql, function (err) {
            con.end();
            if (err) return done(err);
            done();
        });
    },
    getModeloPago: function (factura, done) {
        var con = comun.getConnection();
        var sql = "SELECT"
        sql += " 1 AS numserie, p.cuentaContable AS codmacta, numeroFacturaProveedor AS numfactu, DATE_FORMAT(f.fecha,'%Y-%m-%d') AS fecfactu,";
        sql += " 0 AS numorden, fp.codigoContable AS codforpa, NULL AS fecefect, 0 AS impefect, NULL AS fecultpa, NULL AS imppagad,";
        sql += " NULL AS ctabanc1, NULL AS text1csb, NULL AS text2csb, p.iban AS iban, f.observaciones AS observa,";
        sql += " f.emisorNombre AS nomprove, f.emisorDireccion AS domprove, f.emisorCodPostal AS cpprove, f.emisorPoblacion AS pobprove,";
        sql += " f.emisorProvincia AS proprove, f.emisorNif AS nifprove, 'ES' AS codpais, 0 AS situacion, f.contado As contado, 1 AS comunicadoServer";
        sql += " FROM facprove AS f";
        sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = f.formaPagoId";
        sql += " WHERE f.facproveId = ?";
        sql = mysql.format(sql, factura.facproveId);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            if (rows.length == 0) return done(new Error('La factura de proveedor ' + fatura.facproveId + ' no se ha encontrado'));
            //rows[0].fecfactu = moment(rows[0].fecfactu, "YYYY-MM-DD HH:mm:ss",true).format("YYYY-MM-DD");
            done(null, rows[0]);
        })
    },
    getPagosConModelo: function (factura, modelo, done) {
        var con = comun.getConnection();
        var pagos = [];
        var modelo2;
        var sql = "SELECT * FROM formas_pago WHERE formaPagoId = ?";
        sql = mysql.format(sql, factura.formaPagoId);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            if (rows.length == 0) return done(new Error('No se ha encontrado forma de pago ' + factura.formaPagoId));
            var fpago = rows[0];
            // siempre hay un primer vencimiento
            var importeP = factura.restoPagar / fpago.numeroVencimientos;
            var importeP = Math.round(importeP * 100) / 100;
            var resto = factura.restoPagar - (importeP * fpago.numeroVencimientos);
            modelo.numorden = 1;
            modelo.fecefect = moment(factura.fecha).add(fpago.primerVencimiento, 'days').toDate();
            modelo.impefect = importeP + resto;
            pagos.push(modelo);
            // miramos si hay más vencimientos
            if (fpago.numeroVencimientos > 1) {
                for (var i = 2; i <= fpago.numeroVencimientos; i++) {
                    modelo2 = JSON.parse(JSON.stringify(modelo));
                    modelo2.numorden = i;
                    modelo2.fecefect = moment(pagos[i - 2].fecefect).add(fpago.restoVencimiento, 'days').toDate();
                    modelo2.impefect = importeP;
                    pagos.push(modelo2);
                }
            }

            done(null, pagos);
        });
    },
    postPagosConta: function (pagos, con, factura, done) {
        var connection = comun.getConnection();
        var contado = pagos[0].contado;//recuperamos la cantidad al contado de la factura
        var sql = " SELECT ec.cuentapago FROM  empresas_cuentaspago AS ec";
        sql += " LEFT JOIN formas_pago AS fp ON fp.tipoFormaPagoId = ec.tipoFormaPagoId";
        sql += " WHERE fp.codigoContable = ? AND ec.empresaId = ?"
        sql = mysql.format(sql, [pagos[0].codforpa, factura.empresaId])
        connection.query(sql, function (err, row) {
            connection.end();
            if (err) return done(err);
            if(row.length == 0) {
                try{
                    var num = factura.numeroFacturaProveedor;
                    throw new Error("La Cuenta contable de pagos no existe para la forma de pago de la factura numero " + num);
                } catch(e) {
                    return done(e);
                }
            }
            // cada pago va al banco por defecto
            var ctabanc1 = "";
            sql = "SELECT * FROM cuentas WHERE codmacta = " + row[0].cuentapago;
            con.query(sql, function (err, rows) {
                if(rows.length == 0) {
                    try{
                        var num = factura.numeroFacturaProveedor;
                        throw new Error("La Cuenta contable de pagos no existe para la forma de pago de la factura numero " + num);
                    } catch(e) {
                        return done(e);
                    }
                }
                ctabanc1 = rows[0].codmacta;
                // Y ahora a dar de alta todos los pagos
                async.eachSeries(pagos, function (p, callback) {
                    delete p.contado;
                    p.ctabanc1 = ctabanc1;
                    sql = "INSERT INTO pagos SET ?";
                    sql = mysql.format(sql, p);
                    con.query(sql, function (err) {
                        if (err) return callback(err);
                        callback();
                    })
                }, function (err) {
                    if (err) return done(err);
                    //Comprobamos si tiene cantidades al contado
                    var num = 0;
                    if(contado > 0) {
                        num =  pagos.length + 1;
                        var pago = pagos[num-2]
                        pago.numorden =   num;
                        pago.fecefect = factura.fecha;
                        pago.codforpa =   0;
                        pago.impefect = contado;
                        pago.observa = 'Cantidad entregada al contado al proveedor por el cliente';
                        var sql2 = "INSERT INTO pagos SET ?";
                        sql2 = mysql.format(sql2, pago);
                        con.query(sql2, function (err) {
                            if (err) return done(err);
                            done();
                        });
                    } else {
                        done();
                    }
                });
            });
        });
    },


    // Obtiene la factura de la gestión con los campos necesarios para darla de alta
    // en la contabilidad
    getFact: function (factura, done) {
        var con = comun.getConnection();
        var sql = "SELECT";
        sql += "  f.serie AS numserie, CONCAT(ano, RIGHT(CONCAT('000000',numero),6)) AS numfactu,";
        sql += " f.fecha AS fecfactu, f.fecha AS fecliqcl, 0 AS codconce340, 0 AS codopera, 1 as codagente,";
        sql += " c.cuentaContable AS codmacta, f.ano AS anofactu, fp.codigoContable AS codforpa, f.observaciones AS observa,";
        sql += " b.bases AS totbases, b.bases AS totbasesret, b.cuotas AS totivas, f.totalConIva AS totfaccl, ";
        sql += " f.porcentajeRetencion AS retfaccl, COALESCE(f.importeRetencion, 0) AS trefaccl, prm.cuentaretencion AS cuereten, 0 AS tiporeten,";
        sql += " f.receptorNombre AS nommacta, substring(f.receptorDireccion, 1, 50) AS dirdatos, f.receptorCodPostal AS codpobla, f.receptorPoblacion AS despobla,";
        sql += " f.receptorProvincia AS desprovi, f.receptorNif AS nifdatos, 'ES' AS codpais, NULL AS codintra, b.suplidos AS suplidos";
        sql += " FROM facturas AS f"
        sql += " LEFT JOIN clientes AS c ON c.clienteId = f.clienteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = f.formaPagoId";
        sql += " LEFT JOIN (SELECT bases.facturaId, SUM(bases.base) AS bases, SUM(bases.cuota) AS cuotas , SUM(bases.suplidos) AS suplidos FROM (SELECT facturaId, IF(tipoIvaId != 6, base, 0) AS base, IF(tipoIvaId != 6, 0, base) AS suplidos ,cuota FROM facturas_bases) AS bases GROUP BY facturaId) AS b ON b.facturaId = f.facturaId ";
        sql += " LEFT JOIN parametros AS prm ON 1=1";
        sql += " WHERE f.facturaId = ?";
        sql = mysql.format(sql, [factura.facturaId]);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            if (rows.length == 0) return done(new Error('No se ha encontrado la factura con id ' + factura.facturaId));
            if(rows[0].trefaccl == 0) {
                rows[0].trefaccl = null;
                rows[0].cuereten = null;
                rows[0].retfaccl = null;
                rows[0].totbasesret = null;
            }else {
                rows[0].tiporeten = 1;
            }
            done(null, rows[0]);
        });
    },

    getCodmactaClien: function (factura, done) {
        var con = comun.getConnection();
        var sql = "SELECT";
        sql += "  c.cuentaContable AS codmacta";
        sql += " FROM facturas AS f"
        sql += " LEFT JOIN clientes AS c ON c.clienteId = f.clienteId";
        sql += " WHERE f.facturaId = ?";
        sql = mysql.format(sql, [factura.facturaId]);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            if (rows.length == 0) return done(new Error('No se ha encontrado la factura con id ' + factura.facturaId));
            if(rows[0].trefaccl == 0) {
                rows[0].trefaccl = null;
                rows[0].cuereten = null;
                rows[0].retfaccl = null;
                rows[0].totbasesret = null;
            }else {
                rows[0].tiporeten = 1;
            }
            done(null, rows[0]);
        });
    },

    postFact: function (factura, con, done) {
        var sql = "INSERT INTO factcli SET ?";
        sql = mysql.format(sql, factura);
        con.query(sql, function (err, row) {
            if (err) return done(err);
            done(null);
        });
    },
    getFactCliLineas: function (numfactu, done) {
        var con = comun.getConnection();
        var sql = "SELECT";
        sql += " f.serie AS numserie, CONCAT(ano, RIGHT(CONCAT('000000',numero),6)) AS numfactu,"
        sql += " f.fecha AS fecfactu, f.ano AS anofactu, @rownum:=@rownum+1  AS numlinea,";
        sql += " ga.cuentaventas AS codmacta, fl.totalLinea AS baseimpo, tp.codigoContable AS codigiva, fl.porcentaje AS porciva, 0 AS porcrec,";
        sql += " ROUND((fl.totalLinea * fl.porcentaje) / 100.0, 2) AS impoiva, 0 AS imporec, 0 AS aplicret, NULL AS codccost";
        sql += " FROM facturas_lineas AS fl";
        sql += " LEFT JOIN facturas AS f ON f.facturaId = fl.facturaId";
        sql += " LEFT JOIN articulos AS a ON a.articuloId = fl.articuloId"
        sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoArticuloId = a.grupoArticuloId";
        sql += " LEFT JOIN tipos_iva AS tp ON tp.tipoIvaId = fl.tipoIvaId";
        sql += " INNER JOIN (SELECT @rownum:=0) r"
        sql += " WHERE f.facturaId = ?";
        sql = mysql.format(sql, numfactu);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            done(null, rows);
        });
    },
    getCodmacta: function (numfactu, done) {
        var con = comun.getConnection();
        var sql = "SELECT";
        sql += " ga.cuentaventas AS codmacta"
        sql += " FROM facturas_lineas AS fl";
        sql += " LEFT JOIN facturas AS f ON f.facturaId = fl.facturaId";
        sql += " LEFT JOIN articulos AS a ON a.articuloId = fl.articuloId"
        sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoArticuloId = a.grupoArticuloId";
        sql += " LEFT JOIN tipos_iva AS tp ON tp.tipoIvaId = fl.tipoIvaId";
        sql += " INNER JOIN (SELECT @rownum:=0) r"
        sql += " WHERE f.facturaId = ?";
        sql = mysql.format(sql, numfactu);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            done(null, rows);
        });
    },
    postFactCliLineas: function (facturas, con, done) {
        async.eachSeries(facturas, function (f, callback) {
            f.numfactu = f.numfactu.toString();
            var sql = "INSERT INTO factcli_lineas SET ?";
            sql = mysql.format(sql, f);
            con.query(sql, function (err) {
                if (err) return done(err);
                callback();
            })
        }, function (err) {
            if (err) return done(err);
            done();
        });
    },
    getFactCliTotales: function (numfactu, done) {
        var con = comun.getConnection();
        var sql = "SELECT";
        sql += " f.serie AS numserie, CONCAT(ano, RIGHT(CONCAT('000000',numero),6)) AS numfactu,"
        sql += " f.fecha AS fecfactu, f.ano AS anofactu, @rownum:=@rownum+1  AS numlinea,";
        sql += " fb.base AS baseimpo, tp.codigoContable AS codigiva, tp.porcentaje AS porciva, 0 AS porcrec, fb.cuota AS impoiva, 0 AS imporec";
        sql += " FROM facturas_bases AS fb";
        sql += " LEFT JOIN facturas AS f ON f.facturaId = fb.facturaId";
        sql += " LEFT JOIN tipos_iva AS tp ON tp.tipoIvaId = fb.tipoIvaId";
        sql += " INNER JOIN (SELECT @rownum:=0) r"
        sql += " WHERE f.facturaId = ?";
        sql = mysql.format(sql, numfactu);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            done(null, rows);
        });
    },
    postFactCliTotales: function (facturas, con, done) {
        async.eachSeries(facturas, function (f, callback) {
            f.numfactu = f.numfactu.toString();
            var sql = "INSERT INTO factcli_totales SET ?";
            sql = mysql.format(sql, f);
            con.query(sql, function (err) {
                if (err) return done(err);
                callback();
            })
        }, function (err) {
            if (err) return done(err);
            done();
        });
    },
    getModeloCobro: function (factura, done) {
        var con = comun.getConnection();
        var sql = "SELECT "
        sql += " f.serie AS numserie, p.cuentaContable AS codmacta, CONCAT(ano, RIGHT(CONCAT('000000',numero),6)) AS numfactu, DATE_FORMAT(f.fecha,'%Y-%m-%d') AS fecfactu,";
        sql += " 0 AS numorden, fp.codigoContable AS codforpa, NULL AS fecvenci, 0.00 AS impvenci, NULL AS fecultco, NULL AS impcobro,";
        sql += " 1 AS agente, NULL AS ctabanc1,";
        sql += " IF( f.empresaId = 15 OR f.empresaId = 16, CONCAT(c.observaciones, ' ', 'RECIBO Nº: ', COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(LPAD(f.numero, 6, 0) AS CHAR(50)),' ')), NULL) AS text33csb,"; 
        sql += " NULL AS text41csb,"; 
        sql += " p.iban AS iban, f.observaciones AS observa,";
        sql += " f.receptorNombre AS nomclien, f.receptorDireccion AS domclien, f.receptorCodPostal AS cpclien, f.receptorPoblacion AS pobclien,";
        sql += " f.receptorProvincia AS proclien, f.receptorNif AS nifclien, 'ES' AS codpais, 0 AS situacion, 1 AS comunicadoServer";
        sql += " FROM facturas AS f";
        sql += " LEFT JOIN  clientes AS p ON p.clienteId = f.clienteId";
        sql += " LEFT JOIN  contratos AS c ON c.contratoId = f.contratoId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = f.formaPagoId";
        sql += " WHERE f.facturaId = ?";
        sql = mysql.format(sql, factura.facturaId);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            if (rows.length == 0) return done(new Error('La factura de proveedor ' + factura.facproveId + ' no se ha encontrado'));
            rows[0].numfactu = rows[0].numfactu.toString();
            rows[0].fecfactu = rows[0].fecfactu.toString();
            done(null, rows[0]);
        })
    },
    getCobrosConModelo: function (factura, modelo, done) {
        var con = comun.getConnection();
        var cobros = [];
        var sql = "SELECT numeroVencimientos, primerVencimiento, restoVencimiento  FROM formas_pago WHERE formaPagoId = ?";
        sql = mysql.format(sql, factura.formaPagoId);
        con.query(sql, function (err, rows) {
            if (err) return done(err);
            if (rows.length == 0) return done(new Error('No se ha encontrado forma de pago ' + factura.formaPagoId));
            var fpago = rows[0];
            // siempre hay un primer vencimiento
            var importeP = factura.restoCobrar / fpago.numeroVencimientos;
            var importeP = Math.round(importeP * 100) / 100;
            var resto = factura.restoCobrar - (importeP * fpago.numeroVencimientos);
            modelo.numorden = 1;
            modelo.fecvenci = moment(factura.fecha).add(fpago.primerVencimiento, 'days').toDate();
            modelo.impvenci = importeP + resto;
            cobros.push(modelo);
            // miramos si hay más vencimientos
            if (fpago.numeroVencimientos > 1) {
                for (var i = 2; i <= fpago.numeroVencimientos; i++) {
                    var modelo2 = JSON.parse(JSON.stringify(modelo));
                    modelo2.numorden = i;
                    modelo2.fecvenci = moment(cobros[i - 2].fecvenci).add(fpago.restoVencimiento, 'days').toDate();
                    modelo2.impvenci = importeP;
                    cobros.push(modelo2);
                }
            }
            if(factura.retenGarantias) {
                sql = "SELECT * FROM parametros as p";
                sql += " INNER JOIN formas_pago as f on f.formapagoId = p.formaPagoGarantiasId"
                con.query(sql, function (err, rows) {
                    con.end();
                    if (err) return done(err);
                    var fpGarantias = rows[0];
                    var importeP = factura.retenGarantias;
                    var importeP = Math.round(importeP * 100) / 100;
                    var modelo3 = JSON.parse(JSON.stringify(modelo));
                    modelo3.codforpa = fpGarantias.codigoContable
                    modelo3.numorden = fpago.numeroVencimientos + 1;
                    modelo3.fecvenci = moment(factura.fecha).add(fpGarantias.primerVencimiento, 'days').toDate();
                    modelo3.impvenci = importeP;
                    cobros.push(modelo3);
                    done(null, cobros);
                })
            } else {
                con.end();
                done(null, cobros);
            }
        });
    },
    getCobrosConModeloAntClien: function (factura, modelo, done) {
        var con = comun.getConnection();
        var cobros = [];
        var sql = "SELECT * FROM formas_pago WHERE formaPagoId = ?";
        sql = mysql.format(sql, factura.formaPagoId);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            if (rows.length == 0) return done(new Error('No se ha encontrado forma de pago ' + fatura.formaPagoId));
            var fpago = rows[0];
            // siempre hay un primer vencimiento
            var importeP = factura.totalConIva / fpago.numeroVencimientos;
            var importeP = Math.round(importeP * 100) / 100;
            var resto = factura.totalConIva - (importeP * fpago.numeroVencimientos);
            modelo.numorden = 1;
            modelo.fecvenci = moment(factura.fecha).add(fpago.primerVencimiento, 'days').toDate();
            modelo.impvenci = importeP + resto;
            cobros.push(modelo);
            // miramos si hay más vencimientos
            if (fpago.numeroVencimientos > 1) {
                for (var i = 2; i <= fpago.numeroVencimientos; i++) {
                    modelo2 = JSON.parse(JSON.stringify(modelo));
                    modelo2.numorden = i;
                    modelo2.fecvenci = moment(cobros[i - 2].fecvenci).add(fpago.restoVencimiento, 'days').toDate();
                    modelo2.impvenci = importeP;
                    cobros.push(modelo2);
                }
            }
            done(null, cobros);
        });
    },

    postCobrosConta: function (cobros, con, factura, done) {
        var connection = comun.getConnection();
        var sql = " SELECT ec.cuentacobro FROM  empresas_cuentaspago AS ec";
        sql += " LEFT JOIN formas_pago AS fp ON fp.tipoFormaPagoId = ec.tipoFormaPagoId";
        sql += " WHERE fp.codigoContable = ? AND ec.empresaId = ?"
        sql = mysql.format(sql, [cobros[0].codforpa, factura.empresaId])
        connection.query(sql, function (err, row) {
            connection.end();
            if (err) return done(err);
            if(row.length == 0) {
                try{
                    var num = factura.serie + "-" + factura.ano + "-" + factura.numero;
                    throw new Error("La Cuenta contable de cobros no existe para la forma de cobro de la factura numero " + num);
                } catch(e) {
                    return done(e);
                }
            }
            // cada cobro va al banco por defecto
            var ctabanc1 = "";
            sql = "SELECT * FROM cuentas WHERE codmacta = " + row[0].cuentacobro;
            con.query(sql, function (err, rows) {
                if(rows.length == 0) {
                    try{
                        var num = factura.serie + "-" + factura.ano + "-" + factura.numero;
                        throw new Error("La Cuenta contable de cobros no existe para la forma de cobro de la factura numero " + num);
                    } catch(e) {
                        return done(e);
                    }
                }
                ctabanc1 = rows[0].codmacta;
                // Y ahora a dar de alta todos los cobros
                async.eachSeries(cobros, function (p, callback) {
                    p.ctabanc1 = ctabanc1;
                    sql = "INSERT INTO cobros SET ?";
                    sql = mysql.format(sql, p);
                    con.query(sql, function (err) {
                        if (err) return callback(err);
                        callback();
                    })
                }, function (err) {
                    if (err) return done(err);
                    done();
                });
            });
        });
    },

    actualizarComoContabilizadaCli: function (factura, done) {
        var con = comun.getConnection();
        var sql = "UPDATE facturas SET contabilizada = 1 WHERE facturaId = ?";
        sql = mysql.format(sql, factura.facturaId);
        con.query(sql, function (err) {
            con.end();
            if (err) return done(err);
            done();
        });
    },
    

    contabilizarAnticiposClientes(anticipos, done) {
        var cuentas = [];
        async.eachSeries(anticipos, function (f, callback) {
            contabilidadApi.comprobarCuentaContableClienteAnticipo(f, function (err, result) {
                if(err) return callback(err);
                if (result) {
                    cuentas.push(result)
                    callback();
                } else {
                    contabilidadApi.contabilizarUnAnticipoCliente(f,function (err) {
                        if (err) return callback(err);
                        callback();
                    });
                }
            });
                    
        }, function (err) {
            if (err) return done(err);
            done(null, cuentas);
        });

    },
    //ANTICIPOS CLIENTES

    getModeloCobroAnticipo: function (antclien, done) {
        var con = comun.getConnection();
        var sql = "SELECT "
        sql += " f.serie AS numserie, p.cuentaContable AS codmacta, CONCAT(ano, RIGHT(CONCAT('000000',numero),6)) AS numfactu, DATE_FORMAT(f.fecha,'%Y-%m-%d') AS fecfactu,";
        sql += " 0 AS numorden, fp.codigoContable AS codforpa, NULL AS fecvenci, 0.00 AS impvenci, NULL AS fecultco, NULL AS impcobro,";
        sql += " 1 AS agente, NULL AS ctabanc1, CONCAT('SERIE: ', f.serie, ' NUMERO: ',ano, RIGHT(CONCAT('000000',numero),6))  AS text33csb, NULL AS text41csb, p.iban AS iban, f.observaciones AS observa,";
        sql += " f.receptorNombre AS nomclien, f.receptorDireccion AS domclien, f.receptorCodPostal AS cpclien, f.receptorPoblacion AS pobclien,";
        sql += " f.receptorProvincia AS proclien, f.receptorNif AS nifclien, 'ES' AS codpais, 0 AS situacion, 1 AS comunicadoServer";
        sql += " FROM antclien AS f";
        sql += " LEFT JOIN  clientes AS p ON p.clienteId = f.clienteId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = f.formaPagoId";
        sql += " WHERE f.antClienId = ?";
        sql = mysql.format(sql, antclien.antClienId);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            if (rows.length == 0) return done(new Error('La anticipo de cliente ' + antclien.antClienId + ' no se ha encontrado'));
            rows[0].numfactu = rows[0].numfactu.toString();
            done(null, rows[0]);
        })
    },

    actualizarComoContabilizadaAntCli: function (antclien, done) {
        var con = comun.getConnection();
        var sql = "UPDATE antclien SET contabilizada = 1 WHERE antClienId = ?";
        sql = mysql.format(sql, antclien.antClienId);
        con.query(sql, function (err) {
            con.end();
            if (err) return done(err);
            done();
        });
    },
    

    contabilizarFacturas(facturas, done) {
        var cuentas = [];
        async.eachSeries(facturas, function (f, callback) {
          
            contabilidadApi.comprobarCuentasCreadasVentas(f, function (err, result) {
                if (err) return callback(err);
                if (result.result) {
                    cuentas.push(result.result)
                    callback();
                } else {
                    contabilidadApi.comprobarCuentaContableCliente(f, result.conta, function (err, result) {
                        if(err) return callback(err);
                        if (result) {
                            cuentas.push(result)
                            callback();
                        } else {
                            contabilidadApi.contabilizarUnaFactura(f,function (err) {
                                if (err) return callback(err);
                                callback();
                            });
                        }
                    });
                }
            });

        }, function (err) {
            if (err) return done(err);
            done(null, cuentas);
        });
    },

    comprobarCuentasCreadasVentas(factura, callback) {
        contabilidadApi.getContaEmpresa(factura.empresaId, function (err, conta) {
            if (err) return done(err);
            var con = comun.getConnectionDb(conta);
            contabilidadApi.getCodmacta(factura.facturaId, function (err, faccontalineas) {
                if (err) return callback(err);
                contabilidadApi.getCuentasLineas(faccontalineas, factura, con,function (err, result) {
                    con.end();
                    if (err) return callback(err);
                    var obj = { conta, result}
                    callback(null, obj);
                });
                
            });
        });
    },
    comprobarCuentaContableCliente(factura, conta, callback) {
        var facconta = [];
            var con = comun.getConnectionDb(conta);
            contabilidadApi.getCodmactaClien(factura, function (err, resultado) {//recuperamos la cuenta contable del cliente
                if (err) return callback(err);
                facconta.push(resultado);
                contabilidadApi.getCuentasLineas(facconta, factura, con,function (err, result) {
                    con.end();
                    if (err) return callback(err);
                    callback(null, result);
                });
                
            });
    },
    comprobarCuentaContableClienteAnticipo(anticipo, callback) {
        var antconta = [];
        contabilidadApi.getContaEmpresa(anticipo.empresaId, function (err, conta) {
            if (err) return callback(err);
            var con = comun.getConnectionDb(conta);
            contabilidadApi.getModeloCobroAnticipo(anticipo, function (err, resultado) {//recuperamos la cuenta contable del cliente
                if (err) return callback(err);
                antconta = resultado;
                contabilidadApi.getCuentaAnticipo(antconta, anticipo, con,function (err, result) {
                    con.end();
                    if (err) return callback(err);
                    callback(null, result);
                });
                
            });
        });
    },
    contabilizarUnAnticipoCliente(anticipo, done) {
        // obtener la contabilidad a la que pertenece la anticipo
        contabilidadApi.getContaEmpresa(anticipo.empresaId, function (err, conta) {
            if (err) return done(err);
            var con = comun.getConnectionDb(conta);
            con.beginTransaction(function (err) {
                if (err) return done(err);
                async.waterfall([
                    // Obtener el modelo de pago
                    function (callback) {
                        contabilidadApi.getModeloCobroAnticipo(anticipo, function (err, modelo) {
                            if (err) return callback(err);
                            callback(null, modelo);
                        })
                    },
                    // Obtener los cobros de esa anticipo
                    function (modelo, callback) {
                        contabilidadApi.getCobrosConModeloAntClien(anticipo, modelo, function (err, cobros) {
                            if (err) return callback(err);
                            callback(null, cobros);
                        })
                    },
                    // Dar de alta los cobros en la contabilidad
                    function (cobros, callback) {
                        contabilidadApi.postCobrosConta(cobros, con, anticipo,function (err) {
                            if (err) return callback(err);
                            callback();
                        })
                    },
                    // Actualizar como contabilizada
                    function (callback) {
                        contabilidadApi.actualizarComoContabilizadaAntCli(anticipo, function (err) {
                            if (err) return callback(err);
                            callback();
                        })
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
    contabilizarUnaFactura(factura, done) {
        // obtener la contabilidad a la que pertenece la factura
        contabilidadApi.getContaEmpresa(factura.empresaId, function (err, conta) {
            if (err) return done(err);
            var con = comun.getConnectionDb(conta);
            con.beginTransaction(function (err) {
                if (err) return done(err);
                async.waterfall([
                    // Obtener la cabecera de factura
                    function (callback) {
                        contabilidadApi.getFact(factura, function (err, facconta) {
                            if (err) return callback(err);
                            facconta.numfactu = facconta.numfactu.toString();
                            callback(null, facconta, factura.facturaId);
                        });
                    },
                    // Dar de alta la cabecera de factura
                    function (facconta, numfactu, callback) {
                        contabilidadApi.postFact(facconta, con, function (err) {
                            if (err) return callback(err);
                            callback(null, numfactu);
                        });
                    },
                    // Obtener las lineas de factura
                    function (numfactu, callback) {
                        contabilidadApi.getFactCliLineas(numfactu, function (err, faccontalineas) {
                            if (err) return callback(err);
                            callback(null, faccontalineas, numfactu);
                        });
                    },
                    // Dar de alta las líneas de factura
                    function (faccontalineas, numfactu, callback) {
                        contabilidadApi.postFactCliLineas(faccontalineas, con, function (err) {
                            if (err) return callback(err);
                            callback(null, numfactu);
                        });
                    },
                    // Obtener los totales de factura
                    function (numfactu, callback) {
                        contabilidadApi.getFactCliTotales(numfactu, function (err, faccontatotales) {
                            if (err) return callback(err);
                            callback(null, faccontatotales);
                        });
                    },
                    // Dar de alta los totales de factura
                    function (faccontatotales, callback) {
                        contabilidadApi.postFactCliTotales(faccontatotales, con, function (err) {
                            if (err) return callback(err);
                            callback();
                        });
                    },
                    // Obtener el modelo de pago
                    function (callback) {
                        if(factura.restoCobrar == 0) return callback(null, null);// si el  cobro es cero no hacemos nada
                        contabilidadApi.getModeloCobro(factura, function (err, modelo) {
                            if (err) return callback(err);
                            callback(null, modelo);
                        })
                    },
                    // Obtener los cobros de esa factura
                    function (modelo, callback) {
                        if(!modelo)  return callback(null, null);// si no hay modelo no hacemos nada
                        contabilidadApi.getCobrosConModelo(factura, modelo, function (err, cobros) {
                            if (err) return callback(err);
                            callback(null, cobros);
                        })
                    },
                    // Dar de alta los cobros en la contabilidad
                    function (cobros, callback) {
                        if(!cobros) return callback();// si no hay cobro no hacemos nada
                        contabilidadApi.postCobrosConta(cobros, con, factura,function (err) {
                            if (err) return callback(err);
                            callback();
                        })
                    },
                    // Actualizar como contabilizada
                    function (callback) {
                        contabilidadApi.actualizarComoContabilizadaCli(factura, function (err) {
                            if (err) return callback(err);
                            callback();
                        })
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

    getModeloPagoAnt: function (factura, done) {
        var con = comun.getConnection();
        var sql = "SELECT"
        sql += " 9 AS numserie, p.cuentaContable AS codmacta, numeroAnticipoProveedor AS numfactu, DATE_FORMAT(f.fecha,'%Y-%m-%d') AS fecfactu,";
        sql += " 0 AS numorden, fp.codigoContable AS codforpa, NULL AS fecefect, 0 AS impefect, NULL AS fecultpa, NULL AS imppagad,";
        sql += " NULL AS ctabanc1, NULL AS text1csb, NULL AS text2csb, p.iban AS iban, f.observaciones AS observa,";
        sql += " f.emisorNombre AS nomprove, f.emisorDireccion AS domprove, f.emisorCodPostal AS cpprove, f.emisorPoblacion AS pobprove, 1 AS comunicadoServer,";
        sql += " f.emisorProvincia AS proprove, f.emisorNif AS nifprove, 'ES' AS codpais, 0 AS situacion, CONCAT('Anticipo Nº ',numeroAnticipoProveedor,' de fecha ', DATE_FORMAT(fecha,'%d-%m-%Y')) as text1csb";
        sql += " FROM antprove AS f";
        sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = f.formaPagoId";
        sql += " WHERE f.antproveId = ?";
        sql = mysql.format(sql, factura.antproveId);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            if (rows.length == 0) return done(new Error('La factura de proveedor ' + fatura.antproveId + ' no se ha encontrado'));
            //rows[0].fecfactu = moment(rows[0].fecfactu, "YYYY-MM-DD HH:mm:ss",true).format("YYYY-MM-DD");
            done(null, rows[0]);
        })
    },
    getPagosConModeloAnt: function (factura, modelo, done) {
        var con = comun.getConnection();
        var pagos = [];
        var sql = "SELECT * FROM formas_pago WHERE formaPagoId = ?";
        sql = mysql.format(sql, factura.formaPagoId);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            if (rows.length == 0) return done(new Error('No se ha encontrado forma de pago ' + fatura.formaPagoId));
            var fpago = rows[0];
            // siempre hay un primer vencimiento
            var importeP = factura.totalConIva / fpago.numeroVencimientos;
            var importeP = Math.round(importeP * 100) / 100;
            var resto = factura.totalConIva - (importeP * fpago.numeroVencimientos);
            modelo.numorden = 1;
            modelo.fecefect = moment(factura.fecha).add(fpago.primerVencimiento, 'days').toDate();
            modelo.impefect = importeP + resto;
            pagos.push(modelo);
            // miramos si hay más vencimientos
            if (fpago.numeroVencimientos > 1) {
                for (var i = 2; i <= fpago.numeroVencimientos; i++) {
                    modelo2 = JSON.parse(JSON.stringify(modelo));
                    modelo2.numorden = i;
                    modelo2.fecefect = moment(pagos[i - 2].fecefect).add(fpago.restoVencimiento, 'days').toDate();
                    modelo2.impefect = importeP;
                    pagos.push(modelo2);
                }
            }
            done(null, pagos);
        });
    },
    postPagosContaAnt: function (pagos, con, factura, done) {
        var connection = comun.getConnection();
        var sql = " SELECT ec.cuentapago FROM  empresas_cuentaspago AS ec";
        sql += " LEFT JOIN formas_pago AS fp ON fp.tipoFormaPagoId = ec.tipoFormaPagoId";
        sql += " WHERE fp.codigoContable = ? AND ec.empresaId = ?"
        sql = mysql.format(sql, [pagos[0].codforpa, factura.empresaId])
        connection.query(sql, function (err, row) {
            connection.end();
            if (err) return done(err);
            if(row.length == 0) {
                try{
                    var num = factura.numeroAnticipoProveedor;
                    throw new Error("La Cuenta contable de pagos no existe para la forma de pago del anticipo numero " + num);
                } catch(e) {
                    return done(e);
                }
            }
            // cada pago va al banco por defecto
            var ctabanc1 = "";
            sql = "SELECT * FROM cuentas WHERE codmacta = " + row[0].cuentapago;
            con.query(sql, function (err, rows) {
                if(rows.length == 0) {
                    try{
                        var num = factura.numeroAnticipoProveedor;
                        throw new Error("La Cuenta contable de pagos no existe para la forma de pago del anticipo numero " + num);
                    } catch(e) {
                        return done(e);
                    }
                }
                ctabanc1 = rows[0].codmacta;
                // Y ahora a dar de alta todos los pagos
                async.eachSeries(pagos, function (p, callback) {
                    p.ctabanc1 = ctabanc1;
                    sql = "INSERT INTO pagos SET ?";
                    sql = mysql.format(sql, p);
                    con.query(sql, function (err) {
                        if (err) return callback(err);
                        callback();
                    })
                }, function (err) {
                    if (err) return done(err);
                    done();
                });
            });
        });
    }, 
    actualizarComoContabilizadaAnt: function (factura, done) {
        var con = comun.getConnection();
        var sql = "UPDATE antprove SET contabilizada = 1 WHERE antproveId = ?";
        sql = mysql.format(sql, factura.antproveId);
        con.query(sql, function (err) {
            con.end();
            if (err) return done(err);
            done();
        });
    },

    updateSel: function(id, done) {
        var con = comun.getConnection();
        var sql = "UPDATE facprove SET sel = 0 WHERE facproveId = ?";
        sql = mysql.format(sql, id);
        con.query(sql, function (err) {
            con.end();
            if (err) return done(err);
            done();
        });
    },

    //ANTICIPOS PROVEEDORES
    // Obtiene el anticipo de la gestión con los campos necesarios para darla de alta
    // ene la contabilidad
    /* getAntPro: function (factura, numregis, done) {
        var con = comun.getConnection();
        var sql = "SELECT";
        sql += " 1 AS numserie, ? AS numregis, f.fecha_recepcion AS fecharec, f.numeroAnticipoProveedor AS numfactu,";
        sql += " f.fecha AS fecfactu, 0 AS codconce340, 0 AS codopera, f.fecha_recepcion AS fecliqpr,";
        sql += " p.cuentaContable AS codmacta, f.ano AS anofactu, fp.codigoContable AS codforpa, CONCAT('REFERENCIA: ',f.ref,' ',COALESCE(f.observaciones, ' ')) AS observa,";
        sql += " b.bases AS totbases, b.cuotas AS totivas, f.totalConIva AS totfacpr, ";
        sql += " f.porcentajeRetencion AS retfacpr,";
        sql += " f.emisorNombre AS nommacta, f.emisorDireccion AS dirdatos, f.emisorCodPostal AS codpobla, f.emisorPoblacion AS despobla,";
        sql += " f.emisorProvincia AS desprovi, f.emisorNif AS nifdatos, 'ES' AS codpais, NULL AS codintra,";
        sql += " fr.totRet AS trefacpr, fr.baseRet AS totbasesret, fr.porRet AS retfacpr, fr.codRet AS tiporeten, fr.cuenRet  AS cuereten"
        sql += " FROM antprove AS f"
        sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId";
        sql += " LEFT JOIN formas_pago AS fp ON fp.formaPagoId = f.formaPagoId"; 
        sql += " LEFT JOIN (SELECT antproveId, SUM(base) AS bases, SUM(cuota) AS cuotas FROM antprove_bases GROUP BY antproveId) AS b ON b.antProveId = f.antproveId";

        sql += " LEFT JOIN (SELECT antproveId, importeRetencion AS totRet, baseRetencion AS baseRet, porcentajeRetencion AS porRet,";
        sql += " codigoRetencion AS codRet, cuentaRetencion AS cuenRet FROM antprove_retenciones) AS fr ON fr.antProveId = f.antproveId";


        sql += " LEFT JOIN parametros AS prm ON 1=1";
        sql += " WHERE f.antproveId = ?";
        sql = mysql.format(sql, [numregis, factura.antproveId]);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            if (rows.length == 0) return done(new Error('No se ha encontrado la factura de proveedor ' + factura.antproveId));
            var result;
            if(rows.length > 1) {
                for(var i=0; i < rows.length; i++){
                    if(rows[i].retfacpr > 0) {
                        result = rows[i];
                        break;
                    }
                }
            }else {
                result = rows[0]
            }
            if(result.retfacpr == 0) {
                result.totbasesret = null;
                result.trefacpr = null;
                result.totbasesret = null;
                result.retfacpr = null;
                result.cuereten = null
            }
            if(result.tiporeten == null) {
                result.tiporeten = 0;
            }
            done(null, result);
        });
    },
    postAntPro: function (factura, con, done) {
        var sql = "INSERT INTO factpro SET ?";
        sql = mysql.format(sql, factura);
        con.query(sql, function (err, row) {
            if (err) return done(err);
            done(null);
        });
    },
    getAntProLineas: function (factura, numregis, done) {
        var con = comun.getConnection();
        var sql = "SELECT";
        sql += " 1 AS numserie, ? AS numregis, f.fecha_recepcion AS fecharec, f.ano AS anofactu, fl.antproveLineaId AS numlinea,  fl.porcentajeRetencion,";
        sql += " ga.cuentacompras AS codmacta, fl.totalLinea AS baseimpo, tp.codigoContable AS codigiva, fl.porcentaje AS porciva, 0 AS porcrec,";
        sql += " ROUND((fl.totalLinea * fl.porcentaje) / 100.0, 2) AS impoiva, 0 AS imporec, 0 AS aplicret, NULL AS codccost";
        sql += " FROM antprove_lineas AS fl";
        sql += " LEFT JOIN antprove AS f ON f.antproveId = fl.antproveId";
        sql += " LEFT JOIN articulos AS a ON a.articuloId = fl.articuloId"
        sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoArticuloId = a.grupoArticuloId";
        sql += " LEFT JOIN tipos_iva AS tp ON tp.tipoIvaId = fl.tipoIvaId";
        sql += " WHERE f.antproveId = ?";
        sql = mysql.format(sql, [numregis, factura.antproveId]);
        con.query(sql, function (err, rows) {
            con.end();
            for(var j=0; j < rows.length; j++) {
                if(rows[j].porcentajeRetencion > 0){//evaluamos si hay retencion
                    rows[j].aplicret = 1;
                    delete rows[j].porcentajeRetencion//como la propiedad no existe en la tabla que vamos a actualizar la eliminamos
                } else {
                   delete rows[j].porcentajeRetencion
                }
            }
            if (err) return done(err);
            done(null, rows);
        });
    },
    postAntProLineas: function (facturas, con, done) {
        async.eachSeries(facturas, function (f, callback) {
            var sql = "INSERT INTO antpro_lineas SET ?";
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
    getAntProTotales: function (factura, numregis, done) {
        var con = comun.getConnection();
        var sql = "SELECT";
        sql += " 1 AS numserie, ? AS numregis, f.fecha_recepcion AS fecharec, f.ano AS anofactu, fb.antproveBaseId AS numlinea,";
        sql += " fb.base AS baseimpo, tp.codigoContable AS codigiva, tp.porcentaje AS porciva, 0 AS porcrec, fb.cuota AS impoiva, 0 AS imporec";
        sql += " FROM antprove_bases AS fb";
        sql += " LEFT JOIN antprove AS f ON f.antproveId = fb.antproveId";
        sql += " LEFT JOIN tipos_iva AS tp ON tp.tipoIvaId = fb.tipoIvaId";
        sql += " WHERE f.antproveId = ?";
        sql = mysql.format(sql, [numregis, factura.antproveId]);
        con.query(sql, function (err, rows) {
            con.end();
            if (err) return done(err);
            done(null, rows);
        });
    },
    postAntProTotales: function (facturas, con, done) {
        async.eachSeries(facturas, function (f, callback) {
            var sql = "INSERT INTO antpro_totales SET ?";
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
    
 */
}






module.exports = contabilidadApi;
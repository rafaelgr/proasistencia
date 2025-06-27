// tipos_profesional_db_mysql
// Manejo de la tabla tipos_profesional de la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var mysql2 = require("mysql2/promise"); // librería para el acceso a bases de datos MySQL2
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
var comun = require("../comun/comun");
var contabilidadDb = require("../contabilidad/contabilidad_db_mysql");
var numeral = require("numeral");

// ponemos numeral en español
numeral.language('es', comun.numeralSpanish());
numeral.language('es');

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


// comprobarTipoProfesional
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarTipoProfesional(tipoProfesional) {
    // debe ser objeto del tipo que toca
    var comprobado = "object" === typeof tipoProfesional;
    // en estas propiedades no se admiten valores nulos
    comprobado = (comprobado && tipoProfesional.hasOwnProperty("tipoProfesionalId"));
    comprobado = (comprobado && tipoProfesional.hasOwnProperty("nombre"));
    return comprobado;
}


// getTipoProfesionales
// lee todos los registros de la tabla tipoProfesionales y
// los devuelve como una lista de objetos
module.exports.getTiposProfesionales = function (callback) {
    var connection = comun.getConnection();
    var tiposProfesionales = null;
    sql = "SELECT * FROM tipos_profesionales";
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        tiposProfesionales = result;
        callback(null, tiposProfesionales);
    });
}

// getTipoProfesionalesBuscar
// lee todos los registros de la tabla tipoProfesionales cuyo
// nombre contiene la cadena de búsqueda. Si la cadena es '*'
// devuelve todos los registros
module.exports.getTiposProfesionalesBuscar = function (nombre, callback) {
    var connection = comun.getConnection();
    var tipoProfesionales = null;
    var sql = "SELECT * from tipos_profesionales";
    if (nombre !== "*") {
        sql = "SELECT * from tipos_profesionales";
        sql += "  WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        tipoProfesionales = result;
        callback(null, tipoProfesionales);
    });
}

// getTipoProfesional
// busca  el tipoProfesional con id pasado
module.exports.getTipoProfesional = function (id, callback) {
    var connection = comun.getConnection();
    var TipoProfesionales = null;
    sql = "SELECT * from tipos_profesionales";
    sql += "  WHERE tipoProfesionalId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result[0]);
    });
}


module.exports.getTiposProfesionalesDepartamentos = function (nombre, callback) {
    var connection = comun.getConnection();
    var TipoProfesionales = null;
    
    let sql = "SELECT t.*, d.departamentoId, d.nombre AS departamentoNombre from tipos_profesionales AS t";
    sql += " LEFT JOIN profesiones_departamentos as pd ON pd.tipoProfesionId = t.tipoProfesionalId";
    sql += " LEFT JOIN departamentos as d on d.departamentoId = pd.departamentoId"
    if(nombre != "*") {
       sql += "  WHERE nombre LIKE ?";
        sql = mysql.format(sql, '%' + nombre + '%');
    }
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        let r = ProcesaDocumentosObj(result);
        callback(null, r);
    });
}
var ProcesaDocumentosObj = function(doc) {
	//if((doc.length == 1 && !doc[0].departamentoId) || (doc.length == 1 && !doc[0].antproveId)) return doc;
	var antdoc = null;
	var cont = 1;
	var regs = [];
	var depObj = {
		
	};

	var tipObj = {
		
	};

	doc.forEach(d => {
		//el primer registro siempre se procesa
		if(antdoc) {
			// si se trata de el mismo documento de pago solo adjuntamos la factura
			if(antdoc == d.tipoProfesionalId ) {
				if(d.departamentoId) {//procesamos las departamentos
					depObj = {
						departamentoId: d.departamentoId,
						nombreDepartamento: d.departamentoNombre
					};
					
					tipObj.departamentos.push(depObj);
					depObj = {}; //una vez incluida la factura en el documento se limpian los datos
				}

				
				
			} else  {
				//si es otro documento de pago guardamos el anterior y creamos otro
				regs.push(tipObj);
				tipObj = {
					tipoProfesionalId: d.tipoProfesionalId,
				    nombre: d.nombre,
				    departamentos: []
				};
				if(d.departamentoId) {//procesamos las departamentos
					depObj = {
						departamentoId: d.departamentoId,
						nombreDepartamento: d.departamentoNombre
					};
					tipObj.departamentos.push(depObj);
					depObj = {}; //una vez incluida la factura en el documento se limpian los datos
				}

			
				antdoc = d.tipoProfesionalId;
			} 

		}
		if(!antdoc) {
			tipObj = {
				tipoProfesionalId: d.tipoProfesionalId,
				nombre: d.nombre,
				departamentos: []
			};
			if(d.departamentoId) {//procesamos las departamentos
				depObj = {
					departamentoId: d.departamentoId,
					nombreDepartamento: d.departamentoNombre
				};
				tipObj.departamentos.push(depObj);
				depObj = {}; //una vez incluida la factura en el documento se limpian los datos
			}
			
			antdoc = d.tipoProfesionalId;
		}

		//si se trata del ultimo registro lo guardamos
		if(cont == doc.length) {
			regs.push(tipObj);
		}
		cont++;
	});

	return regs;
}

module.exports.getTipoProfesionalDepartamentos = function (id, callback) {
    var connection = comun.getConnection();
    var TipoProfesionales = null;
    
    let sql = "SELECT t.*, d.nombre AS departamentoNombre, d.departamentoId from tipos_profesionales AS t";
    sql += " LEFT JOIN profesiones_departamentos as pd ON pd.tipoProfesionId = t.tipoProfesionalId";
    sql += " LEFT JOIN departamentos as d on d.departamentoId = pd.departamentoId"
    sql += "  WHERE t.tipoProfesionalId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result);
    });
}


module.exports.getTipoProfesionalesDepartamento = function (id, callback) {
    var connection = comun.getConnection();
    var TipoProfesionales = null;
    
    let sql = "SELECT t.* from tipos_profesionales AS t";
    sql += " LEFT JOIN profesiones_departamentos as pd ON pd.tipoProfesionId = t.tipoProfesionalId";
    sql += "  WHERE pd.departamentoId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result);
    });
}

// getTipoProfesional
// busca  el tipoProfesional con id pasado
module.exports.getTipoProfesionalTarifaProveedor = function (id, callback) {
    var connection = comun.getConnection();
    var TipoProfesionales = null;
    sql = "SELECT DISTINCT tp.tipoProfesionalId, tp.nombre FROM `tarifas_proveedor_lineas` AS tpl";
    sql += " LEFT JOIN articulos AS ar ON ar.articuloId = tpl.articuloId";
    sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = ar.tipoProfesionalId"
    if(id > 0) {
        sql += "  WHERE tpl.tarifaProveedorId = ?";
        sql = mysql.format(sql, id);
    }
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err, null);
        }
        if (result.length == 0) {
            return callback(null, null);
        }
        callback(null, result);
    });
}

// getTiposProfesionalesIndice
// busca los tipos profesionales de un indice corrector
module.exports.getTiposProfesionalesIndice = async (id) => {
    let connection = null;
    let sql = "";
    return new Promise(async (resolve, reject) => {
		try {
			connection = await mysql2.createConnection(obtenerConfiguracion());
            sql = "SELECT tp.* FROM indicecorrector_profesiones AS ic";
            sql += " LEFT JOIN tipos_profesionales as tp ON tp.tipoProfesionalId = ic.tipoProfesionalId"
            sql += "  WHERE ic.indiceCorrectorId = ?";
            sql = mysql2.format(sql, id);
            const [result] = await connection.query(sql);
            await connection.end(); 
            //if(result.length == 0) return resolve(null);
            resolve(result);
        } catch(err) {
			if(connection) {
				if (!connection.connection._closing) {
					await connection.end();
				} 
			}
			reject(err)
		}
    });

}


// postTipoProfesional
// crear en la base de datos el tipoProfesional pasado
module.exports.postTipoProfesional = function (tipoProfesional, departamentos, callback) {
    if (!comprobarTipoProfesional(tipoProfesional)) {
        var err = new Error("El tipo de via pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    var connection = comun.getConnection();
    tipoProfesional.tipoProfesionalId = 0; // fuerza el uso de autoincremento
    sql = "INSERT INTO tipos_profesionales SET ?";
    sql = mysql.format(sql, tipoProfesional);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        tipoProfesional.tipoProfesionalId = result.insertId;
        if(departamentos) {
            updateDepartamentosAsociados(departamentos.departamentos, result.insertId, function (err) {
				if (err){
					callback(err);
				}
				 callback(null, tipoProfesional);
			});

        } else {
              callback(null, tipoProfesional);
        }
    });
}

// putTipoProfesional
// Modifica el tipoProfesional según los datos del objeto pasao
module.exports.putTipoProfesional = function (id, tipoProfesional, departamentos, callback) {
    if (!comprobarTipoProfesional(tipoProfesional)) {
        var err = new Error("El tipo de IVA pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
        return callback(err);
    }
    if (id != tipoProfesional.tipoProfesionalId) {
        var err = new Error("El ID del objeto y de la url no coinciden");
        return callback(err);
    }
    var connection = comun.getConnection();
    sql = "UPDATE tipos_profesionales SET ? WHERE tipoProfesionalId = ?";
    sql = mysql.format(sql, [tipoProfesional, tipoProfesional.tipoProfesionalId]);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        if(departamentos) {
            updateDepartamentosAsociados(departamentos.departamentos, tipoProfesional.tipoProfesionalId, function (err) {
				if (err){
					callback(err);
				}
				 callback(null, tipoProfesional);
			});

        } else {
              callback(null, tipoProfesional);
        }
    });
}

// deleteTipoProfesional
// Elimina el tipoProfesional con el id pasado
module.exports.deleteTipoProfesional = function (id, callback) {
    var connection = comun.getConnection();
    sql = "DELETE from tipos_profesionales WHERE tipoProfesionalId = ?";
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) {
            return callback(err);
        }
        callback(null);
    });
}


// borraTipoProfesionalConta
// cuando se elimina un tipo de iva en la gestión también hay que darlo
// de baja en las diferentes contabilidades
var borraTipoProfesionalConta = function (id, done) {
    // hay que buscar primero el tipo de iva para sacar su código contable
    var connection = comun.getConnection();
    var sql = "SELECT * FROM tipos_profesionales WHERE tipoProfesionalId = ?";
    var codigoContable = null;
    sql = mysql.format(sql, id);
    connection.query(sql, function (err, result) {
        comun.closeConnection(connection);
        if (err) return done(err);
        codigoContable = result[0].codigoContable;
        // ahora ya podemos borrar el de contabilidad
        contabilidadDb.getInfContable(function (err, result) {
            if (err) return done(err);
            var infContable = result;
            var dbContas = [];
            for (var i = 0; i < infContable.contas.length; i++) {
                dbContas.push(infContable.contas[i].contabilidad);
            }
            async.each(dbContas, function (conta, callback) {
                var connection = comun.getConnectionDb(conta)
                var sql = "DELETE FROM cuentas"
                sql += " WHERE codmacta LIKE '477%" + codigoContable + "'";
                sql += " OR codmacta LIKE '472%" + codigoContable + "'";
                connection.query(sql, function (err) {
                    if (err) return callback(err);
                    var connection = comun.getConnectionDb(conta);
                    var sql = "DELETE FROM tiposiva WHERE codigiva = ?"
                    sql = mysql.format(sql, codigoContable);
                    connection.query(sql, function (err) {
                        comun.closeConnection(connection);
                        if (err) return callback(err);
                        callback();
                    })
                });
            }, function (err) {
                if (err) return done(err);
                done();
            });
        });
    });

}

var updateDepartamentosAsociados = function (departamentos, tipoProfesionId, done) {
    //primero borramos todos las profesiones asociadas al proveedor
    var connection = comun.getConnection();
   
    var sql = "DELETE FROM profesiones_departamentos WHERE tipoProfesionId = ?";
    sql = mysql.format(sql, tipoProfesionId);
    connection.query(sql, function (err, result) {
        //asociamos ahora las profesiones al proveedor
        async.forEachSeries(departamentos, function (departamento, callback) {
            var proveedor_profesiones = {
                profesionDepartamentoId: 0,
                departamentoId: departamento,
                tipoProfesionId: tipoProfesionId
            }
            sql = "INSERT INTO profesiones_departamentos  SET ?";
            sql = mysql.format(sql,  proveedor_profesiones);
            connection.query(sql, function (err) {
                if (err) return callback(err);
                callback();
            })
        }, function (err) {
            if(connection) connection.end();
            if (err) return done(err);
            done();
        });
        
    });
    
}
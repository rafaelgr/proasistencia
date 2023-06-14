var mysql2 = require('mysql2/promise');
    

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

module.exports.getDocumentacionOferta = async (ofertaId, departamentoId, contratoId) => {
    let con = null;
    var documentos = null;
    var carpetas = null
    var sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            sql = "SELECT carpetaId, nombre As carpetaNombre, tipo";
            sql += " FROM carpetas";
            sql += " WHERE";
            sql += " (tipo = 'oferta' AND departamentoId = " +  departamentoId + ")";
            if(contratoId > 0) {
                sql += " OR  (tipo = 'contrato' AND departamentoId = " +  departamentoId + ")";
            }
            sql += " ORDER BY tipo, nombre"
            const [carpe] = await con.query(sql);
            carpetas = carpe;
            sql = "SELECT of.documentoId,";
            sql += " of.contratoId,";
            sql += " of.ofertaId,";
            sql += " of.carpetaId,";
            sql += " of.location,";
            sql += " of.key";
            sql += " FROM documentacion AS of";
            sql += " WHERE";
            if(ofertaId > 0) {
                sql += " of.ofertaId = " + ofertaId
            }
            if(contratoId > 0) {
                sql += " OR of.contratoId = " + contratoId;
            }
            const [docum] = await con.query(sql);
            if(docum.length > 0) { 
				documentos = docum;
				documentos = ProcesaDocumObj(documentos, carpetas);
                await con.end();
                resolve(documentos);
			}else {
               await con.end();
               resolve(carpetas)
            }
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


module.exports.getDocumentacionContrato = async (ofertaId, departamentoId, contratoId) => {
    let con = null;
    var documentos = null;
    var carpetas = null
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            var sql = "SELECT carpetaId, nombre As carpetaNombre, tipo";
            sql += " FROM carpetas";
            sql += " WHERE";
            sql += " (tipo = 'contrato' AND departamentoId = " +  departamentoId + ")";
            if(ofertaId > 0) {
                sql += " OR  (tipo = 'oferta' AND departamentoId = " +  departamentoId + ")";
            }
            sql += " ORDER BY tipo, nombre"
            const [carpe] = await con.query(sql);
            carpetas = carpe;
            sql = "SELECT of.documentoId,";
            sql += " of.contratoId,";
            sql += " of.ofertaId,";
            sql += " of.carpetaId,";
            sql += " of.location,";
            sql += " of.key";
            sql += " FROM documentacion AS of";
            sql += " WHERE";
            if(contratoId > 0) {
                sql += " of.contratoId = " + contratoId
            }
            if(ofertaId > 0) {
                sql += " OR of.ofertaId = " + ofertaId;
            }
            const [docum] = await con.query(sql);
            if(docum.length > 0) { 
				documentos = docum;
				documentos = ProcesaDocumObj(documentos, carpetas);
                await con.end();
                await con.end();
                //buscamos las que cartpetas de las recuperadas tiene subcarpetas
                for(let d of documentos){
                   sql = "SELECT * FROM carpeta_subcarpetas AS cs";
                   sql += " INNER JOIN carpetas as c ON c.carpetaId = cs.carpetaId"
                }
                resolve(documentos)
			}else {
                await con.end();
               resolve(carpetas)
            }
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


module.exports.getDocumentacionReparaciones = async (ofertaId, parteId, contratoId) => {
    let con = null;
    var documentos = null;
    var carpetas = null
    var sql = "";
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            sql = "SELECT carpetaId, nombre As carpetaNombre, tipo";
            sql += " FROM carpetas";
            sql += " WHERE (tipo = 'parte' AND departamentoId = 7)";
            if(ofertaId > 0) {
                sql += " OR  (tipo = 'oferta' AND departamentoId = 7)";
            }
            if(contratoId > 0) sql += " OR (tipo = 'contrato' AND departamentoId = 7)"
            sql += " ORDER BY tipo, nombre"
            const [carpe] = await con.query(sql);
            carpetas = carpe;
            sql = "SELECT of.documentoId,";
            sql += " of.contratoId,";
            sql += " of.ofertaId,";
            sql += " of.parteId,";
            sql += " of.carpetaId,";
            sql += " of.location,";
            sql += " of.key";
            sql += " FROM documentacion AS of";
            sql += " WHERE of.parteId = " + parteId;
            if(ofertaId > 0) {
                sql +=   " OR of.ofertaId = " + ofertaId;
            }
            if(contratoId > 0) {
                sql += " OR of.contratoId = " + contratoId;
            }
         
            const [docum] = await con.query(sql);
            if(docum.length > 0) { 
				documentos = docum;
				documentos = ProcesaDocumObj(documentos, carpetas);
                await con.end();
                resolve(documentos);
			}else {
				carpetas.forEach(e => {
					e.documentos = []
				});
               await con.end();
               resolve(carpetas)
            }
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

module.exports.getContratoOferta = async (ofertaId) => {
    let con = null;
    var documentos = null;
    var carpetas = null
    var sql = "";
    var contratoId = 0;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            sql = " SELECT contratoId from contratos WHERE ofertaId = " + ofertaId;
            const [contrato] = await con.query(sql);
            if(contrato.length > 0) contratoId = contrato[0].contratoId;
            await con.end();
            resolve(contratoId)

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



module.exports.getDocumento = async (documentoId) => {
    let con = null;
    var documento = null;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            var sql = "SELECT *";
            sql += " FROM documentacion";
            sql += " WHERE documentoId = " + documentoId;
            const [docum] = await con.query(sql);
            await con.end();
            if(docum.length > 0) { 
				documento = docum[0];
			}
            resolve(documento)

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


module.exports.getDocumentosCarpeta = async (carpetaId) => {
    let con = null;
    var documentos = null;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            var sql = "SELECT *";
            sql += " FROM documentacion";
            sql += " WHERE carpetaId = " + carpetaId;
            const [docums] = await con.query(sql);
            await con.end();
            if(docums.length > 0) { 
				documentos = docums;
			}
            resolve(documentos)

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

module.exports.postDocumentacion = async (documentacion) => {
    let con = null;
    var sql;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            sql = "INSERT INTO documentacion SET ?";
            sql = mysql2.format(sql, documentacion);
            const [result] = await con.query(sql);
            await con.end();
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

module.exports.putDocumentacion = async (documentacion, id) => {
    let con = null;
    var sql;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            sql = "UPDATE documentacion SET ? WHERE documentoId = ?";
            sql = mysql2.format(sql, [documentacion, id]);
            const [result] = await con.query(sql);
            await con.end();
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



module.exports.postDocumentacionCarpeta = async (carpeta) => {
    let con = null;
    var sql;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            sql = "INSERT INTO carpetas SET ?";
            sql = mysql2.format(sql, carpeta);
            const [result] = await con.query(sql);
            await con.end();
            resolve(result);

        } catch(e) {
            if(con) {
                if (!con.connection._closing) {
                    await con.end();
                } 
            }
            if(e.errno == 1062) {
                e.message = 'NO SE PUEDE CREAR, CARPETA DUPLICADA';
                reject(e.message);
            } else {
                reject (e);
            }
        }
    });
}

module.exports.deleteDocumentacion = async (id) => {
    let con = null;
    var sql;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            sql = "DELETE from documentacion WHERE documentoId = ?";
            sql = mysql2.format(sql, id);
            const [result] = await con.query(sql);
            await con.end();
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


module.exports.deleteCarpeta = async (id) => {
    let con = null;
    var sql;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            await con.beginTransaction();
            //primero recuperamos la carpeta que vamos a borrar
            sql = "SELECT * FROM carpetas WHERE carpetaId = ?";
            sql = mysql2.format(sql, id);
            const [result] = await con.query(sql);
            //borramos los docuemntos de la carpeta
            sql = "DELETE FROM documentacion WHERE carpetaId = ?";
            sql = mysql2.format(sql, id);
            const [result2] = await con.query(sql);

            //borramos la carpeta
            sql = "DELETE FROM carpetas WHERE carpetaId = ?";
            sql = mysql2.format(sql, id);
            const [result3] = await con.query(sql);

            //borramos las posibles subcarpetas
            sql = "DELETE FROM carpetas WHERE nombre like ?";
            sql = mysql2.format(sql, result[0].nombre + '/%');
            const [result4] = await con.query(sql);

            await con.commit();
			await con.end();
            if(result.length > 0) {
                resolve(result[0]);
            } else {
                resolve(null)
            }
            

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
				if(e.documentoId) {//procesamos las facturas
					docObj = {
                        documentoId: e.documentoId,
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
                    tipo: d.tipo,
					documentos: [],
				};
				if(e.documentoId) {//procesamos las facturas
					docObj = {
                        documentoId: e.documentoId,
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
                tipo: d.tipo,
				documentos: [],
			};
			if(e.documentoId) {
				docObj = {
                    documentoId: e.documentoId,
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
        

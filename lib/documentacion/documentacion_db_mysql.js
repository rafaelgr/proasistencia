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
    var ids = [];
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            var sql = "SELECT c.carpetaId, c.nombre AS carpetaNombre, c.tipo, cb.carpetaId AS carpetaPadreId";
            sql += " FROM carpetas AS c";
            sql += " LEFT JOIN `carpeta_subcarpetas` AS cb ON cb.subcarpetaId = c.carpetaId";
            sql += " WHERE";
            sql += " (c.tipo = 'contrato' AND c.departamentoId = " +  departamentoId + ")";
            if(ofertaId > 0) {
                sql += " OR  (c.tipo = 'oferta' AND c.departamentoId = " +  departamentoId + ")";
            }
            sql += " ORDER BY c.tipo, c.nombre"
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
				documentos = ProcesaDocumObjTree(documentos, carpetas);
                resolve(documentos);
                //await con.end();
                //buscamos que cartpetas de las recuperadas tiene subcarpetas
                /* documentos.forEach( function(d)  {
                    ids.push(d.carpetaId)
                    d.subcarpetas = [];
                    d.eliminar = 0;
                });
                */
                   /*  sql = "SELECT cs.* FROM carpeta_subcarpetas AS cs";
                    sql += " LEFT JOIN carpetas AS c ON c.carpetaId = cs.carpetaId";
                    sql += " WHERE cs.carpetaId IN (" + ids + ")";
                    const [subC] = await con.query(sql);
                    if(subC.length > 0) {
                        documentos = ProcesaSubcarpetaObj(documentos, subC);
                        resolve(documentos);
                    } else {
                        resolve(documentos);
                    } */
			}else {
                if(carpetas.length > 0) {
                    carpetas = ProcesaCarpObjTree(carpetas);
                }
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


module.exports.postDocumentacionCarpetaSubcarpeta = async (carpeta, parent) => {
    let con = null;
    var sql;
    var id = null;
    return new Promise(async (resolve, reject) => {
        try {
            con = await mysql2.createConnection(obtenerConfiguracion());
            await con.beginTransaction();
            sql = "INSERT INTO carpetas SET ?";
            sql = mysql2.format(sql, carpeta);
            const [result] = await con.query(sql);
            id = result.insertId
            var data = {
                carpetaSubcarpetaId: 0,
                carpetaId: parent,
                subcarpetaId: id
            }
            sql = "INSERT INTO carpeta_subcarpetas  SET ?";
            sql = mysql2.format(sql, data);
            const [result2] = await con.query(sql);
            await con.commit();
			await con.end();
            resolve(result);

        } catch(e) {
            if(con) {
                if (!con.connection._closing) {
                    await con.rollback();
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
    var ids = [];
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

            //buscamos las posibles subcarpetas
            sql = "SELECT *  FROM carpetas WHERE nombre like ?";
            sql = mysql2.format(sql, result[0].nombre + '/%');
            const [result4] = await con.query(sql);
            var i = parseInt(id)
            ids.push(i);
            if(result4.length > 0) {
                result4.forEach( e=> {
                    ids.push(e.carpetaId);
                })
            }

            //borramos las posibles subcarpetas
            sql = "DELETE FROM carpetas WHERE nombre like ?";
            sql = mysql2.format(sql, result[0].nombre + '/%');
            const [result5] = await con.query(sql);

           /*  //borramos la carpeta y sus posibles relaciones en la tabla carpeta_subcarpetas
            sql = "DELETE FROM carpeta_subcarpetas WHERE carpetaId IN (?)";
            sql = mysql2.format(sql, ids);
            const [result6] = await con.query(sql); */

            //si la sql anterior no ha tenido ningún resultado se trata de una subcarpeta, la eliminamos
            //if(result5.affectedRows == 0) {
                //sql = "DELETE FROM carpeta_subcarpetas WHERE subcarpetaId = ?";
                //sql = mysql2.format(sql, id);
                //const [result7] = await con.query(sql);
            //}

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

    
var ProcesaDocumObjTree = function(doc, carpeta) {
	//if((doc.length == 1 && !doc[0].facproveId) || (doc.length == 1 && !doc[0].antproveId)) return doc;
	var antdir = null;
	var cont = 1;
	var regs = [];
	var docObj = {
		
	};
	var dirObj = {
		
	};
    var l = [];
    var index;

	carpeta.forEach(d => {
        doc.forEach(e => {
		if(antdir) {
			if(antdir == d.carpetaId ) {
				if(e.documentoId) {//procesamos las facturas
                    l = e.key.split('/');
                    index = l.length - 1;
					docObj = {
                        documentoId: e.documentoId,
						location: e.location,
                        key: e.key,
                        text: l[index],
                        id: e.documentoId,
                        data: { "folder" : false },
                        parent: e.carpetaId,
                        icon: "glyphicon glyphicon-file"
					};
                    if(d.carpetaId == e.carpetaId) {
                        regs.push(docObj);
                    }
					docObj = {}; //una vez incluida la factura en el documento se limpian los datos
				}
                antdir = d.carpetaId;
				
			} else  {
				//si es otro documento de pago guardamos el anterior y creamos otro
				regs.push(dirObj);
                l = d.carpetaNombre.split('/');
                index = l.length - 1;
				dirObj = {
					carpetaNombre: d.carpetaNombre,
                    carpetaId: d.carpetaId,
                    tipo: d.tipo,
                    text:  l[index],
                    id: d.carpetaId,
                    data: { "folder" : true },
                    parent: d.carpetaPadreId,
				    documentos: [],
				};
                if(!d.carpetaPadreId) dirObj.parent = '#';
				if(e.documentoId) {//procesamos las facturas
                    l = e.key.split('/');
                    index = l.length - 1;
					docObj = {
                        documentoId: e.documentoId,
                        location: e.location,
                        key: e.key,
                        text: l[index],
                        id: e.documentoId,
                        data: { "folder" : false },
                        parent:  e.carpetaId,
                        icon: "glyphicon glyphicon-file"
						
					};
					
                    if(d.carpetaId == e.carpetaId) {
                        regs.push(docObj);
                    }
					docObj = {}; //una vez incluida la factura en el documento se limpian los datos
				}

				
				antdir = d.carpetaId;
			} 

		}
		if(!antdir) {
            l = d.carpetaNombre.split('/');
            index = l.length - 1;
			dirObj = {
				carpetaNombre: d.carpetaNombre,
                carpetaId: d.carpetaId,
                tipo: d.tipo,
                text: l[index],
                id: d.carpetaId,
                data: { "folder" : true },
                parent: d.carpetaPadreId,
				documentos: [],
			};
            if(!d.carpetaPadreId) dirObj.parent = '#';
			if(e.documentoId) {
                l = e.key.split('/');
                index = l.length - 1;
				docObj = {
                    documentoId: e.documentoId,
                    location: e.location,
                    key: e.key,
                    text: l[index],
                    id: e.documentoId,
                    data: { "folder" : false },
                    parent:  e.carpetaId,
                    icon: "glyphicon glyphicon-file"
                };
                
				if(d.carpetaId == e.carpetaId) {
                    regs.push(docObj);
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

var ProcesaCarpObjTree = function(carpeta) {
	var antdir = null;
	var cont = 1;
	var regs = [];
		
	
	var dirObj = {
		
	};
   
	carpeta.forEach(d => {
		if(antdir) {
			if(antdir != d.carpetaId)  {
				//si es otro documento de pago guardamos el anterior y creamos otro
				regs.push(dirObj);
				dirObj = {
					carpetaNombre: d.carpetaNombre,
                    carpetaId: d.carpetaId,
                    tipo: d.tipo,
                    text: d.carpetaNombre,
                    id: d.carpetaId,
                    data: { "folder" : true },
                    parent: d.carpetaPadreId,
				    documentos: [],
				};
                if(!d.carpetaPadreId) dirObj.parent = '#';
			
				antdir = d.carpetaId;
			} 

		}
		if(!antdir) {
			dirObj = {
				carpetaNombre: d.carpetaNombre,
                carpetaId: d.carpetaId,
                tipo: d.tipo,
                text: d.carpetaNombre,
                id: d.carpetaId,
                data: { "folder" : true },
                parent: d.carpetaPadreId,
				documentos: [],
			};
            if(!d.carpetaPadreId) dirObj.parent = '#';
			
            antdir = d.carpetaId;
		}
        
        //si se trata del ultimo registro lo guardamos
		if(cont == carpeta.length) {
			regs.push(dirObj);
		}
		cont++;

	});
    

	return regs;
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

var ProcesaSubcarpetaObj = function(carp, subC) {
	var regs = [];
	subC.forEach(d => {
        carp.forEach(e => {
            if(d.carpetaId == e.carpetaId) {
                carp.forEach(f => {
                    if(d.subcarpetaId == f.carpetaId) {
                        e.subcarpetas.push(f);
                        f.eliminar = 1;
                    }
                });
            }
		
        });
	});

    carp.forEach( g => {
        if(g.eliminar == 0) {
            regs.push(g);
        }
    });
	return regs;
}
        

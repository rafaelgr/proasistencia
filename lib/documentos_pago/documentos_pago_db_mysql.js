// unidades_db_mysql
// Manejo de la tabla unidades en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
const mysql2 = require('mysql2/promise') ;
const pdfMerger = require('pdf-merger-js');
const merge = require('easy-pdf-merge');
var fs = require('fs');
const fsp = require('fs').promises
var path = require('path');
var moment = require("moment");
const archiver = require('archiver');
var Stimulsoft = require('stimulsoft-reports-js');





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

const obtenerConfiguracionDB = function(db) {
    return configuracion = {
        host: process.env.BASE_MYSQL_HOST,
        user: process.env.BASE_MYSQL_USER,
        password: process.env.BASE_MYSQL_PASSWORD,
        database: db,
        port: process.env.BASE_MYSQL_PORT,
        charset: process.env.BASE_MYSQL_CHARSET
    }
}




// comprobarDocumentoPago
// comprueba que tiene la estructura de objeto mínima
// necesaria para guardarlo en la base de datos
// Por ejemplo, que es del tipo correcto y tiene los atributos 
// adecuados.
function comprobarDocumentoPago(documentoPago){
	// debe ser objeto del tipo que toca
	var comprobado = "object" === typeof documentoPago;
	// en estas propiedades no se admiten valores nulos
	comprobado = (comprobado && documentoPago.hasOwnProperty("documentoPagoId"));
	comprobado = (comprobado && documentoPago.hasOwnProperty("nombre"));
	comprobado = (comprobado && documentoPago.hasOwnProperty("fecha"));

	return comprobado;
}



module.exports.getDocumentosPago = async () =>{
	let conn = undefined;
	var documentos = null;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "SELECT d.*,";
			sql += " df.facproveId,";
			sql += " f.numeroFacturaProveedor,";
			sql += " f.ref,"; 
			sql += " f.fecha AS fechaFactura,";
			sql += " f.total,"
			sql += " f.totalConIva,";
			sql += " f.nombreFacprovePdf,";
			sql += " p.nombre AS proveedorNombre";
			sql += " FROM documentos_pago AS d";
			sql += " LEFT JOIN documentospago_facproves AS df ON df.documentoPagoId = d.documentoPagoId";
			sql += " LEFT JOIN facprove AS f ON f.facproveId = df.facproveId";
			sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId";

			const [resp] = await conn.query(sql);
			documentos = resp;
			await conn.end();
			if(resp.length > 0) { 
				documentos = resp;
				documentos = ProcesaDocumentosObj(documentos);
			}
			resolve (documentos);
			
		} catch (error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			}
			reject (error)
		}

	});
}

module.exports.getDocumentosPago2 = async (dFecha, hFecha, empresaId,  proveedorId) =>{
	let conn = undefined;
	var documentos = null;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "SELECT d.*,";
			sql += " df.facproveId,";
			sql += " f.numeroFacturaProveedor,";
			sql += " f.ref,"; 
			sql += " f.fecha AS fechaFactura,";
			sql += " f.total,"
			sql += " f.totalConIva,";
			sql += " f.nombreFacprovePdf,";
			sql += " p.nombre AS proveedorNombre";
			sql += " FROM documentos_pago AS d";
			sql += " LEFT JOIN documentospago_facproves AS df ON df.documentoPagoId = d.documentoPagoId";
			sql += " LEFT JOIN facprove AS f ON f.facproveId = df.facproveId";
			sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId";
			sql += " WHERE true";
			if(empresaId > 0) {
				sql += " AND f.empresaId = ?";
			}
			sql = mysql.format(sql, empresaId);
			if(dFecha != 0) {
				sql += " AND d.fecha >= ?";
				sql = mysql.format(sql, dFecha);
			}
			if(hFecha != 0) {
				sql += " AND d.fecha = ?";
				sql = mysql.format(sql, hFecha);
			}
			if(proveedorId > 0) {
				sql += " AND f.proveedorId = ?";
				sql = mysql.format(sql, proveedorId);
			}
			const [resp] = await conn.query(sql);
			documentos = resp;
			await conn.end();
			if(resp.length > 0) { 
				documentos = resp;
				documentos = ProcesaDocumentosObj(documentos);
			}
			resolve (documentos);
			
		} catch (error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			}
			reject (error)
		}

	});
}


module.exports.postDocumentosPagoExportar = async (conDocpago, dFecha, hFecha, empresaId,  proveedorId) =>{
	let conn = undefined;
	var documentos = null;
	let [result2] = [];
	let [result3] = [];
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "SELECT d.*,";
			sql += " df.facproveId,";
			sql += " f.numeroFacturaProveedor,";
			sql += " f.ref,"; 
			sql += " f.fecha AS fechaFactura,";
			sql += " f.total,"
			sql += " f.totalConIva,";
			sql += " f.nombreFacprovePdf,";
			sql += " p.nombre AS proveedorNombre,";
			sql += " true AS dosDocumentos"
			sql += " FROM documentos_pago AS d";
			sql += " LEFT JOIN documentospago_facproves AS df ON df.documentoPagoId = d.documentoPagoId";
			sql += " LEFT JOIN facprove AS f ON f.facproveId = df.facproveId";
			sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId";
			sql += " WHERE f.empresaId = ?";
			sql = mysql.format(sql, empresaId);
			if(dFecha != 0) {
				sql += " AND d.fecha >= ?";
				sql = mysql.format(sql, dFecha);
			}
			if(hFecha != 0) {
				sql += " AND d.fecha = ?";
				sql = mysql.format(sql, hFecha);
			}
			if(proveedorId > 0) {
				sql += " AND f.proveedorId = ?";
				sql = mysql.format(sql, proveedorId);
			}
			const [resp] = await conn.query(sql);
			documentos = resp;
			await conn.end();
			if(resp.length > 0) { 
				documentos = resp;
				const [result] = await exportarDocumentospago(documentos, conDocpago);
				if([result]) [result2] = await crearReportExportacion(documentos);
				if ([result2]) [result3] = await borrarDirectorio();
				resolve ([result3]);
			}
			
		} catch (error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			}
			reject (error)
		}

	});
}

var exportarDocumentospago = async (documentos, conDocpago) => {
	return new Promise(async (resolve, reject) => {
		try {
			var cont = 0
			
			var destino = process.env.DOC_PAGO_DIR + "\\temporal"
			
			for(let d of documentos){ 
				var src = "";
				var name = "";
				var arr = [];
				var extDoc = '';
				var extFac = '';
				//comprobamos la extensión de los docuemntos a adjuntar
				if(d.pdf) {
					extDoc = d.pdf.split('.').pop().toLowerCase();
				}
				if(d.nombreFacprovePdf) {
					extFac = d.nombreFacprovePdf.split('.').pop().toLowerCase();
				}
				
				if(d.pdf && extDoc == 'pdf') {
					var data = process.env.DOC_PAGO_DIR + "\\" + d.pdf;
					var obj =
					{
						doc: data
					};
					arr.push(obj);
				} 
				if(d.nombreFacprovePdf && extFac == 'pdf') {
					var data = process.env.FACTURA_PROVEEDOR_DIR + "\\" + d.nombreFacprovePdf;
					var obj =
					{
						factura: data
					}
					arr.push(obj);
				} 
				if(arr.length == 2 ) {
					if(conDocpago == 1) {
						merge([arr[0].doc, arr[1].factura], destino + "\\" + d.nombreFacprovePdf, function (err) {
							if (err) {
								try{
									console.log(err);
									throw new Error(err);
								}catch(e) {
									reject(e)
								}
							
							} else {
								cont++;
								console.log('Success');
								if(cont == documentos.length) resolve(documentos)
							}
						});
					} else {
						src = arr[1].factura;
						name = d.nombreFacprovePdf;
						fs.copyFile(src, path.join(destino, name), (err) => {
							if (err) {
								try{
									console.log(err);
									throw new Error(err);
								}catch(e) {
									reject(e)
								}
							
							} else {
								d.dosDocumentos = false
								cont++;
								console.log('Success');
								if(cont == documentos.length) resolve(documentos)
							}
						});
					}
					

				}else {
					
				
					if(arr[0].factura) {
						src = arr[0].factura;
						name = d.nombreFacprovePdf;
					} else {
						src = arr[0].doc;
						name = d.ref + ".pdf";
					}
					fs.copyFile(src, path.join(destino, name), (err) => {
						if (err) {
							try{
								console.log(err);
								throw new Error(err);
							}catch(e) {
								reject(e)
							}
						
						} else {
							d.dosDocumentos = false
							cont++;
							console.log('Success');
							if(cont == documentos.length) resolve(documentos)
						}
					});
				}

			} 

		} catch(err) {
			reject(err);
		}
	});
}

var crearReportExportacion = async (documentos) => {
	return new Promise(async (resolve, reject) => {
		try {
			for(let d of documentos){ 
				d.fecha = moment(d.fecha).format('DD-MM-YYYY');
				d.fechaFactura = moment(d.fechaFactura).format('DD-MM-YYYY');
			}
			
			
			var obj = 
			{
				registros: documentos
			}
			var resul = JSON.stringify(obj);
			fs.writeFile(process.env.DOC_PAGO_DIR + "\\temporal\\informe.json", resul, function(err) {
				if(err) return callback(err);
				//return callback(null, true);
			});
	
			Stimulsoft.Base.StiLicense.key = process.env.STI_KEY;
			Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");
			var report = new Stimulsoft.Report.StiReport();
			var file = process.env.REPORTS_DIR + "\\documentosp_export.mrt";
			report.loadFile(file);
					
					var dataSet = new Stimulsoft.System.Data.DataSet("registros");
					dataSet.readJson(obj);
							
					// Remove all connections from the report template
					report.dictionary.databases.clear();
					 //
					 report.regData(dataSet.dataSetName, "", dataSet);
					 report.dictionary.synchronize();
						
					report.renderAsync(function () {
						// Creating export settings
						var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
						// Creating export service
						var service = new Stimulsoft.Report.Export.StiPdfExportService();
						// Creating MemoryStream
						var stream = new Stimulsoft.System.IO.MemoryStream();
						var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
						var service = new Stimulsoft.Report.Export.StiPdfExportService();
						var stream = new Stimulsoft.System.IO.MemoryStream();
		
						service.exportTo(report, stream, settings);
		
						var data = stream.toArray();
		
						var buffer = new Buffer.from(data, "utf-8");
		
						fs.writeFileSync(process.env.DOC_PAGO_DIR + "\\temporal\\" + "informe.pdf", buffer);
						
						//creamos un ZIP con todos los documentos creados
						var output = fs.createWriteStream(process.env.DOC_PAGO_DIR + "\\" + Date.now() + '.zip');
						var archive = archiver('zip');
						archive.pipe(output);
						archive.directory(process.env.DOC_PAGO_DIR + "\\temporal", 'exportados');
						archive.finalize()
						.then( () => {
							resolve(documentos);
						})
						.catch( (err) => {
							throw new Error(err);
						})
					});
	

		} catch(e) {
			reject(e);
		}
	});
}

var borrarDirectorio = async () => {
	return new Promise(async (resolve, reject) => {
	//vaciamos el directorio temporal eliminando los archiivos
	fsp.readdir(process.env.DOC_PAGO_DIR + "\\temporal")
	.then(files => {
	  const unlinkPromises = files.map(file => {
			const filePath = path.join(process.env.DOC_PAGO_DIR + "\\temporal", file)
			return fsp.unlink(filePath)
	  })
	  let result = Promise.all(unlinkPromises);
	  resolve(result);
	}).catch(err => {
		reject(err);
	}); 
	});
}

module.exports.getDocumentosPagoBuscar = async (nombre) => {
    let conn = undefined;
	var documentos = null;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "SELECT d.*,";
			sql += " df.facproveId,";
			sql += " f.numeroFacturaProveedor,";
			sql += " f.ref,"; 
			sql += " f.fecha AS fechaFactura,";
			sql += " f.total,"
			sql += " f.totalConIva,";
			sql += " f.nombreFacprovePdf,";
			sql += " p.nombre AS proveedorNombre";
			sql += " FROM documentos_pago AS d";
			sql += " LEFT JOIN documentospago_facproves AS df ON df.documentoPagoId = d.documentoPagoId";
			sql += " LEFT JOIN facprove AS f ON f.facproveId = df.facproveId";
			sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId";

			if (nombre !== "*") {
				sql = "SELECT d.*,";
				sql += " df.facproveId,";
				sql += " f.numeroFacturaProveedor,";
				sql += " f.ref,"; 
				sql += " f.fecha AS fechaFactura,";
				sql += " f.total,"
				sql += " f.totalConIva,";
				sql += " f.nombreFacprovePdf,";
				sql += " p.nombre AS proveedorNombre";
				sql += " FROM documentos_pago AS d";
				sql += " LEFT JOIN documentospago_facproves AS df ON df.documentoPagoId = d.documentoPagoId";
				sql += " LEFT JOIN facprove AS f ON f.facproveId = df.facproveId";
				sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId";
				sql += " WHERE d.nombre LIKE ?";
				sql = mysql.format(sql, '%' + nombre + '%');
			}
			const [resp] = await conn.query(sql);
			documentos = resp;
			await conn.end();
			if(resp.length > 0) { 
				documentos = resp;
				documentos = ProcesaDocumentosObj(documentos);
			}
			resolve (documentos);
			
		} catch (error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			}
			reject (error)
		}
	});
}



// getDocumentoPago
module.exports.getDocumentoPago = async (id) =>{
	let conn = undefined;
	var documento = null;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "SELECT d.*,";
			sql += " df.facproveId,";
			sql += " f.numeroFacturaProveedor,";
			sql += " f.ref,"; 
			sql += " f.fecha AS fechaFactura,";
			sql += " f.total,"
			sql += " f.totalConIva,",
			sql += " f.nombreFacprovePdf,";
			sql += " p.nombre AS proveedorNombre";
			sql += " FROM documentos_pago AS d";
			sql += " LEFT JOIN documentospago_facproves AS df ON df.documentoPagoId = d.documentoPagoId";
			sql += " LEFT JOIN facprove AS f ON f.facproveId = df.facproveId";
			sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId";
			sql += " WHERE d.documentoPagoId = ?";
			sql = mysql.format(sql, id);
			const [resp] = await conn.query(sql, id);
			await conn.end();
			if(resp.length > 0) {
				documento = resp;
			  	documento = ProcesaDocumentosObj(documento);
				resolve(documento[0]);
			} else 
			{
				resolve(documento);
			}
			
		} catch (error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			};
			reject(error)
		}
	});
}

// postDocumentoPago
module.exports.postDocumentoPago = async function (documentoPago) {
	let conn = undefined;
	return new Promise(async (resolve, reject) => {
		try {
			if (!comprobarDocumentoPago(documentoPago)){
				throw new Error ("El documento de pago pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
			}
			
			conn = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "INSERT INTO documentos_pago SET ?";
			sql = mysql.format(sql, documentoPago);
			const [resp] = await conn.query(sql);
			await conn.end()
			documentoPago.documentoPagoId = resp.insertId;
			resolve(documentoPago);

		}  catch (error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			};
			reject (error);
		}
	});
}














// putDocumentoPago
module.exports.putDocumentoPago = async(id, documentoPago) =>{
	let conn = undefined;
	return new Promise(async (resolve, reject) => {
		try {
			if (!comprobarDocumentoPago(documentoPago)){
				throw new Error ("El documento de pago pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
			}
			if (id != documentoPago.documentoPagoId) {
				throw new Error("El ID del objeto y de la url no coinciden");
				
			}
			conn = await mysql2.createConnection(obtenerConfiguracion());
			
			var sql = "UPDATE documentos_pago SET ? WHERE documentoPagoId = ?";
			sql = mysql.format(sql, [documentoPago, documentoPago.documentoPagoId]);
			const [resp] = await conn.query(sql);
			await conn.end();
			resolve (documentoPago);
		} catch (error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			}
			reject (error)
		}
	});
}

// deleteDocumentoPago
module.exports.deleteDocumentoPago = async(documentoPagoId) =>{
	let conn = undefined;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			sql = "DELETE from documentos_pago WHERE documentoPagoId = ?";
			sql = mysql.format(sql, documentoPagoId);
			const [resp] = await conn.query(sql);
			await conn.end();
			resolve (resp);
		} catch (error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			}
			reject (error)
		}
	});
}



//LINEAS DE DOCUMENTOS DE PAGO


module.exports.postDocuemntoPagoFacturas = function (docfac) {
    let conn = undefined;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "INSERT INTO documentospago_facproves";
			sql += " SELECT 0 AS docfacproveId, ? AS docuemntoPagoId, facproveId, null AS codigo, null AS anyo, e.contabilidad AS empresaConta ";
			sql += " FROM facprove AS f";
			sql += " INNER JOIN empresas as e on e.empresaId = f.empresaId"
			sql += " WHERE f.fecha >= ? AND f.fecha <= ? AND f.sel = 1";
			sql = mysql.format(sql, [docfac.documentoPagoId, docfac.dFecha, docfac.hFecha]);
			if (docfac.empresaId > 0) {
				sql += " AND f.empresaId = ?";
				sql = mysql.format(sql, docfac.empresaId);
			}
			if (docfac.departamentoId > 0) {
				sql += " AND f.departamentoId = ?";
				sql = mysql.format(sql, docfac.departamentoId);
			} 
			const [resp] = await conn.query(sql);
			if(resp.affectedRows == 0) {
				throw new Error("No se ha asociado ningún registro")
			}
			//quitamos la marca de seleccionadas
			sql = "UPDATE facprove set sel = 0";
			sql += " WHERE fecha >= ? AND fecha <= ?";
			sql = mysql.format(sql, [docfac.dFecha, docfac.hFecha]);
			if (docfac.empresaId > 0) {
				sql += " AND empresaId = ?";
				sql = mysql.format(sql, docfac.empresaId);
			}
			if (docfac.departamentoId > 0) {
				sql += " AND departamentoId = ?";
				sql = mysql.format(sql, docfac.departamentoId);
			} 
			const [resp2] = await conn.query(sql);
			await conn.end();
			resolve (resp2);
		} catch(error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			}
			reject (error)
		}
	});
	
}

// getPreCorreoFacturas
// obtiene las facturas no enviadas entre las fechas indicadas
module.exports.postDocuemntoPagoRegistros = function (docfac) {
    let conn = undefined;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "INSERT INTO documentospago_facproves";
			sql += " SELECT 0 AS docfacproveId, ? AS docuemntoPagoId, facproveId";
			sql += " FROM facprove";
			sql += " WHERE fecha >= ? AND fecha <= ? AND sel = 1";
			sql = mysql.format(sql, [docfac.documentoPagoId, docfac.dFecha, docfac.hFecha]);
			if (docfac.empresaId > 0) {
				sql += " AND empresaId = ?";
				sql = mysql.format(sql, docfac.empresaId);
			}
			if (docfac.departamentoId > 0) {
				sql += " AND departamentoId = ?";
				sql = mysql.format(sql, docfac.departamentoId);
			} 
			const [resp] = await conn.query(sql);
			await conn.end();
			resolve (resp);
		} catch(error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			}
			reject (error)
		}
	});
	
}


module.exports.getRegistrosConta = async (dFecha, hFecha, empresaId) =>{
	let conn = undefined;
	let connDb = undefined;
	var documentos = null;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			//PRIMERO RECUPERAMOS LA CONTABILIDAD DE LA EMPRESA
			var sql = "SELECT contabilidad FROM empresas"
			sql += " WHERE empresaId = ?";
			sql = mysql.format(sql, empresaId);
			const [resp] = await conn.query(sql);
			if(resp.length == 0) throw new Error ("Empresa no encontrada");
			var db = resp[0].contabilidad;
			await conn.end();
			connDb = await mysql2.createConnection(obtenerConfiguracionDB(db));
			sql ="SELECT t.* FROM transferencias AS t";
			sql += " WHERE t.fecha >= ? AND t.fecha <= ? AND t.situacion = 'Q'";
			sql += " AND NOT (t.codigo, t.anyo) IN";
			sql += " (SELECT DISTINCT codigo, anyo FROM proasistencia.documentospago_facproves WHERE empresaConta = ? AND (NOT codigo IS NULL OR NOT anyo IS NULL) )";
			sql = mysql.format(sql, [dFecha, hFecha, db]);
			const [resp2] = await connDb.query(sql);
			await connDb.end();
				if(resp2.length > 0) {
					documentos = resp2;
					documentos = procesaClaveCompuesta(documentos)
				}
				resolve (documentos);
	
		} catch (error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			};
			if(connDb) {
				if (!connDb.connection._closing) await connDb.end();
			}
			reject (error)
		}
	});
}

module.exports.getDocumentosPagoBuscar2 = async (dFecha, hFecha, empresaId) =>{
	let conn = undefined;
	let connDb = undefined;
	var documentos = null;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			//PRIMERO RECUPERAMOS LA CONTABILIDAD DE LA EMPRESA
			var sql = "SELECT contabilidad FROM empresas"
			sql += " WHERE empresaId = ?";
			sql = mysql.format(sql, empresaId);
			const [resp] = await conn.query(sql);
			if(resp.length == 0) throw new Error ("Empresa no encontrada");
			var db = resp[0].contabilidad;
			await conn.end();
			connDb = await mysql2.createConnection(obtenerConfiguracionDB(db));
			sql ="SELECT t.* FROM transferencias AS t";
			sql += " WHERE t.fecha >= ? AND t.fecha <= ? AND t.situacion = 'Q'";
			sql = mysql.format(sql, [dFecha, hFecha]);
			const [resp2] = await connDb.query(sql);
			await connDb.end();
				if(resp.length > 0) {
					documentos = resp2;
					documentos = procesaClaveCompuesta(documentos)
				}
				resolve (documentos);
	
		} catch (error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			};
			if(connDb) {
				if (!connDb.connection._closing) await connDb.end();
			}
			reject (error)
		}
	});
}


module.exports.getRegistrosContaFacturas = async (docfac) =>{
	let conn = undefined;
	let connDb = undefined;
	var documentos = null;
	var arr = [];
	return new Promise(async (resolve, reject) => {
		try {
			arr = docfac.claves;
			if(arr.length == 0) {
				throw new Error("No se ha asociado ningún registro")
			}
			conn = await mysql2.createConnection(obtenerConfiguracion());
			//PRIMERO RECUPERAMOS LA CONTABILIDAD DE LA EMPRESA
			var sql = "SELECT contabilidad FROM empresas"
			sql += " WHERE empresaId = ?";
			sql = mysql.format(sql, docfac.empresaId);
			const [resp] = await conn.query(sql);
			if(resp.length == 0) throw new Error ("Empresa no encontrada");
			var db = resp[0].contabilidad;
			await conn.end();
			connDb = await mysql2.createConnection(obtenerConfiguracionDB(db));
			for(let m of arr){
				sql =" INSERT INTO proasistencia.documentospago_facproves";
				sql += " (";
				sql += " SELECT DISTINCT";
				sql += " 0 AS docfacproveId, ";
				sql += " ? AS documentoPagoId, ";
				sql += " f.facproveId,"
				sql += " ? AS codigo, ";
				sql += " ? AS anyo,";
				sql += " ? AS empresaConta";
				sql = mysql.format(sql, [docfac.documentoPagoId, m.nrodocum, m.anyodocum, db]);
  				sql += " FROM transferencias AS t";
  				sql += " LEFT JOIN pagos AS p ON p.nrodocum = t.codigo AND p.anyodocum = t.anyo";
  				sql += " LEFT JOIN proasistencia.proveedores AS pr ON pr.cuentaContable = p.codmacta ";
  				sql += " LEFT JOIN proasistencia.facprove AS f ON f.numeroFacturaProveedor = p.numfactu AND f.proveedorId = pr.proveedorId AND f.fecha = p.fecfactu";
  				sql += " WHERE t.fecha >= ? AND t.fecha <= ? AND t.situacion = 'Q' AND t.tipotrans = 0 AND t.codigo = ? AND t.anyo  = ? AND NOT f.facproveId IS NULL";
				sql = mysql.format(sql, [docfac.dFecha, docfac.hFecha, m.nrodocum, m.anyodocum]);
				sql += " )";
				sql += " UNION";//FACTURAS CON ANTICIPOS SIN RELACIÓN CON FACTCLI
				sql += " (";
				sql += " SELECT ";
				sql += " 0 AS docfacproveId, ";
				sql += " ? AS documentoPagoId, ";
				sql += " COALESCE(fa.facproveId, f.facproveId) AS facproveId,";
				sql += " ? AS codigo, ";
				sql += " ? AS anyo,";
				sql += " ? AS empresaConta"
				sql = mysql.format(sql, [docfac.documentoPagoId, m.nrodocum, m.anyodocum, db]);
				sql += " FROM proasistencia.antprove AS a";
				sql += " INNER JOIN";
				sql += " (";
				sql += " SELECT  DISTINCT";
				sql += " p.numfactu, p.fecfactu";
				sql += " FROM transferencias AS t";
				sql += " LEFT JOIN pagos AS p ON p.nrodocum = t.codigo AND p.anyodocum = t.anyo";
				sql += " LEFT JOIN proasistencia.proveedores AS pr ON pr.cuentaContable = p.codmacta ";
				sql += " LEFT JOIN proasistencia.facprove AS f ON f.numeroFacturaProveedor = p.numfactu AND f.proveedorId = pr.proveedorId AND f.fecha = p.fecfactu";
				sql += " WHERE t.fecha >= ? AND t.fecha <= ? AND t.situacion = 'Q'  AND t.tipotrans = 0 AND t.codigo = ? AND t.anyo  = ?";
				sql = mysql.format(sql, [docfac.dFecha, docfac.hFecha, m.nrodocum, m.anyodocum]);
				sql += " AND f.facproveId  IS NULL";
				sql += " ) AS tmp ON tmp.numfactu  = a.numeroAnticipoProveedor AND tmp.fecfactu = a.fecha";
				sql += " LEFT JOIN proasistencia.facprove_antproves AS fa ON fa.antproveId = a.antproveId";
				sql += " INNER JOIN proasistencia.facprove AS f ON f.facproveId = fa.facproveId OR f.facproveId = a.facproveId";
				sql += " )";
				const [resp2] = await connDb.query(sql);
			}
			await connDb.end();
			resolve (docfac);
		} catch (error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			};
			if(connDb) {
				if (!connDb.connection._closing) await connDb.end();
			}
			reject (error)
		}
	});
}

module.exports.getRegistroContaFactura = async (codigo, anyo, empresaId) =>{
	let conn = undefined;
	let connDb = undefined;
	var documentos = null;
	var arr = [];
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			//PRIMERO RECUPERAMOS LA CONTABILIDAD DE LA EMPRESA
			var sql = "SELECT contabilidad FROM empresas"
			sql += " WHERE empresaId = ?";
			sql = mysql.format(sql, empresaId);
			const [resp] = await conn.query(sql);
			if(resp.length == 0) throw new Error ("Empresa no encontrada");
			var db = resp[0].contabilidad;
			await conn.end();
			connDb = await mysql2.createConnection(obtenerConfiguracionDB(db));
				sql = " (";
				sql += " 	SELECT DISTINCT";
				sql += " 	f.facproveId,";
				sql += " 	f.emisorNombre,";
				sql += " 	f.receptorNombre,";
				sql += " 	f.numeroFacturaProveedor,";
				sql += " 	f.ref,";
				sql += " 	f.fecha,";
				sql += " 	f.total,";
				sql += " 	f.totalConIva,";
				sql += " 	fp.nombre AS formaPago";
  				sql += " 	FROM transferencias AS t";
  				sql += " 	LEFT JOIN pagos AS p ON p.nrodocum = t.codigo AND p.anyodocum = t.anyo";
  				sql += " 	LEFT JOIN proasistencia.proveedores AS pr ON pr.cuentaContable = p.codmacta ";
  				sql += " 	LEFT JOIN proasistencia.facprove AS f ON f.numeroFacturaProveedor = p.numfactu AND f.proveedorId = pr.proveedorId AND f.fecha = p.fecfactu";
				sql += " 	LEFT JOIN proasistencia.formas_pago AS fp ON fp.formaPagoId = f.formaPagoId";
  				sql += " 	WHERE t.situacion = 'Q'  AND t.tipotrans = 0 AND p.nrodocum = ? AND p.anyodocum  = ? AND NOT f.facproveId IS NULL";
				sql = mysql.format(sql, [codigo, anyo]);
				sql += " )";
				sql += " UNION";//FACTURAS CON ANTICIPOS SIN RELACIÓN CON FACTCLI
				sql += " (";
				sql += " SELECT DISTINCT";
				sql += " 	f.facproveId,";
				sql += " 	f.emisorNombre,";
				sql += " 	f.receptorNombre,";
				sql += " 	f.numeroFacturaProveedor,";
				sql += " 	f.ref,";
				sql += " 	f.fecha,";
				sql += " 	f.total,";
				sql += " 	f.totalConIva,";
				sql += " 	fp.nombre AS formaPago";
				sql += " FROM proasistencia.antprove AS a";
				sql += " INNER JOIN";
				sql += " (";
				sql += "   SELECT  ";
				sql += "   p.numfactu, p.fecfactu";
				sql += "   FROM transferencias AS t";
				sql += "   LEFT JOIN pagos AS p ON p.nrodocum = t.codigo AND p.anyodocum = t.anyo";
				sql += "   LEFT JOIN proasistencia.proveedores AS pr ON pr.cuentaContable = p.codmacta ";
				sql += "   LEFT JOIN proasistencia.facprove AS f ON f.numeroFacturaProveedor = p.numfactu AND f.proveedorId = pr.proveedorId AND f.fecha = p.fecfactu";
				sql += "   WHERE t.situacion = 'Q'  AND t.tipotrans = 0 AND p.nrodocum = ? AND p.anyodocum  = ?";
				sql = mysql.format(sql, [codigo, anyo]);
				sql += "   AND f.facproveId  IS NULL";
				sql += " ) AS tmp ON tmp.numfactu  = a.numeroAnticipoProveedor AND tmp.fecfactu = a.fecha";
				sql += " LEFT JOIN proasistencia.facprove_antproves AS fa ON fa.antproveId = a.antproveId";
				sql += " INNER JOIN proasistencia.facprove AS f ON f.facproveId = fa.facproveId OR f.facproveId = a.facproveId";
				sql += " LEFT JOIN proasistencia.formas_pago AS fp ON fp.formaPagoId = f.formaPagoId";
				sql += " )";
				const [resp2] = await connDb.query(sql);
				
			await connDb.end();
			resolve (resp2);
		} catch (error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			};
			if(connDb) {
				if (!connDb.connection._closing) await connDb.end();
			}
			reject (error)
		}
	});
}

// deleteDocumentoPago
module.exports.DeletedocumentospagoFacprove = async(docpago) =>{
	let conn = undefined;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			for(let d of docpago){
				var sql = "DELETE from documentospago_facproves WHERE documentoPagoId = ? AND facproveId = ?";
				sql = mysql.format(sql, [d.documentoPagoId, d.facproveId]);
				const [resp] = await conn.query(sql);
			}
			await conn.end();
			resolve ('OK');
		} catch (error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			}
			reject (error)
		}
	});
}


var procesaClaveCompuesta = function(d) {
	d.forEach(e => {
		var c =  e.codigo.toString();
		var a = e.anyo.toString();
		e.codigo = c+a
	});
	return d;
}

var ProcesaDocumentosObj = function(doc) {
	if(doc.length == 1 && !doc[0].facproveId) return doc;
	var antdoc = null;
	var cont = 1;
	var regs = [];
	var facObj = {
		
	};
	var docObj = {
		
	};

	doc.forEach(d => {
		//el primer registro siempre se procesa
		if(antdoc) {
			// si se trata de el mismo documento de pago solo adjuntamos la factura
			if(antdoc == d.documentoPagoId ) {
				facObj = {
					facproveId: d.facproveId,
					numeroFacturaProveedor: d.numeroFacturaProveedor,
					ref: d.ref,
					fechaFactura: d.fechaFactura,
					total: d.total,
					totalConIva: d.totalConIva,
					pdfFactura: d.nombreFacprovePdf,
					proveedorNombre: d.proveedorNombre
				};
				docObj.facturas.push(facObj);
				facObj = {}; //una vez incluida la factura en el documento se limpian los datos
			} else  {
				//si es otro documento de pago guardamos el anterior y creamos otro
				regs.push(docObj);
				docObj = {
					documentoPagoId: d.documentoPagoId,
					nombre: d.nombre,
					pdf: d.pdf,
					fecha: d.fecha,
					facturas: [],
				};
				facObj = {
					facproveId: d.facproveId,
					numeroFacturaProveedor: d.numeroFacturaProveedor,
					ref: d.ref,
					fechaFactura: d.fechaFactura,
					total: d.total,
					totalConIva: d.totalConIva,
					pdfFactura: d.nombreFacprovePdf,
					proveedorNombre: d.proveedorNombre
				};
				docObj.facturas.push(facObj);
				facObj = {}; //una vez incluida la factura en el documento se limpian los datos
				antdoc = d.documentoPagoId;
			} 

		}
		if(!antdoc) {
			docObj = {
				documentoPagoId: d.documentoPagoId,
				nombre: d.nombre,
				pdf: d.pdf,
				fecha: d.fecha,
				facturas: [],
			};
			facObj = {
				facproveId: d.facproveId,
				numeroFacturaProveedor: d.numeroFacturaProveedor,
				ref: d.ref,
				fechaFactura: d.fechaFactura,
				total: d.total,
				totalConIva: d.totalConIva,
				pdfFactura: d.nombreFacprovePdf,
				proveedorNombre: d.proveedorNombre
			};
			docObj.facturas.push(facObj);
			facObj = {}; //una vez incluida la factura en el documento se limpian los datos
			antdoc = d.documentoPagoId;
		}

		//si se trata del ultimo registro lo guardamos
		if(cont == doc.length) {
			regs.push(docObj);
		}
		cont++;
	});

	return regs;
}


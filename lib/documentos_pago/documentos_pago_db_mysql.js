// unidades_db_mysql
// Manejo de la tabla unidades en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
const mysql2 = require('mysql2/promise') ;
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
			sql += " f.fecha_recepcion AS fechaRecepcionFactura,";
			sql += " f.total,"
			sql += " f.totalConIva,";
			sql += " f.nombreFacprovePdf,";
			sql += " p.nombre AS proveedorNombre";
			//
			sql += " df.antproveId,";
			sql += " a.numeroAnticipoProveedor,";
			sql += " a.fecha AS fechaAnticipo,";
			sql += " a.total AS totalAnticipo,"
			sql += " a.totalConIva AS totalConIvaAnticipo,",
			sql += " p2.nombre AS proveedorNombreAnticipo";
			//
			sql += " FROM documentos_pago AS d";
			sql += " LEFT JOIN documentospago_facproves AS df ON df.documentoPagoId = d.documentoPagoId";
			sql += " LEFT JOIN facprove AS f ON f.facproveId = df.facproveId";
			sql += " LEFT JOIN antprove AS a ON a.antproveId = df.antproveId";
			sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId";
			sql += " LEFT JOIN proveedores AS p2 ON p2.proveedorId = a.proveedorId";

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
			sql += " f.fecha_recepcion AS fechaRecepcionFactura,";
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



module.exports.getFacturasdocpago = async (dFecha, hFecha, empresaId, proveedorId, formaPagoId) =>{
	let conn = undefined;
	var documentos = null;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "UPDATE facprove AS f";
			sql += " LEFT JOIN documentospago_facproves AS df ON df.facproveId = f.facproveId";
			sql += " LEFT JOIN documentos_pago AS d ON d.documentoPagoId = df.documentoPagoId";
			sql += " SET f.sel = 0"
			sql += " WHERE f.contabilizada = 1";
			if(empresaId > 0) {
				sql += " AND f.empresaId = ?";
			}
			sql = mysql.format(sql, empresaId);
			if(dFecha != 0) {
				sql += " AND f.fecha_recepcion >= ?";
				sql = mysql.format(sql, dFecha);
			}
			if(hFecha != 0) {
				sql += " AND f.fecha_recepcion <= ?";
				sql = mysql.format(sql, hFecha);
			}
			if(proveedorId > 0) {
				sql += " AND f.proveedorId = ?";
				sql = mysql.format(sql, proveedorId);
			}
			if(formaPagoId > 0) {
				sql += " AND f.formaPagoId = ?";
				sql = mysql.format(sql, formaPagoId);
			}
			const [resp1] = await conn.query(sql);

			sql = "SELECT DISTINCT";
			sql += " d.pdf,";
			sql += " d.documentoPagoId,"
			sql += " f.facproveId,"
			sql += " f.empresaId,"
			sql += " f.proveedorId,"
			sql += " f.numeroFacturaProveedor,";
			sql += " f.ref,"; 
			sql += " f.fecha AS fechaFactura,";
			sql += " f.fecha_recepcion AS fecharecepcionFactura,";
			sql += " f.emisorNombre AS emisorNombre,";
			sql += " f.receptorNombre AS receptorNombre,";
			sql += " f.total,";
			sql += " f.totalConIva,";
			sql += " f.nombreFacprovePdf";
			sql += " FROM facprove AS f";
			sql += " LEFT JOIN documentospago_facproves AS df ON df.facproveId = f.facproveId";
			sql += " LEFT JOIN documentos_pago AS d ON d.documentoPagoId = df.documentoPagoId";
			sql += " WHERE f.contabilizada = 1";
			if(empresaId > 0) {
				sql += " AND f.empresaId = ?";
			}
			sql = mysql.format(sql, empresaId);
			if(dFecha != 0) {
				sql += " AND f.fecha_recepcion >= ?";
				sql = mysql.format(sql, dFecha);
			}
			if(hFecha != 0) {
				sql += " AND f.fecha_recepcion <= ?";
				sql = mysql.format(sql, hFecha);
			}
			if(proveedorId > 0) {
				sql += " AND f.proveedorId = ?";
				sql = mysql.format(sql, proveedorId);
			}
			if(formaPagoId > 0) {
				sql += " AND f.formaPagoId = ?";
				sql = mysql.format(sql, formaPagoId);
			}
			sql += "ORDER BY f.fecha_recepcion DESC"
			
			const [resp2] = await conn.query(sql);
			documentos = resp2;
			await conn.end();
			if(resp2.length > 0) { 
				documentos = resp2;
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
			sql += " f.fecha_recepcion AS fechaRecepcionFactura,";
			sql += " f.total,"
			sql += " f.totalConIva,";
			sql += " COALESCE(f.totalConIva - f.total, 0) AS ,"
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



module.exports.postFacprovesDocPagoExportar = async (conDocpago, dFecha, hFecha, empresaId,  proveedorId, formaPagoId) =>{
	let conn = undefined;
	var documentos = null;
	let [result2] = [];
	let [result3] = [];
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "SELECT d.*,";
			sql += " f.facproveId,";
			sql += " f.numeroFacturaProveedor,";
			sql += " f.ref,"; 
			sql += " f.fecha_recepcion AS fechaRecepcion,";
			sql += " f.fecha AS fechaFactura,";
			sql += " f.total,"
			sql += " f.totalConIva,";
			sql += " COALESCE(f.totalConIva - f.total, 0) AS cuota,"
			sql += " f.nombreFacprovePdf,";
			sql += " p.nombre AS proveedorNombre";
			sql += " FROM facprove AS f";
			sql += " LEFT JOIN documentospago_facproves AS df ON df.facproveId = f.facproveId";
			sql += " LEFT JOIN documentos_pago AS d ON d.documentoPagoId = df.documentoPagoId";
			sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId";
			sql += " WHERE f.empresaId = ? AND f.sel = 1 AND contabilizada = 1";
			sql = mysql.format(sql, empresaId);
			if(dFecha != 0) {
				sql += " AND f.fecha_recepcion >= ?";
				sql = mysql.format(sql, dFecha);
			}
			if(hFecha != 0) {
				sql += " AND f.fecha_recepcion <= ?";
				sql = mysql.format(sql, hFecha);
			}
			if(proveedorId > 0) {
				sql += " AND f.proveedorId = ?";
				sql = mysql.format(sql, proveedorId);
			}
			if(formaPagoId > 0) {
				sql += " AND f.formaPagoId = ?";
				sql = mysql.format(sql, formaPagoId);
			}
			const [resp] = await conn.query(sql);
			documentos = resp;
			await conn.end();
			if(resp.length > 0) { 
				documentos = resp;
				await borrarDirectorio();
				const [result] = await exportarDocumentospago(documentos, conDocpago);
				if([result]) [result2] = await crearReportExportacion(documentos, dFecha, hFecha, empresaId,  proveedorId);
				await borrarDirectorio();
				resolve ([result3]);
			} else {
				resolve (null);
			}
			
		} catch (error) {
			if(conn) {
				if (!conn.connection._closing) await conn.end();
			}
			await borrarDirectorio();
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
				//comprobamos la extensión de los documentos a adjuntar
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
						merge([ arr[1].factura, arr[0].doc], destino + "\\" + d.documentoPagoId + "_" + d.nombreFacprovePdf, function (err) {
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
					
					if(arr[0]) {
						if(arr[0].factura) {
							src = arr[0].factura;
							name = d.nombreFacprovePdf;
						} else {
							src = arr[0].doc;
							name = d.ref + ".pdf";
						}
					}else {
						try{
							throw new Error('La factura numero ' + d.numeroFacturaProveedor + ' no tiene pdf asociado o el formato del archivo no es correcto');
						}catch(e) {
							console.log(e);
							reject(e)
						}
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

var crearReportExportacion = async (documentos, dFecha, hFecha, empresaId,  proveedorId) => {
	return new Promise(async (resolve, reject) => {
		try {
			var nombreZip = dFecha + "_" + hFecha + "_" + empresaId + "_" + proveedorId
			for(let d of documentos){ 
				d.fecha = moment(d.fecha).format('DD-MM-YYYY');
				d.fechaFactura = moment(d.fechaFactura).format('DD-MM-YYYY');
				d.fechaRecepcion = moment(d.fechaRecepcion).format('DD-MM-YYYY');
			}
			
			
			var obj = 
			{           
				registros: documentos
			}
			/* var resul = JSON.stringify(obj);
			fs.writeFile(process.env.DOC_PAGO_DIR + "\\exportados\\informe.json", resul, function(err) {
				if(err) return callback(err);
				//return callback(null, true);
			}); */
	 
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
						var output = fs.createWriteStream(process.env.DOC_PAGO_DIR + "\\exportados\\"  + nombreZip + '.zip');
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
			sql += " f.fecha_recepcion AS fechaRecepcionFactura,";
			sql += " f.total,"
			sql += " f.totalConIva,";
			sql += " f.nombreFacprovePdf,";
			sql += " p.nombre AS proveedorNombre,";
			//
			sql += " df.antproveId,";
			sql += " a.numeroAnticipoProveedor,";
			sql += " a.fecha AS fechaAnticipo,";
			sql += " a.total AS totalAnticipo,"
			sql += " a.totalConIva AS totalConIvaAnticipo,",
			sql += " p2.nombre AS proveedorNombreAnticipo";
			//
			sql += " FROM documentos_pago AS d";
			sql += " LEFT JOIN documentospago_facproves AS df ON df.documentoPagoId = d.documentoPagoId";
			sql += " LEFT JOIN facprove AS f ON f.facproveId = df.facproveId";
			sql += " LEFT JOIN antprove AS a ON a.antproveId = df.antproveId";
			sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId";
			sql += " LEFT JOIN proveedores AS p2 ON p2.proveedorId = a.proveedorId";

			if (nombre !== "*") {
				sql = "SELECT d.*,";
				sql += " df.facproveId,";
				sql += " f.numeroFacturaProveedor,";
				sql += " f.ref,"; 
				sql += " f.fecha AS fechaFactura,";
				sql += " f.fecha_recepcion AS fechaRecepcionFactura,";
				sql += " f.total,"
				sql += " f.totalConIva,";
				sql += " f.nombreFacprovePdf,";
				sql += " p.nombre AS proveedorNombre,";
				//
				sql += " df.antproveId,";
				sql += " a.numeroAnticipoProveedor,";
				sql += " a.fecha AS fechaAnticipo,";
				sql += " a.total AS totalAnticipo,"
				sql += " a.totalConIva AS totalConIvaAnticipo,",
				sql += " p2.nombre AS proveedorNombreAnticipo";
				//
				sql += " FROM documentos_pago AS d";
				sql += " LEFT JOIN documentospago_facproves AS df ON df.documentoPagoId = d.documentoPagoId";
				sql += " LEFT JOIN facprove AS f ON f.facproveId = df.facproveId";
				sql += " LEFT JOIN antprove AS a ON a.antproveId = df.antproveId";
				sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId";
				sql += " LEFT JOIN proveedores AS p2 ON p2.proveedorId = a.proveedorId";
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
			sql += " f.fecha_recepcion AS fechaRecepcionFactura,";
			sql += " f.total,"
			sql += " f.totalConIva,",
			sql += " f.nombreFacprovePdf,";
			sql += " p.nombre AS proveedorNombre,";
			//
			sql += " df.antproveId,";
			sql += " a.numeroAnticipoProveedor,";
			sql += " a.fecha AS fechaAnticipo,";
			sql += " a.total AS totalAnticipo,"
			sql += " a.totalConIva AS totalConIvaAnticipo,",
			sql += " p2.nombre AS proveedorNombreAnticipo";
			//
			sql += " FROM documentos_pago AS d";
			sql += " LEFT JOIN documentospago_facproves AS df ON df.documentoPagoId = d.documentoPagoId";
			sql += " LEFT JOIN facprove AS f ON f.facproveId = df.facproveId";
			sql += " LEFT JOIN antprove AS a ON a.antproveId = df.antproveId";
			sql += " LEFT JOIN proveedores AS p ON p.proveedorId = f.proveedorId";
			sql += " LEFT JOIN proveedores AS p2 ON p2.proveedorId = a.proveedorId";
			sql += " WHERE d.documentoPagoId = ?";
			sql = mysql.format(sql, id);
			const [resp] = await conn.query(sql, id);
			await conn.end();
			if(resp.length > 0) {
				documento = resp;
			  	documento = ProcesaDocumentosObj(documento);//procesamos las facturas del documento de pago
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
module.exports.postDocumentoPago = async  (documentoPago) => {
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


module.exports.postDocumentoPagoFacturas = function (docfac, datosArray) {
    let conn = undefined;
	var affectedRows = 0
	return new Promise(async (resolve, reject) => {
		conn = await mysql2.createConnection(obtenerConfiguracion());
		var sql = "";
		try {
		
			for(let f of datosArray){ 
				sql = "INSERT INTO documentospago_facproves";
				sql += " SELECT 0 AS docfacproveId, ? AS documentoPagoId, facproveId, null AS antproveId, null AS codigo, null AS anyo, e.contabilidad AS empresaConta ";
				sql += " FROM facprove AS f";
				sql += " INNER JOIN empresas as e on e.empresaId = f.empresaId"
				sql += " WHERE f.fecha_recepcion >= ? AND f.fecha_recepcion <= ? AND f.facproveId = ? AND contabilizada = 1";
				sql = mysql.format(sql, [docfac.documentoPagoId, docfac.dFecha, docfac.hFecha, f.facprove.facproveId]);
				if (docfac.empresaId > 0) {
					sql += " AND f.empresaId = ?";
					sql = mysql.format(sql, docfac.empresaId);
				}
				if (docfac.departamentoId > 0) {
					sql += " AND f.departamentoId = ?";
					sql = mysql.format(sql, docfac.departamentoId);
				} 
				const [resp] = await conn.query(sql);
				if(resp.affectedRows > 0) {
					affectedRows += resp.affectedRows
				}
			}
			if(affectedRows > 0) {
				resolve('OK');
			} else {
				resolve(null);
			}
			
			
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
module.exports.postDocumentoPagoRegistros = function (docfac) {
    let conn = undefined;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "INSERT INTO documentospago_facproves";
			sql += " SELECT 0 AS docfacproveId, ? AS documentoPagoId, facproveId";
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
			var conf = obtenerConfiguracion();
			var databasePro = conf.database;
			conn = await mysql2.createConnection(obtenerConfiguracion());
			//PRIMERO RECUPERAMOS LA CONTABILIDAD DE LA EMPRESA
			var sql = "SELECT contabilidad FROM empresas"
			sql += " WHERE empresaId = ?";
			sql = mysql.format(sql, empresaId);
			const [resp] = await conn.query(sql);
			
			var db = resp[0].contabilidad;
			await conn.end();
			connDb = await mysql2.createConnection(obtenerConfiguracionDB(db));
			sql ="SELECT t.* FROM transferencias AS t";
			sql += " INNER JOIN pagos AS p ON p.nrodocum = t.codigo AND p.anyodocum = t.anyo"
			sql += " WHERE t.fecha >= ? AND t.fecha <= ? AND t.situacion = 'Q'  AND t.tipotrans = 0";
			sql += " AND NOT (t.codigo, t.anyo) IN";
			sql += " (SELECT DISTINCT codigo, anyo FROM " + databasePro +".documentospago_facproves WHERE empresaConta = ? AND (NOT codigo IS NULL OR NOT anyo IS NULL) )";
			sql += " GROUP BY t.codigo, t.anyo"
			sql = mysql.format(sql, [dFecha, hFecha, db]);
			const [resp2] = await connDb.query(sql);
			await connDb.end();
			documentos = resp2;
				if(resp2.length > 0) {
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

module.exports.getRegistrosContaAnticipos = async (dFecha, hFecha, empresaId) =>{
	let conn = undefined;
	let connDb = undefined;
	var documentos = null;
	return new Promise(async (resolve, reject) => {
		try {
			var conf = obtenerConfiguracion();
			var databasePro = conf.database;
			conn = await mysql2.createConnection(obtenerConfiguracion());
			//PRIMERO RECUPERAMOS LA CONTABILIDAD DE LA EMPRESA
			var sql = "SELECT contabilidad FROM empresas"
			sql += " WHERE empresaId = ?";
			sql = mysql.format(sql, empresaId);
			const [resp] = await conn.query(sql);
			if(resp[0].contabilidad == '' || resp[0].contabilidad == null) {
				await conn.end();
				resp[0].contabilidad = 'noConta';
				return resolve(resp);
			} 
			var db = resp[0].contabilidad;
			await conn.end();
			connDb = await mysql2.createConnection(obtenerConfiguracionDB(db));
			sql = "SELECT t.* FROM pagos AS p";
			sql += " LEFT JOIN transferencias AS t ON t.codigo = p.nrodocum  AND  t.anyo = p.anyodocum";
			sql += " LEFT JOIN " + databasePro +".proveedores AS pr ON pr.cuentaContable = p.codmacta ";
  			sql += " LEFT JOIN " + databasePro +".antprove AS a ON a.numeroAnticipoProveedor = p.numfactu AND a.proveedorId = pr.proveedorId AND a.fecha = p.fecfactu";
			sql += " WHERE (t.fecha >= ? AND t.fecha <= ? AND t.situacion = 'Q')"; 
			sql +=" AND NOT a.antproveId IN (SELECT antproveId FROM " + databasePro +".facprove_antproves) AND a.completo = 0";
			sql += " AND NOT (t.codigo, t.anyo) IN";
			sql += " (SELECT DISTINCT codigo, anyo FROM " + databasePro +".documentospago_facproves WHERE empresaConta = ? AND (NOT codigo IS NULL OR NOT anyo IS NULL) )";
			sql += " GROUP BY t.codigo, t.anyo";
			//sql += " (SELECT DISTINCT codigo, anyo FROM " + databasePro +".documentospago_facproves WHERE empresaConta = ? AND (NOT codigo IS NULL OR NOT anyo IS NULL) )";
			sql = mysql.format(sql, [dFecha, hFecha, db]);
			const [resp2] = await connDb.query(sql);
			await connDb.end();
			documentos = resp2;
				if(resp2.length > 0) {
					
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
			var db = resp[0].contabilidad;
			await conn.end();
			connDb = await mysql2.createConnection(obtenerConfiguracionDB(db));
			sql ="SELECT t.* FROM transferencias AS t";
			sql += " WHERE t.fecha >= ? AND t.fecha <= ? AND t.situacion = 'Q'";
			sql = mysql.format(sql, [dFecha, hFecha]);
			const [resp2] = await connDb.query(sql);
			await connDb.end();
			documentos = resp2;
				if(resp.length > 0) {
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


module.exports.postRegistrosContaFacturas = async (docfac) =>{
	let conn = undefined;
	let connDb = undefined;
	var documentos = null;
	var arr = [];
	var afected = 0
	return new Promise(async (resolve, reject) => {
		try {
			var conf = obtenerConfiguracion();
			var databasePro = conf.database;
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
				sql =" INSERT INTO " + databasePro +".documentospago_facproves";
				sql += " (";
				sql += " SELECT DISTINCT";
				sql += " 0 AS docfacproveId, ";
				sql += " ? AS documentoPagoId, ";
				sql += " f.facproveId,"
				sql += " NULL AS antproveId,";
				sql += " ? AS codigo, ";
				sql += " ? AS anyo,";
				sql += " ? AS empresaConta";
				sql = mysql.format(sql, [docfac.documentoPagoId, m.nrodocum, m.anyodocum, db]);
  				sql += " FROM transferencias AS t";
  				sql += " LEFT JOIN pagos AS p ON p.nrodocum = t.codigo AND p.anyodocum = t.anyo";
  				sql += " LEFT JOIN " + databasePro +".proveedores AS pr ON pr.cuentaContable = p.codmacta ";
  				sql += " LEFT JOIN " + databasePro +".facprove AS f ON f.numeroFacturaProveedor = p.numfactu AND f.proveedorId = pr.proveedorId AND f.fecha = p.fecfactu";
  				sql += " WHERE t.fecha >= ? AND t.fecha <= ? AND t.situacion = 'Q' AND t.tipotrans = 0 AND t.codigo = ? AND t.anyo  = ? AND NOT f.facproveId IS NULL AND f.contabilizada = 1";
				sql = mysql.format(sql, [docfac.dFecha, docfac.hFecha, m.nrodocum, m.anyodocum]);
				sql += " AND f.facproveId NOT IN (SELECT facproveId FROM " + databasePro +".documentospago_facproves WHERE codigo = ? AND anyo = ? AND empresaConta = ? AND NOT facproveId IS NULL)";
				sql = mysql.format(sql, [m.nrodocum, m.anyodocum, db]);
				
				sql += " )";
				sql += " UNION";//FACTURAS CON ANTICIPOS SIN RELACIÓN CON FACTPRO
				sql += " (";
				sql += " SELECT DISTINCT";
				sql += " 0 AS docfacproveId, ";
				sql += " ? AS documentoPagoId, ";
				sql += " COALESCE(fa.facproveId, f.facproveId) AS facproveId,";
				sql += " NULL AS antproveId,";
				sql += " ? AS codigo, ";
				sql += " ? AS anyo,";
				sql += " ? AS empresaConta"
				sql = mysql.format(sql, [docfac.documentoPagoId, m.nrodocum, m.anyodocum, db]);
				sql += " FROM " + databasePro +".antprove AS a";
				sql += " LEFT JOIN proasistencia.proveedores AS pr ON pr.proveedorId = a.proveedorId";
				sql += " INNER JOIN";
				sql += " (";
				sql += " SELECT  DISTINCT";
				sql += " p.numfactu, p.fecfactu, p.codmacta";
				sql += " FROM transferencias AS t";
				sql += " LEFT JOIN pagos AS p ON p.nrodocum = t.codigo AND p.anyodocum = t.anyo";
				sql += " LEFT JOIN " + databasePro +".proveedores AS pr ON pr.cuentaContable = p.codmacta ";
				sql += " LEFT JOIN " + databasePro +".facprove AS f ON f.numeroFacturaProveedor = p.numfactu AND f.proveedorId = pr.proveedorId AND f.fecha = p.fecfactu";
				sql += " WHERE t.fecha >= ? AND t.fecha <= ? AND t.situacion = 'Q'  AND t.tipotrans = 0 AND t.codigo = ? AND t.anyo  = ?";
				sql = mysql.format(sql, [docfac.dFecha, docfac.hFecha, m.nrodocum, m.anyodocum]);
				sql += " AND f.facproveId  IS NULL";
				//sql += " AND f.facproveId NOT IN (SELECT facproveId FROM " + databasePro +".documentospago_facproves)";
				sql += " ) AS tmp ON tmp.numfactu  = a.numeroAnticipoProveedor AND tmp.fecfactu = a.fecha AND tmp.codmacta = pr.cuentaContable";
				sql += " LEFT JOIN " + databasePro +".facprove_antproves AS fa ON fa.antproveId = a.antproveId";
				sql += " INNER JOIN " + databasePro +".facprove AS f ON f.facproveId = fa.facproveId OR f.facproveId = a.facproveId";
				sql += " WHERE f.contabilizada = 1";
				sql += " AND f.facproveId NOT IN (SELECT facproveId FROM " + databasePro +".documentospago_facproves WHERE codigo = ? AND anyo = ? AND empresaConta = ? AND NOT facproveId IS NULL)";
				sql = mysql.format(sql, [m.nrodocum, m.anyodocum, db]);
				sql += " )";
				const [resp2] = await connDb.query(sql);
				afected += resp2.affectedRows 
			}
			await connDb.end();
			resolve (afected);
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

module.exports.postRegistrosContaAnticipos = async (docfac) =>{
	let conn = undefined;
	let connDb = undefined;
	var documentos = null;
	var arr = [];
	var afected = 0
	return new Promise(async (resolve, reject) => {
		try {
			var conf = obtenerConfiguracion();
			var databasePro = conf.database;
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
				sql =" INSERT INTO " + databasePro +".documentospago_facproves";
				sql += " SELECT DISTINCT";
				sql += " 0 AS docfacproveId, ";
				sql += " ? AS documentoPagoId, ";
				sql += " NULL AS facproveId,";
				sql += " a.antproveId,"
				sql += " ? AS codigo, ";
				sql += " ? AS anyo,";
				sql += " ? AS empresaConta";
				sql = mysql.format(sql, [docfac.documentoPagoId, m.nrodocum, m.anyodocum, db]);
  				sql += " FROM transferencias AS t";
  				sql += " LEFT JOIN pagos AS p ON p.nrodocum = t.codigo AND p.anyodocum = t.anyo";
  				sql += " LEFT JOIN " + databasePro +".proveedores AS pr ON pr.cuentaContable = p.codmacta ";
  				sql += " LEFT JOIN " + databasePro +".antprove AS a ON a.numeroAnticipoProveedor = p.numfactu AND a.proveedorId = pr.proveedorId AND a.fecha = p.fecfactu";
  				sql += " WHERE t.fecha >= ? AND t.fecha <= ? AND t.situacion = 'Q' AND t.tipotrans = 0 AND t.codigo = ? AND t.anyo  = ? AND NOT a.antproveId IS NULL AND a.contabilizada = 1 AND a.completo = 0";
				sql = mysql.format(sql, [docfac.dFecha, docfac.hFecha, m.nrodocum, m.anyodocum]);
				sql += " AND a.antproveId NOT IN (SELECT antproveId FROM " + databasePro +".documentospago_facproves WHERE codigo = ? AND anyo = ? AND empresaConta = ? AND NOT antproveId IS NULL)";
				sql = mysql.format(sql, [m.nrodocum, m.anyodocum, db]);
				sql += " AND NOT a.antproveId IN (SELECT antproveId FROM proasistencia.facprove_antproves)";
			
				const [resp2] = await connDb.query(sql);
				afected += resp2.affectedRows 
			}
			await connDb.end();
			resolve (afected);
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

module.exports.postDocumentoPagoAnticipos = function (docant) {
    let conn = undefined;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "INSERT INTO documentospago_facproves";
			sql += " SELECT 0 AS docfacproveId, ? AS documentoPagoId, NULL AS facproveId, antproveId, null AS codigo, null AS anyo, e.contabilidad AS empresaConta ";
			sql += " FROM antprove AS f";
			sql += " INNER JOIN empresas as e on e.empresaId = f.empresaId"
			sql += " WHERE f.fecha >= ? AND f.fecha <= ? AND f.sel = 1 AND contabilizada = 1";
			sql += " AND (facproveId IS NULL AND antproveId NOT IN (SELECT antproveId FROM facprove_antproves WHERE NOT antproveId IS NULL))";
			sql += " AND f.antproveId NOT IN (SELECT antproveId FROM documentospago_facproves WHERE NOT antproveId IS NULL)";
			sql = mysql.format(sql, [docant.documentoPagoId, docant.dFecha, docant.hFecha]);
			if (docant.empresaId > 0) {
				sql += " AND f.empresaId = ?";
				sql = mysql.format(sql, docant.empresaId);
			}
			if (docant.departamentoId > 0) {
				sql += " AND f.departamentoId = ?";
				sql = mysql.format(sql, docant.departamentoId);
			} 
			const [resp] = await conn.query(sql);
			if(resp.affectedRows == 0) {
				resolve(null);
			}
			//quitamos la marca de seleccionadas
			sql = "UPDATE antprove set sel = 0";
			sql += " WHERE fecha >= ? AND fecha <= ? AND sel = 1 AND contabilizada = 1";
			sql += " AND (facproveId IS NULL AND antproveId NOT IN (SELECT antproveId FROM facprove_antproves WHERE NOT antproveId IS NULL))";
			sql = mysql.format(sql, [docant.dFecha, docant.hFecha]);
			if (docant.empresaId > 0) {
				sql += " AND empresaId = ?";
				sql = mysql.format(sql, docant.empresaId);
			}
			if (docant.departamentoId > 0) {
				sql += " AND departamentoId = ?";
				sql = mysql.format(sql, docant.departamentoId);
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


module.exports.getRegistroContaFactura = async (codigo, anyo, empresaId) =>{
	let conn = undefined;
	let connDb = undefined;
	var documentos = null;
	var arr = [];
	return new Promise(async (resolve, reject) => {
		try {
			var conf = obtenerConfiguracion();
			var databasePro = conf.database;
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
				sql += " 	1 AS numserie,";
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
  				sql += " 	LEFT JOIN " + databasePro +".proveedores AS pr ON pr.cuentaContable = p.codmacta ";
  				sql += " 	LEFT JOIN " + databasePro +".facprove AS f ON f.numeroFacturaProveedor = p.numfactu AND f.proveedorId = pr.proveedorId AND f.fecha = p.fecfactu";
				sql += " 	LEFT JOIN " + databasePro +".formas_pago AS fp ON fp.formaPagoId = f.formaPagoId";
  				sql += " 	WHERE t.situacion = 'Q'  AND t.tipotrans = 0 AND p.nrodocum = ? AND p.anyodocum  = ? AND NOT f.facproveId IS NULL";
				sql = mysql.format(sql, [codigo, anyo]);
				sql += " 	AND f.facproveId NOT IN (SELECT facproveId FROM " + databasePro +".documentospago_facproves WHERE codigo = ? AND anyo = ? AND empresaConta = ? AND NOT facproveId IS NULL)";
				sql = mysql.format(sql, [codigo, anyo, db]);
				sql += " )";
				sql += " UNION";//FACTURAS CON ANTICIPOS SIN RELACIÓN CON FACTCLI
				sql += " (";
				sql += " SELECT DISTINCT";
				sql += " 	1 AS numserie,";
				sql += " 	f.facproveId,";
				sql += " 	f.emisorNombre,";
				sql += " 	f.receptorNombre,";
				sql += " 	f.numeroFacturaProveedor,";
				sql += " 	f.ref,";
				sql += " 	f.fecha,";
				sql += " 	f.total,";
				sql += " 	f.totalConIva,";
				sql += " 	fp.nombre AS formaPago";
				sql += " FROM " + databasePro +".antprove AS a";
				sql += " INNER JOIN";
				sql += " (";
				sql += "   SELECT  ";
				sql += "   p.numfactu, p.fecfactu";
				sql += "   FROM transferencias AS t";
				sql += "   LEFT JOIN pagos AS p ON p.nrodocum = t.codigo AND p.anyodocum = t.anyo";
				sql += "   LEFT JOIN " + databasePro +".proveedores AS pr ON pr.cuentaContable = p.codmacta ";
				sql += "   LEFT JOIN " + databasePro +".facprove AS f ON f.numeroFacturaProveedor = p.numfactu AND f.proveedorId = pr.proveedorId AND f.fecha = p.fecfactu";
				sql += "   WHERE t.situacion = 'Q'  AND t.tipotrans = 0 AND p.nrodocum = ? AND p.anyodocum  = ?";
				sql = mysql.format(sql, [codigo, anyo]);
				sql += "   AND f.facproveId  IS NULL";
				sql += " ) AS tmp ON tmp.numfactu  = a.numeroAnticipoProveedor AND tmp.fecfactu = a.fecha";
				sql += " LEFT JOIN " + databasePro +".facprove_antproves AS fa ON fa.antproveId = a.antproveId";
				sql += " LEFT JOIN " + databasePro +".facprove AS f ON f.facproveId = fa.facproveId OR f.antproveId = a.antproveId";
				sql += " LEFT JOIN " + databasePro +".formas_pago AS fp ON fp.formaPagoId = f.formaPagoId";
				sql += " WHERE f.facproveId NOT IN (SELECT facproveId FROM " + databasePro +".documentospago_facproves WHERE codigo = ? AND anyo = ? AND empresaConta = ? AND NOT facproveId IS NULL)";
				sql = mysql.format(sql, [codigo, anyo, db]);
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

module.exports.getRegistroContaAnticipo = async (codigo, anyo, empresaId) =>{
	let conn = undefined;
	let connDb = undefined;
	var documentos = null;
	var arr = [];
	return new Promise(async (resolve, reject) => {
		try {
			var conf = obtenerConfiguracion();
			var databasePro = conf.database;
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
				sql = " SELECT DISTINCT";
				sql += " 	9 AS numserie,";
				sql += " 	a.antproveId,";
				sql += " 	a.emisorNombre,";
				sql += " 	a.receptorNombre,";
				sql += " 	a.numeroAnticipoProveedor,";
				sql += " 	a.fecha,";
				sql += " 	a.total,";
				sql += " 	a.totalConIva,";
				sql += " 	fp.nombre AS formaPago";
				sql += " FROM " + databasePro +".antprove AS a";
				sql += " INNER JOIN";
				sql += " (";
				sql += "   SELECT  ";
				sql += "   p.numfactu, p.fecfactu";
				sql += "   FROM pagos AS p";
				sql += "   INNER JOIN transferencias AS t ON  t.codigo = p.nrodocum AND  t.anyo = p.anyodocum";
				sql += "   INNER JOIN " + databasePro +".proveedores AS pr ON pr.cuentaContable = p.codmacta ";
				sql += "   INNER JOIN " + databasePro +".antprove AS a ON a.numeroAnticipoProveedor = p.numfactu AND a.proveedorId = pr.proveedorId AND a.fecha = p.fecfactu";
				sql += "   WHERE t.situacion = 'Q'  AND t.tipotrans = 0 AND p.nrodocum = ? AND p.anyodocum  = ? AND p.numserie = 9";
				sql = mysql.format(sql, [codigo, anyo]);
				sql += " ) AS tmp ON tmp.numfactu  = a.numeroAnticipoProveedor AND tmp.fecfactu = a.fecha";
				sql += " LEFT JOIN " + databasePro +".formas_pago AS fp ON fp.formaPagoId = a.formaPagoId";
				sql +=" WHERE ((a.facproveId IS NULL AND a.completo = 1) OR (NOT a.antproveId IN (SELECT antproveId FROM " + databasePro +".facprove_antproves) AND completo = 0))";
				sql += " AND a.antproveId NOT IN (SELECT antproveId FROM " + databasePro +".documentospago_facproves WHERE codigo = ? AND anyo = ? AND empresaConta = ? AND NOT antproveId IS NULL)";
				sql = mysql.format(sql, [codigo, anyo, db]);
				
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


module.exports.DeletedocumentospagoFacprove = async(docpago) =>{
	let conn = undefined;
	var doc = null;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			for(let d of docpago){
				//miramos primero si tiene anticipo asociado
				var sql = "SELECT * FROM documentospago_facproves WHERE documentoPagoId = ? AND facproveId = ?";
				sql = mysql.format(sql, [d.documentoPagoId, d.facproveId]);
				const [resp] = await conn.query(sql);
				doc = resp[0];
				if(doc.antproveId) {
					sql = "UPDATE documentospago_facproves SET facproveId = NULL WHERE documentoPagoId = ? AND facproveId = ?";
					sql = mysql.format(sql, [d.documentoPagoId, d.facproveId]);

				} else {
					sql = "DELETE FROM documentospago_facproves WHERE documentoPagoId = ? AND facproveId = ?";
					sql = mysql.format(sql, [d.documentoPagoId, d.facproveId]);
				}
				const [resp2] = await conn.query(sql);
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

module.exports.DeletedocumentospagoAntprove = async(docpago) =>{
	let conn = undefined;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			for(let d of docpago){
				//miramos primero si tiene anticipo asociado
				var sql = "SELECT * FROM documentospago_facproves WHERE documentoPagoId = ? AND antproveId = ?";
				sql = mysql.format(sql, [d.documentoPagoId, d.antproveId]);
				const [resp] = await conn.query(sql);
				doc = resp[0];
				if(doc.facproveId) {
					sql = "UPDATE documentospago_facproves SET antproveId = NULL WHERE documentoPagoId = ? AND antproveId = ?";
					sql = mysql.format(sql, [d.documentoPagoId, d.antproveId]);

				} else {
					var sql = "DELETE FROM documentospago_facproves WHERE documentoPagoId = ? AND antproveId = ?";
					sql = mysql.format(sql, [d.documentoPagoId, d.antproveId]);
				}
				const [resp2] = await conn.query(sql);
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
	//if((doc.length == 1 && !doc[0].facproveId) || (doc.length == 1 && !doc[0].antproveId)) return doc;
	var antdoc = null;
	var cont = 1;
	var regs = [];
	var facObj = {
		
	};
	var antObj = {
		
	};
	var docObj = {
		
	};

	doc.forEach(d => {
		//el primer registro siempre se procesa
		if(antdoc) {
			// si se trata de el mismo documento de pago solo adjuntamos la factura
			if(antdoc == d.documentoPagoId ) {
				if(d.facproveId) {//procesamos las facturas
					facObj = {
						facproveId: d.facproveId,
						numeroFacturaProveedor: d.numeroFacturaProveedor,
						ref: d.ref,
						fechaFactura: d.fechaFactura,
						fechaRecepcionFactura: d.fechaRecepcionFactura,
						total: d.total,
						totalConIva: d.totalConIva,
						pdfFactura: d.nombreFacprovePdf,
						proveedorNombre: d.proveedorNombre
					};
					
					docObj.facturas.push(facObj);
					facObj = {}; //una vez incluida la factura en el documento se limpian los datos
				}

				if(d.antproveId) {//procesamos los anticipos
					antObj = {
						antproveId: d.antproveId,
						numeroAnticipoProveedor: d.numeroAnticipoProveedor,
						fechaAnticipo: d.fechaAnticipo,
						totalAnticipo: d.totalAnticipo,
						totalConIvaAnticipo: d.totalConIvaAnticipo,
						proveedorNombreAnticipo: d.proveedorNombreAnticipo
					};
					
					docObj.anticipos.push(antObj);
					antObj = {}; //una vez incluida la factura en el documento se limpian los datos
				}
				
			} else  {
				//si es otro documento de pago guardamos el anterior y creamos otro
				regs.push(docObj);
				docObj = {
					documentoPagoId: d.documentoPagoId,
					nombre: d.nombre,
					pdf: d.pdf,
					fecha: d.fecha,
					facturas: [],
					anticipos: []
				};
				if(d.facproveId) {//procesamos las facturas
					facObj = {
						facproveId: d.facproveId,
						numeroFacturaProveedor: d.numeroFacturaProveedor,
						ref: d.ref,
						fechaFactura: d.fechaFactura,
						fechaRecepcionFactura: d.fechaRecepcionFactura,
						total: d.total,
						totalConIva: d.totalConIva,
						pdfFactura: d.nombreFacprovePdf,
						proveedorNombre: d.proveedorNombre
					};
					docObj.facturas.push(facObj);
					facObj = {}; //una vez incluida la factura en el documento se limpian los datos
				}

				if(d.antproveId) {//procesamos los anticipos
					antObj = {
						antproveId: d.antproveId,
						numeroAnticipoProveedor: d.numeroAnticipoProveedor,
						fechaAnticipo: d.fechaAnticipo,
						totalAnticipo: d.totalAnticipo,
						totalConIvaAnticipo: d.totalConIvaAnticipo,
						proveedorNombreAnticipo: d.proveedorNombreAnticipo
					};
					
					docObj.anticipos.push(antObj);
					antObj = {}; //una vez incluida la factura en el documento se limpian los datos
				}
				
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
				anticipos: []
			};
			if(d.facproveId) {//procesamos las facturas
				facObj = {
					facproveId: d.facproveId,
					numeroFacturaProveedor: d.numeroFacturaProveedor,
					ref: d.ref,
					fechaFactura: d.fechaFactura,
					fechaRecepcionFactura: d.fechaRecepcionFactura,
					total: d.total,
					totalConIva: d.totalConIva,
					pdfFactura: d.nombreFacprovePdf,
					proveedorNombre: d.proveedorNombre
				};
				docObj.facturas.push(facObj);
				facObj = {}; //una vez incluida la factura en el documento se limpian los datos
			}
			if(d.antproveId) {//procesamos los anticipos
				antObj = {
					antproveId: d.antproveId,
					numeroAnticipoProveedor: d.numeroAnticipoProveedor,
					fechaAnticipo: d.fechaAnticipo,
					totalAnticipo: d.totalAnticipo,
					totalConIvaAnticipo: d.totalConIvaAnticipo,
					proveedorNombreAnticipo: d.proveedorNombreAnticipo
				};
				
				docObj.anticipos.push(antObj);
				antObj = {}; //una vez incluida la factura en el documento se limpian los datos
			}
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



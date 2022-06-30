// unidades_db_mysql
// Manejo de la tabla unidades en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
var async = require("async"); // librería para el manejo de llamadas asíncronas en JS
const mysql2 = require('mysql2/promise') ;


//  leer la configurción de MySQL

var sql = "";

/// getConnection 
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
	comprobado = (comprobado && documentoPago.hasOwnProperty("pdf"));
	comprobado = (comprobado && documentoPago.hasOwnProperty("facproveId"));
	return comprobado;
}



module.exports.getDocumentosPago = async () =>{
	let conn = undefined;
	var documentos = null;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "SELECT d.*, df.facproveId, f.numeroFacturaProveedor, f.ref FROM documentos_pago AS d";
			sql += " LEFT JOIN documentospago_facproves AS df ON df.documentoPagoId = d.documentoPagoId";
			sql += " LEFT JOIN facprove AS f ON f.facproveId = df.facproveId";
			const [resp] = await conn.query(sql);
			documentos = resp;
			await conn.end();
			if(resp.length > 0) { 
				documentos = resp;
				documentos = ProcesaDocumentosObj(documentos);
			}
			resolve (documentos);
			
		} catch (error) {
			if (conn) await conn.end()
			reject (error)
		}

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
			sql += " f.ref"; 
			sql += " f.fecha,";
			sql += " f.total,"
			sql += " f.totalconIva"
			sql += " FROM documentos_pago AS d";
			sql += " LEFT JOIN documentospago_facproves AS df ON df.documentoPagoId = d.documentoPagoId";
			sql += " LEFT JOIN facprove AS f ON f.facproveId = df.facproveId";

			if (nombre !== "*") {
				sql = "SELECT d.*, df.facproveId, f.numeroFacturaProveedor, f.ref FROM documentos_pago AS d";
				sql += " LEFT JOIN documentospago_facproves AS df ON df.documentoPagoId = d.documentoPagoId";
				sql += " LEFT JOIN facprove AS f ON f.facproveId = df.facproveId";
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
			if (conn) await conn.end()
			reject (error)
		}
	});
}

var ProcesaDocumentosObj = function(doc) {
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
					fecha: d.fecha,
					total: d.total,
					totalConIva: d.totalConIva
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
					numero: d.numero,
					facturas: [],
				};
				facObj = {
					facproveId: d.facproveId,
					numeroFacturaProveedor: d.numeroFacturaProveedor,
					ref: d.ref,
					fecha: d.fecha,
					total: d.total,
					totalConIva: d.totalConIva
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
				numero: d.numero,
				facturas: []
			};
			facObj = {
				facproveId: d.facproveId,
				numeroFacturaProveedor: d.numeroFacturaProveedor,
				ref: d.ref,
				fecha: d.fecha,
				total: d.total,
				totalConIva: d.totalConIva
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
			sql += " f.fecha,";
			sql += " f.total,"
			sql += " f.totalconIva"
			sql += " FROM documentos_pago AS d";
			sql += " LEFT JOIN documentospago_facproves AS df ON df.documentoPagoId = d.documentoPagoId";
			sql += " LEFT JOIN facprove AS f ON f.facproveId = df.facproveId";
			sql += " WHERE d.documentoPagoId = ?";
			sql = mysql.format(sql, id);
	
				const [resp] = await conn.query(sql, id);
				await conn.end();
				if(resp.length > 0) {
					documento = resp;
					documento = ProcesaDocumentosObj(documento);
				}
				resolve (documento[0]);
	
		} catch (error) {
			if (conn) await conn.end()
			reject (error)
		}
	});
}

// postDocumentoPago
module.exports.postDocumentoPago = async function (documentoPago, conn) {
	var r = 0
	//let conn = undefined;
	return new Promise(async (resolve, reject) => {
		try {
			if (!comprobarDocumentoPago(documentoPago)){
				throw new Error ("El documento de pago pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
			}
			
				
				var sql = "INSERT INTO documentos_pago SET ?";
				sql = mysql.format(sql, documentoPago);
				const [resp] = await conn.query(sql);
				documentoPago.documentoPagoId = resp.insertId;
			
				//await conn.end()
				resolve(conn);
			

		}  catch (error) {
			//if (conn) conn.end()
			reject (error)
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
			if (conn) await conn.end()
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
			sql = mysql.format(sql, documentoPago.documentoPagoId);
			const [resp] = await conn.query(sql);
			await conn.end();
			resolve (resp);
		} catch (error) {
			if (conn) await conn.end()
			reject (error)
		}
	});
}
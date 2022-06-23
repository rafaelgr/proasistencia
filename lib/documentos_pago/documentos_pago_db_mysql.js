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
	var unidades = null;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "SELECT * FROM documentos_pago";
			const [resp] = await conn.query(sql);
			unidades = resp;
			await conn.end();
			if(resp.length > 0) unidades = resp[0]
			resolve (unidades);
			
		} catch (error) {
			if (conn) await conn.end()
			reject (error)
		}

	});
}




module.exports.getDocumentosPagoBuscar = async (nombre) => {
    let conn = undefined;
	var unidades = null;
	return new Promise(async (resolve, reject) => {
		try {
			conn = await mysql2.createConnection(obtenerConfiguracion());
			var sql = "SELECT * FROM documentos_pago";
			if (nombre !== "*") {
				sql = "SELECT * FROM documentos_pago WHERE nombre LIKE ?";
				sql = mysql.format(sql, '%' + nombre + '%');
			}
			const [resp] = await conn.query(sql);
			unidades = resp;
			await conn.end();
			if(resp.length > 0) unidades = resp
			resolve (unidades);
			
		} catch (error) {
			if (conn) await conn.end()
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
			var sql = "SELECT * FROM documentos_pago WHERE documentoPagoId = ?";
			sql = mysql.format(sql, id);
	
				const [resp] = await conn.query(sql, id);
				await conn.end();
				if(resp.length > 0) documento = resp[0]
				resolve (documento);
	
		} catch (error) {
			if (conn) await conn.end()
			reject (error)
		}
	});
}

// postDocumentoPago
module.exports.postDocumentoPago = async (documentoPago) =>{
	let conn = undefined;
	var facproves = documentoPago.facproves;
	delete  documentoPago.facproves;
	return new Promise(async (resolve, reject) => {
		try {
			if (!comprobarDocumentoPago(documentoPago)){
				throw new Error ("El documento de pago pasado es incorrecto, no es un objeto de este tipo o le falta algún atributo olbligatorio");
			}
			conn = await mysql2.createConnection(obtenerConfiguracion());
			facproves.array.forEach(f => {
				documentoPago.documentoPagoId = 0; // fuerza el uso de autoincremento
				documentoPago.facproveId = f
				var sql = "INSERT INTO documentos_pago SET ?";
				sql = mysql.format(sql, documentoPago);
				const [resp] = await conn.query(sql);
				documentoPago.documentoPagoId = resp.insertId;
			});
			await conn.end()
			resolve(documentoPago);

		}  catch (error) {
			if (conn) await conn.end()
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
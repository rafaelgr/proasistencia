// unidades_db_mysql
// Manejo de la tabla unidades en la base de datos
var mysql = require("mysql"); // librería para el acceso a bases de datos MySQL
const mysql2 = require('mysql2/promise') ;



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
			sql += " f.totalConIva"
			sql += " FROM documentos_pago AS d";
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
			sql += " f.ref,"; 
			sql += " f.fecha AS fechaFactura,";
			sql += " f.total,"
			sql += " f.totalConIva"
			sql += " FROM documentos_pago AS d";
			sql += " LEFT JOIN documentospago_facproves AS df ON df.documentoPagoId = d.documentoPagoId";
			sql += " LEFT JOIN facprove AS f ON f.facproveId = df.facproveId";

			if (nombre !== "*") {
				sql = "SELECT d.*,";
				sql += " df.facproveId,";
				sql += " f.numeroFacturaProveedor,";
				sql += " f.ref,"; 
				sql += " f.fecha AS fechaFactura,";
				sql += " f.total,"
				sql += " f.totalConIva"
				sql += " FROM documentos_pago AS d";
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
					fecha: d.fecha,
					facturas: [],
				};
				facObj = {
					facproveId: d.facproveId,
					numeroFacturaProveedor: d.numeroFacturaProveedor,
					ref: d.ref,
					fechaFactura: d.fechaFactura,
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
				fecha: d.fecha,
				facturas: [],
			};
			facObj = {
				facproveId: d.facproveId,
				numeroFacturaProveedor: d.numeroFacturaProveedor,
				ref: d.ref,
				fechaFactura: d.fechaFactura,
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
			sql += " f.fecha AS fechaFactura,";
			sql += " f.total,"
			sql += " f.totalConIva"
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
			if (conn) await conn.end();
			reject (error)
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
			if (conn) await conn.end();
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


//LINEAS DE DOCUMENTOS DE PAGO


module.exports.postDocuemntoPagoFacturas = function (docfac) {
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
			if (conn) await conn.end()
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
			if (conn) await conn.end()
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
			sql = mysql.format(sql, [dFecha, hFecha]);
			const [resp2] = await connDb.query(sql);
			await connDb.end();
				if(resp.length > 0) {
					documentos = resp2;
					documentos = procesaClaveCompuesta(documentos)
				}
				resolve (documentos);
	
		} catch (error) {
			if (conn) await conn.end();
			if (connDb) await connDb.end();
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
				sql += " 	SELECT  ";
				sql += " 	0 AS docfacproveId, ";
				sql += " 	? AS documentoPagoId, ";
				sql = mysql.format(sql, [docfac.documentoPagoId]);
				sql += " 	f.facproveId";
  				sql += " 	FROM transferencias AS t";
  				sql += " 	LEFT JOIN pagos AS p ON p.nrodocum = t.codigo AND p.anyodocum = t.anyo";
  				sql += " 	LEFT JOIN proasistencia.proveedores AS pr ON pr.cuentaContable = p.codmacta ";
  				sql += " 	LEFT JOIN proasistencia.facprove AS f ON f.numeroFacturaProveedor = p.numfactu AND f.proveedorId = pr.proveedorId AND f.fecha = p.fecfactu";
  				sql += " 	WHERE t.fecha >= ? AND t.fecha <= ? AND t.situacion = 'Q'  AND p.nrodocum = ? AND p.anyodocum  = ? AND NOT f.facproveId IS NULL";
				sql = mysql.format(sql, [docfac.dFecha, docfac.hFecha, m.nrodocum, m.anyodocum]);
				sql += " )";
				sql += " UNION";
				sql += " (";
				sql += " SELECT ";
				sql += " 0 AS docfacproveId, ";
				sql += " ? AS documentoPagoId, ";
				sql = mysql.format(sql, [docfac.documentoPagoId]);
				sql += " COALESCE(fa.facproveId, f.facproveId) AS facproveId";
				sql += " FROM proasistencia.antprove AS a";
				sql += " INNER JOIN";
				sql += " (";
				sql += "   SELECT  ";
				sql += "   p.numfactu, p.fecfactu";
				sql += "   FROM transferencias AS t";
				sql += "   LEFT JOIN pagos AS p ON p.nrodocum = t.codigo AND p.anyodocum = t.anyo";
				sql += "   LEFT JOIN proasistencia.proveedores AS pr ON pr.cuentaContable = p.codmacta ";
				sql += "   LEFT JOIN proasistencia.facprove AS f ON f.numeroFacturaProveedor = p.numfactu AND f.proveedorId = pr.proveedorId AND f.fecha = p.fecfactu";
				sql += "   WHERE t.fecha >= ? AND t.fecha <= ? AND t.situacion = 'Q'  AND p.nrodocum = ? AND p.anyodocum  = ?";
				sql = mysql.format(sql, [docfac.dFecha, docfac.hFecha, m.nrodocum, m.anyodocum]);
				sql += "   AND f.facproveId  IS NULL";
				sql += " ) AS tmp ON tmp.numfactu  = a.numeroAnticipoProveedor AND tmp.fecfactu = a.fecha";
				sql += " LEFT JOIN proasistencia.facprove_antproves AS fa ON fa.antproveId = a.antproveId";
				sql += " LEFT JOIN proasistencia.facprove AS f ON f.facproveId = a.facproveId";
				sql += " )";
				const [resp2] = await connDb.query(sql);
			}
			await connDb.end();
			resolve (docfac);
		} catch (error) {
			if (conn) await conn.end();
			if (connDb) await connDb.end();
			reject (error)
		}
	});
}

var procesaClaveCompuesta = function(d) {
	d.forEach(e => {
		e.codigo = e.codigo + "-" + e.anyo 
	});
	return d;
}


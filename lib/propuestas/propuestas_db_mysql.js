try {
    const Stimulsoft = require("stimulsoft-reports-js");
    const mysql2 = require('mysql2/promise');
    const fs = require("fs");
    const path = require("path");

    const moment = require("moment");
    // cargar el idioma español
    require("moment/locale/es");





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
        connection.connect(function (err) {
            if (err) throw err;
        });
        return connection;
    }
    // closeConnection
    // función auxiliar para cerrar una conexión
    function closeConnection(connection) {
        connection.end(function (err) {
            if (err) {
                throw err;
            }
        });
    }

    function closeConnectionCallback(connection, callback) {
        connection.end(function (err) {
            if (err) callback(err);
        });
    }

    const obtenerConfiguracion = function () {
        return configuracion = {
            host: process.env.BASE_MYSQL_HOST,
            user: process.env.BASE_MYSQL_USER,
            password: process.env.BASE_MYSQL_PASSWORD,
            database: process.env.BASE_MYSQL_DATABASE,
            port: process.env.BASE_MYSQL_PORT,
            charset: process.env.BASE_MYSQL_CHARSET
        }
    }

    // comprobarArticulo
    // comprueba que tiene la estructura de objeto mínima
    // necesaria para guardarlo en la base de datos
    // Por ejemplo, que es del tipo correcto y tiene los atributos 
    // adecuados.
    function comprobarPropuesta(propuesta) {
        // debe ser objeto del tipo que toca
        var comprobado = "object" === typeof articulo;
        // en estas propiedades no se admiten valores nulos
        comprobado = (comprobado && propuesta.hasOwnProperty("propuestaId"));
        comprobado = (comprobado && propuesta.hasOwnProperty("proveedorId"));
        comprobado = (comprobado && propuesta.hasOwnProperty("tipoProveedorId"));
        return comprobado;
    }

    // getArticulo
    // busca  el articulo con id pasado
    module.exports.getPropuestasSubcontrata = async (id, esGanadora, propuestaId) => {
        let connection = null;
        return new Promise(async (resolve, reject) => {
            try {
                connection = await mysql2.createConnection(obtenerConfiguracion());
                sql = "SELECT p.*, e.titulo, tp.nombre AS tipoProfesionalNombre, pr.nombre AS proveedorNombre";
                sql += " FROM propuestas AS p"
                sql += " LEFT JOIN subcontrata_propuestas AS sp ON sp.propuestaId = p.propuestaId";
                sql += " LEFT JOIN ofertas as o On o.ofertaId = sp.subcontrataId"
                sql += " LEFT JOIN expedientes as e ON e.expedienteId =  o.expedienteId"
                sql += " LEFT JOIN tipos_profesionales as tp ON tp.tipoProfesionalId =  p.tipoProfesionalId"
                sql += " LEFT JOIN proveedores as pr ON pr.proveedorId =  p.proveedorId"
                sql += " WHERE sp.subcontrataId = ?";
                sql = mysql2.format(sql, id);
                if (esGanadora > 0) {
                    sql += "AND p.ofertaganadora = ?";
                    sql = mysql2.format(sql, esGanadora);
                }
                if (propuestaId > 0) {
                    sql += "AND p.propuestaId <> ?";
                    sql = mysql2.format(sql, propuestaId);
                }
                let [result] = await connection.query(sql);
                await connection.end();
                resolve(result);

            } catch (e) {
                if (connection) {
                    if (!connection.connection._closing) {
                        await connection.end();
                    }
                }
                reject(e);
            }
        });
    }


    module.exports.getPropuestasExpediente = async (id, ganadora) => {
        let connection = null;
        return new Promise(async (resolve, reject) => {
            try {
                connection = await mysql2.createConnection(obtenerConfiguracion());
                let sql = "SELECT p.*, os.tituloTexto AS titulo,";
                sql += " tp.nombre AS tipoProfesionalNombre, pr.nombre AS proveedorNombre,";
                sql += " sp.subcontrataId";
                sql += " FROM ofertas AS os ";
                sql += " INNER JOIN `subcontrata_propuestas` AS sp ON sp.subcontrataId = os.ofertaId";
                sql += " LEFT JOIN propuestas AS p ON p.propuestaId = sp.propuestaId";
                sql += " LEFT JOIN tipos_profesionales AS tp ON tp.tipoProfesionalId = p.tipoProfesionalId";
                sql += " LEFT JOIN proveedores AS pr ON pr.proveedorId = p.proveedorId";
                sql += " WHERE os.expedienteId = ?";
                if (ganadora === 'true') {
                    sql += " AND p.ofertaGanadora = 1"
                } else if (ganadora === 'false') {
                    sql += " AND p.ofertaGanadora = 2"
                }
                sql = mysql2.format(sql, id);
                let [result] = await connection.query(sql);
                await connection.end();
                resolve(result);

            } catch (e) {
                if (connection) {
                    if (!connection.connection._closing) {
                        await connection.end();
                    }
                }
                reject(e);
            }
        });
    }
    // getPropuesta
    module.exports.getPropuesta = async (id) => {
        let connection = null;
        return new Promise(async (resolve, reject) => {
            try {
                connection = await mysql2.createConnection(obtenerConfiguracion());
                sql = "SELECT p.*,";
                sql += " o.tituloTexto,";
                sql += " o.referencia,";
                sql += " o.fechaOferta,";
                sql += " c.clienteId,";
                sql += " c.nombre AS nombreCliente,";
                sql += " e.datosAdicionales AS datosAdicionales,";
                sql += " emp.empresaId,";
                sql += " emp.nombre AS nombreEmpresa,";
                sql += " emp.plantillaCorreoArq,";
                sql += " emp.plantillaCorreoArqEncargo";
                sql += " FROM propuestas AS p"
                sql += " LEFT JOIN subcontrata_propuestas AS sp ON sp.propuestaId = p.propuestaId";
                sql += " LEFT JOIN ofertas as o On o.ofertaId = sp.subcontrataId"
                sql += " LEFT JOIN expedientes as e ON e.expedienteId =  o.expedienteId"
                sql += " LEFT JOIN clientes as c ON c.clienteId =  o.clienteId"
                sql += " LEFT JOIN empresas as emp ON emp.empresaId =  o.empresaId"
                sql += " WHERE sp.propuestaId = ?";
                sql = mysql2.format(sql, id);
                let [result] = await connection.query(sql);
                await connection.end();
                resolve(result[0]);

            } catch (e) {
                if (connection) {
                    if (!connection.connection._closing) {
                        await connection.end();
                    }
                }
                reject(e);
            }
        });
    }

    // getPropuesta
    module.exports.getPropuestaLineas = async (id) => {
        let connection = null;
        return new Promise(async (resolve, reject) => {
            try {
                connection = await mysql2.createConnection(obtenerConfiguracion());
                var sql = "SELECT pfl.*,";
                sql += " a.codigoReparacion,"
                sql += " u.abrev as unidades,";
                sql += " pfl.costeLinea AS costeLinea,";
                sql += " a.nombre AS nombreArticulo,";
                sql += " ga.nombre AS nombreGrupoArticulo";
                sql += " FROM propuesta_lineas as pfl";
                sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
                sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoArticuloId = a.grupoArticuloId";
                sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId";
                sql += " WHERE pfl.propuestaId = " + id;
                sql = mysql2.format(sql, id);
                let [result] = await connection.query(sql);
                await connection.end();
                resolve(result);

            } catch (e) {
                if (connection) {
                    if (!connection.connection._closing) {
                        await connection.end();
                    }
                }
                reject(e);
            }
        });
    }



    // getOfertaLineas
    // Devuelve todas las líneas de una prefacttura
    module.exports.getOfertaLineas = function (id, desdeparte, proveedorId, callback) {
        var boolValue;
        boolValue = (/true/i).test(desdeparte);
        var proveedorId = parseInt(proveedorId);
        if (isNaN(proveedorId)) proveedorId = false;


        var connection = cm.getConnection();
        var sql = "SELECT pfl.*,";
        sql += " a.codigoReparacion,"
        sql += " u.abrev as unidades,";
        sql += " p.nombre AS proveedorNombre,";
        sql += " pfl.coste AS costeLinea,";
        sql += " a.nombre AS nombreArticulo,";
        sql += " ga.nombre AS nombreGrupoArticulo,";
        sql += " pfl.porcentajeBeneficio AS porcentajeBeneficioLinea,"
        sql += " of.*";
        sql += " FROM ofertas_lineas as pfl";
        sql += " LEFT JOIN ofertas AS of ON of.ofertaId = pfl.ofertaId";
        sql += " LEFT JOIN articulos AS a ON a.articuloId = pfl.articuloId";
        sql += " LEFT JOIN grupo_articulo AS ga ON ga.grupoArticuloId = a.grupoArticuloId";
        sql += " LEFT JOIN unidades AS u ON u.unidadId = pfl.unidadId";
        sql += " LEFT JOIN proveedores AS p ON p.proveedorId = pfl.proveedorId";
        sql += " WHERE pfl.ofertaId = " + id;
        if (proveedorId) {
            sql += " ORDER by FIELD(pfl.proveedorId, ?) DESC";
            sql = mysql.format(sql, proveedorId);
        } else if (boolValue) {
            sql += " ORDER by pfl.proveedorId";
        } else {
            sql += " ORDER by linea";
            sql = mysql.format(sql, id);
        }
        connection.query(sql, function (err, result) {
            cm.closeConnection(connection);
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    }


    module.exports.postPropuestaLineas = async (propuesta, subContrataId) => {
        let connection = null;
        var sql = null;
        return new Promise(async (resolve, reject) => {
            try {
                if (propuesta.lineas) lineas = propuesta.lineas;
                delete propuesta.lineas;
                connection = await mysql2.createConnection(obtenerConfiguracion());
                await connection.beginTransaction();
                //creamos la oferta
                sql = "INSERT INTO propuestas SET ?";
                sql = mysql2.format(sql, propuesta);
                let [result] = await connection.query(sql);
                propuesta.propuestaId = result.insertId;
                //creamos las lineas de la oferta
                let [result2] = await postPropuestaLineaNuevo(lineas, propuesta.propuestaId, connection);
                let result3 = await postSubcontrataPropuestas(propuesta.propuestaId, subContrataId, connection)
                await connection.commit();
                await connection.end();
                return resolve(propuesta);
            } catch (e) {
                if (connection) {
                    if (!connection.connection._closing) {
                        await connection.rollback();
                        await connection.end();
                    }
                } else {

                }
                reject(e);
            }
        });
    }

    let postPropuestaLineaNuevo = async (propuestaLineas, propuestaId, conn) => {
        var sql = "";
        return new Promise(async (resolve, reject) => {
            try {
                //insertamos las lineas
                for (let l of propuestaLineas) {
                    l.propuestaId = propuestaId
                    sql = "INSERT INTO propuesta_lineas SET ?";
                    sql = mysql2.format(sql, l);
                    const [result] = await conn.query(sql);
                    l.propuestaLineaId = result.insertId;
                }
                resolve(propuestaLineas);

            } catch (error) {
                reject(error);
            }
        });
    }




    let postSubcontrataPropuestas = async (propuestaId, subContrataId, conn) => {
        var sql = "";
        return new Promise(async (resolve, reject) => {
            try {
                let row = {
                    subcontrataPropuestaId: 0,
                    propuestaId: propuestaId,
                    subContrataId: subContrataId
                }
                sql = "INSERT INTO subcontrata_propuestas SET ?";
                sql = mysql2.format(sql, row);
                const [result] = await conn.query(sql);
                resolve(result);

            } catch (error) {
                reject(error);
            }
        });
    }


    module.exports.putPropuestaLineas = async (propuesta) => {
        let connection = null;
        var sql = null;
        let lineas = null
        return new Promise(async (resolve, reject) => {
            try {
                if (propuesta.lineas) lineas = propuesta.lineas;
                delete propuesta.lineas;
                connection = await mysql2.createConnection(obtenerConfiguracion());
                await connection.beginTransaction();
                //creamos la oferta
                sql = "UPDATE propuestas SET ? WHERE propuestaId = ?";
                sql = mysql2.format(sql, [propuesta, propuesta.propuestaId]);
                let [result] = await connection.query(sql);
                //Actualizamos las lineas de la oferta si las hayç
                if (lineas) {
                    let [result2] = await putPropuestaLineaNuevo(lineas, connection)
                    await connection.commit();
                    await connection.end();
                    return resolve(propuesta);
                } else {
                    await connection.commit();
                    await connection.end();
                    return resolve(propuesta);
                }
            } catch (e) {
                if (connection) {
                    if (!connection.connection._closing) {
                        await connection.rollback();
                        await connection.end();
                    }
                } else {

                }
                reject(e);
            }
        });
    }

    let putPropuestaLineaNuevo = async (propuestaLineas, conn) => {
        var sql = "";
        return new Promise(async (resolve, reject) => {
            try {
                //insertamos las lineas
                for (let l of propuestaLineas) {
                    sql = "UPDATE propuesta_lineas SET ? WHERE propuestaLineaId = ?";
                    sql = mysql2.format(sql, [l, l.propuestaLineaId]);
                    const [result] = await conn.query(sql);
                }
                resolve(propuestaLineas);

            } catch (error) {
                reject(error);
            }
        });
    }


    module.exports.deletePropuestaLineas = async (propuestaId) => {
        let connection = null;
        var sql = null;
        return new Promise(async (resolve, reject) => {
            try {
                connection = await mysql2.createConnection(obtenerConfiguracion());
                await connection.beginTransaction();
                //borramos las lineas
                let result = await deletePropuestaLineaNuevo(propuestaId, connection);
                //borramos la tabla intermedia
                let result2 = await deleteSubcontrataPropuestas(propuestaId, connection)
                //borramos la cabecera
                sql = "DELETE FROM propuestas WHERE propuestaId = ?";
                sql = mysql2.format(sql, propuestaId);
                let [result3] = await connection.query(sql);
                await connection.commit();
                await connection.end();
                return resolve(null);
            } catch (e) {
                if (connection) {
                    if (!connection.connection._closing) {
                        await connection.rollback();
                        await connection.end();
                    }
                } else {

                }
                reject(e);
            }
        });
    }

    let _deletePropuestaLinea = async (propuestaLineaId, propuestaId, conn) => {
        var sql = "";
        return new Promise(async (resolve, reject) => {
            try {
                sql = "DELETE FROM propuesta_lineas WHERE propuestaLineaId = ?";
                sql = mysql2.format(sql, propuestaLineaId);
                const [result] = await conn.query(sql);
                if (result.affectedRows > 0) {
                    let sql = "";
                    sql += "UPDATE propuestas p ";
                    sql += "JOIN (";
                    sql += "  SELECT ";
                    sql += "    sp.propuestaId,";
                    sql += "    SUM(pl.costeLinea) AS totalCoste,";
                    sql += "    SUM(pl.propuestaTotalLinea) AS totalPropuesta,";
                    sql += "    o2.importeCliente AS importeCliente"
                    sql += "  FROM propuesta_lineas pl ";
                    sql += "  INNER JOIN propuestas p2 ON p2.propuestaId = pl.propuestaId ";
                    sql += "  INNER JOIN subcontrata_propuestas sp ON sp.propuestaId = p2.propuestaId ";
                    sql += "  INNER JOIN ofertas o ON o.ofertaId = sp.subcontrataId AND o.esCoste = 2 ";
                    sql += "  INNER JOIN ofertas o2 ON o2.ofertaCosteId = o.ofertaCosteId AND o2.esCoste = 0 ";
                    sql += "  WHERE sp.propuestaId = ? ";
                    sql += "  GROUP BY sp.propuestaId";
                    sql += ") AS agregados ON agregados.propuestaId = p.propuestaId ";
                    sql += "SET ";
                    sql += "  p.precioObjetivo = agregados.totalCoste, ";
                    sql += "  p.totalPropuesta = agregados.totalPropuesta, ";
                    sql += "  p.diferencia = agregados.totalCoste - agregados.totalPropuesta, ";
                    sql += "  p.pvpNeto = agregados.importeCliente * 0.9,"
                    sql += "  p.porcenBiNeto = (((agregados.importeCliente * 0.9) / agregados.totalPropuesta) - 1) * 100,";
                    sql += "  p.biNeto = agregados.importeCliente  - agregados.totalPropuesta";

                    sql = mysql2.format(sql, propuestaId);

                    let result2 = await conn.query(sql);
                    resolve(result2);
                } else {
                    resolve(null);
                }


            } catch (error) {
                reject(error);
            }
        });
    }

    let deletePropuestaLineaNuevo = async (propuestaId, conn) => {
        var sql = "";
        return new Promise(async (resolve, reject) => {
            try {
                sql = "DELETE FROM propuesta_lineas WHERE propuestaId = ?";
                sql = mysql2.format(sql, propuestaId);
                const [result] = await conn.query(sql);
                resolve(result);

            } catch (error) {
                reject(error);
            }
        });
    }





    let deleteSubcontrataPropuestas = async (propuestaId, conn) => {
        var sql = "";
        return new Promise(async (resolve, reject) => {
            try {
                sql = "DELETE FROM subcontrata_propuestas WHERE propuestaId = ?";
                sql = mysql2.format(sql, propuestaId);
                const [result] = await conn.query(sql);
                resolve(result);

            } catch (error) {
                reject(error);
            }
        });
    }

    module.exports.deletePropuestaLinea = async (propuestaLineaId, propuestaId) => {
        let connection = null;
        var sql = null;
        return new Promise(async (resolve, reject) => {
            try {
                connection = await mysql2.createConnection(obtenerConfiguracion());
                await connection.beginTransaction();
                //borramos las lineas
                let result = await _deletePropuestaLinea(propuestaLineaId, propuestaId, connection);
                await connection.commit();
                await connection.end();
                return resolve(null);
            } catch (e) {
                if (connection) {
                    if (!connection.connection._closing) {
                        await connection.rollback();
                        await connection.end();
                    }
                } else {

                }
                reject(e);
            }
        });
    }


    module.exports.generarPdfYEnviar = async (propuesta) => {
        // Configuración inicial
        Stimulsoft.Base.StiLicense.key = process.env.STI_KEY_NEW;
        Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");

        const report = new Stimulsoft.Report.StiReport();
        let file = process.env.REPORTS_DIR + "\\oferta_proyecta_nopresentacion.mrt";
        /*  if (propuesta.esEncargo) {
             file = process.env.REPORTS_DIR + "\\hoja_encargo.mrt";
         } */

        // 📌 Localización
        const locPath = path.join(__dirname, "..", "..", "public", "Localization", "es.xml");
        const localizationData = fs.readFileSync(locPath, "utf8");
        report.dictionary.culture = "es-ES";
        report.cultureName = "es-ES";
        Stimulsoft.Base.Localization.Culture = "es-ES";
        Stimulsoft.Base.Localization.CultureName = "es-ES";
        Stimulsoft.Base.Localization.StiLocalization.setLocalization(localizationData);

        // Cargar archivo de reporte
        report.loadFile(file);

        // 📌 Conexión DB (si usas conexión directa con Stimulsoft Server/JS)
        let connectionString = "Server=" + process.env.BASE_MYSQL_HOST + ";";
        connectionString += "Database=" + process.env.BASE_MYSQL_DATABASE + ";";
        connectionString += "UserId=" + process.env.BASE_MYSQL_USER + ";";
        connectionString += "Pwd=" + process.env.BASE_MYSQL_PASSWORD + ";";
        report.dictionary.databases.list[0].connectionString = connectionString;

        /*  if (propuesta.esEncargo) {
             // ✅ Fecha formateada manualmente
             const fechaOriginal = new Date(); // <-- tu propuesta.fechaOferta
             const fechaFormateada = moment(fechaOriginal).locale("es").format("dddd D [de] MMMM [de] YYYY");
 
             report.dictionary.variables.getByName("fechaOfertaFormateada").valueObject = fechaFormateada;
 
         }
  */
        // 📌 Modificación SQL dinámico
        let pos = 0;
        let sql = "";
        /*  if (propuesta.esEncargo) {
             sql = report.dataSources.list[pos].sqlCommand;
             sql = sql + "WHERE p.propuestaId =  " + propuesta.propuestaId;
             sql = sql.replace(/[\r\n]+/g, " ");
             report.dataSources.list[pos].sqlCommand = sql;
         } else { */
        sql = report.dataSources.list[pos].sqlCommand;
        sql = sql.replace("1 AS valorado", "0 AS valorado");
        sql = sql + " WHERE o.ofertaId = " + propuesta.subcontrataId;
        sql = sql.replace(/[\r\n]+/g, " ");
        report.dataSources.list[pos].sqlCommand = sql;
        //}


        // 📌 Renderizar y exportar de forma asíncrona, devolviendo el buffer
        const buffer = await new Promise((resolve, reject) => {
            report.renderAsync(() => {
                const settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                const service = new Stimulsoft.Report.Export.StiPdfExportService();
                const stream = new Stimulsoft.System.IO.MemoryStream();

                service.exportToAsync(() => {
                    try {
                        const data = stream.toArray();
                        const buffer = Buffer.from(data); // ✅ sin utf-8, ya es binario
                        stream.close();
                        resolve(buffer);
                    } catch (err) {
                        reject(err);
                    }
                }, report, stream, settings);
            });
        });

        return buffer;
    };


    module.exports.generarPdfDocumentacionYEnviar = async (propuesta) => {
        // Configuración inicial
        Stimulsoft.Base.StiLicense.key = process.env.STI_KEY_NEW;
        Stimulsoft.Base.StiFontCollection.addOpentypeFontFile("Roboto-Black.ttf");

        const report = new Stimulsoft.Report.StiReport();
        let file = process.env.REPORTS_DIR + "\\subcontrata_encargo.mrt";


        // 📌 Localización
        const locPath = path.join(__dirname, "..", "..", "public", "Localization", "es.xml");
        const localizationData = fs.readFileSync(locPath, "utf8");
        report.dictionary.culture = "es-ES";
        report.cultureName = "es-ES";
        Stimulsoft.Base.Localization.Culture = "es-ES";
        Stimulsoft.Base.Localization.CultureName = "es-ES";
        Stimulsoft.Base.Localization.StiLocalization.setLocalization(localizationData);

        // Cargar archivo de reporte
        report.loadFile(file);

        // 📌 Conexión DB (si usas conexión directa con Stimulsoft Server/JS)
        let connectionString = "Server=" + process.env.BASE_MYSQL_HOST + ";";
        connectionString += "Database=" + process.env.BASE_MYSQL_DATABASE + ";";
        connectionString += "UserId=" + process.env.BASE_MYSQL_USER + ";";
        connectionString += "Pwd=" + process.env.BASE_MYSQL_PASSWORD + ";";
        report.dictionary.databases.list[0].connectionString = connectionString;

        // ✅ Fecha formateada manualmente
        const fechaOriginal = new Date(); // <-- tu propuesta.fechaOferta
        const fechaFormateada = moment(fechaOriginal).locale("es").format("dddd D [de] MMMM [de] YYYY");

        report.dictionary.variables.getByName("fechaOfertaFormateada").valueObject = fechaFormateada;





        /* if (propuesta.esEncargo) {
            sql = report.dataSources.list[pos].sqlCommand;
            sql = sql + "WHERE p.propuestaId =  " + propuesta.propuestaId;
            sql = sql.replace(/[\r\n]+/g, " ");
            report.dataSources.list[pos].sqlCommand = sql;
        } else {
            sql = report.dataSources.list[pos].sqlCommand;
            sql = sql.replace("1 AS valorado", "0 AS valorado");
            sql = sql + " WHERE o.ofertaId = " + propuesta.subcontrataId;
            sql = sql.replace(/[\r\n]+/g, " ");
            report.dataSources.list[pos].sqlCommand = sql;
        }*/

        let pos = 2;

        if (propuesta.propuestaId) {
            var sql = report.dataSources.list[0].sqlCommand;
            sql = sql + " WHERE p.propuestaId =  " + propuesta.propuestaId
            report.dataSources.list[0].sqlCommand = sql;
            /*  //
             sql = report.dataSources.list[1].sqlCommand;
              sql = sql + "WHERE pl.propuestaId =  " + propuestaId;
              report.dataSources.list[1].sqlCommand = sql; */
        }

        if (propuesta.subcontrataId) {
            for (var i = 2; i < report.dataSources.list.length; i++) {
                var sql = report.dataSources.list[i].sqlCommand;
                if (i == 3) {
                    sql = sql.replace("ORDER BY 2,4", " WHERE o.ofertaId = " + propuesta.subcontrataId + " ORDER BY 2,4");
                } else {
                    sql = sql + " WHERE o.ofertaId = " + propuesta.subcontrataId
                }

                report.dataSources.list[i].sqlCommand = sql;
            }

        }


        // 📌 Renderizar y exportar de forma asíncrona, devolviendo el buffer
        const buffer = await new Promise((resolve, reject) => {
            report.renderAsync(() => {
                const settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
                const service = new Stimulsoft.Report.Export.StiPdfExportService();
                const stream = new Stimulsoft.System.IO.MemoryStream();

                service.exportToAsync(() => {
                    try {
                        const data = stream.toArray();
                        const buffer = Buffer.from(data); // ✅ sin utf-8, ya es binario
                        stream.close();
                        resolve(buffer);
                    } catch (err) {
                        reject(err);
                    }
                }, report, stream, settings);
            });
        });

        return buffer;
    };


} catch (e) {
    console.log(e)
}

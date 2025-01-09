const mysql = require('mysql2');
require('dotenv').config();

let pool;
    

// Función para manejar la cadena de conexión
var getConnectionStringInfo = function (connectionString) {
    const info = { host: "localhost", port: "3306", charset: "utf8" };
    const properties = connectionString.split(";");

    properties.forEach(property => {
        const [key, value] = property.split("=").map(str => str.trim().toLowerCase());
        if (key && value) {
            switch (key) {
                case "server":
                case "host":
                    info["host"] = value;
                    break;
                case "port":
                    info["port"] = value;
                    break;
                case "database":
                    info["database"] = value;
                    break;
                case "uid":
                case "user":
                    info["userId"] = value;
                    break;
                case "pwd":
                case "password":
                    info["password"] = value;
                    break;
                case "charset":
                    info["charset"] = value;
                    break;
            }
        }
    });

    return info;
};

// Función principal para procesar la consulta
exports.process = async (command, onResult) => {
    try {
        
// Crear el pool de conexiones
pool = mysql.createPool({
    host: command.connectionStringInfo.host,
    user: command.connectionStringInfo.userId,
    password: command.connectionStringInfo.password,
    port: command.connectionStringInfo.port,
    charset: command.connectionStringInfo.charset,
    database: command.connectionStringInfo.database,
    waitForConnections: true,
    connectionLimit: 10, // Número máximo de conexiones concurrentes
    queueLimit: 0 // Sin límite en la cola
});
        // Configurar la conexión con los detalles de la cadena de conexión
        command.connectionStringInfo = getConnectionStringInfo(command.connectionString);

        // Usar el pool para ejecutar la consulta
        pool.query("USE " + command.connectionStringInfo.database, function (error) {
            if (error) return onError(error.message);  // Manejo de errores en la selección de la base de datos

            // Si la consulta está definida, ejecutar la consulta SQL
            if (command.queryString) {
                pool.query(command.queryString, function (error, rows) {
                    if (error) {
                        onError(error.message);  // Manejo de errores en la ejecución de la consulta
                    } else {
                        onQuery(rows);  // Procesar los resultados si la consulta es exitosa
                    }
                });
            } else {
                end({ success: true });  // Si no hay consulta, simplemente finalizar
            }
        });
    } catch (e) {
        onError(e.stack);  // Manejo de excepciones inesperadas
    }

    // Función de finalización (end) para retornar los resultados al callback
    var end = function (result) {
        try {
            onResult(result);  // Retorna el resultado procesado
        } catch (e) {
            console.error('Error al finalizar:', e);  // Manejo de errores durante la finalización
        }
    };

    // Función de manejo de errores
    var onError = function (message) {
        end({ success: false, notice: message });
    };

    // Función para procesar los resultados de la consulta
    var onQuery = function (recordset) {
        var columns = [];
        var rows = [];
        var types = {};
        var isColumnsFill = false;

        // Si el recordset es un array de arrays, desempacar el primer nivel
        if (recordset.length > 0 && Array.isArray(recordset[0])) {
            recordset = recordset[0];
        }

        // Procesar cada registro y las columnas
        recordset.forEach((record) => {
            var row = [];
            Object.keys(record).forEach((columnName, idx) => {
                if (!isColumnsFill) columns.push(columnName);  // Llenar las columnas solo una vez
                if (!types[columnName]) {
                    types[columnName] = typeof record[columnName];
                }

                // Convertir a base64 si es un tipo de dato binario
                if (record[columnName] instanceof Uint8Array) {
                    record[columnName] = Buffer.from(record[columnName]).toString('base64');
                }

                // Asegurar que las fechas se conviertan a formato ISO
                row.push(record[columnName] && record[columnName].toISOString ? record[columnName].toISOString() : record[columnName]);
            });

            isColumnsFill = true;
            rows.push(row);  // Agregar la fila procesada al resultado
        });

        end({ success: true, columns: columns, rows: rows, types: types });
    };
};

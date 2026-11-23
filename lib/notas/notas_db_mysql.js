var mysql2 = require("mysql2/promise"); // librería para el acceso a bases de datos MySQ

module.exports.getNotasWeb = async (registroId) => {
    let connection = null;

    try {
        connection = await mysql2.createConnection(obtenerConfiguracion());

        const sql = `
            SELECT n.*, u.nombre AS usuarioNombre
            FROM notasweb as n
            left join usuarios as u on u.usuarioId = n.usuarioId
            WHERE registroId = ${registroId}
        `;

        const [result] = await connection.query(sql);
        return result;

    } catch (err) {
        throw err;
    } finally {
        if (connection) await connection.end();
    }
};

module.exports.getNotaWeb = async (notaId) => {
    let connection = null;

    try {
        connection = await mysql2.createConnection(obtenerConfiguracion());

        const sql = `
            SELECT n.*, u.nombre AS usuarioNombre
            FROM notasweb as n
            left join usuarios as u on u.usuarioId = n.usuarioId
            WHERE notaId = ${notaId}
        `;

        const [result] = await connection.query(sql);
        return result;

    } catch (err) {
        throw err;
    } finally {
        if (connection) await connection.end();
    }
};

module.exports.deleteNotaWeb = async (notaId) => {
    let connection = null;

    try {
        connection = await mysql2.createConnection(obtenerConfiguracion());

        const sql = `
            DELETE FROM notasweb
            WHERE notaId = ${notaId}
        `;

        const [result] = await connection.query(sql);
        return result;

    } catch (err) {
        throw err;
    } finally {
        if (connection) await connection.end();
    }
};

module.exports.postNotaWeb = async (nota) => {
    let connection = null;

    try {
        connection = await mysql2.createConnection(obtenerConfiguracion());

        let sql = `
            INSERT INTO notasweb SET ?
        `;

        sql = mysql2.format(sql, nota);
        const [result] = await connection.query(sql);
        return result;

    } catch (err) {
        throw err;
    } finally {
        if (connection) await connection.end();
    }
};

module.exports.putNotaWeb = async (nota, notaId) => {
    let connection = null;

    try {
        connection = await mysql2.createConnection(obtenerConfiguracion());

        let sql = `
            UPDATE notasweb SET ?
            WHERE notaId = ?
        `;

        sql = mysql2.format(sql, [nota, notaId]);
        const [result] = await connection.query(sql);
        return result;

    } catch (err) {
        throw err;
    } finally {
        if (connection) await connection.end();
    }
};


const mysql2 = require('mysql2/promise');

function obtenerConfiguracion() {

    return {
        host: process.env.BASE_MYSQL_HOST,
        user: process.env.BASE_MYSQL_USER,
        password: process.env.BASE_MYSQL_PASSWORD,
        database: process.env.BASE_MYSQL_DATABASE,
        port: process.env.BASE_MYSQL_PORT,
        charset: process.env.BASE_MYSQL_CHARSET || 'latin1'
    };

}

// Obtener usuario autorizado para utilizar el agente IA
module.exports.getUsuarioAutorizado = async function (usuarioId) {

    let conn;

    try {

        conn = await mysql2.createConnection(
            obtenerConfiguracion()
        );

        const sql = `
            SELECT
                u.usuarioId,
                u.nombre,
                u.nivel,
                u.departamentoTrabajo,
                u.puedeVisualizar,
                u.puedeEditar,
                u.puedeAbrir,
                ia.activo AS accesoIA
            FROM usuarios AS u
            INNER JOIN agente_ia_usuarios AS ia
                ON ia.usuarioId = u.usuarioId
            WHERE u.usuarioId = ?
            AND u.activo = 1
            AND u.fechaBaja IS NULL
            AND ia.activo = 1
        `;

        const [rows] = await conn.query(sql, [
            usuarioId
        ]);

        return rows.length > 0 ? rows[0] : null;

    } finally {

        if (conn) await conn.end();

    }

};

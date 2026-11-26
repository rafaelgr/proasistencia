
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

// Obtener tarifa vigente del modelo
async function getTarifaModelo(conn, modelo, fecha) {

    const sql = `
        SELECT *
        FROM agente_ia_tarifas
        WHERE modelo = ?
        AND fechaDesde <= ?
        ORDER BY fechaDesde DESC
        LIMIT 1
    `;

    const [rows] = await conn.query(sql, [
        modelo,
        fecha
    ]);

    return rows.length > 0 ? rows[0] : null;

}

// Calcular coste en dólares
function calcularCoste(consumo, tarifa) {

    if (!tarifa) return null;

    const tokensEntrada = consumo.input_tokens || 0;
    const tokensSalida = consumo.output_tokens || 0;

    const tokensCache =
        consumo.input_tokens_details?.cached_tokens || 0;

    const tokensEntradaNormal =
        tokensEntrada - tokensCache;

    if (tokensCache > 0 && tarifa.precioCache == null) {
        return null;
    }

    const costeEntrada =
        tokensEntradaNormal * Number(tarifa.precioEntrada);

    const costeCache =
        tokensCache * Number(tarifa.precioCache || 0);

    const costeSalida =
        tokensSalida * Number(tarifa.precioSalida);

    const costeTotal =
        (costeEntrada + costeCache + costeSalida) / 1000000;

    return costeTotal.toFixed(10);

}

// Registrar consumo de OpenAI
module.exports.registrarConsumo = async function (
    usuarioId,
    operacion,
    response
) {

    let conn;

    try {

        if (!response || !response.usage) {
            throw new Error('Respuesta sin datos de consumo');
        }

        conn = await mysql2.createConnection(
            obtenerConfiguracion()
        );

        const fecha = new Date();
        const consumo = response.usage;

        const tarifa = await getTarifaModelo(
            conn,
            response.model,
            fecha
        );

        const costeUsd = calcularCoste(
            consumo,
            tarifa
        );

        const datos = {
            usuarioId: usuarioId || null,
            fecha: fecha,
            operacion: operacion,
            modelo: response.model,
            respuestaId: response.id,
            tokensEntrada: consumo.input_tokens || 0,
            tokensCache:
                consumo.input_tokens_details?.cached_tokens || 0,
            tokensSalida: consumo.output_tokens || 0,
            tokensTotal: consumo.total_tokens || 0,
            costeUsd: costeUsd,
            estado: response.status || null
        };

        const sql = `
            INSERT INTO agente_ia_consumos
            SET ?
            ON DUPLICATE KEY UPDATE
                consumoId = LAST_INSERT_ID(consumoId)
        `;

        const [result] = await conn.query(sql, datos);

        return {
            consumoId: result.insertId,
            ...datos
        };

    } finally {

        if (conn) await conn.end();

    }

};

const cron = require('node-cron');
const contratosDb = require('../contratos/contratos_db_mysql');

let procesando = false;


/**
 * Busca y envía los recordatorios pendientes
 * de las actas de recepción.
 */
async function procesarRecordatoriosActas() {

    if (procesando) {
        console.log('El proceso de recordatorios ya está ejecutándose');
        return;
    }

    procesando = true;

    try {

        console.log(
            `[${new Date().toISOString()}] Inicio recordatorios actas`
        );

        // 1. Buscar contratos que necesitan recordatorio
        const pendientes =
            await contratosDb.getActasPendientesRecordatorio();

        console.log(
            `Recordatorios pendientes: ${pendientes.length}`
        );

        const pendientesDF =
            await contratosDb.getActasPendientesRecordatorioDF();

        console.log(
            `Recordatorios DF pendientes: ${pendientesDF.length}`
        );

        // 2. Procesarlos uno a uno
        for (const pendiente of pendientes) {

            try {

                // Si el último fue el 1, toca el 2
                // Si fue el 2, toca el 3
                // Si fue el 3, toca el 4
                const numeroCorreo =
                    Number(pendiente.ultimoCorreo) + 1;

                console.log(
                    `Contrato ${pendiente.contratoId}: ` +
                    `enviando correo ${numeroCorreo}`
                );

                // 3. Todo el trabajo real se hace en contratosDb
                await contratosDb.enviarRecordatorioActaRecepcion(
                    pendiente,
                    numeroCorreo
                );

            } catch (error) {

                console.error(
                    `Error procesando contrato ${pendiente.contratoId}:`,
                    error
                );
                continue;
            }
        }

        for (const pendienteDF of pendientesDF) {

            try {

                // Si el último fue el 1, toca el 2
                // Si fue el 2, toca el 3
                // Si fue el 3, toca el 4
                const numeroCorreoDF =
                    Number(pendienteDF.ultimoCorreo) + 1;

                console.log(
                    `Contrato ${pendienteDF.contratoId}: ` +
                    `enviando correo ${numeroCorreoDF}`
                );

                // 3. Todo el trabajo real se hace en contratosDb
                await contratosDb.enviarRecordatorioActaRecepcionDF(
                    pendienteDF,
                    numeroCorreoDF
                );

            } catch (error) {

                console.error(
                    `Error procesando contrato ${pendienteDF.contratoId} para la dirección facultativa:`,
                    error
                );

                continue;
            }
        }

        console.log('Fin recordatorios actas');

    } catch (error) {

        console.error(
            'Error general procesando recordatorios:',
            error
        );

    } finally {

        procesando = false;
    }
}


/**
 * Inicializa el demonio.
 */
function iniciar() {

    console.log('Demonio recordatorios actas iniciado');

    // Ejecutar también al arrancar PROASISTENCIA
    procesarRecordatoriosActas();

    // Después, todos los días a las 08:00
    cron.schedule(
        '0 8 * * *',
        async () => {

            await procesarRecordatoriosActas();

        },
        {
            timezone: 'Europe/Madrid'
        }
    );
}


module.exports = {
    iniciar,
    procesarRecordatoriosActas
};
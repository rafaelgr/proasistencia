require('dotenv').config();

const agenteIA = require(
    '../lib/agente_ia/agente_ia_service'
);

async function probarAgente() {

    try {

        console.log('Conectando con OpenAI...');

        const resultado = await agenteIA.enviarMensaje(
            'Preséntate brevemente como asistente de PROASISTENCIA.',
            null,
            'PRUEBA_CONEXION'
        );

        console.log('\nRespuesta:');
        console.log(resultado.respuesta);

        console.log('\nModelo:');
        console.log(resultado.modelo);

        console.log('\nConsumo:');
        console.log(resultado.consumo);

        console.log('\nRegistro en MySQL:');
        console.log(resultado.registroConsumo);

    } catch (err) {

        console.error('Error:', err.message);
        console.error(err.stack);

    }

}

probarAgente();
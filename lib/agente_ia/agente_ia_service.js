
const OpenAI = require('openai');
const instrucciones = require('./agente_ia_instrucciones');
const consumosDb = require('./agente_ia_consumos_db_mysql');
const herramientasIA = require('./agente_ia_herramientas');

let client = null;

// Obtener cliente OpenAI
function obtenerCliente() {

    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY no configurada');
    }

    if (!process.env.OPENAI_MODEL) {
        throw new Error('OPENAI_MODEL no configurado');
    }

    if (!client) {

        client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            timeout: 60000,
            maxRetries: 2
        });

    }

    return client;
}

async function llamarOpenAI(input, usuarioId, operacion) {

    const openai = obtenerCliente();

    console.log('ENTRADA OPENAI:');
    console.log(JSON.stringify(input, null, 2));

    const response = await openai.responses.create({

        model: process.env.OPENAI_MODEL,
        instructions: instrucciones,
        input: input,
        tools: herramientasIA.herramientas,
        parallel_tool_calls: false,
        store: false,
        max_output_tokens: 2000

    });

    // Registrar consumo de cada llamada

    let registroConsumo = null;

    try {

        registroConsumo = await consumosDb.registrarConsumo(
            usuarioId,
            operacion,
            response
        );

    } catch (err) {

        console.error(
            'Error al registrar consumo IA:',
            response.id,
            err.message
        );

    }

    return {
        response,
        registroConsumo
    };
}

// Enviar mensaje al agente
module.exports.enviarMensaje = async function (
    mensaje,
    usuarioId = null,
    operacion = 'CONSULTA_GENERAL',
    contexto = {}
) {

    if (typeof mensaje !== 'string' || !mensaje.trim()) {

        throw new Error('No se ha recibido ningún mensaje');

    }

    // Preparar entrada inicial

    console.log('PDF recibido:', contexto.archivo?.nombre);
    console.log('Tamaño PDF:', contexto.archivo?.buffer?.length);

    // Preparar entrada inicial

    const input = [
        {
            role: 'developer',
            content: contexto.archivo
                ? 'El servidor ha recibido correctamente un archivo PDF. ' +
                'El archivo está disponible para las herramientas del agente. ' +
                'No solicites al usuario que vuelva a adjuntarlo.'
                : 'El usuario no ha adjuntado ningún archivo.'
        },
        {
            role: 'user',
            content: mensaje
        }
    ];

    // Acumular consumos de todas las llamadas

    const consumo = {
        input_tokens: 0,
        output_tokens: 0,
        total_tokens: 0,
        input_tokens_details: {
            cached_tokens: 0
        }
    };

    const registrosConsumo = [];

    // Limitar las llamadas a OpenAI

    const maxIteraciones = 5;

    for (let i = 0; i < maxIteraciones; i++) {

        // 1. Llamar a OpenAI

        const {
            response,
            registroConsumo
        } = await llamarOpenAI(
            input,
            usuarioId,
            operacion
        );

        // 2. Acumular consumo

        if (response.usage) {

            consumo.input_tokens +=
                response.usage.input_tokens || 0;

            consumo.output_tokens +=
                response.usage.output_tokens || 0;

            consumo.total_tokens +=
                response.usage.total_tokens || 0;

            consumo.input_tokens_details.cached_tokens +=
                response.usage.input_tokens_details?.cached_tokens || 0;

        }

        if (registroConsumo) {

            registrosConsumo.push(registroConsumo);

        }

        if (response.status !== 'completed') {

            throw new Error(
                'Respuesta incompleta de OpenAI: ' +
                response.status
            );

        }

        // 3. Buscar solicitudes de herramientas

        const llamadas = (response.output || []).filter(
            item => item.type === 'function_call'
        );

        // 4. Si no solicita herramientas,
        // devolver la respuesta definitiva

        if (llamadas.length === 0) {

            return {
                respuesta: response.output_text,
                modelo: response.model,
                consumo: consumo,
                estado: response.status,

                registroConsumo: registroConsumo,
                registrosConsumo: registrosConsumo
            };

        }

        // 5. Incorporar la respuesta al contexto

        input.push(...response.output);

        // 6. Ejecutar las herramientas solicitadas

        for (const llamada of llamadas) {

            let resultado;

            try {

                const argumentos = JSON.parse(
                    llamada.arguments || '{}'
                );

                console.log(
                    'Ejecutando herramienta IA:',
                    llamada.name
                );

                resultado =
                    await herramientasIA.ejecutarHerramienta(
                        llamada.name,
                        argumentos,
                        contexto
                    );

            } catch (err) {

                console.error(
                    'Error ejecutando herramienta IA:',
                    llamada.name,
                    err.message
                );

                resultado = {
                    correcto: false,
                    mensaje: 'No se ha podido ejecutar la herramienta'
                };

            }

            // 7. Incorporar resultado de la herramienta

            input.push({

                type: 'function_call_output',
                call_id: llamada.call_id,
                output: JSON.stringify(resultado)

            });

        }

    }

    throw new Error(
        'Se ha alcanzado el límite de llamadas del agente IA'
    );

};
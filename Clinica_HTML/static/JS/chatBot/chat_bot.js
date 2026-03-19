/* ========================================
   1. INICIALIZACIÓN Y EVENTOS
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    // Estado inicial: Chat abierto, burbuja oculta
    const chatContainer = document.getElementById('chatContainer');
    const chatBubble = document.getElementById('chatBubble');
    const chatInicial = document.getElementById('chat_inicial');
    const input = document.getElementById('pregunta_usuario');

    if (chatContainer) chatContainer.style.display = 'block';
    if (chatBubble) chatBubble.style.display = 'none';
    if (chatInicial) chatInicial.style.display = 'block';

    // Evento Enter para enviar mensaje
    if (input) {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                respuesta_chatBot();
            }
        });
    }
});

/* ========================================
   2. CONTROL DE INTERFAZ (ABRIR/CERRAR)
   ======================================== */
function abrirChat() {
    document.getElementById('chatContainer').style.display = 'block';
    document.getElementById('chatBubble').style.display = 'none';
}

function cerrar_chat() {
    document.getElementById('chatContainer').style.display = 'none';
    document.getElementById('chatBubble').style.display = 'flex';
}

/* ========================================
   3. GESTIÓN DE OPCIONES (INPUTS HIDDEN)
   ======================================== */
function opcionInformacionReserva() {
    document.getElementById('chat_inicial').style.display = 'block';
    document.getElementById('chat_cancelar_reserva').style.display = 'none';
    document.getElementById('chat_informacion_reserva').style.display = 'block';

    // Limpiar conflictos de inputs
    const cancelInput = document.getElementById('cancel_reserva_input');
    if (cancelInput) cancelInput.remove();

    if (!document.getElementById('info_reserva_input')) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.id = "info_reserva_input";
        input.value = "2";
        document.getElementById('div_hidden_reserva').appendChild(input);
    }
}

function opcionCancelarReserva() {
    document.getElementById('chat_inicial').style.display = 'block';
    document.getElementById('chat_cancelar_reserva').style.display = 'block';
    document.getElementById('chat_informacion_reserva').style.display = 'none';

    // Limpiar conflictos de inputs
    const infoInput = document.getElementById('info_reserva_input');
    if (infoInput) infoInput.remove();

    if (!document.getElementById('cancel_reserva_input')) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.id = "cancel_reserva_input";
        input.value = "3";
        document.getElementById('div_hidden_cancelar_reserva').appendChild(input);
    }
}

/* ========================================
4. LÓGICA PRINCIPAL DEL CHATBOT
======================================== */
function respuesta_chatBot() {
    const preguntaInput = document.getElementById('pregunta_usuario');
    const pregunta = preguntaInput.value.trim();
    const typing = document.getElementById('typingIndicator');
    const chatMessages = document.querySelector('.chat-messages');

    // Validación de mensaje vacío
    if (!pregunta) {
        Swal.fire({
            icon: 'warning',
            title: 'Mensaje vacío',
            text: 'Por favor escribe un mensaje antes de enviarlo.',
            timer: 2000,
            confirmButtonColor: '#1e3c72'
        });
        return;
    }

    // 1. Mostrar indicador de escritura
    if (typing) {
        typing.style.display = 'flex';
        chatMessages.appendChild(typing); 
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 2. Determinar la opción de envío
    let opcion_envio = 0;
    if (document.getElementById('info_reserva_input')) opcion_envio = 2;
    else if (document.getElementById('cancel_reserva_input')) opcion_envio = 3;

    const datos = { pregunta: pregunta, opcion: opcion_envio };
    
    // Limpiar input inmediatamente
    preguntaInput.value = '';

    // 3. Petición Axios
    axios.post('https://jacruces91.pythonanywhere.com/chatbot/obtener_respuesta', datos)
    //axios.post('http://127.0.0.1:8000/chatbot/obtener_respuesta', datos)
    .then(function (response) {
        setTimeout(() => {
            if (typing) typing.style.display = 'none';
            
            if (response.status === 200 && response.data.respuesta) {
                escribirRespuestaConAnimacion(response.data.respuesta);
            } else {
                // Error genérico del servidor
                escribirRespuestaConAnimacion("❌ Hubo un error inesperado. Inténtalo de nuevo.");
            }
        }, 800);
    })
    .catch(function (error) {
        // --- AQUÍ ESTÁ EL CAMBIO PRINCIPAL ---
        setTimeout(() => {
            if (typing) typing.style.display = 'none';
            console.error('Error:', error);
            
            // Creamos un objeto de error que imita la estructura del Modo Demo
            // para que 'escribirRespuestaConAnimacion' lo maneje correctamente (Caso 1).
            const respuestaErrorConBoton = {
                tipo: 'animar', // Usamos 'animar' para que se escriba letra por letra
                texto: "❌ El código ingresado no es válido o no existe en nuestros registros.",
                // Este HTML debe usar las clases CSS existentes para el botón amarillo
                html_boton: `
                    <div style="text-align: center; margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px;">
                        <button type="button" onclick="boton_volver_chatbot()" class="btn-volver-inicio">
                            <i class="fas fa-arrow-left me-2"></i>Volver al Inicio
                        </button>
                    </div>
                `
            };

            // Enviamos el objeto para que se anime y muestre el botón
            escribirRespuestaConAnimacion(respuestaErrorConBoton);

        }, 800);
    });
}


function escribirRespuestaConAnimacion(respuesta) {
    const chatMessages = document.querySelector('.chat-messages');
    const botMessage = document.createElement('div');
    botMessage.className = 'message bot-message';
    
    // CASO 1: Es el objeto del MODO DEMO (enviado como diccionario desde Python)
    if (typeof respuesta === 'object' && respuesta.tipo === 'animar') {
        botMessage.innerHTML = `
            <i class="fas fa-robot me-2"></i>
            <span class="typing-text"></span>
            <div class="contenedor-boton-post-animacion" style="display:none;"></div>
        `;
        chatMessages.appendChild(botMessage);

        const textContainer = botMessage.querySelector('.typing-text');
        const buttonContainer = botMessage.querySelector('.contenedor-boton-post-animacion');
        let i = 0;
        const textoParaEscribir = respuesta.texto || "";

        function escribirLetra() {
            if (i < textoParaEscribir.length) {
                textContainer.textContent += textoParaEscribir.charAt(i);
                i++;
                chatMessages.scrollTop = chatMessages.scrollHeight;
                setTimeout(escribirLetra, 25);
            } else {
                buttonContainer.innerHTML = respuesta.html_boton;
                buttonContainer.style.display = 'block';
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
        escribirLetra();
    
    // CASO 2: Es un string con HTML (Tarjetas de Reserva case 2 y 3)
    } else if (typeof respuesta === 'string' && respuesta.includes('<div')) {
        botMessage.innerHTML = `<i class="fas fa-robot me-2"></i> ${respuesta}`;
        chatMessages.appendChild(botMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;

    // CASO 3: Es texto plano (OpenAI o errores simples)
    } else {
        const textoLimpio = typeof respuesta === 'string' ? respuesta : JSON.stringify(respuesta);
        botMessage.innerHTML = `<i class="fas fa-robot me-2"></i> <span class="typing-text"></span>`;
        chatMessages.appendChild(botMessage);
        
        const textContainer = botMessage.querySelector('.typing-text');
        let i = 0;
        function escribirTextoPlano() {
            if (i < textoLimpio.length) {
                textContainer.textContent += textoLimpio.charAt(i);
                i++;
                chatMessages.scrollTop = chatMessages.scrollHeight;
                setTimeout(escribirTextoPlano, 25);
            }
        }
        escribirTextoPlano();
    }
}

/* ========================================
   5. AUXILIARES Y BOTONES "VOLVER"
   ======================================== */
function mostrarMensajeError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: mensaje,
        confirmButtonColor: '#1e3c72'
    });
}

function boton_volver_chatbot() {
    try {
        // 1. Limpiar inputs hidden (Esto ya lo tenías)
        const ids = ['cancel_reserva_input', 'info_reserva_input'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });

        // 2. LIMPIEZA MEJORADA: Eliminamos los mensajes del bot que contienen 
        // tarjetas de reserva O el mensaje de modo demo.
        const mensajesBot = document.querySelectorAll('.message.bot-message');
        mensajesBot.forEach(msg => {
            // Si el mensaje contiene una tarjeta de reserva o el layout de demo, lo borramos
            if (msg.innerHTML.includes('reserva-card') || msg.innerHTML.includes('demo-message') || msg.innerHTML.includes('contenedor-boton-post-animacion')) {
                msg.remove();
            }
        });

        // 3. Resetear visibilidad de menús (Asegúrate que estos IDs existan en tu HTML)
        const chatInicial = document.getElementById('chat_inicial');
        const chatCancelar = document.getElementById('chat_cancelar_reserva');
        const chatInfo = document.getElementById('chat_informacion_reserva');

        if (chatInicial) chatInicial.style.display = 'block';
        if (chatCancelar) chatCancelar.style.display = 'none';
        if (chatInfo) chatInfo.style.display = 'none';
        
        // 4. Limpiar el campo de texto
        const input = document.getElementById('pregunta_usuario');
        if (input) {
            input.value = '';
            input.focus(); // Opcional: devuelve el foco al teclado
        }

    } catch (error) {
        console.error("Error al volver:", error);
    }
}

// Atajos para los distintos botones de volver
function cancelar_reserva_chatbot() { boton_volver_chatbot(); }
function boton_cancelar_info_reserva_chatbot() { boton_volver_chatbot(); }
function boton_cancelar_reser_volver_chatbot() { boton_volver_chatbot(); }
function boton_volver_chat_chatbot(){ boton_volver_chatbot(); }
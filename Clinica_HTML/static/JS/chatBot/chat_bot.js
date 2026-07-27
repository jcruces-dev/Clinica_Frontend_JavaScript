/* ========================================
   1. INICIALIZACIÓN Y EVENTOS
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chatContainer');
    const chatBubble = document.getElementById('chatBubble');
    const chatInicial = document.getElementById('chat_inicial');
    const input = document.getElementById('pregunta_usuario');

    if (chatContainer) chatContainer.style.display = 'block';
    if (chatBubble) chatBubble.style.display = 'none';
    if (chatInicial) chatInicial.style.display = 'block';

    // DETECTAR SI LA PÁGINA FUE RECARGADA (F5 / REFRESH)
    const navegacion = performance.getEntriesByType("navigation");
    const esRecarga = navegacion.length > 0 && navegacion[0].type === 'reload';

    if (esRecarga) {
        // Si fue un refresh, borramos todo (sesión e historial)
        limpiarHistorialYSesion();
        console.log("🔄 Página recargada: Sesión e historial reiniciados por completo.");
    } else {
        // Si no fue recarga (ej. navegación interna), restauramos los mensajes guardados
        restaurarHistorialChat();
    }

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

/**
 * Borra tanto la sesión como el historial HTML del chat.
 */
function limpiarHistorialYSesion() {
    sessionStorage.removeItem('chat_session_id');
    sessionStorage.removeItem('chat_historial_html');
    generarNuevaSessionId();
}

/**
 * Genera un nuevo ID de sesión único.
 */
function generarNuevaSessionId() {
    const nuevoSessionId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('chat_session_id', nuevoSessionId);
    return nuevoSessionId;
}

/**
 * Obtiene el ID de sesión actual o crea uno si no existe.
 */
function obtenerSessionId() {
    let sessionId = sessionStorage.getItem('chat_session_id');
    if (!sessionId) {
        sessionId = generarNuevaSessionId();
    }
    return sessionId;
}

/**
 * Guarda el HTML actual del contenedor de mensajes en sessionStorage.
 */
function guardarHistorialChat() {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        sessionStorage.setItem('chat_historial_html', chatMessages.innerHTML);
    }
}

/**
 * Restaura los mensajes guardados en sessionStorage si existen.
 */
function restaurarHistorialChat() {
    const historialGuardado = sessionStorage.getItem('chat_historial_html');
    const chatMessages = document.querySelector('.chat-messages');
    if (historialGuardado && chatMessages) {
        chatMessages.innerHTML = historialGuardado;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

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

    // Dibujar el mensaje del usuario inmediatamente en el chat
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `<i class="fas fa-user me-2"></i> ${pregunta}`;
    chatMessages.appendChild(userMessage);

    // Indicador de escritura
    if (typing) {
        typing.style.display = 'flex';
        chatMessages.appendChild(typing); 
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    const sessionId = obtenerSessionId();

    let opcion_envio = 0;
    if (document.getElementById('info_reserva_input')) opcion_envio = 2;
    else if (document.getElementById('cancel_reserva_input')) opcion_envio = 3;

    const datos = { pregunta: pregunta, opcion: opcion_envio, session_id: sessionId };
    console.log("Datos enviados al servidor:", datos);
    
    preguntaInput.value = '';
    
    // Petición Axios
    axios.post('http://127.0.0.1:8000/chatbot/obtener_respuesta', datos)
    .then(function (response) {
        setTimeout(() => {
            if (typing) typing.style.display = 'none';
            
            if (response.status === 200 && response.data.respuesta) {
                console.log("-------------------------------------------------------");
                console.log('Respuesta del servidor:', response.data.respuesta);
                console.log("-------------------------------------------------------");
                escribirRespuestaConAnimacion(response.data.respuesta);
            } else {
                escribirRespuestaConAnimacion("❌ Hubo un error inesperado. Inténtalo de nuevo.");
            }
        }, 800);
    })
    .catch(function (error) {
        setTimeout(() => {
            if (typing) typing.style.display = 'none';
            console.error('Error:', error);
            
            const respuestaErrorConBoton = {
                tipo: 'animar',
                texto: "❌ El código ingresado no es válido o no existe en nuestros registros.",
                html_boton: `
                    <div style="text-align: center; margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px;">
                        <button type="button" onclick="boton_volver_chatbot()" class="btn-volver-inicio">
                            <i class="fas fa-arrow-left me-2"></i>Volver al Inicio
                        </button>
                    </div>
                `
            };

            escribirRespuestaConAnimacion(respuestaErrorConBoton);
        }, 800);
    });
}

function escribirRespuestaConAnimacion(respuesta) {
    const chatMessages = document.querySelector('.chat-messages');
    const botMessage = document.createElement('div');
    botMessage.className = 'message bot-message';
    
    // CASO 1: Objeto de animación
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
                guardarHistorialChat(); // Guardar historial tras terminar la animación
            }
        }
        escribirLetra();
    
    // CASO 2: String con HTML
    } else if (typeof respuesta === 'string' && respuesta.includes('<div')) {
        botMessage.innerHTML = `<i class="fas fa-robot me-2"></i> ${respuesta}`;
        chatMessages.appendChild(botMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        guardarHistorialChat();

    // CASO 3: Texto plano
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
            } else {
                guardarHistorialChat(); // Guardar historial tras terminar de escribir
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
        limpiarHistorialYSesion();

        const ids = ['cancel_reserva_input', 'info_reserva_input'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });

        // Limpieza visual completa de los mensajes antiguos
        const chatMessages = document.querySelector('.chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = ''; 
        }

        const chatInicial = document.getElementById('chat_inicial');
        const chatCancelar = document.getElementById('chat_cancelar_reserva');
        const chatInfo = document.getElementById('chat_informacion_reserva');

        if (chatInicial) chatInicial.style.display = 'block';
        if (chatCancelar) chatCancelar.style.display = 'none';
        if (chatInfo) chatInfo.style.display = 'none';
        
        const input = document.getElementById('pregunta_usuario');
        if (input) {
            input.value = '';
            input.focus();
        }

    } catch (error) {
        console.error("Error al volver:", error);
    }
}

// Atajos
function cancelar_reserva_chatbot() { boton_volver_chatbot(); }
function boton_cancelar_info_reserva_chatbot() { boton_volver_chatbot(); }
function boton_cancelar_reser_volver_chatbot() { boton_volver_chatbot(); }
function boton_volver_chat_chatbot(){ boton_volver_chatbot(); }
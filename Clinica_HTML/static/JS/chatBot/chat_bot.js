//
function abrirChat() {
  document.querySelector(".chat-container").style.display = "flex";
  document.querySelector(".chat-header-abrir").style.display = "none";
}
//
function cerrar_chat() {
  document.querySelector(".chat-container").style.display = "none";
  document.querySelector(".chat-header-abrir").style.display = "block";
}
document.querySelector('.chat-input button').addEventListener('click', sendMessage);
//
function sendMessage() {
  const input = document.querySelector('.chat-input input');
  const message = input.value.trim();
  console.log(message)
  debugger
  if(message) {
    // Crear elemento de mensaje de usuario
    const userMsg = document.createElement('div');
    userMsg.className = 'message user-message';
    userMsg.textContent = message;
    // Agregar al contenedor de mensajes
    document.querySelector('.chat-messages').appendChild(userMsg);
    
    // Limpiar input
    input.value = '';
  }
}
//
function respuesta_cahtBot() {
  const typing = document.querySelector('.typing-indicator');
  const input = document.getElementById("pregunta_usuario");
  const mensaje = input?.value.trim();

  if (!mensaje) {
    alert("Por favor escribe un mensaje antes de enviarlo.");
    return;
  }

  // Mostrar el indicador de escritura
  typing.style.display = 'inline-block';

  // Preparar los datos
  const datos = { pregunta: mensaje };

  // Enviar la petición al backend
  axios.post('http://127.0.0.1:8000/chatbot/obtener_respuesta', datos)
    .then(function (response) {
      typing.style.display = 'none';

      if (response.status === 200 && response.data.respuesta) {
        escribirRespuestaConAnimacion(response.data.respuesta);
      }
    })
    .catch(function (error) {
      typing.style.display = 'none';
      console.error('Error al contactar el backend:', error);
      alert("Ocurrió un error al procesar la respuesta del asistente.");
    });

  // Mostrar mensaje del usuario
  const userMsg = document.createElement('div');
  userMsg.className = 'message user-message';
  userMsg.textContent = mensaje;
  document.querySelector('.chat-messages').appendChild(userMsg);

  // Limpiar campo de entrada
  input.value = '';
}
//
function escribirRespuestaConAnimacion(texto) {
  // Seleccionamos la clase del mensaje.
  const contenedor = document.querySelector('.chat-messages');
  // Creamos un elemento DIV.
  const botMsg = document.createElement('div');
  // Le asignamos la clase.
  botMsg.className = 'message bot-message';
  // Lo unimos a su contenedor padre.
  contenedor.appendChild(botMsg);
  // Cramos un index para recorrer el texto
  let index = 0;
  // Asignamos un intervalo.
  const intervalo = setInterval(() => {
    if (index < texto.length) {
      botMsg.textContent += texto.charAt(index);
      index++;
      // Creamos el auto Scroll.
      contenedor.scrollTop = contenedor.scrollHeight; // autoscroll
    } else {
      // Si no existe nada, limpiamos.
      clearInterval(intervalo);
    }
  }, 25); // velocidad (en milisegundos) por carácter
}
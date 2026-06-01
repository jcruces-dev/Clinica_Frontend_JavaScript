// 1. Inicializas Stripe usando tu Clave Publicable (pk_test_...)
const stripe = Stripe('pk_test_51TYa1EQ37bFB5bUepMhTC0jQ7IG75JygL3gADwvaK4CaNbEblu0dUvACUOXzvTUbbyPNCyWxzH16hCU2Shp81qW400uBWdzTKX');

// Formatear rut Chileno.
function formatearRUT(rut) {
    // Eliminar todo lo que no sea dígito o 'k'/'K'
    rut = rut.replace(/[^\dkK]/g, '').toUpperCase();

    // Separar cuerpo y dígito verificador
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);

    // Formatear cuerpo con puntos cada 3 dígitos desde el final
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return cuerpo + '-' + dv;
}

// Creamos un evento de escucha para el rut del paciente que se va a ingresar consus . y -.
document.addEventListener('DOMContentLoaded', function () {
    //
    const inputRut = document.getElementById('rut');
    //
    inputRut.addEventListener('input', function (e) {
        let valor = e.target.value.replace(/\./g, '').replace(/-/g, '');
        
        // Solo formatear si hay al menos 2 caracteres (cuerpo + dv)
        if (valor.length >= 2) {
            e.target.value = formatearRUT(valor);
        }
    });
});

// Envío de datos del formulario para reserva de hora desde el archivo Index. 
function clinica_disp() {
    const selectClinica = document.getElementById("index_doctor_clinica");
    
    // Guardar la opción por defecto
    const defaultOption = '<option value="" selected>Seleccionar Clínica</option>';
    
    // Verificar si ya hay datos cargados (evita múltiples peticiones)
    if (selectClinica.dataset.cargado === "true") {
        console.log("Clínicas ya cargadas previamente");
        return;
    }
    
    // Mostrar indicador de carga (opcional)
    selectClinica.innerHTML = defaultOption + '<option disabled>Cargando clínicas...</option>';
    
    axios.get('https://jacruces91.pythonanywhere.com/reserva/listar_clinica_index')
    .then(function (response) {
        // Verificar que la respuesta sea válida
        if (!response.data || !response.data.list_clinica || !Array.isArray(response.data.list_clinica)) {
            console.error("Respuesta inválida:", response.data);
            selectClinica.innerHTML = defaultOption + '<option disabled>Error al cargar</option>';
            return;
        }
        
        const clinicas = response.data.list_clinica;
        
        // Limpiar el select y agregar opción por defecto
        selectClinica.innerHTML = defaultOption;
        
        // Agregar las clínicas
        clinicas.forEach(element => {
            const option = document.createElement("option");
            option.value = element.id;
            option.setAttribute("data-nombre_clinica", element.nombre_clinica);
            option.setAttribute("data-id_clinica", element.id);
            option.setAttribute("data-comuna_clinica", element.comuna_clinica);
            option.setAttribute("data-direccion_clinica", element.direccion_clinica);
            option.textContent = element.nombre_clinica;
            selectClinica.appendChild(option);
        });
        
        // Marcar como cargado para evitar futuras peticiones
        selectClinica.dataset.cargado = "true";
        
        console.log(`✅ ${clinicas.length} clínicas cargadas correctamente`);
    })
    .catch(error => {
        console.error('Error al cargar clínicas:', error);
        selectClinica.innerHTML = defaultOption + '<option disabled>Error al cargar clínicas</option>';
        
        if (error.response) {
            console.log('Error Response:', error.response.data);
            console.log('Error Status:', error.response.status);
        }
    });
}
//
function select_esp_index(e){
    //
    let select_clinica = document.getElementById("index_doctor_clinica").value
    let id = select_clinica
    console.log(select_clinica)
    let select_especialidad = document.getElementById("index_especialidad")
    let index_doctor = document.getElementById("index_doctor");
    // Reiniciar el select de "Doctor" a su estado por defecto
    index_doctor.innerHTML = '<option selected>Doctor</option>';
    // Evitar múltiples peticiones si ya hay datos
    if (select_especialidad.options.length > 1) return;
    //
    let arr =[]
    //
    axios.get(`https://jacruces91.pythonanywhere.com/reserva/listar_esp_index/${id}/`,{
    })
    .then(function (response) {
        // 
        const esp = response.data.especialidad;
        console.warn(esp)
        //
        esp.forEach(element => {
            // Crear un NUEVO elemento option en cada iteración
            const elegir_especialidad = document.createElement("option");
            elegir_especialidad.value = element.id;
            elegir_especialidad.setAttribute("data-esp", element.nombre_especialidad)
            elegir_especialidad.setAttribute("data-id_especialidad", element.id)
            elegir_especialidad.setAttribute("data-valor_especialidad", element.valor_especialidad)
            elegir_especialidad.textContent = element.nombre_especialidad;
            select_especialidad.appendChild(elegir_especialidad);
        });
    })
    .catch(error => {
        if (error.response) {
            console.log('Error Response:', error.response.data);
            console.log('Error Status:', error.response.status);
            console.log('Error Headers:', error.response.headers);
        }
    });
}
//
function valor_select_esp_index(){
    //
    let id_clinica = document.getElementById("index_doctor_clinica").value
    console.log(id_clinica)
    //
    let id_especialidad = document.getElementById("index_especialidad").value
    console.warn(id_especialidad)
    //
    let index_doctor = document.getElementById("index_doctor")
    // Limpiar opciones previas (excepto la primera)
    index_doctor.innerHTML = '<option selected>Doctor</option>';
    //
    let arr =[]
    //
    axios.get(`https://jacruces91.pythonanywhere.com/reserva/listar_doc_index/${id_clinica}/${id_especialidad}/`,{
    })
    .then(function (response) {
        // 
        const doctores = response.data.doctores;
        console.log(doctores)
        // Evitar múltiples peticiones si ya hay datos
        doctores.forEach(element => {
            // Crear un NUEVO elemento option en cada iteración
            const elegir_doctor = document.createElement("option");
            elegir_doctor.value = element.id_doctor;
            elegir_doctor.setAttribute("data-nombre", element.primer_nombre + " " + element.segundo_nombre + " " + element.ap_paterno + " " + element.ap_materno)
            elegir_doctor.textContent = element.primer_nombre + " " + element.segundo_nombre + " " + element.ap_paterno + " " + element.ap_materno;
            index_doctor.appendChild(elegir_doctor);
        });  
    })
    .catch(error => {
        if (error.response) {
            console.log('Error Response:', error.response.data);
            console.log('Error Status:', error.response.status);
            console.log('Error Headers:', error.response.headers);
        }
    });
}
//
var calendar;
function calendario_reserva_index(){
    //
    let id_clinica = document.getElementById("index_doctor_clinica").value
    console.log(id_clinica)
    let id_especialidad = document.getElementById("index_especialidad").value
    console.log(id_especialidad)
    let id_doctor = document.getElementById("index_doctor").value
    console.log(id_doctor)
    let primer_nombre_index = document.getElementById("primer_nombre_index").value
    console.log(primer_nombre_index)
    let segundo_nombre_index = document.getElementById("segundo_nombre_index").value
    console.log(segundo_nombre_index)
    let ap_paterno_index = document.getElementById("ap_paterno_index").value
    console.log(ap_paterno_index)
    let ap_materno_index = document.getElementById("ap_materno_index").value
    console.log(ap_materno_index)
    let email = document.getElementById("email").value
    console.log(email)
    let edad = document.getElementById("edad").value
    console.log(edad)
    let fono = document.getElementById("fono").value
    console.log(fono)
    let rut = document.getElementById("rut").value
    console.log(rut)
    //------- Valor Radio Button Sexo ---------
    let sexo = document.getElementsByName("sexo")
    let valor_sexo;
    sexo.forEach(radio => {
        if (radio.checked) {
            valor_sexo = radio.value;
        }
    });
    console.log(valor_sexo)
    // Si estos campos están vacíos, no permitimos que el código avance al calendario
    if (!primer_nombre_index || !segundo_nombre_index || !ap_paterno_index || !ap_materno_index || !email || !edad || !fono || !rut ) {
        Swal.fire({
            title: "Datos Incompletos",
            text: "Por favor, rellena todos los campos obligatorios.",
            icon: "warning"
        });

        // Si ya había un calendario visible de una consulta anterior exitosa, lo removemos
        if (calendar) {
            calendar.destroy();
            calendar = null;
        }
        return;
    }
    if (valor_sexo == null || valor_sexo == "" || valor_sexo == undefined || id_especialidad == "Seleccionar Especialidad" || id_especialidad == "" || id_clinica == "Seleccionar Clínica" || id_clinica == "" || id_clinica == "" || id_doctor == "Seleccionar Médico" || id_doctor == "") {
        Swal.fire({
            title: "Datos Incompletos",
            text: "Por favor, rellena los campos obligatorios (Sexo, Clínica, Especialidad, Doctor, etc.",
            icon: "warning"
        });
         // Si ya había un calendario visible de una consulta anterior exitosa, lo removemos
        if (calendar) {
            calendar.destroy();
            calendar = null;
        }
        return;
    }
    console.warn("Todos los datos necesarios están presentes. Procediendo a cargar el calendario...");
    // !id_clinica || !id_especialidad || !id_doctor || 
    //
    let datos = {
        'id_clinica': id_clinica,
        'id_especialidad': id_especialidad,
        'id_doctor': id_doctor,
        'primer_nombre': primer_nombre_index,
        'segundo_nombre': segundo_nombre_index,
        'ap_paterno': ap_paterno_index,
        'ap_materno': ap_materno_index,
        'email': email,
        'edad': edad,
        'fono': fono,
        'rut': rut,
        'sexo': valor_sexo,
    }
    console.warn(datos)
    // INICIALIZACIÓN ÚNICA DEL CALENDARIO.
    var calendarEl = document.getElementById('calendar_index');
    // https://jacruces91.pythonanywhere.com/reserva/reserva_paciente_index
    let request_calendar = `https://jacruces91.pythonanywhere.com/reserva/reserva_paciente_index`
    if (calendar) {
         // Destruye la instancia actual
        calendar.destroy();
        // Resetea la variable
        calendar = null;
    }
    // Solo crea el calendario si no existe
    if (!calendar) {
        calendar = new FullCalendar.Calendar(calendarEl, {
            locale: 'es',
            initialView: 'timeGridWeek',
            slotDuration: '01:00:00',
            slotMinTime: '08:00:00',
            slotMaxTime: '23:00:00',
            navLinks: true,
            editable: true,
            weekends: true,
            events: function(fetchInfo, successCallback, failureCallback) {
                fetch(request_calendar, {
                    method: 'POST',
                    headers: {
                        //'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(datos)
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw errorData;
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    const events = data.reserva.map(reserv => ({
                        id_reserva: reserv.id_reserva,
                        nombre_doctor: reserv.nombre_doctor,
                        title: reserv.title,
                        nombre_clinica: reserv.nombre_clinica,
                        start: reserv.start,
                        end: reserv.end,
                        direccion_clinica: reserv.direccion_clinica,
                        comuna_clinica: reserv.comuna_clinica,
                    }));
                    successCallback(events);
                })
                .catch(error => {
                    console.error("Error al cargar eventos:", error);
                    if (error.error === 0) {
                        Swal.fire({
                            title: "Error",
                            text: "Faltan datos",
                            icon: "error"
                        });
                        calendar.destroy();
                        calendar = null;
                        return
                    } else {
                        calendar.destroy();
                        calendar = null;
                        Swal.fire({
                            title: "Error",
                            text: "Faltan datos",
                            icon: "error"
                        });
                    }
                    if (error.error === 7) {
                        Swal.fire({
                            title: "Error",
                            text: "Verificar número de contacto",
                            icon: "error"
                        });
                        calendar.destroy();
                        calendar = null;
                        return
                    }
                    if (error.error === 6) {
                        Swal.fire({
                            title: "Error",
                            text: "Ingresar RUT válido",
                            icon: "error"
                        });
                        calendar.destroy();
                        calendar = null;
                        return
                    }
                    failureCallback(error);
                });
            },
            eventClick: function(clickInfo) {
                clickInfo.jsEvent.preventDefault();
                // Extraemos la información del evento al hacer clic
                let eventTitle = clickInfo.event.title;
                let start = clickInfo.event.start;
                let end = clickInfo.event.end;
                let nombre_doctor = clickInfo.event.nombre_doctor;
                let nombre_clinica = clickInfo.event.nombre_clinica;
                let direccion_clinica = clickInfo.event.direccion_clinica;
                let comuna_clinica = clickInfo.event.comuna_clinica;
                let eventStart = clickInfo.event.start.toLocaleString('es-CL');
                let eventEnd = clickInfo.event.end.toLocaleString('es-CL');
            },
            dateClick: function(info) {
                var actual = new Date();
                if (info.date >= actual) {
                    // Obtén el elemento correspondiente a la hora clicada
                    const slotElements = document.querySelectorAll('.fc-timegrid-slot');
                    let fechaFormateada = info.dateStr.toLocaleString('es-CL', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                    abrir_modal_nueva_cita_pa_index(fechaFormateada)
                }
            },
            // 
            eventContent: function(info) {
                console.warn(info)
                return {
                    html: `
                        <div>
                            <strong>${info.event.title}</strong>
                        </div>
                    `
                };
            },
            // Evento de Mouse.
            eventMouseEnter: function(mouseEnterInfo){
                // Elemento Visible.
                let el = mouseEnterInfo.el
                el.classList.add("relative")
                //
                let newEl = document.createElement("div")
                let newElTitle = mouseEnterInfo.event.title
                let newElLocation = mouseEnterInfo.event.start
                console.log(newElLocation)
                let nombreDoctor = mouseEnterInfo.event.extendedProps.nombre_doctor;
                newEl.innerHTML = `
                    <div
                        class="fc-hoverable-event"
                        style="position: absolute; bottom: 100%; left: 0; width: 300px; height: auto;
                        background-color: white; z-index: 50; border: 1px solid #e2e8f0; border-radius: 0.375rem;
                        padding: 0.75rem; font-size: 14px; font-family: 'Inter', sans-serif; cursor: pointer;"
                        >
                        <strong>${newElTitle}</strong>
                    </div>
                `
                el.after(newEl)
            },
            // Método para ocultar la info una vez pasado el mouse.
            eventMouseLeave: function(mouseLeaveInfo){
                // Obtenemos la clase del elementos que creamos arriba.
                let el = document.querySelector(".fc-hoverable-event").remove()
            },
            dayCellContent: function(dayCellContent) {
                let today = new Date();
                today.setHours(0, 0, 0, 0); // Ignorar la hora
                let cellDate = new Date(dayCellContent.date);
                cellDate.setHours(0, 0, 0, 0);
                ///console.log(cellDate)
                console.log(today)
                // Solo cambia el color pero permite eventos
                if (cellDate < today) {
                    return {
                        html: `<div style="color: gray;">${cellDate.getDate()}</div>`
                    };
                }
            },
        });
        // Cargamos el calendario con los eventos.
        calendar.render();
        // Esperamos 2 segundos y recargamos la página.
    } else {
        // Si el calendario ya existe, actualiza sus eventos
        calendar.refetchEvents();
    }
}
//
function abrir_modal_nueva_cita_pa_index(fechaFormateada){
    let fecha = new Date(fechaFormateada);
    // Formatear fecha en DD-MM-YYYY y la hora seleccionada en el FullCallendar.
    let dia = String(fecha.getDate()).padStart(2, '0');
    let mes = String(fecha.getMonth() + 1).padStart(2, '0');
    let año = fecha.getFullYear();
    let fechaFormateadaFinal = `${dia}-${mes}-${año}`;
    // Obtener hora original
    let horaOriginal = String(fecha.getHours()).padStart(2, '0');
    let minutos = String(fecha.getMinutes()).padStart(2, '0');
    let horaFormateada = `${horaOriginal}:${minutos}`;
    // Sumar una hora
    let fechaMasUnaHora = new Date(fecha.getTime() + 60 * 60 * 1000);
    let horaSumada = String(fechaMasUnaHora.getHours()).padStart(2, '0');
    let horaSumadaFormateada = `${horaSumada}:${minutos}`;
    let primer_nombre_index = document.getElementById("primer_nombre_index").value
    let segundo_nombre_index = document.getElementById("segundo_nombre_index").value
    let ap_paterno = document.getElementById("ap_paterno_index").value
    let ap_materno = document.getElementById("ap_materno_index").value
    let email = document.getElementById("email").value
    let rut = document.getElementById("rut").value
    let fono = document.getElementById("fono").value
    let edad = document.getElementById("edad").value
    let sexo = document.getElementsByName("sexo")
    let valor_radio;
    sexo.forEach(radio => {
        if (radio.checked) {
            valor_radio = radio.value;
        }
    });
    // Clínica
    let opcionSeleccionada = index_doctor_clinica.options[index_doctor_clinica.selectedIndex];
    let nombreClinica = opcionSeleccionada.getAttribute("data-nombre_clinica");
    let direccionClinica = opcionSeleccionada.getAttribute("data-direccion_clinica");
    let comunaClinica = opcionSeleccionada.getAttribute("data-comuna_clinica");
    // Especialidad.
    let opcionSeleccionadaEspecialidad = index_especialidad.options[index_especialidad.selectedIndex];
    let id_especialidad = opcionSeleccionadaEspecialidad.getAttribute("data-id_especialidad");
    let esp = opcionSeleccionadaEspecialidad.getAttribute("data-esp");
    let valor_especialidad = opcionSeleccionadaEspecialidad.getAttribute("data-valor_especialidad");
    let nuevo_pac_admin_panel = document.getElementById("modal_info_res_index")
    //
    // Nombre Doctor. index_doctor
    let index_doctor_element = document.getElementById("index_doctor");
    let opcionSeleccionadaDoctor = index_doctor_element.options[index_doctor_element.selectedIndex];
    let nombredoctor = opcionSeleccionadaDoctor.getAttribute("data-nombre");
    //
    let cita_reserva_nombre = document.getElementById("cita_reserva_nombre")
    cita_reserva_nombre.value = primer_nombre_index + " " + segundo_nombre_index + " " + ap_paterno + " " + ap_materno
    let cita_reserva_email = document.getElementById("cita_reserva_email")
    cita_reserva_email.value = email
    let cita_reserva_edad = document.getElementById("cita_reserva_edad")
    cita_reserva_edad.value = edad
    let cita_reserva_sexo = document.getElementById("cita_reserva_sexo")
    cita_reserva_sexo.value = valor_radio
    let cita_reserva_fono = document.getElementById("cita_reserva_fono")
    cita_reserva_fono.value = fono
    let cita_reserva_rut = document.getElementById("cita_reserva_rut")
    cita_reserva_rut.value = rut
    let cita_reserva_esp = document.getElementById("cita_reserva_esp")
    cita_reserva_esp.value = esp
    let cita_reserva_valor_esp = document.getElementById("cita_reserva_valor_esp")
    cita_reserva_valor_esp.value = "$"+valor_especialidad
    let cita_reserva_nombre_clinica = document.getElementById("cita_reserva_nombre_clinica")
    cita_reserva_nombre_clinica.value = nombreClinica
    let cita_reserva_direccion_clinica = document.getElementById("cita_reserva_direccion_clinica")
    cita_reserva_direccion_clinica.value = direccionClinica
    let cita_reserva_comuna_clinica = document.getElementById("cita_reserva_comuna_clinica")
    cita_reserva_comuna_clinica.value = comunaClinica
    let cita_reserva_nombre_doctor = document.getElementById("cita_reserva_nombre_doctor")
    cita_reserva_nombre_doctor.value = nombredoctor
    //
    let cita_reserva_fecha = document.getElementById("cita_reserva_fecha")
    cita_reserva_fecha.value = fechaFormateadaFinal
    let hora_inicio = document.getElementById("cita_reserva_hora_inicio")
    hora_inicio.value = horaFormateada
    let hora_termino = document.getElementById("cita_reserva_hora_termino")
    hora_termino.value = horaSumadaFormateada
    //
    let modal_info_res_index = document.getElementById("modal_info_res_index")
    // Crea una instancia del modal de Bootstrap
    const modalInstance = new bootstrap.Modal(modal_info_res_index);
    // Abre el modal
    modalInstance.show();
}
// Mostrar bloc de las cuotas cuando se presiona el botón de selección de cuotas.
// function mostrar_cuotas_disponibles(){
//     let container_cuota = document.getElementById("lista_cuota")
//     container_cuota.style.display = "block"
// }
// Ocultar bloc de las cuotas cuando se presiona el botón de selección de cancelar o débito.
// function ocultar_cuotas_disponibles(){
//     let container_cuota = document.getElementById("lista_cuota")
//     container_cuota.style.display = "none"
// }
//
// function boton_pago_credito(){
//     mostrar_cuotas_disponibles()
// }
// ---------------------- STRIPE. -----------------------------------------------------
// Declaramos esta variable global para luego utilizar.
let elements = undefined; 
let reservaUuidGlobal = null;
// Utilizamos el MODAL con la información del método inicializarPasarelaStripe().
document.getElementById('modal_info_res_index').addEventListener('shown.bs.modal', function () {
    // Llamamos al método de abajo que tiene nuestra petición AXIOS al BACKEND.
    inicializarPasarelaStripe();
});
// INDEX crear la reserva y pagar con STRIPE al mismo tiempo.
async function inicializarPasarelaStripe(){
    let primer_nombre_index = document.getElementById("primer_nombre_index").value;
    let segundo_nombre_index = document.getElementById("segundo_nombre_index").value;
    let ap_paterno = document.getElementById("ap_paterno_index").value;
    let ap_materno = document.getElementById("ap_materno_index").value;
    let cita_reserva_nombre = document.getElementById("cita_reserva_nombre").value;
    let cita_reserva_email = document.getElementById("cita_reserva_email").value;
    let cita_reserva_edad = document.getElementById("cita_reserva_edad").value;
    let cita_reserva_sexo = document.getElementById("cita_reserva_sexo").value;
    let cita_reserva_fono = document.getElementById("cita_reserva_fono").value;
    let cita_reserva_rut = document.getElementById("cita_reserva_rut").value;
    let cita_reserva_esp = document.getElementById("cita_reserva_esp").value;
    let cita_reserva_valor_esp = document.getElementById("cita_reserva_valor_esp").value;
    let cita_reserva_nombre_clinica = document.getElementById("cita_reserva_nombre_clinica").value;
    let cita_reserva_direccion_clinica = document.getElementById("cita_reserva_direccion_clinica").value;
    let cita_reserva_comuna_clinica = document.getElementById("cita_reserva_comuna_clinica").value;
    let cita_reserva_nombre_doctor = document.getElementById("cita_reserva_nombre_doctor").value;
    let cita_reserva_fecha = document.getElementById("cita_reserva_fecha").value;
    let hora_inicio = document.getElementById("cita_reserva_hora_inicio").value;
    let hora_termino = document.getElementById("cita_reserva_hora_termino").value;

    // Pasamos los datos a la petición de AXIOS
    let datos = {
        'nombre_paciente': cita_reserva_nombre,
        'email': cita_reserva_email,
        'edad': cita_reserva_edad,
        'sexo': cita_reserva_sexo,
        'fono': cita_reserva_fono,
        'rut': cita_reserva_rut,
        'especialidad': cita_reserva_esp,
        'valor_especialidad': cita_reserva_valor_esp,
        'nombre_clinica': cita_reserva_nombre_clinica,
        'direccion_clinica': cita_reserva_direccion_clinica,
        'comuna_clinica': cita_reserva_comuna_clinica,
        'nombre_doctor': cita_reserva_nombre_doctor,
        'fecha_reserva': cita_reserva_fecha,
        'hora_inicio': hora_inicio,
        'hora_termino': hora_termino,
        'primer_nombre': primer_nombre_index,
        'segundo_nombre': segundo_nombre_index,
        'ap_paterno': ap_paterno,
        'ap_materno': ap_materno,
    };
    //
    try {
        const response = await axios.post("http://127.0.0.1:8000/reserva/pago_stripe_reserva_index/", datos, {
            headers: { "Content-Type": "application/json" }
        });
        console.log(response.data)
        // Sacamos ambas variables limpiamente en una sola línea
        let { clientSecret, reserva_uuid } = response.data;
        
        // Guardamos el UUID en la variable global
        reservaUuidGlobal = reserva_uuid; 
        console.log("UUID de la reserva guardado globalmente:", reservaUuidGlobal);

        // Pasamos el clientSecret a Stripe para configurar los elementos
        elements = stripe.elements({ clientSecret });

        // Creamos e inyectamos el formulario seguro en el HTML. STRIPE.
        const paymentElement = elements.create("payment");
        paymentElement.mount("#payment-element"); 

    } catch (error) {
        console.error("Error al inicializar Stripe:", error);
        if (error.response) {
            alert(`Error: ${error.response.data.detalle || 'No se pudo iniciar el pago'}`);
        }
    }
}

// Envío del FORULARIO para procesar el dinero.
document.querySelector("#payment-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const botonPagar = document.querySelector("#submit");
    if (botonPagar) {
        botonPagar.disabled = true;
        botonPagar.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Procesando Pago...';
    }

    // Capturamos de forma dinámica el nombre y correo del paciente desde tu formulario nativo
    let cita_reserva_nombre = document.getElementById("cita_reserva_nombre").value;
    let cita_reserva_email = document.getElementById("cita_reserva_email").value;

    // Aseguramos pasar "elements" y el titular de la tarjeta.
    const { error, paymentIntent } = await stripe.confirmPayment({
        // Forzamos la lectura de la instancia global cargada.
        elements: elements,
        confirmParams: {
            return_url: window.location.href, 
            // Agregamos los billing_details para evitar fallas por ocultar campos.
            payment_method_data: {
                billing_details: {
                    name: cita_reserva_nombre,
                    email: cita_reserva_email
                }
            }
        },
        redirect: "if_required" 
    });
    // Si ocurre un error inmediato (ej: tarjeta rechazada).
    if (error) {
        if (botonPagar) {
            botonPagar.disabled = false;
            botonPagar.innerHTML = '<i class="fas fa-lock me-2"></i>Confirmar Pago';
        }
        const messageContainer = document.querySelector("#error-message");
        messageContainer.textContent = error.message;
        return;
    }
    // Si paymentIntent existe y dice "succeeded", llamamos a la ruta de éxito
    if (paymentIntent && paymentIntent.status === "succeeded") {
        try {
            console.log("¡Stripe aprobó el pago! Avisando al backend para actualizar...");
            // Despachamos el UUID a tu endpoint 'pago_debito_realizado'
            const confirmacion = await axios.post("http://127.0.0.1:8000/reserva/confirmar_pago_stripe_exitoso/", {
                'reserva_uuid': reservaUuidGlobal,
                'stripe_payment_id': paymentIntent.id
            }, {
                headers: { "Content-Type": "application/json" }
            });

            if (confirmacion.status === 200) {
                // Cerramos el modal de Bootstrap
                const modalResumen = bootstrap.Modal.getInstance(document.getElementById('modal_info_res_index'));
                if (modalResumen) { modalResumen.hide(); }

                // Disparamos el SweetAlert2.
                Swal.fire({
                    icon: 'success',
                    title: '¡Reserva Confirmada!',
                    text: 'Tu pago fue procesado correctamente. Te enviamos un correo con los detalles.',
                    confirmButtonColor: '#1e3c72'
                }).then(() => {
                    // Recarga el calendario para ver la hora ocupada
                    window.location.reload();
                });
            }
        } catch (err) {
            console.error("Error en la confirmación final:", err);
            alert("El pago pasó en Stripe, pero la BD de Django falló al actualizar.");
        }
    }
});
// Ocultar las Cuotas.
// function cancelar_pago(){
//     ocultar_cuotas_disponibles()
// }
// Pago con crédito desde el index.
// function pagar_index_reserva_credito(){
//     let primer_nombre_index = document.getElementById("primer_nombre_index").value
//     let segundo_nombre_index = document.getElementById("segundo_nombre_index").value
//     let ap_paterno = document.getElementById("ap_paterno_index").value
//     let ap_materno = document.getElementById("ap_materno_index").value
//     let cita_reserva_nombre = document.getElementById("cita_reserva_nombre").value
//     let cita_reserva_email = document.getElementById("cita_reserva_email").value
//     let cita_reserva_edad = document.getElementById("cita_reserva_edad").value
//     let cita_reserva_sexo = document.getElementById("cita_reserva_sexo").value
//     let cita_reserva_fono = document.getElementById("cita_reserva_fono").value
//     let cita_reserva_rut = document.getElementById("cita_reserva_rut").value
//     let cita_reserva_esp = document.getElementById("cita_reserva_esp").value
//     let cita_reserva_valor_esp = document.getElementById("cita_reserva_valor_esp").value
//     let cita_reserva_nombre_clinica = document.getElementById("cita_reserva_nombre_clinica").value
//     let cita_reserva_direccion_clinica = document.getElementById("cita_reserva_direccion_clinica").value
//     let cita_reserva_comuna_clinica = document.getElementById("cita_reserva_comuna_clinica").value
//     let cita_reserva_nombre_doctor = document.getElementById("cita_reserva_nombre_doctor").value
//     let cita_reserva_fecha = document.getElementById("cita_reserva_fecha").value
//     let hora_inicio = document.getElementById("cita_reserva_hora_inicio").value
//     let hora_termino = document.getElementById("cita_reserva_hora_termino").value
//     //---------------------- Sexo --------------------
//     let edit_sexo = document.getElementsByName("cuota_index")
//     let selectCuota;
//     edit_sexo.forEach((radioButton) => {
//         if (radioButton.checked) {
//             selectCuota = radioButton.value;
//             console.warn(selectCuota)
//         }
//     });
//     //---------------------- Fin Sexo ----------------
//     Swal.fire({
//         title: "¿Está seguro de pagar la cita?",
//         text: "Una vez aceptado el pago, se procederá a generar la cita.",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "¡Si, Pagar!"
//       }).then((result) => {
//         if (result.isConfirmed) {
//             let datos = {
//                 'nombre_paciente': cita_reserva_nombre,
//                 'email': cita_reserva_email,
//                 'edad': cita_reserva_edad,
//                 'sexo': cita_reserva_sexo,
//                 'fono': cita_reserva_fono,
//                 'rut': cita_reserva_rut,
//                 'especialidad': cita_reserva_esp,
//                 'valor_especialidad': cita_reserva_valor_esp,
//                 'nombre_clinica': cita_reserva_nombre_clinica,
//                 'direccion_clinica': cita_reserva_direccion_clinica,
//                 'comuna_clinica': cita_reserva_comuna_clinica,
//                 'nombre_doctor': cita_reserva_nombre_doctor,
//                 'fecha_reserva': cita_reserva_fecha,
//                 'hora_inicio': hora_inicio,
//                 'hora_termino': hora_termino,
//                 'cant_cuotas': selectCuota,
//                 'primer_nombre': primer_nombre_index,
//                 'segundo_nombre': segundo_nombre_index,
//                 'ap_paterno': ap_paterno,
//                 'ap_materno': ap_materno,
//             }
//             console.log(datos)
//             // https://jacruces91.pythonanywhere.com/reserva/pago_credito_reserva_index
//             axios.post(`https://jacruces91.pythonanywhere.com/reserva/pago_credito_reserva_index`, datos,{
//                 headers: {
//                     //'Authorization': `Token ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             })
//             .then(function (response) {
//                 console.warn(response.data);
//                 console.warn(response.status)
//                 let doc = response.data.list_doctor;
//                 if (response.status == 200) {
//                     Swal.fire({
//                         icon: "success",
//                         title: "Pago Realizado",
//                         text: "El pago de la reserva se ha efectuado correctamente!",
//                     });
//                     // 
//                     if (calendar) {
//                         calendar.refetchEvents();
//                     }
//                     // Volvemos a recargar el sitio web.
//                     setTimeout(function() {
//                         location.reload();
//                     }, 2000);
//                 }
//             })
//             .catch(error => {
//                 if (error.response) {
//                     console.log('Error Response:', error.response.data);
//                     console.log('Error Status:', error.response.status);
//                     console.log('Error Headers:', error.response.headers);
//                     if (error.response.data.error == 3) {
//                         Swal.fire({
//                             icon: "error",
//                             title: "El grupo ya existe",
//                             text: "El grupo fue creado anteriormente!",
//                         });
//                     }
//                     if (error.response.data.error == 8) {
//                         Swal.fire({
//                             icon: "error",
//                             title: "Reserva No Disponible",
//                             text: "Debe elegir otro horario de reserva.",
//                         });
//                     }
//                 }
//             });
//         }
//     });
// }
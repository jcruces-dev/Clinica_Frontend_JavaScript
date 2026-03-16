// Desde el PANEL PACIENTE, el paciente registrado ingresa el código de reserva para verificar su reserva y luego proceder al pago.
function enviar_cod_verificacion(){
        //
    let cod_reserva = document.getElementById("cod_reserva").value
    console.log(cod_reserva)
    //
    let datos = {
        'reserva_uuid': cod_reserva,
    }
    console.warn(datos)
    axios.post('https://jacruces91.pythonanywhere.com/reserva/cod_reserva_verificacion/',datos)
    // axios.post('http://127.0.0.1:8000/reserva/cod_reserva_verificacion',datos)
        .then(function (response) {
            console.log(response.data)
            let cod_ver = response.data.cod
            if (cod_ver == 0){
                Swal.fire({
                    icon: "success",
                    title: "Encontrada",
                    text: "La reserva fue encontrada..",
                });
            }
        })
        .catch(error => {
            if (error.response) {
                console.log('Error Response:', error.response.data);
                console.log('Error Status:', error.response.status);
                console.log('Error Headers:', error.response.headers);
                if (error.response.data == 1) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "¡El pago de la reserva ya fue realizado!",
                    });
                }
                if (error.response.data == 2) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "¡Ingrese el código correctamente!",
                    });
                }
                if (error.response.data == 3) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "¡Ingrese el código correctamente!",
                    });
                }
            }
        });
}

// Esto es para los pacientes NO registrados que ingresan el código de reserva para verificar su reserva y luego proceder al pago.
function enviar_cod_verificacion_index(){
    //
    let cod_reserva = document.getElementById("cod_reserva_index").value
    console.log(cod_reserva)
    //
    let datos = {
        'reserva_uuid': cod_reserva,
    }
    console.warn(datos)
    // axios.post('https://jacruces91.pythonanywhere.com/reserva/cod_reserva_verificacion',datos)
    axios.post('http://127.0.0.1:8000/reserva/cod_reserva_verificacion_index/',datos)
        .then(function (response) {
            console.log(response.data.datos)
            let reserva_cerrada;
            let color;
            response.data.datos.forEach(element => {
                if (element.reserva_cerrada == 0){
                    reserva_cerrada = "Reserva Sin Cerrar";
                    color = "red"
                }
                if (element.reserva_cerrada == 1){
                    reserva_cerrada = "Reserva Cerrada";
                    color = "green"
                }
                let cod_reserva_pagar = document.getElementById("cod_reserva_pagar")
                cod_reserva_pagar.value = element.cod_reserva
                let pagar_index_cita_reserva_nombre = document.getElementById("pagar_index_cita_reserva_nombre")
                pagar_index_cita_reserva_nombre.value = element.nombre_paciente
                let pagar_index_cita_reserva_email = document.getElementById("pagar_index_cita_reserva_email")
                pagar_index_cita_reserva_email.value = element.email
                let pagar_index_cita_reserva_pagada = document.getElementById("pagar_index_cita_reserva_pagada")
                pagar_index_cita_reserva_pagada.value = "No pagado"
                pagar_index_cita_reserva_pagada.style.color = "red"
                let pagar_index_cita_reserva_estado = document.getElementById("pagar_index_cita_reserva_estado")
                pagar_index_cita_reserva_estado.value = reserva_cerrada
                pagar_index_cita_reserva_estado.style.color = color
                let pagar_index_cita_reserva_rut = document.getElementById("pagar_index_cita_reserva_rut")
                pagar_index_cita_reserva_rut.value = element.rut_paciente
                let pagar_index_cita_reserva_esp = document.getElementById("pagar_index_cita_reserva_esp")
                pagar_index_cita_reserva_esp.value = element.especialidad
                let pagar_index_cita_reserva_valor_esp = document.getElementById("pagar_index_cita_reserva_valor_esp")
                pagar_index_cita_reserva_valor_esp.value =element.valor_especialidad
                let pagar_index_cita_reserva_nombre_clinica = document.getElementById("pagar_index_cita_reserva_nombre_clinica")
                pagar_index_cita_reserva_nombre_clinica.value =element.nombre_clinica
                let pagar_index_cita_reserva_direccion_clinica = document.getElementById("pagar_index_cita_reserva_direccion_clinica")
                pagar_index_cita_reserva_direccion_clinica.value = element.direccion_clinica
                let pagar_index_cita_reserva_comuna_clinica = document.getElementById("pagar_index_cita_reserva_comuna_clinica")
                pagar_index_cita_reserva_comuna_clinica.value = element.comuna_clinica
                let pagar_index_cita_reserva_nombre_doctor = document.getElementById("pagar_index_cita_reserva_nombre_doctor")
                pagar_index_cita_reserva_nombre_doctor.value = element.nombre_doctor
                let pagar_index_cita_reserva_fecha = document.getElementById("pagar_index_cita_reserva_fecha")
                pagar_index_cita_reserva_fecha.value = element.fecha_reserva
                let pagar_index_cita_reserva_hora_inicio = document.getElementById("pagar_index_cita_reserva_hora_inicio")
                pagar_index_cita_reserva_hora_inicio.value = element.hora_inicio
                let pagar_index_cita_reserva_hora_termino = document.getElementById("pagar_index_cita_reserva_hora_termino")
                pagar_index_cita_reserva_hora_termino.value = element.hora_termino
            });
            let modal_pagar_res_index = document.getElementById("modal_pagar_reserva_index")
            // Crea una instancia del modal de Bootstrap
            const modalInstance = new bootstrap.Modal(modal_pagar_res_index);
            // Abre el modal
            modalInstance.show();
        })
        .catch(error => {
            if (error.response) {
                console.log('Error Response:', error.response.data);
                console.log('Error Status:', error.response.status);
                console.log('Error Headers:', error.response.headers);
                // Aquí se manejan los diferentes códigos de error que el backend puede enviar.
                if (error.response.data.error == 0) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "¡Ingrese el código correctamente!",
                    });
                }
                if (error.response.data.error == 1) {
                    Swal.fire({
                        icon: "warning",
                        title: "Oops...",
                        text: "¡El pago de la reserva ya fue realizado!",
                    });
                }
                if (error.response.data.error == 2) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "¡El código de reserva no es válido!",
                    });
                }
                if (error.response.data.error == 3) {
                    Swal.fire({
                        icon: "warning",
                        title: "Oops...",
                        text: "¡El pago de la reserva ya fue realizado!",
                    });
                }
            }
        });
}

//  Pagar Crédito desde el HTML pagar_reserva.html, con confundir con el pago y la reserva del INDEX.
// Este es solamente el pago.
function pagarDebitoReserva(){
    // Llamamos la función creada anteriormente.
    // ocultar_cuotas_disponibles()
    let pagar_index_cita_reserva_nombre = document.getElementById("pagar_index_cita_reserva_nombre").value
    let pagar_index_cita_reserva_email = document.getElementById("pagar_index_cita_reserva_email").value
    let pagar_index_cita_reserva_pagada = document.getElementById("pagar_index_cita_reserva_pagada").value
    let pagar_index_cita_reserva_estado = document.getElementById("pagar_index_cita_reserva_estado").value
    let pagar_index_cita_reserva_rut = document.getElementById("pagar_index_cita_reserva_rut").value
    let pagar_index_cita_reserva_esp = document.getElementById("pagar_index_cita_reserva_esp").value
    let pagar_index_cita_reserva_valor_esp = document.getElementById("pagar_index_cita_reserva_valor_esp").value
    let pagar_index_cita_reserva_nombre_clinica = document.getElementById("pagar_index_cita_reserva_nombre_clinica").value
    let pagar_index_cita_reserva_direccion_clinica = document.getElementById("pagar_index_cita_reserva_direccion_clinica").value
    let pagar_index_cita_reserva_comuna_clinica = document.getElementById("pagar_index_cita_reserva_comuna_clinica").value
    let pagar_index_cita_reserva_nombre_doctor = document.getElementById("pagar_index_cita_reserva_nombre_doctor").value
    let pagar_index_cita_reserva_fecha = document.getElementById("pagar_index_cita_reserva_fecha").value
    let pagar_index_cita_reserva_hora_inicio = document.getElementById("pagar_index_cita_reserva_hora_inicio").value
    let pagar_index_cita_reserva_hora_termino = document.getElementById("pagar_index_cita_reserva_hora_termino").value
    let cod_reserva_pagar = document.getElementById("cod_reserva_pagar").value
    //
    Swal.fire({
        title: "¿Está seguro de pagar la cita?",
        text: "Una vez aceptado el pago, no puede ser cancelado.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Si, Pagar!"
      }).then((result) => {
        if (result.isConfirmed) {
            let datos = {
                'cod_reserva_pagar': cod_reserva_pagar,
            }
            //
            // axios.post(`https://jacruces91.pythonanywhere.com/reserva/pago_debito_reserva_index`, datos,{
            axios.post(`http://127.0.0.1:8000/reserva/pago_debito_solo_reserva`, datos,{
                headers: {
                    //'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(function (response) {
                console.warn(response.data);
                console.warn(response.status)
                let doc = response.data.list_doctor;
                if (response.status == 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Pago Realizado",
                        text: "El pago de la reserva se ha efectuado correctamente!",
                    });
                    // 
                    if (calendar) {
                        calendar.refetchEvents();
                    }
                    // Volvemos a recargar el sitio web.
                    setTimeout(function() {
                        location.reload();
                    }, 2000);
                }
            })
            .catch(error => {
                if (error.response) {
                    console.log('Error Response:', error.response.data);
                    console.log('Error Status:', error.response.status);
                    console.log('Error Headers:', error.response.headers);
                    if (error.response.data.error == 3) {
                        Swal.fire({
                            icon: "error",
                            title: "El grupo ya existe",
                            text: "El grupo fue creado anteriormente!",
                        });
                    }
                    if (error.response.data.error == 3) {
                        Swal.fire({
                            icon: "error",
                            title: "Reserva No Disponible",
                            text: "Debe solicitar otra hora disponible!",
                        });
                    }
                }
            });
        }
    });
}

//
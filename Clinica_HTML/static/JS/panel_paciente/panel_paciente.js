function click_seccion(){
    // Selecciona solo los enlaces dentro del menú
    const menuItems = document.querySelectorAll('.sidebar-menu a'); // 🎯 Ajusta la clase según tu HTML
    //
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); // Evita recargar si es un enlace
            
            //let pru = e.getAttribute("data-name")
            console.log(item)
            // Remueve la clase de TODOS los elementos del menú
            menuItems.forEach(a => {
                a.classList.remove('active-item');
                a.style.background = ""; // Limpia el estilo en línea
            });
            // Aplica solo al elemento clickeado
            this.classList.add('active-item');
            this.style.background = "#A4A4A4";
        });
    });
    
    let panel_paciente_datos = document.getElementById("panel_paciente_datos")
    panel_paciente_datos.addEventListener("click", function(){
        //
        let container_paciente = document.getElementById("container_reserva_panel_pac")
        container_paciente.style.display="none"
        //
        let container_doctor = document.getElementById("container_reserva_panel_pac")
        container_doctor.style.display="none"
        //
        let container_pagar_reserva = document.getElementById("container_pagar_reserva")
        container_pagar_reserva.style.display="none"
        //
        let container_secretaria = document.getElementById("container_datos_personal")
        container_secretaria.style.display="block" 
    })
    //
    let panel_reserva = document.getElementById("panel_reserva")
    panel_reserva.addEventListener("click", function(){
        let panel_doctor = this.getAttribute("data-name")
        //
        let container_paciente = document.getElementById("container_reserva_panel_pac")
        container_paciente.style.display="none"
        //
        let container_pagar_reserva = document.getElementById("container_pagar_reserva")
        container_pagar_reserva.style.display="none"
        //
        let container_doctor = document.getElementById("container_reserva_panel_pac")
        container_doctor.style.display="block"
        //
        let container_secretaria = document.getElementById("container_datos_personal")
        container_secretaria.style.display="none"
    })
    //
    let panel_pagar_reserva = document.getElementById("panel_pagar_reserva")
    panel_pagar_reserva.addEventListener("click", function(){
        let panel_doctor = this.getAttribute("data-name")
        //
        let container_paciente = document.getElementById("container_reserva_panel_pac")
        container_paciente.style.display="none"
        //
        let container_pagar_reserva = document.getElementById("container_pagar_reserva")
        container_pagar_reserva.style.display="block"
        //
        let container_doctor = document.getElementById("container_reserva_panel_pac")
        container_doctor.style.display="none"
        //
        let container_secretaria = document.getElementById("container_datos_personal")
        container_secretaria.style.display="none"
    })
}
click_seccion()
//
function obtener_datos_paciente(){
    //
    const username = sessionStorage.getItem('username');
    //
    const token = sessionStorage.getItem('token');
    //
    let arr = []
    axios.get(`http://127.0.0.1:8000/paciente/listar_datos_paciente/${username}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(function (response) {
        // 
        console.log(typeof(response.data.pacientes))
        let datos = response.data.pacientes
        //
        datos.forEach(element => {
            arr.push(element)
        });
        //
        if ($.fn.DataTable.isDataTable('#tabla_dato_pac_panel_paciente')) {
            $('#tabla_dato_pac_panel_paciente').DataTable().destroy();
            // Limpia la tabla antes de inicializarla nuevamente
            $('#tabla_dato_pac_panel_paciente').empty(); 
        }
        
        var table = $('#tabla_dato_pac_panel_paciente').DataTable({
            data: arr,
            columns: [
                { title: 'ID', data: "id_user", defaultContent: '' },
                { title: 'Username', data: "username", defaultContent: '' },
                { title: 'Primer Nombre', data: "primer_nombre", defaultContent: '' },
                { title: 'Segundo Nombre', data: "segundo_nombre", defaultContent: '' },
                { title: 'Apellido P.', data: "ap_paterno", defaultContent: '' },
                { title: 'Apellido M.', data: "ap_materno", defaultContent: '' },
                { title: 'RUT', data: "rut", defaultContent: '' },
                { title: 'Email', data: "email", defaultContent: '' },
                { title: 'Edad', data: "edad", defaultContent: '' },
                { title: 'Sexo', data: "sexo", defaultContent: '' },
                { title: 'Contacto', data: "contacto", defaultContent: '' },
                { title: 'Región', data: "region", defaultContent: '' },
                { title: 'Comuna', data: "comuna", defaultContent: '' },
                { title: 'Vivienda', data: "vivienda", defaultContent: '' },
                { title: 'N° Vivienda', data: "num_vivienda", defaultContent: '' },
                { 
                    title: 'Acciones', 
                    data: null,
                    responsivePriority: 1, // Prioridad máxima (no se oculta)
                    className: 'no-wrap', // Clase para evitar saltos de línea
                    orderable: false,
                    render: function(data, type, row) {
                        return  '<button type="button" data-id="'+row.id_user+'"  id="btn_editar_dato_pac" onclick="editar_paciente_panel_paciente('+row.id_user+', \''+row.username+'\', \''+row.email+'\', \''+row.primer_nombre+'\', \''+row.segundo_nombre+'\', \''+row.ap_paterno+'\', \''+row.ap_materno+'\',\''+row.edad+'\', \''+row.sexo+'\', \''+row.rut+'\', \''+row.contacto+'\', \''+row.region+'\', \''+row.comuna+'\', \''+row.vivienda+'\', \''+row.num_vivienda+'\')" class="btn btn-warning btn-sm editar-btn">Editar</button> ' +
                                '<button type="button" data-id="'+row.id_user+'" id="btn_historial_pac_adm" onclick="historial_user_paciente('+row.id_user+', \''+row.primer_nombre+'\', \''+row.segundo_nombre+'\', \''+row.ap_paterno+'\', \''+row.ap_materno+'\')" class="btn btn-info btn-sm ">Historial Citas</button> ';
                    }
                },
            ],
            responsive: true,
            destroy: true,
            "dom": 'Bfrtip',
            buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
            "lengthMenu": [
                [5,10, 25, 50, -1],
                ['5 Resultados', '10 Resultados', '50 Resultados', 'Mostrar Todos']
            ],
            "buttons": {
                "pageLength": {
                    _: "Mostrar %d Registros"
                }
            },
            "language": {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Datos",
                "infoEmpty": "Mostrando 0 to 0 of 0 Documentos",
                "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ Documentos",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                    "first": "Primero",
                    "last": "Ultimo",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            }
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
    const inputRut = document.getElementById('edit_paciente_rut');
    //
    inputRut.addEventListener('input', function (e) {
        let valor = e.target.value.replace(/\./g, '').replace(/-/g, '');
        
        // Solo formatear si hay al menos 2 caracteres (cuerpo + dv)
        if (valor.length >= 2) {
            e.target.value = formatearRUT(valor);
        }
    });
});
//
function editar_paciente_panel_paciente(id_user,username,email,primer_nombre,segundo_nombre,ap_paterno,ap_materno,edad,sexo,rut,contacto,region,comuna,vivienda,num_vivienda){
    //
    console.warn(contacto)
    debugger
    let modal_editar_pac_panel_pac = document.getElementById("modal_editar_pac_panel_pac")
    // Crea una instancia del modal de Bootstrap.
    const modalInstance = new bootstrap.Modal(modal_editar_pac_panel_pac);
    // Abre el modal
    modalInstance.show();
    //
    let id_usuario_pac = document.getElementById("id_usuario_pac")
    id_usuario_pac.value = id_user
    let edit_secret_paciente_username = document.getElementById("edit_paciente_username")
    edit_secret_paciente_username.value = username
    let edit_paciente_email = document.getElementById("edit_paciente_email")
    edit_paciente_email.value = email
    let edit_paciente_primer_nombre = document.getElementById("edit_paciente_primer_nombre")
    edit_paciente_primer_nombre.value = primer_nombre
    let edit_paciente_segundo_nombre = document.getElementById("edit_paciente_segundo_nombre")
    edit_paciente_segundo_nombre.value = segundo_nombre
    let edit_ap_paterno = document.getElementById("edit_ap_paterno")
    edit_ap_paterno.value = ap_paterno
    let edit_ap_materno = document.getElementById("edit_ap_materno")
    edit_ap_materno.value = ap_materno
    let edit_paciente_edad = document.getElementById("edit_paciente_edad")
    edit_paciente_edad.value = edad
    // Si empieza con +56, se lo eliminamos y dejamos el resto del fono.
    if (contacto.startsWith("+56")) {
        contacto = contacto.replace("+56", "");
    }
    let edit_paciente_fono = document.getElementById("edit_paciente_fono")
    edit_paciente_fono.value = contacto
    let edit_paciente_rut = document.getElementById("edit_paciente_rut")
    edit_paciente_rut.value = rut
    let edit_paciente_num_vivienda = document.getElementById("edit_paciente_num_vivienda")
    edit_paciente_num_vivienda.value = num_vivienda
    //---------------------- Vivienda --------------------
    let adm_paciente_tipo_vivienda = document.getElementsByName("edit_paciente_tipo_vivienda")
    adm_paciente_tipo_vivienda.forEach(radio => {
        if (radio.value === vivienda) {
            console.log(radio)
                radio.checked = true;
            }
    });
    //---------------------- Fin Vivienda ----------------
    //---------------------- Sexo --------------------
    let edit_sexo = document.getElementsByName("edit_paciente_sexo")
    edit_sexo.forEach(radio => {
        if (radio.value === sexo) {
            console.log(radio)
                radio.checked = true;
            }
    });
    //---------------------- Fin Sexo ----------------
    //------- Valor Radio Button Sexo ---------
    let edit_region = document.getElementById("edit_pac_region")
    // Iterar sobre las opciones del select
    for (let i = 0; i < edit_region.options.length; i++) {
        let option = edit_region.options[i];
        // Verificar si el texto de la opción es "Valparaiso"
        if (option.text === region) {
            // Seleccionar la opción
            option.selected = true;
            break;
        }
    }
    // Llamamos la funcion para que nos cargue las Comunas una vez seleccionada la Región.
    buscar_ciudad_paciente(1)
    // Comuna
    let edit_comuna = document.getElementById("edit_pac_comuna")
    // edit_comuna
    let option_comuna = edit_comuna.querySelector("option")
    option_comuna.innerText = comuna
    option_comuna.value = comuna
    option_comuna.selected = true
}

function edit_panel_pac_paciente(){
    //
    const token = sessionStorage.getItem('token');
    let id_user = document.getElementById("id_usuario_pac").value
    console.warn(id_user)
    let username = document.getElementById("edit_paciente_username").value
    console.warn(username)

    let password = null
    password = document.getElementById("edit_paciente_pass").value
    console.warn(password)
    if (password == '' || password == null) {
        password = '0'
    }
    let adm_paciente_primer_nombre = document.getElementById("edit_paciente_primer_nombre").value
    console.warn(adm_paciente_primer_nombre)
    let adm_paciente_segundo_nombre = document.getElementById("edit_paciente_segundo_nombre").value
    console.warn(adm_paciente_segundo_nombre)
    let adm_paciente_ap_paterno = document.getElementById("edit_ap_paterno").value
    console.warn(adm_paciente_ap_paterno)
    let adm_paciente_ap_materno = document.getElementById("edit_ap_materno").value
    console.warn(adm_paciente_ap_materno)
    let email = document.getElementById("edit_paciente_email").value
    console.warn(email)
    let edad = document.getElementById("edit_paciente_edad").value
    console.warn(edad)
    let fono = document.getElementById("edit_paciente_fono").value
    console.warn(fono)
    let rut = document.getElementById("edit_paciente_rut").value
    console.warn(rut)
    let num_vivienda = document.getElementById("edit_paciente_num_vivienda").value
    console.warn(num_vivienda)
    //------- Valor Radio Button Sexo ---------
    let sexo = document.getElementsByName("edit_paciente_sexo")
    let valor_radio;
    sexo.forEach(radio => {
        if (radio.checked) {
            valor_radio = radio.value;
        }
    });
    console.log(valor_radio)
    //------- Fin Valor Radio Button Sexo ---------
    //------- Valor Radio Button Vivienda---------
    let vivienda = document.getElementsByName("edit_paciente_tipo_vivienda")
    let valor_vivienda;
    vivienda.forEach(radio => {
        if (radio.checked) {
            valor_vivienda = radio.value;
        }
    });
    console.log(valor_vivienda)
    //------- Fin Valor Radio Button Vivienda ---------
    //-------------------- Select dinámico, esta es la manera de recorrer el select y obtener el valorInput Región.
    let id_region = document.getElementById("edit_pac_region").value
    let region = document.getElementById("region_" + id_region).getAttribute("data-region")
    console.log(region)
    //------ Fin Select dinámico, esta es la manera de recorrer el select y obtener el valorInput Comuna.
    let comuna = document.getElementById("edit_pac_comuna").value
    console.log(comuna)
    let arr = []
    //------ Fin Select dinámico, esta es la manera de recorrer el select y obtener el valorInput Comuna.
    //-----  Creamos el array de bjetos. -------------
    let datos = {
        'username': username ,
        'password': password ,
        'primer_nombre': adm_paciente_primer_nombre,
        'segundo_nombre': adm_paciente_segundo_nombre,
        'email': email ,
        'edad': edad ,
        'fono': fono ,
        'rut': rut ,
        'num_vivienda': num_vivienda ,
        'sexo': valor_radio ,
        'vivienda': valor_vivienda ,
        'region': region ,
        'comuna': comuna ,
        'ap_paterno': adm_paciente_ap_paterno,
        'ap_materno': adm_paciente_ap_materno,
    }
    console.log(datos)
    axios.put(`http://127.0.0.1:8000/paciente/update_pac_panel_pac/${id_user}/`,datos, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(function (response) {
        console.warn(response.data);
        console.warn(response.status)
        if (response.status == 200) {
            Swal.fire({
                icon: "success",
                title: "Datos Actualizados Correctamente",
                text: "Actualizado",
            });
            //
            if (response.data.cerrar_session == 1){
                // Eliminar el token del almacenamiento local
                sessionStorage.removeItem('token');
                alert("Debe iniciar Sessión nuevamente")
                window.location.href = 'http://127.0.0.1:5500/index.html'
            }
            //console.warn(response.data.grupos[0])
            let paciente = response.data.paciente
            console.error(paciente)
            arr.push(paciente);
            //
            var table = $('#tabla_dato_pac_panel_paciente').DataTable({
                responsive: true,
                data: arr,
                columns: [
                    { title: 'ID', data: "id_usuario", defaultContent: '' },
                    { title: 'Username', data: "username", defaultContent: '' },
                    { title: 'Email', data: "email", defaultContent: '' },
                    { title: 'Primer Nombre', data: "primer_nombre", defaultContent: '' },
                    { title: 'Segundo Nombre', data: "segundo_nombre", defaultContent: '' },
                    { title: 'Ap Paterno', data: "ap_paterno", defaultContent: '' },
                    { title: 'Ap Materno', data: "ap_materno", defaultContent: '' },
                    { title: 'Edad', data: "edad", defaultContent: '' },
                    { title: 'Sexo', data: "sexo", defaultContent: '' },
                    { title: 'Contacto', data: "contacto", defaultContent: '' },
                    { title: 'Region', data: "region", defaultContent: '' },
                    { title: 'Comuna', data: "comuna", defaultContent: '' },
                    { title: 'Vivienda', data: "vivienda", defaultContent: '' },
                    { title: 'num_vivienda', data: "num_vivienda", defaultContent: '' },
                    { title: 'Cod. Usuario', data: "paciente_uuid", defaultContent: '' },
                    { 
                        title: 'Acciones', 
                        data: null,
                        responsivePriority: 1, // Prioridad máxima (no se oculta)
                        className: 'no-wrap', // Clase para evitar saltos de línea
                        orderable: false,
                        render: function(data, type, row) {
                            return  '<button type="button" data-id="'+row.id_user+'"  id="btn_editar_dato_pac" onclick="editar_paciente_panel_paciente('+row.id_user+', \''+row.username+'\', \''+row.email+'\', \''+row.primer_nombre+'\', \''+row.segundo_nombre+'\', \''+row.ap_paterno+'\', \''+row.ap_materno+'\',\''+row.edad+'\', \''+row.sexo+'\', \''+row.rut+'\', \''+row.contacto+'\', \''+row.region+'\', \''+row.comuna+'\', \''+row.vivienda+'\', \''+row.num_vivienda+'\')" class="btn btn-warning btn-sm editar-btn">Editar</button> ' +
                                    '<button type="button" data-id="'+row.id_user+'" id="btn_historial_pac_adm" onclick="historial_user_paciente_panel_pac('+row.id_user+', \''+row.primer_nombre+'\', \''+row.segundo_nombre+'\', \''+row.ap_paterno+'\', \''+row.ap_materno+'\')" class="btn btn-info btn-sm ">Historial Citas</button> ';
                        }
                    },
                ],
                destroy: true,
                "dom": 'Bfrtip',
                buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
                "lengthMenu": [
                    [5,10, 25, 50, -1],
                    ['5 Resultados', '10 Resultados', '50 Resultados', 'Mostrar Todos']
                ],
                "buttons": {
                    "pageLength": {
                        _: "Mostrar %d Registros"
                    }
                },
                "language": {
                    "decimal": "",
                    "emptyTable": "No hay información",
                    "info": "Mostrando _START_ a _END_ de _TOTAL_ Datos",
                    "infoEmpty": "Mostrando 0 to 0 of 0 Documentos",
                    "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "Mostrar _MENU_ Documentos",
                    "loadingRecords": "Cargando...",
                    "processing": "Procesando...",
                    "search": "Buscar:",
                    "zeroRecords": "Sin resultados encontrados",
                    "paginate": {
                        "first": "Primero",
                        "last": "Ultimo",
                        "next": "Siguiente",
                        "previous": "Anterior"
                    }
                }
            });
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
                    title: "El usuario ya existe",
                    text: "El usuario fue creado anteriormente!",
                });
            }
        }
    });
}
//
function historial_user_paciente(id_usuario, pr_nombre, seg_nombre, ap_paterno, ap_materno){
    //
    let modal_info_hist_pac = document.getElementById("modal_info_hist_pac")
    // Crea una instancia del modal de Bootstrap.
    const modalInstance = new bootstrap.Modal(modal_info_hist_pac);
    // Abre el modal
    modalInstance.show();
    //
    const username = sessionStorage.getItem('username');
    //
    const token = sessionStorage.getItem('token');
    let arr =[]
    //
    axios.get(`http://127.0.0.1:8000/reserva/historial_reserva_pac/${id_usuario}/`,{
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(function (response) {
        // 
        const esp = response.data.reserva;
        //
        esp.forEach(element => {
            // Crear un NUEVO elemento option en cada iteración
            console.log(element)
            arr.push(element)
        });
        console.warn(arr)
        //
        var table = $('#tabla_hist_pac_panel_paciente').DataTable({
            responsive: arr,
            data: arr,
            columns: [
                { title: 'ID', data: "id_reserva", defaultContent: '' },
                { title: 'Especialidad', data: "especialidad", defaultContent: '' },
                { title: 'Nombre Doctor', data: "nombre_doctor", defaultContent: '' },
                { title: 'Nombre Clínica', data: "nombre_clinica", defaultContent: '' },
                { title: 'Comuna Clínica', data: "comuna_clinica", defaultContent: '' },
                { title: 'Dirección Clínica', data: "direccion_clinica", defaultContent: '' },
                { 
                    title: 'Fecha Reserva', 
                    data: "fecha_reserva", 
                    defaultContent: '',
                    render: function (data, type, row) {
                        if (!data) return '';
                    
                        let partes = data.split('-'); // Separar el año, mes y día
                        let dia = partes[2];
                        let mes = partes[1];
                        let anio = partes[0];
                    
                        return `${dia}-${mes}-${anio}`;
                    }
                },
                { title: 'Hora Inicio', data: "hora_inicio", defaultContent: '' },
                { title: 'Hora Término', data: "hora_termino", defaultContent: '' },
                { 
                    title: 'Fecha Creación Reserva', 
                    data: "fecha_creacion_reserva", 
                    defaultContent: '',
                    render: function (data, type, row) {
                        if (!data) return '';
                
                        let fecha = new Date(data); 
                        let dia = ('0' + fecha.getDate()).slice(-2);
                        let mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
                        let anio = fecha.getFullYear().toString().slice(-2); // Obtener solo los últimos dos dígitos del año
                
                        return `${dia}-${mes}-${anio}`;
                    }
                },
                { title: 'Cod. Reserva', data: "reserva_uuid", defaultContent: '' },
                { 
                    title: 'Acciones', 
                    data: null,
                    responsivePriority: 1, // Prioridad máxima (no se oculta)
                    className: 'no-wrap', // Clase para evitar saltos de línea
                    orderable: false,
                    render: function(data, type, row) {
                        return  '<button type="button" data-id="'+row.id_user+'"  id="btn_editar_dato_pac" onclick="diagnostico_reserva('+row.id_usuario+', \''+row.reserva_uuid+'\')" class="btn btn-sm text-white" style="background:rgb(190, 120, 248)">Diagnóstico</button> ';
                    }
                },
            ],
            destroy: true,
            "dom": 'Bfrtip',
            buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
            "lengthMenu": [
                [5,10, 25, 50, -1],
                ['5 Resultados', '10 Resultados', '50 Resultados', 'Mostrar Todos']
            ],
            "buttons": {
                "pageLength": {
                    _: "Mostrar %d Registros"
                }
            },
            "language": {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Datos",
                "infoEmpty": "Mostrando 0 to 0 of 0 Documentos",
                "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ Documentos",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                    "first": "Primero",
                    "last": "Ultimo",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            }
        });
    })
    .catch(error => {
        if (error.response) {
            console.log('Error Response:', error.response.data);
            console.log('Error Status:', error.response.status);
            console.log('Error Headers:', error.response.headers);
             Swal.fire({
                icon: "error",
                title: "No existen reservas",
                text: "No se encontraron reservas.",
            });
        }
    });
}
//
function diagnostico_reserva(id_user, cod_reserva){
    //
    let modal_hist_diagnostico_pac = document.getElementById("modal_hist_diagnostico_pac")
    // Crea una instancia del modal de Bootstrap.
    const modalInstance = new bootstrap.Modal(modal_hist_diagnostico_pac);
    // Abre el modal
    modalInstance.show();
    //
    const username = sessionStorage.getItem('username');
    //
    const token = sessionStorage.getItem('token');
    let arr =[]
    //
    axios.get(`http://127.0.0.1:8000/reserva/diagnostico_historial_pac/${id_user}/${cod_reserva}/`,{
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(function (response) {
        // 
        const esp = response.data.diagnostico;
        console.log(esp)
        if (esp === 0){
            Swal.fire({
                icon: "error",
                title: "No existe Diagnóstico",
                text: "No se encuentra registrado el diagnóstico de la reservas.",
            });
        }
        if (esp != 0){
            esp.forEach(element => {
                // Crear un NUEVO elemento option en cada iteración
                console.log(element)
                arr.push(element)
            });
        }
        //
        console.warn(arr)
        //
        if ($.fn.DataTable.isDataTable('#tabla_diagnostico_pac_panel_paciente')) {
            $('#tabla_diagnostico_pac_panel_paciente').DataTable().destroy();
            $('#tabla_diagnostico_pac_panel_paciente').empty(); // Limpia la tabla antes de inicializarla nuevamente
        }
        //
        var table = $('#tabla_diagnostico_pac_panel_paciente').DataTable({
            data: arr,
            columns: [
                { 
                    title: 'Fecha Historial', 
                    data: "fecha_creacion_historial", 
                    defaultContent: '',
                    render: function (data, type, row) {
                        if (!data) return '';

                        const fecha = new Date(data);
                        const dia = String(fecha.getDate()).padStart(2, '0');
                        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // ¡Los meses comienzan en 0!
                        const anio = fecha.getFullYear();

                        return `${dia}-${mes}-${anio}`;
                    }
                },
                { 
                    title: 'Síntomas', 
                    data: "sintoma", 
                    defaultContent: '',
                    render: function(data, type, row) {
                        return `<textarea class="form-control" readOnly="True" rows="2">${data}</textarea>`;
                    }
                },
                { 
                    title: 'Diagnóstico', 
                    data: "diagnostico", 
                    defaultContent: '',
                    render: function(data, type, row) {
                        return `<textarea class="form-control" readOnly="True" rows="2">${data}</textarea>`;
                    }
                },
                { 
                    title: 'Observación', 
                    data: "observacion", 
                    defaultContent: '',
                    render: function(data, type, row) {
                        return `<textarea class="form-control" readOnly="True" rows="2">${data}</textarea>`;
                    }
                },
            ],
            responsive: true,
            destroy: true,
            "dom": 'Bfrtip',
            buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
            "lengthMenu": [
                [5,10, 25, 50, -1],
                ['5 Resultados', '10 Resultados', '50 Resultados', 'Mostrar Todos']
            ],
            "buttons": {
                "pageLength": {
                    _: "Mostrar %d Registros"
                }
            },
            "language": {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Datos",
                "infoEmpty": "Mostrando 0 to 0 of 0 Documentos",
                "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                "infoPostFix": "",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ Documentos",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                    "first": "Primero",
                    "last": "Ultimo",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            }
        });
    })
    .catch(error => {
        if (error.response) {
            console.log('Error Response:', error.response.data);
            console.log('Error Status:', error.response.status);
            console.log('Error Headers:', error.response.headers);
            Swal.fire({
                icon: "error",
                title: "No existen reservas",
                text: "No se encontraron reservas.",
            });
        }
    });
}
//
function realizar_reserva(){
    //
    const username = sessionStorage.getItem('username');
    //
    const token = sessionStorage.getItem('token');
    //
    let arr = []
    axios.get(`http://127.0.0.1:8000/paciente/res_nombre_paciente/${username}`, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(function (response) {
        // 
        console.log(typeof(response.data.pacientes))
        let nombre_paciente = response.data.paciente
        let id_paciente = response.data.id_user
        //
        let paciente_registrado = document.getElementById("paciente_registrado")
        paciente_registrado.value = nombre_paciente
        paciente_registrado.setAttribute("data-id", id_paciente)
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
function comuna_clinica_paciente_registrado(){
    let select_comuna = document.getElementById("select_adm_com_clin_pac_registrado")
    console.log(select_comuna)
    // // Reiniciar el select de "Doctor" a su estado por defecto
    select_comuna.innerHTML = '<option selected>Clínica</option>';
    // // Evitar múltiples peticiones si ya hay datos
    if (select_comuna.options.length > 1) return;
    // //
    let arr =[]
    const token = sessionStorage.getItem('token');
    axios.get('http://127.0.0.1:8000/clinica/listar_clinica_adm',{
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(function (response) {
        // 
        //console.warn(response.data.grupos[0])
        let list_clinica = response.data.list_clinica
        //
        //
        list_clinica.forEach(element => {
            // Crear un NUEVO elemento option en cada iteración
            const elegir_especialidad = document.createElement("option");
            elegir_especialidad.value = element.id; // Usar ID como valor (mejor práctica)
            elegir_especialidad.textContent = element.nombre_clinica;
            elegir_especialidad.setAttribute("data-comuna", element.comuna_clinica)
            elegir_especialidad.setAttribute("data-direccion", element.direccion_clinica)
            select_comuna.appendChild(elegir_especialidad);
        });
    })
    .catch(error => {
        if (error.response) {
            console.log('Error Response:', error.response.data);
            console.log('Error Status:', error.response.status);
            console.log('Error Headers:', error.response.headers);
            if (error.response.data.error == 1) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No existe el grupo!",
                });
            }
        }
    });
}
// Seleccionar especialidad en el panel de adm con paciente registrado.
function select_esp_adm_panel_pac_registrado(){
    //
    let select_especialidad = document.getElementById("reserva_adm_pac_registrado_especialidad")
    select_especialidad.innerHTML = '<option selected>Seleccionar Especialidad</option>';
    //let index_doctor = document.getElementById("index_doctor");
    // Reiniciar el select de "Doctor" a su estado por defecto
    //index_doctor.innerHTML = '<option selected>Doctor</option>';
    // Evitar múltiples peticiones si ya hay datos
    if (select_especialidad.options.length > 1) return;
    //
    let arr =[]
    //
    const token = sessionStorage.getItem('token');
    //
    axios.get('http://127.0.0.1:8000/paciente/esp_panel_pac_registrado/',{
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(function (response) {
        // 
        const esp = response.data.especialidades;
        //
        esp.forEach(element => {
            // Crear un NUEVO elemento option en cada iteración
            const elegir_especialidad = document.createElement("option");
            elegir_especialidad.value = element.id; // Usar ID como valor (mejor práctica)
            elegir_especialidad.setAttribute("data-esp", element.nombre_especialidad)
            elegir_especialidad.setAttribute("data-id", element.id)
            elegir_especialidad.setAttribute("data-valor", element.valor_especialidad)
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
function valor_select_esp_adm_pac_registrado(){
    //
    const token = sessionStorage.getItem('token');
    //
    let select_adm_com_clin_pac = document.getElementById("select_adm_com_clin_pac_registrado").value
    console.log(select_adm_com_clin_pac)
    let select_especialidad = document.getElementById("reserva_adm_pac_registrado_especialidad").value
    console.log(select_especialidad)
    let select_adm_esp_pac = document.getElementById("select_adm_esp_pac_registrado");
    // // Reiniciar el select de "Doctor" a su estado por defecto
    select_adm_esp_pac.innerHTML = '<option selected>Doctor</option>';
    // // Evitar múltiples peticiones si ya hay datos
    if (select_adm_esp_pac.options.length > 1) return;
    // //
    let arr =[]
    let datos = {
        'id_clinica': select_adm_com_clin_pac,
        'id_especialidad': select_especialidad,
    }
    console.warn(datos)
    //
    axios.get(`http://127.0.0.1:8000/doctor/esp_doc_list_reserva_panel_adm`, {
        params: {
            id_clinica: select_adm_com_clin_pac,
            id_especialidad: select_especialidad
        },
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(function (response) {
        // 
        const esp = response.data.doctores;
        //
        esp.forEach(element => {
            console.log(element)
            // Crear un NUEVO elemento option en cada iteración
            const elegir_especialidad = document.createElement("option");
            elegir_especialidad.value = element.id_doc_user; // Usar ID como valor (mejor práctica)
            elegir_especialidad.textContent = element.primer_nombre + ' ' + element.segundo_nombre + ' ' + element.ap_paterno+ ' ' + element.ap_materno;
            select_adm_esp_pac.appendChild(elegir_especialidad);
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
// Botón para generar la reserva de un paciente REGISTRADO.
function reserva_calendar_pac_registrado(){
    //
    let select_adm_com_clin_pac = document.getElementById("select_adm_com_clin_pac_registrado").value
    console.log(select_adm_com_clin_pac)
    let select_especialidad = document.getElementById("reserva_adm_pac_registrado_especialidad").value
    // Valor de la especialidad.
    let select = document.getElementById("reserva_adm_pac_registrado_especialidad");
    let selectedOption = select.options[select.selectedIndex];
    let valor_especialidad = selectedOption.getAttribute("data-valor");
    console.log(valor_especialidad);
    let select_adm_esp_pac = document.getElementById("select_adm_esp_pac_registrado").value;
    console.log(select_adm_esp_pac)
    let id_usuario = document.getElementById("paciente_registrado")
    let id_user = id_usuario.getAttribute("data-id")
    console.warn(id_user)
    console.log(id_usuario)
    if (select_adm_com_clin_pac == 0 || select_especialidad == 0 || select_adm_esp_pac == 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Faltan seleccionar campos",
        });
    }else{
        //
        let datos = {
            'id_clinica': select_adm_com_clin_pac,
            'id_especialidad': select_especialidad,
            'id_usuario_doctor': select_adm_esp_pac,
            'id_usuario': id_user
        }
        console.log(datos)
        // Full Callendar.
        let request_calendar = `http://127.0.0.1:8000/paciente/reserva_paciente_panel_paciente`
        //let request_calendar = '../../JS/events.json'
        var calendarEl = document.getElementById('calendar_pac_registrado');
        calendar = new FullCalendar.Calendar(calendarEl, {
            // Agregamos el idioma Español.
            locale: 'es',
            //initialView: 'dayGridMonth',
            initialView: 'timeGridWeek', // Vista inicial con horas
            slotDuration: '01:00:00', // Duración de los intervalos (30 minutos)
            slotMinTime: '08:00:00', // Mostrar desde las 8:00 AM
            slotMaxTime: '23:00:00', // Mostrar hasta las 8:00 PM
            // validRange: {
            //     start: new Date().toLocaleDateString('en-CA') // Formato YYYY-MM-DD en la zona horaria local
            // },
            navLinks: true, // can click day/week names to navigate views
            editable: true,
            weekends: true,
            // Agregamos los eventos.
            events: function(info, successCallback, failureCallback){
                fetch(request_calendar, {
                    method: 'POST', // Cambiamos el método a POST
                    headers: {
                        'Content-Type': 'application/json', // Indicamos que estamos enviando JSON
                    },
                    body: JSON.stringify(datos) // Convertimos el objeto "datos" a una cadena JSON y lo enviamos en el cuerpo
                })
                .then(function(response) {
                    if (!response.ok) {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Faltan seleccionar campos",
                        });
                        throw new Error('Error en la respuesta del servidor');
                    }
                    return response.json(); // Procesa la respuesta como JSON
                })
                .then(function(data){
                    console.warn(data.pacientes)
                    //console.warn(data.pacientes[0]["title"]); // Aquí ves la data que llega desde el backend
                    // Transforma los datos recibidos en el formato esperado por FullCalendar
                    let events = data.pacientes.map(paciente => ({
                        title: `${paciente.title}`,
                        start: `${paciente.start}`, // Fecha y hora de inicio
                        end: `${paciente.end}`, // Fecha y hora de fin
                    }));
                    console.log(events)
                    successCallback(events)
                })
                .catch(function(error){
                    failureCallback(error)
                })
            },
            // Hacer click en un evento.
            eventClick: function(clickInfo) {
                clickInfo.jsEvent.preventDefault();
                // Extraemos la información del evento al hacer clic
                let eventTitle = clickInfo.event.title;
                let eventStart = clickInfo.event.start.toLocaleString('es-CL');
                let eventEnd = clickInfo.event.end.toLocaleString('es-CL');
                //
                //moda_mostrar_informacion_cita_calendar(eventTitle, paciente_nombre, eventStart, eventEnd, eventUuid)
            },
            // Escuchador de eventos para clic en una hora
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
                    abrir_modal_nueva_cita_pa_registrado(fechaFormateada)
                }
            },
            // Traemos todos los eventos disponibles.
            eventContent: function(info) {
                return {
                    html: `
                        <div>
                            <strong>${info.event.title}</strong>
                            <div>${info.event.start.toLocaleTimeString()} - ${info.event.end.toLocaleTimeString()}</div>
                            <div>${info.event.end.toLocaleTimeString()} - ${info.event.end.toLocaleTimeString()}</div>
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
                newEl.innerHTML = `
                    <div
                        class="fc-hoverable-event"
                        style="position: absolute; bottom: 100%; left: 0; width: 300px; height: auto;
                        background-color: white; z-index: 50; border: 1px solid #e2e8f0; border-radius: 0.375rem;
                        padding: 0.75rem; font-size: 14px; font-family: 'Inter', sans-serif; cursor: pointer;"
                        >
                        <strong>${newElTitle}</strong>
                        <div>${newElLocation}</div>
                    </div>
                `
                el.after(newEl)
            },
            // Método para ocultar la info una vez pasado el mouse.
            eventMouseLeave: function(mouseLeaveInfo){
                // Nosmuestra las clases que tenemos.
                console.warn(mouseLeaveInfo)
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
        calendar.render();
    }
}
// Crear elementos Alert para mostrar la info de la cita creada a un paciente registrado.
function abrir_modal_nueva_cita_pa_registrado(fechaFormateada){
    let modal_crear_cita_pac_resgistrado_panel_adm = document.getElementById("modal_crear_cita_pac_resgistrado_panel_adm")
    // Crea una instancia del modal de Bootstrap.
    const modalInstance = new bootstrap.Modal(modal_crear_cita_pac_resgistrado_panel_adm);
    // Abre el modal
    modalInstance.show();
    let select_adm_com_clin_pac_registrado = document.getElementById("select_adm_com_clin_pac_registrado").value
    let select_adm_com_clin_pac_registrado_get = document.getElementById("select_adm_com_clin_pac_registrado")
    // Valor de la especialidad.
    let select = document.getElementById("reserva_adm_pac_registrado_especialidad");
    // let selectedOption = select.options[select.selectedIndex];
    // let valor_especialidad = selectedOption.getAttribute("data-valor");
    // console.log(valor_especialidad);
    let data_comuna = null; // Variable para almacenar el valor del atributo data.
    let direccion_clinica = null; // Variable para almacenar el valor del atributo data.
    let nombre_clinica = null; // Variable para almacenar el valor del atributo data.
    let id_especialidad = null;
    let especialidad = null;
    let id_user_doctor = null;
    let nombre_doctor = null;
    let valor_especialidad = null;
    //
    Array.from(select_adm_com_clin_pac_registrado_get.options).forEach(option => {
        if (option.value === select_adm_com_clin_pac_registrado) {
            // Obtén el valor del atributo data-info
            data_comuna = option.getAttribute("data-comuna");
            // Dirección Clínica.
            direccion_clinica = option.getAttribute("data-direccion");
            //
            nombre_clinica = option.innerText;
        }
    });
    // Escucha el evento de cambio (opcional, si necesito que se detecte al seleccionar una opción)
    let reserva_adm_pac_registrado_especialidad = document.getElementById("reserva_adm_pac_registrado_especialidad").value
    // Escucha el evento de cambio (opcional, si necesitas que se detecte al seleccionar una opción)
    let opcion_reserva_adm_pac_registrado_especialidad = document.getElementById("reserva_adm_pac_registrado_especialidad")
    Array.from(opcion_reserva_adm_pac_registrado_especialidad.options).forEach(option => {
        if (option.value === reserva_adm_pac_registrado_especialidad) {
            // Obtén el valor del atributo data-info
            id_especialidad = option.getAttribute("data-id");
            // Dirección Clínica.
            especialidad = option.getAttribute("data-esp");
            //
            valor_especialidad = option.getAttribute("data-valor");
        }
    });
    //
    let select_adm_esp_pac_registrado = document.getElementById("select_adm_esp_pac_registrado").value
    let option_select_adm_esp_pac_registrado = document.getElementById("select_adm_esp_pac_registrado")
    Array.from(option_select_adm_esp_pac_registrado.options).forEach(option => {
        if (option.value === select_adm_esp_pac_registrado) {
            // Dirección Clínica.
            nombre_doctor = option.innerText;
        }
    });
    //
    let alert_info = document.getElementById("info_nueva_reserva_pac_reistrado")
    // Limpia los elementos previos
    while (alert_info.firstChild) {
        alert_info.removeChild(alert_info.firstChild);
    }
    // Crear un nuevo elemento (por ejemplo, un div)
    let usuario = document.getElementById("paciente_registrado")
    let fk_usuario = usuario.getAttribute("data-id")
    let solo_paciente = document.getElementById("paciente_registrado").value
    // Obtén el innerText del option seleccionado
    //let selectedText = solo_paciente.innerText;
    
    let div_nombre_paciente = document.createElement("div");
    div_nombre_paciente.id = "div_usuario"
    div_nombre_paciente.classList = "alert alert-success"
    div_nombre_paciente.setAttribute("role", "alert"); // este también hay que setearlo correctamente
    div_nombre_paciente.setAttribute("data-id", fk_usuario);
    div_nombre_paciente.innerText = "Nombre Paciente: " + solo_paciente
    alert_info.appendChild(div_nombre_paciente);
    // Crear un nuevo elemento (por ejemplo, un div)
    let div_alert_nombre_clinica = document.createElement("div");
    div_alert_nombre_clinica.classList = "alert alert-primary"
    div_alert_nombre_clinica.role = "alert"
    div_alert_nombre_clinica.innerText = "Nombre Clínica: " + nombre_clinica
    alert_info.appendChild(div_alert_nombre_clinica);
    // Crear un nuevo elemento (por ejemplo, un div)
    let div_alert_comuna_clinica = document.createElement("div");
    div_alert_comuna_clinica.classList = "alert alert-primary"
    div_alert_comuna_clinica.role = "alert"
    div_alert_comuna_clinica.innerText = "Comuna Clínica: " + data_comuna
    alert_info.appendChild(div_alert_comuna_clinica);
    // Info Dirección Clínica.
    let div_alert_direccion_clinica = document.createElement("div");
    div_alert_direccion_clinica.classList = "alert alert-primary"
    div_alert_direccion_clinica.role = "alert"
    div_alert_direccion_clinica.innerText = "Dirección Clínica: " + direccion_clinica
    alert_info.appendChild(div_alert_direccion_clinica);
    // Info Especialidad.
    let div_alert_especialidad = document.createElement("div");
    div_alert_especialidad.classList = "alert alert-primary"
    div_alert_especialidad.role = "alert"
    div_alert_especialidad.innerText = "Especialidad: " + especialidad
    alert_info.appendChild(div_alert_especialidad);
    // Info Doctor.
    let div_alert_doctor = document.createElement("div");
    div_alert_doctor.classList = "alert alert-primary"
    div_alert_doctor.role = "alert"
    div_alert_doctor.innerText = "Nombre Doctor: " + nombre_doctor
    alert_info.appendChild(div_alert_doctor);
    // Info Fecha Reserva..
    console.log(fechaFormateada)
    let fecha = new Date(fechaFormateada);
    // Extraemos cada parte y la formateamos
    let dia = String(fecha.getDate()).padStart(2, '0');
    let mes = String(fecha.getMonth() + 1).padStart(2, '0'); // ¡Ojo! los meses van de 0 a 11
    let anio = String(fecha.getFullYear()).slice(-4); // Solo los dos últimos dígitos
    let hora = String(fecha.getHours()).padStart(1, '0');
    let minutos = String(fecha.getMinutes()).padStart(2, '0');
    let nueva_fechaFormateada = `${dia}-${mes}-${anio}. Hora Cita: ${hora}:${minutos} hrs.`;
    //
    let div_alert_fecha_reserva = document.createElement("div");
    div_alert_fecha_reserva.classList = "alert alert-primary"
    div_alert_fecha_reserva.role = "alert"
    div_alert_fecha_reserva.innerText = "Fecha Cita: " + nueva_fechaFormateada
    alert_info.appendChild(div_alert_fecha_reserva);
    // Div para mostrar el valor de la especialidad.
    let div_valor_reserva = document.createElement("div");
    div_valor_reserva.classList = "alert alert-primary"
    div_valor_reserva.id = "valor_esp"
    div_valor_reserva.setAttribute("role", "alert"); // este también hay que setearlo correctamente
    div_valor_reserva.setAttribute("data-valoresp", valor_especialidad);
    div_valor_reserva.innerText = "Valor Cita: $" + valor_especialidad
    alert_info.appendChild(div_valor_reserva);
    
    // Pasamos los atributos data al boton de enviar la cita al Backend.
    let btn_crear_cita_pac_registrado_panel_paciente = document.getElementById("btn_crear_cita_pac_registrado_panel_paciente")
    btn_crear_cita_pac_registrado_panel_paciente.setAttribute("data-fk_usuario", fk_usuario)
    btn_crear_cita_pac_registrado_panel_paciente.setAttribute("data-nombre_clinica", nombre_clinica)
    btn_crear_cita_pac_registrado_panel_paciente.setAttribute("data-comuna", data_comuna)
    btn_crear_cita_pac_registrado_panel_paciente.setAttribute("data-direccion_clinica", direccion_clinica)
    btn_crear_cita_pac_registrado_panel_paciente.setAttribute("data-especialidad", especialidad)
    btn_crear_cita_pac_registrado_panel_paciente.setAttribute("data-nombre_doctor", nombre_doctor)
    btn_crear_cita_pac_registrado_panel_paciente.setAttribute("data-fechaFormateada", fechaFormateada)
    btn_crear_cita_pac_registrado_panel_paciente.setAttribute("data-valor_especialidad", valor_especialidad)
    btn_crear_cita_pac_registrado_panel_paciente.setAttribute("data-hora_cita", `${hora}:${minutos}`)
    //
    //nueva_cita_pac_registrado(fk_usuario, nombre_clinica ,data_comuna ,direccion_clinica, especialidad, nombre_doctor ,fechaFormateada, valor_especialidad)
}
// Aplicar descuento
function validar_cup_pac(){
    const token = sessionStorage.getItem('token');
    let div_user = document.getElementById("div_usuario")
    let fk_usuario = div_user.getAttribute("data-id")
    // Cod Descuento.
    let codigo = document.getElementById("descuento").value
    let valor_esp = document.getElementById("valor_esp")
    let valor_especialidad = valor_esp.getAttribute("data-valoresp")
    //
    let datos = {
        'fk_usuario': fk_usuario,
        'codigo': codigo,
        'valor_especialidad': valor_especialidad,
    }
    //
    axios.post(`http://127.0.0.1:8000/descuento/descuento_pac`, datos, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(function (response) {
        // 
        if (response.status = 200) {
            console.log(response.data.descuento)
            let valor_desc = response.data.descuento
            let descuento_valor = valor_especialidad * valor_desc / 100;
            let nuevo_valor_pagar = valor_especialidad - descuento_valor
            console.warn(nuevo_valor_pagar)
            // Antea de crear el div, debemos limpiar.
            let nuevo_valor = document.getElementById("nuevo_valor")
            nuevo_valor.innerHTML = "";
            let nuevo_alert_pagar = document.createElement("div");
            nuevo_alert_pagar.id = "valor_descuento_aplicado"
            nuevo_alert_pagar.setAttribute("data-valortotal", nuevo_valor_pagar)
            nuevo_alert_pagar.className = "alert alert-success alert-dismissible fade show";
            nuevo_alert_pagar.role = "alert";
            nuevo_alert_pagar.innerHTML = "El nuevo valor a pagar con descuento aplicado es: $"+ nuevo_valor_pagar;
            nuevo_valor.appendChild(nuevo_alert_pagar);
            // Aplicamos uns cambios para que no se vuelva a ingresar el código de nuevo.
            let input_codigo = document.getElementById("descuento")
            input_codigo.readOnly = true
            let buton_codigo = document.getElementById("validar_cupon")
            buton_codigo.innerText = "Aplicado"
            buton_codigo.style.color = "red"
            buton_codigo.style.background = "blue"
            buton_codigo.disabled = true
            let div_nuevo_valor = document.getElementById("nuevo_valor")
            div_nuevo_valor.style.display = "block";
        }
    })
    .catch(error => {
        if (error.response) {
            console.log('Error Response:', error.response.data);
            console.log('Error Status:', error.response.status);
            console.log('Error Headers:', error.response.headers);
            //
            if (error.response.data.error === 1){
                Swal.fire({
                    title: "Error",
                    text: "Debe ingresar un código válido.",
                    icon: "error"
                });
            }
            //
            if (error.response.data.descuento === 2){
                Swal.fire({
                    title: "Error",
                    text: "Código de descuento no valido.",
                    icon: "error"
                });
            }
            //
            if (error.response.data.descuento === 3){
                Swal.fire({
                    title: "Error",
                    text: "Debe ingresar un código válido.",
                    icon: "error"
                });
            }
            //
            if (error.response.data.error === 4){
                Swal.fire({
                    title: "Error",
                    text: "Código Expirado.",
                    icon: "error"
                });
            }
        }
    });
}
//
function cerrar_modal(){
    // Aplicamos uns cambios para que no se vuelva a ingresar el código de nuevo.
    let input_codigo = document.getElementById("descuento")
    input_codigo.value = "";
    input_codigo.readOnly = false
    let buton_codigo = document.getElementById("validar_cupon")
    buton_codigo.innerText = "Validar"
    buton_codigo.style.background = "rgb(182, 236, 159)"
    buton_codigo.style.color = "black"
    buton_codigo.disabled = false
    let div_nuevo_valor = document.getElementById("nuevo_valor")
    div_nuevo_valor.style.display = "none";
    //
    let num_cuotas = document.getElementById("num_cuotas")
    num_cuotas.style.display = "none"
    // Desactivar los Checked del Radio Button.
    let met = document.querySelectorAll('input[name="metodo"]')
    met.forEach(function(radio) {
        radio.checked = false;
    });
    // Desactivar los Checked del Radio Button.
    let cuota = document.querySelectorAll('input[name="cuota"]')
    cuota.forEach(function(radio) {
        radio.checked = false;
    });
}
// Mostrar las cuotas disponibles.
function debito_credito(){
    //
    document.querySelectorAll('input[name="metodo"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            // Si es Débito, ocultamos las Cuotas.
            if(this.value === "0"){
                let num_cuotas = document.getElementById("num_cuotas")
                num_cuotas.style.display = "none"
            }
            // Si es Crédito, mostramos las Cuotas.
            if(this.value === "1"){
                let num_cuotas = document.getElementById("num_cuotas")
                num_cuotas.style.display = "block"
            }
        });
    });
}
//
debito_credito()
// Enviar información sobre la nueva cita al paciente registrado.
function crearCita(){
    const token = sessionStorage.getItem('token');
    //
    let descuento = document.getElementById("descuento").value
    let cod = ""
    if (descuento.trim() !== "") {
        cod = descuento
    } else {
        cod = "0"
    }
    // Obtenemos el metodo de pago.
    let metodoSeleccionado = document.querySelector('input[name="metodo"]:checked');
    //
    let tipo_pago = "";
    if (metodoSeleccionado) {
        tipo_pago = metodoSeleccionado.value;
        console.log(tipo_pago)
    }
    // Obtenemos las cuotas
    let cuotaSeleccionada = document.querySelector('input[name="cuota"]:checked');
    //
    let cuota_pago = "";
    if (cuotaSeleccionada) {
        cuota_pago = cuotaSeleccionada.value;
        console.log(cuota_pago)
    }
    let btn_crear_cita_pac_registrado_panel_paciente = document.getElementById("btn_crear_cita_pac_registrado_panel_paciente")
    let fk_usuario = btn_crear_cita_pac_registrado_panel_paciente.getAttribute("data-fk_usuario")
    let nombre_clinica = btn_crear_cita_pac_registrado_panel_paciente.getAttribute("data-nombre_clinica")
    let data_comuna = btn_crear_cita_pac_registrado_panel_paciente.getAttribute("data-comuna")
    let direccion_clinica = btn_crear_cita_pac_registrado_panel_paciente.getAttribute("data-direccion_clinica")
    let especialidad = btn_crear_cita_pac_registrado_panel_paciente.getAttribute("data-especialidad")
    let nombre_doctor = btn_crear_cita_pac_registrado_panel_paciente.getAttribute("data-nombre_doctor")
    let fechaFormateadas = btn_crear_cita_pac_registrado_panel_paciente.getAttribute("data-fechaFormateada")
    const fechaInicial = "T-03:00";
    // // Crear un objeto de fecha.
    const fechaBase = new Date(fechaFormateadas);
    // // Ajustar la hora de acuerdo al huso horario local
    let opcionesFecha = { timeZone: "America/Santiago", hour12: false };
    // //const fechaFormateada = fechaBase.toLocaleDateString("es-CL", opcionesFecha);
    const horaFormateada = fechaBase.toLocaleTimeString("es-CL", opcionesFecha);
    // // Sumar una hora adicional (si es necesario)
    fechaBase.setHours(fechaBase.getHours() + 1);
    const horaConUnaHoraMas = fechaBase.toLocaleTimeString("es-CL", opcionesFecha);
    let = btn_crear_cita_pac_registrado_panel_paciente.getAttribute("data-valor_especialidad")
    let = btn_crear_cita_pac_registrado_panel_paciente.getAttribute("data-valor_especialidad")
    // Creamos el array de objetos.
    let datos = {
        'fecha_reserva': fechaFormateadas,
        'especialidad': especialidad,
        'nombre_doctor': nombre_doctor,
        'comuna_clinica': data_comuna,
        'fk_usuario': fk_usuario,
        'direccion_clinica': direccion_clinica,
        'nombre_clinica': nombre_clinica,
        'hora_inicio': horaFormateada,
        'hora_termino': horaConUnaHoraMas,
        'cod': cod,
        'tipo_pago': tipo_pago,
        'cuotas': cuota_pago,
        'pago_realizado': 1,
    }
    console.warn(datos)
    //
    axios.post(`http://127.0.0.1:8000/paciente/crear_reserva_panel_pac`, datos, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(function (response) {
        // 
        if (response.status = 200) {
            console.log(response.data.pacientes)
            response.data.pacientes.forEach(element => {
                if (calendar) {
                    calendar.addEvent({
                        title: element.especialidad,
                        start: element.hora_inicio,
                        end: element.hora_termino,
                        // extendedProps: {
                        //     nombre_paciente: nombre_clinica
                        // }
                    });
                }
                calendar.refetchEvents();
            });
            //
            Swal.fire({
                title: "Cita Registrada Correctamente",
                text: "Cita Generada",
                icon: "success"
            });
        }
    })
    .catch(error => {
        if (error.response) {
            console.log('Error Response:', error.response.data);
            console.log('Error Status:', error.response.status);
            console.log('Error Headers:', error.response.headers);
            if (error.response.status == 400){
                Swal.fire({
                    title: "Error",
                    text: "El usuario ya tiene una cita con esa especialidad",
                    icon: "error"
                });
            }
            if (error.response.data.error == 2){
                Swal.fire({
                    title: "Error",
                    text: "Falta seleccionar la cantidad de cuotas.",
                    icon: "error"
                });
            }
        }
    });
}
//
function enviar_cod_verificacion(){
    // Llamamos al elemento al cual vamosa unir el div.
    let div_padre = document.getElementById("dato_reserva_pagar")
    // Limpiamos los DIV que creamos hijo que creamos abajo.
    const hijos_div = Array.from(div_padre.children);
    hijos_div.forEach(child => {
        if (child.id !== "cod_desc_res") {
            div_padre.removeChild(child);
        }
    });
    const token = sessionStorage.getItem('token');
    //
    let cod_reserva = document.getElementById("cod_reserva").value
    //
    let datos = {
        'reserva_uuid': cod_reserva,
    }
    console.warn(datos)
    axios.post('http://127.0.0.1:8000/reserva/cod_reserva_verificacion',datos,{
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(function (response) {
        console.log(response.data)
        let datos = response.data.datos;
        //
        console.log(response.status)
        let success;
        let text;
        datos.forEach(element => {
            //
            let id_usuario_pac = document.createElement("div")
            id_usuario_pac.innerText = "ID Usuario: " + element.fk_user;
            id_usuario_pac.id = "id_usuario"
            id_usuario_pac.setAttribute("data-fk_user", element.fk_user)
            div_padre.appendChild(id_usuario_pac)
            //
            let mostrar_nombre_doctor = document.createElement("div")
            mostrar_nombre_doctor.innerText = "Nombre Doctor/a: " + element.nombre_doctor;
            mostrar_nombre_doctor.setAttribute("data-nombre_doctor", element.nombre_doctor)
            div_padre.appendChild(mostrar_nombre_doctor)
            //
            let fecha_original = element.fecha_reserva; // "2025-07-10"
            let partes = fecha_original.split("-");     // ["2025", "07", "10"]
            let fecha_formateada = `${partes[2]}-${partes[1]}-${partes[0]}`;
            //
            let fecha_reserva = document.createElement("div")
            fecha_reserva.innerText = "Día de la reserva: " + fecha_formateada;
            fecha_reserva.setAttribute("data-fecha_reserva", element.fecha_reserva)
            div_padre.appendChild(fecha_reserva)
            //
            let hora_inicio = document.createElement("div")
            hora_inicio.innerText = "Hora Inicio: " + element.hora_inicio;
            hora_inicio.setAttribute("data-hora_inicio", element.hora_inicio)
            div_padre.appendChild(hora_inicio)
            //
            let hora_termino = document.createElement("div")
            hora_termino.innerText = "Hora Término: " + element.hora_termino;
            hora_termino.setAttribute("data-hora_termino", element.hora_termino)
            div_padre.appendChild(hora_termino)
            //
            let especialidad = document.createElement("div")
            especialidad.innerText = "Especialidad: " + element.especialidad;
            especialidad.setAttribute("data-especialidad", element.especialidad)
            div_padre.appendChild(especialidad)
            //
            let reserva_uuid = document.createElement("div")
            reserva_uuid.innerText = "Cod. Reserva: " + element.cod_reserva;
            reserva_uuid.setAttribute("data-reserva_uuid", element.cod_reserva)
            div_padre.appendChild(reserva_uuid)
            //
            let nombre_clinica = document.createElement("div")
            nombre_clinica.innerText = "Nombre Clínica: " + element.nombre_clinica;
            nombre_clinica.setAttribute("data-nombre_clinica", element.nombre_clinica)
            div_padre.appendChild(nombre_clinica)
            //
            let comuna_clinica = document.createElement("div")
            comuna_clinica.innerText = "Comuna Clínica: " + element.comuna_clinica;
            comuna_clinica.setAttribute("data-comuna_clinica", element.comuna_clinica)
            div_padre.appendChild(comuna_clinica)
            //
            let direccion_clinica = document.createElement("div")
            direccion_clinica.innerText = "Dirección Clínica: " + element.direccion_clinica;
            direccion_clinica.setAttribute("data-direccion_clinica", element.direccion_clinica)
            div_padre.appendChild(direccion_clinica)
            //
            let nombre_paciente = document.createElement("div")
            nombre_paciente.innerText = "Nombre Paciente: " + element.nombre_paciente;
            nombre_paciente.setAttribute("data-nombre_paciente", element.nombre_paciente)
            div_padre.appendChild(nombre_paciente)
            //
            let rut_paciente = document.createElement("div")
            rut_paciente.innerText = "RUT Paciente: " + element.rut_paciente;
            rut_paciente.setAttribute("data-rut_paciente", element.rut_paciente)
            div_padre.appendChild(rut_paciente)
            //
            let valor_especialidad = document.createElement("div") 
            valor_especialidad.innerHTML =  `
                <p>Valor Especialidad: <span class="badge text-bg-info" id="span_especialidad" data-valor_especialidad="${element.valor_especialidad}">$${element.valor_especialidad}</span></p>
            `;
            div_padre.appendChild(valor_especialidad)
            // Pago realizado
            if (element.pago_realizado == 0){
                success = "danger"
                text = "No"
            }
            //
            if (element.pago_realizado == 1){
                success = "success"
                text = "Si"
            }
            //
            let pago_realizado = document.createElement("div") 
            pago_realizado.innerHTML =  `
                <p>Pago Realizado: <span class="badge text-bg-${success}" data-pago_realizado="${element.pago_realizado}">${text}</span></p>
            `;
            div_padre.appendChild(pago_realizado)
            //
            let input_cod = document.getElementById("cod_desc_res")
            input_cod.style.display = "block"
            input_cod.style.width = "50%"
            input_cod.className = "form-control mb-2"
            div_padre.appendChild(input_cod)
            // Crear el botón de pago.
            let boton_pago_debito = document.createElement("button");
            boton_pago_debito.setAttribute("data-cod_reserva", element.cod_reserva);
            boton_pago_debito.className = "btn btn-success mr-2";
            boton_pago_debito.innerText = "Pago Débito"
            boton_pago_debito.type = "button";
            boton_pago_debito.onclick = function() {
            let codigo = boton_pago_debito.getAttribute("data-cod_reserva");
                pago_debito_reserva_realizada(codigo)
            };
            div_padre.appendChild(boton_pago_debito)
            // Creación de cuotas de forma dinámica.
            let creacion_cuotas;
            // Crear el botón de pago.
            let boton_pago_credito = document.createElement("button");
            boton_pago_credito.setAttribute("data-cod_reserva", element.cod_reserva);
            boton_pago_credito.className = "btn btn-info ml-2";
            boton_pago_credito.innerText = "Pago Crédito"
            boton_pago_credito.type = "button";
            boton_pago_credito.onclick = function() {
            let codigo = boton_pago_credito.getAttribute("data-cod_reserva");
                let btn_cuota = document.getElementById("btn_cuota")
                btn_cuota.value = codigo
                let modal_cant_cuotas = document.getElementById("modal_cant_cuotas")
                // Crea una instancia del modal de Bootstrap.
                const modalInstance = new bootstrap.Modal(modal_cant_cuotas);
                // Abre el modal
                modalInstance.show();
            };
            //
            div_padre.appendChild(boton_pago_credito)
        });
    })
    .catch(error => {
        if (error.response) {
            console.log('Error Response:', error.response.data);
            console.log('Error Status:', error.response.status);
            console.log('Error Headers:', error.response.headers);
            if (error.response.data.error == 1) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No existe la reserva o el pago fué realizado!",
                });
                let cod_desc_res = document.getElementById("cod_desc_res")
                cod_desc_res.style.display = "none"
            }
            if (error.response.data.error == 2) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No existe la reserva!",
                });
                let cod_desc_res = document.getElementById("cod_desc_res")
                cod_desc_res.style.display = "none"
            }
        }
    });
}
function cerrar_modal_cant_cuota(){
    // 
    limpiarSeleccionCuotas()
}
//
function veri_cod_des(){
    const token = sessionStorage.getItem('token');
    let valor_esp = document.getElementById("span_especialidad")
    let valor_especialidad = valor_esp.getAttribute("data-valor_especialidad")
    // Cod Descuento.
    let codigo = document.getElementById("valor_cod_desc").value
    //
    let fk_usuarios = document.getElementById("id_usuario")
    
    let fk_usuario = fk_usuarios.getAttribute("data-fk_user")
    //
    let datos = {
        'fk_usuario': fk_usuario,
        'codigo': codigo,
        'valor_especialidad': valor_especialidad,
    }
    //
    console.log(datos)
    //
    axios.post(`http://127.0.0.1:8000/descuento/veri_cod_des`, datos, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(function (response) {
        // 
        if (response.status = 200) {
            console.log(response.data.descuento)
            let valor_desc = response.data.descuento
            // Descuento dinámico.
            let porcentaje = valor_desc / 100
            let descuento_valor = valor_especialidad * porcentaje;
            let nuevo_valor_pagar = valor_especialidad - descuento_valor
            console.warn(nuevo_valor_pagar)
            // // Antea de crear el div, debemos limpiar.
            let nuevo_valor = document.getElementById("cod_desc_res")
            // nuevo_valor.innerHTML = "";
            let div_existente = document.getElementById("valor_descuento_aplicado");
            // Verificar si ya existe el div antes de crearlo
            if (!div_existente) {
                let nuevo_alert_pagar = document.createElement("div");
                nuevo_alert_pagar.id = "valor_descuento_aplicado";
                nuevo_alert_pagar.setAttribute("data-valortotal", nuevo_valor_pagar);
                nuevo_alert_pagar.className = "alert alert-success alert-dismissible fade show mt-1";
                nuevo_alert_pagar.role = "alert";
                nuevo_alert_pagar.innerHTML = "El nuevo valor a pagar es: $" + nuevo_valor_pagar;
                nuevo_valor.appendChild(nuevo_alert_pagar);
                // Aplicamos uns cambios para que no se vuelva a ingresar el código de nuevo.
                let input_codigo = document.getElementById("valor_cod_desc")
                input_codigo.readOnly = true
                let buton_codigo = document.getElementById("btn_verificar_cod_res_no_pagada")
                buton_codigo.innerText = "Aplicado"
                buton_codigo.style.color = "red"
                buton_codigo.style.background = "blue"
                buton_codigo.disabled = true
            } else {
                // Si ya existe, simplemente actualizamos el contenido y el valor
                div_existente.setAttribute("data-valortotal", nuevo_valor_pagar);
                div_existente.innerHTML = "El nuevo valor a pagar es: $" + nuevo_valor_pagar;
            }
        }
    })
    .catch(error => {
        if (error.response) {
            console.log('Error Response:', error.response.data);
            console.log('Error Status:', error.response.status);
            console.log('Error Headers:', error.response.headers);
            //
            if (error.response.data.error === 1){
                Swal.fire({
                    title: "Error",
                    text: "Debe ingresar un código válido.",
                    icon: "error"
                });
            }
            //
            if (error.response.data.descuento === 2){
                Swal.fire({
                    title: "Error",
                    text: "Código de descuento no valido.",
                    icon: "error"
                });
            }
            //
            if (error.response.data.error === 3){
                Swal.fire({
                    title: "Error",
                    text: "Debe ingresar un código válido.",
                    icon: "error"
                });
            }
            //
            if (error.response.data.error === 4){
                Swal.fire({
                    title: "Error",
                    text: "Código Expirado.",
                    icon: "error"
                });
            }
        }
    });
}
//
function pago_debito_reserva_realizada(reserva_uuid){
    limpiarSeleccionCuotas()
    //
    let modal_cant_cuotas = document.getElementById("modal_cant_cuotas")
    // Crea una instancia del modal de Bootstrap.
    const modalInstance = new bootstrap.Modal(modal_cant_cuotas);
    modalInstance.hide()
    const token = sessionStorage.getItem('token');
    let codigo;
    // Cod Descuento.
    try {
        // Cod Descuento.
        codigo = document.getElementById("valor_cod_desc").value
        if (codigo == '' || codigo == null){
            codigo = 0
        }
    } catch (error) {
        console.log("No existe el elemento descuento, porque ya fue pagada la reserva...")
    }
    //
    let datos = {
        'debito': 0,
        'codigo': codigo,
        'reserva_uuid': reserva_uuid,
    }
    //
    console.log(datos)
    //
    axios.put(`http://127.0.0.1:8000/reserva/update_pago_debito_reserva/${reserva_uuid}/`, datos, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(function (response) {
        console.log(response.data.success)
        if (response.data.success == 1){
            Swal.fire({
                title: "Pago Realizado con Débito",
                text: "Pago realizado correctamente.",
                icon: "success"
            });
            // Eliminamos los divs creados en el método anterior.
            let div_padre = document.getElementById("dato_reserva_pagar")
            console.warn(div_padre)
            // Limpiamos los DIV que creamos anteriormente.
            div_padre.replaceChildren();
        }
    })
    .catch(error => {
        if (error.response) {
            console.log('Error Response:', error.response.data);
            console.log('Error Status:', error.response.status);
            console.log('Error Headers:', error.response.headers);
            //
            if (error.response.data.error === 1){
                Swal.fire({
                    title: "Error",
                    text: "Debe ingresar un código válido.",
                    icon: "error"
                });
            }
            //
            if (error.response.data.descuento === 2){
                Swal.fire({
                    title: "Error",
                    text: "Código de descuento no valido.",
                    icon: "error"
                });
            }
            //
            if (error.response.data.error === 3){
                Swal.fire({
                    title: "Error",
                    text: "Debe ingresar un código válido.",
                    icon: "error"
                });
            }
            //
            if (error.response.data.error === 4){
                Swal.fire({
                    title: "Error",
                    text: "Código Expirado.",
                    icon: "error"
                });
            }
            //
            if (error.response.data.error === 5){
                Swal.fire({
                    title: "OOoopss...",
                    text: "El pago ya fué realizado",
                    icon: "error"
                });
            }
        }
    });
}
// Método de pago Crédito.
function pago_credito_reserva_realizada(reserva_uuid){
    //
    const cuotaSeleccionada = document.querySelector('input[name="cuota"]:checked');
    let cant_cuotas = "";
    //
    if (cuotaSeleccionada) {
        cant_cuotas = cuotaSeleccionada.value;
    } else {
        Swal.fire({
            title: "Falta Seleccionar Cuota.",
            text: "Debe seleccionar una opción cuota.",
            icon: "warning"
        });
        return;
    }
    //
    const token = sessionStorage.getItem('token');
    //
    let btn_cuota = document.getElementById("btn_cuota").value
    console.log(btn_cuota)
    let codigo;
    try {
        // Cod Descuento.
        codigo = document.getElementById("valor_cod_desc").value
        if (codigo == '' || codigo == null){
            codigo = 0
        }
    } catch (error) {
        console.log("No existe el elemento descuento, porque ya fue pagada la reserva...")
    }
    //
    let datos = {
        'credito': 1,
        'codigo': codigo,
        'reserva_uuid': btn_cuota,
        'cant_cuotas': cant_cuotas,
    }
    //
    console.log(datos)
    //
    axios.put(`http://127.0.0.1:8000/reserva/update_pago_credito_reserva/${btn_cuota}/`, datos, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(function (response) {
        console.log(response.data.success)
        if (response.data.success == 1){
            Swal.fire({
                title: "Pago Realizado con Crédito",
                text: "Pago realizado correctamente.",
                icon: "success"
            });
            // Eliminamos los divs creados en el método anterior.
            let div_padre = document.getElementById("dato_reserva_pagar")
            console.warn(div_padre)
            // Limpiamos los DIV que creamos anteriormente.
            div_padre.replaceChildren();
        }
    })
    .catch(error => {
        if (error.response) {
            console.log('Error Response:', error.response.data);
            console.log('Error Status:', error.response.status);
            console.log('Error Headers:', error.response.headers);
            //
            if (error.response.data.error === 1){
                Swal.fire({
                    title: "Error",
                    text: "Debe ingresar un código válido.",
                    icon: "error"
                });
            }
            //
            if (error.response.data.descuento === 2){
                Swal.fire({
                    title: "Error",
                    text: "Código de descuento no valido.",
                    icon: "error"
                });
            }
            //
            if (error.response.data.error === 3){
                Swal.fire({
                    title: "Error",
                    text: "Debe ingresar un código válido.",
                    icon: "error"
                });
            }
            //
            if (error.response.data.error === 4){
                Swal.fire({
                    title: "Error",
                    text: "Código Expirado.",
                    icon: "error"
                });
            }
            //
            if (error.response.data.error === 5){
                Swal.fire({
                    title: "OOoopss...",
                    text: "El pago ya fué realizado",
                    icon: "error"
                });
            }
        }
    });
}
// Lipiar el rado button de las cuota de los créditos.
function limpiarSeleccionCuotas() {
  const radios = document.querySelectorAll('input[name="cuota"]');
  radios.forEach(radio => {
    radio.checked = false;
  });
}
// Función para cerrar la sessión.
function cerrar_session(){
    //
    const username = sessionStorage.getItem('username');
    const token = sessionStorage.getItem('token');
    //
    let datos = {
        'username': username,
        'token': token
    }
    //
    axios.post(`http://127.0.0.1:8000/usuario/cerrar_sesion`,datos, {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(function (response) {
        console.warn(response.data);
        console.warn(response.status)
        // Eliminar el token del almacenamiento local
        if (response.status == 200) {
            sessionStorage.removeItem('token');
            window.location.href = 'http://127.0.0.1:5500/index.html'
        }
    }).catch(error => {
        if (error.response) {
            console.log('Error Response:', error.response.data);
            console.log('Error Status:', error.response.status);
            console.log('Error Headers:', error.response.headers);
        }
    });
}
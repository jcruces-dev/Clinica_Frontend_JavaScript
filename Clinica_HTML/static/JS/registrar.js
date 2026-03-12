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
// document.addEventListener('DOMContentLoaded', function () {
//     //
//     const inputRut = document.getElementById('rut');
//     //
//     inputRut.addEventListener('input', function (e) {
//         let valor = e.target.value.replace(/\./g, '').replace(/-/g, '');
        
//         // Solo formatear si hay al menos 2 caracteres (cuerpo + dv)
//         if (valor.length >= 2) {
//             e.target.value = formatearRUT(valor);
//         }
//     });
// });

//
document.addEventListener('DOMContentLoaded', function () {
    const inputRut = document.getElementById('rut');

    inputRut.addEventListener('input', function (e) {
        // 1. Guardar la posición del cursor antes de formatear
        let cursorPosition = e.target.selectionStart;
        let valorOriginal = e.target.value;

        // 2. Limpiar el valor: Solo dejar números y la letra K
        let valor = valorOriginal.replace(/[^0-9kK]/g, '');
        
        if (valor.length > 0) {
            // 3. Aplicar el formato (Puntos y Guion)
            let cuerpo = valor.slice(0, -1);
            let dv = valor.slice(-1).toUpperCase();
            
            // Formatear cuerpo con puntos
            let cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            
            // Unir todo
            let resultado = cuerpo.length > 0 ? `${cuerpoFormateado}-${dv}` : dv;
            
            e.target.value = resultado;

            // 4. Reposicionar el cursor para que no salte al final
            // Ajustamos la posición si se añadieron puntos o guiones
            let diff = e.target.value.length - valorOriginal.length;
            e.target.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
        }
    });
});

//
function registrar_paciente_index(e){
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    let primer_nombre = document.getElementById("primer_nombre_regis").value
    let segundo_nombre = document.getElementById("segundo_nombre_regis").value
    let ap_paterno = document.getElementById("ap_paterno_regis").value
    let ap_materno = document.getElementById("ap_materno_regis").value
    let email = document.getElementById("email").value
    let edad = document.getElementById("edad").value
    let fono = document.getElementById("fono").value
    // Si empieza con +56, se lo eliminamos y dejamos el resto del fono.
    if (fono.startsWith("+56")) {
        fono = fono.replace("+56", "");
    }
    //
    let rut = document.getElementById("rut").value
    let num_vivienda = document.getElementById("num_vivienda").value
    //------- Valor Radio Button Sexo ---------
    let sexo = document.getElementsByName("sexo")
    let valor_radio;
    sexo.forEach(radio => {
        if (radio.checked) {
            valor_radio = radio.value;
        }
    });
    //------- Fin Valor Radio Button Sexo ---------
    //------- Valor Radio Button Vivienda---------
    let vivienda = document.getElementsByName("tipo_vivienda")
    let valor_vivienda;
    vivienda.forEach(radio => {
        if (radio.checked) {
            valor_vivienda = radio.value;
        }
    });
    console.log(valor_vivienda)
    //------- Fin Valor Radio Button Vivienda ---------
    //-------------------- Select dinámico, esta es la manera de recorrer el select y obtener el valorInput Región.
    // let id_region = document.getElementById("region").value
    // console.warn(id_region)
    // // 
    // let region = document.getElementById("region_" + id_region).getAttribute("data-region")
    // console.log(region)
    let selectRegion = document.getElementById("region");
    // Obtiene el texto de la opción seleccionada (ej: "Metropolitana")
    let region = selectRegion.options[selectRegion.selectedIndex].text;
    console.log("Región seleccionada:", region);

    //------ Fin Select dinámico, esta es la manera de recorrer el select y obtener el valorInput Comuna.
    let comuna = document.getElementById("comuna").value
    console.log(comuna)
    //------ Fin Select dinámico, esta es la manera de recorrer el select y obtener el valorInput Comuna.
    //-----  Creamos el array de bjetos. -------------
    let datos = {
        'username': username ,
        'password': password ,
        'primer_nombre': primer_nombre ,
        'segundo_nombre': segundo_nombre,
        'ap_paterno': ap_paterno,
        'ap_materno': ap_materno,
        'email': email,
        'edad': edad,
        'fono': fono,
        'rut': rut,
        'num_vivienda': num_vivienda,
        'sexo': valor_radio,
        'vivienda': valor_vivienda,
        'region': region,
        'comuna': comuna,
    }
    console.log(datos)
    // axios.post(`http://127.0.0.1:8000/paciente/crear_paciente_index_registrar`,datos, {
    axios.post(`https://jacruces91.pythonanywhere.com/paciente/crear_paciente_index_registrar`,datos, {
    
        headers: {
            //'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(function (response) {
        console.warn(response.data);
        console.warn(response.status)
        if (response.status == 200) {
            Swal.fire({
                icon: "success",
                title: "Usuario Registrado  Correctamente",
                text: "usuario registrado",
            });
        }
    })
    .catch(error => {
        if (error.response) {
            console.log('Error Response:', error.response.data);
            console.log('Error Status:', error.response.status);
            console.log('Error Headers:', error.response.headers);
            //
            if (error.response.data.error == 3) {
                Swal.fire({
                    icon: "error",
                    title: "El usuario ya existe",
                    text: "El usuario fue creado anteriormente!",
                });
            }
            if (error.response.data.error == 4) {
                Swal.fire({
                    icon: "error",
                    title: "El RUT es inválido",
                    text: "El RUT ingresado ya se encuentra registrado!",
                });
            }
            //
            if (error.response.data.error == 5) {
                Swal.fire({
                    icon: "error",
                    title: "OOoops...",
                    text: "El usuario ya existe",
                });
            }
            //
            if (error.response.data.error == 6) {
                Swal.fire({
                    icon: "error",
                    title: "OOoops...",
                    text: "Debe ingresar un RUT válido",
                });
            }
            //
            if (error.response.data.error == 7) {
                Swal.fire({
                    icon: "error",
                    title: "OOoops...",
                    text: "Debe ingresar un fono de contacto válido",
                });
            }
            //
            if (error.response.data.error == 8) {
                Swal.fire({
                    icon: "error",
                    title: "OOoops...",
                    text: "El Username ya se encuentra registrado",
                });
            }
        }
    });
}
//
function registrar_paciente(e){
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    let primer_nombre = document.getElementById("primer_nombre_regis").value
    let segundo_nombre = document.getElementById("segundo_nombre_regis").value
    let ap_paterno = document.getElementById("ap_paterno_regis").value
    let ap_materno = document.getElementById("ap_materno_regis").value
    let email = document.getElementById("email").value
    let edad = document.getElementById("edad").value
    let fono = document.getElementById("fono").value
    // Si empieza con +56, se lo eliminamos y dejamos el resto del fono.
    if (fono.startsWith("+56")) {
        fono = fono.replace("+56", "");
    }
    //
    let rut = document.getElementById("rut").value
    let num_vivienda = document.getElementById("num_vivienda").value
    //------- Valor Radio Button Sexo ---------
    let sexo = document.getElementsByName("sexo")
    let valor_radio;
    sexo.forEach(radio => {
        if (radio.checked) {
            valor_radio = radio.value;
        }
    });
    //------- Fin Valor Radio Button Sexo ---------
    //------- Valor Radio Button Vivienda---------
    let vivienda = document.getElementsByName("tipo_vivienda")
    let valor_vivienda;
    vivienda.forEach(radio => {
        if (radio.checked) {
            valor_vivienda = radio.value;
        }
    });
    console.log(valor_vivienda)
    //------- Fin Valor Radio Button Vivienda ---------
    //-------------------- Select dinámico, esta es la manera de recorrer el select y obtener el valorInput Región.
    let id_region = document.getElementById("region").value
    let region = document.getElementById("region_" + id_region).getAttribute("data-region")
    console.log(region)
    //------ Fin Select dinámico, esta es la manera de recorrer el select y obtener el valorInput Comuna.
    let comuna = document.getElementById("comuna").value
    console.log(comuna)
    //------ Fin Select dinámico, esta es la manera de recorrer el select y obtener el valorInput Comuna.
    //-----  Creamos el array de bjetos. -------------
    let datos = {
        'username': username ,
        'password': password ,
        'primer_nombre': primer_nombre ,
        'segundo_nombre': segundo_nombre,
        'ap_paterno': ap_paterno,
        'ap_materno': ap_materno,
        'email': email,
        'edad': edad,
        'fono': fono,
        'rut': rut,
        'num_vivienda': num_vivienda,
        'sexo': valor_radio,
        'vivienda': valor_vivienda,
        'region': region,
        'comuna': comuna,
    }
    console.log(datos)
    axios.post(`https://jacruces91.pythonanywhere.com/usuario/registrar_usuario`,datos, {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(function (response) {
        console.warn(response.data);
        console.warn(response.status)
        if (response.status == 200) {
            Swal.fire({
                icon: "success",
                title: "Usuario Registrado  Correctamente",
                text: "usuario registrado",
            });
        }
    })
    .catch(error => {
        if (error.response) {
            console.log('Error Response:', error.response.data);
            console.log('Error Status:', error.response.status);
            console.log('Error Headers:', error.response.headers);
            //
            if (error.response.data.error == 3) {
                Swal.fire({
                    icon: "error",
                    title: "El usuario ya existe",
                    text: "El usuario fue creado anteriormente!",
                });
            }
            //
            if (error.response.data.error == 6) {
                Swal.fire({
                    icon: "error",
                    title: "OOoops...",
                    text: "Debe ingresar un RUT válido",
                });
            }
            //
            if (error.response.data.error == 7) {
                Swal.fire({
                    icon: "error",
                    title: "OOoops...",
                    text: "Debe ingresar un fono de contacto válido",
                });
            }
        }
    });
}
function enviar_cod_verificacion(){
        //
    let cod_reserva = document.getElementById("cod_reserva").value
    //
    let datos = {
        'reserva_uuid': cod_reserva,

    }
    console.warn(datos)
    axios.post('http://127.0.0.1:8000/reserva/cod_reserva_verificacion',datos)
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
                        text: "No existe el grupo!",
                    });
                }
                if (error.response.data == 2) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "No existe el grupo!",
                    });
                }
                if (error.response.data == 3) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "No existe el grupo!",
                    });
                }
            }
        });
}
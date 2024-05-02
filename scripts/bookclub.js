function fetchBookClubData() {
    return new Promise(async (resolve, reject) => {
        try {
            // Realiza la petición al servidor
            const response = await fetch('http://localhost:8080/api/v1/book-club/');
            // Verifica si la respuesta es satisfactoria
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Espera a que los datos sean convertidos a JSON
            const data = await response.json();
            resolve(data);
        } catch (error) {
            // Rechaza la promesa con el error ocurrido durante la petición
            reject(error);
        }
    });
}

async function fetchBookClubByID(id) {
    try {
        // Realizar la solicitud al servidor para obtener los datos del club de lectura con el ID proporcionado
        const response = await fetch(`http://localhost:8080/api/v1/book-club/${id}`);

        // Verificar si la respuesta es satisfactoria
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Esperar a que los datos sean convertidos a JSON
        const data = await response.json();

        return data; // Devolver los datos del club de lectura
    } catch (error) {
        console.error("Error al obtener los datos del club de lectura por ID: ", error);
        throw error; // Re-lanzar el error para que se maneje fuera de esta función si es necesario
    }
}

// Ejemplo de cómo usar la función
fetchBookClubData()
    .then(data => console.log(data))
    .catch(error => console.error(error));

// Ejemplo de cómo usar la función fetchBookClubByID()
fetchBookClubByID(1)
    .then(data => {
        // `data` contiene la información del club de lectura obtenida del endpoint
        console.log("Datos del club de lectura:", data);
        // Puedes hacer lo que quieras con los datos del club de lectura aquí
    })
    .catch(error => {
        // Manejar errores aquí
        console.error(error);
    });

    
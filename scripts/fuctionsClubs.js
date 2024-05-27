////////////////////////////////////////////////// BOOK CLUB FUNCTIONS ///////////////////////////////////////////////////////////
// Cargar los datos de los clubes de lectura desde la API y renderizar la tabla
function fetchBookClubDataAndRenderTable() {
    const url = 'http://localhost:8080/api/v1/book-club/';
    // Usar fetch para obtener los datos de la API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Crea la tabla con Grid.js utilizando los datos obtenidos
            const table = new gridjs.Grid({
                columns: ['Nombre', 'Tags', 'Detalles'],
                data: data.data.map(item => [
                    item.name,
                    item.tags.join(', '), // Asume que `tags` es un array que podemos unir con comas
                    gridjs.html(`<a href="#" onclick="window.cargarDetallesClub('${item.bookClubId}'); return false;">Detalles</a>`)
                ]),
                search: {
                    // Esta configuración del selector de búsqueda se simplifica para buscar en todas las celdas
                    selector: (cell) => cell.toString()
                },
                pagination: {
                    limit: 10
                },
                style: {
                    table: {
                        'white-space': 'nowrap'
                    }
                },
                language: {
                    'search': {
                        'placeholder': '🔍 Buscar...'
                    },
                    'pagination': {
                        'previous': 'Anterior',
                        'next': 'Siguiente',
                        'showing': 'Mostrando',
                        'of': 'de',
                        'to': 'a',
                        'results': 'resultados'
                    },
                    loading: 'Cargando...',
                    noRecordsFound: 'Sin coincidencias encontradas',
                    error: 'Ocurrió un error al cargar la información',
                }
            });

            // Renderiza la tabla en el elemento con id "my-table"
            table.render(document.getElementById('my-table'));
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        });
}

// Cargar los datos de los clubes de lectura a los que pertenece un usuario y renderizar la tabla
function fetchBookClubJoinedDataAndRenderTable() {
    const id = localStorage.getItem('userId');
    const url = `http://localhost:8080/api/v1/user/${id}/joined-book-clubs`;
    // Usar fetch para obtener los datos de la API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Crea la tabla con Grid.js utilizando los datos obtenidos
            const table = new gridjs.Grid({
                columns: ['Nombre', 'Tags', 'Detalles'],
                data: data.data.map(item => [
                    item.name,
                    item.tags.join(', '), // Asume que `tags` es un array que podemos unir con comas
                    gridjs.html(`<a href="#" onclick="window.cargarDetallesClub('${item.bookClubId}'); return false;">Detalles</a>`)
                ]),
                search: {
                    // Esta configuración del selector de búsqueda se simplifica para buscar en todas las celdas
                    selector: (cell) => cell.toString()
                },
                pagination: {
                    limit: 10
                },
                style: {
                    table: {
                        'white-space': 'nowrap'
                    }
                },
                language: {
                    'search': {
                        'placeholder': '🔍 Buscar...'
                    },
                    'pagination': {
                        'previous': 'Anterior',
                        'next': 'Siguiente',
                        'showing': 'Mostrando',
                        'of': 'de',
                        'to': 'a',
                        'results': 'resultados'
                    },
                    loading: 'Cargando...',
                    noRecordsFound: 'Sin coincidencias encontradas',
                    error: 'Ocurrió un error al cargar la información',
                }
            });

            // Renderiza la tabla en el elemento con id "my-table"
            table.render(document.getElementById('my-clubs'));
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        });
}

// Función para obtener los datos de un club de lectura
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

// Función para obtener los datos de un club de lectura por ID
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

// Función para cargar los detalles de un club de lectura 
async function cargarDetallesClub(bookClubId) {
    try {
        // Obtener los detalles del club de lectura usando fetchBookClubByID
        const data = await fetchBookClubByID(bookClubId);

        // Almacenar los datos en localStorage
        localStorage.setItem('bookClubData', JSON.stringify(data));
        localStorage.setItem('bookClubId', data.data.bookClubId);
        // Redirigir a la página HTML deseada
        window.location.href = '/pages/clubs/showBookClubsDetails.html';
    } catch (error) {
        console.error("Error al obtener los detalles del club de lectura:", error);
    }
}

//UNIRSE A UN CLUB 
function unirseClub() {
    const userId = localStorage.getItem('userId');
    const bookClubId = localStorage.getItem('bookClubId');
    const url = `http://localhost:8080/api/v1/book-club/${bookClubId}/user/${userId}`;
    const response = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            if (data.message === "User already joined") {
                alert("Ya esta registrado en este club");
            }
            if (data.message === "User successfully joined") {
                // Suponiendo que el mensaje de éxito es "Authentication Successful"
                alert("Se ha unido exitosamente");
                window.location.href = 'clubs.html';
            } else {
                // Si la autenticación no fue exitosa, manejar como un error
                throw new Error(data.message || 'Fallo en el registro');
            }
        })
}

// Función para crear una reunion de Meet
async function crearReunionMeet(bookClubId, summary, descripcion, fechaHoraInicio, fechaHoraFinal) {
    try {
        const url = `http://localhost:8080/api/v1/book-club/${bookClubId}/event`;
        const data = {
            summary: summary,
            description: descripcion,
            startDateTime: fechaHoraInicio,
            endDateTime: fechaHoraFinal,
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error al generar la reunion. Estado HTTP: ${response.status}`);
        }
        const responseData = await response.json();
        alert("La reunion ha sido agendada exitosamente");
        window.location.assign('showBookClubsDetails.html');
    } catch (error) {
        console.error("Error al generar la reunion:", error);
        throw error;
    }
}

// Función para actualizar asistentes
async function actualizaAsistentes() {
    const data = await getEventData();
    if (data) {
        await updateEventData(data);
    }
}

// Función para obtener los datos de una reunion
async function getEventData() {
    const bookClubId = localStorage.getItem('bookClubId');
    const url = `http://localhost:8080/api/v1/book-club/${bookClubId}/event`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        alert("Datos obtenidos correctamente")
        console.log("Datos obtenidos:", data);
        return data;
    } catch (error) {
        alert("Error al obtener los datos")
        console.error(error);
    }
}

// Función para actualizar los datos de una reunion
async function updateEventData(data) {
    const bookClubId = localStorage.getItem('bookClubId');
    const url = `http://localhost:8080/api/v1/book-club/${bookClubId}/event`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data.data),
        });
        if (!response.ok) {
            throw new Error(`Error al actualizar los datos: ${response.status} - ${response.statusText}`);
        }
        const updatedData = await response.json();
        alert("Datos actualizados correctamente")
        console.log("Datos actualizados correctamente:", updatedData);
    } catch (error) {
        alert("Error en la actualización de los datos")
        console.error(error);
    }
}

//////////////////////////////////////////////// CLUBS CRUD ///////////////////////////////////////////////////

// Función para crear un club
function handleFormSubmitRegisterClub() {
    // Prevenir el envío predeterminado del formulario
    event.preventDefault();

    // Obtener los valores del formulario
    const nameInput = document.getElementById('inputName');
    const descriptionInput = document.getElementById('inputDescription');
    const tagsInput = document.getElementById('inputTags');
    const imageLinkInput = document.getElementById('inputLinkImage');
    const userId = localStorage.getItem('userId');

    const name = nameInput.value;
    const description = descriptionInput.value;
    const tags = tagsInput.value.split(',').map(tag => tag.trim());
    const imageLink = imageLinkInput.value;


    // Enviar la solicitud POST a la API
    fetch('http://localhost:8080/api/v1/book-club/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, tags, imageLink, userId })
    })
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            // Manejar la respuesta
            console.log(data); // Puedes hacer algo con la respuesta aquí
            // Por ejemplo, si esperas un mensaje de éxito:
            if (data.message === "Bookclub successfully created") {
                alert("¡Club de lectura creado exitosamente!");
                // Redirigir a otra página si es necesario
                window.location.href = '/pages/clubs/clubs.html';
            } else {
                // Si hay errores u otra respuesta, manejar como desees
                alert(data.message || 'Error en la creación del club de lectura');
            }
        })
        .catch(error => {   // Capturar cualquier error
            console.error('Error:', error);
            // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
            alert('Ocurrió un error al enviar la solicitud');
        });
}
// Función para actualizar club
function handleFormSubmitUpdateClub() {
    // Prevenir el envío predeterminado del formulario
    event.preventDefault();

    // Obtener los valores del formulario
    const nameInput = document.getElementById('inputName');
    const descriptionInput = document.getElementById('inputDescription');
    const tagsInput = document.getElementById('inputTags');
    const imageLinkInput = document.getElementById('inputLinkImage');
    const userId = localStorage.getItem('userId');
    const bookClubId = localStorage.getItem('bookClubId');



    const name = nameInput.value;
    const description = descriptionInput.value;
    const tags = tagsInput.value.split(',').map(tag => tag.trim());
    const imageLink = imageLinkInput.value;


    // Enviar la solicitud POST a la API
    fetch('http://localhost:8080/api/v1/book-club/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookClubId, name, description, tags, imageLink, userId })
    })
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            // Manejar la respuesta
            console.log(data); // Puedes hacer algo con la respuesta aquí
            // Por ejemplo, si esperas un mensaje de éxito:
            if (data.message === "Bookclub successfully updated") {
                alert("¡Club de lectura ha sido actualizado exitosamente!");
                // Redirigir a otra página si es necesario
                window.location.href = '/pages/clubs/clubs.html';
            } else {
                // Si hay errores u otra respuesta, manejar como desees
                alert(data.message || 'Club no encontrado');
            }
        })
        .catch(error => {   // Capturar cualquier error
            console.error('Error:', error);
            // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
            alert('Ocurrió un error al enviar la solicitud');
        });
}
// Función para eliminar un club
function deleteClub() {
    // Obtener el ID del club de lectura
    const rolUsuario = obtenerRolDelUsuario();
    if (rolUsuario.toLowerCase() === 'admin') {
        const bookClubId = localStorage.getItem('bookClubId');

        // Verificar que el ID del club de lectura esté disponible
        if (!bookClubId) {
            alert('ID del club de lectura no encontrado');
            return;
        }

        // Enviar la solicitud DELETE a la API
        fetch('http://localhost:8080/api/v1/book-club/' + bookClubId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: bookClubId })
        })
            .then(response => response.json()) // Convertir la respuesta a JSON
            .then(data => {
                // Manejar la respuesta
                console.log(data); // Puedes hacer algo con la respuesta aquí
                // Por ejemplo, si esperas un mensaje de éxito:
                if (data.message === "Bookclub successfully deleted") {
                    alert("¡Club de lectura eliminado exitosamente!");
                    // Redirigir a otra página si es necesario
                    window.location.href = '/pages/clubs/clubs.html';
                } else {
                    // Si hay errores u otra respuesta, manejar como desees
                    alert(data.message || 'Error al eliminar el club de lectura');
                }
            })
            .catch(error => { // Capturar cualquier error
                console.error('Error:', error);
                // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
                alert('Ocurrió un error al enviar la solicitud');
            });
    } else {
        // Si hay errores u otra respuesta, manejar como desees
        alert('No tiene permisos para elimiar el club');
    }
}




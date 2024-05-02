
// Llamar a la función para cargar los datos y renderizar la tabla cuando se carga la página
fetchBookClubDataAndRenderTable();
fetchBookReviewDataAndRenderTable()
fetchBookClubJoinedDataAndRenderTable()
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

// Funcion para crear una reunion de Meet
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
        window.location.assign('showBookReviewDetails.html');
    } catch (error) {
        console.error("Error al generar la reunion:", error);
        throw error;
    }
}

////////////////////////////////////////////////// RESEÑAS FUNCTIONS ///////////////////////////////////////////////////////////

// Función para cargar y renderizar la tabla de reseñas
function fetchBookReviewDataAndRenderTable() {
    const url = 'http://localhost:8080/api/v1/book-review/';
    const clubId = localStorage.getItem('bookClubId');
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Filtrar las reseñas por clubId
            const filteredData = data.data.filter(item => item.bookClubId == clubId);
            // Crear la tabla con Grid.js utilizando los datos filtrados
            const table = new gridjs.Grid({
                columns: ['Titulo del libro', 'Puntacion', 'Fecha de creación', 'Detalles'],
                data: filteredData.map(item => [
                    item.bookTitle,
                    item.rating,
                    item.createdAt,
                    gridjs.html(`<a href="#" onclick="window.cargarDetallesClubReseñas('${item.bookReviewId}'); return false;">Detalles</a>`)
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
                }
            });

            // Renderizar la tabla en el elemento con id "my-table-reviews"
            table.render(document.getElementById('my-table-reviews'));
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        });
}

// Función para obtener los datos de una reseña por ID
async function fetchReviewByID(id) {
    try {
        // Realizar la solicitud al servidor para obtener los datos de la reseña del libro con el ID proporcionado
        const response = await fetch(`http://localhost:8080/api/v1/book-review/${id}`);

        // Verificar si la respuesta es satisfactoria
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Esperar a que los datos sean convertidos a JSON
        const data = await response.json();

        return data; // Devolver los datos de la reseña del libro
    } catch (error) {
        console.error("Error al obtener los datos de la reseña del libro por ID: ", error);
        throw error; // Re-lanzar el error para que se maneje fuera de esta función si es necesario
    }
}

// Función para cargar las Reseñas de un club de lectura 
async function cargarReseñasClub(bookClubId) {
    try {
        // Obtener los detalles de la reseña del libro usando fetchReviewByID
        const data = await fetchReviewByID(bookClubId);
        console.log("entro");
        // Almacenar los datos en localStorage
        localStorage.setItem('bookClubReviews', JSON.stringify(data));
    } catch (error) {
        console.error("Error al obtener los detalles de las reseñas:", error);
    }
}

// Función para cargar los detalles sobre una sola reseña de un club de lectura 
async function cargarDetallesClubReseñas(bookReviewId) {
    try {
        // Obtener los detalles del club de lectura usando fetchBookClubByID
        const data = await fetchReviewByID(bookReviewId);

        // Almacenar los datos en localStorage
        localStorage.setItem('bookReviewData', JSON.stringify(data));
        localStorage.setItem('bookReviewId', data.data.bookReviewId);

        // Redirigir a la página HTML deseada
        window.location.href = 'showBookReviewDetails.html';
    } catch (error) {
        console.error("Error al obtener los detalles del club de lectura:", error);
    }
}

// Función para cargar los datos de una reseña en el form para actualizar
async function fetchBookReview(id) {
    const url = `http://localhost:8080/api/v1/book-review/${id}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const result = await response.json();

        if (result.message === "Book review successfully retrieved") {
            const data = result.data;
            document.getElementById('bookReviewId').value = data.bookReviewId;
            document.getElementById('bookTitle').value = data.bookTitle;
            document.getElementById('review').value = data.review;
            document.getElementById('rating').value = data.rating;
            document.getElementById('createdAt').value = data.createdAt;
            document.getElementById('userId').value = data.userId;
            document.getElementById('bookClubId').value = data.bookClubId;
        } else {
            console.error('Error retrieving book review:', result.message);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

//////////////////////////////////////////////// DISCUSIONES FUNCTIONS ///////////////////////////////////////////////////

// Función para obtener los datos de una discusión por ID
async function fetchDiscussionByID(id) {
    try {
        // Realizar la solicitud al servidor para obtener los datos del club de lectura con el ID proporcionado
        const response = await fetch(`http://localhost:8080/api/v1/discussion/${id}`);

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

// Función para cargar las discusiones de un club de lectura 
async function cargarDiscusionesClub(bookClubId) {
    try {
        // Obtener los detalles del club de lectura usando fetchBookClubByID
        const data = await fetchDiscussionByID(bookClubId);

        // Almacenar los datos en localStorage
        localStorage.setItem('bookClubDiscussions', JSON.stringify(data));
    } catch (error) {
        console.error("Error al obtener los detalles de las discusiones:", error);
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

// Función para unirse a un club

//////////////////////////////////////////////// RESEÑAS CRUD ///////////////////////////////////////////////////


// Función para crear una nueva reseña
async function crearReseña(bookTitle, review, rating, createdAt, userId, bookClubId) {
    try {
        const url = 'http://localhost:8080/api/v1/book-review/';

        const userId = localStorage.getItem('userId');
        const bookClubId = localStorage.getItem('bookClubId');

        const data = {
            bookTitle: bookTitle,
            review: review,
            rating: rating,
            createdAt: createdAt,
            userId: userId,
            bookClubId: bookClubId,
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error al crear la reseña. Estado HTTP: ${response.status}`);
        }

        const responseData = await response.json();
        return responseData; // Devuelve los datos de la reseña creada
    } catch (error) {
        console.error("Error al crear la reseña:", error);
        throw error; // Re-lanzar el error para que se maneje fuera de esta función si es necesario
    }
}

// Función para enviar los datos para actualizar una reseña existente
async function actualizarReseña(bookReviewId, bookTitle, review, rating, createdAt, userId, bookClubId) {
    try {
        const url = `http://localhost:8080/api/v1/book-review/`;
        const data = {
            bookReviewId: bookReviewId,
            bookTitle: bookTitle,
            review: review,
            rating: rating,
            createdAt: createdAt,
            userId: userId,
            bookClubId: bookClubId
        };

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar la reseña. Estado HTTP: ${response.status}`);
        }
        const responseData = await response.json();
        alert("Su reseña ha sido actualizada");
        window.location.assign('reviews/showBookReviewDetails.html');
        return responseData; // Devuelve los datos de la reseña actualizada
    } catch (error) {
        console.error("Error al actualizar la reseña:", error);
        throw error; // Re-lanzar el error para que se maneje fuera de esta función si es necesario
    }
}

// Función para eliminar una reseña existente
async function eliminarReseña(bookReviewId) {
    try {
        const url = `http://localhost:8080/api/v1/book-review/${bookReviewId}`;

        const response = await fetch(url, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar la reseña. Estado HTTP: ${response.status}`);
        }

        const responseData = await response.json();
        return responseData; // Devuelve los datos de la reseña eliminada
    } catch (error) {
        console.error("Error al eliminar la reseña:", error);
        throw error; // Re-lanzar el error para que se maneje fuera de esta función si es necesario
    }
}

//////////////////////////////////////////////// USER FUCTIONS ///////////////////////////////////////////////////

//ACTUALIZAR PERFIL
async function actualizarPerfil(username, pictureUrl, email, password) {
    try {
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('role');
console.log( password)
        const url = `http://localhost:8080/api/v1/user/`;
        const data = {
            userId: userId,
            username: username,
            pictureUrl: pictureUrl,
            email: email,
            password: password,
            role: role,
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`Error al crear la reseña. Estado HTTP: ${response.status}`);
        }
        const responseData = await response.json();
        return responseData; 
    } catch (error) {
        console.error("Usuario no encontrado", error);
        throw error; 
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

//////////////////////////////////////////////// VALIDACION ROLES ///////////////////////////////////////////////////

// Función para validar el rol del usuario
function validarYRedirigir(url) {
    const rolUsuario = obtenerRolDelUsuario();
    if (rolUsuario.toLowerCase() === 'admin') {
        console.log("estoy en el if")
        window.location.href = url;
    } else {
        alert("No tienes permiso para acceder a esta página");
    }
}

// Función para validar el rol del usuario
function obtenerRolDelUsuario() {
    // Obtener el rol del usuario desde el localStorage
    const rolUsuario = localStorage.getItem('role');
    return rolUsuario
}

//////////////////////////////////////////// Importacion nav y footer ///////////////////////////////////////////////////////////

// Cargar el archivo HTML en el elemento con el ID especificado
function loadHTML(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(elementId).innerHTML = html;
        })
        .catch(error => console.error('Error al cargar el archivo HTML:', error));
}

// Función para redireccionar a una página
function redirigir(destino) {

    const bookClubId = localStorage.getItem('bookClubId');

    if (destino === 'discussions.html') {
        cargarDiscusionesClub(bookClubId);
    }
    else if (destino === 'reviews.html') {
        cargarReseñasClub(bookClubId);
    }

    // Cambiar la ubicación de la página
    window.location.href = destino;
}




// Cargar los datos de los clubes de lectura desde la API y renderizar la tabla
function fetchBookClubDataAndRenderTable() {
    const url = 'http://localhost:8080/api/v1/book-club/';

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

// Función para cargar los detalles de un club de lectura 
async function cargarDetallesClub(bookClubId) {
    try {
        // Obtener los detalles del club de lectura usando fetchBookClubByID
        const data = await fetchBookClubByID(bookClubId);

        // Almacenar los datos en localStorage
        localStorage.setItem('bookClubData', JSON.stringify(data));
        localStorage.setItem('bookClubId', data.data.bookClubId);
        // Redirigir a la página HTML deseada
        window.location.href = 'showBookClubsDetails.html';
    } catch (error) {
        console.error("Error al obtener los detalles del club de lectura:", error);
    }
}

// Función para cargar los detalles sobre una reseña de un club de lectura 
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

// Llamar a la función para cargar los datos y renderizar la tabla cuando se carga la página
fetchBookClubDataAndRenderTable();

////////////////////////////////////////////////// BOOK CLUB FUNCTIONS ///////////////////////////////////////////////////////////

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

//////////////////////////////////////////// importacion nav y footer ///////////////////////////////////////////////////////////

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

//////////////////////////////////////////////// RESEÑAS CRUD ///////////////////////////////////////////////////

// Función para cargar y renderizar la tabla de reseñas
function fetchBookReviewDataAndRenderTable() {
    const url = 'http://localhost:8080/api/v1/book-review/';

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
                columns: ['Titulo del libro', 'Reseña', 'Puntacion', 'Fecha de creación', 'Detalles'],
                data: data.data.map(item => [
                    item.bookTitle,
                    item.review,
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

            // Renderiza la tabla en el elemento con id "my-table"
            table.render(document.getElementById('my-table-reviews'));
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        });
}

fetchBookReviewDataAndRenderTable()

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
            bookClubId: bookClubId
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

// Función para actualizar una reseña existente
async function actualizarReseña(bookReviewId, bookTitle, review, rating, createdAt, userId, bookClubId) {
    try {
        const url = `http://localhost:8080/api/v1/book-review/${bookReviewId}`;
        const data = {
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

////////////////////////////////////////////////// RESEÑAS FUNCTIONS ///////////////////////////////////////////////////////////
fetchBookReviewDataAndRenderTable()

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
                columns: ['Título del libro', 'Puntuación', 'Fecha de creación', 'Detalles'],
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

/////////////////////////////////////////////////////////////////// RESEÑAS CRUD /////////////////////////////////////////////////////////////////

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
        window.location.assign('reviews/reviews.html');
        return responseData; // Devuelve los datos de la reseña actualizada
    } catch (error) {
        alert("Error al actualizar la reseña");
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
        alert("Su reseña ha sido eliminada exitosamente");
        const responseData = await response.json();
        window.location.assign('reviews.html');
        return responseData; // Devuelve los datos de la reseña eliminada
    } catch (error) {
        alert("Error al eliminar la reseña");
        console.error("Error al eliminar la reseña:", error);
        throw error; // Re-lanzar el error para que se maneje fuera de esta función si es necesario
    }
}

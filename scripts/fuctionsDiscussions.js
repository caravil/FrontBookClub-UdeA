//////////////////////////////////////////////// FUNCIONES DISCUSIONES ///////////////////////////////////////////////////

// Función para cargar las discusiones y renderizar en una tabla
function fetchDiscussionDataAndRenderTable() {
    const url = 'http://localhost:8080/api/v1/discussion/';
    // Usar fetch para obtener los datos de la API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Verifica que el contenedor existe
            const container = document.getElementById('my-table');
            if (!container) {
                console.error('Container element #my-table not found');
                return;
            }

            // Limpia el contenedor
            container.innerHTML = '';

            // Crea la tabla con Grid.js utilizando los datos obtenidos
            const table = new gridjs.Grid({
                columns: ['Titulo', 'Fecha creación', 'Detalles'],
                data: data.data.map(item => [
                    item.title,
                    item.createdAt,
                    gridjs.html(`<a href="#" onclick="window.cargarDetallesDiscusion('${item.discussionId}'); return false;">Detalles</a>`)
                ]),
                search: {
                    // Esta configuración del selector de búsqueda se simplifica para buscar en todas las celdas
                    selector: (cell) => cell.toString()
                },
                pagination: {
                    limit: 5
                },
                style: {
                    table: {
                        'white-space': 'nowrap'
                    }
                },
                sort: true,
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

            // Renderiza la tabla en el elemento con id "discussion-table"
            table.render(document.getElementById('my-table'));
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        });
}

// Función para cargar los detalles de una discusión 
async function cargarDetallesDiscusion(discussionId) {
    try {
        // Obtener los detalles de una discusión de un club usando fetchDiscussionByID
        const data = await fetchDiscussionByID(discussionId);

        // Almacenar los datos en localStorage
        localStorage.setItem('discussionData', JSON.stringify(data));
        localStorage.setItem('discussionId', data.data.discussionId);
        localStorage.setItem('dueñoDiscusion', data.data.userId);
        // Redirigir a la página HTML deseada
        window.location.href = '/pages/discussions/showDiscussionDetails.html';
    } catch (error) {
        console.error("Error al obtener los detalles de la discusión:", error);
    }
}
// Función para buscar una discusión por ID
async function fetchDiscussionByID(id) {
    try {
        // Realizar la solicitud al servidor para obtener los datos de una discusión con el ID proporcionado
        const response = await fetch(`http://localhost:8080/api/v1/discussion/${id}`);

        // Verificar si la respuesta es satisfactoria
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Esperar a que los datos sean convertidos a JSON
        const data = await response.json();

        return data; // Devolver los datos de una discusión
    } catch (error) {
        console.error("Error al obtener los datos de la discusión por ID: ", error);
        throw error; // Re-lanzar el error para que se maneje fuera de esta función si es necesario
    }
}

//////////////////////////////////////////////// CRUD DISCUSIONES ///////////////////////////////////////////////////

function RegisterDiscussion(title, description, createdAt) {
    // Prevenir el envío predeterminado del formulario
    event.preventDefault();

    // Obtener los valores del localStorage
    const userId = localStorage.getItem('userId');
    const bookClubId = localStorage.getItem('bookClubId');
    console.log(userId)
    console.log(bookClubId)
    console.log(createdAt)
    // Enviar la solicitud POST a la API
    fetch('http://localhost:8080/api/v1/discussion/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, createdAt, userId, bookClubId })
    })
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            // Manejar la respuesta
            console.log(data); // Puedes hacer algo con la respuesta aquí
            // Por ejemplo, si esperas un mensaje de éxito:
            if (data.message === "Discussion successfully created") {
                alert("¡Discusión creada exitosamente!");
                // Redirigir a otra página si es necesario
                window.location.href = '/pages/discussions/discussions.html';
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

// Función para eliminar una discusión existente
async function DeleteDiscussion() {
    const dueñoDiscusion = localStorage.getItem(`dueñoDiscusion`)
    if (dueñoDiscusion == localStorage.getItem(`userId`)) {
        try {
            const url = `http://localhost:8080/api/v1/discussion/${localStorage.getItem(`discussionId`)}`;

            const response = await fetch(url, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar la discusión. Estado HTTP: ${response.status}`);
            }
            alert("Su discusión ha sido eliminada exitosamente");
            window.location.href = '/pages/discussions/discussions.html';
            const responseData = await response.json();
            return responseData; // Devuelve los datos de la reseña eliminada
        } catch (error) {
            console.error("Error al eliminar la discusión:", error);
            throw error; // Re-lanzar el error para que se maneje fuera de esta función si es necesario
        }
    }
    else alert("No tiene permisos para eliminar esta discusión");
    window.location.assign('/pages/discussions/discussions.html');
}


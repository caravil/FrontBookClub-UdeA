// Función para cargar y mostrar las discusiones en la tabla
function loadAndDisplayDiscussions() {
    fetch('http://localhost:8080/api/v1/discussion/')
        .then(response => response.json())
        .then(data => {
            // Asegúrate de manejar posibles errores en la respuesta aquí
            renderDiscussionTable(data.data);
        })
        .catch(error => {
            console.error('Error fetching discussion data:', error);
        });
}

// Función para renderizar la tabla de discusiones
function renderDiscussionTable(discussions) {
    const table = new gridjs.Grid({
        columns: ['Discussion ID', 'Title', 'Description', 'Created At', 'User ID', 'Book Club ID'],
        data: discussions.map(item => [
            item.discussionId,
            item.title,
            item.description,
            item.createdAt,
            item.userId,
            item.bookClubId
        ]),
        search: true,
        pagination: {
            limit: 5
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
            }
        }
    });

    // Renderiza la tabla en el elemento con id "discussion-table"
    table.render(document.getElementById('discussion-table'));
}

// Cargar y mostrar las discusiones al cargar la página
document.addEventListener('DOMContentLoaded', loadAndDisplayDiscussions);

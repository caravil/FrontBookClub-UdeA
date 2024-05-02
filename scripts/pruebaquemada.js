document.addEventListener('DOMContentLoaded', function () {
    // Datos quemados para probar la tabla
    const data = [
        {
            clubId: 1,
            name: 'Club A',
            description: 'Descripción del Club A',
            tags: ['Literatura', 'Amigos'],
            meetLink: 'https://meet.example.com/clubA',
            userId: 101
        },
        {
            clubId: 2,
            name: 'Club B',
            description: 'Descripción del Club B',
            tags: ['Historia', 'Debate'],
            meetLink: 'https://meet.example.com/clubB',
            userId: 102
        }
        // Puedes agregar más datos aquí si lo deseas
    ];

    // Crea la tabla con Grid.js
    const table = new gridjs.Grid({
        columns: ['Club ID', 'Name', 'Description', 'Tags', 'Meet Link'],

            table: { 
              'white-space': 'nowrap'
            },
        pagination: {
            limit: 10
          },
        search: {
            selector: (cell, rowIndex, cellIndex) => cellIndex === 0 ? cell.firstName : cell
        },

        data: data.map(item => [
            item.clubId,
            item.name,
            item.description,
            item.tags.join(', '),
            `<a href="${item.meetLink}" target="_blank">Join</a>`,
            item.userId
        ])
    });

    // Renderiza la tabla en el elemento con id "my-table"
    table.render(document.getElementById('my-table'));
});
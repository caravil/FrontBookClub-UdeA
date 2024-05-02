function fetchBookClubDataAndRenderCards() {
    const url = 'http://localhost:8080/api/v1/book-club/';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('my-container');
            container.innerHTML = '';

            // Obtener una muestra aleatoria de 10 elementos
            const shuffledData = data.data.sort(() => 0.5 - Math.random());
            const selectedData = shuffledData.slice(0, 10);

            // Iterar sobre los datos seleccionados y crear tarjetas
            selectedData.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('card');

                card.addEventListener('click', () => {
                    cargarDetallesClub(item.bookClubId);
                });

                const image = document.createElement('img');
                image.src = item.imageLink;
                image.alt = item.name;
                image.classList.add('card-image');

                const name = document.createElement('h3');
                name.textContent = item.name;

                const tags = document.createElement('p');
                tags.textContent = "Tags: " + item.tags.join(', ');
                tags.classList.add('tags');

                card.appendChild(image);
                card.appendChild(name);
                card.appendChild(tags);

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        });
}
fetchBookClubDataAndRenderCards();

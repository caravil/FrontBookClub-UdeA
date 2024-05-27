async function getCommentById() {
    const discussionId = localStorage.getItem('discussionId');
    const url = 'http://localhost:8080/api/v1/comment/';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('my-container');
            if (!container) {
                console.error('Container element #my-container not found');
                return;
            }

            // Limpia el contenedor
            container.innerHTML = '';

            // Filtrar los comentarios por discussionId
            const filteredData = data.data.filter(item => item.discussionId == discussionId);

            // Iterar sobre los datos filtrados y crear tarjetas
            filteredData.forEach(async item => {
                const card = document.createElement('div');
                card.classList.add('card');

                const comment = document.createElement('p');
                comment.textContent = item.comment;

                const username = document.createElement('p');
                const userNameText = await getUsernameById();
                username.textContent = `Usuario: ${userNameText}`;

                card.appendChild(comment);
                card.appendChild(username);
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        });
}
async function getUsernameById() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/user/');
        const userData = await response.json();
        const userId = localStorage.getItem('userId')
        for (let user of userData.data) {
            console.log(user.userId)
            console.log(userId)
            if (user.userId == userId) {
                return user.username;
            }
        }
        return "Usuario no encontrado";
    } catch (error) {
        console.error('Error fetching user data:', error);
        return "Error fetching user data";
    }
}
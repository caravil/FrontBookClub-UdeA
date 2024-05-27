
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

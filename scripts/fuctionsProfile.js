
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




////////////////////////////////////////////////* Login *///////////////////////////////////////////
function handleFormSubmit(event) {
  // Prevenir el envío predeterminado del formulario
  event.preventDefault();

  // Obtener los valores de nombre de usuario y contraseña del formulario
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const username = usernameInput.value;
  const password = passwordInput.value;

  // Enviar la solicitud POST a la API de inicio de sesión
  fetch('http://localhost:8080/api/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json()) // Convertir la respuesta a JSON
    .then(data => {
      if (data.message === "Logged in") {
        // Suponiendo que el mensaje de éxito es "Authentication Successful"
        // Redireccionar a otra página (por ejemplo, dashboard.html)
        localStorage.setItem('userId', data.data.userId);
        localStorage.setItem('role', data.data.role);
        window.location.href = 'loggedIn/home.html';
      } else {
        // Si la autenticación no fue exitosa, manejar como un error
        throw new Error(data.message || 'Respuesta inesperada del servidor');
      }
    })
    .catch(error => {   // Capturar cualquier error
      console.error('Error:', error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    });
}

////////////////////////////////////////////////* Register User *///////////////////////////////////////////
function handleFormSubmitRegister() {
  // Prevenir el envío predeterminado del formulario
  event.preventDefault();

  // Obtener los valores de nombre de usuario y contraseña del formulario
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const username = usernameInput.value;
  const password = passwordInput.value;

  // Enviar la solicitud POST a la API de inicio de sesión
  fetch('http://localhost:8080/api/v1/user/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json()) // Convertir la respuesta a JSON
    .then(data => {
      if (data.message === "Username already exist") {
        alert("El usuario ya existe");
      }

      if (data.message === "User successfully created") {
        // Suponiendo que el mensaje de éxito es "Authentication Successful"
        alert("Usuario creado exitosamente");
        window.location.href = 'login.html';
      } else {
        // Si la autenticación no fue exitosa, manejar como un error
        throw new Error(data.message || 'Fallo en el registro');
      }
    })
    .catch(error => {   // Capturar cualquier error
      console.error('Error:', error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    });
}

// Agregar un event listener al formulario para capturar su envío
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', handleFormSubmit);
});

// Redirigir a otra vista 
function redirigir(destino) {
  // Cambiar la ubicación de la página
  window.location.href = 'login.html';
}

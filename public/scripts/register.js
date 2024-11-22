/*
function validateForm() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password").value;
  if (email.trim() === "") {
    alert("Por favor ingresa tu nombre de usuario.");
    return false;
  }
  if (password.trim() === "") {
    alert("Por favor ingresa tu contraseña.");
    return false;
  }
  if (password.trim() === password2) {
    alert("Las contraseñas no son identicas");
    return false;
  }

  createUser(email, password)
  window.location.href = "";

  return false;
}

function createUser() {}
*/

async function createUser(email, password) {
  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      // Guardar ID del usuario en localStorage
      localStorage.setItem('user_id', data.userId);
      alert(data.message);
      window.location.href = '/home';
    } else {
      const errorData = await response.json();
      alert(errorData.message || 'Error al registrarse.');
    }
  } catch (error) {
    console.error('Error en el registro:', error);
    alert('Error en la conexión con el servidor.');
  }
}


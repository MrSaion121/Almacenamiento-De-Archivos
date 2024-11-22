//test
console.log('JS cargado en HTML')

async function validateForm() {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Validación simple
  if (!email.trim() || !password.trim()) {
    alert("Por favor ingresa todos los campos.");
    return false;
  }

  // Crear objeto de datos para el POST
  const userData = { email: email, password: password };

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    // Verificar si la autenticación fue exitosa
    if (response.status === 200) {
      // Almacenar user_id en localStorage
      console.log('Usuario Autenticado', data.user_id);
      localStorage.setItem('user_id', data.user_id);
      console.log('Redirigiendo a /home');
      window.location.href = '/home'; // Redirigir a home.
    } else {
      alert(data.message || "Error al iniciar sesión");
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Hubo un problema con la conexión.");
  }

  return false; // Evitar el envío normal del formulario
}

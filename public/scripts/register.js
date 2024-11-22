//TEST
console.log('JavaScript corriendo en Register.js');

function validateForm() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validación de campos
  if (email.trim() === "") {
    alert("Por favor ingresa tu email.");
    return false;
  }
  if (password.trim() === "") {
    alert("Por favor ingresa tu contraseña.");
    return false;
  }
  if (password !== confirmPassword) {
    alert("Las contraseñas no son idénticas.");
    return false;
  }

  // Llamada para crear usuario en la base de datos
  createUser(email, password);
  return false; // Evita que el formulario se recargue
}

async function createUser(email, password) {
  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      // Mostrar notificación
      alert(data.message);
      // Redirigir a la página de login después del registro
      window.location.href = '/login';
    } else {
      const errorData = await response.json();
      alert(errorData.message || 'Error al registrarse.');
    }
  } catch (error) {
    console.error('Error en el registro:', error);
    alert('Error en la conexión con el servidor.');
  }
}

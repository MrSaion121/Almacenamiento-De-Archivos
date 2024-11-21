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

function validateForm() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (email.trim() === "") {
    alert("Por favor ingresa tu nombre de usuario.");
    return false;
  }
  if (password.trim() === "") {
    alert("Por favor ingresa tu contraseña.");
    return false;
  }

  //sessionStorage.setItem("username", username);

  window.location.href = "login";
  return false;
}

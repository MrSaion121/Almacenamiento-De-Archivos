document.addEventListener('DOMContentLoaded', () => {
    updateAccountButton();
    updateUserName();
});

//Actualizar el boton de cuenta base al estado del user_id
function updateAccountButton() {
    const userId = localStorage.getItem('user_id');
    const accountButton = document.getElementById('accountButton');
    const logoutMessage = document.getElementById('logoutMessage');

    if (userId) {
        accountButton.innerHTML = '<i class="fa-solid fa-user"></i>';
        accountButton.onclick = () => toggleLogoutMessage();
        logoutMessage.onclick = () => logout();
    } else {
        accountButton.textContent = 'Iniciar Sesion';
        accountButton.onclick = () => window.location.href = '/login';
    }
}

//Cerrar sesion - Mostrar / esconder
function toggleLogoutMessage() {
    const logoutMessage = document.getElementById('logoutMessage');
    logoutMessage.classList.toggle('hidden');
}

//Cerrar sesion del usuario
function logout() {
    localStorage.removeItem('user_id');
    window.location.reload();
}

//Nombre
function updateUserName() {
    const userId = localStorage.getItem('user_id');
    const userNameElement = document.getElementById('userName');

    if (userId) {
        const userName = userId.split('@')[0];
        userNameElement.textContent = userName;
    } else {
        userNameElement.textContent = 'Invitad@';
    }
}


// Función para abrir el modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// Función para cerrar el modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Función para manejar la carga de archivos (ejemplo básico)
function uploadFile() {
    const fileInput = document.getElementById('fileUpload');
    const file = fileInput.files[0];
    if (file) {
        //Example | para subir archivos
        console.log(`Subiendo archivo: ${file.name}`);
        closeModal('uploadModal');
    } else {
        alert("Por favor selecciona un archivo para subir.");
    }
}

// Función para manejar la descarga de archivos (ejemplo básico)
function downloadFiles() {
    const selectedFiles = document.querySelectorAll(".download-list input[type='checkbox']:checked");

    //Example | para descargar archivos
    if (selectedFiles.length > 0) {
        selectedFiles.forEach(fileCheckbox => {
            console.log(`Descargando archivo: ${fileCheckbox.id}`);
        });
        closeModal('downloadModal');
    } else {
        alert("Selecciona al menos un archivo para descargar.");
    }
}

function uploadFile() {
    const file = document.getElementById('fileUpload')
    //console.log(file.files[0]);
    const formData = new FormData();
    formData.append('file', file.files[0]);
    fetch(`/home/uploads`, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
        });
    closeModal('uploadModal');
}

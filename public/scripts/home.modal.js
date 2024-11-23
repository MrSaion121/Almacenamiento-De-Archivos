document.addEventListener('DOMContentLoaded', () => {
    getFiles();
    updateAccountButton();
    updateUserName();
    loadFiles(); //Carga de archivos al iniciar
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

//Funcion para obtener/mostrar los archivos desde el server
async function loadFiles() {
    const response = await fetch('/home/files');
    const files = await response.json();

    const fileListContainer = document.getElementById('fileListContainer');
    fileListContainer.innerHTML = ''; // Limpiar el contenedor

    //DOM
    files.forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.classList.add('file-list-item');
        fileElement.innerHTML = `
            <input type="checkbox" value="${file.Key}" id="file-${file.Key}">
            <label for="file-${file.Key}">${file.Key}</label>
            <span>${(file.Size / 1024).toFixed(2)} KB</span>
            <span>${new Date(file.LastModified).toLocaleDateString()}</span>
        `;
        fileListContainer.appendChild(fileElement);
    });
}

//Funcion para descargar Archivos descargados.
async function downloadFiles() {
    const selectedFiles = Array.from(document.querySelectorAll(".file-list-item input[type='checkbox']:checked"))
        .map(input => input.value); // Obtener las claves de los archivos seleccionados

    if (selectedFiles.length > 0) {
        const response = await fetch('/home/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ files: selectedFiles })
        });

        if (response.ok) {
            const downloadUrls = await response.json();
            downloadUrls.forEach(url => {
                const a = document.createElement('a');
                a.href = url;
                a.download = ''; // Asignar el nombre del archivo si es necesario
                a.click();
            });
            closeModal('downloadModal');
        } else {
            alert('Hubo un error al obtener los archivos para descargar.');
        }
    } else {
        alert("Selecciona al menos un archivo para descargar.");
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
/*
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
    */

// Función para manejar la descarga de archivos (ejemplo básico)
/*
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
*/

function uploadFile() {

    const file = document.getElementById('fileUpload');
    const userId = localStorage.getItem('user_id');

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('file', file.files[0]);

    fetch(`/home/uploads`, {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Error al subir el archivo')
            }
        })
        .then(message => {
            alert(message);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al subir el archivo.');
        });

    closeModal('uploadModal');

}

function getFiles() {
    const userId = localStorage.getItem('user_id');
    const formData = new FormData();
    formData.append('userId', userId);

    fetch(`/home/uploads/${userId}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
        });
}

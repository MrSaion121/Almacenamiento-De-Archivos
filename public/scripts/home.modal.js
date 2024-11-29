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
    const userId = localStorage.getItem('user_id');
    const response = await fetch(`/home/uploads/${userId}`);
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
    console.log(selectedFiles)
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
            const downloadLinks = downloadUrls.forEach(url => {
                const a = document.createElement('a');
                a.href = url;
                a.download = ''; // Asignar el nombre del archivo si es necesario
                a.click();
            });
            const downloadList = document.getElementById('download-list')
            downloadList.innerHTML = downloadLinks
            openModal('downloadModal');

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

function uploadFile() {

    const file = document.getElementById('fileUpload');
    const userId = localStorage.getItem('user_id');

    //Validar si esta logeado
    if (!userId) {
        alert('Inicia sesión para subir archivos.');
        return;
    }

    //Validar si selecciono un archivo
    if (!file.files[0]) {
        alert('Por favor selecciona un archivo para subir.');
        return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('file', file.files[0]);

    fetch(`/home/uploads`, {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                loadFiles();
            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al subir el archivo.');
        });

    closeModal('uploadModal');

}

//Mostrar/Obtener los archivos en front
async function getFiles() {
    const userId = localStorage.getItem('user_id');

    try {
        const response = await fetch(`/home/uploads/${userId}`);
        //Validacion
        if (!response.ok) {
            throw new Error('Error al obtener archivos.');
        }
        //Esperar los datos
        const files = await response.json();

        const fileListContainer = document.getElementById('fileListContainer');
        fileListContainer.innerHTML = '';

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
    } catch(error){
        console.error('Error Loading files:', error);
    }
}

document.addEventListener('DOMContentLoaded', getFiles);



/*
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
*/

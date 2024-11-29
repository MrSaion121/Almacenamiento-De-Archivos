document.addEventListener('DOMContentLoaded', () => {
    //getFiles();
    updateAccountButton();
    updateUserName();
    loadFiles(); //Carga de archivos al iniciar
});

let fileToDelete = null; //Definir variable global para almacenar archivo selecciondo

//default
let sortCriteria = {
    field: "LastModified",
    order: "asc"
};

// Cambiar el criterio de ordenamiento
function changeSortCriteria(field) {
    if (sortCriteria.field === field) {
        // Cambiar solo la dirección del orden
        sortCriteria.order = sortCriteria.order === "asc" ? "desc" : "asc";
    } else {
        // Cambiar el criterio y mantener ascendente por defecto
        sortCriteria.field = field;
        sortCriteria.order = "asc";
    }

    loadFiles();
}

//evento para que cambien de orden
document.getElementById('sortFileDate').addEventListener('click', () => changeSortCriteria('LastModified'));
document.getElementById('sortFileSize').addEventListener('click', () => changeSortCriteria('Size'));
document.getElementById('sortFileName').addEventListener('click', () => changeSortCriteria('Key'));


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

    //Ordenamiento
    files.sort((a, b) => {
        const aValue = a[sortCriteria.field];
        const bValue = b[sortCriteria.field];

        if (sortCriteria.field === 'LastModified') {
            // Para fechas, ordenamos como números
            return sortCriteria.order === "asc"
                ? new Date(aValue) - new Date(bValue)
                : new Date(bValue) - new Date(aValue);
        } else if (sortCriteria.field === 'Size') {
            // Para tamaños de archivo, ordenamos de menor a mayor o viceversa
            return sortCriteria.order === "asc" ? aValue - bValue : bValue - aValue;
        } else if (sortCriteria.field === 'Key') {
            // Para los nombres de archivo, ordenamos alfabéticamente
            return sortCriteria.order === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
    });

    const fileListContainer = document.getElementById('fileListContainer');
    fileListContainer.innerHTML = ''; // Limpiar el contenedor

    //DOM
    files.slice(1).forEach(file => {
        console.log(file.Key)

        const fileName = file.Key.replace(userId + '/', "")
        const fileElement = document.createElement('div');
        fileElement.classList.add('file-list-item');
        fileElement.innerHTML = `
            <input type="checkbox" value="${fileName}" id="file-${fileName}">
            <label for="file-${fileName}">${fileName}</label>
            <span>${(file.Size / 1024).toFixed(2)} KB</span>
            <span>${new Date(file.LastModified).toLocaleDateString()}</span>
            <span class="icono"><i class="fa-solid fa-trash-can" onclick="confirmDeleteModal('${fileName}')"></i></span>
        `;
        fileListContainer.appendChild(fileElement);
    });
}


//Funcion para descargar Archivos descargados.
async function downloadFiles() {
    const userId = localStorage.getItem('user_id');
    const selectedFiles = Array.from(document.querySelectorAll(".file-list-item input[type='checkbox']:checked"))
        .map(input => input.value); // Obtener las claves de los archivos seleccionados
    console.log(selectedFiles)
    if (selectedFiles.length > 0) {
        const response = await fetch('/home/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ files: selectedFiles, userId })
        });

        if (response.ok) {
            //Descargar el .zip directamente
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const disposition = response.headers.get('Content-Disposition');
            const filename = disposition
                ? disposition.split('filename=')[1].replace(/"/g, '')
                : 'file.zip';   //Nombre en caso de error

            //console.log(downloadUrls)
            const a = document.createElement('a');

            a.href = url;
            a.download = filename; // Asignar el nombre del archivo si es necesario
            a.click();

            URL.revokeObjectURL(url);
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

//Mostrar modal de confirmacion a eliminar
function confirmDeleteModal(fileName) {
    fileToDelete = fileName; // Almacena el archivo seleccionado
    openModal('confirmDeleteModal');
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

async function deleteFile() {
    const userId = localStorage.getItem('user_id');
    if (!fileToDelete || !userId) return;

    try {
        const response = await fetch(`/home/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: fileToDelete, userId }),
        });

        if (response.ok) {
            alert('Archivo eliminado correctamente');
            loadFiles();
        } else {
            const error = await response.json();
            alert(`Error al eliminar el archivo: ${error.message}`);
        }
    } catch (error) {
        console.error('Error al eliminar el archivo:', error);
        alert('Hubo un problema eliminando el archivo');
    } finally {
        closeModal('confirmDeleteModal');
    }
}

document.getElementById('confirmDeleteButton').onclick = deleteFile;
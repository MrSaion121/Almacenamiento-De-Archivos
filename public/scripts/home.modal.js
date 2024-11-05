// public/scripts/modal.js

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
        // Lógica para subir el archivo
        console.log(`Subiendo archivo: ${file.name}`);
        closeModal('uploadModal');
    } else {
        alert("Por favor selecciona un archivo para subir.");
    }
}

// Función para manejar la descarga de archivos (ejemplo básico)
function downloadFiles() {
    const selectedFiles = document.querySelectorAll(".download-list input[type='checkbox']:checked");
    if (selectedFiles.length > 0) {
        selectedFiles.forEach(fileCheckbox => {
            console.log(`Descargando archivo: ${fileCheckbox.id}`);
            // Aquí añadirías la lógica para descargar cada archivo seleccionado
        });
        closeModal('downloadModal');
    } else {
        alert("Selecciona al menos un archivo para descargar.");
    }
}

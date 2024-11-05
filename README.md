# Desarrollo en la nube
## Almacenamiento de archivos | Proyecto
---
**PRESENTADA POR:**
735318 – Santiago Oseguera
737066 - Victor Telles
738913 - Sofía López

## Introduccion
El objetivo de este proyecto es crear un sistema de almacenamiento de archivos, similar a lo que hace OneDrive, para que diferentes usuarios puedan almacenar su información en la nube y tengan acceso a esta desde sus diferentes dispositivos. Contará con un Frontend por el cual se subirán los archivos, se tendrán usuarios para tener los archivos organizados y se recibirá una notificación al subir un archivo.

## Tecnologias a utilizar
- **EC2**: Para levantar tanto el Frontend como el Backend con una arquitectura basada en microservicios. El backend tendrá que contener endpoints para cargar el endpoint y para hacer la lectura de los metadatos.
- **SQS**: Para tener una cola de procesamiento para indicar que se acaba de subir un archivo para ser procesado para después, ser movido hacia el bucket del usuario.
- **S3**: Para la gestión de los archivos y los metadatos que se puedan necesitar. Se tendrán dos buckets
- 1) Uno para los archivos temporales el cual estará recibiendo todos los archivos recién se suban
- 2) Uno para mandarlo a un bucket por usuario.
- **DynamoDB**: Para el guardado de la información de los archivos.
- **NodeJS**: Se utilizara para la creación del Backend y Frontend
- **Github**: Se usará para tener el código en un repositorio, facilitando el trabajo en equipo y mantener un control de versiones del programa
- **Postman**: Se usará para hacer pruebas en los endpoints.



# Instrucciones para ejecutar el proyecto


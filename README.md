
# Proyecto Chatbot UNI
## Integrantes del Grupo y Roles

| Nombre                | Rol                               |
|-----------------------|-----------------------------------|
| **Diego Sotelo**      | Líder del proyecto, manejo del backend y arquitectura. |
| **Marcos Hidalgo**    | Supervisor del flujo de trabajo y optimización de recursos. |
| **Cristian Mejía**    | Desarrollador principal del frontend y pruebas funcionales. |

---
## Descripción General
Este proyecto es un **chatbot inteligente** desarrollado para responder preguntas relacionadas con los procesos académicos, administrativos y servicios estudiantiles de la **Universidad Nacional de Ingeniería (UNI)**. Utiliza una arquitectura basada en **Angular** para el frontend y servicios en **AWS** para el backend, asegurando una experiencia segura, accesible y confiable para los estudiantes.

## Características Principales
- Filtro de contenido inapropiado basado en **AWS Bedrock**.
- Autenticación segura mediante **correos UNI** con **OAuth y JWT**.
- Respuestas temáticas limitadas a procesos de la UNI utilizando **OpenSearch**.
- Información oficial sobre convalidaciones, horarios, residencias y servicios estudiantiles.

---

## Despliegue del Frontend

### **Requisitos Previos**
1. **Instalar Node.js** (versión 16 o superior):  
   Descarga e instala Node.js desde [Node.js](https://nodejs.org/).
   ```bash
   node -v
   npm -v
   ```

2. **Instalar Angular CLI** globalmente:  
   ```bash
   npm install -g @angular/cli
   ng version
   ```



3. **Instalar dependencias**:  
   ```bash
   npm install
   ```





### **Ejecución Local**
1. **Inicia el servidor de desarrollo**:  
   ```bash
   ng serve
   ```

2. **Accede a la aplicación en tu navegador**:  
   ```
   http://localhost:4200
   ```

3. **Prueba las funcionalidades**:
   - Registro de usuarios con correos institucionales UNI.
   - Consultas relacionadas con procesos académicos y servicios de la UNI.

---

### **Ejecución en Producción**
1. **Genera la compilación para producción**:  
   ```bash
   ng build --prod
   ```

2. **Sube la carpeta `dist/proyecto-chatbot-uni` a un bucket S3** configurado para alojar sitios estáticos.
3. **Configura un CloudFront** para distribuir la aplicación de manera rápida y segura.

---

### **Pruebas**
1. **Ejecuta las pruebas unitarias**:  
   ```bash
   ng test
   ```

2. **Ejecuta las pruebas de integración**:  
   ```bash
   ng e2e
   ```

---

### Desplegar la WEB en AWS
Deberá crear un S3 con configuración de alojar un sitio web estático y polticas de acceso público. [link de referencia](https://www.youtube.com/watch?v=iu4Kv1MacGw)

Subir todo los archivo que se generaron en la carpeta /dist al hacer un buil del proyecto.

## Despliegue Backend


### 1. Configuración en AWS

#### a. Tablas en DynamoDB
Se deben crear las siguientes tablas en DynamoDB con la estructura indicada:

1. **USERS_TABLE**
   - Campos:
     - `email` (String) (id)
     - `username` (String)
     - `password` (String)

2. **CODES_TABLE**
   - Campos:
     - `email` (String) (id)
     - `verification_code` (String)
     - `username` (String)
     - `password` (String)
#### b. Lambdas
Se deben crear las siguientes funciones Lambda con permiso de escribir, agregar y eliminar en las dos tablas anteriores, se les asigna las funciones del backend correspodiente según su nombre.

- **lambda_authorizer**: Función encargada de la autorización del JWT.
- **lambda_login**: Función encargada de manejar el inicio de sesión.
- **lambda_register**: Función encargada de manejar el registro de usuarios.
- **lambda_chatbot**: Función encargada de procesar las interacciones del chatbot.



#### c. API Gateway
Se debe configurar un API Gateway con las siguientes rutas:

- **/login**: Asignar el Lambda correspondiente (`lambda_login`).
- **/register**: Asignar el Lambda correspondiente (`lambda_register`).
- **/bot**: Asignar el Lambda correspondiente (`lambda_chatbot`) y configurar el **lambda_authorizer** como autorizador para esta ruta.

Finalmente se habilitan los CORS a cada ruta y se despliega el api gateway.

#### d. S3
1. Crear un bucket en S3.
2. Subir el archivo **Data-UNI.txt** al bucket.

#### e. AWS Bedrock
1. Crear una Knowledge Base en **AWS Bedrock**.
2. Asignar como fuente de información el S3 que contiene el archivo **Data-UNI.txt**.
   
### 2. Configuración del código

#### a. lambda authorizer:
No ccambiar nada.
#### b. lambda login:
No cambiar nada

**Nota**: estas dos lambdas tienen una variable: JWT_SECRET = "secret" , esta variable debe tener el mismo valor en ambas lambdas.

#### c. lambda register:
En esta lambda se deben configurar estas dos variables:

- GMAIL_USER = 'josuehidalgoflores@gmail.com'
- GMAIL_PASSWORD = 'as'

Se debe usar un correo gmail quien es quien enviará los correos con código de verificación y usar una contraseña de aplicación que deberá configurar en el gmail del correo que se va a usar, [link de referencia](https://support.google.com/mail/answer/185833?hl=es-419)

#### d. lambda chatbot:
Se debe configurar la variable:  kb_id = 'GPVXM61ASJ' con el valor del id de la knowledge base que le asigno AWS al hacer el paso 1.e.

**Nota**: Asegurarse que en su cuenta de AWS tiene habilitado el modelo claude sonnet v3.5

---

**Nota:** Asegúrese de que todos los servicios tengan los roles y permisos necesarios para acceder a los recursos con lo que interactuan.



### **Licencia**

MIT


Este proyecto es de uso exclusivo para fines académicos y no debe ser utilizado sin autorización de los integrantes.

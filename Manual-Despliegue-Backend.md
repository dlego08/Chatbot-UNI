# Despliegue Backend

## Pre-requisitos

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

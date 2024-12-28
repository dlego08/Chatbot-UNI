
# Proyecto Chatbot UNI

## Descripción General
Este proyecto es un **chatbot inteligente** desarrollado para responder preguntas relacionadas con los procesos académicos, administrativos y servicios estudiantiles de la **Universidad Nacional de Ingeniería (UNI)**. Utiliza una arquitectura basada en **Angular** para el frontend y servicios en **AWS** para el backend, asegurando una experiencia segura, accesible y confiable para los estudiantes.

## Características Principales
- Filtro de contenido inapropiado basado en **AWS Bedrock**.
- Autenticación segura mediante **correos UNI** con **OAuth y JWT**.
- Respuestas temáticas limitadas a procesos de la UNI utilizando **OpenSearch**.
- Información oficial sobre convalidaciones, horarios, residencias y servicios estudiantiles.

---

## Pasos para Instalar y Ejecutar el Proyecto

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

## Integrantes del Grupo y Roles

| Nombre                | Rol                               |
|-----------------------|-----------------------------------|
| **Diego Sotelo**      | Líder del proyecto, manejo del backend y arquitectura. |
| **Marcos Hidalgo**    | Supervisor del flujo de trabajo y optimización de recursos. |
| **Cristian Mejía**    | Desarrollador principal del frontend y pruebas funcionales. |

---

### **Licencia**
Este proyecto es de uso exclusivo para fines académicos y no debe ser utilizado sin autorización de los integrantes.

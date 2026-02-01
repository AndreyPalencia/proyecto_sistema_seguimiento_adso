# Sistema de Seguimiento al Aprendiz en Etapa Productiva (SENA) - ADSO

**Repositorio:** [proyecto_sistema_seguimiento_adso](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso)

---

## Descripción

Este proyecto es un **Sistema de Información de Seguimiento al Aprendiz en Etapa Productiva del SENA**, desarrollado para facilitar la gestión, monitoreo y reporte del avance de los aprendices durante su etapa productiva. Permite a instructores, aprendices y empresas llevar un control detallado de fichas, bitácoras, agendamientos, documentos y reportes relacionados.

---

## Tecnologías Utilizadas

- **Backend:** Node.js + Express
- **Frontend:** React.js
- **Base de datos:** MySQL (ORM: Sequelize)
- **Otros:** Archiver, PDFKit, Docxtemplater, PizZip

---

## Funcionalidades Principales

- **Gestión de usuarios:** Permite el registro y control de roles (administrador, instructor, aprendiz, empresa).
- **Gestión de fichas:** Administración de fichas de formación y vinculación de aprendices.
- **Agendamientos:** Permite programar y registrar visitas o actividades de seguimiento.
- **Bitácoras:** Registro y validación de bitácoras de seguimiento de los aprendices.
- **Documentos:** Carga, descarga y generación de documentos relevantes para cada aprendiz y ficha.
- **Reportes:** Generación de reportes en PDF y Word sobre el avance y cumplimiento de los aprendices.
- **Descarga masiva:** Descarga de toda la información de aprendices de una ficha en un archivo ZIP.
- **Dashboard:** Visualización y navegación intuitiva para instructores y aprendices.
- **Control de acceso:** Seguridad mediante autenticación y autorización por roles.

---

## Estructura General del Proyecto

```
proyecto_sistema_seguimiento_adso/
├── frontend/        # Aplicación React (interfaz de usuario)
├── server/          # Backend Node.js/Express
│   ├── controllers/
│   │   ├── archivosGenerados/
│   │   └── reportesGFPIF/
│   ├── models/      # Definición de modelos Sequelize
│   ├── routes/      # Definición de rutas API
│   └── utils/       # Utilidades (archivos, reportes, etc)
├── wiki_imagenes/   # Imágenes para documentación o Wiki
└── README.md
```

---

## Instalación y Uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso.git
cd proyecto_sistema_seguimiento_adso
```

### 2. Backend

- Instalar dependencias:
  ```bash
  cd server
  npm install
  ```
- Configurar variables de entorno (`.env`) para la conexión a la base de datos MySQL.
- Iniciar el servidor:
  ```bash
  npm start
  ```

### 3. Frontend

- Instalar dependencias:
  ```bash
  cd frontend
  npm install
  ```
- Iniciar la aplicación:
  ```bash
  npm start
  ```

### 4. Acceso

Accede a la aplicación desde el navegador en la dirección que indique el frontend (generalmente `http://localhost:3000`).

---

## Contribución

1. Haz un fork del repositorio.
2. Crea una rama para tu feature o fix: `git checkout -b mi-feature`
3. Realiza tus cambios y commitea: `git commit -am 'Agrega nueva funcionalidad'`
4. Haz push a tu rama: `git push origin mi-feature`
5. Abre un Pull Request.

---

## Estado del Proyecto

> **En desarrollo:** Algunas funcionalidades pueden estar sujetas a cambios.

---

## Documentación
La documentación detallada de este proyecto está disponible en GitHub Wiki, e incluye:
- Objetivos y alcance del proyecto
- Arquitectura del sistema
- Funciones de los usuarios y flujos de trabajo
- Detalles de instalación y configuración

Acceda a la documentación completa aquí:
👉 [Wiki Sistema de Seguimiento al Aprendiz en Etapa Pracatica](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso/wiki/Bienvenido-a-la-Wiki-del-Proyecto-Sistema-de-Seguimiento-al-Aprendiz-en-Etapa-Practica)

---

## Contacto

Para dudas, sugerencias o soporte: [AndreyPalencia](https://github.com/AndreyPalencia), [GianFranco](https://github.com/francolondo), [Julian](https://github.com/JulyGuz59), [SamuelJaramillo
](https://github.com/SAMIZEINS).

---

## Licencia

Este proyecto no tiene una licencia específica por el momento.

---

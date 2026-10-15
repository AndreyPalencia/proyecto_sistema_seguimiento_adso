# Sistema de Seguimiento al Aprendiz en Etapa Productiva (SENA) - ADSO

**Repositorio:** [proyecto_sistema_seguimiento_adso](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso)

---

## Descripción

Este proyecto es un **Sistema de Información de Seguimiento al Aprendiz en Etapa Productiva del SENA**, desarrollado para facilitar la gestión, monitoreo y reporte del avance de los aprendices durante su etapa productiva. Permite a instructores, aprendices y empresas llevar un control detallado de fichas, bitácoras, agendamientos, documentos y reportes relacionados.

---

## Tecnologías Utilizadas

- **Backend:** Node.js, Express, Sequelize (ORM), Socket.IO (tiempo real), JWT y bcryptjs (autenticación), Nodemailer (correos), Multer (carga de archivos)
- **Frontend:** React 19 con Vite, Material UI, React Router, React Hook Form + Zod (formularios y validación), FullCalendar (agendamiento), Axios, Socket.IO Client
- **Base de datos:** MySQL
- **Reportes y archivos:** PDFKit (PDF), Docxtemplater + PizZip (Word), Archiver (ZIP)
- **Seguridad:** JWT, bcryptjs, DOMPurify, CORS

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

> **Versión estable (v1.0).** Las funcionalidades principales están completas y operativas.
>
> ***Documentación esta completa:***. Ya están disponibles los manueales instalación y despliegue, manual técnico, análisis y diseño. Solo falta terminar los **manuales de uso para el usuario final**, que se están completando en el pagina web [DocumentaciónSAEP](https://doc-proyecto-saep.vercel.app/). 


---

## Documentación

La documentación completa está en la [Wiki del proyecto](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso/wiki/Bienvenido-a-la-Wiki-del-Proyecto-Sistema-de-Seguimiento-al-Aprendiz-en-Etapa-Practica).

**Guías técnicas**
- [Manual de Instalación o Despliegue](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso/wiki/Manual-de-Instalaci%C3%B3n-o-Despliegue) (incluye la configuración de variables de entorno)
- [Manual Técnico](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso/wiki/Manual-T%C3%A9cnico) (flujo general del sistema)

**Análisis y diseño**
- [Requerimientos Funcionales y No Funcionales](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso/wiki/Requerimientos-Funcionales-y-Requerimientos-No-Funcionales)
- [Diagramas de Caso de uso, Clase y Objetos y Actividades](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso/wiki/Diagramas-de-Caso-de-uso,-Clase-y-Objetos-y-Actividades)
- [Diagramas de Distribución, Componentes y Aplicaciones distribuidas](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso/wiki/Diagramas-de-Distribuci%C3%B3n,-Componentes-y-Aplicaciones-distribuidad)
- [Mockups](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso/wiki/Mockups)

**Gestión del proyecto**
- [Mapa de Procesos y Ficha de Procesos](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso/wiki/Mapa-de-Procesos-y-Ficha-de-Procesos)
- [Metodología tradicional](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso/wiki/Metodolog%C3%ADa-tradicional)
- [Stakeholders](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso/wiki/Stakeholders)
- [Técnicas de recolección](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso/wiki/T%C3%A9cnicas-de-recolecci%C3%B3n)

---

Acceda a la documentación completa aquí:
👉 [Wiki Sistema de Seguimiento al Aprendiz en Etapa Practica](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso/wiki/Bienvenido-a-la-Wiki-del-Proyecto-Sistema-de-Seguimiento-al-Aprendiz-en-Etapa-Practica)

---

## Equipo

Proyecto de fin de carrera del Tecnólogo en Análisis y Desarrollo de Software (SENA), desarrollado en equipo.

| Integrante | GitHub | Rol | Aporte |
| --- | --- | --- | --- |
| Johan Andrey Palencia | [AndreyPalencia](https://github.com/AndreyPalencia) | Líder del equipo · Backend e integración | Modelos y normalización con Sequelize; módulos y endpoints del backend; middlewares y validación de datos previa a cada endpoint; esquemas de validación con Zod; componentes de formulario reutilizables; conexión frontend–backend con Axios; notificaciones con WebSockets. |
| Gian Franco | [francolondo](https://github.com/francolondo) | Frontend · Backend | Modales del frontend (inicio de sesión, pantalla de carga, errores, observaciones, perfil, notificaciones); módulo de reportes del backend. |
| Samuel Jaramillo | [SAMIZEINS](https://github.com/SAMIZEINS) | Frontend · Backend | Módulo de calendario y agendamiento de citas; lógica de backend del agendamiento. |
| Julian  | [JulyGuz59](https://github.com/JulyGuz59) | Frontend · Backend | Componente de tablas del frontend; dos módulos de endpoints con su lógica de negocio. |

¿Dudas, sugerencias o errores? Abre un [Issue](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso/issues).

---

## Licencia

© 2025 Johan Andrey Palencia Ramírez, Gian Franco, Samuel Jaramillo, Julian. Todos los derechos reservados.

El código se publica con fines de portafolio y consulta. Para reutilizarlo o distribuirlo, contacta a los autores abriendo un [Issue](https://github.com/AndreyPalencia/proyecto_sistema_seguimiento_adso/issues).
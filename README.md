#  EcoHome 360
### Aplicación web para la gestión y clasificación de residuos reciclables

![Estado](https://img.shields.io/badge/Estado-En%20desarrollo-green)
![Node](https://img.shields.io/badge/Node.js-v16+-339933?logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-XAMPP-4479A1?logo=mysql&logoColor=white)
![License](https://img.shields.io/badge/Licencia-MIT-blue)

---

##  Descripción

**EcoHome 360** es una plataforma web desarrollada como evidencia del programa de **Análisis y Desarrollo de Software del SENA** (Ficha 3336037). Permite a los ciudadanos de Antioquia, Colombia, gestionar y registrar sus residuos reciclables, ubicar centros de acopio cercanos y visualizar su impacto ambiental mediante estadísticas en tiempo real.

---

##  Estructura del proyecto

```
Aplicativo_Web_Ecohome/
├── index.html                  # Página principal
├── html/                       # Páginas internas
│   ├── login.html              # Inicio de sesión
│   ├── registro_user.html      # Registro de usuario
│   ├── registro_materiales.html# Registro de residuos
│   ├── perfil.html             # Perfil del usuario
│   ├── estadisticas.html       # Dashboard de estadísticas
│   ├── centros.html            # Mapa de centros de acopio
│   ├── clasificacion.html      # Guía de clasificación
│   ├── nosotros.html           # Acerca de nosotros
│   └── terminos.html           # Términos y condiciones
├── css/
│   └── style.css               # Estilos globales
├── JS/
│   ├── auth.js                 # Autenticación (login/registro)
│   ├── residuos.js             # Registro de materiales
│   ├── perfil.js               # Gestión del perfil
│   ├── estadisticas.js         # Gráficas con Chart.js
│   ├── navbar.js               # Menú hamburguesa
│   └── proteger.js             # Protección de rutas privadas
├── multimedia/                 # Imágenes y recursos
├── backend/
│   ├── server.js               # Servidor Express
│   ├── config/
│   │   └── db.js               # Conexión a MySQL
│   ├── routes/
│   │   ├── auth.js             # CRUD usuarios + login
│   │   ├── residuos.js         # CRUD residuos
│   │   └── estadisticas.js     # Endpoints de estadísticas
│   ├── .env.example            # Plantilla de variables de entorno
│   └── package.json
├── ecohome360.sql              # Script de la base de datos
├── prueba.http                 # Pruebas de la API con REST Client
├── .gitignore
└── README.md
```

---

##  Tecnologías utilizadas

### Frontend
| Tecnología | Uso |
|---|---|
| HTML5 | Estructura de las páginas |
| CSS3 | Estilos y diseño responsivo |
| JavaScript ES6+ | Lógica del cliente y consumo de API |
| Leaflet.js | Mapa interactivo de centros de acopio |
| Chart.js | Gráficas de estadísticas |

### Backend
| Tecnología | Uso |
|---|---|
| Node.js | Entorno de ejecución del servidor |
| Express.js | Framework para la API REST |
| MySQL2 | Conexión a la base de datos |
| bcryptjs | Cifrado de contraseñas |
| jsonwebtoken | Autenticación con JWT |
| dotenv | Variables de entorno |
| cors | Permitir peticiones del frontend |

---

##  Endpoints de la API

### Usuarios `/api/auth`
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/auth/usuarios` | Listar todos los usuarios |  JWT |
| GET | `/api/auth/usuarios/:id` | Ver un usuario |  JWT |
| POST | `/api/auth/register` | Registrar usuario |  |
| POST | `/api/auth/login` | Iniciar sesión |  |
| PUT | `/api/auth/usuarios/:id` | Actualizar usuario |  JWT |
| DELETE | `/api/auth/usuarios/:id` | Eliminar usuario |  JWT |

### Residuos `/api/residuos`
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/residuos` | Listar todos los registros |  JWT |
| GET | `/api/residuos/:id` | Ver un registro |  JWT |
| POST | `/api/residuos` | Crear registro |  JWT |
| PUT | `/api/residuos/:id` | Actualizar registro |  JWT |
| DELETE | `/api/residuos/:id` | Eliminar registro |  JWT |

### Estadísticas `/api/estadisticas`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/estadisticas/resumen` | Totales generales |
| GET | `/api/estadisticas/por-tipo` | Distribución por tipo de residuo |
| GET | `/api/estadisticas/por-mes` | Evolución mensual |
| GET | `/api/estadisticas/usuario/:id` | Estadísticas personales |

---

##  Instalación y configuración local

### Requisitos previos
- [Node.js](https://nodejs.org) v16 o superior
- [MySQL Workbench](https://www.mysql.com/products/workbench/) con el servidor MySQL activo
- [Visual Studio Code](https://code.visualstudio.com)
- Extensión **Live Server** de VS Code
- Extensión **REST Client** de VS Code (para pruebas)

### 1. Clona el repositorio
```bash
git clone https://github.com/datoro1987/Aplicativo_Web_Ecohome.git
cd Aplicativo_Web_Ecohome
```

### 2. Configura la base de datos
- Abre MySQL Workbench y conéctate a tu servidor local
- En el menú superior ve a **Server → Data Import**
- Selecciona **Import from Self-Contained File**
- Busca el archivo `ecohome360.sql` de la raíz del proyecto
- Clic en **Start Import**

### 3. Configura el backend
```bash
cd backend
npm install
```

Copia el archivo de ejemplo y edita tus datos:
```bash
cp .env.example .env
```

Edita `.env` con tus datos:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ecohome360
JWT_SECRET=ecohome360_super_secret_key_2026
```

### 4. Inicia el servidor
```bash
node server.js
```

Debes ver:
```
Servidor corriendo en http://localhost:3000
Conexión a MySQL exitosa - Base de datos: ecohome360
```

### 5. Abre el frontend
En VS Code, clic derecho sobre `index.html` → **Open with Live Server**

---

##  Pruebas de la API

El archivo `prueba.http` contiene todas las pruebas de los endpoints. Para usarlo:

1. Instala la extensión **REST Client** en VS Code
2. Abre el archivo `prueba.http`
3. Ejecuta primero **Registrar usuario** y luego **Iniciar sesión**
4. Copia el token de la respuesta y pégalo en la variable `@token`
5. Ejecuta el resto de peticiones con **Send Request**

---

##  Base de datos

El script `ecohome360.sql` crea automáticamente:

- Tabla `usuarios` — gestión de cuentas con contraseña cifrada
- Tabla `registros_residuos` — historial de materiales reciclados por usuario

---

##  Funcionalidades principales

-  Registro e inicio de sesión con JWT
-  Clasificación interactiva de residuos con acordeón
-  Registro de materiales reciclables con cantidad y fecha
-  Mapa interactivo de centros de acopio con Leaflet.js
-  Dashboard de estadísticas con Chart.js
-  Perfil de usuario con historial personal
-  Diseño responsivo para móvil, tablet y escritorio
-  API REST completa con operaciones CRUD
-  Protección de rutas privadas

---

##  Autor

**Daniel Toro**
- GitHub: [@datoro1987](https://github.com/datoro1987)
- SENA — Análisis y Desarrollo de Software
- Ficha: 3336

---

##  Evidencias SENA

| Evidencia | Descripción |

| GA4-220501096-AA1-EV02 | Aplicación web funcional |


---

*© 2026 EcoHome 360 — Juntos construimos un Antioquia más limpio y sostenible* 
# 🎉 Claulet-APP

Aplicación Web Desarrollada con **Node.js**, **Express** y **EJS**, esta app permite registrar eventos, crear vistas dinámicas y almacenar los datos utilizando Sequalize. 

---
## 🎢 Estructura de la app
```bash

Claulet/
├── index.js 
├── config/ 
│   └── db.js                                  
├── routes/
│   ├── admin.Routes.js
│   ├── anfitrion.Routes.js
│   ├── escaner.Routes.js
│   ├── organizador.Routes.js
│   └── usuario.Routes.js
├── controllers/
│   ├── admin.Controller.js
│   ├── eventos.Controller.js
│   ├── invitados.Controller.js
│   └── usuario.Controller.js
├── models/
│   ├── Eventos.js
│   ├── Invitados.js
│   ├── Plantillas.js
│   ├── Relaciones.js
│   └── Usuarios.js
├── middleware/
│   └── upload.js
├── views/                      
│   ├── admin/
│   │   └── administrador.ejs
│   ├── anfitrion/
│   │   └── host.ejs
│   ├── auth/
│   │   └── login.ejs
│   ├── escaner/
│   │   └── scanner.ejs
│   └── organizador/
│       └── organizador.ejs
├── public/
│   ├── uploads/...
│   ├── adminPublic.js
│   └── usuarioSesion.js
├── uploads/
├── helpers/
│   └── token.js
└── package-lock.json
└── package.json
└── README.md
```
---
## ⚙️ Tecnologías usadas

- Node.js
- Express.js
- EJS (plantillas del lado del servidor)
- Axios (peticiones desde el cliente)
- Bootstrap (estilos)
- File System (`fs`) para manipular JSON
- json web token
- sequalize
- xlsx
- multer
- dotenv
- nodemon

---
## funcionalidades realizadas hasta el momento 🐱‍🏍

- Creación de modelos Eventos, Invitados, Plantillas, Usuarios, respectivas Relaciones .
- Crud completo de Eventos, Invitados, Usuarios.
- Autenticación de usuarios.
- Creacion de vistas con sus respectivas rutas. (Admin, anfitrion, login, escaner y organizador)
- Creacion de codigo qr para cada invitado.
- Renderizado en de vista admin y tarjetas de totales en la base de datos.
- Importacion de invitados desde archivos excel. 
---

## 🛠️ Instalación

1. Clona el repositorio

```bash
git clone https://github.com/HubCde/twoClaulet
cd claulet
```

2. Instala las dependencias:

```
npm install
```

3. Inicia el servidor.

```
npm run server.js

```

4. Abre en tu navegador.

```
http://localhost:3000/claulet/admin

```

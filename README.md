# core-scripts

<img src="./public/icon.png" alt="title" width="20%">

<h2 id="description">Description π</h2>

Una coleccion de scripts, para complementar procesos en toda aplicacion.

<h2 id="nav">Navπ  </h2>

* [Instalation π](#instalation)
* [Docs π](https://rick-torrellas.github.io/core-scripts/)
* [Usage π°](#usage)
* [Requirements β οΈ](#requirements)
* [Environment variables π](#environment-variables)
* [Dependencies π](#dependencies)
* [Implement with Docker π](#docker)
* [Screenshots πΌοΈ](#screenshots)
* [Authors πͺ](#authors)
* [License π](#license)
* Kanbas</br>
<a href="./kanbas.md" title="kanbas"><img width="5%" src="https://res.cloudinary.com/rick-rick-torrellas/image/upload/v1629301660/icons/kanban_oifhu7.png"/></a>

***

<h2 id="instalation">Instalation π</h2>

[π ](#nav "Back home")

```javascript
npm i @core_/scripts
```
<h2 id="usage">Usage π°</h2>

[π ](#nav "Back home")

Para empezar a usar la herramienta, en el directorio de tu proyecto, usa:

```npm
npx core-scripts
```

## Comandos

* init: Inicia los elemtentos de la app

## Comandos NPM

* nucleo:d - Descarga el nucleo de mega
* nucleo:u - Carga el nucleo a mega
* mongol:u - Carga la base de datos mongo local
* mongol:d - Descarga la base de datos mongo local
* mongoe:u - Carga la base de datos mongo externa
* mongoe:d - Descarga la base de datos mongo externa

<h2 id="requirements">Requirements β οΈ</h2>

* Para pasar las variables de entorno se necesita una archivo llamado: **.env.core** y este archivo necesita ser ignorado en .gitignore. **NOTA**: si se quiere mas seguridad a la hora de usar la contrasena, eliminarla del uri, y colocarla manualmente cuando lo pida.
* Se necesita el modulo [**env-cmd**](https://www.npmjs.com/package/env-cmd)
* Se tiene que tener instalado **megatools**, para alguno de los comandos

[π ](#nav "Back home")

<h2 id="docker">Implement with Docker π</h2>

[π ](#nav "Back home")


<h2 id="dependencies">Dependencies π</h2>

[π ](#nav "Back home")

<h2 id="#environment-variables">Environment variables π</h2>

[π ](#nav "Back home")

```dotenv
MEGA_MAIL_A - Correo de mega
MEGA_PASS_A - Contrasena de mega
MONGO_USER - Usuario de mongo
MONGO_PASSWORD - Contrasena de mongo
MONGO_URI_DOWNLOAD - Ruta de coneccion de mongo para descargar la base de datos
MONGO_URI_UPLOAD - Ruta de coneccion mongo para cargar la base de datos
DEBUG - Para activar el modo debug (default false)
```

<h2 id="screenshots">Screenshots πΌοΈ</h2>

[π ](#nav "Back home")

<h2 id="license">License π</h2>

[π ](#nav "Back home")

[MIT](./LICENSE)

<h2 id="authors">Authors πͺ</h2>

[π ](#nav "Back home")

* Ricardo Torrellas

<img src="https://res.cloudinary.com/rick-rick-torrellas/image/upload/v1632064143/icons/pill_sakm1z.svg" alt="template" width="3%">

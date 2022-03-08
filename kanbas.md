# KANBAS

<img width="5%" src="https://res.cloudinary.com/rick-rick-torrellas/image/upload/v1629301660/icons/kanban_oifhu7.png"/>

[README 📄](./README.md "README")

* [TODO](#todo)
* [DOING](#doing)
* [DONE](#done)
* [FIX](#fix)
* [backlog](#backlog)
* [sources](#sources)

## TODO

[menu](#kanbas)

* crear una opcion en las funciones sobre todo de los servicios, que sea check, que habilite o desabilite el chekeo de los componentes para el buen funcionamiento de la funcion. asi no se tendra que chekear dos veces la funcion, sobre todo las que tienen funciones dentro.
* Crear un comando para mostrarte los comandos npm
* Crear un proceso, que cree un log, este log sera un archivo de texto, que estara dentro de la carpeta nucleo, y tendra el resultado de cada proceso usado con los scripts, tanto errores, como operaciones realizadas, tambien incluira la fecha en que se realizo la tarea.
* Para que el debuger sea mas facil de ejecutar, en vez de usar condicionales a cada rato, pasar el valor del debuger como un parametro y condicionarlo directamente en las funciones del debuger.
  * ejemplo: debug.info(debug,code);
* Crear base de datos llamado core, con tablas users,nucleo, de manera que se pueda guardar, los nucleos de las diferentes aplicaciones, y que esten relacionados a los users, para saber los datos relacionales de cada app, por ejuemplo en que cuentas de mega, estan guardadas ciertas apps, y que esten vinculadas a ciertos usiarios'. Asi se puede usar por varias personas con privacidad.
* Crear un commando que verifique, si se tiene los componentes instalados con el init.
* Crear un archivo de configuracion, core.config.json, para poder configurar la herramienta que haga ciertas cosas por defecto, por ejemplo en vez de ineyctar scripts cmd al comienzo que los haga con bash. Este archivo debe ser opcional. De echo no debe estar agregado en el comando init, para evitar saturar la raiz del proyecto.
* Crear un comando delete, que desase todo lo creado por el commando init. no elimina el package.json, pero si elimina los scripts. Osea para resumir, elimina todo rastro del core en el proyecto.
* Crear el comando reset, que viene siendo la fucion de delete mas init.

## DOING

[menu](#kanbas)

## backlog

[menu](#kanbas)

## DONE

[menu](#kanbas)

## FIX

* el orden de ejucion esta muy loco, hay algunas funciones aynscornas, tenemos que eliminarlas, para que todo se ejecute en cascada.
[menu](#kanbas)

## sources

[menu](#kanbas)

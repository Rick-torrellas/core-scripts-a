/**
 * Esta funcion se encarga de crear una nueva propiedad scripts, en caso de que no exista en el package.json y inyectar los scripts.
 * 
 * ? no es mejor transformar esta funcion que agrege cualquier objeto en el package.json?
 * @param {{
    debug: boolean
    data: any
    Package: string
 * }}
* debug - Para activar el modo debug.
* @param data - El package.json que se esta editando.
* @param Package - La ruta del package.json que se esta editando.
* @return Retorna el pacjage.json que se esta editando. 
 */
//TODO: crear una estancia de la funcion, donde no le entreguen solo la data, y el tengo que hacer el proceso completo, para editar el json.
function createProperties({Debug,data,Package},callback) {
    const NAME_ = 'createProperties';
    if (debug) name(NAME_,'service');
    data.scripts = {}
    const complete = JSON.stringify(data,null,2);
    writeFile(Package,complete,(err) => {
        if (err) {
        error('Error al crear el objeto script');
    throw err;
        }
        console.log('objeto script creado');
        callback();
    });
    if (debug) done(NAME_);
}
/**
 * Verifica si existe el package.json
 * 
 * ? no seria mejor que esta fuere una funcion para verificar archivos en si. para un servicio aparte llamado files.
* @param {{
    debug: boolean
    Package: string
 * }}
* debug - Para activar el modo debug.
* @param Package - La ruta del package.json que se esta editando.
 */
//TODO: falta por terminar.
function verifyPackage({debug,Package}) {
    const NAME_ = 'verifyNucleo';
    if(debug)debug.name(NAME_,'sub-service');
    const arg = {
        Package
    }
    if(debug)values(arg);
    
    }
/**
 * Inyectara los scripts, al package.json.
 * 
 * ? esta funcion podria resultilizarse, si se enfoca en agregar cualquier tipo de porpiedades a un objeto, puede pertenencer al serivicio json_, y e podria llamar addProperties
 * @param {{
    debug: boolean
    data: any
    scripts: string[]
    Package: string
 * }}
 * debug - Para activar el modo debug
* @param scripts - Los scripts para ser inyectados en el package.json
 * @param data - Contiene el package.json abierto y parseado.
 * @param Package - La ruta del package.json que se editara.
 * @return {void}
 */
function addObjects({debug,data,scripts,Package},callback) {
    const NAME_ = 'addObjects';
    if (debug) name(NAME_,'service');
    const object = scripts;
for (const key in object) {
    if (object.hasOwnProperty.call(object, key)) {
        const values = object[key];
        data.scripts[key] = values;
    }
}
    const complete = JSON.stringify(data,null,2);
    writeFile(Package,complete,(err) => {
        if (err) {
        error('Error al modificar el package.json');
    throw err;
        }
        console.log('package.json modificado!');
        callback();
    });
    if (debug) done(NAME_);
}
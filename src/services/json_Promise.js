const debug = require('./debug');
/**
 * 
 * 
 * ? esta funcion se podria reusar, si se enfoca en vacias cualquier propiedad de un json, se llamaria emptyObject y perteneceria al serivicio json.
 * @param {{
    debug: boolean
    data: any
    Package: string
 * }}
 * debug - Para activar el modo debug.
 * @param data - El package.json que se esta editando.
 * @param Package - La ruta del package.json que se esta editando.
 * @return 
 */
//TODO: crear una estancia de la funcion, donde no le entreguen solo la data, y el tengo que hacer el proceso completo, para leer el jason.
//TODO: dividir esta funcion en dos, una parte que verifique si existe detrminada propiedad y otra que la cree vacia.
function emptyObject(Debug,{data,Package,read,property}){
    const NAME_ = "emptyObject";
    debug.name(Debug,NAME_,'sub-services');
    return new Promise((resolve,reject) => {
        if (data[property] !== undefined && data.hasOwnProperty(property)) {
            data.dependencies = {};
            const complete = JSON.stringify(data,null,2);
            writeFile(Package,complete,(err) => {
                if (err) {
        return reject(`Error al modificar el package.json \n ${err}`);
            }
            debug.info('Dependencias eliminadas');
            const response = {
                data,
                Package
            }
            debug.done(Debug,NAME_);
            resolve(response);
            });
            } else{
                return reject(`Ya existe la propiedad ${property}`);
            }
    })
    }
/**
 * Lee un archivo.json y verifica si tiene una propiedad.
* @param {{
    Debug: boolean
    file: string
 * }}
 * debug - Para activar el modo debug.
* @param data - El package.json que se esta editando.
* @return {Promise<boolean>} Retorna `true` si existe la propiedad y `false` en caso de que no.
 */
//TODO: tambien se podria crear una funcion donde verifique un conjunto de propiedades con un loop.
//TODO: verificar si se puede verificar propiedades internas propiedad.propiedadinterna y si no crear una propiedad especial para eso.
function checkProperty({Debug,file}) {
    const NAME_ = 'checkProperty';
    if (debug) name(NAME_,'subservice');
        if (data.scripts == undefined && !data.hasOwnProperty('scripts')) {
            warning('No existe la propiedad scripts');
            if(debug)done(NAME_);
            return false;
        } else {
            info('Existe la propiedad scripts');
            if(debug)done(NAME_);
            return true;
        }
        
}
/**
 * 
* @param {{
    debug: boolean
    data: any
    scripts: string[]
    Package: string
 * }}
 * debug - Para activar el modo debug.
* @param data - El package.json que se esta editando.
* @return {void}
 */
//TODO: crear una estancia de la funcion, donde no le entreguen solo la data, y el tengo que hacer el proceso completo, para leer el jason.
function checkOpenProperty({Debug,data,read,}) {
    const NAME_ = 'checkProperty';
    if (debug) name(NAME_,'subservice');
        if (data.scripts == undefined && !data.hasOwnProperty('scripts')) {
            warning('No existe la propiedad scripts');
            if(debug)done(NAME_);
            return false;
        } else {
            info('Existe la propiedad scripts');
            if(debug)done(NAME_);
            return true;
        }
        
}
//TODO: crer una funcion que anadir el primer {} a un archivo json vacio.
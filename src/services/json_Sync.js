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
function createProperties({ Debug, data, Package }, callback) {
  const NAME_ = "createProperties";
    debug.name(NAME_, "service");
  data.scripts = {};
  const complete = JSON.stringify(data, null, 2);
  writeFile(Package, complete, (err) => {
    if (err) {
      error("Error al crear el objeto script");
      throw err;
    }
    console.log("objeto script creado");
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
function verifyPackage({ debug, Package }) {
  const NAME_ = "verifyNucleo";
  if (debug) debug.name(NAME_, "sub-service");
  const arg = {
    Package,
  };
  if (debug) values(arg);
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
function addObjects({ debug, data, scripts, Package }, callback) {
  const NAME_ = "addObjects";
  if (debug) name(NAME_, "service");
  const object = scripts;
  for (const key in object) {
    if (object.hasOwnProperty.call(object, key)) {
      const values = object[key];
      data.scripts[key] = values;
    }
  }
  const complete = JSON.stringify(data, null, 2);
  writeFile(Package, complete, (err) => {
    if (err) {
      error("Error al modificar el package.json");
      throw err;
    }
    console.log("package.json modificado!");
    callback();
  });
  if (debug) done(NAME_);
}
/**
 * Verificara si existe una porpiedad en un archivo json.
 *
 * Nota: tienes que pasarle el archivo ya abierto.
 * @param {{object } data}- El archivo json ya abierto.
 * @param {{string}} properties La propiedad o la ruta hacia la propiedad.
 * @returns {boolean} Retorna `true` si existe la propiedad, `false` si no existe.
 * @example `checkProperty(data,'valor')` verifica si existe `valor` o   `checkProperty(data,'valora.valorb.valorc')` verifica si existe `valorc`
 */
function checkProperty({ data, properties, check = true }) {
  if (data === undefined) throw new Error("data esta indefinido");
  if (properties === undefined) throw new Error("properties esta indefinido");
  if (check) {
    if (
      typeof data !== "object" ||
      data === null ||
      typeof data == "function" ||
      Array.isArray(data)
    )
      throw new Error(
        `data nada mas puede ser un objeto, data es: ${typeof data}`
      );
    if (!isNaN(properties) || typeof properties !== "string")
      throw new Error(
        `properties nada mas puede ser una string, properties es: ${typeof properties}`
      );
  }
  //TODO: properties tambien debria aceptar numeros, :D tratar de que acepte solo strings y numeros.
  if (properties.indexOf(".") == -1) {
    if (data[properties] !== undefined && data.hasOwnProperty(properties)) {
      return true;
    } else {
      return false;
    }
  } else {
    let arrProps = properties.split(".");
    let lastProp = arrProps[arrProps.length - 1];
    arrProps.pop();
    if (lastProp.indexOf("[") !== -1) {
      let lastProp_ = lastProp.split("[");
      let lastProp_a = lastProp_[0];
      let lastProp_b = lastProp_[lastProp_.length - 1];
      lastProp_b = lastProp_b.replace("]", "");
      lastProp = lastProp_b;
      arrProps.push(lastProp_a);
      let props = arrProps.join(".");
      let condition_a = eval(`data.${properties}`);
      let condition_b = eval(`data.${props}`);
      if (condition_a !== undefined && condition_b.hasOwnProperty(lastProp)) {
        return true;
      } else {
        return false;
      }
    } else {
      let noLast = arrProps.join(".");
      let condition_a = eval(`data.${properties}`);
      let condition_b = eval(`data.${noLast}`);
      if (condition_a !== undefined && condition_b.hasOwnProperty(lastProp)) {
        return true;
      } else {
        return false;
      }
    }
  }
}
/**
 * Verificara si existe una porpiedad en un archivo json.
 * @param {{object } file}- El archivo json.
 * @param {{string}} properties La propiedad o la ruta hacia la propiedad.
 * @returns {boolean} Retorna `true` si existe la propiedad, `false` si no existe.
 * @example `checkProperty('./archivo.json','valor')` verifica si existe `valor` o   `checkProperty('./archivo.json','valora.valorb.valorc')` verifica si existe `valorc`
 */
function checkPropertyOpen({ file, properties }) {
  if (file === undefined) throw new Error("file esta indefinido");
  if (properties === undefined) throw new Error("properties esta indefinido");
  if (typeof file !== "string")
    throw new Error(
      `file nada mas puede ser una string, file es: ${typeof file}`
    );
  const read = readFileSync(file, "utf-8");
  const data = JSON.parse(read);
  if (check) {
    if (!isNaN(properties) || typeof properties !== "string")
      throw new Error(
        `properties nada mas puede ser una string, properties es: ${typeof properties}`
      );
    if (!read) throw new Error(`El archivo json esta vacio`);
  }
  //TODO: properties tambien debria aceptar numeros, :D tratar de que acepte solo strings y numeros.
  if (properties.indexOf(".") == -1) {
    if (data[properties] !== undefined && data.hasOwnProperty(properties)) {
      return true;
    } else {
      return false;
    }
  } else {
    let arrProps = properties.split(".");
    let lastProp = arrProps[arrProps.length - 1];
    arrProps.pop();
    if (lastProp.indexOf("[") !== -1) {
      let lastProp_ = lastProp.split("[");
      let lastProp_a = lastProp_[0];
      let lastProp_b = lastProp_[lastProp_.length - 1];
      lastProp_b = lastProp_b.replace("]", "");
      lastProp = lastProp_b;
      arrProps.push(lastProp_a);
      let props = arrProps.join(".");
      let condition_a = eval(`data.${properties}`);
      let condition_b = eval(`data.${props}`);
      if (condition_a !== undefined && condition_b.hasOwnProperty(lastProp)) {
        return true;
      } else {
        return false;
      }
    } else {
      let noLast = arrProps.join(".");
      let condition_a = eval(`data.${properties}`);
      let condition_b = eval(`data.${noLast}`);
      if (condition_a !== undefined && condition_b.hasOwnProperty(lastProp)) {
        return true;
      } else {
        return false;
      }
    }
  }
}
/**
 * Verfica el tipo de valor de la propiedad.
 *
 * Nota: debes pasarle el json ya abierto a la funcion.
 * @param {*} file - El archivo json.
 * @param {*} properties - La propiedad o propiedad para verificar su tipo.
 * @returns Regresa el tipo de propiedad a evaluar.
 * @example `checkPropertyType(data,'valor')` verifica el tipo `valor` o   `checkPropertyType(data,'valora.valorb.valorc')` verifica el tipo  `valorc`
 */
function checkPropertyType({ data, properties, check = true }) {
  //TODO: sacar una vercion de esta propiedad, pero para todas las propiedades.
  if (data === undefined) throw new Error("data esta indefinido");
  if (properties === undefined) throw new Error("properties esta indefinido");
  if (check) {
    if (
      typeof data !== "object" ||
      data === null ||
      typeof data == "function" ||
      Array.isArray(data)
    )
      throw new Error(
        `data nada mas puede ser un objeto, data es: ${typeof data}`
      );
    if (!isNaN(properties) || typeof properties !== "string")
      throw new Error(
        `properties nada mas puede ser una string, properties es: ${typeof properties}`
      );
    if (!checkProperty({ data, properties, check: false }))
      throw new Error(`La propiedad ${properties} es indefinida`);
  }
  //TODO: hacer la verificacion a las propiedades del json. pero para que sea mucho mas eficiente es mejor que verifique todas las propiedades, para ver cual o cuales son indefinidos. :D
  //TODO: properties tambien debria aceptar numeros, :D tratar de que acepte solo strings y numeros.
  let resultado = eval(`data.${properties}`);
  return typeof resultado;
}
function checkPropertyTypeOpen({ file, properties, check = true }) {
  if (file === undefined) throw new Error("file esta indefinido");
  if (properties === undefined) throw new Error("properties esta indefinido");
  if (typeof file !== "string")
    throw new Error(`file nada mas puede ser string, file es: ${typeof file}`);
  const read = readFileSync(file, "utf-8");
  const data = JSON.parse(read);

  if (check) {
    if (!read) throw new Error(`El archivo json esta vacio`);
    if (!isNaN(properties) || typeof properties !== "string")
      throw new Error(
        `properties nada mas puede ser una string, properties es: ${typeof properties}`
      );
    if (!checkProperty({ data, properties }))
      throw new Error(`La propiedad ${properties} es indefinida`);
  }
  //TODO: hacer la verificacion a las propiedades del json. pero para que sea mucho mas eficiente es mejor que verifique todas las propiedades, para ver cual o cuales son indefinidos. :D
  //TODO: properties tambien debria aceptar numeros, :D tratar de que acepte solo strings y numeros.
  let resultado = eval(`data.${properties}`);
  return typeof resultado;
}
/**
 * Agrega valores a un objeto json.
 * @param {{
    data: object
    properties: string
    value: any
    check: boolean
 * }} 
 * data: Un objeto json para agregar los valores
 * @param properties: La ruta hacia la propiedad a modificar.
 * @param value: El valor a agregar a la propiedad, puede ser cualquier valor, incluso un objeto
 * @param check: Para habilitar el checkeo para el buen funcionamiento de la funcion
 * @returns Retorna la data modificada.
 * @example ```
 * addValueData(data,'valor_a.valor_b.valor_c','Epa'); o 
 * addValueData(data,'valor_a','Epa');
 * ```
 */
function addValueData({ data, properties, value, check = true }) {
  if (data == undefined) throw new Error("data esta indefinido");
  if (properties == undefined) throw new Error("properties esta indefinido");
  if (value == undefined) throw new Error("value esta indefinido");
  if (check) {
    const checkProps = !json_Sync.checkProperty(data, properties);
    const checkType = json_Sync.checkPropertyType(data, properties);
    if (condition) {
    }
    if (
      typeof data !== "object" ||
      data === null ||
      typeof data == "function" ||
      Array.isArray(data)
    )
      throw new Error(
        `data nada mas puede ser un objeto, data es: ${typeof data}`
      );
    if (!isNaN(properties) || typeof properties !== "string")
      throw new Error(
        `properties nada mas puede ser una string, properties es: ${typeof properties}`
      );
    if (checkProps) throw new Error(`No existe la propiedad ${properties}`);
    if (
      (checkType == "string" ||
        checkType == "number" ||
        checkType == "boolean" ||
        properties == null) &&
      typeof value === "object"
    )
      throw new Error(
        `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`
      );
    if (
      checkType == "object" &&
      (typeof value == "string" ||
        typeof value == "number" ||
        typeof value == "boolean" ||
        value == null)
    )
      throw new Error(
        `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`
      );
  }
  let add = eval(`data.${properties}`);
  if (
    typeof value == "string" ||
    typeof value == "number" ||
    typeof value == "boolean" ||
    value == null
  ) {
    add = value;
  }
  for (const key in value) {
    if (value.hasOwnProperty.call(value, key)) {
      const values = value[key];
      add[key] = values;
    }
  }
  return data;
}
/**
 * Agrega valores a un objeto json.
 * 
 * Nota: necesitas pasarle el archivo json para leerlo.
 * @param {{
    file: string
    properties: string
    value: any
    check: boolean
 * }} 
 * file: Un archivo json para sacar el objeto.
 * @param properties: La ruta hacia la propiedad a modificar.
 * @param value: El valor a agregar a la propiedad, puede ser cualquier valor, incluso un objeto
 * @param check: Para habilitar el checkeo para el buen funcionamiento de la funcion
 * @returns Retorna la data modificada.
 * @example ```
 * addValueData('./archivo.json','valor_a.valor_b.valor_c','Epa'); o 
 * addValueData('./archivo.json','valor_a','Epa');
 * ```
 */
function addValueDataOpen({ file, properties, value, check = true }) {
  if (file == undefined) throw new Error("file esta indefinido");
  if (properties == undefined) throw new Error("properties esta indefinido");
  if (value == undefined) throw new Error("value esta indefinido");
  if (typeof file !== "string") throw new Error(`file solo puede ser string`);
  const read = readFileSync(file, "utf-8");
  const data = JSON.parse(read);
  if (check) {
    if (!read) throw new Error(`El archivo json esta vacio`);
    const checkProps = !json_Sync.checkProperty(data, properties);
    const checkType = json_Sync.checkPropertyType(data, properties);
    if (
      typeof data !== "object" ||
      data === null ||
      typeof data == "function" ||
      Array.isArray(data)
    )
      throw new Error(
        `data nada mas puede ser un objeto, data es: ${typeof data}`
      );
    if (!isNaN(properties) || typeof properties !== "string")
      throw new Error(
        `properties nada mas puede ser una string, properties es: ${typeof properties}`
      );
    if (checkProps) throw new Error(`No existe la propiedad ${properties}`);
    if (
      (checkType == "string" ||
        checkType == "number" ||
        checkType == "boolean" ||
        properties == null) &&
      typeof value === "object"
    )
      throw new Error(
        `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`
      );
    if (
      checkType == "object" &&
      (typeof value == "string" ||
        typeof value == "number" ||
        typeof value == "boolean" ||
        value == null)
    )
      throw new Error(
        `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`
      );
  }
  let add = eval(`data.${properties}`);
  if (
    typeof value == "string" ||
    typeof value == "number" ||
    typeof value == "boolean" ||
    value == null
  ) {
    add = value;
  }
  for (const key in value) {
    if (value.hasOwnProperty.call(value, key)) {
      const values = value[key];
      add[key] = values;
    }
  }
  return data;
}
module.exports = {
  checkProperty,
  checkPropertyOpen,
  checkPropertyType,
  checkPropertyTypeOpen,
  addValueData,
  addValueDataOpen,
};

const path = require('path');
const fs = require('fs');

const packageLocation = path.join(`${process.cwd()}/package.json`);

function packageInit() {
packageInitCmd();
}
function packageInitCmd() {
    const package = packageLocation;
    const read = fs.readFileSync(package);
    const data = JSON.parse(read);
    const env_file = './.env.core';
    const home_path = './node_modules/@core_/scripts/bin/cmd';
    data.scripts['nucleo:d'] = `env-cmd -f ${env_file} ${home_path}/mega_nucleo_download.cmd`;
    data.scripts['nucleo:u'] = `env-cmd -f ${env_file} ${home_path}/mega_nucleo_upload.cmd`;
    data.scripts['mongol:u'] = `env-cmd -f ${env_file} ${home_path}/mongo_local_upload.cmd`
    data.scripts['mongol:d'] = `env-cmd -f ${env_file} ${home_path}/mongo_local_upload.cmd`
    data.scripts['mongoe:u'] = `env-cmd -f ${env_file} ${home_path}/mongo_externe_upload.cmd`
    data.scripts['mongoe:d'] = `env-cmd -f ${env_file} ${home_path}/mongo_externe_upload.cmd`
    var complete = JSON.stringify(data,null,2);
    fs.writeFile(package,complete,(err) => {
        if (err) throw err;
        console.log('package.json modificado!');
      });
}
module.exports = {
    packageInit
}
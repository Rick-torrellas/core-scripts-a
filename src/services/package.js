const path = require('path');
const fs = require('fs');

function packageLocation() {
    const package = path.join(`${process.cwd()}/package.json`);
    return package;
}

function packageInit() {
    const package = packageLocation();
    const read = fs.readFileSync(package);
    const data = JSON.parse(read);
    data.scripts.nalga = "PENE";
    var complete = JSON.stringify(data,null,2);
    fs.writeFile(package,complete,(err) => {
        if (err) throw err;
        console.log('package.json modificado!');
      });
    
}
module.exports = {
    packageLocation,
    packageInit
}
var path = require('path');
var convict = require('convict');

// Define a schema
var config = convict(__dirname +'/convict.json')
if (config.get('env')==='dev') {
    process.chdir('src')
}

const envConf = require(__dirname + "/" + config.get('env') + '.json');
const DBConf = require(__dirname + "/db." + config.get('env') + '.json');

// Load configurations
config.load(envConf)
config.set('db', DBConf)

module.exports = config

const {aliasDangerous} = require("react-app-rewire-alias/src/aliasDangerous");
const {configPaths} = require("react-app-rewire-alias");
module.exports = function override(config) {
    aliasDangerous({
        ...configPaths('tsconfig.paths.json')
    })(config)

    return config
}

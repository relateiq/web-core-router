var moduleName = 'RouterCore';
module.exports.name = moduleName;

var angularModule = angular.module(moduleName, [
    require('./RouterCoreSrvc'),
    require('./RouterCoreUtilSrvc'),
    require('./RouterCoreViewModelSrvc'),
    require('./RouterCoreViewModelStateSrvc')
]);

module.exports = angularModule;

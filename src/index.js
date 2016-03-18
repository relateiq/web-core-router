var moduleName = 'RouterCore';
module.exports.name = moduleName;

var angularModule = angular.module(moduleName, [
    require('./RouterCoreSrvc'),
    require('./RouterCoreUtilSrvc'),
    require('./RouterCoreViewModelSrvc'),
    require('./RouterCoreViewModelStateSrvc')
]);

module.exports = {
    angularModule: angularModule,
    stateConfig: require('./lib/RouterCoreStateConfig'),
    run: require('./lib/RouterCoreRun'),
    stateCtrlGenerator: require('./lib/RouterCoreStateCtrlGenerator'),
    defaultRuleConfig: require('./lib/RouterCoreRuleConfig'),

    makeRouterCnst: require('./lib/RouterCnstGenerator'),

    transforms: {
        booleanTransform: require('./lib/transforms/BooleanTransform'),
        numberTransform: require('./lib/transforms/NumberTransform')
    }
};

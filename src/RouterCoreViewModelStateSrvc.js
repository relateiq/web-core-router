var moduleName = 'RouterCoreViewModelStateSrvc';
module.exports = moduleName;

angular.module(moduleName, []).factory('RouterCoreViewModelStateSrvc', function() {
    var RouterCoreViewModelStateSrvc = {};
    var currentViewModel = {};

    RouterCoreViewModelStateSrvc.setCurrentViewModel = function(vm) {
        currentViewModel = vm || {};
    };

    RouterCoreViewModelStateSrvc.getCurrentViewModel = function() {
        return currentViewModel;
    };

    return RouterCoreViewModelStateSrvc;
});

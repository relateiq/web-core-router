var capitalize = require('capitalize');

var moduleName = 'RouterCoreSrvc';
module.exports = moduleName;

angular.module(moduleName, [
    'ui.router'
]).factory('RouterCoreSrvc', function(
    $q,
    $state,
    $window,
    $location,
    RouterCoreViewModelStateSrvc
) {

    var RouterCoreSrvc = {};

    // create an "isOn" function for each router state
    RouterCoreSrvc.generateIsOnStates = function generateIsOnStates(states, serviceObj) {
        Object.keys(states).forEach(function(stateCnstName) {
            var stateConfig = states[stateCnstName];
            serviceObj['isOn' + capitalize(stateConfig.name)] = $state.is.bind(null, stateConfig.name);

            // generates route helper functions for each state
            // e.g. RouterCoreSrvc.person(personId).go() and RouterCoreSrvc.person(personId).link(absolute)
            generateRouteHelperForStateConfig(stateConfig, serviceObj);
        });
    };

    RouterCoreSrvc.reload = function() {
        // this is a full page reload
        $window.location.reload();
    };

    RouterCoreSrvc.getCurrentStateName = function() {
        return $state.current.name;
    };

    RouterCoreSrvc.getCurrentViewModel = function() {
        return RouterCoreViewModelStateSrvc.getCurrentViewModel();
    };

    // MAINLY FOR INTERNAL USE
    RouterCoreSrvc.go = function(stateNameOrObj, params, options) {
        if (stateNameOrObj) {
            options = options || {};
            // don't inherit parameters from the current url by default
            options.inherit = options.inherit || false;
            return $state.go(stateNameOrObj, params, options);
        } else {
            return $q.when();
        }
    };


    ////////////////////////////////////////////////////////
    // HELPER FUNCTIONS
    ////////////////////////////////////////////////////////

    function generateRouteHelperForStateConfig(stateConfig, serviceObj) {
        serviceObj[stateConfig.name] = function() {
            var args = arguments; // need to store ref before using in fns below
            var params = {};
            var argIndex = 0;

            if (stateConfig.pathParams) {
                stateConfig.pathParams.forEach(function(pathParam) {
                    params[stateConfig.pathParams[pathParam]] = args[argIndex++];
                });
            }

            if (stateConfig.queryParams) {
                stateConfig.queryParams.forEach(function(queryParam) {
                    params[queryParam] = args[argIndex++];
                });
            }

            return getRouteHelperReturnObj(stateConfig.name, params, args[argIndex]);
        };
    }

    function getRouteHelperReturnObj(stateName, params, options) {
        return {
            go: RouterCoreSrvc.go.bind(null, stateName, params, options),
            link: getLinkForStateNameAndParams.bind(null, stateName, params)
        };
    }

    function getLinkForStateNameAndParams(stateName, params, absolute) {
        return $state.href(stateName, params, {
            absolute: absolute,
            inherit: false // don't inherit parameters from the current url
        });
    }

    return RouterCoreSrvc;
});

var shallowDiff = require("shallow-diff");

var moduleName = 'RouterCoreViewModelSrvc';
module.exports = moduleName;

angular.module(moduleName, [])

.factory('RouterCoreViewModelSrvc', function(
    $injector,
    $state,
    $location
) {

    var RouterCoreViewModelSrvc = {};

    RouterCoreViewModelSrvc.getViewModelForStateName = function(stateName, stateConfigs, globalModelBindings) {
        var stateConfig = RouterCoreViewModelSrvc.getStateConfigByName(stateName, stateConfigs);
        return RouterCoreViewModelSrvc.getViewModelForState(stateConfig, globalModelBindings);
    };

    RouterCoreViewModelSrvc.getViewModelForState = function(stateConfig, globalModelBindings) {
        var result = {};

        if (RouterCoreViewModelSrvc.hasModelBindings(stateConfig)) {
            RouterCoreViewModelSrvc.forEachModelBinding(stateConfig, function(modelKey, binding) {
                result[modelKey] = deserializeModelBinding(binding);
            }, globalModelBindings);
        }

        return result;
    };

    RouterCoreViewModelSrvc.getSerializedParamStateFromViewModel = function(stateConfig, viewModel, globalParams, globalModelBindings) {
        var result = {
            all: {},
            path: {},
            query: {}
        };

        RouterCoreViewModelSrvc.forEachModelBinding(stateConfig, function(modelKey, binding) {
            if (typeof binding === 'string') {
                var value = viewModel[modelKey];
                result.all[binding] = hasValue(value) ? value : null;
            } else {
                angular.extend(result.all, serializeModelBindingObj(binding, viewModel));
            }
        }, globalModelBindings);

        // separate pathParams
        if (stateConfig.pathParams) {
            stateConfig.pathParams.forEach(function(param) {
                result.path[param] = result.all[param];
            });
        }

        // separate queryParams
        var queryParamsArray = [];
        if (stateConfig.queryParams) {
            queryParamsArray = queryParamsArray.concat(stateConfig.queryParams);
        }

        if (globalParams) {
            queryParamsArray = queryParamsArray.concat(globalParams);
        }

        queryParamsArray.forEach(function(param) {
            result.query[param] = result.all[param];
        });

        return result;
    };

    RouterCoreViewModelSrvc.forEachModelBinding = function(stateConfig, fn, globalModelBindings) {
        var bindings = [];
        if (RouterCoreViewModelSrvc.hasModelBindings(stateConfig)) {
            bindings = bindings.concat(Object.keys(stateConfig.modelBindings));
        }

        if (globalModelBindings && Object.keys(globalModelBindings).length) {
            bindings = bindings.concat(Object.keys(globalModelBindings).filter(function(binding) {
                var isStateBinding = stateConfig.modelBindings[binding];
                if (isStateBinding) {
                    console.warn('Model binding exists in both global and local state, deferring to state for:', binding);
                }
                return !isStateBinding;
            }));
        }
        bindings.forEach(function(modelKey) {
            fn(modelKey, stateConfig.modelBindings[modelKey] || (globalModelBindings && globalModelBindings[modelKey]));
        });
    };


    RouterCoreViewModelSrvc.getStateConfigByName = function(stateName, stateConfigs) {
        var result;

        Object.keys(stateConfigs).some(function(stateKey) {
            var stateConfig = stateConfigs[stateKey];

            if (stateConfig.name === stateName) {
                result = stateConfig;
                return true;
            }
        });

        return result;
    };

    RouterCoreViewModelSrvc.hasModelBindings = function(stateConfig) {
        return !!(stateConfig && stateConfig.modelBindings && Object.keys(stateConfig.modelBindings).length);
    };

    RouterCoreViewModelSrvc.hasOnlyLazyQueryParamResolved = function(stateConfig, newQueryParams) {
        if (stateConfig.lazyQueryParams && stateConfig.lazyQueryParams.length) {
            var oldQueryParams = $location.search();
            var diff = shallowDiff(oldQueryParams, newQueryParams);
            var addedWithValue = diff.added.filter(function(key) {
                return hasValue(newQueryParams[key]);
            });
            var changedKeys = diff.updated.concat(addedWithValue);

            if (changedKeys.length && !diff.deleted.length) {
                return changedKeys.every(function(param) {
                    var isLazyParam = stateConfig.lazyQueryParams.indexOf(param) >= 0;
                    var isValidChange = hasValue(newQueryParams[param]) && !hasValue(oldQueryParams[param]);
                    return isLazyParam && isValidChange;
                });
            }
        }

        return false;
    };

    RouterCoreViewModelSrvc.havePathParamChanged = function(stateConfig, newPathParams) {
        if (stateConfig.pathParams && stateConfig.pathParams.length) {
            var oldPathParams = {};

            stateConfig.pathParams.forEach(function(param) {
                oldPathParams[param] = $state.params[param];
            });

            var diff = shallowDiff(oldPathParams, newPathParams);

            return !!(diff.updated.length || diff.added.length || diff.deleted.length);
        }

        return false;
    };

    function deserializeModelBinding(binding) {
        if (typeof binding === 'string') {
            return $state.params[binding];
        } else {
            return callModelBindingFn(binding, 'deserialize', [$injector, $state.params]);
        }
    }

    function serializeModelBindingObj(binding, viewModel) {
        return callModelBindingFn(binding, 'serialize', [$injector, viewModel]);
    }

    function callModelBindingFn(binding, fnName, args) {
        if (typeof binding === 'object') {
            if (typeof binding[fnName] === 'function') {
                return binding[fnName].apply(null, args);
            } else {
                throw new Error('RiqRouter state modelBindings object must have a "' + fnName + '" function');
            }
        } else {
            throw new Error(
                'RiqRouter state modelBindings must either be a string (corresponding with a url parameter)' +
                ' or an object with "serialize" and "deserialize" functions', binding
            );
        }
    }

    function hasValue(value) {
        return !!value || value === 0;
    }

    return RouterCoreViewModelSrvc;
});

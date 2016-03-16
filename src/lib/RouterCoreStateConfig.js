var RouterCoreStateCtrlGenerator = require('./RouterCoreStateCtrlGenerator');

module.exports = function(opts) {
    return /* @ngInject */ function($stateProvider, $urlRouterProvider) {
        Object.keys(opts.RouterCnst.STATES).forEach(function(stateName) {
            var stateConfig = opts.RouterCnst.STATES[stateName];
            var basePath = '/' + stateConfig.name;

            // gather all pathParams, to capture the pathParam in the $state.params,
            // we use the :param syntax. e.g. /name/:pathParam1/:pathParam2
            var pathParams = stateConfig.pathParams && stateConfig.pathParams.join('/:') || '';
            pathParams = pathParams ? '/:' + pathParams : '';

            // gather all queryParams, ui-router just needs the & separated definition to capture for $state.params
            var queryParamsArray = [];
            if (stateConfig.queryParams) {
                queryParamsArray = queryParamsArray.concat(stateConfig.queryParams);
            }
            if (opts.RouterCnst.GLOBAL_PARAMS) {
                queryParamsArray = queryParamsArray.concat(opts.RouterCnst.GLOBAL_PARAMS);
            }
            var queryParams = queryParamsArray.join('&') || '';
            queryParams = queryParams ? '?' + queryParams : '';

            // For any unmatched url, redirect to last flagged default
            if (stateConfig.default) {
                $urlRouterProvider.otherwise(basePath);
            }

            $stateProvider.state(stateConfig.name, {
                url: basePath + pathParams + queryParams,
                template: stateConfig.template,
                controller: RouterCoreStateCtrlGenerator(stateConfig, opts)
            });
        });
    };
};
module.exports = function (routeStateConfig, opts) {

    return /* @ngInject */ function ($scope, $state, $injector, RouterCoreSrvc, RouterCoreViewModelSrvc, RouterCoreViewModelStateSrvc, RouterCoreUtilSrvc) {
        if (!RouterCoreViewModelSrvc.hasModelBindings(routeStateConfig)) {
            // reset view model state when there are no modelBindings
            RouterCoreViewModelStateSrvc.setCurrentViewModel();

            // can't do anything without modelBindings
            return;
        }

        $scope.viewModel = RouterCoreViewModelSrvc.getViewModelForState(routeStateConfig);
        RouterCoreViewModelStateSrvc.setCurrentViewModel($scope.viewModel);

        var viewModelWatchFn = (function viewModelWatchFn() {
            var newParamState = RouterCoreViewModelSrvc.getSerializedParamStateFromViewModel(routeStateConfig, $scope.viewModel, opts.RouterCnst.GLOBAL_PARAMS, opts.RouterCnst.GLOBAL_MODEL_BINDINGS);

            if (RouterCoreViewModelSrvc.havePathParamChanged(routeStateConfig, newParamState.path)) {
                RouterCoreSrvc.go($state.current.name, newParamState.all);
            } else {
                var replaceHistoryRecord = RouterCoreViewModelSrvc.hasOnlyLazyQueryParamResolved(routeStateConfig, newParamState.query);

                if (opts.onViewModelUpdate) {
                    $injector.invoke(opts.onViewModelUpdate, opts.onViewModelUpdate, {
                        routeStateConfig: routeStateConfig,
                        viewModel: $scope.viewModel
                    });
                }

                RouterCoreViewModelStateSrvc.setCurrentViewModel($scope.viewModel);

                // set $state params because $stateParams is a piece of poop and does not reflect current state
                // (it scopes it in a weird way so location of inject seems to matter)
                $state.params = newParamState.all;

                RouterCoreUtilSrvc.updateSearchNoReload(newParamState.query, replaceHistoryRecord);
            }

            var phase = $scope.$root && $scope.$root.$$phase;
            if (phase !== '$apply' && phase !== '$digest') {
                $scope.$apply();
            }
        }).debounce(1);

        // double bind the viewModel search params back to the location without causing a reload
        // since we watch `true`, make sure it is only for defined modelBindings
        RouterCoreViewModelSrvc.forEachModelBinding(routeStateConfig, function (key) {
            $scope.$watch('viewModel.' + key, viewModelWatchFn, true);
        }, opts.RouterCnst.GLOBAL_MODEL_BINDINGS);
    };
};

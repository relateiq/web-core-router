// inject RouterCoreSrvc to init it
module.exports = function(opts) {
    return /* @ngInject */ function($state, $rootScope, $document, $urlRouter, RiqDialogSrvc, RouterCoreViewModelSrvc, RouterCoreSrvc, RouterCoreViewModelStateSrvc) {
        //require to init and sync ui-router post the riqSignup app
        $urlRouter.sync();

        // put state on $rootScope to allow for ngClass of current state name
        $rootScope.$state = $state;

        // Since $stateChangeSuccess fires before the state's controller gets instantiated to set a viewModel,
        // anything using a viewModel in $stateChangeSuccess needs to have the updated viewModel
        $rootScope.$on('$stateChangeSuccess', function() {
            var stateName = RouterCoreSrvc.getCurrentStateName();
            var vm = RouterCoreViewModelSrvc.getViewModelForStateName(stateName, opts.RouterCnst.STATES, opts.RouterCnst.GLOBAL_MODEL_BINDINGS);
            RouterCoreViewModelStateSrvc.setCurrentViewModel(vm);

            var windowEvent = new CustomEvent('$stateChangeSuccess');

            windowEvent.stateName = stateName;
            window.dispatchEvent(windowEvent);
        });

        // for error logging
        $rootScope.$on('$stateChangeError', function() {
            console.log(arguments);
        });
    };
};

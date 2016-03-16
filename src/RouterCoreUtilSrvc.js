var moduleName = 'RouterCoreUtilSrvc';
module.exports = moduleName;

angular.module(moduleName, [
    require('angular-ui-router')
]).factory('RouterCoreUtilSrvc', function($state, $location, $timeout) {
    var RouterCoreUtilSrvc = {};

    RouterCoreUtilSrvc.updateSearchNoReload = function(newQueryParams, replaceHistoryRecord) {
        $state.current.reloadOnSearch = false;

        if (replaceHistoryRecord) {
            $location.replace();
        }

        $location.search(newQueryParams);

        // timeout needed to execute in next digest to bypass changing $location.search above
        $timeout(function() {
            //needs to be set back to true to catch back/forward nav and manual changes to url
            $state.current.reloadOnSearch = true;
        });
    };

    RouterCoreUtilSrvc.clearSearchParams = function() {
        $location.url($location.path());
    };

    return RouterCoreUtilSrvc;
});

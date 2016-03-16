module.exports = function(RiqRouterCnst) {
    return function($urlRouterProvider) {
        $urlRouterProvider.rule(function($injector, $location) {
            var url = $location.url();
            var urlQMarkIndex = url.indexOf('?');
            var origSearch = urlQMarkIndex !== -1 ? url.substring(urlQMarkIndex + 1) : '';
            var origPath = $location.path();
            var firstPathColonIndex = origPath.indexOf(':');
            var search;
            var path;

            if (firstPathColonIndex !== -1) {
                //convert GWT colon syntax to '?' for valid query string
                path = origPath.substring(0, firstPathColonIndex);
                search = origPath.substring(firstPathColonIndex + 1);
            } else {
                path = origPath;
                search = origSearch;
            }

            // convert old field filter params (f0, f31, etc) to defined field filter param key with field id and field value pipe delimited
            if (search) {
                var searchArr = search.split('&');
                var newSearchArr = [];

                searchArr.forEach(function(item) {
                    var split = item.split('=');

                    if (RiqRouterCnst.FIELD_PARAM_REGEX.test(split[0])) {
                        var fieldId = split[0].substring(RiqRouterCnst.PARAM_VALUES.FIELD_PREFIX.length);
                        newSearchArr.push(RiqRouterCnst.PARAMS.FIELD_FILTERS + '=' + fieldId + RiqRouterCnst.FIELD_FILTER_DELIMETER + split[1]);
                    } else {
                        newSearchArr.push(item);
                    }
                });

                search = newSearchArr.join('&');
            }

            // home: --> home
            // list:l=12345 --> list/12345
            path = path.replace(/:[^=]+=|:/, '/');

            //remove trailing slash possibly added above
            if (path[path.length - 1] === '/') {
                path = path.substring(0, path.length - 1);
            }

            if (origPath !== path || (search && search !== origSearch)) {
                $location.replace().path(path).search(search);
            }
        });
    };
};

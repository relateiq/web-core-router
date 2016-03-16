module.exports = function(param, modelKey, defaultValue) {

    function serialize($injector, viewModel) {
        var result = {};

        result[param] = !!viewModel[modelKey];

        return result;
    }

    function deserialize($injector, params) {
        if (defaultValue && angular.isUndefined(params[param])) {
            params[param] = defaultValue;
        }
        return params[param] === 'true' || params[param] === true;
    }

    return {
        serialize: serialize,
        deserialize: deserialize
    };
};

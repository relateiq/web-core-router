module.exports = function(param, modelKey) {

    function serialize($injector, viewModel) {
        var value = viewModel[modelKey];
        var result = {};

        if (value || value === 0) {
            result[param] = value;
        }

        return result;
    }

    function deserialize($injector, params) {
        return +params[param] || null;
    }

    return {
        serialize: serialize,
        deserialize: deserialize
    };
};

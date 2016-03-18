module.exports = function() {
    var cnstShell = {
        PARAM_VALUES: {
            FIELD_PREFIX: 'f',
            SORT_REVERSED_PREFIX: '-',
            SORT_RELATIONSHIP: 'n'
        },
        FIELD_FILTER_DELIMETER: '.',
        FIELD_PARAM_REGEX: null
    };

    cnstShell.FIELD_PARAM_REGEX = new RegExp('^' + cnstShell.PARAM_VALUES.FIELD_PREFIX + '\\d+', 'i');

    return cnstShell;
};

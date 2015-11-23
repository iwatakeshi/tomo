var Options;
(function (Options) {
    Options.Scanner = {
        ignore: {
            whitespace: true
        },
        isCharCode: true,
        override: {
            isWhiteSpace: undefined
        }
    };
})(Options || (Options = {}));
exports["default"] = Options;

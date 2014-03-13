fs = require('fs');
cssbeautify = require('cssbeautify');

fs.readFile(process.argv[2], function(err, data) {
    var beautified = cssbeautify(data, {
        indent: '  ',
        openbrace: 'separate-line',
        autosemicolon: true
    });
    sys.puts(beautified);
})

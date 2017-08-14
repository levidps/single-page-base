module.exports = function() {
    var sourcePath = './_src/';

    var config = {
            sourceFiles   : {
                html: sourcePath + '*.html',
                json: sourcePath + '*.json',
                img : sourcePath + '_assets/**/*',
                scss: sourcePath + '_css/**/*.scss',
                js  : sourcePath + '_js/**/*.js'
            },
            destination   : './_dist/',
        };

    return config;
};

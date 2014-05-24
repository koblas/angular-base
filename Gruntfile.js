module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      options: {
        transform: ['coffeeify', 'partialify'],
        extensions: ['.coffee'],
        debug: true,
      },
      js: {
        // A single entry point for our app
        src: 'client/app/app.coffee',
        // Compile to a single file to add a script tag for in your HTML
        dest: 'static/app/app.js',
      },
    },
    watch: {
      js: {
          files: 'client/**',
          tasks: ['browserify', 'copy'],
          options: {
              spawn: false
          }
      },
    },
    copy: {
      all: {
        // This copies all the html and css into the dist/ folder
        expand: true,
        cwd: 'client/',
        src: ['**/*.css', 'vendor/**', 'bootstrap/**'],
        dest: 'static/',
      },
    },
  });

  // Load the npm installed tasks
  grunt.loadNpmTasks('grunt-browserify');
  // grunt.loadNpmTasks('grunt-ngmin');
  // grunt.loadNpmTasks('grunt-watchify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // The default tasks to run when you type: grunt
  grunt.registerTask('default', ['browserify', 'copy', 'watch']);
};

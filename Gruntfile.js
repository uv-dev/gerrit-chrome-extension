module.exports = function(grunt) {
  grunt.initConfig({
    pkg: '<json:package.json>',
    jshint: {
      all: {
        src: ['extension/*.js']
      }
    },
    jscs: {
      src: ['Gruntfile.js', 'extension/*.js'],
      options: {
        config: '.jscsrc',
        fix: true
      }
    },
    watch: {
        files: ['extension/*.js'],
        tasks: ['jshint', 'jscs']
      }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('browserify' function() {
  });

  grunt.registerTask('default', ['jshint', 'jscs', 'watch']);

  grunt.registerTask('test', ['jshint', 'jscs']);

  // TODO: Fix jjshint errors and add `jshint` into build task.
  grunt.registerTask('build', ['browserify']);
};

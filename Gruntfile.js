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

  // Default task.
  grunt.registerTask('default', ['jshint', 'jscs', 'watch']);

  // Test task
  grunt.registerTask('test', ['jshint', 'jscs']);
};

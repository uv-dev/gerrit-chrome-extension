module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    extension: 'extension',
    dist: 'dist',
    manifest: grunt.file.readJSON('extension/manifest.json')
  };

  grunt.initConfig({
    pkg: '<json:package.json>',
    config: config,
    browserify: {
      scripts:{
        files:{
          '<%= config.dist %>/popup.js': ['<%= config.extension %>/popup.js']
        }
      }
    },
    clean: ['<%= config.dist %>/'],
    // Copies remaining files to place other tasks can use.
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.extension %>',
          dest: '<%= config.dist %>',
          src: [
            '*.png',
            '{,*/}*.html',
            'styles/{,*/}*.css'
          ]
        }]
      }
    },
    jshint: {
      all: {
        src: ['<%= config.extension %>/*.js']
      }
    },
    jscs: {
      src: ['Gruntfile.js', '<%= config.extension %>/*.js'],
      options: {
        config: '.jscsrc',
        fix: true
      }
    },
    watch: {
      files: ['<%= config.extension %>/*.js'],
      tasks: ['jshint', 'jscs', 'browserify']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('default', ['jshint', 'jscs', 'watch']);

  grunt.registerTask('test', ['jshint', 'jscs']);

  // TODO: Fix jshint errors and add `jshint` into build task.
  grunt.registerTask('build', ['clean', 'browserify', 'copy']);
};

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
          '<%= config.dist %>/scripts/popup.js': ['<%= config.extension %>/scripts/popup.js'],
          '<%= config.dist %>/scripts/options.js': ['<%= config.extension %>/scripts/options.js'],
          '<%= config.dist %>/scripts/background.js': ['<%= config.extension %>/scripts/background.js'],
          '<%= config.dist %>/scripts/gerrit-api.js': ['<%= config.extension %>/scripts/gerrit-api.js']
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
            '{,*/}*.html',
            'images/{,*/}*.png',
            'manifest.json',
            'styles/{,*/}*.css'
          ]
        }]
      }
    },
    jshint: {
      all: {
        src: ['<%= config.extension %>/scripts/*.js']
      }
    },
    jscs: {
      src: ['Gruntfile.js', '<%= config.extension %>/scripts/*.js'],
      options: {
        config: '.jscsrc',
        fix: true
      }
    },
    watch: {
      files: ['<%= config.extension %>/scripts/*.js'],
      tasks: ['jshint', 'jscs', 'browserify']
    }
  });

  grunt.registerTask('default', ['jshint', 'jscs', 'watch']);

  grunt.registerTask('test', ['jshint', 'jscs']);

  // TODO: Fix jshint errors and add `jshint` into build task.
  grunt.registerTask('build', ['clean', 'browserify', 'copy']);
};

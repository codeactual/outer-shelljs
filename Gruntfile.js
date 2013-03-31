module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-shell');

  grunt.initConfig({
    jshint: {
      src: {
        files: {
          src: ['index.js']
        }
      },
      grunt: {
        files: {
          src: ['Gruntfile.js']
        }
      },
      tests: {
        options: {
          expr: true
        },
        files: {
          src: ['test.js']
        }
      },
      json: {
        files: {
          src: ['*.json']
        }
      }
    },
    shell: {
      options: {
        failOnError: true
      },
      build: {
        command: 'component install --dev && component build --standalone OuterShelljs --name outer-shelljs --out dist --dev'
      },
      dist: {
        command: 'component build --standalone outerShelljs --name outer-shelljs'
      },
      shrinkwrap: {
        command: 'npm shrinkwrap'
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'shell:shrinkwrap']);
  grunt.registerTask('build', ['shell:build']);
  grunt.registerTask('dist', ['shell:dist']);
};

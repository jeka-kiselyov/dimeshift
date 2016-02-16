module.exports = function(grunt) {

  grunt.initConfig({
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'index.js',
        options: {
          ext: 'js,css,html,tpl',
          watch: ['**/*.js', '**/*.tpl', '**/*.css', 'public/index.html', '**/*.json'],
          nodeArgs: ['--debug'],
          env: {
            PORT: '8080'
          },
          // omit this property if you aren't serving HTML files and 
          // don't want to open a browser tab on start
          callback: function(nodemon) {
            nodemon.on('log', function(event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function() {
              // Delay before server listens on port
              setTimeout(function() {
                require('open')('http://localhost:8080');
              }, 1000);
            });

            // refreshes browser when server reboots
            nodemon.on('restart', function() {
              // Delay before server listens on port
              setTimeout(function() {
                require('fs').writeFileSync('.rebooted', 'rebooted');
              }, 1000);
            });
          }
        }
      }
    },
    watch: {
      server: {
        files: ['.rebooted'],
        options: {
          livereload: true,
          debounceDelay: 500
        }
      }
    },
    env: {
      options: {},
      test: {
        NODE_ENV: 'test'
      }
    },
    run: {
      test_server: {
        options: {
          wait: false
        },
        args: [
          'index.js'
        ]
      }
    },
    mochacli: {
      options: {
        require: [],
        reporter: 'spec',
        bail: true,
        env: {
          NODE_ENV: 'test'
        }
      },
      all: ['includes/test/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-node-inspector');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('dev', ['concurrent']);
  grunt.registerTask('test', ['env:test', 'run:test_server', 'mochacli']);

};
/* To prevent jshint from yelling at module.exports. */
/* jshint node:true */

'use strict';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

  // Loads all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  require('time-grunt')(grunt);

  // App configuration
  var config = grunt.file.readJSON('config.json');

  // Tasks configuration
  grunt.initConfig({

    config: config,

    clean: {
      temp: '<%= config.tempPath %>',
      build: {
        files: [{
          dot: true,
          src: [
            '<%= config.tempPath %>',
            '<%= config.buildPath %>/*',
            '!<%= config.buildPath %>/.git*'
          ]
        }]
      }
    },

    compass: {
      options: {
        sassDir: '<%= config.sourcePath %>/styles',
        imagesDir: '<%= config.sourcePath %>/assets/images',
        force: true
      },
      temp: {
        options: {
          cssDir: '<%= config.tempPath %>/css',
          outputStyle: 'expanded',
          environment: 'development'
        }
      },
      build: {
        options: {
          cssDir: '<%= config.buildPath %>/css',
          outputStyle: 'compressed',
          environment: 'production'
        }
      }
    },

    // This task is pre-configured by useminPrepare,
    // using the usemin blocks inside index.html.
    //
    // concat: {
    //   build: {}
    // },

    connect: {
      options: {
        hostname: config.hostname,
        port: config.port
      },
      source: {
        options: {
          middleware: function(connect) {
            return [
              lrSnippet,
              mountFolder(connect, config.tempPath),
              mountFolder(connect, config.sourcePath)
            ];
          }
        }
      },
      test: {
        options: {
          port: config.testport,
          middleware: function(connect) {
            return [
              lrSnippet,
              mountFolder(connect, config.tempPath),
              mountFolder(connect, config.sourcePath)
            ];
          }
        }
      },
      build: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, config.buildPath)
            ];
          }
        }
      }
    },

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      post: {
        src: '<%= config.buildPath %>/css/*.css'
      }
    },

    // This task is pre-configured by useminPrepare,
    // using the usemin blocks inside index.html.
    //
    cssmin: {
      options: {
        keepSpecialComments: 0
      }
    },

    htmlmin: {
      build: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= config.sourcePath %>',
          src: ['**/*.html'],
          dest: '<%= config.buildPath %>'
        }]
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      source: [
        'Gruntfile.js',
        '<%= config.sourcePath %>/**/*.js',
        '!<%= config.sourcePath %>/vendors/**/*.js'
      ]
    },

    open: {
      source: {
        path: 'http://<%= config.hostname %>:<%= config.port %>'
      },
      build: {
        path: 'http://<%= config.hostname %>:<%= config.port %>'
      }
    },

    shell: {
      options: {
        failOnError: true,
        stdout: true,
        stderr: true
      },
      build: {
        command: function() {
          var cssDir = config.buildPath + '/css/';
          var cssCmd = 'rm ' + cssDir + 'main.css';
          return cssCmd;
        }
      },
      deploy: {
        command: function() {
          var environment = grunt.option('env') || 'dev';
          grunt.log.ok('deploying to ' + environment);
          grunt.log.warn('Please implement your own deployment script');
          return 'echo call something from the shell for example';
        }
      }
    },

    // This task is pre-configured by useminPrepare,
    // using the usemin blocks inside index.html.
    //
    // uglify: {
    //   build: {}
    // },

    useminPrepare: {
      html: '<%= config.sourcePath %>/index.html',
      options: {
        dest: '<%= config.buildPath %>'
      }
    },

    usemin: {
      html: ['<%= config.buildPath %>/index.html'],
      options: {
        dirs: ['<%= config.buildPath %>']
      }
    },

    watch: {
      // When styles change, recompile them
      styles: {
        files: ['<%= config.sourcePath %>/styles/**/*.scss'],
        tasks: ['compass:temp']
      },

      // when scripts change, lint them and run unit tests
      scripts: {
        files: ['<%= config.sourcePath %>/**/*.js'],
        tasks: ['jshint:source']
      },

      // when served files change, reload them in the browser
      served: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= config.sourcePath %>/**/*.html',     // view files
          '<%= config.tempPath %>/css/*.css',       // css files (from sass)
          '<%= config.sourcePath %>/**/*.js'        // script files
        ]
      }
    }

  });

  // Test task
  grunt.registerTask('test', function() {

    var browsers = grunt.option('browsers');

    if (browsers) {
      grunt.config('karma.options.browsers', browsers.split(','));
    }

    return grunt.task.run([
      'jshint:source',
      'serve:test'
    ]);

  });

  // Build task
  grunt.registerTask('build', function() {

    // before we can build, we make sure the test pass.
    this.requires('test');

    return grunt.task.run([
      'clean:build',
      'useminPrepare',
      'htmlmin:build',
      'compass:build',
      'concat',
      'cssmin',
      'uglify',
      'usemin',
      'shell:build'
      // 'csslint'
    ]);

  });

  // Serve task
  grunt.registerTask('serve', function(target) {

    if (!(target === 'build' || target === 'source' || target === 'test')) {
      return grunt.fail.fatal('Wrong target (' + target + ')');
    }

    if (target === 'build') {
      return grunt.task.run([
        'test',
        'build',
        'open:build',
        'connect:build:keepalive'
      ]);
    }

    return grunt.task.run([
      'clean:temp',
      'compass:temp',
      'connect:' + target
    ]);

  });

  // Deploy task
  grunt.registerTask('deploy', function() {

    // before we can deploy, we make sure we build.
    this.requires('build');

    return grunt.task.run('shell:deploy');

  });

  // Default task
  grunt.registerTask('default', [
    'test',
    'serve:source',
    'open:source',
    'watch'
  ]);

};

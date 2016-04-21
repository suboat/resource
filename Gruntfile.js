module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('grunt-contrib-clean')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Empties folders to start fresh
    clean: {
      dist: {
        src: ['./dist']
      },
      backup: {
        src: ['./backup']
      }
    },
    copy: {
      backup: {
        options: {
          timestamp: true
        },
        expand: true,
        src: 'dist/*',
        dest: 'backup/'
      }
    },
    browserify: {
      dist: {
        options: {
          transform: [
            ["babelify", {loose: "all"}]
            // ["babelify", {presets:['es2015']}]
          ]
        },
        files: {
          // if the source file has an extension of es6 then
          // we change the name of the source file accordingly.
          // The result file's extension is always .js
          // "./dist/module.js": ["./modules/index.js"]
          // "./dist/build.js": ["./modules/*.js"]
          "./dist/index.js": ["./index.js"]
        }
      }
    },
    concat: {
      options: {
        sourceMap: true,
        separator: ';',
      },
      dist: {
        src: ['./libs/*.js'],
        dest: './concat/lib.js',
      },
    },
    uglify: {
      dist: {
        options: {
          sourceMap: true,
          sourceMapName: './dist/index.map',
          // beautify: true,
        },
        files: {
          './dist/index.min.js': ['./dist/index.js']
        }
      }
    },
    watch: {
      scripts: {
        files: [
          "./index.js",
          "./libs/*.js",
          "./src/*.js"
        ],
        tasks: ["browserify"]
      }
    },
    // JS 语法检查
    jshint: {
      all: [
        './*.js',
        './libs/*js',
        './src/*.js',
      ],
    },
  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask("default", ["watch"]);

  grunt.registerTask("build", [
    'clean:backup',
    'copy:backup',
    'clean:dist',
    'browserify',
    // 'jshint:all',
    'uglify:dist'
  ]);
};

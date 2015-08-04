module.exports = function(grunt) {

    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        connect: {
            server: {
                options: {
                    port: 5000,
                    base: 'public_html'
                }
            }
        },
        
        concat: {
            options: {
                separator: ';'
            },
            dev: {
                src: ['src/js/common.js'],
                dest: 'public_html/js/common.js'
            }
        },
        
        bower_concat: {
            js: {
                dest: 'public_html/js/libs.js',
            }
        },
        
        watch: {
            markup: {
                files: ['public_html/**'],
                options: {
                    livereload: 35729
                }
            },
            grunt: {
                files: ['Gruntfile.js'],
                options: {
                    livereload: 35729
                }
            },
            js: {
                files: 'src/js/**',
                tasks: 'concat:dev',
                options: {
                    livereload: 35729
                }
            },
            stylesheets: {
                files: 'src/scss/**',
                tasks: 'sass:dev',
                options: {
                    livereload: 35729
                }
            }
        },
                     
        sass: {
            dev: {
                options: {
                    style: 'expanded',
                    sourcemap: 'auto',
                    loadPath: require('node-bourbon').includePaths,
                    loadPath: require('node-neat').includePaths
                },
                files: {
                    'public_html/css/all.css' : 'src/scss/all.scss'
                }
            }
        },
            
        clean: {
            stylesheets: 'public_html/css/*.css',
            js: 'public_html/js/*.js'
        }

    });
    
    grunt.registerTask('stylesheets:dev', ['clean:stylesheets', 'sass:dev']);
    grunt.registerTask('js:dev', ['clean:js', 'concat:dev', 'bower_concat']);
    grunt.registerTask('dev', ['stylesheets:dev', 'js:dev']);

    grunt.registerTask('publish', ['dev']);
    grunt.registerTask('default', ['dev', 'connect', 'watch']);
};
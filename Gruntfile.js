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
        
        imagemin: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'src/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'public_html/images/'
                }]
            }
        },

        watch: {
            options: {
                livereload: 35729
            },
            markup: {
                files: 'public_html/**'
            },
            grunt: {
                files: 'Gruntfile.js'
            },
            images: {
                files: 'src/images/**',
                tasks: 'newer:imagemin'
            },
            js: {
                files: 'src/js/**',
                tasks: 'newer:concat:dev'
            },
            stylesheets: {
                files: 'src/scss/**',
                tasks: 'sass:dev'
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
            js: 'public_html/js/*.js',
            images: 'public_html/images/*.{png,jpg,gif}'
        }

    });
    
    grunt.registerTask('stylesheets:dev', ['sass:dev']);
    grunt.registerTask('js:dev', ['concat:dev', 'bower_concat']);
    grunt.registerTask('dev', ['clean', 'stylesheets:dev', 'js:dev', 'newer:imagemin:all']);

    grunt.registerTask('publish', ['dev']);
    grunt.registerTask('default', ['dev', 'connect', 'watch']);
};
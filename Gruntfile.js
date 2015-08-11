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
        
        uglify: {
            js: {
                files: { 
                  'public_html/js/libs.js': ['public_html/js/libs.js']
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

        assemble: {
			options: {
				flatten: true,
				layout: 'src/layout/default.hbs',
				partials: 'src/partials/*.hbs' 
			},
			all: {
				options: { 
					data: 'src/json/*.json'
				},
				files: [{
					src: 'src/pages/*.hbs',
					dest: './public_html'
				}]
			}
			/*temp_page: {
				options: { 
					data: 'src/json/temp.json'
				},
				files: [{
					src: 'src/pages/temp.hbs',
					dest: './public_html'
				}]
			}*/
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
            },
            assemble : {
                files : ['src/layout/*.hbs','src/pages/*.hbs','src/partials/*.hbs','src/json/temp.json'],
                tasks: ['assemble']
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
        	html: 'public_html/*.html',
            stylesheets: 'public_html/css/*.css',
            js: 'public_html/js/*.js'
        }

    });
    
    grunt.registerTask('stylesheets:dev', ['sass:dev']);
    grunt.registerTask('js:dev', ['concat:dev', 'bower_concat', 'uglify:js']);
    grunt.registerTask('dev', ['clean', 'stylesheets:dev', 'js:dev', 'newer:imagemin:all', 'assemble']);

    grunt.registerTask('publish', ['dev']);
    grunt.registerTask('default', ['dev', 'connect', 'watch']);
};
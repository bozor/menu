module.exports = function(grunt) {

    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        php: {
            server: {
                options: {
                    port: 5000,
                    base: 'public_html'
                }
            }
        },
        
        uglify: {
            dev: {
                files: { 
                    'public_html/js/libs.js': 'public_html/js/libs.js'
                }
            },
            prod: {
                files: { 
                    'public_html/js/all.js': 'public_html/js/all.js'
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
            },
            prod: {
                src: ['public_html/js/temp/libs.js', 'src/js/common.js'],
                dest: 'public_html/js/all.js'
            }
        },
        
        bower_concat: {
            dev: {
                dest: 'public_html/js/libs.js'
            },
            prod: {
                dest: 'public_html/js/temp/libs.js'
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
        },
        
        hashres: {
            all: {
                src: ['public_html/js/*.js','public_html/css/*.css'],
                dest: 'public_html/*.html'
            }
        },

        watch: {
            options: {
                livereload: 35729
            },
            php: {
                files: 'src/php/**',
                tasks: 'copy:php'
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
            assemble: {
                files: ['src/layout/*.hbs','src/pages/*.hbs','src/partials/*.hbs','src/json/*.json'],
                tasks: 'assemble'
            }
        },
                     
        sass: {
            options: {
                loadPath: require('node-bourbon').includePaths,
                loadPath: require('node-neat').includePaths
            },
            dev: {
                options: {
                    style: 'expanded',
                    sourcemap: 'auto'
                },
                files: {
                    'public_html/css/all.css' : 'src/scss/all.scss'
                }
            },
            prod: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: {
                    'public_html/css/all.css' : 'src/scss/all.scss'
                }
            }
        },
        
        targethtml: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'public_html/',
                    src: ['*.html'],
                    dest: 'public_html/'
                }]
            },
            prod: {
                files: [{
                    expand: true,
                    cwd: 'public_html/',
                    src: ['*.html'],
                    dest: 'public_html/'
                }]
            }
        },

        lineremover: {
            prod: {
                files: [{
                    expand: true,
                    cwd: 'public_html/',
                    src: '*.html',
                    dest: 'public_html/'
                }]
            }
        },

        copy: {
        	php: { cwd: 'src/php/', dest: 'public_html/', expand: true, src: '**' },
        	xml: { cwd: 'src/xml/', dest: 'public_html/', expand: true, src: '**' },
            images: { cwd: 'src/images/', dest: 'public_html/images', expand: true, src: '**' },
            twitter: { cwd: 'src/twitter/', dest: 'public_html/twitter', expand: true, src: '**' },
            htaccess: { cwd: './', dest: 'public_html/', expand: true, dot: true, src: '.htaccess' }
        },

        clean: {
        	html: 'public_html/*.html',
        	php: 'public_html/*.php',
            stylesheets: 'public_html/css/',
            js: 'public_html/js/',
            temp: 'public_html/js/temp',
            all: 'public_html/' // remove the whole lot and start fresh
        },

        server: grunt.file.readJSON('server.json'),

        sshexec: {
            clearJsAndCss: {
                command: [
                    'rm -rf /home/44154/users/.home/domains/staging.fianium.com/html/css ',
                    ' rm -rf /home/44154/users/.home/domains/staging.fianium.com/html/js '
                ].join(';'),
                options: {
                    host: '<%= server.host %>',
                    username: '<%= server.username %>',
                    password: '<%= server.password %>',
                    showProgress: true
                }
            }
        },
 
        sftp: {
            prod: {
                files: {
                    "./": "public_html/**"
                },
                options: {
                    path: '/home/44154/users/.home/domains/staging.fianium.com/html',
                    host: '<%= server.host %>',
                    username: '<%= server.username %>',
                    password: '<%= server.password %>',
                    showProgress: true,
                    srcBasePath: 'public_html/',
                    createDirectories: true
                }
            }
        },

        prompt: {
            gitcommit: {
                options: {
                    questions: [{
                        config: 'gitmessage',
                        type: 'input',
                        message: 'Commit message (summarise what was changed)'
                    }]
                }
            }
        },

        shell: {
            commit: {
                command: [
                    'git add -A',
                    'git commit -m "<%= gitmessage %>"',
                    'git push origin live',
                    'git status'
                ].join('&&')
            }
        },
        
        buildcontrol: {
            options: {
                dir: 'src/',
                commit: true,
                push: true,
                message: '<%=grunt.config("gitmessage")%>'
            },
            fianiumServer: {
                options: {
                    remote: 'ssh://bozor@github.com/bozor/menu.git',
                    branch: 'live'
                }
            }
        }

    });
    
    grunt.registerTask('stylesheets:dev', ['sass:dev']);
    grunt.registerTask('stylesheets:prod', ['sass:prod']);
    grunt.registerTask('js:dev', ['bower_concat:dev', 'concat:dev', 'uglify:dev']);
    grunt.registerTask('js:prod', ['bower_concat:prod', 'concat:prod', 'uglify:prod', 'clean:temp']);

    grunt.registerTask('dev', ['clean:all', 'stylesheets:dev', 'js:dev', 'assemble', 'targethtml:dev', 'newer:copy']);
    grunt.registerTask('prod', ['clean:all', 'stylesheets:prod', 'js:prod', 'assemble', 'targethtml:prod', 'newer:imagemin:all', 'copy:xml', 'copy:php', 'copy:twitter', 'copy:htaccess', 'hashres', 'lineremover:prod']);
    
    
    grunt.registerTask('build', ['prod']);
    grunt.registerTask('publish', ['prod', 'sshexec:clearJsAndCss', 'sftp:prod']);
    grunt.registerTask('commit', ['prompt', 'shell']);
    grunt.registerTask('default', ['dev', 'php', 'watch']);
};
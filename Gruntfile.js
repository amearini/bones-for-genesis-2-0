// See: http://24ways.org/2013/grunt-is-not-weird-and-hard/
module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			build: {
				src: ['build']
			}
		},

		csscomb: {
			options: {
				config: 'config/csscomb.json'
			},
			build: {
				expand: true,
				cwd: 'sass/',
				src: ['**/*.scss', '!_mixins.scss'],
				dest: 'sass/'
			}
		},

		postcss: {
			scss: {
				options: {
					syntax: require('postcss-scss'),
					processors: [
						require('postcss-flexbugs-fixes'),
						require('postcss-line-height-px-to-unitless'),
						require('postcss-gradient-transparency-fix')
					]
				},
				src: 'sass/**/*.scss'
			},
			css: {
				options: {
					processors: [
						require('postcss-import'),
						require('postcss-assets'),
						require('postcss-color-rgba-fallback'),
						require('postcss-focus'),
						require('postcss-will-change'),
						require('autoprefixer')({
							cascade: true,
							flexbox: false
						})
					]
				},
				src: 'build/css/**/*.css'
			},
			mainOnly: {
				options: {
					processors: [
						require('postcss-normalize')
					]
				},
				src: 'build/css/style.css'
			}
		},

		sass: {
			options: {
				style: 'expanded',
				precision: 3
			},
			build: {
				files: {
					'build/css/style.css': 'sass/style.scss',
					'build/css/admin.css': 'sass/admin.scss'
				}
			}
		},

		jshint: {
			options: {
				strict: true,
				laxbreak: true
			},
			build: {
				files: {
					src: ['js/**/*.js']
				}
			}
		},

		eslint: {
			options: {
				configFile: 'config/eslint.json'
			},
			build: {
				files: {
					src: ['js/**/*.js']
				}
			}
		},

		shell: {
			prettier: {
				command: 'prettier --use-tabs --single-quote --parser=flow --write js/**/*.js'
			}
		},

		concat: {
			build: {
				src: [
					'node_modules/include-media-export/include-media.js',
					'node_modules/fitvids/dist/fitvids.js',
					'js/scripts.js'
				],
				dest: 'build/js/scripts.js',
				nonull: true
			},
			admin: {
				src: [
					'js/admin.js'
				],
				dest: 'build/js/admin.js',
				nonull: true
			}
		},

		uglify: {
			options: {
				preserveComments: 'some'
			},
			build: {
				files: {
					'build/js/scripts.min.js': 'build/js/scripts.js',
					'build/js/admin.min.js': 'build/js/admin.js'
				}
			}
		},

		csso: {
			options: {
				report: 'min'
			},
			build: {
				files: {
					'build/css/style.min.css': ['build/css/style.css'],
					'build/css/admin.min.css': ['build/css/admin.css']
				}
			}
		},

		imagemin: {
			options: {
				cache: false // Bug: https://github.com/gruntjs/grunt-contrib-imagemin/issues/140
			},
			build: {
				files: [{
					expand: true,
					cwd: 'images/',
					src: ['**/*.{png,jpg,gif,svg}'],
					dest: 'build/images/'
				}]
			}
		},

		watch: {
			js: {
				files: ['js/**/*.js'],
				tasks: ['concat'],
				options: {
					spawn: false
				}
			},

			css: {
				files: ['sass/**/*.scss'],
				tasks: ['sass', 'postcss:css'],
				options: {
					spawn: false
				}
			},

			images: {
				files: ['images/**/*'],
				tasks: ['newer:imagemin', 'sass', 'postcss:css'],
				options: {
					spawn: false
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-csscomb');
	grunt.loadNpmTasks('grunt-csso');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-postcss');

	grunt.registerTask('default', ['clean', 'imagemin', 'sass', 'concat', 'postcss:css', 'postcss:mainOnly', 'watch']);
	grunt.registerTask('build', ['clean', 'imagemin', 'csscomb', 'postcss:scss', 'sass', 'jshint', 'eslint', 'shell', 'concat', 'uglify', 'postcss:css', 'postcss:mainOnly', 'csso']);

};

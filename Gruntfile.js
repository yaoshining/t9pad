// Generated on 2014-08-26 using generator-html5-app 0.0.3
"use strict";

// # Globbing
// for performance reasons we"re only matching one level down:
// "test/spec/{,*/}*.js"
// use this if you want to recursively match all subfolders:
// "test/spec/**/*.js"

module.exports = function (grunt) {
	var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
	// Load grunt tasks automatically
	require("load-grunt-tasks")(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require("time-grunt")(grunt);

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		yeoman: {
			// Configurable paths
			app: "app",
			dist: "dist"
		},

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: ["<%= yeoman.app %>/scripts/{,*/}*.js"],
				tasks: ["jshint"],
				options: {
					livereload: true
				}
			},
			jstest: {
				files: ["test/spec/{,*/}*.js"],
				tasks: ["test:watch"]
			},
			gruntfile: {
				files: ["Gruntfile.js"]
			},
			styles: {
				files: ["<%= yeoman.app %>/styles/{,*/}*.css"],
				tasks: ["newer:copy:styles", "autoprefixer"]
			},
			livereload: {
				options: {
					livereload: "<%= connect.options.livereload %>"
				},
				files: [
					"<%= yeoman.app %>/{,*/}*.html",
					".tmp/styles/{,*/}*.css",
					"<%= yeoman.app %>/img/{,*/}*.{gif,jpeg,jpg,png,svg,webp}"
				]
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				livereload: 35729,
				// Change this to "0.0.0.0" to access the server from outside
				hostname: "0.0.0.0"
			},
			server: {
		        options: {
		          port: 8000,
		          base: 'public',
		          logger: 'dev',
		          hostname: 'localhost',
		          middleware: function (connect, options) {
		             var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
		             return [
		                // Include the proxy first
		                proxy,
		                // Serve static files.
		                connect.static(options.base),
		                // Make empty directories browsable.
		                connect.directory(options.base)
		             ];
		          }
		        },
		        proxies: [
		          {
		              context: '/MusicYao',
		              host: '114.215.109.39',
		              port: '7001',
		              https: false,
		              changeOrigin: true
		          }
		        ]
	    	},
			livereload: {
				options: {
					open: true,
					base: [
						".tmp",
						"<%= yeoman.app %>"
					],
					middleware: function (connect, options) {
						if (!Array.isArray(options.base)) {
						  options.base = [options.base];
						}

						// Setup the proxy
						var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

						// Serve static files.
						options.base.forEach(function(base) {
						  middlewares.push(connect.static(base));
						});

						// Make directory browse-able.
						var directory = options.directory || options.base[options.base.length - 1];
						middlewares.push(connect.directory(directory));

						return middlewares;
		          	}
				},
				proxies: [
		          {
		              context: '/t9',
		              host: '127.0.0.1',
		              port: '88',
		              https: false,
		              changeOrigin: true
		          }
		        ]
			},
			test: {
				options: {
					port: 9001,
					base: [
						".tmp",
						"test",
						"<%= yeoman.app %>"
					]
				}
			},
			dist: {
				options: {
					open: true,
					base: "<%= yeoman.dist %>",
					livereload: false
				}
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						".tmp",
						"<%= yeoman.dist %>/*",
						"!<%= yeoman.dist %>/.git*"
					]
				}]
			},
			server: ".tmp"
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: ".jshintrc",
				reporter: require("jshint-stylish")
			},
			all: [
				"Gruntfile.js",
				"<%= yeoman.app %>/scripts/{,*/}*.js",
				"!<%= yeoman.app %>/scripts/vendor/*",
				"test/spec/{,*/}*.js"
			]
		},







		// Add vendor-prefixed styles
		autoprefixer: {
			options: {
				// browsers: ["last 1 version"]
			},
			dist: {
				files: [{
					expand: true,
					cwd: ".tmp/styles/",
					src: "{,*/}*.css",
					dest: ".tmp/styles/"
				}]
			}
		},
		// Automatically inject Bower components into the HTML file
		"bower-install": {
			app: {
				html: "<%= yeoman.app %>/index.html",
				ignorePath: "<%= yeoman.app %>/"
			}
		},

		// Renames files for browser caching purposes
		rev: {
			dist: {
				files: {
					src: [
						"<%= yeoman.dist %>/scripts/{,*/}*.js",
						"<%= yeoman.dist %>/styles/{,*/}*.css",
						"<%= yeoman.dist %>/img/{,*/}*.{gif,jpeg,jpg,png,webp}",
						"<%= yeoman.dist %>/styles/fonts/{,*/}*.*"
					]
				}
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			options: {
				dest: "<%= yeoman.dist %>"
			},
			html: "<%= yeoman.app %>/index.html"
		},

		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			options: {
				assetsDirs: ["<%= yeoman.dist %>"]
			},
			html: ["<%= yeoman.dist %>/{,*/}*.html"],
			css: ["<%= yeoman.dist %>/styles/{,*/}*.css"]
		},

		// The following *-min tasks produce minified files in the dist folder
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: "<%= yeoman.app %>/img",
					src: "{,*/}*.{gif,jpeg,jpg,png}",
					dest: "<%= yeoman.dist %>/img"
				}]
			}
		},
		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: "<%= yeoman.app %>/img",
					src: "{,*/}*.svg",
					dest: "<%= yeoman.dist %>/img"
				}]
			}
		},
		htmlmin: {
			dist: {
				options: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					removeAttributeQuotes: true,
					removeCommentsFromCDATA: true,
					removeEmptyAttributes: true,
					removeOptionalTags: true,
					removeRedundantAttributes: true,
					useShortDoctype: true
				},
				files: [{
					expand: true,
					cwd: "<%= yeoman.dist %>",
					src: "{,*/}*.html",
					dest: "<%= yeoman.dist %>"
				}]
			}
		},

		// By default, your `index.html`"s <!-- Usemin block --> will take care of
		// minification. These next options are pre-configured if you do not wish
		// to use the Usemin blocks.
		// cssmin: {
		//	 dist: {
		//		 files: {
		//			 "<%= yeoman.dist %>/styles/main.css": [
		//				 ".tmp/styles/{,*/}*.css",
		//				 "<%= yeoman.app %>/styles/{,*/}*.css"
		//			 ]
		//		 }
		//	 }
		// },
		// uglify: {
		//	 dist: {
		//		 files: {
		//			 "<%= yeoman.dist %>/scripts/scripts.js": [
		//				 "<%= yeoman.dist %>/scripts/scripts.js"
		//			 ]
		//		 }
		//	 }
		// },
		// concat: {
		//	 dist: {}
		// },

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: "<%= yeoman.app %>",
					dest: "<%= yeoman.dist %>",
					src: [
						"*.{ico,png,txt}",
						".htaccess",
						"img/{,*/}*.webp",
						"{,*/}*.html",
						"styles/fonts/{,*/}*.*",
						"bower_components/" + (this.includeCompass ? "sass-" : "") + (this.includeCompass ? "fonts/" : "dist/fonts/") +"*.*"
					]
				}]
			},
			styles: {
				expand: true,
				dot: true,
				cwd: "<%= yeoman.app %>/styles",
				dest: ".tmp/styles/",
				src: "{,*/}*.css"
			}
		},


		// Generates a custom Modernizr build that includes only the tests you
		// reference in your app
		modernizr: {
			devFile: "<%= yeoman.app %>/bower_components/modernizr/modernizr.js",
			outputFile: "<%= yeoman.dist %>/bower_components/modernizr/modernizr.js",
			files: [
				"<%= yeoman.dist %>/scripts/{,*/}*.js",
				"<%= yeoman.dist %>/styles/{,*/}*.css",
				"!<%= yeoman.dist %>/scripts/vendor/*"
			],
			uglify: true
		},

		// Run some tasks in parallel to speed up build process
		concurrent: {
			server: [
				"copy:styles"
			],
			test: [
				"copy:styles"
			],
			dist: [
				"copy:styles",
				"imagemin",
				"svgmin"
			]
		}
	});

	grunt.loadNpmTasks('grunt-connect-proxy');
	grunt.registerTask("serve", function (target) {
		if (target === "dist") {
			return grunt.task.run(["build", "connect:dist:keepalive"]);
		}

		grunt.task.run([
			"clean:server",
			'configureProxies:livereload',
			"concurrent:server",
			"autoprefixer",
			"connect:livereload",
			"watch"
		]);
	});

	grunt.registerTask("server", function () {
		grunt.log.warn("The `server` task has been deprecated. Use `grunt serve` to start a server.");
		grunt.task.run(["serve"]);
	});

	grunt.registerTask("test", function(target) {
		if (target !== "watch") {
			grunt.task.run([
				"clean:server",
				"concurrent:test",
				"autoprefixer",
			]);
		}

		grunt.task.run([
			"connect:test",
		]);
	});

	grunt.registerTask("build", [
		"clean:dist",
		"useminPrepare",
		"concurrent:dist",
		"autoprefixer",
		"concat",
		"cssmin",
		"uglify",
		"copy:dist",
		"modernizr",
		"rev",
		"usemin",
		"htmlmin"
	]);

	grunt.registerTask("default", [
		"newer:jshint",
		"test",
		"build"
	]);
};
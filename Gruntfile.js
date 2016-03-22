module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		uglify: { 
			build: {
				expand: true,
				cwd: 'src/chrome-tool',
				src: ['*.js', '!jquery.js'], 
				dest: 'chrome-tool' 
			} 
		},
		cssmin: {
		  target: {
		    files: [{
				cwd: 'src/chrome-tool',
				src: ['*.css'], 
				dest: 'chrome-tool', 
		      	ext: '.css'
		    }]
		  }
		}
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	
    grunt.registerTask('default', ['uglify', 'cssmin']);
};
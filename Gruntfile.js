module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		uglify: { 
			build: {
				expand: true,
				cwd: 'src/chrome-tool',
				src: ['*.js', '*.css'], 
				dest: 'chrome-tool' 
			} 
		},
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify']);
};
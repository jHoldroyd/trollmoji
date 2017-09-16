module.exports = (grunt) => {
  // Start grunt
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  })

  // Enable test runner
  grunt.loadNpmTasks('grunt-run')
  grunt.config('run', {
    lint: {
      exec: 'npm run lint'
    }
  })

  // Watch for file changes
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.config('watch', {
    test: {
      files: ['app/**/*.js'],
      tasks: ['run:lint']
    }
  })
}

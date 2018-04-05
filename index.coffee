###*
# Metalsmith site generation
###
metalsmith  = require "metalsmith"

# Plugins
concat      = require "metalsmith-concat-convention"
inplace     = require "metalsmith-in-place"
minify      = require "metalsmith-clean-css"
uglify      = require "metalsmith-uglify"

# Build the website
metalsmith __dirname
    .source "src"
    .destination "dest"
    .metadata
        site:
            title: "Impression"

    # Concatenate JS and CSS
    .use concat
        extname: ".concat"

    # Render ECO to HTML
    .use inplace()

    # Minify CSS
    .use minify
        files: ["src/scripts/**/*.css"]

    # Uglify JS
    .use uglify
        sameName: true

    .build (err) ->
        if err then throw err

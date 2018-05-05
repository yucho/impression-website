###*
# JS API for Metalsmith site generation
###
metalsmith  = require "metalsmith"


# Read config
path        = require "path"
jsonfile    = require "jsonfile"
config      = jsonfile.readFileSync path.join __dirname, "metalsmith.json"
plugins     = config.plugins


# Create Metalsmith instance
builder = metalsmith __dirname
    .source config.source
    .destination config.destination
    .metadata config.metadata

# Run all plugins in correct order
for plugin in plugins
    for name of plugin
        builder = builder.use require(name) plugin[name]

# Build and catch
builder.build (err) ->
        if err then throw err

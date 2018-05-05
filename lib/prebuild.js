const path      = require("path");
const {URL}     = require("url");
const yargs     = require("yargs");

const collection    = require("metalsmith-collections");
const serve         = require("metalsmith-serve");


/**
 * Prebuild tasks
 */
module.exports = opts => (files, metalsmith, done) => {
    // Metadata
    const metadata = metalsmith.metadata();

    // Node arguments
    const argv = yargs.argv;


    // Add custom metadata
    const tasks = new Promise(resolve => {
        const metatoadd = {};

        // Local server configuration
        if(argv.serve) {
            if(Number.isInteger(argv.serve)) metatoadd.portserve = argv.serve;
            else metatoadd.portserve = 8080;
        }

        Object.assign(metadata, metatoadd);

        resolve();
    });


    // Modify Metalsmith metadata
    tasks.then(() => new Promise(resolve => {
        // Convert URL string to URL object
        if(metadata.portserve) metadata.site.url = new URL(`http://localhost:${metadata.portserve}`);
        else metadata.site.url = new URL(metadata.site.url)

        resolve();
    }));


    // Modify files metadata
    tasks.then(() => new Promise(resolve => {
        // Add basename property to each file
        const filenames = Object.keys(files);
        for(let i = 0; i < filenames.length; i += 1) {
            const filename = filenames[i];
            const basename = path.basename(filename);

            files[filename].basename = basename;
        }

        resolve();
    }));


    // Create collections
    tasks.then(() => new Promise(resolve => {
        // Collection of images
        collection({
            images: { pattern: "images/*.@(gif|jpg|jpeg|png|svg)" }
        })(files, metalsmith, resolve);
    }));


    // Add template helpers
    tasks.then(() => new Promise(resolve => {
        Object.assign(metadata, {
            // Gets the site root URL
            getrooturl: function() {
                return this.site.url.href;
            },

            // Gets the URL of current file
            geturl: function() {
                const url = new URL(this.site.url);
                url.pathname = this.url;
                return url.href;
            },
        });

        resolve();
    }));


    // Run serve if requested
    tasks.then(() => new Promise(resolve => {
        if(metadata.portserve) serve({port: metadata.portserve})(files, metalsmith, resolve);
    }));


    // Done with all the tasks
    tasks.then(() => done());
};

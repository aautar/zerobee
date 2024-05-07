import * as fs from 'fs'

const indexHtmlPackage = function(options) {
    return {
        name: 'indexHtmlPackagePlugin',
        writeBundle(bundleOpts, bundle) {
            console.log(`Creating index.html page...`);
            const jsSrc = bundle[options.srcBundleName].code;
            const jsSrcModuleExported = options.sourceCodeExportedVar;
            const htmlWrap = `
                <!DOCTYPE html>
                <html>
                    <body>
                        <script type="module">
                            ${jsSrc}
                            window.${jsSrcModuleExported} = ${jsSrcModuleExported};
                        </script>
                
                        <script type="module">
                            const zb = new window.${jsSrcModuleExported}(window);
                            zb.load();
                        </script>
                    </body>
                </html>`.trim();

            options.dest.forEach((_dest) => {
                fs.writeFile(_dest, htmlWrap, function(err) {
                    if(err) {
                        throw err;
                    }
    
                    console.log(`index.html created -> ${_dest}`);
                });
            });
        }
    };
};


export default indexHtmlPackage;

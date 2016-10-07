/**
 * Runs the daily process.
 */

var childProcess = require ( 'child_process' );
var path = require ( 'path' );
var yaml = require ( 'yamljs' );
var wikimediaCommons = require ( 'wikimedia-commons' );

var config = yaml.load ( path.resolve ( __dirname, 'config.yml' ) )

console.log ( "Getting daily image from Wikimedia Commons." );

// wikimediaCommons.dailypic ();

// use execSync because
childProcess.execSync ( 'node node_modules/wikimedia-commons dailypic' );

console.log ( "Using PrimitivePic to generate abstract variants." )
for ( var i = 0; i < config.primitive_pic.conversions.length; ++i )
{
    
    var conversion = config.primitive_pic.conversions [i];
    console.log ( conversion.description );
    var command = config.primitive_pic.path + ' -i ' + path.resolve ( __dirname, 'node_modules', 'wikimedia-commons', 'output', 'latest.jpg' ) +
        ' -o ' + path.resolve ( __dirname, 'tmp', conversion.slug + '.jpg' ) + ' -m ' + conversion.mode + ' -n ' + conversion.iterations;
    
    childProcess.execSync ( command );
}

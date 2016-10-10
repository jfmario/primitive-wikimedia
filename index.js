/**
 * Runs the daily process.
 */

var childProcess = require ( 'child_process' );
var moment = require ( 'moment' );
var path = require ( 'path' );
var yaml = require ( 'yamljs' );
var wikimediaCommons = require ( 'wikimedia-commons' );

var config = yaml.load ( path.resolve ( __dirname, 'config.yml' ) )
var today = moment ().format ( 'YYYY/MM/DD' );

console.log ( "Getting daily image from Wikimedia Commons." );

// wikimediaCommons.dailypic ();

// use execSync because
console.log ( childProcess.execSync ( 'node node_modules/wikimedia-commons dailypic' ) );

console.log ( "Using PrimitivePic to generate abstract variants." );

for ( var i = 0; i < config.primitive_pic.conversions.length; ++i )
{
    
    var conversion = config.primitive_pic.conversions [i];
    console.log ( conversion.description );
    var command = config.primitive_pic.path + ' -i ' + path.resolve ( __dirname, 'node_modules', 'wikimedia-commons', 'output', 'latest.jpg' ) +
        ' -o ' + path.resolve ( __dirname, 'tmp', conversion.slug + '.jpg' ) + ' -m ' + conversion.mode + ' -n ' + conversion.iterations;
    
    console.log ( command );
    console.log ( childProcess.execSync ( command ) );
}

console.log ( "Uploading files to Amazon S3." );

for ( var i = 0; i < config.primitive_pic.conversions.length; ++i )
{
    
    var conversion = config.primitive_pic.conversions [i];
    var command = 'aws s3 cp ' + path.resolve ( __dirname, 'tmp', conversion.slug + '.jpg' ) + ' s3://' + config.s3.bucket_name +
        '/' + config.s3.project_dir + '/' + today + '/' + conversion.slug + '.jpg';
    
    childProcess.execSync ( command );
}

console.log ( "Posting blog post to www.johnfmarion.com." )

childProcess.execSync ( "expect scripts/bash/blog-post.secret.sh" )

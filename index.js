/**
 * Runs the daily process.
 */

var childProcess = require ( 'child_process' );
var fs = require ( 'fs' );
var moment = require ( 'moment' );
var path = require ( 'path' );
var Twitter = require ( 'twitter' );
var yaml = require ( 'yamljs' );
var wikimediaCommons = require ( 'wikimedia-commons' );

var config = yaml.load ( path.resolve ( __dirname, 'config.yml' ) );
var secretConfig = yaml.load ( path.resolve ( __dirname, 'config.secret.yml' ) );
var today = moment ().format ( 'YYYY/MM/DD' );
var twitter = new Twitter ( secretConfig.twitter );

console.log ( "Getting daily image from Wikimedia Commons." );
// wikimediaCommons.dailypic ();
// use execSync because
console.log ( childProcess.execSync ( 'node node_modules/wikimedia-commons dailypic' ).toString () );
console.log ( "Using PrimitivePic to generate abstract variants." );

for ( var i = 0; i < config.primitive_pic.conversions.length; ++i )
{
    
    var conversion = config.primitive_pic.conversions [i];
    console.log ( conversion.description );
    var command = config.primitive_pic.path + ' -i ' + path.resolve ( __dirname, 'node_modules', 'wikimedia-commons', 'output', 'latest.jpg' ) +
        ' -o ' + path.resolve ( __dirname, 'tmp', conversion.slug + '.jpg' ) + ' -m ' + conversion.mode + ' -n ' + conversion.iterations;
    
    console.log ( command );
    console.log ( childProcess.execSync ( command ).toString () );
}

console.log ( "Uploading files to Amazon S3." );

for ( var i = 0; i < config.primitive_pic.conversions.length; ++i )
{
    
    var conversion = config.primitive_pic.conversions [i];
    var command = 'aws s3 cp ' + path.resolve ( __dirname, 'tmp', conversion.slug + '.jpg' ) + ' s3://' + config.s3.bucket_name +
        '/' + config.s3.project_dir + '/' + today + '/' + conversion.slug + '.jpg';
    
    console.log ( command );
    console.log ( childProcess.execSync ( command ).toString () );
}

console.log ( "Posting blog post to www.johnfmarion.com." );
console.log ( childProcess.execSync ( "expect scripts/bash/blog-post.secret.sh" ).toString () );

var imgData = fs.readFileSync ( path.resolve ( __dirname, 'tmp', 'tri800.jpg' ) );
twitter.post ( 'media/upload', { media: imgData }, function ( err, med, res )
    {
        
        if ( err ) { console.log ( err ); return; }
        
        var status = {
            media_ids: med.media_id_string
            status: "Primitive Wikimedia - thanks to PrimitivePic. https://github.com/fogleman/primitive"
        }
        twitter.post ( 'statuses/update', status, function ( err, twt, res )
            {
                if ( err ) { console.log ( err ); return; }
                console.log ( twt );
            }
        );
    }
);

#!/usr/bin/env node

var parseArgs = require('minimist');
var AtlasApiClient = require('atlasmanager').AtlasApiClient;
var fs = require('fs');
var help = require(__dirname + '/help');

// parse command line arguments and route to appropriate action
var args = parseArgs(process.argv.slice(2));


if (args._.length > 1) {
    throw new Error("Error: there should only be one argument");
} else if (args._.length < 1 || args["help"] != null) {
    help.displayHelpMessage(function (message) {
        console.log(message);
        process.exit();
    });
} else {

    //setup
    var atlascluster = new AtlasApiClient(args.projectid, args.apikey, args.username);
    var clusterdefinition;
    if(args.clusterdefinition){
        clusterdefinition = JSON.parse(args.clusterdefinition);
    } else if(args.clusterdefinitionfile){
        clusterdefinition = JSON.parse(fs.readFileSync(args.clusterdefinitionfile));
    }

    switch (args._[0]) {
        case ("getclusterinfo"):
            atlascluster.printclusterinfo(args.clustername);
            break;
        case ("getclusternames"):
            atlascluster.getclusternames(function(err,names){
                names.forEach((name) => {
                    console.log(name);
                })
            });
            break;
        case ("createcluster"):
            atlascluster.createcluster(clusterdefinition, function(err,cluster){
                if(err){
                    console.log(err);
                }
                console.log(cluster);
            });
            break;
        case ("deletecluster"):
            atlascluster.deletecluster(args.clustername, args.hasOwnProperty("all"), function(err,result){
                if(err){
                    console.log(err);
                }
                console.log(result);
            });
            break;
        case ("modifycluster"):
            atlascluster.modifycluster(args.clustername, clusterdefinition);
            break;
        case ("pausecluster"):
            atlascluster.pausecluster(args.clustername);
            break;
        case ("resumecluster"):
            atlascluster.resumecluster(args.clustername);
            break;
        case ("help"):
            help.displayHelpMessage(function (message) {
                console.log(message);
                process.exit();
            });
            break;
        default:
            throw new Error("Invalid input");
            break;
    }

}
const fs = require('fs');

module.exports = {
    displayHelpMessage: function(callback){
        var file = fs.readFile(__dirname + "/help.txt",'utf-8',function(err,data){
            if(err){
                console.log(err);
            }
            callback(data);
        })
    }
}
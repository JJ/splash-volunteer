var request = require("request");

var exports = module.exports = {};


exports.sendMessage = function(token,id,message){
    var url = "https://api.telegram.org/bot"+token+"/sendMessage?text="+message+"&chat_id="+id
    request({
        uri: url,
        method: "GET",
        timeout: 10000,
        followRedirect: false,
        maxRedirects: 10,
      }, function(error, response, body) {
        console.log("Bot finish");
        return;
      });
  };

BearjoyH5Sdk.channelJsFiles = ["http://static.jiongshu.com/jiongshu/jiongshusdk.js?v=0.0.10"];

BearjoyH5Sdk.checkLogin = function (json, callback) {
    var returnData = {result:0, msg:"success"};
    var rs = BearjoyH5Sdk.getAllParam();
    BearjoyH5Sdk.loadjs(BearjoyH5Sdk.channelJsFiles, function () {
        if (rs["token"]) {
            BearjoyH5Sdk.playerId = rs["bearjoyId"];
            BearjoyH5Sdk.addCookie('BearjoyH5SdkPlayerId', rs["bearjoyId"], 240);
            returnData["token"] = rs["token"];
            returnData["id"] = rs["bearjoyId"];
            callback(returnData);
            return;
        }
        returnData['result'] = 1;
        callback(returnData);
        return;
    });
}


BearjoyH5Sdk.pay = function(json, callback) {
    var returnData = {result:0, msg:"success"};

    if(typeof json == "string") {
        var orderInfo = eval("(" + json + ")");
    } else {
        var orderInfo = json;
    }

    var playerId = BearjoyH5Sdk.getPlayerId();
    if (!playerId) {
        var returnData = {result:-2, msg:"no playerId,Please take all the parameters of egret transmission."};
        callback( returnData);
        return;
    }

    var postUrl = BearjoyH5Sdk.apiServerUrl + '/user/placeOrder?';
    postUrl = postUrl + 'id=' + playerId + '&appId=' + BearjoyH5Sdk.gameId + '&goodsId=' + orderInfo.goodsId + '&goodsNumber=1&serverId=' + orderInfo.serverId;
    postUrl = postUrl + '&ext=' + orderInfo.ext + '&runtime=' + orderInfo.runtime;

    var rs = BearjoyH5Sdk.getAllParam();
    BearjoyH5Sdk.sendUrl(postUrl, function (dataObj) {
        BearjoyH5Sdk.loadjs(BearjoyH5Sdk.channelJsFiles, function () {
            JiongshuSdk.pay(dataObj.data.paydsn, function (obj) {
                if (obj['message'] == 'success') {
                    callback(returnData)
                } else if(obj['message'] == 'cannel') {
                    returnData['result'] = -100;
                    returnData['msg'] = 'pay cancel';
                    callback(returnData);
                }else {
                    returnData['result'] = -1;
                    returnData['msg'] = 'pay fail';
                    callback(returnData);
                }
            });
        });
    });
};

BearjoyH5Sdk.initShare = function(shareData, callback) {
    shareData['success'] = callback;
    BearjoyH5Sdk.shareData = shareData;

    var shareInfo = {
        "title" : BearjoyH5Sdk.shareData['title'],
        "desc" : BearjoyH5Sdk.shareData['description'],
        "imgUrl" : BearjoyH5Sdk.shareData['imgUrl'],
        "link": BearjoyH5Sdk.shareData['link']
    }
    JiongshuSdk.share(shareInfo, function () {
        var returnData = {result: 0, msg: "success"};
        BearjoyH5Sdk.shareData['success'](returnData);
    });
}

// 展示分享
BearjoyH5Sdk.showShare = function(shareData, callback) {
    BearjoyH5Sdk.initShare(shareData, callback);
}
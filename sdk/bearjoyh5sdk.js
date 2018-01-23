/**
 * Created by cornor on 2017/3/1.
 */
window.BearjoyH5Sdk = {};
BearjoyH5Sdk.loadedJsFiles = {};
BearjoyH5Sdk.channelId;
BearjoyH5Sdk.gameId;
BearjoyH5Sdk.jsFileUrl;
BearjoyH5Sdk.apiServerUrl;
BearjoyH5Sdk.isShouq = false;
BearjoyH5Sdk.shouqQueryString = false;
BearjoyH5Sdk.shareData;
if (window.OPEN_DATA && window.OPEN_DATA['appid']){
    BearjoyH5Sdk.isShouq = true;
}

BearjoyH5Sdk.loadjs = function (scripts, callback) {
    if (typeof(scripts) != "object") {
        var scripts = [scripts]
    }
    var haveLoaded = true;
    for (var i = 0; i < scripts.length; i++) {
        if (!BearjoyH5Sdk.loadedJsFiles[scripts[i]]) {
            haveLoaded = false;
            BearjoyH5Sdk.loadedJsFiles[scripts[i]] = 1
        }
    }
    if (haveLoaded) {
        callback();
        return
    }
    var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement;
    var s = new Array(), last = scripts.length - 1, recursiveLoad = function (i) {
        s[i] = document.createElement("script");
        s[i].setAttribute("type", "text/javascript");
        s[i].onload = s[i].onreadystatechange = function () {
            if (!0 || this.readyState == "loaded" || this.readyState == "complete") {
                this.onload = this.onreadystatechange = null;
                this.parentNode.removeChild(this);
                if (i != last) {
                    recursiveLoad(i + 1)
                } else {
                    callback()
                }
            }
        };
        s[i].setAttribute("src", scripts[i]);
        HEAD.appendChild(s[i])
    };
    recursiveLoad(0)
};
BearjoyH5Sdk.getAllParam = function () {
    var url = BearjoyH5Sdk.isShouq ? BearjoyH5Sdk.shouqQueryString : location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            var tmpStrs = strs[i].split("=");
            if (tmpStrs.length > 2) {
                var string = strs[i].split(tmpStrs[0] + "=");
                theRequest[tmpStrs[0]] = decodeURIComponent(string[1])
            } else {
                theRequest[tmpStrs[0]] = decodeURIComponent(tmpStrs[1])
            }
        }
    }

    return theRequest
};
BearjoyH5Sdk.setChannelId = function () {
    var allUrlParam = BearjoyH5Sdk.getAllParam();
    if (allUrlParam["channelIdbj"]) {
        BearjoyH5Sdk.channelId = allUrlParam["channelIdbj"]
    } else if (allUrlParam["channelId"]) {
        BearjoyH5Sdk.channelId = allUrlParam["channelId"]
    } else {
        return false;
    }
    return true
};
BearjoyH5Sdk.setGameId = function () {
    var allUrlParam = BearjoyH5Sdk.getAllParam();
    if (allUrlParam["appIdbj"]) {
        BearjoyH5Sdk.gameId = allUrlParam["appIdbj"]
    } else if (allUrlParam["appId"]) {
        BearjoyH5Sdk.gameId = allUrlParam["appId"]
    } else {
       return false;
    }
    return true
};
BearjoyH5Sdk.decryptString = function (str) {
    str = decodeURIComponent(str);
    var xc = "", xd = new Array(), xe = "", xf = 0;
    for (i = 0; i < str.length; i++) {
        xa = str.charCodeAt(i);
        if (xa < 128) {
            xa = xa ^ 7
        }
        xe += String.fromCharCode(xa);
        if (xe.length > 80) {
            xd[xf++] = xe;
            xe = ""
        }
    }
    xc = xd.join("") + xe;
    return xc
};
BearjoyH5Sdk.init = function (json, callback) {
    var returnData = {result: 0, msg: "success"};
    var setChannelIdRs = BearjoyH5Sdk.setChannelId();
    var setGameIdRs = BearjoyH5Sdk.setGameId();
    if (!setChannelIdRs) {
        returnData["result"] = -2;
        returnData["msg"] = "no channelId.";
        callback(returnData);
        return
    } else {
        if (!setGameIdRs) {
            returnData["result"] = -2;
            returnData["msg"] = "no gameId.";
            callback(returnData);
            return
        }
    }
    var allUrlParam = BearjoyH5Sdk.getAllParam();
    if (!allUrlParam["sdkDomain"] || !allUrlParam["serverDomain"]) {
        returnData["result"] = -2;
        returnData["msg"] = "sdkDomain or serverDomain is null.";
        callback(returnData);
        return
    }

    BearjoyH5Sdk.jsFileUrl = allUrlParam["sdkDomain"] + "/misc/scripts/";
    BearjoyH5Sdk.apiServerUrl = allUrlParam["serverDomain"];
    var jsFileVersion = allUrlParam["jsvnbj"] ? allUrlParam["jsvnbj"] : new Date().getTime();
    var bearjoyChannelJsUrl = "";
    var allUrlParam = BearjoyH5Sdk.getAllParam();
    var chls = allUrlParam["chlsbj"] ? allUrlParam["chlsbj"] : allUrlParam["chls"];
    if (chls) {
        var extendJsUrl = BearjoyH5Sdk.jsFileUrl + "bearjoyh5sdk_extend_channels.js?v=" + jsFileVersion;
        bearjoyChannelJsUrl = BearjoyH5Sdk.jsFileUrl + "channelsdk/bearjoyh5sdk_" + chls + ".js?v=" + jsFileVersion
    }
    var jsFiles = [extendJsUrl, bearjoyChannelJsUrl];
    BearjoyH5Sdk.loadjs(jsFiles, function () {
        callback(returnData)
    })
};

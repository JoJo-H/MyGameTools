/**
 * Created by cornor on 2017/3/1.
 */
window.BearjoyH5SdkConfig = {
    code:{
        1001: "缺少渠道id",
        1002: "缺少游戏id",
        1003: "登录失败",
        1004: "支付失败",
        1005: "不提供分享功能",
        1006: "不提供关注功能",
        1007: "缺少玩家id",
        1008: "退出游戏失败",
        1009: "获取客服信息失败",
        1010: "不提供邀请功能",
        1011: "玩家未登录",
        1012: "玩家放弃支付",
        1013: "分享失败",
        1014: "关注失败",
        1015: "玩家放弃邀请"
    }
};
BearjoyH5Sdk.playerId;
BearjoyH5Sdk.loadedCssFiles = {};
BearjoyH5Sdk.loadcss = function (scripts, callback) {
    if (typeof(scripts) != "object") {
        var scripts = [scripts]
    }
    var haveLoaded = true;
    for (var i = 0; i < scripts.length; i++) {
        if (!BearjoyH5Sdk.loadedCssFiles[scripts[i]]) {
            haveLoaded = false;
            BearjoyH5Sdk.loadedCssFiles[scripts[i]] = 1
        }
    }
    if (haveLoaded) {
        callback();
        return
    }
    var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement;
    var s = new Array(), last = scripts.length - 1, recursiveLoad = function (i) {
        s[i] = document.createElement("link");
        s[i].setAttribute("type", "text/css");
        s[i].setAttribute("rel", "stylesheet");
        s[i].onload = s[i].onreadystatechange = function () {
            if (!0 || this.readyState == "loaded" || this.readyState == "complete") {
                this.onload = this.onreadystatechange = null;
                //this.parentNode.removeChild(this);
                if (i != last) {
                    recursiveLoad(i + 1)
                } else {
                    callback()
                }
            }
        };
        s[i].setAttribute("href", scripts[i]);
        HEAD.appendChild(s[i])
    };
    recursiveLoad(0)
};

BearjoyH5Sdk.isMobileDevice = function() {
    if (!this["navigator"]) {
        return true
    }
    var ua = navigator.userAgent.toLowerCase();
    return (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
}

BearjoyH5Sdk.getBrowserType = function () {
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/mqqbrowser/i)=="mqqbrowser") {
        return 'qq';
    } else if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return 'weixin';
    } else if(ua.match(/chrome/i)=="chrome") {
        return 'chrome';
    } else {
        return 'any';
    }
};

BearjoyH5Sdk.getHeight = function () {
    var winHeight = 0;
    //获取窗口高度
    if (window.innerHeight) {
        winHeight = window.innerHeight;
    } else if ((document.body) && (document.body.clientHeight)) {
        winHeight = document.body.clientHeight;
    }
    //通过深入Document内部对body进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight) {
        winHeight = document.documentElement.clientHeight;
    }
    return winHeight;
};

BearjoyH5Sdk.getWidth = function () {
    var winWidth = 0;
    //获取窗口宽度
    if (window.innerWidth) {
        winWidth = window.innerWidth;
    } else if ((document.body) && (document.body.clientWidth)) {
        winWidth = document.body.clientWidth;
    }
    //通过深入Document内部对body进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientWidth) {
        winWidth = document.documentElement.clientWidth;
    }
    return winWidth;
};

BearjoyH5Sdk.addCookie = function (name, value, expiresHours) {

    var cookieString = name + "=" + encodeURIComponent(value);
    //设置cookie时间
    if (expiresHours > 0) {
        var date = new Date();
        date.setTime(date.getTime + expiresHours * 3600 * 1000);
        var urlHost = location.host;
        var rs = urlHost.indexOf("bearjoy.com");
        if (rs != -1) {
            cookieString = cookieString + "; expires=" + date.toGMTString() + ";path=/;domain=bearjoy.com";
        } else {
            cookieString = cookieString + "; expires=" + date.toGMTString();
        }
    }
    document.cookie = cookieString;
    try{
        if(window.localStorage){
            window.localStorage[name] = value;
        }
    }catch(e){

    }

};

BearjoyH5Sdk.getCookie = function (name) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0] == name) {
            cookieVal = decodeURIComponent(arr[1]);
            return cookieVal;
        }
    }

    try{
        if(window.localStorage){
            var cookieVal = window.localStorage[name];
            if (cookieVal != undefined) {
                cookieVal = decodeURIComponent(cookieVal);
                return cookieVal;
            }
        }
    }catch(e){

    }


    return "";
};

BearjoyH5Sdk.delCookie = function (name) {

    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = BearjoyH5Sdk.getCookie(name);
    if(cval) {
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/;domain=bearjoy.com";
    }

    if(window.localStorage) {
        localStorage.removeItem(name);
    }
};

BearjoyH5Sdk.sendUrl = function (postUrl, onResult) {
    BearjoyH5Sdk.doGet({
        url: postUrl,
        onSuccess: function (data) {
            try{
                var dataObj = eval("(" + data.response + ")");//转换为json对象
                onResult(dataObj);
            }catch(e){
                console.log(e);
            }

        },
        onFail: function () {
            onResult(false);
        }
    });
};

BearjoyH5Sdk.getPlayerId = function () {
    var playerId = '';
    if (BearjoyH5Sdk.playerId) {
        playerId = BearjoyH5Sdk.playerId;
    } else {
        playerId = BearjoyH5Sdk.getCookie('BearjoyH5SdkPlayerId');
    }

    return playerId;
}

BearjoyH5Sdk.doGet = function (obj) {

    var url = obj.url;
    var onSuccess = obj.onSuccess;
    if (!url) {
        console.error("no url");
        return;
    }
    if (!onSuccess) {
        console.error("no onSuccess");
        return;
    }

    var xhr = new XMLHttpRequest();
    var urlArr = url.split("?");
    if (urlArr[1]) {
        xhr.open("POST", urlArr[0], true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.send(urlArr[1]);
    } else {
        xhr.open("POST", url, true);
        xhr.send();
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status >= 400 || xhr.status == 0) {
                console.error("404:" + url);
            }
            else {
                var data = { "response": xhr.responseText};
                onSuccess(data);
            }
        }
    };
};

BearjoyH5Sdk.getLoginType = function(json, callback) {
    var returnData = {result:0, msg:"success", loginType:[]};
    callback(returnData);
    return;
}


BearjoyH5Sdk.checkLogin = function (json, callback) {
    var returnData = {result:-2, msg:"no channelId, checklogin fail."};
    callback(returnData);
    return;
}

BearjoyH5Sdk.login = function (json, callback) {
    var returnData = {result:-2, msg:"no channelId, login fail."};
    callback(returnData);
    return;
};

BearjoyH5Sdk.logout = function (json, callback) {
    var returnData = {result:-2, msg:"Exit logon failure"};
    callback( returnData);
    return;
};

BearjoyH5Sdk.pay = function(json, callback) {
    var returnData = {result:-2, msg:"Failed to pay."};
    callback( returnData);
    return;
}

BearjoyH5Sdk.isSupportShare = function(json, callback) {
    var returnData = {result:0, msg:"Does not provide sharing function"};
    callback( returnData);
    return;
}

BearjoyH5Sdk.setShareDefaultData = function(json, callback) {
    var returnData = {result:0, msg:"success"};
    callback( returnData);
    return;
}

BearjoyH5Sdk.share = function(json, callback) {
    var returnData = {result:-2, msg:"Does not provide sharing function"};
    callback( returnData);
    return;
}

BearjoyH5Sdk.isSupportAttention = function(json, callback) {

    var playerId = BearjoyH5Sdk.getPlayerId();
    if (!playerId) {
        var returnData = {result:0, msg:"no playerId,when isSupportAttention."};
        callback( returnData);
        return;
    }

    var postUrl = BearjoyH5Sdk.apiServerUrl + '/user/attention?id=' + playerId + '&appId=' + BearjoyH5Sdk.gameId;
    BearjoyH5Sdk.sendUrl(postUrl, function(dataObj) {
        var returnData = {result:0, msg:"Does not provide attention function"};
        if (dataObj.code !== 0 || dataObj.data.response === 0) {
            callback(returnData);
            return;
        }

        var returnData = {result:1, msg:""};
        if (dataObj.data.response == 3) {
            returnData["result"] = 2;
            returnData["msg"] = "Has been attention";
        }

        callback( returnData);
    });
    return;
}

BearjoyH5Sdk.attention = function(json, callback) {

    var playerId = BearjoyH5Sdk.getPlayerId();
    if (!playerId) {
        var returnData = {result:-2, msg:"no playerId, when attention."};
        callback( returnData);
        return;
    }

    var postUrl = BearjoyH5Sdk.apiServerUrl + '/user/attention?id=' + playerId + '&appId=' + BearjoyH5Sdk.gameId;
    BearjoyH5Sdk.sendUrl(postUrl, function(dataObj) {
        var returnData = {result:-2, msg:"attention fail"};
        if (dataObj.code !== 0 || dataObj.data.response === 0) {
            callback( returnData);
            return;
        }

        if (dataObj.data.attentionUrl) {
            var attentionUrl = dataObj.data.attentionUrl;
            if (dataObj.data.parentLocation) {
                window.parent.location.href = attentionUrl;
            } else {
                window.location.href = attentionUrl;
            }
        } else {
            if (dataObj.data.response == 3) {
                returnData = {result:0, msg:"success"};
            } else if (dataObj.data.response == 2) {
                returnData = {result:-2, msg:dataObj.data.text};
            }
            callback( returnData);
        }
    });
    return;
}

BearjoyH5Sdk.isSupportInvite = function(json, callback) {
    var returnData = {result:0, msg:"No invitation function"};
    callback(returnData);
};

BearjoyH5Sdk.invite = function(json, callback) {
    var returnData = {result:-2, msg:"No invitation function"};
    callback(returnData);
};

BearjoyH5Sdk.isSupportSendToDesktop = function(json, callback) {
    var returnData = {result:0, msg:"No invitation function"};
    callback(returnData);
};

BearjoyH5Sdk.sendToDesktop = function(json, callback) {
    var returnData = {result:-2, msg:"No sendToDesktop function"};
    callback(returnData);
};

BearjoyH5Sdk.getCustomInfo = function(json, callback) {

    var returnData = {};

    var playerId = BearjoyH5Sdk.getPlayerId();
    var postUrl = BearjoyH5Sdk.apiServerUrl + '/user/getCustomInfo?id=' + playerId + '&appId=' + BearjoyH5Sdk.gameId;

    BearjoyH5Sdk.sendUrl(postUrl, function (dataObj) {
        if (dataObj.data) {
            returnData = dataObj.data;
            returnData["result"] = 0;
        } else {
            returnData['result'] = -2;
            returnData['msg'] = "Access to customer service information failure.";
        }
        callback(returnData);
    });
};

BearjoyH5Sdk.postChannelUserInfo = function (json, callback) {

    var returnData = {result:0, msg:"success"};

    var userName = json["userName"];
    userName = userName.replace("#", "");
    userName = userName.replace("&", "");
    userName = userName.replace("=", "");
    userName = userName.replace("?", "");
    var postUrl = BearjoyH5Sdk.apiServerUrl + "/game/" + BearjoyH5Sdk.channelId + "/" + BearjoyH5Sdk.gameId + "?userId=" + json["userId"] + "&userName=" + userName + "&accessToken=" + json["accessToken"] + "&userPic=" + json["userPic"] + "&jsSdk=1";

    BearjoyH5Sdk.sendUrl(postUrl, function (dataObj) {
        if (dataObj.code !== 0) {
            returnData["result"] = -2;
            returnData["msg"] = "login fail";
        } else {
            BearjoyH5Sdk.playerId = dataObj.data.id;
            BearjoyH5Sdk.addCookie('BearjoyH5SdkPlayerId', dataObj.data.id, 240);
            BearjoyH5Sdk.showBall();
            returnData["token"] = dataObj.data.token;
            returnData["id"] = dataObj.data.id;
        }
        callback(returnData);
    });
}

BearjoyH5Sdk.postChannelPayInfo = function (json, callback) {
}

BearjoyH5Sdk.statReport = function (json, callback) {
    var returnData = {result:-2, msg:"no need report"};
    //callback( returnData);
    return;
};
BearjoyH5Sdk.support = function (callback) {

    var returnData = {result:0, msg:"success"};

    var postUrl = BearjoyH5Sdk.apiServerUrl + "/supports?channelId=" + BearjoyH5Sdk.channelId + "&appId=" + BearjoyH5Sdk.gameId

    BearjoyH5Sdk.sendUrl(postUrl, function (dataObj) {
        if (dataObj.code !== 0) {
            returnData["result"] = -2;
            returnData["msg"] = "get fail";
        } else {
            returnData['data'] = dataObj.data;
        }
        callback(returnData);
    });
}

BearjoyH5Sdk.initShare = function(shareData, callback) {
    shareData['success'] = callback;
    BearjoyH5Sdk.shareData = shareData;
}
// 关注的二维码
BearjoyH5Sdk.showSubscribe = function() {

}

// 展示分享
BearjoyH5Sdk.showShare = function() {

}

// 是否已关注
BearjoyH5Sdk.checkHasSubscribe = function(callback) {

    var returnData = {result:0, 'subscribe':0};

    var rs = BearjoyH5Sdk.getAllParam();
    if (rs.hasOwnProperty('subscribebj')) {
        returnData['subscribe'] = rs['subscribebj'];
    }
    callback(returnData);
}

// 把game url的参数，追加到url
BearjoyH5Sdk.addRsToUrl = function(url, fields) {
    var rs = BearjoyH5Sdk.getAllParam();
    for(var i=0;i<fields.length;i++) {
        url += '&' + fields[i] + '=' + rs[fields[i]];
    }

    return url;
}
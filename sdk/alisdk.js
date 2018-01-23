/**
 * Created by jfeng on 2016/10/13.
 */
var aliSdk = {};

aliSdk.origin = "http://api.jiongshu.com";
if (location.search.indexOf("isDev=1") != -1 || location.hostname.indexOf("dev.api") != -1) {
    aliSdk.origin = 'http://dev.api.jiongshu.com';
}

aliSdk.preOrderInfoUrl = aliSdk.origin + "/jiongshu.php?m=alipayorder";
aliSdk.orderResultUrl  = aliSdk.origin + "/jiongshu.php?m=alipayresult";
aliSdk.jqueryUrl = "http://static.jiongshu.com/js/mobile/jquery-1.8.3.min.js";
aliSdk._payFunc = null;
aliSdk._payCannelFunc  = null;
aliSdk._payContext = null;
aliSdk.isReady   = false;
aliSdk.isListen   = true; //是否监听结果
aliSdk.orderId    = null; //存放
aliSdk.isSafari   = false;
aliSdk.windowObj  = {};

aliSdk.init = function () {
    aliSdk.checkSafari();
    aliSdk.loadFile(aliSdk.jqueryUrl);
    console.log('init ali sdk done');
};

aliSdk.loadFile = function (fileName) {
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript= document.createElement("script");
    oScript.type = "text/javascript";
    oScript.charset = "utf-8";
    if  (oScript.readyState) {
        oScript.onreadystatechange = function () {
            if (oScript.readyState == "loaded" || oScript.readyState == "complete") {
                aliSdk.isReady = true;
            }
        }
    } else {
        oScript.onload = function () {
            aliSdk.isReady = true;
        }
    }
    oScript.src = fileName;
    oHead.appendChild(oScript);
};

aliSdk.pay = function (orderObj, func, cannelFunc, isListen, context) {
    console.log('pcSdk aliPay start');
    aliSdk._payFunc = func;
    aliSdk._payCannelFunc = cannelFunc;
    aliSdk._payContext = context;
    aliSdk.isListen = isListen;
    aliSdk.onAliPay(orderObj);
};

aliSdk.onAliPay = function (orderObj) {
    console.log('ali on pay');
    if (aliSdk.isReady) {
        var httpQuery = aliSdk.objectToQuery(orderObj);
        var preOrderInfoUrl = aliSdk.preOrderInfoUrl + '&' + httpQuery;
        aliSdk.openPayUrl(preOrderInfoUrl);
    }
};

// 打开链接
aliSdk.openPayUrl = function (payUrl) {
    console.log('oepn pay url');
    var bodyObj = $('body');
    bodyObj.prepend('<iframe id="cpPayFrame" class="iframe" height="100%" width="100%" name="cpPayFrame" frameborder="0" style="position: absolute; top:0px; bottom:0px;z-index: 100000" src="'+ payUrl +'">');
};

aliSdk.receiveNotice = function (status) {
    aliSdk.removePayFrame();
    if (status == 'success') {
        aliSdk._payFunc.call(aliSdk._payFunc);
    } else {
        aliSdk._payCannelFunc.call(aliSdk._payFunc);
    }
};

aliSdk.removePayFrame = function () {
    $('#cpPayFrame').remove();
};

// 获得订单结果
// aliSdk.getPayResult = function () {
//     var orderResultUrl = aliSdk.orderResultUrl + "&orderId=" + aliSdk.orderId;
//     $.ajax({
//         url : orderResultUrl,
//         success : function (res) {
//             if (res.code != '0') {
//                 alert(res.msg);
//                 return ;
//             }
//             aliSdk.hiddenListenBox();
//             aliSdk._payFunc.call(aliSdk._payFunc, res);
//         },
//         dataType:'json'
//     });
// };




aliSdk.rePay = function () {
    if (aliSdk.isSafari) {
        aliSdk.windowObj = window.open('','_blank');
    }
    aliSdk.openPayUrl(aliSdk.payUrl);
};

// 显示监听box ['已经完成支付'，'重新支付'，'取消']
aliSdk.showListenBox = function () {
    console.log('show listen box');
    $('body').prepend('<div id="payListenBox" style="position: fixed;top: 15%;left: 15%;right: 15%;width: 200px;height: auto;margin-left: auto;margin-right: auto;background: rgba(255,255,255,1);border-radius: 5px;text-align: center;font-size: 14px;z-index: 100000;box-shadow: 2px 2px 20px;" ><div class="payListenBox-head" style="height: 35px; border-bottom: 1px #d6ead6 solid; width: 100%;"><div class="closepng" id="close" style="padding: 10px;float: left; width: 15px; height: 15px;" onclick="aliSdk.cancelPay()"><img src="/static/jiongshu/img/close.png" style="width:10px;"></div><div class="title" style="width: 100%; height: 25px;text-align: center; margin-left: -35px;padding-top: 10px;">支付宝支付</div></div><div class="payListenBox-content"  style="line-height: 20px;  padding-top: 10px; padding-bottom: 10px;"><div style="background: #66cc99;width: 70%;font-size: 1.5em;color: #fff;line-height: 2em;border-radius: 5px; margin: auto;margin-top: 10px;margin-bottom: 10px;height: 45px;" onclick="aliSdk.getPayResult()">支付完成</div><div style="background: #39b1eb;width: 70%;font-size: 1.5em;color: #fff;line-height: 2em;border-radius: 5px;margin: auto;margin-top: 10px;margin-bottom: 10px;height: 45px;" onclick="aliSdk.rePay()">重新支付</div></div></div>');

        $(window).on('popstate', function () {
            var hashLocation = location.hash;
            var hashSplit = hashLocation.split("#!/");
            var hashName = hashSplit[1];
            if (hashName !== '') {
                var hash = window.location.hash;
                if (hash === '') {

                    alert('後退按鈕點擊');
                }
            }
        });

};

// 隐藏监听box
aliSdk.hiddenListenBox = function () {
    $("#payListenBox").remove();
};

aliSdk.cancelPay = function() {
    aliSdk.hiddenListenBox();
    aliSdk._payCannelFunc.call(aliSdk._payFunc);
};

aliSdk.objectToQuery = function(obj) {
    if (!obj) {
        return '';
    }
    var keys = Object.keys(obj);
    return keys.map(function(k) {
        return k + '=' + encodeURIComponent(obj[k]);
    }).join('&');
};

//
aliSdk.checkSafari = function () {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/Safari/i) != 'safari') {
        aliSdk.isSafari = false;
    } else {
        aliSdk.isSafari = true;
    }
};


aliSdk.init();








/**
 * Created by jfeng on 16/7/28.
 */
var pcSdk = {};

pcSdk.origin = "http://api.jiongshu.com";
if (location.search.indexOf("isDev=1") != -1 || location.hostname.indexOf("dev.api") != -1) {
    pcSdk.origin = 'http://dev.api.jiongshu.com';
}

pcSdk.aliPayUrl = pcSdk.origin + "/jiongshu.php?m=alipayorder";
pcSdk.preOrderInfoUrl = pcSdk.origin + "/jiongshu.php?m=payorder";
pcSdk.jqueryUrl = "http://static.jiongshu.com/js/mobile/jquery-1.8.3.min.js";
pcSdk.checkUrl = null;
pcSdk._payFunc = null;
pcSdk._payCannelFunc  = null;
pcSdk._payContext = null;
pcSdk.isReady   = false;
pcSdk.loopStatus = true; //用于打断轮询
pcSdk.loopTimes  = 2000;

pcSdk.init = function () {
    pcSdk.loadFile(pcSdk.jqueryUrl);
    console.log('init pc sdk done');
};

pcSdk.loadFile = function (fileName) {
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript= document.createElement("script");
    oScript.type = "text/javascript";
    oScript.charset = "utf-8";
    if  (oScript.readyState) {
        oScript.onreadystatechange = function () {
            if (oScript.readyState == "loaded" || oScript.readyState == "complete") {
                pcSdk.isReady = true;
            }
        }
    } else {
        oScript.onload = function () {
            pcSdk.isReady = true;
        }
    }
    oScript.src = fileName;
    oHead.appendChild(oScript);
};

pcSdk.pay = function (orderObj, func, cannelFunc, context) {
    console.log('pcSdk pay start');
    pcSdk._payFunc = func;
    pcSdk._payCannelFunc = cannelFunc;
    pcSdk._payContext = context;
    pcSdk.onPay(orderObj);
};

pcSdk.cancelPay = function() {
    pcSdk.endCashier();
    pcSdk._payCannelFunc.call(pcSdk._payFunc);
};

pcSdk.onPay = function (orderObj) {
    if (pcSdk.isReady) {
        var preOrderInfoUrl = pcSdk.preOrderInfoUrl + '&' + pcSdk.objectToQuery(orderObj);
        $.ajax({
            url: preOrderInfoUrl,
            success: pcSdk.pullCashier,
            dataType: 'json'
        });
    }
};

pcSdk.pullCashier = function (rsp) {
    console.log('pc pay getPreOrderInfo success');
    $("body").prepend('<div class="paymask" id="paymask"><div class="paymask-head"><div class="closepng" id="close"><img src="/static/jiongshu/img/close.png" style="width:10px;"></div><div class="title">支付</div></div><div class="paymask-content"><div class="shop" id="goodsname"></div><div class="money" id="goodsmoney"></div><div class="qrbox" id="qrcode"><img></div><div class="hint">微信扫描二维码支付</div></div></div>');
    $("#qrcode img").attr('src',rsp.payQrCodeUrl);
    $("#goodsname").text(rsp.name);
    $("#goodsmoney").text(rsp.money + "元");
    pcSdk.checkUrl = rsp.checkUrl;
    pcSdk.loopStatus = true;
    pcSdk.checkPayResult();
    $("#close").click(function(){
        pcSdk.cancelPay();
    });
};

pcSdk.endCashier = function () {
    $("#paymask").remove();
    pcSdk.loopStatus = false;
};

pcSdk.checkPayResult = function () {
    setTimeout(function(){
        $.ajax({
            url : pcSdk.checkUrl,
            dataType : 'json',
            success:function(res){
                if (res.status == 0) {
                    console.log('pc pay success');
                    pcSdk._payFunc.call(pcSdk._payFunc, res);
                    pcSdk.endCashier();
                } else if (res.status == 1) {
                    console.log('continue to monitor');
                    if (pcSdk.loopStatus) {
                        pcSdk.checkPayResult();
                    }
                }
            }
        });
    },pcSdk.loopTimes);
};

pcSdk.addPayLodingMask = function () {
    $("body").prepend('<div class="paybox" id="payloding"> <img src="/static/jiongshu/img/shield.png" width="25%"><p>支付中</p><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div> </div> </div>');
};

pcSdk.removePayLoadingMask = function () {

};

pcSdk.objectToQuery = function(obj) {
    if (!obj) {
        return '';
    }
    var keys = Object.keys(obj);
    return keys.map(function(k) {
        return k + '=' + encodeURIComponent(obj[k]);
    }).join('&');
};

pcSdk.init();




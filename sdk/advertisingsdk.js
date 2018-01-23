/**
 * Created by jfeng on 2017/3/16.
 */
var ad = {};

ad.origin = "http://api.jiongshu.com/jiongshu.php?m=openhub";
if (location.search.indexOf("isDev=1") != -1 || location.hostname.indexOf("dev.api") != -1) {
    ad.origin = 'http://dev.api.jiongshu.com/jiongshu.php?m=openhub';
}

ad.closeStatus = null;
ad.toDayCloseStatus = false;
ad.boxObject = {};
ad.gameList = {};

ad.init = function () {
    console.log('ad : init');
    ad.obtainCloseStatus();
};

ad.run = function (status) {
    console.log('ad : run');
    if (status == 1) {
        ad.pushHistory();
        window.addEventListener("popstate", function (e) {
            ad.showAdBox();
        }, false);
    }

    $('input[name=adclosestatus]').click(function (res) {
        if (!ad.toDayCloseStatus &&  $(this).is(':checked')) {
            ad.closeAd();
        }
    });

    ad.obtainGameList();
};


ad.obtainGameList = function (res) {
    if (!res) {
        ad.request({
            'action' : 'backAdvertising.getList'
        },ad.obtainGameList);
    } else {
        ad.gameList = res['backAdvertising.getList'].res;
        ad.gameList.forEach(function (res) {
            $("#ad-ul").append('<li><a href="'+ res.playurl +'"><div class="ad-box-content-icon"><img src="' + res.icon + '" width="100%"></div></a><div class="ad-box-content-name" style="font-size: 0.7em;   text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">' + res.name + '</div></li>')
        });
    }
};

ad.showAdBox = function () {
    document.getElementById('ad-box').style.display = 'block';
};

ad.hideAdBox = function () {
    document.getElementById('ad-box').style.display = 'none';
};

ad.closeAd = function (res) {
    if (!res) {
        ad.request({
            'action' : 'backAdvertising.toDayClose'
        }, ad.closeAd);
    } else {
        if (res['backAdvertising.toDayClose'].code == 0) {
            ad.toDayCloseStatus = true;
        }
    }
};

ad.closeWind = function () {
    if (isInWechat) {
        WeixinJSBridge.invoke('closeWindow');
    } else {
        window.close();
    }
};

ad.pushHistory = function () {
    var state = {title: "title"};
    window.history.pushState(state, "title");
    console.log('ad : pushHistory done');
};

ad.obtainCloseStatus = function (res) {
    if (!res) {
        ad.request({
            'action' : 'backAdvertising.getStatus'
        }, ad.obtainCloseStatus);
    } else {
        console.log('ad : obtain close status done');
        ad.closeStatus = res['backAdvertising.getStatus'].res.bas;
        console.log('ad : obtain close status ' + ad.closeStatus);
        ad.run(res['backAdvertising.getStatus'].res.bas);
    }
};

ad.request = function (param, callBack) {
    $.ajax({
        url : ad.origin,
        type : 'get',
        dataType : 'json',
        data : param,
        success : callBack
    });
};

window.onload=function(){ ad.init(); };
var OpenSdk = {};

var protocol = document.location.protocol;
OpenSdk._sdkOrigin = protocol + '//sj.3gewan.com';
OpenSdk._isDev = 0;

OpenSdk._payUrl = OpenSdk._sdkOrigin + '/open.php?m=pay';
OpenSdk._loadjsfileNum  = 2;
OpenSdk._func = null;
OpenSdk._context = null;

OpenSdk._shareFunc = null;
OpenSdk._shareContext = null;
OpenSdk._shareAction = 'share';
OpenSdk._payFunc = null;
OpenSdk._payContext = null;
OpenSdk._payAction = 'pay';
OpenSdk._appId = '';

OpenSdk._audioAction = 'audio';
OpenSdk._audioFuncionList = {};

OpenSdk._imgAction = 'img';
OpenSdk._imgFunctionList = {};

OpenSdk._statAction = 'stat';

OpenSdk._getLocationAction = 'getLocation';
OpenSdk._getLocationFunc = null;
OpenSdk._getLocationContext = null;

OpenSdk.init = function (){
	OpenSdk.getAppId();
	console.log('OpenSdk init done');
};

OpenSdk.getRequest = function () {
	var url = location.search;
	var requestObj = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			requestObj[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return requestObj;
}

OpenSdk.getAppId = function () {
	var queryParam = OpenSdk.getRequest();
	OpenSdk._appId = queryParam['appid'];
}

OpenSdk.pay = function(orderInfoObj, func, context) {

	console.log('OpenSdk pay start');
	if (!orderInfoObj.appid) {
		orderInfoObj.appid = OpenSdk._appId;
	}

	if (OpenSdk._isDev) {
		orderInfoObj.isDev = OpenSdk._isDev;
	}

	OpenSdk._payFunc = func;
	OpenSdk._payContext = context;
	orderInfoObj.callPayAppid = OpenSdk._appId;
	var orderQuery = OpenSdk.objectToQuery(orderInfoObj);
	var orderObj = {};
	orderObj.action = OpenSdk._payAction;
	orderObj.payUrl = OpenSdk._payUrl + '&' + orderQuery;
	orderObj.info = orderInfoObj;
 	if(OpenSdk.isIframe()){
 		console.log('playUrl:' + orderObj.payUrl);
 		parent.postMessage(orderObj, OpenSdk._sdkOrigin);
 	} else {
 		console.log('OpenSdk pay env not correct');
 	}
};


OpenSdk.share = function(shareObj, func, context) {
	console.log('OpenSdk onShare start');
	// 棰勫瓨璧锋潵
	OpenSdk._shareFunc = func;
	OpenSdk._shareContext = context;
	shareObj.action = OpenSdk._shareAction;
	if(OpenSdk.isIframe()){
		parent.postMessage(shareObj, OpenSdk._sdkOrigin);
	} else {
		console.log('OpenSdk share env not correct');
 	}
};


OpenSdk.getLocation = function(func, context) {
	console.log('OpenSdk getLocation start');
	// 棰勫瓨璧锋潵
	OpenSdk._getLocationFunc = func;
	OpenSdk._getLocationContext = context;
	locationObj = {};
	locationObj.action = OpenSdk._getLocationAction;
	if(OpenSdk.isIframe()){
		parent.postMessage(locationObj, OpenSdk._sdkOrigin);
	} else {
		console.log('OpenSdk getLocation env not correct');
 	}
};

OpenSdk.getOption = function (pid) {
    var option = {};
    if (pid == 1002){
        option.gzh = '涓夊摜娓告垙';
        option.wxh = 'sggame666';
        option.head = 'https://static.guiwan.net/gamecenter/common/icon/sg.oauthhub.png';
	} else {
        option.gzh = '涓夊摜鐜�';
        option.wxh = 'sggame666';
        option.head = 'https://static.guiwan.net/gamecenter/common/icon/sg.oauthhub.png';
	}
    option.directRecharge=1;
    option.openActivity='close';

    return option;
}

OpenSdk.refreshPage = function() {
    parent.postMessage({action: "refreshPage"}, OpenSdk._sdkOrigin);
};

// 寮€濮嬪綍闊�
OpenSdk.startRecord = function(func, context) {
	var audioObj = {};
	audioObj.method = 'startRecord';
	OpenSdk._audio(audioObj, func, context);
}

// 鍋滄褰曢煶鎺ュ彛
OpenSdk.stopRecord = function(func, context) {
	var audioObj = {};
	audioObj.method = 'stopRecord';
	OpenSdk._audio(audioObj, func, context);
}

// 鐩戝惉褰曢煶鑷姩鍋滄鎺ュ彛
OpenSdk.onVoiceRecordEnd = function(func, context) {
	var audioObj = {};
	audioObj.method = 'onVoiceRecordEnd';
	OpenSdk._audio(audioObj, func, context);
}

// 鎾斁璇煶鎺ュ彛
OpenSdk.playVoice = function(localId, func, context) {
	var audioObj = {};
	audioObj.method = 'playVoice';
	audioObj.localId = localId;
	OpenSdk._audio(audioObj, func, context);
}

// 鏆傚仠鎾斁鎺ュ彛
OpenSdk.pauseVoice = function(localId, func, context) {
	var audioObj = {};
	audioObj.method = 'pauseVoice';
	audioObj.localId = localId;
	OpenSdk._audio(audioObj, func, context);
}

// 鍋滄鎾斁鎺ュ彛
OpenSdk.stopVoice = function(localId, func, context) {
	var audioObj = {};
	audioObj.method = 'stopVoice';
	audioObj.localId = localId;
	OpenSdk._audio(audioObj, func, context);
}

// 鐩戝惉璇煶鎾斁瀹屾瘯鎺ュ彛
OpenSdk.onVoicePlayEnd = function(func, context) {
	var audioObj = {};
	audioObj.method = 'onVoicePlayEnd';
	OpenSdk._audio(audioObj, func, context);
}

// 涓婁紶璇煶鎺ュ彛
OpenSdk.uploadVoice = function(audioObj, func, context) {
	audioObj.method = 'uploadVoice';
	OpenSdk._audio(audioObj, func, context);
};

// 涓嬭浇璇煶鎺ュ彛
OpenSdk.downloadVoice = function(audioObj, func, context) {
	audioObj.method = 'downloadVoice';
	OpenSdk._audio(audioObj, func, context);
};

// 璇嗗埆闊抽骞惰繑鍥炶瘑鍒粨鏋滄帴鍙�
OpenSdk.translateVoice = function(audioObj, func, context) {
	audioObj.method = 'translateVoice';
	OpenSdk._audio(audioObj, func, context);
};

OpenSdk._audio = function(audioObj, func, context) {
	audioObj.action = OpenSdk._audioAction;
	OpenSdk._audioFuncionList[audioObj.method] = func.bind(context);
	if(OpenSdk.isIframe()){
		parent.postMessage(audioObj, OpenSdk._sdkOrigin);
	} else {
		console.log('OpenSdk audio env not correct');
 	}
};

OpenSdk._img = function (imageObj, func, context) {

	imageObj.action = OpenSdk._imgAction;

	if (func) {
		OpenSdk._imgFunctionList[imageObj.method] = func.bind(context);
	}

	if(OpenSdk.isIframe()){
		parent.postMessage(imageObj, OpenSdk._sdkOrigin);
	} else {
		console.log('OpenSdk img env not correct');
	}
};

OpenSdk.addImage = function (imgObj, func, context) {
	imgObj.method = 'addImage';
	OpenSdk._img(imgObj, func, context);
};

OpenSdk.showImage = function (imgObj, func, context) {
	imgObj.method = 'showImage';
	OpenSdk._img(imgObj, func, context);
};

OpenSdk.hideImage = function (imgObj, func, context) {
	imgObj.method = 'hideImage';
	OpenSdk._img(imgObj, func, context);
};

OpenSdk.chooseImage = function (imgObj, func, context) {
	imgObj.method = 'chooseImage';
	OpenSdk._img(imgObj, func, context);
};

OpenSdk.previewImage = function (imgObj, func, context) {
	imgObj.method = 'previewImage';
	OpenSdk._img(imgObj, func, context);
};

OpenSdk.uploadImage = function (imgObj, func, context) {
	imgObj.method = 'uploadImage';
	OpenSdk._img(imgObj, func, context);
};

OpenSdk.downloadImage = function (imgObj, func, context) {
	imgObj.method = 'downloadImage';
	OpenSdk._img(imgObj, func, context);
};


OpenSdk.statEvent = function (statObj) {
	statObj.method = 'statEvent';
	OpenSdk._stat(statObj);
};

OpenSdk.statHeartbeat = function (statObj) {
	statObj.method = 'heartbeat';
	OpenSdk._stat(statObj);
};


OpenSdk._stat = function (statObj) {
	statObj.action = OpenSdk._statAction;
	if(OpenSdk.isIframe()){
		parent.postMessage(statObj, OpenSdk._sdkOrigin);
	} else {
		console.log('OpenSdk img env not correct');
	}
};

OpenSdk.objectToQuery = function(obj) {
	if (!obj) {
		return '';
	};
	var keys = Object.keys(obj);
	return keys.map(function(k) {
		return k + '=' + encodeURIComponent(obj[k]);
	}).join('&');
}

OpenSdk.isIframe = function() {
	return self != top;
}

OpenSdk.init();

window.addEventListener('message', function(event) {
	if (OpenSdk._sdkOrigin != event.origin) {
		return false;
	};
	if (event.data.action == OpenSdk._shareAction) {
		console.log('get callback from share page');
		if (OpenSdk._shareFunc) {
			OpenSdk._shareFunc.call(OpenSdk._shareContext, event.data);
		};
	};

	if (event.data.action == OpenSdk._getLocationAction) {
		console.log('get callback from getLocation page');
		if (OpenSdk._getLocationFunc) {
			OpenSdk._getLocationFunc.call(OpenSdk._getLocationContext, event.data);
		};
	};

	if (event.data.action == OpenSdk._payAction) {
		console.log('get callback from play page');
		if (OpenSdk._payFunc) {
			OpenSdk._payFunc.call(OpenSdk._payContext, event.data);
		};
	};

	if (event.data.action == OpenSdk._audioAction) {
		console.log('get callback from audio page');
		if (OpenSdk._audioFuncionList.hasOwnProperty(event.data.method)) {
			OpenSdk._audioFuncionList[event.data.method](event.data);
		}
	};

	if  (event.data.action == OpenSdk._imgAction) {
		console.log('get callback from img page');
		if (OpenSdk._imgFunctionList.hasOwnProperty(event.data.method)) {
			OpenSdk._imgFunctionList[event.data.method](event.data);
		}
	}
}, false);

var JiongshuSdk = {};

JiongshuSdk._sdkOrigin = 'http://api.jiongshu.com';
JiongshuSdk._isDev = 0;
if (location.search.indexOf("isDev=1") != -1) {
	JiongshuSdk._sdkOrigin = 'http://dev.api.jiongshu.com';
	JiongshuSdk._isDev = 1;
};

JiongshuSdk._payUrl = JiongshuSdk._sdkOrigin + '/jiongshu.php?m=pay';
JiongshuSdk._loadjsfileNum  = 2;
JiongshuSdk._func = null;
JiongshuSdk._context = null;

JiongshuSdk._shareFunc = null;
JiongshuSdk._shareContext = null;
JiongshuSdk._shareAction = 'share';
JiongshuSdk._payFunc = null;
JiongshuSdk._payContext = null;
JiongshuSdk._payAction = 'pay';
JiongshuSdk._appId = '';

JiongshuSdk._audioAction = 'audio';
JiongshuSdk._audioFuncionList = {};

JiongshuSdk._imgAction = 'img';
JiongshuSdk._imgFunctionList = {};
JiongshuSdk.init = function (){
	JiongshuSdk.getAppId();
	console.log('JiongshuSdk init done');
};

JiongshuSdk.getRequest = function () {
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

JiongshuSdk.getAppId = function () {
	var queryParam = JiongshuSdk.getRequest();
	JiongshuSdk._appId = queryParam['appid'];
}

JiongshuSdk.pay = function(orderInfoObj, func, context) {

	console.log('JiongshuSdk pay start');
	orderInfoObj.appid = JiongshuSdk._appId;
	if (JiongshuSdk._isDev) {
		orderInfoObj.isDev = JiongshuSdk._isDev;
	};

	JiongshuSdk._payFunc = func;
	JiongshuSdk._payContext = context;

	var orderQuery = JiongshuSdk.objectToQuery(orderInfoObj);
	var orderObj = {};
	orderObj.action = JiongshuSdk._payAction;
	orderObj.payUrl = JiongshuSdk._payUrl + '&' + orderQuery;
	orderObj.info = orderInfoObj;
 	if(JiongshuSdk.isIframe()){
 		console.log('playUrl:' + orderObj.payUrl);
 		parent.postMessage(orderObj, JiongshuSdk._sdkOrigin);
 	} else {
 		console.log('JiongshuSdk pay env not correct');
 	}
};


JiongshuSdk.share = function(shareObj, func, context) {
	console.log('JiongshuSdk onShare start');
	// 预存起来
	JiongshuSdk._shareFunc = func;
	JiongshuSdk._shareContext = context;
	shareObj.action = JiongshuSdk._shareAction;
	if(JiongshuSdk.isIframe()){
		parent.postMessage(shareObj, JiongshuSdk._sdkOrigin);
	} else {
		console.log('JiongshuSdk share env not correct');
 	}
};

// 开始录音
JiongshuSdk.startRecord = function(func, context) {
	var audioObj = {};
	audioObj.method = 'startRecord';
	JiongshuSdk._audio(audioObj, func, context);
}

// 停止录音接口
JiongshuSdk.stopRecord = function(func, context) {
	var audioObj = {};
	audioObj.method = 'stopRecord';
	JiongshuSdk._audio(audioObj, func, context);
}

// 监听录音自动停止接口
JiongshuSdk.onVoiceRecordEnd = function(func, context) {
	var audioObj = {};
	audioObj.method = 'onVoiceRecordEnd';
	JiongshuSdk._audio(audioObj, func, context);
}

// 播放语音接口
JiongshuSdk.playVoice = function(localId, func, context) {
	var audioObj = {};
	audioObj.method = 'playVoice';
	audioObj.localId = localId;
	JiongshuSdk._audio(audioObj, func, context);
}

// 暂停播放接口
JiongshuSdk.pauseVoice = function(localId, func, context) {
	var audioObj = {};
	audioObj.method = 'pauseVoice';
	audioObj.localId = localId;
	JiongshuSdk._audio(audioObj, func, context);
}

// 停止播放接口
JiongshuSdk.stopVoice = function(localId, func, context) {
	var audioObj = {};
	audioObj.method = 'stopVoice';
	audioObj.localId = localId;
	JiongshuSdk._audio(audioObj, func, context);
}

// 监听语音播放完毕接口
JiongshuSdk.onVoicePlayEnd = function(func, context) {
	var audioObj = {};
	audioObj.method = 'onVoicePlayEnd';
	JiongshuSdk._audio(audioObj, func, context);
}

// 上传语音接口
JiongshuSdk.uploadVoice = function(audioObj, func, context) {
	audioObj.method = 'uploadVoice';
	JiongshuSdk._audio(audioObj, func, context);
};

// 下载语音接口
JiongshuSdk.downloadVoice = function(audioObj, func, context) {
	audioObj.method = 'downloadVoice';
	JiongshuSdk._audio(audioObj, func, context);
};

// 识别音频并返回识别结果接口
JiongshuSdk.translateVoice = function(audioObj, func, context) {
	audioObj.method = 'translateVoice';
	JiongshuSdk._audio(audioObj, func, context);
};

JiongshuSdk._audio = function(audioObj, func, context) {
	audioObj.action = JiongshuSdk._audioAction;
	JiongshuSdk._audioFuncionList[audioObj.method] = func.bind(context);
	if(JiongshuSdk.isIframe()){
		parent.postMessage(audioObj, JiongshuSdk._sdkOrigin);
	} else {
		console.log('JiongshuSdk audio env not correct');
 	}
};

JiongshuSdk._img = function (imageObj, func, context) {

	imageObj.action = JiongshuSdk._imgAction;

	if (func) {
		JiongshuSdk._imgFunctionList[imageObj.method] = func.bind(context);
	}

	if(JiongshuSdk.isIframe()){
		parent.postMessage(imageObj, JiongshuSdk._sdkOrigin);
	} else {
		console.log('JiongshuSdk img env not correct');
	}
};

JiongshuSdk.addImage = function (imgObj, func, context) {
	imgObj.method = 'addImage';
	JiongshuSdk._img(imgObj, func, context);
};

JiongshuSdk.showImage = function (imgObj, func, context) {
	imgObj.method = 'showImage';
	JiongshuSdk._img(imgObj, func, context);
};

JiongshuSdk.hideImage = function (imgObj, func, context) {
	imgObj.method = 'hideImage';
	JiongshuSdk._img(imgObj, func, context);
};

JiongshuSdk.chooseImage = function (imgObj, func, context) {
	imgObj.method = 'chooseImage';
	JiongshuSdk._img(imgObj, func, context);
};

JiongshuSdk.previewImage = function (imgObj, func, context) {
	imgObj.method = 'previewImage';
	JiongshuSdk._img(imgObj, func, context);
};

JiongshuSdk.uploadImage = function (imgObj, func, context) {
	imgObj.method = 'uploadImage';
	JiongshuSdk._img(imgObj, func, context);
};

JiongshuSdk.downloadImage = function (imgObj, func, context) {
	imgObj.method = 'downloadImage';
	JiongshuSdk._img(imgObj, func, context);
};

JiongshuSdk.objectToQuery = function(obj) {
	if (!obj) {
		return '';
	};
	var keys = Object.keys(obj);
	return keys.map(function(k) {
		return k + '=' + encodeURIComponent(obj[k]);
	}).join('&');
}

JiongshuSdk.isIframe = function() {
	return self != top;
}

JiongshuSdk.init();

window.addEventListener('message', function(event) {
	if (JiongshuSdk._sdkOrigin != event.origin) {
		return false;
	};
	if (event.data.action == JiongshuSdk._shareAction) {
		console.log('get callback from share page');
		if (JiongshuSdk._shareFunc) {
			JiongshuSdk._shareFunc.call(JiongshuSdk._shareContext, event.data);
		};
	};

	if (event.data.action == JiongshuSdk._payAction) {
		console.log('get callback from play page');
		if (JiongshuSdk._payFunc) {
			JiongshuSdk._payFunc.call(JiongshuSdk._payContext, event.data);
		};
	};

	if (event.data.action == JiongshuSdk._audioAction) {
		console.log('get callback from audio page');
		if (JiongshuSdk._audioFuncionList.hasOwnProperty(event.data.method)) {
			JiongshuSdk._audioFuncionList[event.data.method](event.data);
		}
	};

	if  (event.data.action == JiongshuSdk._imgAction) {
		console.log('get callback from img page');
		if (JiongshuSdk._imgFunctionList.hasOwnProperty(event.data.method)) {
			JiongshuSdk._imgFunctionList[event.data.method](event.data);
		}
	}
}, false);


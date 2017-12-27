//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var AssetAdapter = (function () {
    function AssetAdapter() {
    }
    var d = __define,c=AssetAdapter,p=c.prototype;
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    p.getAsset = function (source, compFunc, thisObject) {
        function onGetRes(data) {
            compFunc.call(thisObject, data, source);
        }
        if (RES.hasRes(source)) {
            var data = RES.getRes(source);
            if (data) {
                onGetRes(data);
            }
            else {
                RES.getResAsync(source, onGetRes, this);
            }
        }
        else {
            RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
        }
    };
    return AssetAdapter;
}());
egret.registerClass(AssetAdapter,'AssetAdapter',["eui.IAssetAdapter"]);

//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        _super.call(this);
        this.createView();
    }
    var d = __define,c=LoadingUI,p=c.prototype;
    p.createView = function () {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    };
    p.setProgress = function (current, total) {
        this.textField.text = "Loading..." + current + "/" + total;
    };
    return LoadingUI;
}(egret.Sprite));
egret.registerClass(LoadingUI,'LoadingUI');

//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.apply(this, arguments);
        this.isThemeLoadEnd = false;
        this.isResourceLoadEnd = false;
    }
    var d = __define,c=Main,p=c.prototype;
    p.createChildren = function () {
        var _this = this;
        _super.prototype.createChildren.call(this);
        Main.isLoading = true;
        meru.localStorage.setPrefix("poker");
        // meru.setup(this);
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter", assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.stage.maxTouches = 1;
        //Config loading process interface
        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        var platform = meru.getPlatform();
        if (egret.is(platform, 'andes.platform.IGetLocation')) {
            var getLocation = platform;
            if (getLocation) {
                getLocation.getLocation(function (data) {
                    if (data.message == 'success') {
                        LoginCallback.jingdu = data.result.longitude;
                        LoginCallback.weidu = data.result.latitude;
                    }
                    else {
                        LoginCallback.jingdu = -1;
                        LoginCallback.weidu = -1;
                    }
                }, this);
            }
        }
        meru.res.loadRes();
        meru.singleton(ReportError).init();
        Stat.startLoad();
        meru.addPullObject("scode", function () {
            return "ToAyowC8eDia~4eRr";
        }, this);
        meru.addNotification("removeLoadingView", function () {
            if (_this.loadingView) {
                _this.removeChild(_this.loadingView);
                _this.loadingView = null;
            }
        }, this);
        // var context = egret.MainContext.instance;
        // var resizeTimer = null;
        // var resizeTimer1 = null;
        // var doResize = function () {
        //     context.stage.changeSize();
        //     resizeTimer = null;
        //     resizeTimer1 = null;
        // };
        // window.onresize = function () {
        //     if (resizeTimer == null) {
        //         resizeTimer = setTimeout(doResize, 500);
        //     }
        // };
        // window.addEventListener("orientationchange", function () {
        //     if(resizeTimer1 == null) {
        //         resizeTimer1 = setTimeout(doResize, 500);
        //     }
        // });
    };
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        meru.res.loadTheme(this.stage, false, this.onThemeLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("loading");
    };
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the
     */
    p.onThemeLoadComplete = function () {
        this.isThemeLoadEnd = true;
        this.createScene();
    };
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == this.getPreloadGroup()) {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.isResourceLoadEnd = true;
            this.createScene();
        }
        else if (event.groupName == "loading") {
            //设置加载进度界面
            this.loadingView = new LoadingView();
            this.addChildAt(this.loadingView, 0);
            RES.loadGroup(this.getPreloadGroup());
            if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
                if (window["showPro"]) {
                    window["showPro"](101);
                }
            }
        }
    };
    p.createScene = function () {
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            this.startCreateScene();
        }
    };
    p.getPreloadGroup = function () {
        return meru.singleton(PlatResource).preloadGroup();
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == this.getPreloadGroup()) {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
            if (event.resItem.name == "project_json") {
                this.doLogin();
            }
        }
    };
    /**
     * 创建场景界面
     * Create scene interface
     */
    p.startCreateScene = function () {
        Main.isLoading = false;
        Stat.endLoad();
        meru.postNotification("resLoadDone");
    };
    p.doLogin = function () {
        var obj = meru.Config.get('project_json');
        var svId = egret.getOption('svId');
        if (!!svId) {
            meru.Proxy.addGlobalParams('svId', svId);
        }
        var slUrl = egret.getOption('slUrl', true);
        if (!!slUrl) {
            andes.login.setServerListUrl(slUrl);
        }
        else {
            var pf = egret.getOption('pf');
            if (is.truthy(pf)) {
                var url = meru.Config.get('project_json', 'Modules.Login.Property.ServerListUrl_' + pf, null);
                if (url) {
                    andes.login.setServerListUrl(url);
                }
            }
        }
        meru.Setting.init(obj);
        meru.UI.setRoot(this);
        andes.login.init();
        //输出一下宽高信息
        if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
            console.log("stageW:" + egret.MainContext.instance.stage.stageWidth);
            console.log("stageH:" + egret.MainContext.instance.stage.stageHeight);
            console.log("innerWidth:" + window.innerWidth);
            console.log("innerHeight:" + window.innerHeight);
            console.log("clientWidth:" + document.body.clientWidth);
            console.log("clientHeight:" + document.body.clientHeight);
        }
    };
    Main.isLoading = false;
    return Main;
}(eui.UILayer));
egret.registerClass(Main,'Main');

//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var ThemeAdapter = (function () {
    function ThemeAdapter() {
    }
    var d = __define,c=ThemeAdapter,p=c.prototype;
    /**
     * 解析主题
     * @param url 待解析的主题url
     * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
     * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject 回调的this引用
     */
    p.getTheme = function (url, compFunc, errorFunc, thisObject) {
        function onGetRes(e) {
            compFunc.call(thisObject, e);
        }
        function onError(e) {
            if (e.resItem.url == url) {
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                errorFunc.call(thisObject);
            }
        }
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
        RES.getResByUrl(url, onGetRes, this, RES.ResourceItem.TYPE_TEXT);
    };
    return ThemeAdapter;
}());
egret.registerClass(ThemeAdapter,'ThemeAdapter',["eui.IThemeAdapter"]);

/**
 * Created by yang on 16/12/13.
 */
var CardData = (function () {
    function CardData(data) {
        this._data = data;
    }
    var d = __define,c=CardData,p=c.prototype;
    d(p, "data"
        ,function () {
            return this._data;
        }
    );
    d(p, "type"
        //花色
        ,function () {
            if (this._data <= 52) {
                return Math.ceil(this._data / 13);
            }
            else {
                return this._data - 48 + 1;
            }
        }
    );
    d(p, "grade"
        //大小
        ,function () {
            if (this._data <= 52) {
                var v = this._data % 13;
                if (v == 1) {
                    return 14;
                }
                else if (v == 0) {
                    return 13;
                }
                else {
                    return v;
                }
            }
            else {
                return this._data - 37;
            }
        }
    );
    d(p, "singleGrade"
        ,function () {
            if (this.isJoker) {
                return 14;
            }
            else {
                return this.grade;
            }
        }
    );
    d(p, "color"
        ,function () {
            var t = this.type;
            if (t % 2 == 0) {
                return 1;
            }
            else {
                return 2;
            }
        }
    );
    d(p, "isJoker"
        ,function () {
            return this.type > 4;
        }
    );
    d(p, "notJoker"
        ,function () {
            return !this.isJoker;
        }
    );
    d(p, "isBack"
        ,function () {
            return this._data == null;
        }
    );
    d(p, "isCard"
        ,function () {
            return this._data != null;
        }
    );
    return CardData;
}());
egret.registerClass(CardData,'CardData');

/**
 * Created by yang on 16/12/16.
 */
var Const = (function () {
    function Const() {
    }
    var d = __define,c=Const,p=c.prototype;
    Const.afterFree = function () {
        return Const.ROOM_STATUS_PLAYING;
    };
    Const.beforePlay = function (st) {
        return st == Const.ROOM_STATUS_FREE;
    };
    Const.ROOM_STATUS_FREE = 0;
    Const.ROOM_STATUS_PLAYING = 1;
    Const.ROOM_STATUS_WAIT = 2;
    Const.ONOFF = {};
    Const.SETTING_NORMAL = 1; //普通模式
    Const.SETTING_NO_SMALL = 2; //去小牌
    Const.SETTING_KING = 3; //有大小王
    Const.SETTING_SPECIAL = 4; //特殊牌加分
    Const.SURRENDER_NORMAL = 0;
    Const.SURRENDER_APPLY = 1;
    Const.SURRENDER_AGREE = 2;
    Const.SURRENDER_DISAGREE = 3;
    Const.bengbu = "gamecenter";
    Const.sange = "sange";
    Const.guilin = "guilin";
    Const.nanning = "nanning";
    Const.roundMap = { "1": 6, "2": 12, "3": 18 };
    return Const;
}());
egret.registerClass(Const,'Const');
var GameEvents = (function () {
    function GameEvents() {
    }
    var d = __define,c=GameEvents,p=c.prototype;
    GameEvents.STATUS_CHANGE = "status_change";
    GameEvents.DATA_CHANGE = "data_change";
    GameEvents.MY_DATA_CHANGE = "my_data_change";
    GameEvents.PASS_CHANGE = "pass_change";
    GameEvents.SHOW_RECOMMEND = "show_recommend";
    GameEvents.HIDE_PLAYNODE = "hide_playNode";
    GameEvents.HIDE_SHOWNODE = "hide_showNode";
    GameEvents.HIDE_GRABNODE = "hide_grabnode";
    GameEvents.REFRESH_USER = "refresh_user";
    GameEvents.USER_CHAT = "user_chat";
    GameEvents.CHAT_CHANGE = "chat_change";
    GameEvents.CONTINUE_STATUS = "continue_status";
    GameEvents.AUTO_SELECT = "auto_select";
    return GameEvents;
}());
egret.registerClass(GameEvents,'GameEvents');
var Effect = (function () {
    function Effect() {
    }
    var d = __define,c=Effect,p=c.prototype;
    Effect.register = function (pn) {
        this._pn = pn;
    };
    Effect.show = function (data, container) {
    };
    Effect.showEffect = function () {
        var img = new eui.Image();
        img.source = "icon_wenzi_ninzhiqianyiyoufangjian_png";
        img.scaleX = img.scaleY = 1.5;
        img.anchorOffsetX = 562 / 2;
        img.anchorOffsetY = 90 / 2;
        img.x = meru.stage.stageWidth / 2;
        img.y = meru.stage.stageHeight / 2;
        meru.stage.addChild(img);
        egret.Tween.get(img).to({ "scaleX": 1, "scaleY": 1 }, 200).wait(1000).call(function () {
            meru.display.removeFromParent(img);
        });
    };
    Effect._pn = -1;
    return Effect;
}());
egret.registerClass(Effect,'Effect');
var HeadLoader = (function () {
    function HeadLoader() {
        this._idx = -1;
    }
    var d = __define,c=HeadLoader,p=c.prototype;
    p.init = function (img, url, idx) {
        if (url == this._url) {
            return;
        }
        this._img = img;
        this._url = url;
        this._idx = idx;
        this.startLoad();
    };
    p.startLoad = function () {
        if (this._loader != null) {
            this._loader.removeEventListener(egret.Event.COMPLETE, this.onUrlLoaderHandler, this);
        }
        if (this._url.indexOf("http") == -1) {
            this._img.source = this._url;
        }
        else {
            var req = new egret.URLRequest(this._url);
            this._loader = new egret.URLLoader();
            this._loader.addEventListener(egret.Event.COMPLETE, this.onUrlLoaderHandler, this);
            this._loader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
            this._loader.load(req);
        }
    };
    p.onUrlLoaderHandler = function (e) {
        this._loader.removeEventListener(egret.Event.COMPLETE, this.onUrlLoaderHandler, this);
        this.resourceLoadComplete(e.currentTarget.data);
        // if(this._idx == 2) {
        //     this._img.top = 33;
        // }
        // else if(this._idx == 5) {
        //     this._img.top = 1;
        // }
        // else if (this._idx) {
        //     this._img.top = 20;
        // }
    };
    p.resourceLoadComplete = function (texture) {
        this._img.texture = texture;
    };
    return HeadLoader;
}());
egret.registerClass(HeadLoader,'HeadLoader');

/**
 * Created by yang on 17/1/24.
 */
var Stat = (function () {
    function Stat() {
    }
    var d = __define,c=Stat,p=c.prototype;
    //心跳
    Stat.heartBeat = function () {
        if (Stat.isOpen && GameUtils.isRelease()) {
            var uId = PUser.getCache("i.ezId");
            OpenSdk.statHeartbeat({ "who": uId });
        }
    };
    //点击分享
    Stat.share = function () {
        if (Stat.isOpen && GameUtils.isRelease()) {
            var uId = PUser.getCache("i.ezId");
            OpenSdk.statEvent({ "who": uId, "what": "shareClick" });
        }
    };
    //已关注的用户点击购卡
    Stat.buy1 = function () {
        if (Stat.isOpen && GameUtils.isRelease()) {
            var uId = PUser.getCache("i.ezId");
            OpenSdk.statEvent({ "who": uId, "what": "buyClick1" });
        }
    };
    //未关注的用户点击购卡
    Stat.buy2 = function () {
        if (Stat.isOpen && GameUtils.isRelease()) {
            var uId = PUser.getCache("i.ezId");
            OpenSdk.statEvent({ "who": uId, "what": "buyClick2" });
        }
    };
    //开始加载
    Stat.startLoad = function () {
        if (Stat.isOpen && GameUtils.isRelease()) {
            var uId = egret.getOption("id");
            OpenSdk.statEvent({ "who": uId, "what": "startLoad" });
        }
    };
    //结束加载
    Stat.endLoad = function () {
        if (Stat.isOpen && GameUtils.isRelease()) {
            var uId = egret.getOption("id");
            OpenSdk.statEvent({ "who": uId, "what": "endLoad" });
        }
    };
    //进入游戏
    Stat.enterGame = function () {
        if (Stat.isOpen && GameUtils.isRelease()) {
            var uId = egret.getOption("id");
            OpenSdk.statEvent({ "who": uId, "what": "enterGame" });
        }
    };
    Stat.isOpen = true;
    return Stat;
}());
egret.registerClass(Stat,'Stat');

/**
 * Created by yang on 17/1/11.
 */
var ActivityMutation = (function (_super) {
    __extends(ActivityMutation, _super);
    function ActivityMutation() {
        _super.apply(this, arguments);
    }
    var d = __define,c=ActivityMutation,p=c.prototype;
    p.init = function () {
        this.on("INVITE", this.invite);
        this.on("AWARD", this.award);
    };
    p.invite = function (data, box) {
        meru.UI.addTooltip(new InviteView());
    };
    p.award = function (data, box) {
        var code = box["input"].text;
        if (code) {
            meru.request(PInvite.getSelfAward(code)).then(function (d) {
                if (d["status"] == 0) {
                    meru.tooltip("领取成功");
                }
                else {
                    meru.tooltip(d["msg"] || "领取失败");
                }
                meru.UI.remove(box);
            });
        }
        else {
            meru.tooltip("请输入ID");
        }
    };
    return ActivityMutation;
}(meru.BaseMutation));
egret.registerClass(ActivityMutation,'ActivityMutation');
meru.injectionMutation("ACTIVITY", ActivityMutation);

/**
 * Created by yang on 17/1/11.
 */
var ActivityView = (function (_super) {
    __extends(ActivityView, _super);
    function ActivityView() {
        _super.call(this);
        this._refreshed = false;
        if (meru.getPlatform().name == Const.sange) {
            this.skinName = "ActivityBengBuSkin";
        }
        else {
            this.skinName = "ActivitySkin";
        }
    }
    var d = __define,c=ActivityView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        if (meru.getPlatform().name == Const.sange) {
            return;
        }
        var that = this;
        var tab = new andes.operates.TabOperate('tab');
        this.addOperate(tab
            .zOrderType(andes.operates.TabOrderType.Up)
            .addTabItem(this.buildNormalTabItem("邀请好友"))
            .setTapCallback(function (info) {
            if (info.label == "诚邀推广员") {
                that.offerNode.visible = true;
                that.inviteNode.visible = false;
            }
            else {
                that.offerNode.visible = false;
                that.inviteNode.visible = true;
            }
        })
            .select('邀请好友'));
        this.initInfo();
    };
    p.buildNormalTabItem = function (data) {
        return {
            label: data, onCreated: function (component) {
            },
            onBeginSelect: function () {
                return true;
            }
        };
    };
    p.initInfo = function () {
        var name = GameUtils.getWXName();
        var num = GameUtils.getWXNumber();
        this.pl1.text = name + "诚招推广员";
        this.pl2.text = "注：本次活动最终解释权归" + name + "所有";
        this.pl3.text = "4. 开通推广员请联系微信号：" + num;
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
    };
    return ActivityView;
}(meru.BaseComponent));
egret.registerClass(ActivityView,'ActivityView');

/**
 * Created by yang on 17/1/12.
 */
var InviteView = (function (_super) {
    __extends(InviteView, _super);
    function InviteView() {
        _super.call(this);
        this.skinName = "InviteSkin";
        Stat.share();
    }
    var d = __define,c=InviteView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.bg.touchEnabled = true;
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.initInfo();
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        this.bg.touchEnabled = false;
        this.bg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    p.initInfo = function () {
        var name = GameUtils.getWXName();
        var num = GameUtils.getWXNumber();
        this.pl1.text = name;
        this.pl2.text = name;
        this.pl3.text = name;
        this.gzh.text = num;
    };
    p.onClose = function () {
        meru.UI.remove(this);
    };
    return InviteView;
}(meru.BaseComponent));
egret.registerClass(InviteView,'InviteView');

/**
 * Created by yang on 17/1/11.
 */
var UserHead = (function (_super) {
    __extends(UserHead, _super);
    function UserHead() {
        _super.apply(this, arguments);
        this.loader = new HeadLoader();
    }
    var d = __define,c=UserHead,p=c.prototype;
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (this.data) {
            this.head.visible = true;
            var pic = this.data["pic"];
            if (pic == 1) {
                this.loader.init(this.head, "head_2_png", 4);
            }
            else {
                this.loader.init(this.head, pic, 4);
            }
        }
        else {
            this.head.visible = false;
        }
    };
    return UserHead;
}(meru.BaseComponent));
egret.registerClass(UserHead,'UserHead',["eui.IItemRenderer","eui.UIComponent"]);

/**
 * Created by yang on 17/1/7.
 */
var ChatBubble = (function (_super) {
    __extends(ChatBubble, _super);
    function ChatBubble() {
        _super.apply(this, arguments);
        this._timeId = -1;
        this._list = [];
    }
    var d = __define,c=ChatBubble,p=c.prototype;
    p.refreshView = function (data) {
        var _this = this;
        if (this.visible) {
            this._list.push(data);
            return;
        }
        this.visible = true;
        this._data = data;
        this.bq.visible = false;
        this.txtNode1.visible = false;
        this.txtNode2.visible = false;
        this.voiceNode.visible = false;
        meru.clearTimeout(this._timeId);
        if (data["t"] == ChatConst.WORD) {
            this.label1.text = meru.singleton(PlatResource).message[data["ct"]];
            if (this.label1.numLines == 1) {
                this.showWordEffect(1, meru.singleton(PlatResource).message[data["ct"]]);
            }
            else {
                this.showWordEffect(2, meru.singleton(PlatResource).message[data["ct"]]);
            }
            meru.singleton(SoundManager).playEffect("Man_Chat_" + data["ct"] + "_mp3");
            return;
        }
        else if (data["t"] == ChatConst.EMOJI) {
            this.bq.visible = true;
            this.bq2.source = "bq" + data["ct"] + "_png";
            var y = this.bq2.y;
            egret.Tween.get(this.bq2).to({ y: y - 50 }, 800).to({ y: y }, 800).wait(1600).call(function () {
                _this.hideMe();
            });
        }
        else if (data["t"] == ChatConst.VOICE) {
            this.voiceNode.visible = true;
            this.voiceLabel.text = "" + data["drn"] + "s";
            this.voiceClick();
            this._timeId = meru.setTimeout(function () {
                _this.hideMe();
            }, this, 5000);
        }
        else if (data["t"] == ChatConst.TYPING) {
            this.label1.text = data["ct"];
            if (this.label1.numLines == 1) {
                this.showWordEffect(1, data["ct"]);
            }
            else {
                this.showWordEffect(2, data["ct"]);
            }
            return;
        }
    };
    p.showWordEffect = function (idx1, ct) {
        var _this = this;
        var idx2 = (idx1 == 1) ? 2 : 1;
        this["txtNode" + idx1].visible = true;
        this["txtNode" + idx2].visible = false;
        this["label" + idx1].text = ct;
        var time = 5000;
        if (idx1 == 2) {
            this["label" + idx1].mask = this["maskDisplay" + idx1];
            var y = 9;
            this["label" + idx1].y = y;
            var num = this["label" + idx1].numLines;
            if (num > 2) {
                time = 5000 + (num - 3) * 2500;
                var tw = egret.Tween.get(this["label" + idx1]);
                while (num > 2) {
                    num -= 2;
                    tw = tw.wait(2000).to({ "y": y - 60 }, 500);
                    y = y - 60;
                }
            }
        }
        this._timeId = meru.setTimeout(function () {
            _this.hideMe();
        }, this, time);
    };
    p.hideMe = function () {
        this.visible = false;
        var data = this._list.shift();
        if (data) {
            this.refreshView(data);
        }
    };
    p.voiceClick = function () {
        Voice.getVoice().playVoice(this._data["ct"]);
    };
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        // this.voiceBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.voiceClick, this);
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        // this.voiceBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.voiceClick, this);
    };
    return ChatBubble;
}(meru.BaseComponent));
egret.registerClass(ChatBubble,'ChatBubble');

/**
 * Created by yang on 17/1/5.
 */
var ChatConst = (function () {
    function ChatConst() {
    }
    var d = __define,c=ChatConst,p=c.prototype;
    ChatConst.getEmojiDP = function () {
        var list = [];
        for (var i = 1; i <= 18; i++) {
            list.push({ "value": i, "type": ChatConst.EMOJI });
        }
        var dataProvider = new eui.ArrayCollection(list);
        return dataProvider;
    };
    ChatConst.getMessageDP = function () {
        var list = [];
        var mes = meru.singleton(PlatResource).message;
        for (var key in mes) {
            list.push({ "type": ChatConst.WORD, "value": key, "mes": mes[key] });
        }
        var dataProvider = new eui.ArrayCollection(list);
        return dataProvider;
    };
    ChatConst.getHistoryList = function () {
        var list = meru.getCache(PChat.roomList())["l"];
        list = list.filter(function (v) {
            return v.t != ChatConst.WORD && v.t != ChatConst.EMOJI;
        });
        if (GameUtils.isIOSApp()) {
            list = list.filter(function (v) {
                return v.t != ChatConst.VOICE;
            });
        }
        list.sort(function (a, b) {
            return a.time - b.time;
        });
        var ret = list.concat([]);
        return ret;
    };
    ChatConst.WORD = 1;
    ChatConst.EMOJI = 2;
    ChatConst.VOICE = 3;
    ChatConst.TYPING = 4;
    return ChatConst;
}());
egret.registerClass(ChatConst,'ChatConst');

/**
 * Created by yang on 17/1/4.
 */
var ChatItem = (function (_super) {
    __extends(ChatItem, _super);
    function ChatItem() {
        _super.call(this);
        this.skinName = "ItemChatRecordSkin";
    }
    var d = __define,c=ChatItem,p=c.prototype;
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (!this.data) {
            return;
        }
        this.nameLabel.text = this.getName() + ":";
        this.txt.visible = false;
        // this.bq.visible = false;
        this.voice.visible = false;
        if (this.data["t"] == ChatConst.WORD) {
            this.txt.visible = true;
            this.txt.text = meru.singleton(PlatResource).message[this.data["ct"]];
        }
        else if (this.data["t"] == ChatConst.EMOJI) {
        }
        else if (this.data["t"] == ChatConst.VOICE) {
            this.voice.visible = true;
            this.voiceLabel.text = "" + this.data["drn"] + "s";
        }
        else if (this.data["t"] == ChatConst.TYPING) {
            this.txt.visible = true;
            this.txt.text = this.data["ct"];
        }
    };
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.voiceBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.voiceClick, this);
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        this.voiceBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.voiceClick, this);
    };
    p.getName = function () {
        var rus = PRoom.getCache("rus");
        for (var key in rus) {
            if (rus[key]["uId"] == this.data["uId"]) {
                return GameUtils.formatName(rus[key]["nm"], rus[key]);
            }
        }
        return "???";
    };
    p.voiceClick = function () {
        Voice.getVoice().playVoice(this.data["ct"]);
    };
    return ChatItem;
}(meru.BaseComponent));
egret.registerClass(ChatItem,'ChatItem',["eui.IItemRenderer","eui.UIComponent"]);

/**
 * Created by bruce on 2/14/17.
 */
var ChatMutation = (function (_super) {
    __extends(ChatMutation, _super);
    function ChatMutation() {
        _super.apply(this, arguments);
        this._historyList = null;
        this._lastTabName = '表情';
    }
    var d = __define,c=ChatMutation,p=c.prototype;
    p.init = function () {
        _super.prototype.init.call(this);
        this.on('OPEN', this.open);
        this.on('TYPING', this.typing);
        this.on('SELECT', this.select);
        meru.addNotification(GameEvents.CHAT_CHANGE, this.dataChange, this);
    };
    p.dataChange = function () {
        var lists = ChatConst.getHistoryList();
        this.historyList.source = lists;
        this.historyList.refresh();
    };
    d(p, "historyList"
        ,function () {
            if (!this._historyList) {
                this._historyList = new eui.ArrayCollection(ChatConst.getHistoryList());
            }
            return this._historyList;
        }
    );
    p.open = function () {
        var chatView = meru.UI.addBox('ChatSkin')
            .setCompName('CHAT');
        chatView.addOperate(new andes.operates.TabOperate('tab')
            .addTabItem(this.createTabItem('语音', 'ChatListVoiceSkin', ChatConst.getMessageDP()))
            .addTabItem(this.createTabItem('表情', 'ChatListEmojiSkin', ChatConst.getEmojiDP()))
            .addTabItem(this.createTabItem('历史', 'ChatListHistorySkin', this.historyList))
            .select(this._lastTabName));
        chatView.addOperate(new andes.operates.TapOperate('bg', function () {
            meru.UI.remove(chatView);
        }));
    };
    p.createTabItem = function (label, skin, data) {
        var _this = this;
        return {
            label: label,
            skin: skin,
            data: data,
            parentName: 'scrollerPosition',
            onShow: function () {
                _this._lastTabName = label;
            },
            onCreated: function (component) {
            }
        };
    };
    p.typing = function (data, box) {
        var ct = box.input.text;
        if (ct) {
            if (GameUtils.getRealLength(ct) > 100) {
                meru.tooltip("发言不能多余100个字符");
                return;
            }
            var t = ChatConst.TYPING;
            meru.request(PChat.roomSay(t, ct.replace(/\+/g, "%2B"), 0)).then(function (d) {
                meru.UI.removeByName('CHAT');
            });
        }
    };
    p.select = function (d) {
        var t = d.type;
        var ct = d.value;
        meru.request(PChat.roomSay(t, ct, 0)).then(function (d) {
            meru.UI.removeByName('CHAT');
        });
    };
    return ChatMutation;
}(meru.BaseMutation));
egret.registerClass(ChatMutation,'ChatMutation');
meru.injectionMutation('CHAT', ChatMutation);

/**
 * Created by yang on 17/1/5.
 */
var ChatView = (function (_super) {
    __extends(ChatView, _super);
    function ChatView() {
        _super.call(this);
        this._change = true;
        this.skinName = "ChatSkin";
    }
    var d = __define,c=ChatView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        var that = this;
        var tab = new andes.operates.TabOperate('tab');
        this.addOperate(tab
            .zOrderType(andes.operates.TabOrderType.Up)
            .addTabItem(this.buildNormalTabItem("聊  天"))
            .addTabItem(this.buildNormalTabItem("聊天记录"))
            .setTapCallback(function (info) {
            if (info.label == "聊  天") {
                that.chatView.visible = true;
                that.historyView.visible = false;
            }
            else {
                that.chatView.visible = false;
                that.historyView.visible = true;
                if (that._change) {
                    that.historyChange();
                }
            }
        })
            .select('聊  天'));
        this.emojiList.dataProvider = ChatConst.getEmojiDP();
        this.wordList.dataProvider = ChatConst.getMessageDP();
        meru.addNotification(GameEvents.CHAT_CHANGE, this.dataChange, this);
        meru.addNotification("CHAT.SELECT", this.chat, this);
        meru.addNotification("CHAT.TYPING", this.typing, this);
        meru.addNotification("CHAT.CLOSE", this.close, this);
        meru.addNotification("CHAT.VOICE", this.voice, this);
        this.bg.touchEnabled = true;
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    p.onClose = function () {
        meru.UI.remove(this);
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        meru.removeNotification(GameEvents.CHAT_CHANGE, this.dataChange, this);
        meru.removeNotification("CHAT.SELECT", this.chat, this);
        meru.removeNotification("CHAT.TYPING", this.typing, this);
        meru.removeNotification("CHAT.CLOSE", this.close, this);
        meru.removeNotification("CHAT.VOICE", this.voice, this);
        this.bg.touchEnabled = false;
        this.bg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    p.buildNormalTabItem = function (data) {
        return {
            label: data, onCreated: function (component) {
            }
        };
    };
    p.dataChange = function () {
        this._change = true;
        if (this.tab.selectedIndex == 0) {
            this.historyChange();
        }
    };
    p.historyChange = function () {
        var _this = this;
        var list = ChatConst.getHistoryList();
        var dp = this.historyList.dataProvider;
        if (!dp) {
            dp = new eui.ArrayCollection();
        }
        dp.source = list;
        dp.refresh();
        meru.setTimeout(function () {
            var old = _this.Scroller.viewport.contentHeight;
            var h = old - _this.Scroller.height;
            if (h > 0) {
                _this.Scroller.viewport.scrollV = h;
            }
            meru.setTimeout(function () {
                var now = _this.Scroller.viewport.contentHeight;
                if (now != old) {
                    _this.Scroller.viewport.scrollV = now - _this.Scroller.height;
                }
            }, _this, 50);
        }, this, 50);
        this._change = false;
    };
    p.voice = function (data, ui, button) {
        console.log(data);
        Voice.getVoice().playVoice(data["ct"]);
    };
    p.chat = function (data, ui, button) {
        var d = button.parent.data;
        var t = d.type;
        var ct = d.value;
        var that = this;
        meru.request(PChat.roomSay(t, ct, 0)).then(function (d) {
            that.close();
        });
    };
    p.typing = function () {
        var ct = this.input.text;
        if (ct) {
            if (GameUtils.getRealLength(ct) > 100) {
                meru.tooltip("发言不能多余100个字符");
                return;
            }
            var that = this;
            var t = ChatConst.TYPING;
            meru.request(PChat.roomSay(t, ct, 0)).then(function (d) {
                that.close();
            });
        }
    };
    p.close = function () {
        meru.UI.remove(this);
    };
    return ChatView;
}(meru.BaseComponent));
egret.registerClass(ChatView,'ChatView');

/**
 * Created by yang on 17/1/5.
 */
var EmojiTemplate = (function (_super) {
    __extends(EmojiTemplate, _super);
    function EmojiTemplate() {
        _super.call(this);
        this.skinName = "ItemEmojiSkin";
    }
    var d = __define,c=EmojiTemplate,p=c.prototype;
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (!this.data) {
            return;
        }
        this.bq.source = "bq" + this.data.value + "_png";
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
    };
    return EmojiTemplate;
}(meru.BaseComponent));
egret.registerClass(EmojiTemplate,'EmojiTemplate',["eui.IItemRenderer","eui.UIComponent"]);

/**
 * Created by yang on 17/1/9.
 */
var SocketSynchronize = (function () {
    function SocketSynchronize() {
        this._timeId = -1;
        this._chatPsid = -1;
    }
    var d = __define,c=SocketSynchronize,p=c.prototype;
    p.register = function (psId) {
        var home = PRoom.getCache("base.psId");
        if (home >= psId) {
            return;
        }
        if (this._chatPsid == psId) {
            return;
        }
        meru.clearTimeout(this._timeId);
        this._chatPsid = psId;
        this._timeId = meru.setTimeout(this.timeOut, this, 3000);
    };
    p.timeOut = function () {
        var home = PRoom.getCache("base.psId");
        if (home < this._chatPsid) {
            this.synchronize();
        }
    };
    p.synchronize = function (cb, ct) {
        if (cb === void 0) { cb = null; }
        if (ct === void 0) { ct = null; }
        meru.request(PRoom.getInfo(true)).then(function () {
            if (PRoom.getCache("rId") > 0) {
                meru.getData(QuitData).quitDataChange();
                meru.singleton(GameData).myCardsChange();
                var alertNow = true;
                var base = PRoom.getCache("base");
                if (base["st"] == Const.ROOM_STATUS_PLAYING) {
                    if (PRoom.getCache("rus")[GameUtils.getMyPos()]["hp"] != 1) {
                        if (meru.UI.getContainerByType(meru.UIType.COMMON).numChildren == 0) {
                            meru.UI.addCommon(new MyView());
                        }
                    }
                }
                else if (base["st"] == Const.ROOM_STATUS_WAIT) {
                    if (!meru.singleton(ResultPlay).isPlaying) {
                        meru.postNotification(GameEvents.DATA_CHANGE);
                        meru.singleton(ResultPlay).playEnd();
                    }
                    else {
                        alertNow = false;
                    }
                }
                if (alertNow) {
                    GameUtils.checkBox();
                }
                meru.postNotification(GameEvents.DATA_CHANGE);
            }
            else if (meru.UI.getScene().skinName != "ReviewSkin") {
                meru.UI.clearBox();
                meru.UI.runScene(new HomeLayer());
            }
            if (cb) {
                cb.call(ct);
            }
        });
    };
    return SocketSynchronize;
}());
egret.registerClass(SocketSynchronize,'SocketSynchronize');

/**
 * Created by brucex on 2016/11/17.
 */
var SystemChatTip = (function (_super) {
    __extends(SystemChatTip, _super);
    function SystemChatTip() {
        _super.call(this);
        this._queue = [];
        this._showing = false;
        this._idx = 1;
        this._autoHidden = true;
        this._animationType = 'rightToLeft';
        this._isEnter = false;
        this.skinName = 'ChatMessageSkin';
    }
    var d = __define,c=SystemChatTip,p=c.prototype;
    d(p, "autoHidden"
        ,function () {
            return this._autoHidden;
        }
        ,function (value) {
            this._autoHidden = value;
        }
    );
    d(p, "animationType"
        ,function () {
            return this._animationType;
        }
        ,function (value) {
            this._animationType = value;
        }
    );
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.visible = false;
        // this['rootGroup'].mask = this['maskDisplay'];
        var display = this['maskDisplay'];
        var rect = new egret.Rectangle(display.x, display.y, display.width, display.height);
        this['rootGroup'].mask = rect;
        this._isEnter = true;
        this.check();
    };
    p.show = function (messages) {
        this._queue.push(messages);
        this.check();
    };
    p.check = function () {
        if (!this._showing && this._isEnter && this._queue.length > 0) {
            this._idx = 0;
            this.showTalk();
        }
    };
    p.getName = function (data) {
        var rus = PRoom.getCache("rus");
        for (var key in rus) {
            if (rus[key]["uId"] == data["uId"]) {
                return rus[key]["nm"];
            }
        }
        return "";
    };
    p.showTalk = function () {
        if (this._queue.length <= 0) {
            if (this._autoHidden) {
                this.visible = false;
            }
            this._showing = false;
            return;
        }
        this.visible = true;
        this._showing = true;
        this._idx += 1;
        var idx = this._idx % 2 + 1;
        var obj = this._queue.shift();
        var contentLabel = this['contentLabel' + idx];
        var group = this['chatGroup' + idx];
        var other = this['chatGroup' + (idx == 1 ? 2 : 1)];
        contentLabel.textFlow = new egret.HtmlTextParser().parser(obj.ct);
        var maskObj = this['maskDisplay'];
        if (this._animationType == 'rightToLeft') {
            this.rightToLeft(group, maskObj, other);
        }
        else {
            this.bottomToTop(group, maskObj, other);
        }
    };
    p.rightToLeft = function (group, maskObj, other) {
        group.x = maskObj.x + maskObj.width;
        group.visible = true;
        var toX = maskObj.x - group.width;
        var dist = group.x - toX;
        var duration = dist * 10;
        var anim = meru.Animation.to(duration, { x: toX }, Linear.easeNone); //.run(group);
        if (this._queue.length == 0) {
            anim.call(this.showTalk, this);
        }
        else {
            meru.Animation.delay(duration * 0.7).call(this.showTalk, this).run(group);
        }
        anim.run(group);
    };
    p.bottomToTop = function (group, maskObj, other) {
        if (other.y == maskObj.y) {
            meru.Animation.to(1000, { y: maskObj.y - other.height }).run(other);
        }
        group.x = maskObj.x;
        group.y = maskObj.y + maskObj.height;
        group.visible = true;
        var animation = meru.Animation.to(1000, { y: maskObj.y });
        if (group.width > maskObj.width) {
            var dist = group.width - maskObj.width;
            var duration = dist * 10;
            animation.delay(1000).to(duration, { x: -dist });
        }
        animation.delay(1000);
        animation.call(this.showTalk, this);
        animation.run(group);
    };
    d(SystemChatTip, "marquee"
        ,function () {
            if (this._marquee == null) {
                this._marquee = new SystemChatTip();
                this._marquee.skinName = 'ChatHomeTopMessageSkin';
                meru.UI.addCommon(this._marquee);
            }
            return this._marquee;
        }
    );
    return SystemChatTip;
}(meru.BaseComponent));
egret.registerClass(SystemChatTip,'SystemChatTip');

/**
 * Created by yang on 16/12/13.
 */
//我手里的牌 有点击事件
var CardView = (function (_super) {
    __extends(CardView, _super);
    function CardView() {
        _super.call(this);
        this._select = false;
        this.skinName = "ItemCardListSkin4";
        // this.cacheAsBitmap = true;
    }
    var d = __define,c=CardView,p=c.prototype;
    p.choose = function () {
        return this._select;
    };
    p.selectChange = function () {
        this._select = !this._select;
        this.selectEffect();
    };
    p.setUnSelect = function () {
        this._select = false;
        this.selectEffect();
    };
    p.selectEffect = function () {
        this.container.y = this._select ? 0 : 34;
    };
    p.tap = function () {
        this.select.visible = true;
    };
    p.unTap = function () {
        this.select.visible = false;
    };
    p.isShowBack = function () {
        return this.back.visible;
    };
    p.showBack = function () {
        this.back.visible = true;
        this.container.visible = false;
    };
    p.hideBack = function () {
        this.back.visible = false;
        this.container.visible = true;
    };
    return CardView;
}(meru.BaseComponent));
egret.registerClass(CardView,'CardView',["eui.IItemRenderer","eui.UIComponent"]);

var CommonMutation = (function (_super) {
    __extends(CommonMutation, _super);
    function CommonMutation() {
        _super.apply(this, arguments);
    }
    var d = __define,c=CommonMutation,p=c.prototype;
    p.init = function () {
        this.on('REMOVE_BOX', this.removeBox);
        meru.addNotification('GAME.NET', this.netInfo, this);
    };
    p.netInfo = function () {
        var view = new NetworkQualityView();
        view.skinName = 'PanelNetStatesSKin';
        meru.UI.addBox(view);
    };
    p.removeBox = function (data, box) {
        meru.UI.remove(box);
    };
    return CommonMutation;
}(meru.BaseMutation));
egret.registerClass(CommonMutation,'CommonMutation');
meru.injectionMutation('COMMON', CommonMutation);

var ConfirmView = (function (_super) {
    __extends(ConfirmView, _super);
    function ConfirmView() {
        _super.apply(this, arguments);
        this.data = {};
    }
    var d = __define,c=ConfirmView,p=c.prototype;
    return ConfirmView;
}(eui.Component));
egret.registerClass(ConfirmView,'ConfirmView');

var NetworkQuality;
(function (NetworkQuality) {
    NetworkQuality[NetworkQuality["none"] = 0] = "none";
    NetworkQuality[NetworkQuality["good"] = 1] = "good";
    NetworkQuality[NetworkQuality["average"] = 2] = "average";
    NetworkQuality[NetworkQuality["poor"] = 3] = "poor";
})(NetworkQuality || (NetworkQuality = {}));
var NetworkQualityView = (function (_super) {
    __extends(NetworkQualityView, _super);
    function NetworkQualityView() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NetworkQualityView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        var ms = meru.pullObject('GET_SPEED_MS');
        this.speedChange(ms);
        meru.addNotification('SPEED_CHANGE', this.speedChange, this);
    };
    p.updateText = function (quality, ms) {
        this.currentState = NetworkQuality[quality];
        this.ms = ms;
    };
    p.speedChange = function (ms) {
        if (ms == -1000) {
            this.updateText(NetworkQuality.none, '');
        }
        else {
            if (ms <= 100) {
                this.updateText(NetworkQuality.good, ms + 'ms');
            }
            else if (ms > 100 && ms < 200) {
                this.updateText(NetworkQuality.average, ms + 'ms');
            }
            else {
                this.updateText(NetworkQuality.poor, ms + 'ms');
            }
        }
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        meru.removeNotificationByTarget(this);
    };
    return NetworkQualityView;
}(meru.BaseComponent));
egret.registerClass(NetworkQualityView,'NetworkQualityView');

/**
 * Created by yang on 2017/6/5.
 */
var RoomOption = (function () {
    function RoomOption() {
    }
    var d = __define,c=RoomOption,p=c.prototype;
    p.getOption = function (box) {
        var num = 1;
        for (var i = 1; i <= 3; i++) {
            if (box["radio" + i].selected) {
                num = i;
            }
        }
        var map1 = Const.roundMap;
        var v = 0;
        var p = 2;
        for (var i = 1; i <= 4; i++) {
            if (box["people" + i].selected) {
                p = i + 1;
            }
        }
        var check1 = box["check1"].selected;
        var check2 = box["check2"].selected;
        var check3 = box["check3"].selected;
        if (check1) {
            v += Math.pow(2, Const.SETTING_NORMAL);
        }
        if (check2) {
            v += Math.pow(2, Const.SETTING_NO_SMALL);
        }
        if (check3) {
            v += Math.pow(2, Const.SETTING_KING);
        }
        v += Math.pow(2, Const.SETTING_SPECIAL);
        return { "rd": map1[num], "scst": v, "p": p, "num": num };
    };
    p.getDefault = function () {
        var obj = {};
        var s = PRoom.getCache("rsets");
        if (s && s["type"]) {
            var change = false;
            for (var key in Const.roundMap) {
                if (Const.roundMap[key] == s["type"]) {
                    obj["r" + key] = true;
                    change = true;
                }
                else {
                    obj["r" + key] = false;
                }
            }
            if (!change) {
                obj["r1"] = true;
            }
            if (s["aa"]) {
                obj["aa"] = true;
                obj["notaa"] = false;
            }
            else {
                obj["aa"] = false;
                obj["notaa"] = true;
            }
            var str = s["setting"].toString(2);
            var length = str.length;
            var rule1 = str.charAt(length - 2); //普通模式
            var rule2 = str.charAt(length - 3); //去小牌
            var rule3 = str.charAt(length - 4); //大小王
            var rule4 = str.charAt(length - 5); //喜牌
            obj["sp1"] = (rule1 == "1");
            obj["sp2"] = (rule2 == "1");
            obj["sp3"] = (rule3 == "1");
            obj["sp4"] = (rule4 == "1");
            for (var i = 1; i <= 4; i++) {
                obj["p" + i] = (i == (s["mpn"] - 1));
            }
        }
        else {
            obj["r1"] = true;
            obj["r2"] = false;
            obj["r3"] = false;
            obj["aa"] = true;
            obj["notaa"] = false;
            obj["sp1"] = true;
            obj["sp2"] = false;
            obj["sp3"] = false;
            obj["sp4"] = true;
            obj["p1"] = true;
            obj["p2"] = false;
            obj["p3"] = false;
            obj["p4"] = false;
        }
        return obj;
    };
    return RoomOption;
}());
egret.registerClass(RoomOption,'RoomOption');

/**
 * Created by yang on 2017/6/17.
 */
var SpecialPointView = (function (_super) {
    __extends(SpecialPointView, _super);
    function SpecialPointView() {
        _super.apply(this, arguments);
    }
    var d = __define,c=SpecialPointView,p=c.prototype;
    p.refreshView = function (t, score) {
        this.score.text = "+" + score;
        this.type.source = "label_special_" + (t - 100) + "_png";
    };
    return SpecialPointView;
}(meru.BaseComponent));
egret.registerClass(SpecialPointView,'SpecialPointView');

/**
 * Created by yang on 16/12/21.
 */
var CreateData = (function (_super) {
    __extends(CreateData, _super);
    function CreateData() {
        _super.apply(this, arguments);
        this.test = false;
        this.other = false;
    }
    var d = __define,c=CreateData,p=c.prototype;
    p.init = function () {
        var _this = this;
        this.slot("CreateRoomSkin", function () { return _this; });
        this.slot("ChosenGameSkin", function () { return _this; });
    };
    d(p, "gc"
        ,function () {
            return PUser.getCache("i.gc") + "";
        }
    );
    return CreateData;
}(meru.BaseData));
egret.registerClass(CreateData,'CreateData');
meru.injectionData("CREATE", CreateData);

/**
 * Created by yang on 2017/6/5.
 */
var CreateForOtherView = (function (_super) {
    __extends(CreateForOtherView, _super);
    function CreateForOtherView() {
        _super.call(this);
        this.skinName = "CreateRoomForOtherSkin";
    }
    var d = __define,c=CreateForOtherView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        if (egret.getOption("czn") == "1") {
            this["payBtn"].visible = false;
        }
        this.people4.group.addEventListener(eui.UIEvent.CHANGE, this.selectChange, this);
        this.check2.group.addEventListener(eui.UIEvent.CHANGE, this.selectChange, this);
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        this.people4.group.removeEventListener(eui.UIEvent.CHANGE, this.selectChange, this);
        this.check2.group.removeEventListener(eui.UIEvent.CHANGE, this.selectChange, this);
    };
    p.selectChange = function () {
        if (this.people4.selected) {
            if (this["check2"].selected) {
                this["check1"].selected = true;
            }
        }
    };
    return CreateForOtherView;
}(meru.BaseComponent));
egret.registerClass(CreateForOtherView,'CreateForOtherView');

/**
 * Created by yang on 16/12/21.
 */
var CreateMutation = (function (_super) {
    __extends(CreateMutation, _super);
    function CreateMutation() {
        _super.apply(this, arguments);
    }
    var d = __define,c=CreateMutation,p=c.prototype;
    p.init = function () {
        this.on("BACK", this.back);
        this.on("BACKBOX", this.backBox);
        this.on("ENTER", this.enter);
        this.on('ROOM_LISTS', this.roomList);
        this.on('SHARE', this.share);
        this.on('CREATE_FOR_OTHERS', this.others);
        this.on('FOR_OTHERS', this.forOthers);
    };
    p.share = function (data) {
        if (GameUtils.isIOSApp()) {
            meru.singleton(ShareListener).createShare("share", data);
            return;
        }
        meru.UI.addBox(new InviteView());
        meru.singleton(ShareListener).createShare("init", data);
    };
    p.createForOthers = function () {
        var obj = meru.singleton(RoomOption).getDefault();
        meru.UI.addBox(new CreateForOtherView()).setData(obj);
    };
    p.roomList = function () {
        meru.request(PRoom.getHelpList()).then(function (rd) {
            meru.UI.addBox("CreateForOthersSkin")
                .setData(new eui.ArrayCollection(rd.list));
        });
    };
    p.forOthers = function (data, box) {
        var _this = this;
        var opt = meru.singleton(RoomOption).getOption(box);
        meru.request(PRoom.createEmpty(opt.rd, opt.scst), true).then(function (rd) {
            if (is.undefined(rd.status) || rd.status == 0) {
                meru.tooltip('代开房间成功，请在列表中点击分享');
                _this.roomList();
                meru.UI.remove(box);
            }
            else {
                meru.tooltip(rd['msg'] || '代开房间失败');
            }
        });
    };
    p.others = function () {
        meru.getData(CreateData).test = true;
        this.createForOthers();
    };
    p.back = function (data, box) {
        meru.UI.remove(box);
    };
    p.backBox = function (data, box) {
        meru.UI.remove(box);
        meru.postNotification("HOME.CREATE");
    };
    p.enter = function (data, box) {
        if (meru.getData(CreateData).test == false) {
            return;
        }
        var op = meru.singleton(RoomOption).getOption(box);
        var need = 0;
        var cost = 0;
        if (box["cost1"].selected) {
            cost = 0;
            need = op.rd / 6 * op.p;
        }
        else {
            cost = 1;
            need = op.rd / 6;
        }
        if (PUser.getCache("i.gc") < need) {
            meru.tooltip("房卡不够啊");
            return;
        }
        meru.request(PRoom.createNew(op.rd, cost, op.scst, op.p)).then(function () {
            meru.getData(CreateData).test = false;
            meru.UI.remove(box);
            meru.UI.runScene(new GameView());
        });
    };
    return CreateMutation;
}(meru.BaseMutation));
egret.registerClass(CreateMutation,'CreateMutation');
meru.injectionMutation("CREATE", CreateMutation);

/**
 * Created by yang on 17/2/27.
 */
var CreateView = (function (_super) {
    __extends(CreateView, _super);
    function CreateView() {
        _super.call(this);
        this.skinName = "CreateRoomSkin";
    }
    var d = __define,c=CreateView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        if (egret.getOption("czn") == "1") {
            this["payBtn"].visible = false;
        }
        this.people4.group.addEventListener(eui.UIEvent.CHANGE, this.selectChange, this);
        this.check2.group.addEventListener(eui.UIEvent.CHANGE, this.selectChange, this);
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        this.people4.group.removeEventListener(eui.UIEvent.CHANGE, this.selectChange, this);
        this.check2.group.removeEventListener(eui.UIEvent.CHANGE, this.selectChange, this);
    };
    p.selectChange = function () {
        if (this.people4.selected) {
            if (this["check2"].selected) {
                this["check1"].selected = true;
            }
        }
    };
    return CreateView;
}(meru.BaseComponent));
egret.registerClass(CreateView,'CreateView');

/**
 * Created by yang on 16/12/21.
 */
var EnterData = (function (_super) {
    __extends(EnterData, _super);
    function EnterData() {
        _super.apply(this, arguments);
        this.test = false;
        this._show = "输入房号";
    }
    var d = __define,c=EnterData,p=c.prototype;
    p.init = function () {
        var _this = this;
        this.slot('EnterRoomSkin', function () { return _this; });
    };
    d(p, "showLabel"
        ,function () {
            return this._show;
        }
    );
    p.reset = function () {
        this._show = "输入房号";
        eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "showLabel");
    };
    p.back = function () {
        if (this._show != "输入房号") {
            this._show = this._show.slice(0, this._show.length - 1);
            eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "showLabel");
        }
        if (this._show.length == 6) {
            meru.postNotification("ENTER.ENTER");
        }
    };
    p.add = function (num) {
        if (this._show == "输入房号") {
            this._show = "";
        }
        this._show += (num + "");
        eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "showLabel");
        if (this._show.length == 6) {
            meru.postNotification("ENTER.ENTER");
        }
    };
    return EnterData;
}(meru.BaseData));
egret.registerClass(EnterData,'EnterData');
meru.injectionData("ENTER", EnterData);

/**
 * Created by yang on 16/12/21.
 */
var EnterMutation = (function (_super) {
    __extends(EnterMutation, _super);
    function EnterMutation() {
        _super.apply(this, arguments);
    }
    var d = __define,c=EnterMutation,p=c.prototype;
    p.init = function () {
        this.on("BACK", this.back);
        this.on("DELETE", this.onDelete);
        this.on("RESET", this.reset);
        this.on("PRINT", this.print);
        this.on("ENTER", this.enter);
    };
    p.onDelete = function () {
        meru.getData(EnterData).back();
    };
    p.reset = function () {
        meru.getData(EnterData).reset();
    };
    p.print = function (data, parent, button) {
        var num = button.label;
        meru.getData(EnterData).add(num);
    };
    p.enter = function (data, box) {
        if (meru.getData(EnterData).test == false) {
            return;
        }
        var v = meru.getData(EnterData).showLabel;
        if (v == "输入房号") {
            meru.tooltip("请输入");
            return;
        }
        meru.request(PRoom.joinOne(v)).then(function (e) {
            meru.getData(EnterData).test = false;
            meru.getData(EnterData).reset();
            meru.UI.clearBox();
            meru.UI.runScene(new GameView());
            // var info = PRoom.getCache("");
            // if(info["base"]["st"] != Const.ROOM_STATUS_FREE && (!info["si"] || !info["si"]["poker"])) {//开始抢地主或叫分或打牌了 我没有手牌
            //     // meru.UI.addBox("TooltipSkin1").setData({"tip":"没有手牌"});
            //     meru.singleton(SocketSynchronize).synchronize();
            // }
        }).otherwise(function () {
            meru.getData(EnterData).reset();
            ;
        });
    };
    p.back = function (data, box) {
        meru.getData(EnterData).reset();
        meru.UI.remove(box);
    };
    return EnterMutation;
}(meru.BaseMutation));
egret.registerClass(EnterMutation,'EnterMutation');
meru.injectionMutation("ENTER", EnterMutation);

/**
 * Created by yang on 16/12/21.
 */
var FriendData = (function (_super) {
    __extends(FriendData, _super);
    function FriendData() {
        _super.apply(this, arguments);
    }
    var d = __define,c=FriendData,p=c.prototype;
    p.init = function () {
        var _this = this;
        this.slot("InviteSkin", function () { return _this; });
    };
    d(p, "list"
        ,function () {
            return [];
        }
    );
    return FriendData;
}(meru.BaseData));
egret.registerClass(FriendData,'FriendData');
meru.injectionData("FRIEND", FriendData);

/**
 * Created by yang on 16/12/21.
 */
var FriendMutation = (function (_super) {
    __extends(FriendMutation, _super);
    function FriendMutation() {
        _super.apply(this, arguments);
    }
    var d = __define,c=FriendMutation,p=c.prototype;
    return FriendMutation;
}(meru.BaseMutation));
egret.registerClass(FriendMutation,'FriendMutation');
meru.injectionMutation("FRIEND", FriendMutation);

/**
 * Created by yang on 16/12/29.
 */
var FriendView = (function (_super) {
    __extends(FriendView, _super);
    function FriendView() {
        _super.call(this);
        this.skinName = "InviteSkin";
    }
    var d = __define,c=FriendView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.listener(this.dailiBtn, this.dailiClick);
        this.listener(this.inviteBtn, this.inviteClick);
        this.dailiClick();
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        this.clearListeners();
    };
    p.dailiClick = function () {
        this.group2.visible = true;
        this.group1.visible = false;
        this.invite.visible = false;
        this.daili.visible = true;
    };
    p.inviteClick = function () {
        this.group2.visible = false;
        this.group1.visible = true;
        this.invite.visible = true;
        this.daili.visible = false;
    };
    return FriendView;
}(meru.BaseComponent));
egret.registerClass(FriendView,'FriendView');

/**
 * Created by yang on 17/1/18.
 */
var ChooseRuleView = (function (_super) {
    __extends(ChooseRuleView, _super);
    function ChooseRuleView() {
        _super.call(this);
        this.skinName = "ChosenRuleSkin";
    }
    var d = __define,c=ChooseRuleView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.bg.touchEnabled = true;
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
        this["rule1"].visible = meru.singleton(GameData).hasRule(Const.SETTING_NORMAL);
        this["rule2"].visible = meru.singleton(GameData).hasRule(Const.SETTING_NO_SMALL);
        this["rule3"].visible = meru.singleton(GameData).hasRule(Const.SETTING_KING);
        var aa = PRoom.getCache("base.aa");
        this["cost1"].visible = (aa == 0);
        this["cost2"].visible = (aa != 0);
        this.listener(this.shezhiBtn, this.shezhiClick);
        this.listener(this.bangzhuBtn, this.helpClick);
        this.shezhiClick();
    };
    p.shezhiClick = function () {
        this["rule"].visible = true;
        this["help"].visible = false;
        this["shezhi1"].visible = true;
        this["shezhi2"].visible = true;
    };
    p.helpClick = function () {
        this["rule"].visible = false;
        this["help"].visible = true;
        this["shezhi1"].visible = false;
        this["shezhi2"].visible = false;
    };
    p.close = function () {
        meru.UI.remove(this);
        this.bg.touchEnabled = false;
        this.bg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
    };
    return ChooseRuleView;
}(meru.BaseComponent));
egret.registerClass(ChooseRuleView,'ChooseRuleView');

/**
 * Created by yang on 16/12/13.
 */
var GameData = (function () {
    function GameData() {
        this._pailList = [];
        this._tripleList = [];
        this._boomList = [];
        this._straightList = [];
        this._myCards = [];
        this.ignore = false;
        //头墩
        this._list1 = [];
        //中墩
        this._list2 = [];
        //尾墩
        this._list3 = [];
        this.selectList = [];
    }
    var d = __define,c=GameData,p=c.prototype;
    //剩下的牌
    p.myCard = function () {
        // if(this._myCards.length == 0) {
        //     this.myCardsChange();
        // }
        return this._myCards;
    };
    d(p, "list1"
        ,function () {
            return this._list1;
        }
        ,function (list) {
            this._list1 = list;
            this.myCardsChange();
            if (this.ignore) {
                return;
            }
            if (this.myCard().length == 3) {
                meru.postNotification(GameEvents.SHOW_RECOMMEND, this.myCard());
                meru.postNotification(GameEvents.AUTO_SELECT);
            }
        }
    );
    d(p, "list2"
        ,function () {
            return this._list2;
        }
        ,function (list) {
            this._list2 = list;
            this.myCardsChange();
            if (this.ignore) {
                return;
            }
            if (this.myCard().length == 3) {
                meru.postNotification(GameEvents.SHOW_RECOMMEND, this.myCard());
                meru.postNotification(GameEvents.AUTO_SELECT);
            }
        }
    );
    d(p, "list3"
        ,function () {
            return this._list3;
        }
        ,function (list) {
            this._list3 = list;
            this.myCardsChange();
            if (this.ignore) {
                return;
            }
            if (this.myCard().length == 3) {
                meru.postNotification(GameEvents.SHOW_RECOMMEND, this.myCard());
                meru.postNotification(GameEvents.AUTO_SELECT);
            }
        }
    );
    p.boomList = function () {
        return this._boomList;
    };
    p.pailList = function () {
        return this._pailList;
    };
    p.tripleList = function () {
        return this._tripleList;
    };
    p.straightList = function () {
        return this._straightList;
    };
    p.reset = function () {
        this._list1 = [];
        this._list2 = [];
        this._list3 = [];
        this.myCardsChange();
    };
    //得到经过排序后的我的牌
    //从左到右 先按数量 后按大小
    p.myCardsChange = function () {
        this._boomList = [];
        this._pailList = [];
        this._tripleList = [];
        this._straightList = [];
        this._myCards = [];
        var BoomRule = function (list) {
            if (list.length != 4) {
                return false;
            }
            for (var i = 1; i < list.length; i++) {
                if (list[0].grade != list[i].grade) {
                    return false;
                }
            }
            return true;
        };
        var PailRule = function (list) {
            return list.length == 2 && list[0].grade == list[1].grade;
        };
        var TripleRule = function (list) {
            return list.length == 3 && list[0].grade == list[1].grade && list[0].grade == list[2].grade;
        };
        var poker = PRoom.getCache("si.poker");
        if (!poker) {
            return;
        }
        var sp = poker.split(",");
        var list = [];
        for (var i = 0; i < sp.length; i++) {
            list.push(new CardData(sp[i]));
        }
        list.sort(function (a, b) {
            if (b.grade == a.grade) {
                return b.type - a.type;
            }
            else {
                return b.grade - a.grade;
            }
        });
        var filterList = [];
        for (var i = 0; i < this._list1.length; i++) {
            filterList.push(this._list1[i].data);
        }
        for (var i = 0; i < this._list2.length; i++) {
            filterList.push(this._list2[i].data);
        }
        for (var i = 0; i < this._list3.length; i++) {
            filterList.push(this._list3[i].data);
        }
        list = list.filter(function (d) {
            return filterList.indexOf(d.data) == -1;
        });
        this._myCards = list;
        var map = {};
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (!map[item.grade]) {
                map[item.grade] = [];
            }
            map[item.grade].push(item);
        }
        var numberList = [];
        for (var key in map) {
            if (numberList.indexOf(map[key].length) == -1) {
                numberList.push(map[key].length);
            }
        }
        numberList.sort(function (a, b) {
            return b - a;
        });
        for (var i = 0; i < numberList.length; i++) {
            var l = [];
            for (var key in map) {
                if (map[key].length == numberList[i]) {
                    l = l.concat(map[key]);
                    if (BoomRule(map[key])) {
                        this._boomList.push(map[key]);
                        this._tripleList.push(map[key].slice(0, 3));
                        this._pailList.push(map[key].slice(0, 2));
                    }
                    else if (TripleRule(map[key])) {
                        this._tripleList.push(map[key]);
                        this._pailList.push(map[key].slice(0, 2));
                    }
                    else if (PailRule(map[key])) {
                        this._pailList.push(map[key]);
                    }
                }
            }
        }
        this._boomList.sort(function (a, b) {
            return b[0].grade - a[0].grade;
        });
        this._tripleList.sort(function (a, b) {
            return b[0].grade - a[0].grade;
        });
        this._pailList.sort(function (a, b) {
            return b[0].grade - a[0].grade;
        });
        var straight = new ShunziRule();
        var straightList = [];
        for (var i = 0; i < this._myCards.length; i++) {
            if (i == 0 || this._myCards[i].grade != this._myCards[i - 1].grade) {
                straightList.push(this._myCards[i]);
            }
        }
        this._straightList = [];
        for (var i = 0; i < straightList.length; i++) {
            var temp = straightList.slice(i, 3 + i);
            if (straight.verify(temp)) {
                this._straightList.push(temp);
            }
        }
        if (straightList.length > 3 && straightList[0].grade == 14 && straightList[straightList.length - 1].grade == 2) {
            var temp = straightList.slice(straightList.length - 2, straightList.length);
            temp.unshift(straightList[0]);
            if (straight.verify(temp)) {
                var arr1 = this._straightList.slice(0, 1);
                var arr2 = this._straightList.slice(1, this._straightList.length);
                this._straightList = arr1.concat([temp]).concat(arr2);
            }
        }
        meru.postNotification(GameEvents.MY_DATA_CHANGE);
    };
    p.getSortCard = function (str) {
        var sp = str.split(",");
        var ret = [];
        var list = [];
        for (var i = 0; i < sp.length; i++) {
            list.push(new CardData(sp[i]));
        }
        list.sort(function (a, b) {
            return b.type - a.type;
        });
        var map = {};
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (!map[item.grade]) {
                map[item.grade] = [];
            }
            map[item.grade].push(item);
        }
        var numberList = [];
        for (var key in map) {
            if (numberList.indexOf(map[key].length) == -1) {
                numberList.push(map[key].length);
            }
        }
        numberList.sort(function (a, b) {
            return b - a;
        });
        for (var i = 0; i < numberList.length; i++) {
            var l = [];
            for (var key in map) {
                if (map[key].length == numberList[i]) {
                    l = l.concat(map[key]);
                }
            }
            l.sort(function (a, b) {
                return b.grade - a.grade;
            });
            ret = ret.concat(l);
        }
        return ret;
    };
    p.selectChange = function (list) {
        this.selectList = list;
    };
    p.allSurrender = function () {
        var rus = PRoom.getCache("rus");
        for (var key in rus) {
            if (rus[key]["ldo"] == 0) {
                if (rus[key]["sudr"] != Const.SURRENDER_AGREE) {
                    return false;
                }
            }
        }
        return true;
    };
    p.canSurrender = function () {
        var info = PRoom.getCache("");
        var rus = info["rus"];
        var pos = GameUtils.getMyPos();
        if (Const.ROOM_STATUS_PLAYING != info["base"]["st"]) {
            return false;
        }
        if (rus[pos]["sudr"] == 0) {
            return true;
        }
        else {
            return false;
        }
    };
    p.hasRule = function (t) {
        var base = PRoom.getCache("base");
        if (!base) {
            return false;
        }
        var scst = base["scst"];
        var str = scst.toString(2);
        var length = str.length;
        return str.charAt(length - 1 - t) == 1;
    };
    p.getMaxNumber = function () {
        return PRoom.getCache("base.mpn") || 2;
    };
    return GameData;
}());
egret.registerClass(GameData,'GameData');

/**
 * Created by yang on 16/12/12.
 */
var RuleCenter = (function () {
    function RuleCenter() {
        this._curType = -1;
        this._socket = null;
        this._ruleList = [];
        this._specialList = [];
    }
    var d = __define,c=RuleCenter,p=c.prototype;
    p.inject = function (rule) {
        this._ruleList.push(rule);
    };
    p.injectSpecial = function (rule) {
        this._specialList.push(rule);
    };
    p.verify = function (list) {
        for (var i = 0; i < this._ruleList.length; i++) {
            if (this._ruleList[i].verify(list)) {
                return this._ruleList[i];
            }
        }
        return null;
    };
    p.getSpecial = function () {
        var data = meru.singleton(GameData);
        var list = data.myCard().concat(data.list1).concat(data.list2).concat(data.list3);
        list.sort(function (a, b) {
            return b.grade - a.grade;
        });
        var ret = [];
        var has = false;
        var idx = -1;
        for (var i = 0; i < this._specialList.length; i++) {
            if (this._specialList[i].verify(list)) {
                var obj = {};
                obj["t"] = this._specialList[i].type - 100;
                ret.push(obj);
                if (this._specialList[i].type == RuleType.Shuangqingshun || this._specialList[i].type == RuleType.Sanqingshun) {
                    has = true;
                }
                if (this._specialList[i].type == RuleType.Santonghua) {
                    idx = ret.length - 1;
                }
            }
        }
        //如果有三清 就把三顺清和清连顺弄掉
        if (has && idx > -1) {
            ret.splice(idx, 1);
        }
        return ret;
    };
    p.initSocket = function () {
        this._socket = new SocketAnalysis1();
    };
    p.init13zhang = function () {
        if (this._curType == 1) {
            return;
        }
        this._curType = 1;
        this._ruleList = [];
        this.inject(new SantiaoRule());
        this.inject(new TonghuashunRule());
        this.inject(new TonghuaRule());
        this.inject(new ShunziRule());
        this.inject(new DuiziRule());
        this.inject(new WulongRule());
        this.injectSpecial(new LianshunRule());
        this.injectSpecial(new QinglianshunRule());
        this.injectSpecial(new QuanheiRule());
        this.injectSpecial(new QuanhongRule());
        this.injectSpecial(new QuansantiaoRule());
        this.injectSpecial(new SanqingRule());
        this.injectSpecial(new SanshunqingRule());
        this.injectSpecial(new ShuangsantiaoRule());
        this.injectSpecial(new ShuangshunqingRule());
        this.injectSpecial(new SigetouRule());
    };
    d(p, "analysis"
        ,function () {
            return this._socket;
        }
    );
    p.dispose = function () {
        this._ruleList = [];
        this._socket = null;
    };
    return RuleCenter;
}());
egret.registerClass(RuleCenter,'RuleCenter');

/**
 * Created by yang on 16/12/15.
 */
var Recommend1 = (function () {
    function Recommend1() {
        this._recommendType = -1;
        this._recommendIdx = 0;
        this._recommends = {};
        this._done = false;
        this._tonghua = new TonghuaRule();
        this._tonghuashun = new TonghuashunRule();
        this._shunzi = new ShunziRule();
    }
    var d = __define,c=Recommend1,p=c.prototype;
    p.findRecommend = function () {
        this._recommends = {};
        this._done = true;
        this._recommendIdx = 0;
        this._recommends[RuleType.Tonghuashun] = this.tonghuashun().reverse();
        this._recommends[RuleType.Tonghua] = this.tonghua().reverse();
        this._recommends[RuleType.Shunzi] = this.shunzi().reverse();
        this._recommends[RuleType.Santiao] = this.santiao().reverse();
        // this._recommends[RuleType.Duizi] = this.duizi().reverse();
    };
    p.tonghuashun = function () {
        var ret = [];
        var lists = this.getLists();
        var map = lists.normal;
        var kings = lists.king;
        var rule = new ShunziRule();
        for (var key in map) {
            var arr = map[key];
            var has = false;
            for (var i = 0; i < kings.length; i++) {
                if (kings[i].color == arr[0].color) {
                    arr = [kings[i]].concat(arr);
                    has = true;
                }
            }
            if (has) {
                var temp1 = this.recursive(arr, 3);
                for (var i = 0; i < temp1.length; i++) {
                    if (this._tonghuashun.verify(temp1[i])) {
                        ret.push(temp1[i]);
                    }
                }
            }
            else {
                if (arr.length >= 3) {
                    for (var i = 0; i < arr.length - 2; i++) {
                        var temp = arr.slice(i, i + 3);
                        if (rule.verify(temp)) {
                            ret.push(temp);
                        }
                    }
                    if (arr.length > 3 && arr[0].grade == 14 && arr[arr.length - 1].grade == 2) {
                        var temp = arr.slice(arr.length - 2, arr.length);
                        temp.unshift(arr[0]);
                        if (rule.verify(temp)) {
                            ret.push(temp);
                        }
                    }
                }
            }
        }
        var rule1 = this._tonghuashun;
        ret.sort(function (a, b) {
            return rule1.compare(a, b);
        });
        return ret;
    };
    p.getLists = function () {
        var list = meru.singleton(GameData).myCard();
        var kingList = [];
        var normalList = {};
        for (var i = 0; i < list.length; i++) {
            if (list[i].isJoker) {
                kingList.push(list[i]);
            }
            else {
                if (!normalList[list[i].type]) {
                    normalList[list[i].type] = [];
                }
                normalList[list[i].type].push(list[i]);
            }
        }
        return { "king": kingList, "normal": normalList };
    };
    p.tonghua = function () {
        var ret = [];
        var lists = this.getLists();
        var map = lists.normal;
        var kings = lists.king;
        for (var key in map) {
            var arr = map[key];
            for (var i = 0; i < kings.length; i++) {
                if (kings[i].color == arr[0].color) {
                    arr = [kings[i]].concat(arr);
                }
            }
            if (arr.length >= 3) {
                ret = ret.concat(this.recursive(arr, 3));
            }
        }
        var rule = this._tonghua;
        ret.sort(function (a, b) {
            return rule.compare(a, b);
        });
        return ret;
    };
    p.recursive = function (list, num) {
        var ret = [];
        if (num == 1) {
            for (i = 0; i < list.length; i++) {
                ret.push([list[i]]);
            }
            return ret;
        }
        for (var i = 0; i < list.length; i++) {
            var temp = list.concat([]);
            temp.splice(0, i + 1);
            var sub = this.recursive(temp, num - 1);
            for (var m = 0; m < sub.length; m++) {
                ret.push([list[i]].concat(sub[m]));
            }
        }
        return ret;
    };
    p.shunzi = function () {
        var ret = [];
        var list = meru.singleton(GameData).myCard();
        var kingList = [];
        var normalList = {};
        for (var i = 0; i < list.length; i++) {
            if (list[i].isJoker) {
                kingList.push(list[i]);
            }
            else {
                if (!normalList[list[i].grade]) {
                    normalList[list[i].grade] = [];
                }
                normalList[list[i].grade].push(list[i]);
            }
        }
        if (kingList.length > 0) {
            var straight = [];
            for (var key in normalList) {
                straight.push(normalList[key][0]);
            }
            straight.sort(function (a, b) {
                return b.grade - a.grade;
            });
            straight = straight.concat(kingList);
            var temp = this.recursive(straight, 3);
            for (var i = 0; i < temp.length; i++) {
                if (this._shunzi.verify(temp[i])) {
                    ret.push(temp[i]);
                }
            }
        }
        else {
            ret = meru.singleton(GameData).straightList();
        }
        var rule1 = this._shunzi;
        ret.sort(function (a, b) {
            return rule1.compare(a, b);
        });
        return ret;
    };
    p.santiao = function () {
        var triples = meru.singleton(GameData).tripleList();
        return triples;
    };
    p.duizi = function () {
        var ret = [];
        var rec = [];
        var pairs = meru.singleton(GameData).pailList();
        for (var i = 0; i < pairs.length; i++) {
            rec.push(pairs[i]);
        }
        var my = meru.singleton(GameData).myCard();
        var dan = [];
        for (var m = 0; m < my.length; m++) {
            dan.push([my[m]]);
        }
        for (var i = 0; i < rec.length; i++) {
            for (var j = 0; j < dan.length; j++) {
                var can = true;
                if (dan[j][0].grade == rec[i][0].grade) {
                    can = false;
                    break;
                }
                if (can) {
                    ret.push(rec[i].concat(dan[j]));
                }
            }
        }
        //从3个上面拆下来的放后面
        var list1 = [];
        var list2 = [];
        for (var i = 0; i < ret.length; i++) {
            var find = false;
            if (!this.isPair(ret[i][0])) {
                find = true;
            }
            if (!find) {
                for (var j = 2; j < ret[i].length; j++) {
                    if (!this.isSingle(ret[i][j])) {
                        find = true;
                        break;
                    }
                }
            }
            if (find) {
                list1.push(ret[i]);
            }
            else {
                list2.push(ret[i]);
            }
        }
        return list1.concat(list2);
    };
    p.isSingle = function (card) {
        var cards = meru.singleton(GameData).myCard();
        var num = 0;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].grade == card.grade) {
                num += 1;
            }
        }
        return num == 1;
    };
    p.isPair = function (card) {
        var cards = meru.singleton(GameData).myCard();
        var num = 0;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].grade == card.grade) {
                num += 1;
            }
        }
        return num == 2;
    };
    p.getRecommends = function () {
        return this._recommends;
    };
    p.doRecommend = function (t) {
        if (this._done == false) {
            this.findRecommend();
        }
        if (this._recommendType != t) {
            this._recommendType = t;
            this._recommendIdx = 0;
        }
        if (this._recommends[t].length == 0) {
            meru.tooltip("没有可推荐的");
            return;
        }
        var recommend = this._recommends[t][this._recommendIdx];
        meru.postNotification(GameEvents.SHOW_RECOMMEND, recommend);
        this._recommendIdx += 1;
        if (this._recommendIdx >= this._recommends[t].length) {
            this._recommendIdx = 0;
        }
    };
    return Recommend1;
}());
egret.registerClass(Recommend1,'Recommend1');

/**
 * Created by yang on 16/12/13.
 */
///<reference path="../../rule/RuleCenter.ts"/>
///<reference path="../../rule/Recommend1.ts"/>
var GameMutation = (function (_super) {
    __extends(GameMutation, _super);
    function GameMutation() {
        _super.call(this);
        this.on("QUIT", this.quit);
        this.on("BACK", this.back);
        this.on("CHAT", this.chat);
        this.on("RULE", this.rule);
        this.on("COMMIT", this.commit);
        this.on("CANCELSPECIAL", this.cancelSpecial);
        this.on("CONFIRMSPECIAL", this.confirmSpecial);
        this.on("HISTORY", this.history);
    }
    var d = __define,c=GameMutation,p=c.prototype;
    p.rule = function () {
        meru.UI.addBox(new ChooseRuleView());
    };
    p.chat = function () {
        meru.UI.addBox(new ChatView());
    };
    p.back = function () {
        meru.request(PRoom.leave()).then(function () {
            if (meru.UI.getScene().skinName == "MainSkin") {
                meru.UI.clearBox();
                meru.UI.runScene(new HomeLayer());
            }
        });
    };
    p.quit = function () {
        //我发起退出申请
        meru.request(PRoom.quit(1)).then(function (data) {
            // if(meru.UI.getScene().skinName == "MainSkin" && data["qac"]!="done") {
            //     meru.getData(QuitData).setRound(false);
            // }
        });
    };
    p.cancelSpecial = function (data, box) {
        meru.UI.remove(box);
    };
    p.confirmSpecial = function (data, box) {
        meru.request(PRoom.playCard("")).then(function () {
            meru.postNotification("REMOVE_TOPSCENE");
            meru.UI.remove(box);
        });
    };
    p.commit = function () {
        var list1 = meru.singleton(GameData).list1;
        var list2 = meru.singleton(GameData).list2;
        var list3 = meru.singleton(GameData).list3;
        //提交牌
        var list = [];
        for (var i = 0; i < list1.length; i++) {
            list.push(list1[i].data);
        }
        for (var i = 0; i < list2.length; i++) {
            list.push(list2[i].data);
        }
        for (var i = 0; i < list3.length; i++) {
            list.push(list3[i].data);
        }
        var str = list.join(",");
        console.log("提交的数据:" + str);
        if (str == "") {
            var poker = PRoom.getCache("si.poker");
            meru.request({ "moddo": "User.uploadLog", "params": { "logStr": "提交空字符串" + poker + "嗯" } });
            meru.postNotification("removeAllList");
            meru.singleton(RuleCenter).analysis.reconnect();
            meru.tooltip("请重新提交");
            return;
        }
        meru.request(PRoom.playCard(str)).then(function () {
            meru.postNotification("REMOVE_TOPSCENE");
        });
    };
    p.history = function () {
        var rId = PRoom.getCache("rId");
        var d = meru.getCache(PRoom.roundResults());
        if (d) {
            var st = PRoom.getCache("base.st");
            var rd = PRoom.getCache("base.rd");
            var v1 = st == Const.ROOM_STATUS_WAIT && d.l.length == rd;
            var v2 = st == Const.ROOM_STATUS_PLAYING && d.length == rd - 1;
            if (v1 || v2) {
                this.realHistory();
            }
            else {
                var that = this;
                meru.request(PRoom.roundResults(rId, true)).then(function () {
                    that.realHistory();
                });
            }
        }
        else {
            var that = this;
            meru.request(PRoom.roundResults(rId, true)).then(function () {
                that.realHistory();
            });
        }
    };
    p.realHistory = function () {
        meru.UI.addBox(new RoundHistoryView());
    };
    return GameMutation;
}(meru.BaseMutation));
egret.registerClass(GameMutation,'GameMutation');
meru.injectionMutation("GAME", GameMutation);

/**
 * Created by yang on 16/12/14.
 */
var GameView = (function (_super) {
    __extends(GameView, _super);
    function GameView() {
        _super.call(this);
        this._pnMap = {}; //key是玩家通用真实位置,value是在界面上的位置
        this._timeId = -1;
        this._tickId = 30;
        this._lastTurn = -1;
        this._lastStatus = -1;
        meru.singleton(ShareListener).roomShare("init");
        this.skinName = "MainSkin";
        if (meru.singleton(SoundManager).getLaseBMG()) {
            meru.singleton(SoundManager).playBGM2();
        }
        meru.singleton(RuleCenter).init13zhang();
        // navigator.getBattery().then(function(result) {
        //     console.log(result.charging)//是否在充电
        //     console.log(result.level)//电量比例
        // });
    }
    var d = __define,c=GameView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.refreshView();
        meru.addNotification(GameEvents.DATA_CHANGE, this.refreshView, this);
        meru.addNotification(GameEvents.REFRESH_USER, this.refreshUserView, this);
        meru.addNotification("BACK_HOME_BTN", this.backHomeVisible, this);
        meru.addNotification(GameEvents.CONTINUE_STATUS, this.continueBtnChange, this);
        this._timeId = meru.setInterval(this.onTick, this, 1000);
        this.listener(this.continueBtn, this.onContinue);
        this.listener(this.backHomeBtn, this.backHome);
        meru.singleton(RuleCenter).analysis["pushAll"]();
        var base = PRoom.getCache("base");
        if (base["st"] == Const.ROOM_STATUS_PLAYING) {
            var d = PRoom.getCache("rus")[GameUtils.getMyPos()];
            if (d["hp"] != 1) {
                meru.setTimeout(function () {
                    if (!DealCard.isDealing) {
                        meru.UI.addCommon(new MyView());
                    }
                }, this, 200);
            }
        }
        else if (base["st"] == Const.ROOM_STATUS_WAIT) {
            meru.singleton(ResultPlay).playEnd();
        }
    };
    p.onExit = function () {
        meru.singleton(ResultPlay).stop();
        DealCard.isDealing = false;
        this.clearListeners();
        meru.removeNotificationByTarget(this);
        _super.prototype.onExit.call(this);
        meru.clearInterval(this._timeId);
    };
    p.onTick = function () {
        var cur = PRoom.getCache("base.st");
        var status = [Const.ROOM_STATUS_PLAYING];
        if (status.indexOf(cur) > -1) {
            if (this._tickId > 0) {
                this._tickId -= 1;
            }
            this["tick1"].text = "" + this._tickId;
            this["tick1"].visible = true;
        }
        else {
            this["tick1"].visible = false;
        }
    };
    p.baseDataChange = function () {
        var info = PRoom.getCache("");
        var base = info["base"];
        this["round"].text = '局数：' + base["rd"] + '/' + base["mrd"];
        this["room"].text = '房间号：' + base["code"];
        this.backBtn.visible = (base["owner"] != PUser.getCache("i.id")) && (base["rd"] == 0); //不是房主 并且还没开始
    };
    p.refreshUserView = function () {
        var users = PRoom.getCache("rus");
        var myPos = GameUtils.getMyPos();
        var max = meru.singleton(GameData).getMaxNumber();
        for (var i = 1; i <= 5; i++) {
            var v = myPos + i;
            var idx = v % 5;
            if (idx == 0) {
                idx = 5;
            }
            this._pnMap[idx] = i;
        }
        for (var i = 1; i <= 5; i++) {
            if (this["user" + this._pnMap[i]]) {
                this["user" + this._pnMap[i]].refreshView(users[i], this._pnMap[i]);
            }
        }
        this.user0.refreshView(users[myPos]);
        if (this._lastTurn != PRoom.getCache("base")["nTurn"] || this._lastStatus != PRoom.getCache("base")["st"]) {
            this._tickId = 300;
        }
        this._lastTurn = PRoom.getCache("base")["nTurn"];
        this._lastStatus = PRoom.getCache("base")["st"];
        var list = [];
        for (var i = 0; i < max; i++) {
            var v1 = i - (myPos - 1);
            if (v1 < 0) {
                v1 += 5;
            }
            list.push(v1);
        }
        for (var i = 0; i < 5; i++) {
            this["user" + i].visible = list.indexOf(i) > -1;
        }
        this.inviteNode.visible = (Object.keys(users).length < max);
    };
    p.refreshView = function () {
        this.baseDataChange();
        this.refreshUserView();
        this.continueBtnChange(false);
    };
    p.backHomeVisible = function () {
        this["quit"].visible = false;
        this.backHomeBtn.visible = true;
    };
    p.continueBtnChange = function (v) {
        if (v || RoundOverView.register) {
            this.continueBtn.visible = false;
            return;
        }
        this.continueBtn.visible = (Const.ROOM_STATUS_WAIT == PRoom.getCache("base")["st"] && !GameUtils.confirmed() && PRoom.getCache("base.rd") < PRoom.getCache("base.mrd"));
    };
    p.onContinue = function () {
        var that = this;
        meru.request(PRoom.cmReady()).then(function () {
            console.log("我准备啦");
            that.continueBtn.visible = false;
        });
    };
    p.backHome = function () {
        meru.request(PRoom.getInfo(true)).then(function () {
            meru.UI.clearBox();
            meru.UI.runScene(new HomeLayer());
        });
    };
    return GameView;
}(meru.BaseComponent));
egret.registerClass(GameView,'GameView');

/**
 * Created by yang on 17/3/2.
 */
var HelpView = (function (_super) {
    __extends(HelpView, _super);
    function HelpView() {
        _super.call(this);
        this.skinName = "HelpSkin";
    }
    var d = __define,c=HelpView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        // this.check1.selected = true;
        // this.check1.group.addEventListener(eui.UIEvent.CHANGE, this.dataChange,this);
        // this.dataChange();
    };
    p.dataChange = function () {
        if (this.check1.selected) {
            this["zhuangjia"].visible = true;
            this["suanfen"].visible = false;
        }
        else {
            this["zhuangjia"].visible = false;
            this["suanfen"].visible = true;
        }
    };
    p.onExit = function () {
        // this.check1.group.removeEventListener(eui.UIEvent.CHANGE, this.dataChange,this);
        _super.prototype.onExit.call(this);
    };
    return HelpView;
}(meru.BaseComponent));
egret.registerClass(HelpView,'HelpView');

/**
 * Created by yang on 17/1/5.
 */
var MyView = (function (_super) {
    __extends(MyView, _super);
    function MyView() {
        _super.call(this);
        this._list1 = [];
        this._data1 = [];
        this._selectList = [];
        this._beginCard = null;
        this.skinName = "ArrangeSkin";
        meru.singleton(GameData).reset();
    }
    var d = __define,c=MyView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.gameData = meru.singleton(GameData);
        this._selectList = [];
        meru.addNotification("removeAllList", this.removeAllList, this);
        meru.addNotification("REMOVE_TOPSCENE", this.removeMe, this);
        meru.addNotification(GameEvents.MY_DATA_CHANGE, this.refreshMyView, this);
        meru.addNotification(GameEvents.SHOW_RECOMMEND, this.doRecommend, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.listener(this.topCancel, this.cancel1);
        this.listener(this.midCancel, this.cancel2);
        this.listener(this.lastCancel, this.cancel3);
        this.part1Btn.touchEnabled = true;
        this.part1Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.partClick1, this);
        this.part2Btn.touchEnabled = true;
        this.part2Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.partClick2, this);
        this.part3Btn.touchEnabled = true;
        this.part3Btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.partClick3, this);
        meru.addNotification(GameEvents.AUTO_SELECT, this.autoClick, this);
        meru.addNotification(GameEvents.DATA_CHANGE, this.dataChange, this);
        this.surrenderVisible();
        this.afterSynchronize();
        // meru.setTimeout(()=>{
        //     this["list1"].x = this["tab"].x + 20;
        //     this["list2"].x = this["tab"].x + 20;
        // },this,30);
        if (meru.display.stageW < 720) {
            var layout = this.cardList1.layout;
            layout.gap = -60 + Math.ceil((meru.display.stageW - 720) / 13);
            this["tab"].scaleX = meru.display.stageW / 720;
        }
        var poker = PRoom.getCache("si.poker");
        if (!poker) {
            meru.singleton(SocketSynchronize).synchronize(this.afterSynchronize, this);
        }
    };
    p.afterSynchronize = function () {
        this.refreshMyView();
    };
    p.surrenderVisible = function () {
        this.btnVisible();
    };
    p.btnVisible = function () {
        this.commitBtn.right = 280;
    };
    p.dataChange = function () {
        this.surrenderVisible();
    };
    p.onExit = function () {
        this._list1 = [];
        this._selectList = [];
        this._data1 = [];
        meru.removeNotification("removeAllList", this.removeAllList, this);
        meru.removeNotification("REMOVE_TOPSCENE", this.removeMe, this);
        meru.removeNotification(GameEvents.MY_DATA_CHANGE, this.refreshMyView, this);
        meru.removeNotification(GameEvents.SHOW_RECOMMEND, this.doRecommend, this);
        meru.removeNotification(GameEvents.DATA_CHANGE, this.dataChange, this);
        meru.removeNotification(GameEvents.AUTO_SELECT, this.partClick1, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.clearListeners();
        this.part1Btn.touchEnabled = false;
        this.part1Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.partClick1, this);
        this.part2Btn.touchEnabled = false;
        this.part2Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.partClick2, this);
        this.part3Btn.touchEnabled = false;
        this.part3Btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.partClick3, this);
        _super.prototype.onExit.call(this);
    };
    p.removeMe = function () {
        meru.display.removeFromParent(this);
    };
    p.isTouchIn = function (x, y) {
        var length1 = this._list1.length - 1;
        for (var i = length1; i >= 0; i--) {
            if (this._list1[i].visible && this._list1[i].$hitTest(x, y)) {
                return this._list1[i];
            }
        }
        return null;
    };
    p.getList = function (list, idx1, idx2) {
        var ret = [];
        var big, small;
        if (idx1 > idx2) {
            big = idx1;
            small = idx2;
        }
        else if (idx1 < idx2) {
            big = idx2;
            small = idx1;
        }
        else {
            big = idx1;
            small = idx1;
        }
        for (var i = 0; i < list.length; i++) {
            if (i >= small && i <= big) {
                ret.push(list[i]);
            }
        }
        return ret;
    };
    p.showSelectEffect = function () {
        for (var i = 0; i < this._list1.length; i++) {
            this._list1[i].unTap();
        }
        for (var i = 0; i < this._selectList.length; i++) {
            this._selectList[i].tap();
        }
    };
    p.selectChange = function () {
        for (var i = 0; i < this._selectList.length; i++) {
            this._selectList[i].unTap();
            this._selectList[i].selectChange();
        }
        var list = [];
        for (var i = 0; i < this._list1.length; i++) {
            if (this._list1[i].choose()) {
                list.push(this._list1[i].data);
            }
        }
        this.gameData.selectChange(list);
    };
    p.doRecommend = function (list) {
        // this.refreshMyView();
        for (var i = 0; i < this._list1.length; i++) {
            this._list1[i].unTap();
            this._list1[i].setUnSelect();
        }
        this._selectList = [];
        var con = this._list1;
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < con.length; j++) {
                if (con[j].data.data == list[i].data && this._selectList.indexOf(con[j]) == -1) {
                    this._selectList.push(con[j]);
                    break;
                }
            }
        }
        this.selectChange();
    };
    p.touchBegin = function (e) {
        this._beginX = e.stageX;
        this._beginY = e.stageY;
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this._selectList = [];
        this._beginCard = this.isTouchIn(this._beginX, this._beginY);
        if (this._beginCard) {
            this._selectList.push(this._beginCard);
        }
        this.showSelectEffect();
    };
    p.touchMove = function (e) {
        if (this._beginCard) {
            var move = this.isTouchIn(e.stageX, e.stageY);
            if (move) {
                //begin和move中间的
                this._selectList = [];
                var list = this._list1;
                var idx1 = list.indexOf(this._beginCard);
                var idx2 = list.indexOf(move);
                this._selectList = this.getList(list, idx1, idx2);
            }
        }
        this.showSelectEffect();
    };
    p.touchEnd = function (e) {
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.touchMove(e);
        this.selectChange();
    };
    p.refreshMyView = function () {
        if (!this.cardList1) {
            return;
        }
        var myCards = this.gameData.myCard();
        this._data1 = myCards;
        var dp1 = this.cardList1.dataProvider;
        if (!dp1) {
            dp1 = new eui.ArrayCollection();
        }
        dp1.source = this._data1;
        dp1.refresh();
        this.cardList1.validateNow();
        this._list1 = [];
        for (var i = 0; i < this._data1.length; i++) {
            this._list1.push(this.cardList1.getElementAt(i));
        }
        for (var i = 0; i < this._list1.length; i++) {
            this._list1[i].unTap();
            this._list1[i].setUnSelect();
        }
        var dp2 = this.topList.dataProvider;
        if (!dp2) {
            dp2 = new eui.ArrayCollection();
        }
        dp2.source = this.gameData.list1;
        dp2.refresh();
        this.topList.visible = this.gameData.list1.length > 0;
        this.topCancel.visible = this.gameData.list1.length > 0;
        if (this.gameData.list1.length > 0) {
            var rule = meru.singleton(RuleCenter).verify(this.gameData.list1);
            this.topType.visible = true;
            this.topType.source = "label_cardType_" + rule.level + "_png";
        }
        else {
            this.topType.visible = false;
        }
        var dp3 = this.midList.dataProvider;
        if (!dp3) {
            dp3 = new eui.ArrayCollection();
        }
        dp3.source = this.gameData.list2;
        dp3.refresh();
        this.midList.visible = this.gameData.list2.length > 0;
        this.midCancel.visible = this.gameData.list2.length > 0;
        if (this.gameData.list2.length > 0) {
            var rule = meru.singleton(RuleCenter).verify(this.gameData.list2);
            this.midType.visible = true;
            this.midType.source = "label_cardType_" + rule.level + "_png";
        }
        else {
            this.midType.visible = false;
        }
        var dp4 = this.lastList.dataProvider;
        if (!dp4) {
            dp4 = new eui.ArrayCollection();
        }
        dp4.source = this.gameData.list3;
        dp4.refresh();
        this.lastList.visible = this.gameData.list3.length > 0;
        this.lastCancel.visible = this.gameData.list3.length > 0;
        if (this.gameData.list3.length > 0) {
            var rule = meru.singleton(RuleCenter).verify(this.gameData.list3);
            this.lastType.visible = true;
            this.lastType.source = "label_cardType_" + rule.level + "_png";
        }
        else {
            this.lastType.visible = false;
        }
        this._selectList = [];
        this.selectChange();
        this.checkDone();
        this.refreshSpecial();
    };
    p.removeAllList = function () {
        this.cancel1();
        this.cancel2();
        this.cancel3();
    };
    p.cancel1 = function () {
        this.gameData.ignore = true;
        this.gameData.list1 = [];
        this.gameData.ignore = false;
    };
    p.cancel2 = function () {
        this.gameData.ignore = true;
        this.gameData.list2 = [];
        this.gameData.ignore = false;
    };
    p.cancel3 = function () {
        this.gameData.ignore = true;
        this.gameData.list3 = [];
        this.gameData.ignore = false;
    };
    p.autoClick = function () {
        if (this.gameData.list1.length == 0) {
            this.partClick1();
        }
        else if (this.gameData.list2.length == 0) {
            this.partClick2();
        }
        else if (this.gameData.list3.length == 0) {
            this.partClick3();
        }
    };
    p.partClick1 = function () {
        if (this.gameData.list1.length > 0) {
            return;
        }
        if (this.gameData.selectList.length == 3) {
            if (this.gameData.list2.length > 0) {
                var rule2 = meru.singleton(RuleCenter).verify(this.gameData.list2);
                var rule1 = meru.singleton(RuleCenter).verify(this.gameData.selectList);
                if (rule1.level > rule2.level) {
                    meru.tooltip("头道不能比中道大");
                    return;
                }
                else if (rule1.level == rule2.level && rule1.compare(this.gameData.selectList, this.gameData.list2) > 0) {
                    meru.tooltip("头道不能比中道大");
                    return;
                }
            }
            this.gameData.list1 = this.gameData.selectList;
        }
        else {
            meru.tooltip("需要3张");
        }
    };
    p.partClick2 = function () {
        if (this.gameData.list2.length > 0) {
            return;
        }
        if (this.gameData.selectList.length == 3) {
            if (this.gameData.list1.length > 0) {
                var rule1 = meru.singleton(RuleCenter).verify(this.gameData.list1);
                var rule2 = meru.singleton(RuleCenter).verify(this.gameData.selectList);
                if (rule1.level > rule2.level) {
                    meru.tooltip("中道不能比头道小");
                    return;
                }
                if (rule1.level == rule2.level && rule1.compare(this.gameData.list1, this.gameData.selectList) > 0) {
                    meru.tooltip("中道不能比头道小");
                    return;
                }
            }
            if (this.gameData.list3.length > 0) {
                var rule3 = meru.singleton(RuleCenter).verify(this.gameData.list3);
                var rule2 = meru.singleton(RuleCenter).verify(this.gameData.selectList);
                if (rule2.level > rule3.level) {
                    meru.tooltip("中道不能比尾道大");
                    return;
                }
                if (rule2.level == rule3.level && rule2.compare(this.gameData.selectList, this.gameData.list3) > 0) {
                    meru.tooltip("中道不能比尾道大");
                    return;
                }
            }
            this.gameData.list2 = this.gameData.selectList;
        }
        else {
            meru.tooltip("需要3张");
        }
    };
    p.partClick3 = function () {
        if (this.gameData.list3.length > 0) {
            return;
        }
        if (this.gameData.selectList.length == 3) {
            if (this.gameData.list2.length > 0) {
                var rule2 = meru.singleton(RuleCenter).verify(this.gameData.list2);
                var rule3 = meru.singleton(RuleCenter).verify(this.gameData.selectList);
                if (rule2.level > rule3.level) {
                    meru.tooltip("尾道不能比中道小");
                    return;
                }
                if (rule2.level == rule3.level && rule2.compare(this.gameData.list2, this.gameData.selectList) > 0) {
                    meru.tooltip("尾道不能比中道小");
                    return;
                }
            }
            this.gameData.list3 = this.gameData.selectList;
        }
        else {
            meru.tooltip("需要3张");
        }
    };
    p.refreshSpecial = function () {
        if (!meru.singleton(GameData).hasRule(Const.SETTING_SPECIAL)) {
            return;
        }
        var ret = meru.singleton(RuleCenter).getSpecial();
        var dp = this.xiList.dataProvider;
        if (!dp) {
            dp = new eui.ArrayCollection();
        }
        dp.source = ret;
        dp.refresh();
    };
    p.checkDone = function () {
        // this.commitBtn.visible = (this.gameData.myCard().length == 0);
        this.commitBtn.enabled = (this.gameData.myCard().length == 0);
        this.btnVisible();
    };
    return MyView;
}(meru.BaseComponent));
egret.registerClass(MyView,'MyView');

/**
 * Created by yang on 17/2/11.
 */
var SelectTab = (function (_super) {
    __extends(SelectTab, _super);
    function SelectTab() {
        _super.apply(this, arguments);
    }
    var d = __define,c=SelectTab,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        meru.addNotification(GameEvents.MY_DATA_CHANGE, this.reset, this);
        for (var i = 2; i <= 5; i++) {
            this["cardType" + i].data = { "cardType": i };
            this.listener(this["cardType" + i], this["doRec" + i]);
        }
        this.reset();
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        meru.removeNotificationByTarget(this);
        this.clearListeners();
    };
    p.reset = function () {
        meru.singleton(Recommend1).findRecommend();
        var rec = meru.singleton(Recommend1).getRecommends();
        for (var key in rec) {
            this["cardType" + key].enabled = rec[key].length > 0;
        }
    };
    p.doRec2 = function () {
        meru.singleton(Recommend1).doRecommend(2);
    };
    p.doRec3 = function () {
        meru.singleton(Recommend1).doRecommend(3);
    };
    p.doRec4 = function () {
        meru.singleton(Recommend1).doRecommend(4);
    };
    p.doRec5 = function () {
        meru.singleton(Recommend1).doRecommend(5);
    };
    return SelectTab;
}(meru.BaseComponent));
egret.registerClass(SelectTab,'SelectTab');

/**
 * Created by yang on 17/2/17.
 */
var ShowCardView = (function (_super) {
    __extends(ShowCardView, _super);
    function ShowCardView() {
        _super.apply(this, arguments);
    }
    var d = __define,c=ShowCardView,p=c.prototype;
    p.refreshView = function (cards, idx, score) {
        this.visible = true;
        var rule = meru.singleton(RuleCenter).verify(cards);
        this.cardType.source = "label_cardType_" + rule.type + "_png";
        // meru.singleton(SoundManager).playEffect("common"+rule.type+"_mp3");
        for (var i = 0; i < cards.length; i++) {
            this["card" + i].setData(cards[i]);
        }
        //分數顯示;
        if (score >= 0) {
            this.score.text = "+" + score;
            this.score.font = "point_yellow_font_fnt";
        }
        else {
            this.score.text = "" + score;
            this.score.font = "point_blue_font_fnt";
        }
    };
    return ShowCardView;
}(meru.BaseComponent));
egret.registerClass(ShowCardView,'ShowCardView');

/**
 * Created by yang on 16/12/16.
 */
var UserView = (function (_super) {
    __extends(UserView, _super);
    function UserView() {
        _super.call(this);
        this._loader = new HeadLoader();
        this._click = false;
        this._tempScore = 0;
        this._voiceTick = -1;
        this._voiceTime = -1;
        this._mvList1 = [];
        this._isDealing = false;
    }
    var d = __define,c=UserView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        meru.addNotification(GameEvents.STATUS_CHANGE, this.refreshHead, this);
        meru.addNotification(GameEvents.USER_CHAT, this.chat, this);
        this.listener(this.infoBtn, this.info);
        if (this["touchArea"]) {
            this["touchArea"].touchEnabled = true;
            this["touchArea"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.cardReview, this);
        }
    };
    p.onExit = function () {
        meru.removeNotification(GameEvents.STATUS_CHANGE, this.refreshHead, this);
        meru.removeNotification(GameEvents.USER_CHAT, this.chat, this);
        this.clearListeners();
        if (this["touchArea"]) {
            this["touchArea"].touchEnabled = false;
            this["touchArea"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.cardReview, this);
        }
        _super.prototype.onExit.call(this);
    };
    p.cardReview = function () {
        var base = PRoom.getCache("base");
        if (base["st"] == Const.ROOM_STATUS_PLAYING && (this._data && this._data.uId == PUser.getCache("i.id"))) {
            //这时候可以看自己摆的牌
            this._click = true;
            var sp = PRoom.getCache("si.poker").split(",");
            for (var i = 0; i < 9; i++) {
                if (!this["card" + i].isShowBack()) {
                    this["card" + i].showBack();
                }
                else {
                    this["card" + i].hideBack();
                    this["card" + i].setData(new CardData(sp[i]));
                }
            }
        }
    };
    p.info = function () {
        if (this._data && this._data.uId != PUser.getCache("i.id")) {
            meru.postNotification('INFO.OPEN', this._data);
        }
    };
    p.refreshView = function (data, idx) {
        if (idx === void 0) { idx = 0; }
        this._data = data;
        this._idx = idx;
        this.cardList.visible = false;
        if (idx > 0) {
            // this.skinName = "OtherPlayerSkin"+idx;
            //头像
            if (!data) {
                this.baseContainer.visible = false;
                return;
            }
            this.baseContainer.visible = true;
        }
        else {
        }
        var base = PRoom.getCache("base");
        this.score.text = "" + data["tsc"];
        this._tempScore = 0;
        this.refreshHead();
        //名字
        this.palyerName.text = GameUtils.formatName(data["nm"], data);
        this.arranging.visible = false;
        this.special.visible = false;
        this.curScore.visible = false;
        this.showCard.visible = false;
        this.point.visible = false;
        this["firstPoint"].visible = false;
        this["midPoint"].visible = false;
        this["lastPoint"].visible = false;
        console.log("这是刷新了");
        this.ready.visible = false;
        if (base["st"] == Const.ROOM_STATUS_FREE) {
            //人没来齐
            this._click = false;
        }
        else if (base["st"] == Const.ROOM_STATUS_PLAYING) {
            //有人还在理牌中
            if (data["hp"] == 1) {
                this.cardList.visible = true;
                if (!this._click) {
                    this.allShowBack();
                }
            }
            else {
                if (!this._isDealing && !DealCard.isDealing) {
                    this.arranging.visible = true;
                }
            }
        }
        else {
            this._click = false;
            this.point.visible = true;
            this.cardList.visible = true;
            this.ready.visible = (data["cm"] == 1);
            this.refreshCurScore(this._data["lsc"]);
            this.refreshCardList();
        }
    };
    p.refreshCardList = function () {
        var sp = this._data["shPai"].split(",");
        for (var i = 0; i < 9; i++) {
            this["card" + i].hideBack();
            this["card" + i].setData(new CardData(sp[i]));
        }
        var daos = this._data["lwd"]["daos"];
        this.refreshScore(this["firstPoint"], daos[0]);
        this.refreshScore(this["midPoint"], daos[1]);
        this.refreshScore(this["lastPoint"], daos[2]);
    };
    p.refreshScore = function (txt, score) {
        txt.visible = true;
        if (score >= 0) {
            txt.text = "+" + score;
            txt.font = "point_yellow_font_fnt";
        }
        else {
            txt.text = score;
            txt.font = "point_blue_font_fnt";
        }
    };
    p.refreshCurScore = function (score) {
        this.curScore.visible = true;
        if (score >= 0) {
            this.curScore.text = "+" + score;
            this.curScore.font = "point_yellow_font_fnt";
        }
        else {
            this.curScore.text = score + "";
            this.curScore.font = "point_blue_font_fnt";
        }
    };
    p.refreshHead = function () {
        if (!this._data) {
            return;
        }
        if (this._data["uId"] == PUser.getCache("i.id")) {
            if (!Const.ONOFF["d"]) {
                Const.ONOFF["d"] = {};
            }
            Const.ONOFF["d"][this._data["pn"]] = 1;
        }
        if (!Const.ONOFF["d"]) {
            return;
        }
        if (Const.ONOFF["d"][this._data["pn"]] == 1) {
            this.offline.visible = false;
            if (this._data["pic"] == 1) {
                if (this._data["ldo"] == 1) {
                    this._loader.init(this.head, "head_1_png", this._idx);
                }
                else {
                    this._loader.init(this.head, "head_2_png", this._idx);
                }
            }
            else {
                this._loader.init(this.head, this._data["pic"], this._idx);
            }
            if (Const.ONOFF["v"] && Const.ONOFF["v"][this._data["pn"]]) {
                console.log("说话中");
                if (this._data["uId"] != PUser.getCache("i.id")) {
                    this.addVoiceTick();
                }
            }
            else {
                console.log("说话结束");
                this.removeVoiceTick();
            }
        }
        else {
            if (Const.ONOFF["v"]) {
                Const.ONOFF["v"][this._data["pn"]] = 0;
            }
            this.removeVoiceTick();
            console.log("离线");
            this.offline.visible = true;
            if (this._data["pic"] == 1) {
                if (this._data["ldo"] == 1) {
                    this._loader.init(this.head, "head_1_png", this._idx);
                }
                else {
                    this._loader.init(this.head, "head_2_png", this._idx);
                }
            }
            else {
                this._loader.init(this.head, this._data["pic"], this._idx);
            }
        }
    };
    p.voiceTick = function () {
        var arr = ["语音.", "语音..", "语音..."];
        this._voiceTime += 1;
        if (this._voiceTime > 2) {
            this._voiceTime = 0;
        }
        this.voiceLabel.text = arr[this._voiceTime];
    };
    p.addVoiceTick = function () {
        meru.clearInterval(this._voiceTick);
        this["yuyin"].visible = true;
        this._voiceTime = -1;
        this._voiceTick = meru.setInterval(this.voiceTick, this, 300);
        this.voiceTick();
    };
    p.removeVoiceTick = function () {
        this["yuyin"].visible = false;
        meru.clearInterval(this._voiceTick);
    };
    p.chat = function (data) {
        if (this._data && this._data["uId"] == data["uId"]) {
            console.log(this._data["nm"] + "说了type:" + data["t"] + "ct:" + data["ct"]);
            this.bubble.refreshView(data);
        }
    };
    p.showScore = function () {
        this.score.text = "" + this._data["tsc"];
    };
    p.allShowBack = function () {
        for (var i = 0; i < 9; i++) {
            this["card" + i].showBack();
        }
    };
    p.hideAll = function (surrender) {
        this._click = false;
        this.cardList.visible = true;
        this.allShowBack();
        this.arranging.visible = false;
        // this.score.text = ""+(this._data["tsc"]-this._data["lsc"]);
    };
    p.showCards = function (idx, cards, score) {
        var _this = this;
        var data = meru.singleton(GameData).getSortCard(cards);
        for (var i = 0; i < data.length; i++) {
            this["card" + (i + idx)].hideBack();
            this["card" + (i + idx)].setData(data[i]);
            this["card" + (i + idx)].visible = false;
        }
        var map = { "0": 0, "3": 1, "6": 2 };
        var l = ["showTop", "showMid", "showLast"];
        var l1 = ["firstPoint", "midPoint", "lastPoint"];
        var realIdx = map[idx];
        this.showCard.refreshView(data, realIdx, score);
        this.showCard.bottom = this[l[realIdx]].bottom;
        meru.setTimeout(function () {
            if (!PRoom.getCache("base")) {
                return;
            }
            for (var i = 0; i < data.length; i++) {
                _this["card" + (i + idx)].visible = true;
            }
            _this.showCard.visible = false;
            //更新我得分数
            _this.scoreChange(score);
            _this.point.visible = true;
            for (var i = 0; i <= realIdx; i++) {
                _this[l1[realIdx]].visible = true;
            }
            _this.refreshScore(_this[l1[realIdx]], score);
        }, this, 1000);
    };
    p.scoreChange = function (score) {
        this._tempScore += score;
        this.refreshCurScore(this._tempScore);
    };
    p.showSpecial = function (t, score) {
        var _this = this;
        this.special.visible = true;
        this.special.refreshView(t, score);
        meru.setTimeout(function () {
            //我加别人减
            if (!PRoom.getCache("rus")) {
                return;
            }
            var total = meru.singleton(GameData).getMaxNumber() - 1;
            var scene = meru.UI.getScene();
            for (var i = 0; i < 5; i++) {
                var uv = scene['user' + i];
                if (uv && uv._data) {
                    if (uv._data.uId == _this._data.uId) {
                        uv.scoreChange(score);
                    }
                    else {
                        uv.scoreChange(-score / total);
                    }
                }
            }
            _this.special.visible = false;
        }, this, 1000);
    };
    p.playDealMovie = function () {
        this._isDealing = true;
        this._mvList1 = [];
        this.arranging.visible = false;
        this.dealNode.removeChildren();
        for (var i = 0; i < 9; i++) {
            meru.setTimeout(this.playMovie1, this, 150 * i, i);
        }
    };
    p.playMovie1 = function (idx) {
        if (this.dealNode) {
            var movie = meru.getTypePool("fapai", meru.Movie).pop("fapai");
            movie.scaleX = movie.scaleY = 0.72;
            movie.play("1");
            movie.x = idx * 23 + 45;
            movie.y = 58;
            this.dealNode.addChild(movie);
            this._mvList1.push(movie);
            if (this._data.uId == PUser.getCache("i.id")) {
                meru.singleton(SoundManager).playEffect("deal_mp3");
            }
        }
        if (idx == 8) {
            this._isDealing = false;
            this.arranging.visible = true;
            while (this._mvList1.length > 0) {
                var mv = this._mvList1.shift();
                meru.display.removeFromParent(mv);
                meru.getTypePool("fapai", meru.Movie).push(mv);
            }
        }
    };
    return UserView;
}(meru.BaseComponent));
egret.registerClass(UserView,'UserView');

/**
 * Created by yang on 17/1/9.
 */
var VoiceView = (function (_super) {
    __extends(VoiceView, _super);
    function VoiceView() {
        _super.apply(this, arguments);
        this._isSend = false;
    }
    var d = __define,c=VoiceView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.voiceBtn.visible = false;
        this.initVoice();
        meru.addNotification("uploadVoiceDone", this.uploadVoiceDone, this);
        meru.addNotification("voiceRecordTimeOut", this.voiceRecordTimeOut, this);
        meru.addNotification("afterStopVoice", this.afterStop, this);
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        this.clearVoice();
        meru.removeNotification("uploadVoiceDone", this.uploadVoiceDone, this);
        meru.removeNotification("voiceRecordTimeOut", this.voiceRecordTimeOut, this);
        meru.removeNotification("afterStopVoice", this.afterStop, this);
    };
    p.initVoice = function () {
        this.base.visible = false;
        if (GameUtils.isRelease() && GameUtils.isIOS() && !GameUtils.isIOSApp()) {
            this.voiceBtn.visible = true;
            this.voiceBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        }
    };
    p.clearVoice = function () {
        if (GameUtils.isRelease() && GameUtils.isIOS()) {
            this.voiceBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
            this.voiceBtn.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
            this.voiceBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
            meru.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
            meru.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        }
    };
    p.touchBegin = function (e) {
        var legal = Voice.getVoice().startRecord();
        if (!legal) {
            meru.tooltip("上次录音未结束");
            return;
        }
        this.base.visible = true;
        this.voiceBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.voiceBtn.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
        this.voiceBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        meru.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
        meru.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.touchMove(e);
        if (!this._mv) {
            this._mv = new meru.Movie("voice", "voice");
            this._mv.x = 190;
            this._mv.y = 200;
            this.cancelGroup.addChild(this._mv);
            this._mv.play("1");
        }
        VoiceEvent.start();
    };
    p.touchMove = function (e) {
        this._isSend = (e.stageY < 600); //发送or取消
        this.sendGroup.visible = this._isSend;
        this.cancelGroup.visible = !this._isSend;
    };
    p.touchEnd = function (e) {
        this.base.visible = false;
        meru.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
        meru.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.voiceBtn.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
        this.voiceBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.voiceBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        if (e) {
            Voice.getVoice().stopRecord();
        }
    };
    p.afterStop = function () {
        var _this = this;
        if (!this._isSend) {
            Voice.getVoice().uploadVoice();
            this.voiceBtn.enabled = false;
            meru.setTimeout(function () {
                _this.voiceBtn.enabled = true;
                VoiceEvent.end();
            }, this, 200);
        }
        else {
            Voice.getVoice().cleanRecord();
            VoiceEvent.end();
        }
    };
    p.uploadVoiceDone = function (id, time) {
        meru.request(PChat.roomSay(ChatConst.VOICE, id, time)).then(function () {
        });
    };
    p.voiceRecordTimeOut = function () {
        this.touchEnd(null);
        this.afterStop();
    };
    return VoiceView;
}(meru.BaseComponent));
egret.registerClass(VoiceView,'VoiceView');

/**
 * Created by yang on 17/2/13.
 */
var BaseStep = (function () {
    function BaseStep(next) {
        if (next === void 0) { next = null; }
        this._isStop = false;
        this._tickId = -1;
        this._next = next;
    }
    var d = __define,c=BaseStep,p=c.prototype;
    p.getViewByUID = function (uid) {
        var scene = meru.UI.getScene();
        for (var i = 0; i < 5; i++) {
            var uv = scene['user' + i];
            if (uv && uv._data && uv._data.uId == uid) {
                return uv;
            }
        }
        return null;
    };
    p.getViewIdxByUID = function (uid) {
        var scene = meru.UI.getScene();
        for (var i = 0; i < 5; i++) {
            var uv = scene['user' + i];
            if (uv && uv._data && uv._data.uId == uid) {
                return i;
            }
        }
        return null;
    };
    p.execute = function () {
        this._isStop = false;
        meru.singleton(ResultPlay).currentStep = this;
    };
    p.stop = function () {
        this._isStop = true;
        meru.clearTimeout(this._tickId);
    };
    p.onTick = function (t) {
        if (t === void 0) { t = 1000; }
        this._tickId = meru.setTimeout(this.onNext, this, t);
    };
    p.onNext = function () {
        if (this._next) {
            this._next.execute();
        }
        else {
            meru.singleton(ResultPlay).isPlaying = false;
            GameUtils.checkBox();
            console.log("播放结束啦~~~");
            meru.singleton(ResultPlay).currentStep = null;
            meru.postNotification(GameEvents.DATA_CHANGE);
        }
    };
    return BaseStep;
}());
egret.registerClass(BaseStep,'BaseStep');

/**
 * Created by yang on 17/2/20.
 */
var DealCard = (function () {
    function DealCard() {
    }
    var d = __define,c=DealCard,p=c.prototype;
    p.execute = function (rus) {
        if (rus === void 0) { rus = PRoom.getCache("rus"); }
        for (var key in rus) {
            var view = this.getViewByUID(rus[key]["uId"]);
            if (view) {
                view.playDealMovie();
            }
        }
        meru.setTimeout(this.step, this, 2000);
    };
    p.step = function () {
        meru.UI.addCommon(new MyView());
        DealCard.isDealing = false;
    };
    p.getViewByUID = function (uid) {
        var scene = meru.UI.getScene();
        for (var i = 0; i < 5; i++) {
            var uv = scene['user' + i];
            if (uv && uv._data && uv._data.uId == uid) {
                return uv;
            }
        }
        return null;
    };
    DealCard.isDealing = false;
    return DealCard;
}());
egret.registerClass(DealCard,'DealCard');

/**
 * Created by yang on 17/2/13.
 */
var ResultPlay = (function () {
    function ResultPlay() {
        this.isPlaying = false;
        this.curScore = 0;
        this.curScoreList = [];
        this.step5 = new Step5();
        this.step4 = new Step4(this.step5);
        this.step3 = new Step3(this.step4);
        this.step2 = new Step2(this.step3);
        this.step1 = new Step1(this.step2);
    }
    var d = __define,c=ResultPlay,p=c.prototype;
    p.setData = function () {
        this.isPlaying = true;
        meru.singleton(SoundManager).playEffect("showCard_mp3");
        this.start();
    };
    p.start = function () {
        this.stop();
        this.step1.execute();
    };
    p.stop = function () {
        if (this.currentStep) {
            this.currentStep.stop();
        }
    };
    p.playEnd = function () {
    };
    return ResultPlay;
}());
egret.registerClass(ResultPlay,'ResultPlay');

/**
 * Created by yang on 17/2/13.
 */
//所有人的牌扣起来(特殊牌型的表现)
var Step1 = (function (_super) {
    __extends(Step1, _super);
    function Step1() {
        _super.apply(this, arguments);
    }
    var d = __define,c=Step1,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        var rus = PRoom.getCache("rus");
        for (var key in rus) {
            var view = this.getViewByUID(rus[key]["uId"]);
            if (view) {
                view.hideAll(rus[key]["sudr"] == 1);
            }
        }
        this.onTick();
    };
    return Step1;
}(BaseStep));
egret.registerClass(Step1,'Step1');

/**
 * Created by yang on 17/2/13.
 */
//第一轮比试
//按顺序亮牌
//我的头道分数
var Step2 = (function (_super) {
    __extends(Step2, _super);
    function Step2() {
        _super.apply(this, arguments);
        this.stepIdx = 0;
    }
    var d = __define,c=Step2,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        this.show();
    };
    p.show = function () {
        var rus = PRoom.getCache("rus");
        for (var key in rus) {
            var d = rus[key];
            var view = this.getViewByUID(d['uId']);
            if (view) {
                this.showEffect(view, d["shPai"], d["lwd"]["daos"][this.stepIdx]);
            }
        }
        this.onTick(1500);
    };
    p.showEffect = function (view, cards, score) {
        var sp = cards.split(",");
        var list = sp.slice(0, 3);
        console.log(view + "--头道--" + list);
        view.showCards(0, list.join(","), score);
        // view.showPart(this.stepIdx,score1,score2);
    };
    return Step2;
}(BaseStep));
egret.registerClass(Step2,'Step2');

/**
 * Created by yang on 17/2/13.
 */
//第二轮比试
//按顺序亮牌
//我的中道分数
var Step3 = (function (_super) {
    __extends(Step3, _super);
    function Step3() {
        _super.apply(this, arguments);
        this.stepIdx = 1;
    }
    var d = __define,c=Step3,p=c.prototype;
    p.showEffect = function (view, cards, score) {
        var sp = cards.split(",");
        var list = sp.slice(3, 6);
        console.log(view + "--中道--" + list);
        view.showCards(3, list.join(","), score);
    };
    return Step3;
}(Step2));
egret.registerClass(Step3,'Step3');

/**
 * Created by yang on 17/2/13.
 */
//第三轮比试
//按顺序亮牌
//我的尾道分数
var Step4 = (function (_super) {
    __extends(Step4, _super);
    function Step4() {
        _super.apply(this, arguments);
        this.stepIdx = 2;
    }
    var d = __define,c=Step4,p=c.prototype;
    p.showEffect = function (view, cards, score) {
        var sp = cards.split(",");
        var list = sp.slice(6, 9);
        console.log(view + "--尾道--" + list);
        view.showCards(6, list.join(","), score);
    };
    return Step4;
}(Step2));
egret.registerClass(Step4,'Step4');

/**
 * Created by yang on 2017/6/17.
 */
var Step5 = (function (_super) {
    __extends(Step5, _super);
    function Step5() {
        _super.apply(this, arguments);
    }
    var d = __define,c=Step5,p=c.prototype;
    p.execute = function () {
        _super.prototype.execute.call(this);
        //顯示怪牌的牌型和分數
        var rus = PRoom.getCache("rus");
        var delay = 0;
        for (var key in rus) {
            var spl = rus[key]["lwd"]["spls"] || {};
            if (Object.keys(spl).length > 0) {
                var d = rus[key];
                var view = this.getViewByUID(d['uId']);
                if (view) {
                    for (var k in spl) {
                        this.delay(view, k, spl[k], delay);
                        delay += 1100;
                    }
                }
            }
        }
        meru.setTimeout(this.onTick, this, delay);
    };
    p.delay = function (view, t, score, delay) {
        meru.setTimeout(function () {
            if (!PRoom.getCache("base")) {
                return;
            }
            view.showSpecial(t, score);
        }, this, delay);
    };
    return Step5;
}(BaseStep));
egret.registerClass(Step5,'Step5');

/**
 * Created by yang on 17/1/28.
 */
var BuyCardGuide = (function (_super) {
    __extends(BuyCardGuide, _super);
    function BuyCardGuide() {
        _super.call(this);
        this.skinName = "BuyCardSkin";
    }
    var d = __define,c=BuyCardGuide,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.initInfo();
    };
    p.initInfo = function () {
        if (meru.getPlatform().name == Const.bengbu) {
            this.sgyx.visible = false;
            this.pl1.visible = true;
            this.pl2.text = "蚌埠软件";
            this.bgTips.source = "icon_tips_3_png";
        }
        else if (meru.getPlatform().name == Const.sange) {
            this.pl2.text = "三哥游戏";
            this.sgyx.visible = true;
            this.pl1.visible = false;
            this.bgTips.source = "icon_tips_5_png";
        }
        else {
            this.pl2.text = "桂林棋牌屋";
            this.sgyx.visible = false;
            this.pl1.visible = false;
            this.bgTips.visible = false;
        }
    };
    return BuyCardGuide;
}(meru.BaseComponent));
egret.registerClass(BuyCardGuide,'BuyCardGuide');

var HomeData = (function (_super) {
    __extends(HomeData, _super);
    function HomeData() {
        _super.apply(this, arguments);
        this._inited = false;
    }
    var d = __define,c=HomeData,p=c.prototype;
    p.init = function () {
        var _this = this;
        this.slot('StartSkin', function () { return _this; });
    };
    p.initEvents = function () {
        if (this._inited) {
            return;
        }
        this._inited = true;
        dependProperty(this, {
            p: {
                gc: 'gc',
                mlnew: 'newMail'
            }
        });
    };
    d(p, "newMail"
        ,function () {
            return this.p.mlnew;
        }
    );
    d(p, "notice"
        ,function () {
            return this.p.gonggao;
        }
    );
    d(p, "p"
        ,function () {
            this.initEvents();
            return PUser.getCache('i');
        }
    );
    d(p, "nNa"
        ,function () {
            return GameUtils.formatName(this.p.nNa, this.p);
        }
    );
    d(p, "gc"
        ,function () {
            return this.p.gc;
        }
    );
    return HomeData;
}(meru.BaseData));
egret.registerClass(HomeData,'HomeData');
meru.injectionData('HOME', HomeData);

/**
 * Created by yang on 16/12/21.
 */
var HomeLayer = (function (_super) {
    __extends(HomeLayer, _super);
    function HomeLayer() {
        _super.call(this);
        meru.singleton(ShareListener).friendShare("init");
        if (meru.singleton(SoundManager).getLaseBMG()) {
            meru.singleton(SoundManager).playBGM1();
        }
        meru.singleton(RuleCenter).analysis["cleanPushData"]();
        this.skinName = "StartSkin";
    }
    var d = __define,c=HomeLayer,p=c.prototype;
    p.resize = function () {
        var width = egret.MainContext.instance.stage.stageWidth;
        var height = egret.MainContext.instance.stage.stageHeight;
        console.log("width:" + width);
        console.log("height:" + height);
        this.width = width;
        this.height = height;
    };
    p.onEnter = function () {
        meru.postNotification("REMOVE_TOPSCENE");
        // console.log("添加侦听");
        // meru.stage.addEventListener(egret.StageOrientationEvent.ORIENTATION_CHANGE, this.resize, this);
        if (egret.getOption("czn") == "1") {
            this.currentState = 'apple';
        }
        var pic = PUser.getCache("i.pic");
        var loader = new HeadLoader();
        if (pic == 1) {
            loader.init(this.head, "head_2_png", 4);
        }
        else {
            loader.init(this.head, pic, 4);
        }
        if (egret.getOption("czn") != "1") {
            this._mv1 = meru.getTypePool("UIEffect", meru.Movie).pop("UIEffect");
            this._mv1.x = 100;
            this._mv1.y = 47;
            this._mv1.play("1");
            this.bottomNode.addChild(this._mv1);
        }
        this._mv2 = meru.getTypePool("UIEffect", meru.Movie).pop("UIEffect");
        if (egret.getOption("czn") != "1") {
            this._mv2.x = 400;
            this._mv2.y = 47;
        }
        else {
            this._mv2.x = 327;
            this._mv2.y = 46;
        }
        this._mv2.play("2");
        this.bottomNode.addChild(this._mv2);
        this._mv3 = meru.getTypePool("UIEffect", meru.Movie).pop("UIEffect");
        this._mv3.x = 130;
        this._mv3.y = 120;
        this._mv3.play("3");
        this.middleNode.addChild(this._mv3);
        this._mv4 = meru.getTypePool("UIEffect", meru.Movie).pop("UIEffect");
        this._mv4.x = 130;
        this._mv4.y = 466;
        this._mv4.play("4");
        this.middleNode.addChild(this._mv4);
        this._mv5 = meru.getTypePool("UIEffect", meru.Movie).pop("UIEffect");
        this._mv5.x = 130;
        this._mv5.y = 811;
        this._mv5.play("5");
        this.middleNode.addChild(this._mv5);
        _super.prototype.onEnter.call(this);
    };
    p.onExit = function () {
        if (this._mv1) {
            meru.display.removeFromParent(this._mv1);
            meru.getTypePool("UIEffect", meru.Movie).push(this._mv1);
        }
        meru.display.removeFromParent(this._mv2);
        meru.display.removeFromParent(this._mv3);
        meru.display.removeFromParent(this._mv4);
        meru.display.removeFromParent(this._mv5);
        meru.getTypePool("UIEffect", meru.Movie).push(this._mv2);
        meru.getTypePool("UIEffect", meru.Movie).push(this._mv3);
        meru.getTypePool("UIEffect", meru.Movie).push(this._mv4);
        meru.getTypePool("UIEffect", meru.Movie).push(this._mv5);
        // console.log("移除侦听");
        // meru.stage.removeEventListener(egret.StageOrientationEvent.ORIENTATION_CHANGE, this.resize, this);
        _super.prototype.onExit.call(this);
    };
    return HomeLayer;
}(meru.BaseComponent));
egret.registerClass(HomeLayer,'HomeLayer');

/**
 * Created by yang on 16/12/15.
 */
var HomeMutation = (function (_super) {
    __extends(HomeMutation, _super);
    function HomeMutation() {
        _super.apply(this, arguments);
        this._lastRID = -1;
    }
    var d = __define,c=HomeMutation,p=c.prototype;
    p.init = function () {
        this.on("CREATE", this.createRoom);
        this.on("ENTER", this.enterRoom);
        this.on("RECHARGE", this.recharge);
        this.on("SHARE", this.share);
        this.on("ACTIVITY", this.activity);
        this.on("QUESTION", this.question);
        this.on("RULE", this.rule);
        this.on("SETTING", this.setting);
        this.on("REVIEW", this.review);
        // this.on("IDENTIFY", this.identify);
    };
    p.createRoom = function () {
        meru.getData(CreateData).test = true;
        var obj = meru.singleton(RoomOption).getDefault();
        obj["gc"] = PUser.getCache("i.gc") + "";
        meru.UI.addBox(new CreateView()).setData(obj);
    };
    p.enterRoom = function () {
        meru.getData(EnterData).test = true;
        meru.UI.addBox("EnterRoomSkin");
    };
    //分享好友
    p.share = function () {
        if (GameUtils.isIOSApp()) {
            meru.singleton(ShareListener).roomShare("share");
            return;
        }
        if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
            OpenSdk.startShare();
        }
        else {
            meru.UI.addCommon(new InviteView());
        }
    };
    //推荐活动
    p.activity = function () {
        meru.UI.addBox(new ActivityView());
    };
    //问题反馈
    p.question = function () {
        var data = {};
        var name = GameUtils.getWXName();
        var num = GameUtils.getWXNumber();
        data["tip1"] = "购买房卡：" + name + "【微信公众号】";
        data["tip2"] = "客服专线：" + name + "【微信公众号】";
        data["tip3"] = "推广员招募：" + num + " 【微信】";
        meru.UI.addBox("PromptSkin").setData(data);
    };
    //规则
    p.rule = function () {
        meru.UI.addBox(new HelpView());
    };
    //设置
    p.setting = function () {
        meru.UI.addBox(new SettingView());
    };
    //查看战绩
    p.review = function () {
        meru.request(PRoom.historyList(true)).then(function () {
            meru.UI.addBox(new HistoryView());
        });
    };
    // //实名认证
    // private identify():void {
    //     meru.UI.addBox("IdentifySkin");
    // }
    p.recharge = function () {
        console.log("充值");
        if (meru.getPlatform().name == "bearjoy") {
            meru.getData(RechargeGuideData).reset();
            meru.UI.addBox(new BuyCardGuide());
            return;
        }
        if (PUser.getCache("i.subscribe") == 1) {
            meru.postNotification("RECHARGE.RECHARGE");
        }
        else {
            meru.getData(RechargeGuideData).reset();
            meru.UI.addBox(new BuyCardGuide());
            Stat.buy2();
        }
    };
    return HomeMutation;
}(meru.BaseMutation));
egret.registerClass(HomeMutation,'HomeMutation');
meru.injectionMutation("HOME", HomeMutation);

/**
 * Created by yang on 17/1/4.
 */
var IdentifyMutation = (function (_super) {
    __extends(IdentifyMutation, _super);
    function IdentifyMutation() {
        _super.apply(this, arguments);
    }
    var d = __define,c=IdentifyMutation,p=c.prototype;
    p.init = function () {
        this.on("SURE", this.sure);
    };
    p.sure = function (data, box) {
    };
    return IdentifyMutation;
}(meru.BaseMutation));
egret.registerClass(IdentifyMutation,'IdentifyMutation');
// meru.injectionMutation("IDENTIFY",IdentifyMutation); 

/**
 * Created by bruce on 1/28/17.
 */
var FaceButton = (function (_super) {
    __extends(FaceButton, _super);
    function FaceButton() {
        _super.apply(this, arguments);
        this.icon = '';
    }
    var d = __define,c=FaceButton,p=c.prototype;
    return FaceButton;
}(meru.Button));
egret.registerClass(FaceButton,'FaceButton');

var InfoItemInfo = (function (_super) {
    __extends(InfoItemInfo, _super);
    function InfoItemInfo(obj) {
        _super.call(this);
        this._p = obj;
        this._watch = eui.Watcher.watch(this._p, ['ads'], this.updateAds, this);
    }
    var d = __define,c=InfoItemInfo,p=c.prototype;
    p.destory = function () {
        if (this._watch) {
            this._watch.unwatch();
        }
    };
    p.updateAds = function () {
        meru.propertyChange(this, 'ads');
    };
    d(p, "ads"
        ,function () {
            if (this.isUnknow(this._p)) {
                return '该用户拒绝显示详细地理位置\n（请谨慎选择牌友以防止作弊）';
            }
            return '位置:' + this._p.ads;
        }
    );
    d(p, "p"
        ,function () {
            return this._p;
        }
    );
    p.showType = function () {
        //1 详细信息
        //2 模糊信息
        //3 不显示
    };
    p.isUnknow = function (obj) {
        if (obj.jd == -1 && obj.wd == -1) {
            return true;
        }
        else if (obj.jd == 0 && obj.wd == 0) {
            return true;
        }
        return false;
    };
    d(p, "distance"
        ,function () {
            if (this.p && InfoData.lastUserData) {
                if (this.isUnknow(this.p) || this.isUnknow(InfoData.lastUserData)) {
                    return '距离 无法确定';
                }
                var a = new qq.maps.LatLng(this.p.wd, this.p.jd);
                var b = new qq.maps.LatLng(InfoData.lastUserData.wd, InfoData.lastUserData.jd);
                var dist = qq.maps.geometry.spherical.computeDistanceBetween(a, b);
                if (dist < 1000) {
                    return '距离' + (parseInt(dist)) + '米';
                }
                return '距离' + (dist / 1000).toFixed(2) + '公里';
            }
            return '距离 无法确定';
        }
    );
    d(p, "nm"
        ,function () {
            return GameUtils.formatName(this.p.nm, this.p);
        }
    );
    d(p, "isFlag"
        ,function () {
            if (this.p && InfoData.lastUserData) {
                var a = new qq.maps.LatLng(this.p.wd, this.p.jd);
                var b = new qq.maps.LatLng(InfoData.lastUserData.wd, InfoData.lastUserData.jd);
                var dist = qq.maps.geometry.spherical.computeDistanceBetween(a, b);
                if (dist <= 20) {
                    return true;
                }
            }
            return false;
        }
    );
    p.toRad = function (d) {
        return d * Math.PI / 180;
    };
    return InfoItemInfo;
}(egret.EventDispatcher));
egret.registerClass(InfoItemInfo,'InfoItemInfo');
var InfoData = (function (_super) {
    __extends(InfoData, _super);
    function InfoData() {
        _super.call(this);
    }
    var d = __define,c=InfoData,p=c.prototype;
    InfoData.canRefresh = function () {
        var rus = PRoom.getCache('rus');
        for (var key in rus) {
            var item = rus[key];
            if (is.truthy(item.jd) && is.truthy(item.wd) && is.falsy(item.ads)) {
                return true;
            }
        }
        return false;
    };
    InfoData.getFaceType = function (id) {
        for (var key in this.faceType) {
            if (this.faceType[key] == id) {
                return key;
            }
        }
        return null;
    };
    InfoData.faceType = {
        flower: 2,
        boom: 1
    };
    return InfoData;
}(meru.BaseData));
egret.registerClass(InfoData,'InfoData');
meru.injectionData('INFO', InfoData);

var MovieClip = egret.MovieClip;
/**
 * Created by bruce on 1/28/17.
 */
var InfoMutation = (function (_super) {
    __extends(InfoMutation, _super);
    function InfoMutation() {
        _super.apply(this, arguments);
    }
    var d = __define,c=InfoMutation,p=c.prototype;
    p.init = function () {
        this.on('DYNAMIC_FACE', this.dynamicFace);
        this.on('OPEN', this.open);
        this.on('FACE_ANIM', this.faceAnim);
    };
    p.faceAnim = function (obj) {
        var _this = this;
        var uid = obj.uId;
        var toId = obj.toId.split(',');
        var fromView = this.getViewByUID(uid);
        var scene = meru.UI.getScene();
        var pt = new egret.Point();
        for (var i = 0; i < toId.length; i++) {
            var id = toId[i];
            var toView = this.getViewByUID(id);
            if (fromView && toView) {
                var sprite = new eui.Image('info_face_' + InfoData.getFaceType(obj.ct) + '_png');
                sprite.anchorOffsetX = sprite.width / 2;
                sprite.anchorOffsetY = sprite.height / 2;
                pt = meru.display.localTolocal(fromView.width / 2, fromView.height / 2, fromView, scene, pt);
                sprite.x = pt.x;
                sprite.y = pt.y;
                scene.addChild(sprite);
                pt = meru.display.localTolocal(toView.width / 2, toView.height / 2, toView, scene, pt);
                var toX = pt.x;
                var toY = pt.y;
                egret.Tween.get(sprite).to({ x: pt.x, y: pt.y }, 1000).call(function () {
                    meru.display.removeFromParent(sprite);
                    var mv = new meru.Movie('hudong');
                    mv.play(obj.ct);
                    scene.addChild(mv);
                    mv.once(meru.MovieEvent.COMPLETE, function () {
                        meru.display.removeFromParent(mv);
                    }, _this);
                    mv.x = toX;
                    mv.y = toY;
                });
            }
        }
    };
    p.getViewByUID = function (uid) {
        var scene = meru.UI.getScene();
        for (var i = 0; i < 4; i++) {
            var uv = scene['user' + i];
            if (uv && uv._data && uv._data.uId == uid) {
                return uv['infoBtn'];
            }
        }
        return null;
    };
    p.open = function (data) {
        var _this = this;
        InfoData.lastUserData = data;
        var _open = function () {
            var box = meru.UI.addBox('UserInfoSkin');
            box.addOperate(new andes.operates.EnterOperate(function () {
                var loader = new HeadLoader();
                if (data['pic'] == 1) {
                    if (data['ldo'] == 1) {
                        loader.init(box['head'], 'head_1_png', 99);
                    }
                    else {
                        loader.init(box['head'], 'head_2_png', 99);
                    }
                }
                else {
                    loader.init(box['head'], data['pic'], 99);
                }
            }, _this));
            var obj = {
                info: new InfoItemInfo(data),
                rus: _this.getRusCollection(data.uId)
            };
            box.setData(obj);
            box.addOperate(new andes.operates.ExitOperate(function () {
                obj.info.destory();
                for (var i = 0; i < obj.rus.length; i++) {
                    obj.rus.source[i].destory();
                }
            }, _this));
            box.setCompName('INFO_BOX');
        };
        if (InfoData.canRefresh()) {
            meru.request(PRoom.refreshAddress()).then(function () {
                _open();
            });
        }
        else {
            _open();
        }
    };
    p.getRusCollection = function (filterId) {
        var rusArr = PRoom.getCache('rus');
        var arr = [];
        for (var key in rusArr) {
            if (rusArr[key].uId != filterId) {
                arr.push(new InfoItemInfo(rusArr[key]));
            }
        }
        return new eui.ArrayCollection(arr);
    };
    p.dynamicFace = function (data, host, btn, type) {
        var v = InfoData.faceType[type];
        var playerId = PUser.getCache('i.id');
        if (host.data.info.p.uId == playerId) {
            //给其他三个玩家发
            console.log('给其他人发');
            var rusObj = PRoom.getCache('').rus;
            var ids = [];
            for (var key in rusObj) {
                var obj = rusObj[key];
                if (obj.uId != playerId) {
                    ids.push(obj.uId);
                }
            }
            if (ids.length == 0) {
                meru.tooltip('无玩家加入，无法发送动态表情');
                return;
            }
            meru.request(PChat.roomSay(5, v, 0, ids.join(',')));
        }
        else {
            //给指定玩家发
            meru.request(PChat.roomSay(5, v, 0, data.info.p.uId));
        }
        meru.UI.removeByName('INFO_BOX');
    };
    return InfoMutation;
}(meru.BaseMutation));
egret.registerClass(InfoMutation,'InfoMutation');
meru.injectionMutation('INFO', InfoMutation);

/**
 * Created by yang on 17/1/12.
 */
var LoadingView = (function (_super) {
    __extends(LoadingView, _super);
    function LoadingView() {
        _super.call(this);
        var exml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<e:Skin class=\"LoadingSkin\" width=\"720\" height=\"1280\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\">\n\t<w:Config id=\"15990e6fe2e\"/>\n\t<e:Image source=\"bg_loading_jpg\" y=\"0\" id=\"bg1\"/>\n\t<e:Image source=\"icon_wenzi_jiazaizhong_png\" y=\"1007\" id=\"bg2\"/>\n\t<e:Group y=\"1068\" id=\"bg3\">\n\t\t<e:ProgressBar id=\"bar\" x=\"0\" y=\"0\" scaleX=\"1\" scaleY=\"1\">\n\t\t\t<e:Skin>\n\t\t\t\t<e:Image source=\"bg_loading_progress_bg_png\" top=\"0\" left=\"0\" right=\"0\"/>\n\t\t\t\t<e:Image source=\"icon_loading_progress_png\" id=\"thumb\" y=\"4\" left=\"5\" right=\"5\"/>\n\t\t\t</e:Skin>\n\t\t</e:ProgressBar>\n\t\t<e:Group id=\"container\" x=\"0\" y=\"20\" />\n\t</e:Group>\n</e:Skin>";
        this.skinName = exml;
    }
    var d = __define,c=LoadingView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this._mv = new meru.Movie("loading", "loading");
        this._mv.y = -10;
        this.container.addChild(this._mv);
        this._mv.play("1");
        this["bg1"].x = (meru.stage.stageWidth - 1280) / 2;
        this["bg2"].x = (meru.stage.stageWidth - 259) / 2;
        this["bg3"].x = (meru.stage.stageWidth - 594) / 2;
        this.setProgress(0, 100);
    };
    p.setProgress = function (cur, total) {
        this.bar.maximum = total;
        this.bar.value = cur;
        this._mv.x = 594 * (cur / total);
    };
    return LoadingView;
}(meru.BaseComponent));
egret.registerClass(LoadingView,'LoadingView');

/**
 * Created by yang on 17/4/12.
 */
var MailData = (function (_super) {
    __extends(MailData, _super);
    function MailData() {
        _super.apply(this, arguments);
    }
    var d = __define,c=MailData,p=c.prototype;
    p.init = function () {
        var _this = this;
        this.slot('PanelMailSkin', function () { return _this; });
    };
    d(p, "list"
        ,function () {
            if (!this._source) {
                this._source = new eui.ArrayCollection();
            }
            this._source.source = meru.getCache(PMail.getList())["l"];
            this._source.refresh();
            return this._source;
        }
    );
    p.dataChange = function () {
        eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "canAwd");
        eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "canNotAwd");
        eui.CollectionEvent.dispatchCollectionEvent(this._source, eui.CollectionEvent.COLLECTION_CHANGE, eui.CollectionEventKind.RESET);
    };
    d(p, "canAwd"
        ,function () {
            var l = meru.getCache(PMail.getList())["l"];
            for (var i = 0; i < l.length; i++) {
                if (l[i]["fk"] > 0 && l[i]["isAw"] == 0) {
                    return true;
                }
            }
            return false;
        }
    );
    d(p, "canNotAwd"
        ,function () {
            var l = meru.getCache(PMail.getList())["l"];
            for (var i = 0; i < l.length; i++) {
                if (l[i]["fk"] > 0 && l[i]["isAw"] == 0) {
                    return false;
                }
            }
            return true;
        }
    );
    return MailData;
}(meru.BaseData));
egret.registerClass(MailData,'MailData');
meru.injectionData("MAIL", MailData);

/**
 * Created by yang on 17/4/12.
 */
var MailItem = (function (_super) {
    __extends(MailItem, _super);
    function MailItem() {
        _super.apply(this, arguments);
    }
    var d = __define,c=MailItem,p=c.prototype;
    p.dataChanged = function () {
        if (!this.data) {
            return;
        }
        this["full"].visible = !this.data["isAw"];
        this["empty"].visible = this.data["isAw"];
        this["st"].text = this.data["isAw"] ? "已领取" : "可领取";
        this["title"].text = this.data["title"];
    };
    return MailItem;
}(meru.ItemRenderer));
egret.registerClass(MailItem,'MailItem');

/**
 * Created by yang on 17/4/12.
 */
var MailMutation = (function (_super) {
    __extends(MailMutation, _super);
    function MailMutation() {
        _super.apply(this, arguments);
    }
    var d = __define,c=MailMutation,p=c.prototype;
    p.init = function () {
        this.on("READ", this.read);
        this.on("OPEN", this.open);
        this.on("AWARDALL", this.awardAll);
        this.on("AWARD", this.award);
    };
    p.open = function () {
        meru.request(PMail.getList(true, true, false, { "time": 30 })).then(function () {
            meru.UI.addBox("PanelMailSkin");
        });
    };
    p.read = function (data) {
        var d = {};
        d["canAwd"] = data["isAw"] == 0;
        d["canNotAwd"] = data["isAw"] == 1;
        d["content"] = data["content"];
        d["fk"] = data["fk"];
        d["mId"] = data["mId"];
        d["hasAwd"] = data["fk"] > 0;
        meru.UI.addBox("PanelMailDetailSkin").setData(d);
    };
    p.awardAll = function () {
        meru.request(PMail.awardAll()).then(function () {
            meru.tooltip("领取成功");
            meru.getData(MailData).dataChange();
        });
    };
    p.award = function (data, ui) {
        meru.request(PMail.award(data.mId)).then(function () {
            meru.tooltip('领取成功');
            ui["take"].visible = false;
            ui["queding"].visible = true;
            meru.getData(MailData).dataChange();
        });
    };
    return MailMutation;
}(meru.BaseMutation));
egret.registerClass(MailMutation,'MailMutation');
meru.injectionMutation("MAIL", MailMutation);

/**
 * Created by yang on 17/1/7.
 */
var GameOverItem = (function (_super) {
    __extends(GameOverItem, _super);
    function GameOverItem() {
        _super.apply(this, arguments);
    }
    var d = __define,c=GameOverItem,p=c.prototype;
    p.dataChanged = function () {
        if (!this.data) {
            return;
        }
        var pic = this.data["pic"];
        var loader = new HeadLoader();
        if (pic == 1) {
            loader.init(this.head, "head_2_png", 4);
        }
        else {
            loader.init(this.head, pic, 5);
        }
        this.nameLabel.text = GameUtils.formatName(this.data["nm"], this.data);
        this.maxScore.text = "" + this.data["msc"]; //单局最高分
        this.winLose.text = this.data["wn"] + "胜" + this.data["fn"] + "负";
        this.totalScore.text = this.data["tsc"] + "分";
        this.me.visible = (this.data["uId"] == PUser.getCache("i.id"));
        this.normal.visible = (this.data["uId"] != PUser.getCache("i.id"));
        if (this.data["tsc"] > 0) {
            this.icon.source = "icon_result_round_1_png";
        }
        else if (this.data["tsc"] < 0) {
            this.icon.source = "icon_result_round_2_png";
        }
        else {
            this.icon.source = "icon_result_round_3_png";
        }
        this.owner.visible = (this.data["uId"] == PRoom.getCache("base.owner"));
    };
    return GameOverItem;
}(meru.ItemRenderer));
egret.registerClass(GameOverItem,'GameOverItem');

/**
 * Created by yang on 17/1/24.
 */
var GameOverShare = (function (_super) {
    __extends(GameOverShare, _super);
    function GameOverShare(data) {
        _super.call(this);
        this._data = data;
        this.skinName = "GameOverShareSkin";
    }
    var d = __define,c=GameOverShare,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        var rus = this._data.rus;
        var list = [];
        for (var key in rus) {
            list.push(rus[key]);
        }
        //围观的人
        this.list.dataProvider = new eui.ArrayCollection(list);
        var resultId = egret.getOption("resultId");
        resultId = resultId.split("_")[1];
        this.roomId.text = "房间号:" + resultId;
        this.time.text = GameUtils.formatTime1();
        this.listener(this.closeBtn, this.close);
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        this.clearListeners();
    };
    p.close = function () {
        meru.UI.remove(this);
    };
    return GameOverShare;
}(meru.BaseComponent));
egret.registerClass(GameOverShare,'GameOverShare');

/**
 * Created by yang on 17/1/24.
 */
var GameOverShareTipSkin = (function (_super) {
    __extends(GameOverShareTipSkin, _super);
    function GameOverShareTipSkin() {
        _super.call(this);
        this.skinName = "GameOverSharePromptSkin";
        Stat.share();
        if (GameUtils.isIOSApp()) {
            var code = PUser.getCache("i.id") + "_" + PRoom.getCache("base.code");
            meru.singleton(ShareListener).resultShare("share", code);
        }
    }
    var d = __define,c=GameOverShareTipSkin,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.bg.touchEnabled = true;
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
        this.initInfo();
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        this.bg.touchEnabled = false;
        this.bg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
    };
    p.initInfo = function () {
        var name = GameUtils.getWXName();
        var num = GameUtils.getWXNumber();
        this.pl1.text = name;
        this.pl2.text = name;
        this.pl3.text = name;
        this.gzh.text = num;
    };
    p.onClose = function () {
        meru.UI.remove(this);
    };
    return GameOverShareTipSkin;
}(meru.BaseComponent));
egret.registerClass(GameOverShareTipSkin,'GameOverShareTipSkin');

/**
 * Created by yang on 17/1/7.
 */
var GameOverView = (function (_super) {
    __extends(GameOverView, _super);
    function GameOverView() {
        _super.call(this);
        this.skinName = "GameOverSkin2";
    }
    var d = __define,c=GameOverView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        var rus = PRoom.getCache("rus");
        var list = [];
        for (var key in rus) {
            list.push(rus[key]);
        }
        //围观的人
        this.list.dataProvider = new eui.ArrayCollection(list);
        this.roomId.text = "房间号:" + PRoom.getCache("base.code");
        this.time.text = GameUtils.formatTime1();
        var code = PUser.getCache("i.id") + "_" + PRoom.getCache("base.code");
        meru.singleton(ShareListener).resultShare("init", code);
        this.listener(this.closeBtn, this.close);
        this.listener(this.shareBtn, this.share);
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        this.clearListeners();
    };
    p.share = function () {
        meru.UI.addBox(new GameOverShareTipSkin());
    };
    p.close = function () {
        meru.UI.remove(this);
        meru.postNotification("BACK_HOME_BTN");
    };
    return GameOverView;
}(meru.BaseComponent));
egret.registerClass(GameOverView,'GameOverView');

/**
 * Created by yang on 16/12/21.
 */
var RoundMutation = (function (_super) {
    __extends(RoundMutation, _super);
    function RoundMutation() {
        _super.apply(this, arguments);
    }
    var d = __define,c=RoundMutation,p=c.prototype;
    p.init = function () {
        this.on("CONFIRM", this.confirm);
        this.on("CHECK", this.check);
    };
    p.confirm = function (data, box) {
        var base = PRoom.getCache("base");
        if (base["mrd"] <= base["rd"]) {
            meru.request(PRoom.getInfo(true)).then(function () {
                meru.UI.remove(box);
            });
        }
        else {
            meru.request(PRoom.cmReady()).then(function () {
                meru.UI.remove(box);
            });
        }
    };
    p.check = function (data, box) {
        meru.UI.remove(box);
    };
    RoundMutation.showed = false;
    return RoundMutation;
}(meru.BaseMutation));
egret.registerClass(RoundMutation,'RoundMutation');
meru.injectionMutation("ROUND", RoundMutation);

/**
 * Created by yang on 17/1/7.
 */
var RoundOverItem = (function (_super) {
    __extends(RoundOverItem, _super);
    function RoundOverItem() {
        _super.apply(this, arguments);
        this._loader = new HeadLoader();
    }
    var d = __define,c=RoundOverItem,p=c.prototype;
    p.dataChanged = function () {
        if (!this.data) {
            return;
        }
        this.nameLabel.text = GameUtils.formatName(this.data["nm"], this.data);
        if (this.data["lsc"] > 0) {
            this.score.text = "+" + this.data["lsc"] + "";
        }
        else {
            this.score.text = this.data["lsc"] + "";
        }
        if (this.data["pic"] == 1) {
            if (this.data["ldo"] == 1) {
                this._loader.init(this.head, "head_1_png", 4);
            }
            else {
                this._loader.init(this.head, "head_2_png", 4);
            }
        }
        else {
            this._loader.init(this.head, this.data["pic"], 4);
        }
        var list = [];
        var d = this.data.lwd.daos;
        var spl = this.data.lwd.spls;
        var l = ["头墩", "中墩", "尾墩"];
        for (var i = 0; i < d.length; i++) {
            if (d[i] >= 0) {
                list.push(l[i] + "+" + d[i]);
            }
            else {
                list.push(l[i] + d[i]);
            }
        }
        for (var key in spl) {
            list.push(getRuleName(key) + "+" + spl[key]);
        }
        var rus;
        if (this.data.history) {
            rus = this.data.history;
        }
        else {
            rus = PRoom.getCache("rus");
        }
        var num = Object.keys(rus).length - 1;
        var total = 0;
        for (var key in rus) {
            if (rus[key]["uId"] != this.data.uId) {
                var spl1 = rus[key].lwd.spls;
                for (var k in spl1) {
                    total += spl1[k] / num;
                }
            }
        }
        if (total > 0) {
            list.push("喜牌-" + total);
        }
        var dp = this.list.dataProvider;
        if (!dp) {
            dp = new eui.ArrayCollection();
        }
        dp.source = list;
        dp.refresh();
    };
    return RoundOverItem;
}(meru.ItemRenderer));
egret.registerClass(RoundOverItem,'RoundOverItem');
var ScoreDetailItem = (function (_super) {
    __extends(ScoreDetailItem, _super);
    function ScoreDetailItem() {
        _super.apply(this, arguments);
    }
    var d = __define,c=ScoreDetailItem,p=c.prototype;
    p.dataChanged = function () {
        if (!this.data) {
            return;
        }
        this.txt.text = this.data;
    };
    return ScoreDetailItem;
}(meru.ItemRenderer));
egret.registerClass(ScoreDetailItem,'ScoreDetailItem');

/**
 * Created by yang on 17/1/7.
 */
var RoundOverView = (function (_super) {
    __extends(RoundOverView, _super);
    function RoundOverView(d) {
        if (d === void 0) { d = null; }
        _super.call(this);
        this._d = d;
        this.skinName = "GameOverSkin1";
    }
    var d = __define,c=RoundOverView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        var rus;
        if (this._d) {
            rus = this._d;
        }
        else {
            rus = PRoom.getCache("rus");
        }
        var list = [];
        for (var key in rus) {
            var obj = rus[key];
            if (this._d) {
                obj["history"] = this._d;
            }
            list.push(obj);
        }
        this.list.dataProvider = new eui.ArrayCollection(list);
        this.listener(this.viewBtn, this.view);
        this.listener(this.goonBtn, this.goon);
        var data = rus[GameUtils.getMyPos()];
        var src1 = "";
        if (data["lsc"] > 0) {
            src1 = "icon_result_1_png";
        }
        else {
            src1 = "icon_result_2_png";
        }
        this.bg1.source = src1;
        meru.postNotification(GameEvents.CONTINUE_STATUS, true);
    };
    p.onExit = function () {
        RoundOverView.register = false;
        _super.prototype.onExit.call(this);
        this.clearListeners();
        meru.postNotification(GameEvents.CONTINUE_STATUS, false);
    };
    p.view = function () {
        RoundMutation.showed = true;
        meru.UI.remove(this);
    };
    p.goon = function () {
        if (this._d) {
            meru.UI.remove(this);
            return;
        }
        var that = this;
        meru.request(PRoom.cmReady()).then(function () {
            meru.UI.remove(that);
        });
    };
    RoundOverView.register = false;
    return RoundOverView;
}(meru.BaseComponent));
egret.registerClass(RoundOverView,'RoundOverView');

/**
 * Created by yang on 16/12/21.
 */
var QuitData = (function (_super) {
    __extends(QuitData, _super);
    function QuitData() {
        _super.apply(this, arguments);
        this._isRound = false;
    }
    var d = __define,c=QuitData,p=c.prototype;
    p.init = function () {
        var _this = this;
        this.slot("EndRoomSkin", function () { return _this; });
    };
    p.setRound = function (v) {
        this._isRound = v;
        meru.UI.addBox(new QuitView()).setCompName("EndRoomSkin");
    };
    d(p, "roundOver"
        ,function () {
            return this._isRound;
        }
    );
    d(p, "isQuit"
        ,function () {
            return !this._isRound;
        }
    );
    d(p, "notChoose"
        ,function () {
            var p = this.p;
            for (var i = 1; i <= 4; i++) {
                if (p[i] && p[i]["uId"] == PUser.getCache("i.id")) {
                    return p[i]["qt"] == 0;
                }
            }
            return false;
        }
    );
    p.quitDataChange = function () {
        meru.postNotification("QuitDataChange");
        eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "notChoose");
    };
    d(p, "p"
        ,function () {
            return PRoom.getCache("rus") || {};
        }
    );
    return QuitData;
}(meru.BaseData));
egret.registerClass(QuitData,'QuitData');
meru.injectionData("QUIT", QuitData);

/**
 * Created by yang on 16/12/21.
 */
var QuitMutation = (function (_super) {
    __extends(QuitMutation, _super);
    function QuitMutation() {
        _super.apply(this, arguments);
    }
    var d = __define,c=QuitMutation,p=c.prototype;
    p.init = function () {
        this.on("ACCEPT", this.accept);
        this.on("REFUSE", this.refuse);
        this.on("OVER", this.over);
    };
    p.accept = function () {
        meru.request(PRoom.quit(1)).then(function () {
        });
    };
    p.refuse = function () {
        meru.request(PRoom.quit(-1)).then(function () {
        });
    };
    p.over = function () {
        meru.request(PRoom.getInfo(true)).then(function () {
            meru.UI.clearBox();
            meru.UI.runScene(new HomeLayer());
        });
    };
    return QuitMutation;
}(meru.BaseMutation));
egret.registerClass(QuitMutation,'QuitMutation');
meru.injectionMutation("QUIT", QuitMutation);

/**
 * Created by yang on 17/1/22.
 */
var QuitView = (function (_super) {
    __extends(QuitView, _super);
    function QuitView() {
        _super.call(this);
        this._timeId = -1;
        this.skinName = "EndRoomSkin";
    }
    var d = __define,c=QuitView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this._timeRecorder = new meru.TimeRecorder();
        var info = PRoom.getCache("base");
        if (!info) {
            return;
        }
        info["qtt"] += 1;
        this._timeId = meru.setInterval(this.onTick, this, 1000);
        this.onTick();
        meru.addNotification("QuitDataChange", this.refreshList, this);
        this.refreshList();
    };
    p.onTick = function () {
        var second = this._timeRecorder.tick();
        var info = PRoom.getCache("base");
        if (!info) {
            meru.clearInterval(this._timeId);
            this._timeRecorder = null;
            return;
        }
        info["qtt"] -= second;
        if (info["qtt"] < 0) {
            info["qtt"] = 0;
        }
        this.timeLabel.text = GameUtils.formatTime3(info["qtt"]);
    };
    p.refreshList = function () {
        var rus = PRoom.getCache("rus") || {};
        var list = [];
        for (var key in rus) {
            var obj = {};
            obj["isMe"] = (PUser.getCache("i.id") == rus[key]["uId"]);
            obj["quit"] = (rus[key]["qt"] == 1);
            obj["refuse"] = (rus[key]["qt"] == -1);
            obj["name"] = rus[key]["nm"];
            obj["score"] = rus[key]["tsc"];
            list.push(obj);
        }
        var dp = this.list.dataProvider;
        if (!dp) {
            dp = new eui.ArrayCollection();
        }
        dp.source = list;
        dp.refresh();
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        meru.clearInterval(this._timeId);
        this._timeRecorder = null;
    };
    return QuitView;
}(meru.BaseComponent));
egret.registerClass(QuitView,'QuitView');

/**
 * Created by yang on 17/1/18.
 */
var RankData = (function (_super) {
    __extends(RankData, _super);
    function RankData() {
        _super.apply(this, arguments);
    }
    var d = __define,c=RankData,p=c.prototype;
    d(p, "rank"
        ,function () {
            var list = meru.getCache(PFriend.getList())["l"];
            list.sort(function (a, b) {
                if (b.ww != a.ww) {
                    return b.ww - a.ww;
                }
                else {
                    return b.whlw - a.whlw;
                }
            });
            return list;
            //whlw周最高连胜
            //wlw当前连胜
            //ww本周胜场
            //tw累积胜场
        }
    );
    return RankData;
}(meru.BaseData));
egret.registerClass(RankData,'RankData');
meru.injectionData("RANK", RankData);

/**
 * Created by yang on 17/1/18.
 */
var RankItem = (function (_super) {
    __extends(RankItem, _super);
    function RankItem() {
        _super.call(this);
        this._loader = new HeadLoader();
        this.skinName = "ItemRankListSkin";
    }
    var d = __define,c=RankItem,p=c.prototype;
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (!this.data) {
            return;
        }
        this.nameLabel.text = GameUtils.formatName(this.data["uName"], this.data);
        this.lastWeekLabel.text = "本周胜局:" + this.data["ww"];
        this.maxLabel.text = this.data['whlw'] + "连胜";
        if (this.itemIndex < 3) {
            this.rank.source = "bg_rank_" + (this.itemIndex + 1) + "_png";
        }
        else {
            this.rank.source = "bg_rank_4_png";
        }
        if (this.data["pic"] == 1) {
            this._loader.init(this.head, "head_1_png", 4);
        }
        else {
            this._loader.init(this.head, this.data["pic"], 4);
        }
        this.rankLabel.text = this.itemIndex + 1;
    };
    return RankItem;
}(meru.BaseComponent));
egret.registerClass(RankItem,'RankItem',["eui.IItemRenderer","eui.UIComponent"]);

/**
 * Created by yang on 17/1/18.
 */
var RankMutation = (function (_super) {
    __extends(RankMutation, _super);
    function RankMutation() {
        _super.apply(this, arguments);
    }
    var d = __define,c=RankMutation,p=c.prototype;
    p.init = function () {
        this.on("HELP", this.help);
    };
    p.help = function () {
        meru.UI.addBox(new InviteView());
    };
    return RankMutation;
}(meru.BaseMutation));
egret.registerClass(RankMutation,'RankMutation');
meru.injectionMutation("RANK", RankMutation);

/**
 * Created by yang on 17/1/18.
 */
var RankView = (function (_super) {
    __extends(RankView, _super);
    function RankView() {
        _super.call(this);
        this.skinName = "RankListSkin";
    }
    var d = __define,c=RankView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        if (RankView.needRefresh) {
            this.refreshData();
        }
        RankView.needRefresh = false;
        this.refreshList();
    };
    p.refreshList = function () {
        var uId = PUser.getCache("i.id");
        var dp = meru.getData(RankData).rank;
        var dp1 = this.list.dataProvider;
        if (!dp1) {
            dp1 = new eui.ArrayCollection();
        }
        dp1.source = dp;
        dp1.refresh();
        this.list.visible = dp.length > 0;
        var idx = 0;
        for (var i = 0; i < dp.length; i++) {
            if (uId == dp[i]["uId"]) {
                idx = i + 1;
                break;
            }
        }
        this.myRank.text = "我的排名:" + idx;
    };
    p.refreshData = function () {
        var that = this;
        meru.request(PUser.backHome()).then(function () {
            that.refreshList();
        });
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        RankView.needRefresh = true;
    };
    RankView.needRefresh = true;
    return RankView;
}(meru.BaseComponent));
egret.registerClass(RankView,'RankView');

/**
 * Created by yang on 17/1/12.
 */
var PaymentRefreshProxy = (function () {
    function PaymentRefreshProxy(time) {
        this._times = [2, 5, 10, 20, 40, 60];
        this._isDispose = false;
        this._time = time;
    }
    var d = __define,c=PaymentRefreshProxy,p=c.prototype;
    p.start = function () {
        if (this._times.length > 0 && !this._isDispose) {
            this._timeId = meru.setTimeout(this.startProxy, this, this._times.shift() * 1000);
        }
    };
    p.startProxy = function () {
        // var proxy:SingleProxy = new SingleProxy({"mod": "User", "do": "refreshInfo", "p": {"time": this._time}, "mask": true});
        // proxy.addEventListener(ProxyEvent.RESPONSE_SUCCEED, this.onResponse, this);
        // proxy.load();
    };
    p.onResponse = function (data) {
        var order = data["order"];
        if (order == 0) {
            this.start();
        }
        else {
            //充值成功
            meru.tooltip("充值到账");
        }
    };
    p.dispose = function () {
        meru.clearTimeout(this._timeId);
        this._isDispose = true;
    };
    PaymentRefreshProxy.start = function (time) {
        if (PaymentRefreshProxy._cur) {
            PaymentRefreshProxy._cur.dispose();
        }
        PaymentRefreshProxy._cur = new PaymentRefreshProxy(time);
        PaymentRefreshProxy._cur.start();
    };
    PaymentRefreshProxy._cur = null;
    return PaymentRefreshProxy;
}());
egret.registerClass(PaymentRefreshProxy,'PaymentRefreshProxy');

/**
 * Created by yang on 17/1/11.
 */
var RechargeGuideData = (function (_super) {
    __extends(RechargeGuideData, _super);
    function RechargeGuideData() {
        _super.apply(this, arguments);
        this._curPage = 1;
        this._maxPage = 4;
    }
    var d = __define,c=RechargeGuideData,p=c.prototype;
    p.init = function () {
        var _this = this;
        this.slot("BuyCardSkin", function () { return _this; });
    };
    p.reset = function () {
        this._curPage = 1;
    };
    p.onLeft = function () {
        this._curPage -= 1;
        if (this._curPage < 1) {
            this._curPage = 1;
        }
        this.dataChange();
    };
    p.onRight = function () {
        this._curPage += 1;
        if (this._curPage > this._maxPage) {
            this._curPage = this._maxPage;
        }
        this.dataChange();
    };
    p.dataChange = function () {
        eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "is1");
        eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "is2");
        eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "is3");
        eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "is4");
        eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "not1");
        eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "not4");
    };
    d(p, "not1"
        ,function () {
            return !this.is1;
        }
    );
    d(p, "not4"
        ,function () {
            return !this.is4;
        }
    );
    d(p, "is1"
        ,function () {
            return this._curPage == 1;
        }
    );
    d(p, "is2"
        ,function () {
            return this._curPage == 2;
        }
    );
    d(p, "is3"
        ,function () {
            return this._curPage == 3;
        }
    );
    d(p, "is4"
        ,function () {
            return this._curPage == 4;
        }
    );
    return RechargeGuideData;
}(meru.BaseData));
egret.registerClass(RechargeGuideData,'RechargeGuideData');
meru.injectionData("RECHARGEGUIDE", RechargeGuideData);

/**
 * Created by yang on 17/1/11.
 */
var RechargeGuideMutation = (function (_super) {
    __extends(RechargeGuideMutation, _super);
    function RechargeGuideMutation() {
        _super.apply(this, arguments);
    }
    var d = __define,c=RechargeGuideMutation,p=c.prototype;
    p.init = function () {
        this.on("LEFT", this.left);
        this.on("RIGHT", this.right);
    };
    p.left = function () {
        meru.getData(RechargeGuideData).onLeft();
    };
    p.right = function () {
        meru.getData(RechargeGuideData).onRight();
    };
    return RechargeGuideMutation;
}(meru.BaseMutation));
egret.registerClass(RechargeGuideMutation,'RechargeGuideMutation');
meru.injectionMutation("RECHARGEGUIDE", RechargeGuideMutation);

/**
 * Created by yang on 17/1/12.
 */
var RechargeMutation = (function (_super) {
    __extends(RechargeMutation, _super);
    function RechargeMutation() {
        _super.apply(this, arguments);
    }
    var d = __define,c=RechargeMutation,p=c.prototype;
    p.init = function () {
        this.on("RECHARGE", this.recharge);
    };
    p.recharge = function () {
        if (egret.getOption("czn") == "1") {
            return;
        }
        if (PUser.getCache("i.isAgent") == 0) {
            if (!PInvite.isCache()) {
                var that = this;
                meru.request(PInvite.getInfo(true)).then(function () {
                    that.recharge();
                });
                return;
            }
            else {
                if (!PInvite.getCache("awded")) {
                    meru.UI.addBox("InviteCodeSkin");
                    return;
                }
            }
        }
        var info = PUser.getCache("i");
        var data = {};
        data["uId"] = info["platId"];
        data["appid"] = 103;
        data["goodsId"] = 1;
        data["goodsNumber"] = 1;
        data["serverId"] = 1;
        data["ext"] = 103;
        // var time:number = Math.floor(new Date().getTime() / 1000);
        // PaymentRefreshProxy.start(time);
        meru.getPlatform().payment(data, function (ret) {
            if (ret.result == 0) {
                meru.tooltip("充值完成，稍后到账");
            }
            else {
                meru.tooltip("充值失败");
            }
        });
    };
    return RechargeMutation;
}(meru.BaseMutation));
egret.registerClass(RechargeMutation,'RechargeMutation');
meru.injectionMutation("RECHARGE", RechargeMutation);

/**
 * Created by yang on 17/1/7.
 */
var HistoryItemView = (function (_super) {
    __extends(HistoryItemView, _super);
    function HistoryItemView() {
        _super.call(this);
        this._open = false;
    }
    var d = __define,c=HistoryItemView,p=c.prototype;
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (!this.data) {
            return;
        }
        this.room.text = "房号: " + this.data['code'];
        this.time.text = "时间:" + GameUtils.formatTime2(this.data.time * 1000);
        var uId = PUser.getCache("i.id");
        var tsc = 0;
        var l = [];
        for (var key in this.data["rus"]) {
            var d = this.data["rus"][key];
            if (uId == d["uId"]) {
                tsc = d["tsc"];
            }
            l.push(d);
        }
        this._l = l;
        this.showList();
        if (tsc > 0) {
            this.icon.source = "icon_result_round_1_png";
        }
        else if (tsc < 0) {
            this.icon.source = "icon_result_round_2_png";
        }
        else {
            this.icon.source = "icon_result_round_3_png";
        }
        this.detailBtn.visible = l.length > 4;
    };
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.listener(this.checkBtn, this.check);
        this.listener(this.detailBtn, this.detail);
        if (this.reviewBtn) {
            this.listener(this.reviewBtn, this.reviewClick);
        }
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        this.clearListeners();
    };
    p.showAll = function () {
        var dp = this.list.dataProvider;
        dp.source = this._l;
        dp.refresh();
        this.detailBtn.scaleY = -1;
    };
    p.showSome = function () {
        var dp = this.list.dataProvider;
        dp.source = this._l.slice(0, 4);
        dp.refresh();
        this.detailBtn.scaleY = 1;
    };
    p.detail = function () {
        if (this.reviewBtn) {
            this._open = !this._open;
            this.showList();
        }
        else {
            if (HistoryView.openMap[this.data['code']]) {
                HistoryView.openMap[this.data['code']] = false;
            }
            else {
                HistoryView.openMap[this.data['code']] = true;
            }
            this.showList();
        }
    };
    p.showList = function () {
        if (this.reviewBtn) {
            if (this._open) {
                this.showAll();
            }
            else {
                this.showSome();
            }
        }
        else {
            if (HistoryView.openMap[this.data['code']]) {
                this.showAll();
            }
            else {
                this.showSome();
            }
        }
    };
    p.check = function () {
        var data = this.data;
        meru.UI.clearBox();
        meru.UI.addBox(new HistoryRoundView(data));
    };
    p.reviewClick = function () {
        var room = this.data["rId"];
        var reviewId = room;
        meru.request(PRoom.getReplay(reviewId)).then(function (data) {
            if (data["est"] == 1) {
                ReviewController.rpId = reviewId;
                ReviewController.setData(data);
            }
            else {
                meru.tooltip("录像丢失");
            }
        });
    };
    return HistoryItemView;
}(meru.BaseComponent));
egret.registerClass(HistoryItemView,'HistoryItemView',["eui.IItemRenderer","eui.UIComponent"]);
var ItemRecordDetail1 = (function (_super) {
    __extends(ItemRecordDetail1, _super);
    function ItemRecordDetail1() {
        _super.apply(this, arguments);
    }
    var d = __define,c=ItemRecordDetail1,p=c.prototype;
    p.dataChanged = function () {
        if (!this.data) {
            return;
        }
        if (this.data.hasOwnProperty("test")) {
            return;
        }
        this["name1"].text = GameUtils.formatName(this.data["uName"], this.data) + ": ";
        if (this.data.uId == PUser.getCache("i.id")) {
            this["name1"].textColor = 0xFFFF00;
        }
        else {
            this["name1"].textColor = 0xFFFFFF;
        }
        this["score1"].text = this.data["tsc"] + "";
    };
    return ItemRecordDetail1;
}(meru.ItemRenderer));
egret.registerClass(ItemRecordDetail1,'ItemRecordDetail1');

/**
 * Created by yang on 17/1/7.
 */
var HistoryRoundItemView = (function (_super) {
    __extends(HistoryRoundItemView, _super);
    function HistoryRoundItemView() {
        _super.call(this);
        this.skinName = "ItemGameRecordSkin2";
    }
    var d = __define,c=HistoryRoundItemView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.listener(this.shareBtn, this.shareClick);
        this.listener(this.detailBtn, this.detailClick);
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        this.clearListeners();
    };
    p.detailClick = function () {
        if (HistoryRoundView.openMap[this.data['idx']]) {
            HistoryRoundView.openMap[this.data['idx']] = false;
        }
        else {
            HistoryRoundView.openMap[this.data['idx']] = true;
        }
        this.showList();
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (!this.data) {
            return;
        }
        this.xiangxiBtn.visible = false;
        this.detailBtn.visible = true;
        var rus = this.data["rus"];
        var l = [];
        for (var key in rus) {
            var obj = {};
            obj["lsc"] = this.data["d"]["pns"][key];
            obj["uName"] = rus[key]["uName"];
            obj["uId"] = rus[key]["uId"];
            l.push(obj);
        }
        this._l = l;
        this.showList();
        this.detailBtn.visible = l.length > 4;
    };
    p.showList = function () {
        if (HistoryRoundView.openMap[this.data['idx']]) {
            this.showAll();
        }
        else {
            this.showSome();
        }
    };
    p.showAll = function () {
        var dp = this.list.dataProvider;
        dp.source = this._l;
        dp.refresh();
        this.detailBtn.scaleY = -1;
    };
    p.showSome = function () {
        var dp = this.list.dataProvider;
        dp.source = this._l.slice(0, 4);
        dp.refresh();
        this.detailBtn.scaleY = 1;
    };
    p.shareClick = function () {
        if (GameUtils.isIOSApp()) {
            var rpid = this.data.rId;
            var name = PUser.getCache("i.nNa");
            var img = PUser.getCache("i.pic");
            meru.singleton(ShareListener).reviewShare("share", rpid, name, img);
            return;
        }
        meru.tooltip("请在回看界面分享");
    };
    return HistoryRoundItemView;
}(meru.BaseComponent));
egret.registerClass(HistoryRoundItemView,'HistoryRoundItemView',["eui.IItemRenderer","eui.UIComponent"]);
var ItemRecordDetail2 = (function (_super) {
    __extends(ItemRecordDetail2, _super);
    function ItemRecordDetail2() {
        _super.apply(this, arguments);
    }
    var d = __define,c=ItemRecordDetail2,p=c.prototype;
    p.dataChanged = function () {
        if (!this.data) {
            return;
        }
        if (this.data.hasOwnProperty("test")) {
            return;
        }
        this["name1"].text = GameUtils.formatName(this.data["uName"], this.data);
        this["score1"].text = this.data["lsc"] + "";
        if (this.data.uId == PUser.getCache("i.id")) {
            this["name1"].textColor = 0xFFFF00;
        }
        else {
            this["name1"].textColor = 0xFFFFFF;
        }
    };
    return ItemRecordDetail2;
}(meru.ItemRenderer));
egret.registerClass(ItemRecordDetail2,'ItemRecordDetail2');

/**
 * Created by yang on 17/1/7.
 */
var HistoryRoundView = (function (_super) {
    __extends(HistoryRoundView, _super);
    function HistoryRoundView(data) {
        _super.call(this);
        this.data = data;
        this.skinName = "GameRecordSkin2";
    }
    var d = __define,c=HistoryRoundView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.listener(this.backBtn, this.check);
        var l = [];
        var list = this.data["rrs"];
        for (var i = 0; i < list.length; i++) {
            var obj = {};
            obj["rId"] = this.data["rId"];
            obj["d"] = list[i];
            obj["rus"] = this.data["rus"];
            l.push(obj);
        }
        var dp = new eui.ArrayCollection(l);
        this.list.dataProvider = dp;
        this.topView.setData(this.data);
    };
    p.onExit = function () {
        HistoryRoundView.openMap = {};
        _super.prototype.onExit.call(this);
        this.clearListeners();
    };
    p.check = function () {
        this.close();
    };
    p.close = function () {
        meru.UI.remove(this);
        meru.UI.addBox(new HistoryView());
    };
    HistoryRoundView.openMap = {};
    return HistoryRoundView;
}(meru.BaseComponent));
egret.registerClass(HistoryRoundView,'HistoryRoundView');

/**
 * Created by yang on 17/1/7.
 */
var HistoryView = (function (_super) {
    __extends(HistoryView, _super);
    function HistoryView() {
        _super.call(this);
        this.skinName = "GameRecordSkin1";
    }
    var d = __define,c=HistoryView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        var list = meru.getCache(PRoom.historyList())["l"].concat([]);
        list.sort(function (a, b) {
            return b.time - a.time;
        });
        var dp = new eui.ArrayCollection(list);
        this.list.dataProvider = dp;
        this.listener(this.checkBtn, this.check);
    };
    p.onExit = function () {
        HistoryView.openMap = {};
        _super.prototype.onExit.call(this);
    };
    p.check = function () {
        meru.UI.addBox(new ReviewCodeView());
    };
    HistoryView.openMap = {};
    return HistoryView;
}(meru.BaseComponent));
egret.registerClass(HistoryView,'HistoryView');

/**
 * Created by yang on 17/1/4.
 */
var Review = (function (_super) {
    __extends(Review, _super);
    function Review() {
        _super.call(this);
        this._pnMap = {};
        this._idx = 0;
        this._max = 10;
        this._myPos = 1;
        this.skinName = "ReviewSkin";
        var rus = ReviewController.data["rus"];
        var uId = PUser.getCache("i.id");
        var myPos;
        var owner;
        for (var key in rus) {
            if (rus[key]["uId"] == uId) {
                myPos = key;
            }
            if (key == "1") {
                owner = rus[key];
            }
        }
        var img;
        var name;
        if (myPos) {
            name = PUser.getCache("i.nNa");
            img = PUser.getCache("i.pic");
        }
        else {
            name = owner["uName"];
            img = owner["pic"];
        }
        meru.singleton(ShareListener).reviewShare("init", ReviewController.rpId, name, img);
        meru.singleton(RuleCenter).init13zhang();
    }
    var d = __define,c=Review,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.listener(this.quitBtn, this.quit);
        this.listener(this.preBtn, this.prev);
        this.listener(this.nextBtn, this.next);
        this.initPosition();
        this.baseInfo();
        this._idx = 0;
        // this._max = ReviewController.data["mrd"];
        this._max = ReviewController.data["rounds"].length;
        this.next();
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        this.clearListeners();
    };
    p.prev = function () {
        this._idx -= 1;
        this.preBtn.enabled = (this._idx > 1);
        this.nextBtn.enabled = !this.isOver();
        this.refreshView();
    };
    p.next = function () {
        this._idx += 1;
        this.preBtn.enabled = (this._idx > 1);
        this.nextBtn.enabled = !this.isOver();
        this.refreshView();
    };
    p.isOver = function () {
        return this._idx >= this._max;
    };
    p.baseInfo = function () {
        var data = ReviewController.data;
        this["room"].text = "房间号:" + data["code"];
        this.rvId.text = "回看码:" + ReviewController.rpId;
        var rule = ReviewController.curRule();
        if (rule[1] == 1) {
            this["moshi"].text = "算分模式";
        }
        else {
            if (rule[0] == 1) {
                this["moshi"].text = "庄：房主";
            }
            else {
                this["moshi"].text = "庄：黑桃A";
            }
        }
    };
    p.quit = function () {
        meru.UI.runScene(new HomeLayer());
    };
    p.initPosition = function () {
        var rus = ReviewController.data["rus"];
        var uId = PUser.getCache("i.id");
        var myPos;
        var owner;
        for (var key in rus) {
            if (rus[key]["uId"] == uId) {
                myPos = key;
            }
            if (key == "1") {
                owner = key;
            }
        }
        myPos = parseInt(myPos);
        if (!myPos) {
            myPos = parseInt(owner);
        }
        for (var i = 1; i <= 5; i++) {
            var v = myPos + i;
            var idx = v % 5;
            if (idx == 0) {
                idx = 5;
            }
            this._pnMap[i] = idx;
        }
        this._myPos = myPos;
        var list = [];
        var max = ReviewController.maxUser();
        for (var i = 0; i < max; i++) {
            var v1 = i - (myPos - 1);
            if (v1 < 0) {
                v1 += 5;
            }
            list.push(v1);
        }
        for (var i = 0; i < 5; i++) {
            this["user" + i].visible = list.indexOf(i) > -1;
        }
    };
    p.refreshView = function () {
        this["round"].text = "第" + this._idx + "/" + this._max + "局";
        var rus = ReviewController.data["rounds"][this._idx - 1];
        for (var i = 1; i <= 5; i++) {
            if (this["user" + i] && rus[this._pnMap[i]]) {
                this["user" + i].refreshView(rus[this._pnMap[i]], this._pnMap[i]);
            }
        }
        this["user0"].refreshView(rus[this._myPos], this._myPos);
    };
    return Review;
}(meru.BaseComponent));
egret.registerClass(Review,'Review');

/**
 * Created by yang on 17/1/14.
 */
var ReviewCodeView = (function (_super) {
    __extends(ReviewCodeView, _super);
    function ReviewCodeView() {
        _super.call(this);
        this.skinName = "ReviewOtherPlayerSkin";
    }
    var d = __define,c=ReviewCodeView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        var rvId = egret.getOption("rvId");
        if (rvId && ReviewCodeView.auto) {
            this.input.text = rvId;
        }
        ReviewCodeView.auto = false;
        this.listener(this.sureBtn, this.sure);
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        this.clearListeners();
    };
    p.sure = function () {
        var reviewId = parseInt(this.input.text);
        if (!reviewId) {
            meru.tooltip("请输入正确的录像ID");
            return;
        }
        meru.request(PRoom.getReplay(reviewId)).then(function (data) {
            if (data["est"] == 1) {
                ReviewController.rpId = reviewId;
                ReviewController.setData(data);
            }
            else {
                meru.tooltip("录像丢失");
            }
        });
    };
    ReviewCodeView.auto = true;
    return ReviewCodeView;
}(meru.BaseComponent));
egret.registerClass(ReviewCodeView,'ReviewCodeView');

/**
 * Created by yang on 17/1/13.
 */
var ReviewController = (function () {
    function ReviewController() {
    }
    var d = __define,c=ReviewController,p=c.prototype;
    ReviewController.setData = function (data) {
        this.data = data;
        meru.UI.clearBox();
        meru.UI.runScene(new Review());
    };
    ReviewController.getName = function (pn) {
        return GameUtils.formatName(this.data.rus[pn]["uName"], this.data.rus[pn]);
    };
    ReviewController.getHead = function (pn) {
        return this.data.rus[pn]["pic"];
    };
    ReviewController.getRole = function (pn) {
        return this.data.rus[pn]["ldo"];
    };
    ReviewController.curRule = function () {
        var scst = ReviewController.data["setting"];
        var str = scst.toString(2);
        var length = str.length;
        var rule1 = str.charAt(length - 2); //房主固定庄家
        var rule2 = str.charAt(length - 3); //无庄模式
        return [rule1, rule2];
    };
    ReviewController.maxUser = function () {
        return Object.keys(this.data["rus"]).length;
    };
    ReviewController.data = {};
    ReviewController.rpId = -1;
    return ReviewController;
}());
egret.registerClass(ReviewController,'ReviewController');

/**
 * Created by yang on 17/1/4.
 */
var ReviewUserView = (function (_super) {
    __extends(ReviewUserView, _super);
    function ReviewUserView() {
        _super.apply(this, arguments);
        this._loader = new HeadLoader();
    }
    var d = __define,c=ReviewUserView,p=c.prototype;
    p.refreshView = function (data, idx) {
        this._data = data;
        //背景框 头像 身份icon name
        var d = ReviewController.data["rus"][idx];
        this.palyerName.text = GameUtils.formatName(d["uName"], d);
        var pic = ReviewController.data["rus"][idx]["pic"];
        var ldo = data["ldo"];
        if (ldo) {
            this.headBg.source = "bg_head_1_png";
        }
        else {
            this.headBg.source = "bg_head_2_png";
        }
        this.refreshHead(pic, ldo);
        this.score.text = data["tsc"];
        if (data["sc"] >= 0) {
            this.curScore.text = "+" + data["sc"];
            this.curScore.font = "point_yellow_font_fnt";
        }
        else {
            this.curScore.text = data["sc"] + "";
            this.curScore.font = "point_blue_font_fnt";
        }
        this.showResult();
    };
    p.refreshHead = function (pic, ldo) {
        if (pic == 1) {
            if (ldo == 1) {
                this._loader.init(this.head, "head_1_png", 4);
            }
            else {
                this._loader.init(this.head, "head_2_png", 4);
            }
        }
        else {
            this._loader.init(this.head, pic, 4);
        }
    };
    p.showResult = function () {
        var sp = this._data["poker"].split(",");
        for (var i = 0; i < sp.length; i++) {
            var d = new CardData(sp[i]);
            this["card" + i].hideBack();
            this["card" + i].setData(d);
        }
        var daos = this._data["lwd"]["daos"];
        this.refreshScore(this["firstPoint"], daos[0]);
        this.refreshScore(this["midPoint"], daos[1]);
        this.refreshScore(this["lastPoint"], daos[2]);
    };
    p.refreshScore = function (txt, score) {
        if (score >= 0) {
            txt.text = "+" + score;
            txt.font = "point_yellow_font_fnt";
        }
        else {
            txt.text = score;
            txt.font = "point_blue_font_fnt";
        }
    };
    return ReviewUserView;
}(meru.BaseComponent));
egret.registerClass(ReviewUserView,'ReviewUserView');

/**
 * Created by yang on 2017/6/22.
 */
var PeopleRankItem = (function (_super) {
    __extends(PeopleRankItem, _super);
    function PeopleRankItem() {
        _super.apply(this, arguments);
        this._loader = new HeadLoader();
    }
    var d = __define,c=PeopleRankItem,p=c.prototype;
    p.dataChanged = function () {
        if (!this.data) {
            return;
        }
        this["rank"].text = this.data.rank;
        this["host"].visible = PRoom.getCache("base.owner") == this.data.uId;
        this["nameLabel"].text = GameUtils.formatName(this.data.nm, this.data);
        this["detailLabel"].text = this.data.wn + "胜" + this.data.fn + "负";
        if (this.data.lsc > 0) {
            this["score"].text = "+" + this.data.lsc;
        }
        else {
            this["score"].text = this.data.lsc;
        }
        if (this.data["pic"] == 1) {
            this._loader.init(this.head, "head_2_png", 4);
        }
        else {
            this._loader.init(this.head, this.data["pic"], 4);
        }
    };
    return PeopleRankItem;
}(meru.ItemRenderer));
egret.registerClass(PeopleRankItem,'PeopleRankItem');

/**
 * Created by yang on 2017/6/22.
 */
var RoundHistoryView = (function (_super) {
    __extends(RoundHistoryView, _super);
    function RoundHistoryView() {
        _super.call(this);
        this.skinName = "PanelScoreSkin";
    }
    var d = __define,c=RoundHistoryView,p=c.prototype;
    p.onEnter = function () {
        var _this = this;
        _super.prototype.onEnter.call(this);
        var tab = new andes.operates.TabOperate('tab');
        tab.clearTabItems();
        tab.addTabItem({
            label: '战绩流水',
            onSelect: function (callback) {
                callback();
                _this['liushui'].visible = true;
                _this['total'].visible = false;
            }
        });
        tab.addTabItem({
            label: '总分排行',
            onSelect: function (callback) {
                callback();
                _this['liushui'].visible = false;
                _this['total'].visible = true;
            }
        });
        this.addOperate(tab);
        this.groupList.dataProvider = this.gList;
        this.rankList.dataProvider = this.rList;
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        HistoryRoundView.openMap = {};
    };
    d(p, "gList"
        //战绩流水
        ,function () {
            var arr = [];
            var base = meru.getCache(PRoom.roundResults());
            arr = base["l"];
            return new eui.ArrayCollection(arr);
        }
    );
    d(p, "rList"
        //总分排行
        ,function () {
            var arr = [];
            var rus = PRoom.getCache("rus");
            for (var key in rus) {
                var obj = rus[key];
                arr.push(obj);
            }
            arr.sort(function (a, b) { return b.tsc - a.tsc; });
            for (var i = 0; i < arr.length; i++) {
                arr[i].rank = i + 1;
            }
            return new eui.ArrayCollection(arr);
        }
    );
    return RoundHistoryView;
}(meru.BaseComponent));
egret.registerClass(RoundHistoryView,'RoundHistoryView');

/**
 * Created by yang on 2017/6/22.
 */
var RoundItem = (function (_super) {
    __extends(RoundItem, _super);
    function RoundItem() {
        _super.call(this);
        this.skinName = "ItemGameRecordSkin2";
    }
    var d = __define,c=RoundItem,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.listener(this.detailBtn, this.detailClick);
        this.listener(this.xiangxiBtn, this.xiangxiClick);
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        this.clearListeners();
    };
    p.xiangxiClick = function () {
        var data = this.data["rus"];
        var rus = PRoom.getCache("rus");
        for (var key in data) {
            data[key]["uId"] = rus[key]["uId"];
            data[key]["nm"] = rus[key]["nm"];
            data[key]["pic"] = rus[key]["pic"];
        }
        meru.UI.addBox(new RoundOverView(data));
    };
    p.detailClick = function () {
        if (HistoryRoundView.openMap[this.data['idx']]) {
            HistoryRoundView.openMap[this.data['idx']] = false;
        }
        else {
            HistoryRoundView.openMap[this.data['idx']] = true;
        }
        this.showList();
    };
    p.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (!this.data) {
            return;
        }
        this.xiangxiBtn.visible = true;
        this.detailBtn.visible = false;
        var rus = this.data["rus"];
        var bRus = PRoom.getCache("rus");
        var l = [];
        for (var key in rus) {
            var obj = {};
            obj["lsc"] = rus[key]["lsc"];
            obj["uName"] = bRus[key]["nm"];
            obj["uId"] = bRus[key]["uId"];
            l.push(obj);
        }
        this._l = l;
        this.showList();
        this.detailBtn.visible = l.length > 4;
    };
    p.showList = function () {
        if (HistoryRoundView.openMap[this.data['idx']]) {
            this.showAll();
        }
        else {
            this.showSome();
        }
    };
    p.showAll = function () {
        var dp = this.list.dataProvider;
        dp.source = this._l;
        dp.refresh();
        this.detailBtn.scaleY = -1;
    };
    p.showSome = function () {
        var dp = this.list.dataProvider;
        dp.source = this._l.slice(0, 4);
        dp.refresh();
        this.detailBtn.scaleY = 1;
    };
    return RoundItem;
}(meru.BaseComponent));
egret.registerClass(RoundItem,'RoundItem',["eui.IItemRenderer","eui.UIComponent"]);

/**
 * Created by yang on 17/1/6.
 */
var SettingView = (function (_super) {
    __extends(SettingView, _super);
    function SettingView() {
        _super.call(this);
        this.skinName = "SettingSkin";
    }
    var d = __define,c=SettingView,p=c.prototype;
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.refreshView();
        this.musicOpen.group.addEventListener(eui.UIEvent.CHANGE, this.switchMusic, this);
        this.effectOpen.group.addEventListener(eui.UIEvent.CHANGE, this.switchEffect, this);
    };
    p.onExit = function () {
        _super.prototype.onExit.call(this);
        this.musicOpen.group.removeEventListener(eui.UIEvent.CHANGE, this.switchMusic, this);
        this.effectOpen.group.removeEventListener(eui.UIEvent.CHANGE, this.switchEffect, this);
    };
    p.refreshView = function () {
        this.musicOpen.selected = meru.singleton(SoundManager).isMusicOpen();
        this.musicClose.selected = !meru.singleton(SoundManager).isMusicOpen();
        this.effectOpen.selected = meru.singleton(SoundManager).isEffectOpen();
        this.effectClose.selected = !meru.singleton(SoundManager).isEffectOpen();
    };
    p.switchMusic = function () {
        meru.singleton(SoundManager).switchMusic();
        this.refreshView();
    };
    p.switchEffect = function () {
        meru.singleton(SoundManager).switchEffect();
        this.refreshView();
    };
    return SettingView;
}(meru.BaseComponent));
egret.registerClass(SettingView,'SettingView');

/**
 * Created by yang on 17/1/5.
 */
var BaseVoice = (function () {
    function BaseVoice() {
        this.playList = [];
        this.isPlaying = false; //state 暂时不用
        this.state = VoiceState.default;
        this.startTime = 0;
        this.voiceTime = 0; //录音时间
        this.loadedList = [];
        this.currentRecordId = null;
        this.currentDownloadId = null;
    }
    var d = __define,c=BaseVoice,p=c.prototype;
    p.init = function () {
        this.onVoiceRecordEnd();
    };
    p.getLocalId = function (serverId) {
        for (var i = 0; i < this.loadedList.length; i++) {
            if (this.loadedList[i].serverId == serverId) {
                return this.loadedList[i].localId;
            }
        }
        return null;
    };
    p.startRecord = function () {
        this.state = VoiceState.starting;
        this.startTime = new Date().getTime();
    };
    p.startRecordCallBack = function (data) {
        if (data["message"] == "sucess") {
            console.log("开始录音");
            this.state = VoiceState.recording;
        }
        else {
            console.log("拒绝授权");
            this.state = VoiceState.default;
        }
    };
    p.stopRecord = function () {
        this.state = VoiceState.stopping;
    };
    p.stopRecordCallBack = function (mes) {
        this.state = VoiceState.default;
        if (mes["message"] == "sucess") {
            var t = new Date().getTime() - this.startTime;
            this.voiceTime = Math.ceil((t) / 1000);
            this.currentRecordId = mes["result"];
            meru.postNotification("afterStopVoice");
        }
        else {
            // meru.tooltip("录音失败");
            this.alertFail(mes);
            VoiceEvent.end();
        }
        this.startTime = 0;
    };
    p.onVoiceRecordEnd = function () {
    };
    p.onVoiceRecordEndCallBack = function (mes) {
        this.state = VoiceState.default;
        this.voiceTime = 60;
        if (mes["message"] == "sucess") {
            this.currentRecordId = mes["result"];
            meru.postNotification("voiceRecordTimeOut");
        }
        else {
            // meru.tooltip("录音失败");
            this.alertFail(mes);
        }
        this.startTime = 0;
    };
    p.uploadVoice = function () {
        this.state = VoiceState.upLoading;
        // meru.tooltip("开始上传");
    };
    p.uploadVoiceCallBack = function (mes) {
        this.state = VoiceState.default;
        if (mes["message"] == "sucess") {
            // meru.tooltip("上传成功,serverId:"+mes["result"]["serverId"]);
            // meru.tooltip("上传成功,localId:"+mes["result"]["localId"]);
            var data = new VoiceData();
            data.localId = mes["result"]["localId"];
            data.serverId = mes["result"]["serverId"];
            this.loadedList.push(data);
            meru.postNotification("uploadVoiceDone", mes["result"]["serverId"], this.voiceTime);
        }
        else {
            // meru.tooltip("上传失败");
            this.alertFail(mes);
        }
        this.cleanRecord();
    };
    p.cleanRecord = function () {
        this.currentRecordId = null;
    };
    p.alertFail = function (mes) {
        // var ret = mes["result"];
        // if(ret) {
        //     var str = "";
        //     for(var key in ret) {
        //         str += (key+":"+ret[key]+"--");
        //     }
        //     alert(str);
        // }
    };
    p.downloadVoice = function (serverId) {
        // meru.tooltip("开始下载");
        this.state = VoiceState.downLoading;
    };
    p.downloadVoiceCallBack = function (mes) {
        this.state = VoiceState.default;
        if (mes["message"] == "sucess") {
            // meru.tooltip("下载成功,localId:"+mes["result"]["localId"]);
            // meru.tooltip("下载成功,serverId:"+mes["result"]["serverId"]);
            var data = new VoiceData();
            data.localId = mes["result"]["localId"];
            data.serverId = mes["result"]["serverId"];
            this.loadedList.push(data);
            this.playVoice(mes["result"]["serverId"]);
        }
        else {
            // meru.tooltip("下载失败");
            this.alertFail(mes);
        }
        this.currentDownloadId = null;
    };
    p.playVoice = function (serverId) {
        this.state = VoiceState.playing;
        this.isPlaying = true;
    };
    p.playVoiceCallBack = function (data) {
        this.state = VoiceState.default;
        this.isPlaying = false;
        if (this.playList.length > 0) {
            var id = this.playList.shift();
            this.playVoice(id);
        }
    };
    p.pauseVoice = function (serverId) {
        this.state = VoiceState.pausing;
    };
    p.pauseVoiceCallBack = function () {
        this.state = VoiceState.default;
    };
    p.stopVoice = function (serverId) {
        this.state = VoiceState.stopPlaying;
    };
    p.stopVoiceCallBack = function () {
        this.state = VoiceState.default;
    };
    return BaseVoice;
}());
egret.registerClass(BaseVoice,'BaseVoice');
var Voice = (function () {
    function Voice() {
    }
    var d = __define,c=Voice,p=c.prototype;
    Voice.getVoice = function () {
        if (this._voice) {
            return this._voice;
        }
        if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
            this._voice = new H5Voice();
        }
        else {
            this._voice = new NativeVoice();
        }
        this._voice.init();
        return this._voice;
    };
    return Voice;
}());
egret.registerClass(Voice,'Voice');
var VoiceData = (function () {
    function VoiceData() {
        this.localId = null;
        this.serverId = null;
    }
    var d = __define,c=VoiceData,p=c.prototype;
    return VoiceData;
}());
egret.registerClass(VoiceData,'VoiceData');
var VoiceEvent = (function () {
    function VoiceEvent() {
    }
    var d = __define,c=VoiceEvent,p=c.prototype;
    VoiceEvent.start = function () {
        var route = "g.tv";
        var msg = {
            "v": 1
        };
        andes.socket.GameWebSocket.get().request(route, msg);
    };
    VoiceEvent.end = function () {
        var route = "g.tv";
        var msg = {
            "v": 0
        };
        andes.socket.GameWebSocket.get().request(route, msg);
    };
    return VoiceEvent;
}());
egret.registerClass(VoiceEvent,'VoiceEvent');
var VoiceState = (function () {
    function VoiceState() {
    }
    var d = __define,c=VoiceState,p=c.prototype;
    VoiceState.default = 1;
    VoiceState.starting = 2;
    VoiceState.recording = 3;
    VoiceState.stopping = 4;
    VoiceState.upLoading = 5;
    VoiceState.downLoading = 6;
    VoiceState.playing = 7;
    VoiceState.stopPlaying = 8;
    VoiceState.pausing = 9;
    return VoiceState;
}());
egret.registerClass(VoiceState,'VoiceState');

/**
 * Created by yang on 17/1/5.
 */
var H5Voice = (function (_super) {
    __extends(H5Voice, _super);
    function H5Voice() {
        _super.apply(this, arguments);
    }
    var d = __define,c=H5Voice,p=c.prototype;
    p.startRecord = function () {
        if (this.state == VoiceState.recording) {
            return false;
        }
        _super.prototype.startRecord.call(this);
        OpenSdk.startRecord(this.startRecordCallBack, this);
        return true;
    };
    p.stopRecord = function () {
        var t = new Date().getTime() - this.startTime;
        if (t < 1000) {
            meru.setTimeout(this.stopRecord, this, 1000 - t + 100);
        }
        else {
            _super.prototype.stopRecord.call(this);
            OpenSdk.stopRecord(this.stopRecordCallBack, this);
        }
    };
    p.onVoiceRecordEnd = function () {
        OpenSdk.onVoiceRecordEnd(this.onVoiceRecordEndCallBack, this);
    };
    p.uploadVoice = function () {
        _super.prototype.uploadVoice.call(this);
        if (!this.currentRecordId) {
            meru.tooltip("你还没录音呐" + this.currentRecordId);
            return;
        }
        var obj = {};
        obj["localId"] = this.currentRecordId;
        if (GameUtils.isIOS()) {
            obj["isShowProgressTips"] = 0;
        }
        else {
            obj["isShowProgressTips"] = 1;
        }
        OpenSdk.uploadVoice(obj, this.uploadVoiceCallBack, this);
    };
    p.downloadVoice = function (serverId) {
        _super.prototype.downloadVoice.call(this, serverId);
        this.currentDownloadId = serverId;
        var obj = {};
        obj["serverId"] = serverId;
        if (GameUtils.isIOS()) {
            obj["isShowProgressTips"] = 0;
        }
        else {
            obj["isShowProgressTips"] = 1;
        }
        OpenSdk.downloadVoice(obj, this.downloadVoiceCallBack, this);
    };
    p.playVoice = function (serverId) {
        var localId = this.getLocalId(serverId);
        if (localId) {
            if (this.isPlaying) {
                this.playList.push(serverId);
                return;
            }
            _super.prototype.playVoice.call(this, serverId);
            OpenSdk.playVoice(localId, this.playVoiceCallBack, this);
        }
        else {
            if (this.currentDownloadId == serverId) {
                return;
            }
            this.downloadVoice(serverId);
        }
    };
    p.pauseVoice = function (serverId) {
        var localId = this.getLocalId(serverId);
        if (localId) {
            _super.prototype.pauseVoice.call(this, serverId);
            OpenSdk.pauseVoice(localId, this.pauseVoiceCallBack, this);
        }
    };
    p.stopVoice = function (serverId) {
        var localId = this.getLocalId(serverId);
        if (localId) {
            _super.prototype.stopVoice.call(this, serverId);
            OpenSdk.stopVoice(localId, this.stopVoiceCallBack, this);
        }
    };
    return H5Voice;
}(BaseVoice));
egret.registerClass(H5Voice,'H5Voice');

/**
 * Created by yang on 17/1/5.
 */
var NativeVoice = (function (_super) {
    __extends(NativeVoice, _super);
    function NativeVoice() {
        _super.apply(this, arguments);
    }
    var d = __define,c=NativeVoice,p=c.prototype;
    return NativeVoice;
}(BaseVoice));
egret.registerClass(NativeVoice,'NativeVoice');

/**
 * Created by yang on 16/12/21.
 */
var SocketAnalysis1 = (function () {
    function SocketAnalysis1() {
        var _this = this;
        this._lastMs = -1000;
        this._auto = -1;
        this._timeId = -1;
        this.pushData = {};
        this.beforeEnter = [];
        meru.addPullObject('GET_SPEED_MS', function () {
            return _this._lastMs;
        }, this);
    }
    var d = __define,c=SocketAnalysis1,p=c.prototype;
    p.speedChange = function (ms) {
        this._lastMs = ms;
        meru.postNotification('SPEED_CHANGE', ms);
    };
    p.analysisItem = function (dataObj) {
        if (dataObj.t == 'r.nt') {
            SystemChatTip.marquee.show(dataObj.d);
            return;
        }
        if (this.ignore(dataObj)) {
            this.onAdd(dataObj);
            return;
        }
        if (dataObj.t == "wr.d") {
            this.voiceChange(dataObj);
            return;
        }
        if (this.isChat(dataObj)) {
            if (dataObj['d']['t'] == 5) {
                meru.postNotification('INFO.FACE_ANIM', dataObj['d']);
            }
            else {
                if (GameUtils.isIOSApp() && dataObj["d"]["t"] == ChatConst.VOICE) {
                    meru.singleton(SocketSynchronize).register(dataObj["d"]["psId"]);
                    return;
                }
                var list = meru.getCache(PChat.roomList())["l"];
                list.push(dataObj["d"]);
                meru.postNotification(GameEvents.USER_CHAT, dataObj["d"]);
                meru.postNotification(GameEvents.CHAT_CHANGE);
                meru.singleton(SocketSynchronize).register(dataObj["d"]["psId"]);
            }
            return;
        }
        var detail = dataObj["d"];
        if (this.checkPush(dataObj)) {
            return;
        }
        var info = PRoom.getCache("");
        if (detail["st"] == Const.afterFree() && info["base"]["st"] != Const.afterFree()) {
            meru.singleton(SoundManager).playBGM2();
            meru.singleton(SoundManager).startEffect();
        }
        if (detail["rId"]) {
            info["rId"] = detail["rId"];
        }
        if (detail["psId"]) {
            info["base"]["psId"] = detail["psId"];
        }
        if (detail["rd"]) {
            info["base"]["rd"] = detail["rd"];
        }
        if (detail["st"]) {
            info["base"]["st"] = detail["st"];
        }
        if (detail["nTurn"]) {
            info["base"]["nTurn"] = detail["nTurn"];
        }
        if (dataObj.t == "r.a") {
            if (detail["rus"]) {
                info["rus"][detail["rus"]["pn"]] = detail["rus"];
            }
            meru.postNotification(GameEvents.STATUS_CHANGE);
        }
        else if (dataObj.t == "r.c") {
            info["rus"][detail["acPn"]]["hp"] = 1;
            if (detail["sudr"]) {
                meru.postNotification("REMOVE_TOPSCENE");
            }
            if (detail["rus"]) {
                for (var key in detail["rus"]) {
                    for (var k in detail["rus"][key]) {
                        info["rus"][key][k] = detail["rus"][key][k];
                    }
                }
            }
            if (detail["shPai"]) {
                info["si"]["poker"] = detail["shPai"];
                if (detail["spl"] == 1) {
                    info["rus"][detail["acPn"]]["spl"] = 1;
                }
                meru.singleton(GameData).myCardsChange();
            }
            if (detail["st"] == Const.ROOM_STATUS_WAIT) {
                RoundOverView.register = true;
                meru.postNotification(GameEvents.CONTINUE_STATUS, true);
                //有问题么
                var report = "";
                for (var key in info["rus"]) {
                    if (!info["rus"][key]["shPai"]) {
                        report += (key + "位置没牌");
                    }
                }
                if (report) {
                    meru.request({ "moddo": "User.uploadLog", "params": { "logStr": report } });
                    meru.request(PRoom.getInfo(true)).then(function () {
                        if (PRoom.getCache("rId") > 0) {
                            meru.singleton(ResultPlay).setData();
                        }
                        else {
                            meru.UI.clearBox();
                            meru.UI.runScene(new HomeLayer());
                        }
                    });
                    return;
                }
                meru.singleton(ResultPlay).setData();
            }
        }
        else if (dataObj.t == "r.d") {
            info["rus"][detail["acPn"]]["cm"] = 1;
            if (detail["st"] == Const.afterFree()) {
                info["rus"] = detail["rus"];
            }
        }
        else if (dataObj.t == "r.e") {
            info["base"]["qtt"] = detail["qtt"];
            for (var key in detail["rus"]) {
                info["rus"][key]["qt"] = detail["rus"][key]["qt"];
            }
            if (detail["qac"] == "done") {
                meru.postNotification("QUIT.OVER");
                return;
            }
            else if (detail["qac"] == "clvote") {
                meru.UI.clearBox();
                GameUtils.checkBox();
            }
            else {
                GameUtils.checkBox();
            }
            meru.getData(QuitData).quitDataChange();
        }
        else if (dataObj.t == "r.g") {
            delete info["rus"][detail["acPn"]];
            meru.postNotification(GameEvents.STATUS_CHANGE);
        }
        else if (dataObj.t == "r.j") {
            //数据set
            info["rus"][detail["acPn"]]["sudr"] = detail["sudr"];
            GameUtils.checkBox();
        }
        if (detail["si"] && detail["si"]["poker"]) {
            if (!info["si"]) {
                info["si"] = {};
            }
            info["si"]["poker"] = detail["si"]["poker"];
            for (var key in info["rus"]) {
                if (detail["ldo"] == key) {
                    info["rus"][key]["ldo"] = 1;
                }
                else {
                    info["rus"][key]["ldo"] = 0;
                }
            }
            RoundMutation.showed = false;
            var deal = new DealCard();
            DealCard.isDealing = true;
            meru.singleton(GameData).myCardsChange();
            meru.postNotification(GameEvents.REFRESH_USER);
            deal.execute(); //发牌动画完再出摆牌界面
        }
        if (this.checkPop()) {
            return;
        }
        this.fixBug();
        if (meru.singleton(ResultPlay).isPlaying) {
            return;
        }
        meru.postNotification(GameEvents.DATA_CHANGE);
    };
    p.fixBug = function () {
        //打牌的时候自己没牌
        var info = PRoom.getCache("");
        if (info && info["base"]) {
            if (Const.beforePlay(info["base"]["st"]) || info["base"]["st"] == Const.ROOM_STATUS_PLAYING) {
                if (!info["si"] || !info["si"]["poker"]) {
                    this.reconnect();
                }
            }
        }
    };
    p.autoTick = function () {
        return;
        if (this._auto == -1) {
            this._auto = meru.setInterval(this.fixBug, this, 3000);
        }
    };
    p.register = function () {
        meru.clearTimeout(this._timeId);
        this._timeId = meru.setTimeout(this.reload, this, 2000);
    };
    p.reload = function () {
        if (Object.keys(this.pushData).length > 0) {
            this.reconnect();
        }
    };
    p.ignore = function (data) {
        return data.t == "wr.a" || data.t == "wr.b" || data.t == "wr.c";
    };
    p.isChat = function (data) {
        return data.t == "r.f";
    };
    p.onAdd = function (data) {
        this.autoTick();
        if (Const.ONOFF) {
            if (Const.ONOFF["sc"] > data["sc"]) {
                return;
            }
        }
        Const.ONOFF["sc"] = data["sc"];
        Const.ONOFF["d"] = data["d"];
        meru.postNotification(GameEvents.STATUS_CHANGE);
    };
    p.voiceChange = function (data) {
        if (!Const.ONOFF["v"]) {
            Const.ONOFF["v"] = {};
        }
        Const.ONOFF["v"][data["d"]["pn"]] = data["d"]["v"];
        meru.postNotification(GameEvents.STATUS_CHANGE);
    };
    p.reconnect = function () {
        meru.singleton(SocketSynchronize).synchronize(this.afterSynchronize, this);
    };
    p.afterSynchronize = function () {
        var psId = PRoom.getCache("base.psId");
        for (var key in this.pushData) {
            if (key <= psId) {
                delete this.pushData[key];
            }
        }
    };
    p.cleanPushData = function () {
        this.pushData = {};
        this.beforeEnter = [];
    };
    p.checkPush = function (data1) {
        var data = data1["d"];
        if (!data["psId"]) {
            return false;
        }
        var info = PRoom.getCache("");
        if (info && info["base"] && info["base"]["psId"] + 1 != data["psId"]) {
            if (info["base"]["psId"] == data["psId"]) {
                console.log("%c 这就先不屏蔽了" + data["psId"], "color: #FF0000");
                return false;
            }
            this.pushData[data["psId"]] = data1;
            console.log("%c 之前" + info["base"]["psId"] + ",现在" + data["psId"], "color: #FF0000");
            this.register();
            return true;
        }
        else if (!info || !info["base"]) {
            console.log("%c 还没有base", "color: #FF0000");
            this.beforeEnter.push(data1);
            return true;
        }
        else {
            return false;
        }
    };
    p.checkPop = function () {
        var info = PRoom.getCache("");
        var data = this.pushData[info["base"]["psId"] + 1];
        if (data) {
            delete this.pushData[info["base"]["psId"] + 1];
            console.log("延迟推送");
            this.analysisItem(data);
            return true;
        }
        else {
            return false;
        }
    };
    p.pushAll = function () {
        this.beforeEnter.sort(function (a, b) {
            return a.d.psId - b.d.psId;
        });
        for (var i = 0; i < this.beforeEnter.length; i++) {
            this.analysisItem(this.beforeEnter[i]);
        }
        this.beforeEnter = [];
    };
    return SocketAnalysis1;
}());
egret.registerClass(SocketAnalysis1,'SocketAnalysis1',["SocketInterface"]);

/**
 * Created by yang on 17/2/11.
 */
var BaseRule = (function () {
    function BaseRule() {
    }
    var d = __define,c=BaseRule,p=c.prototype;
    p.isDao = function (list) {
        return list.length == 3;
    };
    p.verify = function (list) {
        return true;
    };
    p.getLists = function (list) {
        var kingList = [];
        var normalList = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].isJoker) {
                kingList.push(list[i]);
            }
            else {
                normalList.push(list[i]);
            }
        }
        return { "king": kingList, "normal": normalList };
    };
    d(p, "level"
        ,function () {
            return this.type;
        }
    );
    p.compare = function (list1, list2) {
        return list1[0].type - list2[0].type;
    };
    return BaseRule;
}());
egret.registerClass(BaseRule,'BaseRule');

/**
 * Created by yang on 17/2/11.
 */
var DuiziRule = (function (_super) {
    __extends(DuiziRule, _super);
    function DuiziRule() {
        _super.apply(this, arguments);
        this.type = RuleType.Duizi;
        this.source = "";
    }
    var d = __define,c=DuiziRule,p=c.prototype;
    p.verify = function (list) {
        if (!this.isDao(list)) {
            return false;
        }
        this._list = list;
        var map1 = this.getLists(list);
        var kingList = map1.king; //最多一个
        if (kingList.length > 0) {
            return true;
        }
        var map = {};
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (!map[item.grade]) {
                map[item.grade] = 0;
            }
            map[item.grade] += 1;
        }
        if (Object.keys(map).length != list.length - 1) {
            return false;
        }
        for (var key in map) {
            if (map[key] != 1 && map[key] != 2) {
                return false;
            }
        }
        return true;
    };
    p.getDui = function (list) {
        var dui = [];
        var map = {};
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (!map[item.grade]) {
                map[item.grade] = [];
            }
            map[item.grade].push(item);
            if (map[item.grade].length == 2) {
                return map[item.grade];
            }
        }
        var map1 = this.getLists(list);
        var kingList = map1.king;
        var normalList = map1.normal;
        if (kingList.length > 0) {
            dui.push(normalList[0]);
        }
        return dui;
    };
    p.getDan = function (list) {
        var dan = [];
        var map = {};
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (!map[item.grade]) {
                map[item.grade] = [];
            }
            map[item.grade].push(item);
        }
        for (var key in map) {
            if (map[key].length == 1) {
                dan.push(map[key][0]);
            }
        }
        return dan;
    };
    p.compare = function (list1, list2) {
        var dui1 = this.getDui(list1);
        var dui2 = this.getDui(list2);
        if (dui1[0].grade != dui2[0].grade) {
            return dui1[0].grade - dui2[0].grade;
        }
        var dan1 = this.getDan(list1);
        var dan2 = this.getDan(list2);
        for (var i = 0; i < dan1.length; i++) {
            if (dan1[i].singleGrade != dan2[i].singleGrade) {
                return dan1[i].singleGrade - dan2[i].singleGrade;
            }
        }
        return _super.prototype.compare.call(this, dan1, dan2);
    };
    p.sound = function (list) {
        return "";
    };
    return DuiziRule;
}(BaseRule));
egret.registerClass(DuiziRule,'DuiziRule',["RuleInterface"]);

/**
 * Created by yang on 17/2/11.
 */
var SantiaoRule = (function (_super) {
    __extends(SantiaoRule, _super);
    function SantiaoRule() {
        _super.apply(this, arguments);
        this.type = RuleType.Santiao;
        this.source = "";
    }
    var d = __define,c=SantiaoRule,p=c.prototype;
    p.verify = function (list) {
        this._list = list;
        if (!this.isDao(list)) {
            return false;
        }
        return list[0].grade == list[1].grade && list[0].grade == list[2].grade;
    };
    p.compare = function (list1, list2) {
        return list1[0].grade - list2[0].grade;
    };
    p.sound = function (list) {
        return "";
    };
    return SantiaoRule;
}(BaseRule));
egret.registerClass(SantiaoRule,'SantiaoRule',["RuleInterface"]);

/**
 * Created by yang on 16/12/12.
 */
var ShunziRule = (function (_super) {
    __extends(ShunziRule, _super);
    function ShunziRule() {
        _super.apply(this, arguments);
        this.type = RuleType.Shunzi;
        this.source = "";
    }
    var d = __define,c=ShunziRule,p=c.prototype;
    p.verify = function (list) {
        this._list = list;
        if (!this.isDao(list)) {
            return false;
        }
        var map = this.getLists(list);
        var kingList = map.king;
        var normalList = map.normal;
        if (kingList.length == 2) {
            return true;
        }
        else if (kingList.length == 1) {
            var ret = GameUtils.needGrade(normalList);
            return ret.length == 1;
        }
        if (this.isSpecial(list)) {
            return true;
        }
        for (var i = 0; i < list.length - 1; i++) {
            if (list[i].grade != list[i + 1].grade + 1) {
                return false;
            }
        }
        return true;
    };
    //A 2 3 最小的顺子
    p.isSpecial = function (list) {
        var special = [14, 3, 2];
        for (var i = 0; i < list.length; i++) {
            if (list[i].grade != special[i]) {
                return false;
            }
        }
        return true;
    };
    p.getRealList = function (list) {
        var map = this.getLists(list);
        var kingList = map.king;
        var normalList = map.normal;
        var needList = [];
        if (kingList.length == 2) {
            if (normalList[0].grade == 14) {
                needList = [13, 12];
            }
            else if (normalList[0].grade == 13) {
                needList = [1, 12];
            }
            else {
                needList = [normalList[0].grade + 2, normalList[0].grade + 1];
            }
            //往上一个红桃base26 一个黑桃base39
            normalList.unshift(new CardData(needList[1] + 26));
            normalList.unshift(new CardData(needList[0] + 39));
        }
        else if (kingList.length == 1) {
            //有同花顺时的花色
            //无同花顺时变成黑桃
            var tonghua = (normalList[0].type == normalList[1].type);
            needList = GameUtils.needGrade(normalList);
            var v = 0;
            var v1 = needList[0];
            if (v1 == 14) {
                v1 = 1;
            }
            if (tonghua && kingList[0].color == normalList[0].color) {
                v = (normalList[0].type - 1) * 13 + v1;
            }
            else {
                if (kingList[0].color == 1) {
                    v = 39 + v1;
                }
                else {
                    v = 26 + v1;
                }
            }
            normalList.unshift(new CardData(v));
        }
        return normalList;
    };
    p.compare = function (list1, list2) {
        var l1 = this.getRealList(list1);
        var l2 = this.getRealList(list2);
        if (this.isSpecial(l1)) {
            if (this.isSpecial(l2)) {
                return _super.prototype.compare.call(this, l1, l2);
            }
            return -1;
        }
        else if (this.isSpecial(l2)) {
            return 1;
        }
        else {
            if (l1[0].grade != l2[0].grade) {
                return l1[0].grade - l2[0].grade;
            }
            else {
                return _super.prototype.compare.call(this, l1, l2);
            }
        }
    };
    p.sound = function (list) {
        return "";
    };
    return ShunziRule;
}(BaseRule));
egret.registerClass(ShunziRule,'ShunziRule',["RuleInterface"]);

/**
 * Created by yang on 17/2/11.
 */
var TonghuaRule = (function (_super) {
    __extends(TonghuaRule, _super);
    function TonghuaRule() {
        _super.apply(this, arguments);
        this.type = RuleType.Tonghua;
        this.source = "";
    }
    var d = __define,c=TonghuaRule,p=c.prototype;
    p.verify = function (list) {
        if (!this.isDao(list)) {
            return false;
        }
        this._list = list;
        var map = this.getLists(list);
        var kingList = map.king;
        var normalList = map.normal;
        for (var i = 0; i < normalList.length - 1; i++) {
            if (normalList[i].type != normalList[i + 1].type) {
                return false;
            }
        }
        if (kingList.length > 1) {
            return false;
        }
        else if (kingList.length == 1) {
            if (kingList[0].color != normalList[0].color) {
                return false;
            }
        }
        return true;
    };
    p.getRealList = function (list) {
        var map = this.getLists(list);
        var kingList = map.king;
        var normalList = map.normal;
        var ret = normalList;
        if (kingList.length > 0) {
            //王变成A或者K
            var v = 0;
            if (ret[0].grade != 14) {
                v = (ret[0].type - 1) * 13 + 1;
                ret.unshift(new CardData(v));
            }
            else {
                v = (ret[0].type - 1) * 13 + 13;
                ret[2] = ret[1];
                ret[1] = new CardData(v);
            }
        }
        return ret;
    };
    p.compare = function (list1, list2) {
        var l1 = this.getRealList(list1);
        var l2 = this.getRealList(list2);
        for (var i = 0; i < l1.length; i++) {
            if (l1[i].grade != l2[i].grade) {
                return l1[i].grade - l2[i].grade;
            }
        }
        return _super.prototype.compare.call(this, l1, l2);
    };
    p.sound = function (list) {
        return "";
    };
    return TonghuaRule;
}(BaseRule));
egret.registerClass(TonghuaRule,'TonghuaRule',["RuleInterface"]);

/**
 * Created by yang on 17/2/11.
 */
var TonghuashunRule = (function (_super) {
    __extends(TonghuashunRule, _super);
    function TonghuashunRule() {
        _super.apply(this, arguments);
        this.type = RuleType.Tonghuashun;
        this.source = "";
        this._rule = new ShunziRule();
    }
    var d = __define,c=TonghuashunRule,p=c.prototype;
    p.verify = function (list) {
        if (!this.isDao(list)) {
            return false;
        }
        this._list = list;
        var map = this.getLists(list);
        var kingList = map.king;
        var normalList = map.normal;
        for (var i = 0; i < normalList.length - 1; i++) {
            if (normalList[i].type != normalList[i + 1].type) {
                return false;
            }
        }
        if (kingList.length > 1) {
            return false;
        }
        else if (kingList.length == 1) {
            if (kingList[0].color != normalList[0].color) {
                return false;
            }
            normalList.unshift(kingList[0]);
        }
        return this._rule.verify(normalList);
    };
    p.compare = function (list1, list2) {
        return this._rule.compare(list1, list2);
    };
    p.sound = function (list) {
        return "";
    };
    return TonghuashunRule;
}(BaseRule));
egret.registerClass(TonghuashunRule,'TonghuashunRule',["RuleInterface"]);

/**
 * Created by yang on 17/2/11.
 */
var WulongRule = (function (_super) {
    __extends(WulongRule, _super);
    function WulongRule() {
        _super.apply(this, arguments);
        this.type = RuleType.Wulong;
        this.source = "";
    }
    var d = __define,c=WulongRule,p=c.prototype;
    p.verify = function (list) {
        if (!this.isDao(list)) {
            return false;
        }
        return true;
    };
    p.compare = function (list1, list2) {
        for (var i = 0; i < list1.length; i++) {
            if (list1[i].grade != list2[i].grade) {
                return list1[i].grade - list2[i].grade;
            }
        }
        return _super.prototype.compare.call(this, list1, list2);
    };
    p.sound = function (list) {
        return "";
    };
    return WulongRule;
}(BaseRule));
egret.registerClass(WulongRule,'WulongRule',["RuleInterface"]);

var RuleType;
(function (RuleType) {
    RuleType[RuleType["Wulong"] = 0] = "Wulong";
    RuleType[RuleType["Duizi"] = 1] = "Duizi";
    RuleType[RuleType["Shunzi"] = 2] = "Shunzi";
    RuleType[RuleType["Tonghua"] = 3] = "Tonghua";
    RuleType[RuleType["Tonghuashun"] = 4] = "Tonghuashun";
    RuleType[RuleType["Santiao"] = 5] = "Santiao";
    RuleType[RuleType["Tongguo"] = 100] = "Tongguo";
    RuleType[RuleType["Qinglianshun"] = 101] = "Qinglianshun";
    RuleType[RuleType["Quanshunzi"] = 102] = "Quanshunzi";
    RuleType[RuleType["Sansantiao"] = 103] = "Sansantiao";
    RuleType[RuleType["Sigetou"] = 104] = "Sigetou";
    RuleType[RuleType["Santonghua"] = 105] = "Santonghua";
    RuleType[RuleType["Quanhei"] = 106] = "Quanhei";
    RuleType[RuleType["Quanhong"] = 107] = "Quanhong";
    RuleType[RuleType["Shuangqingshun"] = 108] = "Shuangqingshun";
    RuleType[RuleType["Sanqingshun"] = 109] = "Sanqingshun";
    RuleType[RuleType["Shuangsantiao"] = 110] = "Shuangsantiao";
})(RuleType || (RuleType = {}));
var getRuleName = function (type) {
    return ["通过", "清连顺", "全顺子", "三三条", "四个头", "三同花", "全黑", "全红", "双清顺", "三清顺", "双三条"][type - 100];
};


/**
 * Created by yang on 2017/6/22.
 */
var LianshunRule = (function (_super) {
    __extends(LianshunRule, _super);
    function LianshunRule() {
        _super.apply(this, arguments);
        this.type = RuleType.Quanshunzi;
    }
    var d = __define,c=LianshunRule,p=c.prototype;
    p.verify = function (list) {
        var map = this.getLists(list);
        var kingList = map.king;
        var normalList = map.normal;
        var allList = [];
        for (var i = 14; i >= 2; i--) {
            allList.push(i);
        }
        for (var i = 0; i < normalList.length; i++) {
            var idx = allList.indexOf(normalList[i].grade);
            if (idx < 0) {
                return false;
            }
            allList.splice(idx, 1);
        }
        var testList = [];
        for (var i = 0; i < allList.length; i++) {
            if (allList[i] == 14) {
                testList.push(new CardData(1));
            }
            else {
                testList.push(new CardData(allList[i]));
            }
        }
        var arr = this.recursive(testList, kingList.length);
        for (var i = 0; i < arr.length; i++) {
            var temp = arr[i].concat(normalList);
            temp.sort(function (a, b) {
                return b.grade - a.grade;
            });
            if (this.test(temp)) {
                return true;
            }
        }
        return false;
    };
    p.test = function (list) {
        if (this.isSpecial(list)) {
            return true;
        }
        for (var i = 0; i < list.length - 1; i++) {
            if (list[i].grade != list[i + 1].grade + 1) {
                return false;
            }
        }
        return true;
    };
    p.recursive = function (list, num) {
        var ret = [];
        if (num == 1) {
            for (i = 0; i < list.length; i++) {
                ret.push([list[i]]);
            }
            return ret;
        }
        for (var i = 0; i < list.length; i++) {
            var temp = list.concat([]);
            temp.splice(0, i + 1);
            var sub = this.recursive(temp, num - 1);
            for (var m = 0; m < sub.length; m++) {
                ret.push([list[i]].concat(sub[m]));
            }
        }
        return ret;
    };
    //A 2 3 最小的顺子
    p.isSpecial = function (list) {
        var length = list.length;
        if (list[0].grade == 14 && list[length - 1].grade == 2) {
            for (var i = 1; i < list.length - 1; i++) {
                if (list[i].grade != list[i + 1].grade + 1) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };
    return LianshunRule;
}(BaseRule));
egret.registerClass(LianshunRule,'LianshunRule');

/**
 * Created by yang on 2017/6/22.
 */
var QinglianshunRule = (function (_super) {
    __extends(QinglianshunRule, _super);
    function QinglianshunRule() {
        _super.apply(this, arguments);
        this._rule = new LianshunRule();
        this.type = RuleType.Qinglianshun;
    }
    var d = __define,c=QinglianshunRule,p=c.prototype;
    p.verify = function (list) {
        if (!this._rule.verify(list)) {
            return false;
        }
        var map = this.getLists(list);
        var kingList = map.king;
        var normalList = map.normal;
        for (var i = 0; i < normalList.length - 1; i++) {
            if (normalList[i].type != normalList[i + 1].type) {
                return false;
            }
        }
        for (var i = 0; i < kingList.length; i++) {
            if (kingList[i].color != normalList[0].color) {
                return false;
            }
        }
        return true;
    };
    return QinglianshunRule;
}(BaseRule));
egret.registerClass(QinglianshunRule,'QinglianshunRule');

/**
 * Created by yang on 2017/6/20.
 */
var QuanheiRule = (function (_super) {
    __extends(QuanheiRule, _super);
    function QuanheiRule() {
        _super.apply(this, arguments);
        this.type = RuleType.Quanhei;
    }
    var d = __define,c=QuanheiRule,p=c.prototype;
    p.verify = function (list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].color == 2) {
                return false;
            }
        }
        return true;
    };
    return QuanheiRule;
}(BaseRule));
egret.registerClass(QuanheiRule,'QuanheiRule');

/**
 * Created by yang on 2017/6/20.
 */
var QuanhongRule = (function (_super) {
    __extends(QuanhongRule, _super);
    function QuanhongRule() {
        _super.apply(this, arguments);
        this.type = RuleType.Quanhong;
    }
    var d = __define,c=QuanhongRule,p=c.prototype;
    p.verify = function (list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].color == 1) {
                return false;
            }
        }
        return true;
    };
    return QuanhongRule;
}(BaseRule));
egret.registerClass(QuanhongRule,'QuanhongRule');

/**
 * Created by yang on 2017/6/20.
 */
var QuansantiaoRule = (function (_super) {
    __extends(QuansantiaoRule, _super);
    function QuansantiaoRule() {
        _super.apply(this, arguments);
        this._rule = new SantiaoRule();
        this.type = RuleType.Sansantiao;
    }
    var d = __define,c=QuansantiaoRule,p=c.prototype;
    p.verify = function (list) {
        var data = meru.singleton(GameData);
        if (!this._rule.verify(data.list1)) {
            return false;
        }
        if (!this._rule.verify(data.list2)) {
            return false;
        }
        if (!this._rule.verify(data.list3)) {
            return false;
        }
        return true;
    };
    return QuansantiaoRule;
}(BaseRule));
egret.registerClass(QuansantiaoRule,'QuansantiaoRule');

/**
 * Created by yang on 2017/6/20.
 */
var SanqingRule = (function (_super) {
    __extends(SanqingRule, _super);
    function SanqingRule() {
        _super.apply(this, arguments);
        this._rule = new TonghuaRule();
        this.type = RuleType.Santonghua;
    }
    var d = __define,c=SanqingRule,p=c.prototype;
    p.verify = function (list) {
        var data = meru.singleton(GameData);
        if (!this._rule.verify(data.list1)) {
            return false;
        }
        if (!this._rule.verify(data.list2)) {
            return false;
        }
        if (!this._rule.verify(data.list3)) {
            return false;
        }
        return true;
    };
    return SanqingRule;
}(BaseRule));
egret.registerClass(SanqingRule,'SanqingRule');

/**
 * Created by yang on 2017/6/20.
 */
var SanshunqingRule = (function (_super) {
    __extends(SanshunqingRule, _super);
    function SanshunqingRule() {
        _super.apply(this, arguments);
        this._rule = new TonghuashunRule();
        this.type = RuleType.Sanqingshun;
    }
    var d = __define,c=SanshunqingRule,p=c.prototype;
    p.verify = function (list) {
        var data = meru.singleton(GameData);
        if (!this._rule.verify(data.list1)) {
            return false;
        }
        if (!this._rule.verify(data.list2)) {
            return false;
        }
        if (!this._rule.verify(data.list3)) {
            return false;
        }
        return true;
    };
    return SanshunqingRule;
}(BaseRule));
egret.registerClass(SanshunqingRule,'SanshunqingRule');

/**
 * Created by yang on 2017/6/20.
 */
var ShuangsantiaoRule = (function (_super) {
    __extends(ShuangsantiaoRule, _super);
    function ShuangsantiaoRule() {
        _super.apply(this, arguments);
        this._rule = new SantiaoRule();
        this.type = RuleType.Shuangsantiao;
    }
    var d = __define,c=ShuangsantiaoRule,p=c.prototype;
    p.verify = function (list) {
        var data = meru.singleton(GameData);
        if (!this._rule.verify(data.list2)) {
            return false;
        }
        if (!this._rule.verify(data.list3)) {
            return false;
        }
        return true;
    };
    return ShuangsantiaoRule;
}(BaseRule));
egret.registerClass(ShuangsantiaoRule,'ShuangsantiaoRule');

/**
 * Created by yang on 2017/6/20.
 */
var ShuangshunqingRule = (function (_super) {
    __extends(ShuangshunqingRule, _super);
    function ShuangshunqingRule() {
        _super.apply(this, arguments);
        this._rule = new TonghuashunRule();
        this.type = RuleType.Shuangqingshun;
    }
    var d = __define,c=ShuangshunqingRule,p=c.prototype;
    p.verify = function (list) {
        var data = meru.singleton(GameData);
        if (!this._rule.verify(data.list2)) {
            return false;
        }
        if (!this._rule.verify(data.list3)) {
            return false;
        }
        return true;
    };
    return ShuangshunqingRule;
}(BaseRule));
egret.registerClass(ShuangshunqingRule,'ShuangshunqingRule');

/**
 * Created by yang on 2017/6/20.
 */
var SigetouRule = (function (_super) {
    __extends(SigetouRule, _super);
    function SigetouRule() {
        _super.apply(this, arguments);
        this._rule = new SantiaoRule();
        this.type = RuleType.Sigetou;
    }
    var d = __define,c=SigetouRule,p=c.prototype;
    p.verify = function (list) {
        var data = meru.singleton(GameData);
        var santiao = this._rule.verify(data.list1) || this._rule.verify(data.list2) || this._rule.verify(data.list3);
        if (!santiao) {
            return false;
        }
        var map = {};
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (!map[item.grade]) {
                map[item.grade] = 0;
            }
            map[item.grade] += 1;
        }
        for (var key in map) {
            if (map[key] == 4) {
                return true;
            }
        }
        return false;
    };
    return SigetouRule;
}(BaseRule));
egret.registerClass(SigetouRule,'SigetouRule');

var Watcher = eui.Watcher;
/**
 * Created by yang on 17/1/7.
 */
function dependProperty(host, obj, chain, watchers) {
    if (chain === void 0) { chain = []; }
    if (watchers === void 0) { watchers = []; }
    var register = function (host, chain, dependProperty) {
        var w = eui.Binding.bindHandler(host, chain, function () {
            var obj = host;
            if (is.fun(dependProperty)) {
                dependProperty();
            }
            else {
                var pArr2 = dependProperty.split('.');
                var len2 = pArr2.length;
                if (pArr2.length > 1) {
                    var idx = 0;
                    while (obj && idx <= len2 - 2) {
                        obj = obj[pArr2[idx]];
                        idx++;
                    }
                }
                eui.PropertyEvent.dispatchPropertyEvent(obj, eui.PropertyEvent.PROPERTY_CHANGE, pArr2[len2 - 1]);
            }
        }, this);
        watchers.push(w);
    };
    for (var key in obj) {
        var val = obj[key];
        if (typeof (val) == 'string') {
            val = [val];
        }
        var newChain = chain.concat(key);
        if (Array.isArray(val)) {
            var len = val.length;
            while (len--) {
                register(host, newChain.concat([]), val[len]);
            }
        }
        else {
            dependProperty(host, val, newChain, watchers);
        }
    }
    return watchers;
}
var GameUtils = (function () {
    function GameUtils() {
    }
    var d = __define,c=GameUtils,p=c.prototype;
    GameUtils.isRelease = function () {
        return egret.getOption("gv") == "release" && egret.getOption("pf") != "bearjoy";
    };
    GameUtils.isIOS = function () {
        if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
            var ua = navigator.userAgent.toLowerCase();
            return ua.indexOf("windows") < 0 && (ua.indexOf("iphone") >= 0 || ua.indexOf("ipad") >= 0 || ua.indexOf("ipod") >= 0);
        }
        return false;
    };
    GameUtils.getMyPos = function () {
        var users = PRoom.getCache("rus");
        var myPos;
        for (var key in users) {
            if (users[key]["uId"] == PUser.getCache("i.id")) {
                myPos = parseInt(key);
                break;
            }
        }
        return myPos;
    };
    GameUtils.confirmed = function () {
        var rus = PRoom.getCache("rus");
        for (var key in rus) {
            if (rus[key]["uId"] == PUser.getCache("i.id")) {
                if (rus[key]["cm"] == 1) {
                    return true;
                }
            }
        }
        return false;
    };
    GameUtils.getWXName = function () {
        if (meru.getPlatform().name == Const.bengbu) {
            return "蚌埠软件";
        }
        else if (meru.getPlatform().name == Const.sange) {
            return "三哥游戏";
        }
        else if (meru.getPlatform().name == Const.guilin) {
            return "桂林棋牌屋";
        }
        else if (meru.getPlatform().name == Const.nanning) {
            return "老友玩";
        }
        else {
            return "柚子游玩";
        }
    };
    GameUtils.getWXNumber = function () {
        if (meru.getPlatform().name == Const.bengbu) {
            return "bbrj999";
        }
        else if (meru.getPlatform().name == Const.sange) {
            return "sggame666";
        }
        else if (meru.getPlatform().name == Const.guilin) {
            return "GLQP888";
        }
        else if (meru.getPlatform().name == Const.nanning) {
            return "LYW00008";
        }
        else {
            return "YZYW9898";
        }
    };
    GameUtils.isIOSApp = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match("gamecenter.ios.app")) {
            return true;
        }
        return false;
    };
    GameUtils.checkBox = function () {
        var confirm = false;
        var quit = false;
        var myPos = GameUtils.getMyPos();
        var info = PRoom.getCache("");
        var rus = PRoom.getCache("rus");
        var isLod = (rus[myPos]["ldo"] == 1);
        for (var key in rus) {
            if (rus[key]["uId"] == PUser.getCache("i.id")) {
                if (rus[key]["cm"] != 1 && PRoom.getCache("base")["st"] == Const.ROOM_STATUS_WAIT) {
                    confirm = true;
                }
            }
            if (rus[key].hasOwnProperty("qt") && rus[key]["qt"] != 0) {
                quit = true;
            }
        }
        if (quit) {
            if (!meru.UI.getComponent("EndRoomSkin")) {
                meru.UI.clearBox();
                meru.getData(QuitData).setRound(false);
            }
        }
        else if (confirm) {
            if (RoundMutation.showed) {
                return;
            }
            RoundOverView.register = true;
            if (!meru.UI.getComponent("GameOver")) {
                meru.UI.clearBox();
                if (info["base"]["rd"] < info["base"]["mrd"]) {
                    meru.UI.addBox(new RoundOverView()).setCompName("GameOver");
                }
                else {
                    meru.UI.addBox(new GameOverView()).setCompName("GameOver");
                }
            }
        }
    };
    GameUtils.replenish = function (str) {
        if (str.length == 1) {
            return "0" + str;
        }
        return str;
    };
    GameUtils.formatTime = function () {
        var date = new Date();
        var hour = date.getHours() + "";
        var min = date.getMinutes() + "";
        var sec = date.getSeconds() + "";
        return (this.replenish(hour) + ":" + this.replenish(min) + ":" + this.replenish(sec));
    };
    GameUtils.formatTime1 = function () {
        var date = new Date();
        var year = date.getFullYear() + "";
        var month = (date.getMonth() + 1) + "";
        var day = date.getDate() + "";
        return (this.replenish(year) + "." + this.replenish(month) + "." + this.replenish(day));
    };
    GameUtils.formatTime2 = function (t) {
        var date = new Date(t);
        var year = date.getFullYear() + "";
        var month = (date.getMonth() + 1) + "";
        var day = date.getDate() + "";
        var hour = date.getHours();
        var min = date.getMinutes();
        return (year + "-" + month + "-" + day + " " + this.replenish(hour + "") + ":" + this.replenish(min + ""));
    };
    GameUtils.formatTime3 = function (t) {
        var min = Math.floor(t / 60).toString();
        var sec = Math.floor(t % 60).toString();
        return (this.replenish(min) + ":" + this.replenish(sec));
    };
    GameUtils.getRealLength = function (str) {
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128)
                realLength += 1;
            else
                realLength += 2;
        }
        return realLength;
    };
    GameUtils.formatName = function (name, data) {
        if (name == "" && data && data["ezId"]) {
            return "id:" + data["ezId"];
        }
        var slice = false;
        while (GameUtils.getRealLength(name) > 10) {
            slice = true;
            name = name.slice(0, name.length - 1);
        }
        if (slice) {
            name += "..";
        }
        return name;
    };
    //癞子需要这张牌能组成最大的顺子
    GameUtils.needGrade = function (list) {
        var map = [
            [14, 13, 12],
            [13, 12, 11],
            [12, 11, 10],
            [11, 10, 9],
            [10, 9, 8],
            [9, 8, 7],
            [8, 7, 6],
            [7, 6, 5],
            [6, 5, 4],
            [5, 4, 3],
            [4, 3, 2],
            [14, 3, 2]
        ];
        var has = [list[0].grade, list[1].grade];
        for (var i = 0; i < map.length; i++) {
            var shunzi = map[i];
            var need = [];
            for (var j = 0; j < shunzi.length; j++) {
                if (has.indexOf(shunzi[j]) == -1) {
                    need.push(shunzi[j]);
                }
            }
            if (need.length == 1) {
                return need;
            }
        }
        return [];
    };
    return GameUtils;
}());
egret.registerClass(GameUtils,'GameUtils');

/**
 * Created by brucex on 16/7/10.
 */
var ListenerCallback = (function () {
    function ListenerCallback() {
    }
    var d = __define,c=ListenerCallback,p=c.prototype;
    p.reloadError = function (proxy) {
        console.log("reloadError");
        console.log(proxy);
    };
    p.doError = function (proxy) {
        if (Main.isLoading) {
            meru.setTimeout(this.doError, this, 1000, proxy);
            return;
        }
        var code = proxy.errorCode;
        if (code != 0) {
            var conf = RES.getRes("error_code_config_json");
            if (conf && conf[code]) {
                if (code > 200) {
                    var des = conf[code];
                    if (code == 206) {
                        var num = 1;
                        if (proxy.responseData["mp"]) {
                            num = proxy.responseData["mp"]["num"];
                        }
                        des = des.replace("{num}", num);
                    }
                    meru.UI.addGuide("TooltipSkin1").setData({ "tip": des });
                }
                else if (code == 5 || code == 7) {
                    var box = meru.UI.addBox("TooltipSkin1").setData({ "tip": proxy.responseData['msg'] || conf[code] });
                    box["closeBtn"].visible = false;
                }
                else {
                    meru.tooltip(conf[code] + ":" + code);
                }
            }
            else {
                meru.tooltip('有错误哦:' + code);
                if (code == 102) {
                    meru.singleton(SocketSynchronize).synchronize();
                }
            }
        }
        console.log("这是s不等于0");
        // console.log(proxy);
    };
    return ListenerCallback;
}());
egret.registerClass(ListenerCallback,'ListenerCallback',["andes.listener.IListenerCallback"]);

/**
 * Created by brucex on 16/6/23.
 */
var LoginCallback = (function () {
    function LoginCallback() {
    }
    var d = __define,c=LoginCallback,p=c.prototype;
    p.login = function (data) {
        meru.singleton(RuleCenter).initSocket();
        var conf = meru.getModelList(andes.login.ServerInfo)[0];
        andes.socket.GameWebSocket.run({ "host": conf.p.wsHost, "port": conf.p.wsPort });
        if (!Main.isLoading) {
            this.requestUserInfo();
        }
        else {
            meru.addNotification("resLoadDone", this.requestUserInfo, this);
        }
    };
    p.loginParams = function () {
        return {
            jd: LoginCallback.jingdu,
            wd: LoginCallback.weidu
        };
    };
    p.checkLogin = function () {
        meru.getPlatform().login();
    };
    p.requestUserInfo = function () {
        var _this = this;
        RankView.needRefresh = true;
        meru.multiRequest(PUser.getInfo(true), PRoom.getInfo(true), PChat.roomList(true), PFriend.getList(true)).then(function () {
            var ps = PUser.getCache('i.openStat');
            if (ps == 1) {
                meru.updateStatisticsEnable(true, true);
            }
            Stat.enterGame();
            meru.postNotification("removeLoadingView");
            meru.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                meru.singleton(SoundManager).playBMG();
            }, _this);
            var code = parseInt(egret.getOption("rcode"));
            var rvId = parseInt(egret.getOption("rvId"));
            var resultId = egret.getOption("resultId");
            if (PRoom.getCache("rId") > 0) {
                if (code > 0) {
                    if (code != PRoom.getCache("base")["code"]) {
                        Effect.showEffect();
                    }
                }
                console.log("进这个房间");
                meru.UI.runScene(new GameView());
                GameUtils.checkBox();
                return;
            }
            else {
                if (code > 0) {
                    meru.request(PRoom.joinOne(code)).then(function (e) {
                        meru.UI.runScene(new GameView());
                    }).otherwise(function (e) {
                        RankView.needRefresh = false;
                        meru.UI.runScene(new HomeLayer());
                        meru.postNotification("HOME.ACTIVITY");
                    });
                    return;
                }
                else if (rvId > 0) {
                    ReviewCodeView.auto = false;
                    meru.request(PRoom.getReplay(rvId)).then(function (data) {
                        if (data["est"] == 1) {
                            ReviewController.rpId = rvId;
                            ReviewController.setData(data);
                        }
                        else {
                            meru.setTimeout(function () {
                                meru.tooltip("录像丢失");
                            }, _this, 500);
                            RankView.needRefresh = false;
                            meru.UI.runScene(new HomeLayer());
                            meru.postNotification("HOME.ACTIVITY");
                        }
                    });
                    return;
                }
                else if (resultId) {
                    meru.request(PRoom.historySm(resultId)).then(function (data) {
                        if (data["est"] == 1) {
                            meru.UI.addGuide(new GameOverShare(data));
                        }
                        else {
                            meru.setTimeout(function () {
                                meru.tooltip("结算丢失");
                            }, _this, 500);
                        }
                    });
                }
            }
            RankView.needRefresh = false;
            meru.UI.runScene(new HomeLayer());
            meru.postNotification("HOME.ACTIVITY");
        });
    };
    LoginCallback.jingdu = null;
    LoginCallback.weidu = null;
    return LoginCallback;
}());
egret.registerClass(LoginCallback,'LoginCallback',["andes.login.ILoginCallback"]);

/**
 * Created by yang on 17/4/27.
 */
var PlatResource = (function () {
    function PlatResource() {
        this.chatMessage1 = {
            1: "快点儿啊，都等得我花儿都谢啦",
            2: "你的牌儿打得也太好啦",
            3: "不要吵了，专心玩游戏吧",
            4: "各位，不好意思，我得离开会儿",
            5: "不要走，决战到天亮啊"
        };
        this.chatMessage2 = {
            1: "快点啊，等得我都颠了",
            2: "你的牌打的也太牛鬼了吧",
            3: "没吵多，专心玩游戏得咩",
            4: "兄弟姐妹，没好意思，我挨离开一下",
            5: "没要走，搞到天亮克"
        };
        this._fangyan = false;
    }
    var d = __define,c=PlatResource,p=c.prototype;
    d(p, "message"
        ,function () {
            if (meru.getPlatform().name == Const.sange && this._fangyan) {
                return this.chatMessage2;
            }
            else {
                return this.chatMessage1;
            }
        }
    );
    p.preloadGroup = function () {
        if (GameUtils.isIOS()) {
            if (meru.getPlatform().name == Const.sange && this._fangyan) {
                return "preload2";
            }
            else {
                return "preload1";
            }
        }
        else {
            return "preload";
        }
    };
    p.soundRes = function (res) {
        if (meru.getPlatform().name == Const.sange && this._fangyan) {
            if (RES.hasRes("sg_" + res)) {
                return "sg_" + res;
            }
            else {
                return res;
            }
        }
        else {
            return res;
        }
    };
    return PlatResource;
}());
egret.registerClass(PlatResource,'PlatResource');

function _p_(moddo, p, mask, cache, dataMerge, delay) {
    if (mask === void 0) { mask = true; }
    if (cache === void 0) { cache = false; }
    if (dataMerge === void 0) { dataMerge = false; }
    if (delay === void 0) { delay = null; }
    return {
        moddo: moddo,
        params: p,
        mask: mask,
        cache: cache,
        dataMerge: dataMerge,
        delay: delay
    };
}
var PUser = {
    /*** 用户-用户信息 ***/
    getInfo: function (cache, mask, dataMerge, delay) {
        return _p_("User.getInfo", {}, mask, cache, dataMerge, delay);
    },
    getCache: function (path, defVal) {
        if (defVal === void 0) { defVal = null; }
        return meru.getCache(path, PUser.getInfo(), defVal);
    },
    isCache: function () {
        return meru.ProxyCache.isCache(PUser.getInfo());
    },
    /*** 用户-回家 ***/
    backHome: function (cache, mask, dataMerge, delay) {
        return _p_("User.backHome", {}, mask, cache, dataMerge, delay);
    }
};
var PRoom = {
    /*** 房间-基本信息 ***/
    getInfo: function (cache, mask, dataMerge, delay) {
        return _p_("Room.getInfo", {}, mask, cache, dataMerge, delay);
    },
    getCache: function (path, defVal) {
        if (defVal === void 0) { defVal = null; }
        return meru.getCache(path, PRoom.getInfo(), defVal);
    },
    isCache: function () {
        return meru.ProxyCache.isCache(PRoom.getInfo());
    },
    /*** 房间-创建 ***/
    createNew: function (rd, aa, scst, mpn, cache, mask, dataMerge, delay) {
        return _p_("Room.createNew", { rd: rd, aa: aa, scst: scst, mpn: mpn }, mask, cache, dataMerge, delay);
    },
    /*** 房间-创建空房间 ***/
    createEmpty: function (rd, scst, mpn, cache, mask, dataMerge, delay) {
        return _p_("Room.createEmpty", { rd: rd, scst: scst, mpn: mpn }, mask, cache, dataMerge, delay);
    },
    /*** 房间-加入 ***/
    joinOne: function (code, cache, mask, dataMerge, delay) {
        return _p_("Room.joinOne", { code: code }, mask, cache, dataMerge, delay);
    },
    /*** 房间-叫分 (-1, 1, 2, 3) ***/
    callScore: function (sc, cache, mask, dataMerge, delay) {
        return _p_("Room.callScore", { sc: sc }, mask, cache, dataMerge, delay);
    },
    /*** 房间-亮牌 (-3, 6) ***/
    brightBrand: function (sc, cache, mask, dataMerge, delay) {
        return _p_("Room.brightBrand", { sc: sc }, mask, cache, dataMerge, delay);
    },
    /*** 房间-抢地主[-1, 1] ***/
    robLandOwner: function (type, cache, mask, dataMerge, delay) {
        return _p_("Room.robLandOwner", { type: type }, mask, cache, dataMerge, delay);
    },
    /*** 房间-出牌 ***/
    playCard: function (card, cache, mask, dataMerge, delay) {
        return _p_("Room.playCard", { card: card }, mask, cache, dataMerge, delay);
    },
    /*** 房间-解散 ***/
    dissolve: function (cache, mask, dataMerge, delay) {
        return _p_("Room.dissolve", {}, mask, cache, dataMerge, delay);
    },
    /*** 房间-确认准备 ***/
    cmReady: function (cache, mask, dataMerge, delay) {
        return _p_("Room.cmReady", {}, mask, cache, dataMerge, delay);
    },
    /*** 房间-投票退出 ***/
    quit: function (type, cache, mask, dataMerge, delay) {
        return _p_("Room.quit", { type: type }, mask, cache, dataMerge, delay);
    },
    /*** 房间-未满退出 ***/
    leave: function (cache, mask, dataMerge, delay) {
        return _p_("Room.leave", {}, mask, cache, dataMerge, delay);
    },
    /*** 房间-历史列表 ***/
    historyList: function (cache, mask, dataMerge, delay) {
        return _p_("Room.historyList", {}, mask, cache, dataMerge, delay);
    },
    /*** 房间-录像 ***/
    getReplay: function (rplId, cache, mask, dataMerge, delay) {
        return _p_("Room.getReplay", { rplId: rplId }, mask, cache, dataMerge, delay);
    },
    /*** 房间-历史单轮战绩 ***/
    historySm: function (resultId, cache, mask, dataMerge, delay) {
        return _p_("Room.historySm", { resultId: resultId }, mask, cache, dataMerge, delay);
    },
    /*** 房间-刷新位置信息 ***/
    refreshAddress: function (cache, mask, dataMerge, delay) {
        return _p_("Room.refreshAddress", {}, mask, cache, dataMerge, delay);
    },
    /*** 房间-投降申请 ***/
    surrender: function (cache, mask, dataMerge, delay) {
        return _p_("Room.surrender", {}, mask, cache, dataMerge, delay);
    },
    /*** 房间-战绩 ***/
    roundResults: function (rId, cache, mask, dataMerge, delay) {
        return _p_("Room.roundResults", { rId: rId }, mask, cache, dataMerge, delay);
    },
    /*** 房间-代开列表 ***/
    getHelpList: function (cache, mask, dataMerge, delay) {
        return _p_("Room.getHelpList", {}, mask, cache, dataMerge, delay);
    }
};
var PChat = {
    /*** 聊天-房间记录 ***/
    roomList: function (cache, mask, dataMerge, delay) {
        return _p_("Chat.roomList", {}, mask, cache, dataMerge, delay);
    },
    /*** 聊天-房间说话 ***/
    roomSay: function (type, ct, drn, toId, cache, mask, dataMerge, delay) {
        return _p_("Chat.roomSay", { type: type, ct: ct, drn: drn, toId: toId }, mask, cache, dataMerge, delay);
    }
};
var PInvite = {
    /*** 邀请-信息 ***/
    getInfo: function (cache, mask, dataMerge, delay) {
        return _p_("Invite.getInfo", {}, mask, cache, dataMerge, delay);
    },
    getCache: function (path, defVal) {
        if (defVal === void 0) { defVal = null; }
        return meru.getCache(path, PInvite.getInfo(), defVal);
    },
    isCache: function () {
        return meru.ProxyCache.isCache(PInvite.getInfo());
    },
    /*** 邀请-输入邀请人领奖 ***/
    getSelfAward: function (invId, cache, mask, dataMerge, delay) {
        return _p_("Invite.getSelfAward", { invId: invId }, mask, cache, dataMerge, delay);
    }
};
var PFriend = {
    /*** 好友-列表 ***/
    getList: function (cache, mask, dataMerge, delay) {
        return _p_("Friend.getList", {}, mask, cache, dataMerge, delay);
    },
    getCache: function (path, defVal) {
        if (defVal === void 0) { defVal = null; }
        return meru.getCache(path, PFriend.getList(), defVal);
    },
    isCache: function () {
        return meru.ProxyCache.isCache(PFriend.getList());
    }
};
var PMail = {
    /*** 邮件-列表 ***/
    getList: function (cache, mask, dataMerge, delay) {
        return _p_("Mail.getList", {}, mask, cache, dataMerge, delay);
    },
    getCache: function (path, defVal) {
        if (defVal === void 0) { defVal = null; }
        return meru.getCache(path, PMail.getList(), defVal);
    },
    isCache: function () {
        return meru.ProxyCache.isCache(PMail.getList());
    },
    /*** 邮件-领奖 ***/
    award: function (mId, cache, mask, dataMerge, delay) {
        return _p_("Mail.award", { mId: mId }, mask, cache, dataMerge, delay);
    },
    /*** 邮件-领取全部 ***/
    awardAll: function (cache, mask, dataMerge, delay) {
        return _p_("Mail.awardAll", {}, mask, cache, dataMerge, delay);
    }
};

/**
 * Created by yang on 17/2/3.
 */
var ReportError = (function () {
    function ReportError() {
    }
    var d = __define,c=ReportError,p=c.prototype;
    p.init = function () {
        if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
            window.onerror = function (a, b, c) {
                var str = a + b + c;
                if (ReportError._msgCache.indexOf(str) == -1) {
                    ReportError._msgCache.push(str);
                }
            };
        }
    };
    p.socketError = function (t) {
        //上传err
    };
    ReportError._msgCache = [];
    return ReportError;
}());
egret.registerClass(ReportError,'ReportError');

//主界面分享是邀请好友
//牌桌界面是分享房间
var ShareListener = (function () {
    function ShareListener() {
    }
    var d = __define,c=ShareListener,p=c.prototype;
    p.roomShare = function (phase) {
        console.log("create share:" + phase);
        if (GameUtils.isIOSApp() && phase == "init") {
            return;
        }
        var shareInfo = PUser.getCache("i.shareInfo");
        var base = PRoom.getCache("base");
        var code = -1;
        var img = PUser.getCache("i.pic");
        if (img == 1) {
            img = shareInfo["img_url"];
        }
        var des = shareInfo["description"];
        var url = shareInfo["url"];
        var title = PUser.getCache("i.nNa") + " 邀请你加入" + shareInfo["title"];
        var join = "";
        if (url.indexOf("?") > -1) {
            join = "&";
        }
        else {
            join = "?";
        }
        if (base) {
            code = base["code"];
            des = "自己人才懂的玩法，熟人线上约打！房间号:" + code;
            var rule1 = meru.singleton(GameData).hasRule(Const.SETTING_NORMAL);
            var rule2 = meru.singleton(GameData).hasRule(Const.SETTING_NO_SMALL);
            var rule3 = meru.singleton(GameData).hasRule(Const.SETTING_KING);
            var rule4 = meru.singleton(GameData).hasRule(Const.SETTING_SPECIAL);
            if (rule1) {
                des += " 普通模式";
            }
            else if (rule2) {
                des += " 去小牌";
            }
            else if (rule3) {
                des += " 有大小王";
            }
            if (rule4) {
                des += "特殊牌算分";
            }
            if (base["aa"] == 1) {
                des += "【AA局】";
            }
            url += (join + "rcode=" + code + "&sharefrom=" + PUser.getCache("i.ezId") + "&type=room");
        }
        else {
            url += (join + "sharefrom=" + PUser.getCache("i.ezId") + "&type=friend");
        }
        if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
            url += "&runtime=native";
        }
        var dataObj = {};
        dataObj["title"] = title;
        dataObj["desc"] = des;
        dataObj["imgUrl"] = img;
        dataObj["link"] = url;
        dataObj["type"] = "appMessage";
        if (GameUtils.isIOSApp()) {
            dataObj["ios"] = 1;
        }
        if (GameUtils.isRelease()) {
            OpenSdk.share(dataObj, function () {
                //分享成功
                meru.tooltip("分享成功");
            }, this);
        }
    };
    p.friendShare = function (phase) {
        console.log("friend share:" + phase);
        if (GameUtils.isIOSApp() && phase == "init") {
            return;
        }
        var shareInfo = PUser.getCache("i.shareInfo");
        var img = PUser.getCache("i.pic");
        if (img == 1) {
            img = shareInfo["img_url"];
        }
        var url = shareInfo["url"];
        var code = PUser.getCache("i.ezId");
        var des = ("自己人才懂的玩法，熟人线上约打！快来加我好友！我的ID:" + code);
        var join = "";
        if (url.indexOf("?") > -1) {
            join = "&";
        }
        else {
            join = "?";
        }
        url += (join + "sharefrom=" + code + "&type=friend");
        if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
            url += "&runtime=native";
        }
        var dataObj = {};
        dataObj["title"] = shareInfo["title"];
        dataObj["desc"] = des;
        dataObj["imgUrl"] = img;
        dataObj["link"] = url;
        dataObj["type"] = "appMessage";
        if (GameUtils.isIOSApp()) {
            dataObj["ios"] = 1;
        }
        if (GameUtils.isRelease()) {
            OpenSdk.share(dataObj, function () {
                //分享成功
                meru.tooltip("分享成功");
            }, this);
        }
    };
    p.reviewShare = function (phase, code, name, img) {
        console.log("review share:" + phase);
        if (GameUtils.isIOSApp() && phase == "init") {
            return;
        }
        var shareInfo = PUser.getCache("i.shareInfo");
        if (img == 1) {
            img = shareInfo["img_url"];
        }
        var url = shareInfo["url"];
        var title = name + " " + shareInfo["title"] + "的回放";
        var des = ("自己人才懂的玩法，看 " + name + " 如何虐杀四方！录像ID:" + code);
        var join = "";
        if (url.indexOf("?") > -1) {
            join = "&";
        }
        else {
            join = "?";
        }
        url += (join + "rvId=" + code + "&sharefrom=" + PUser.getCache("i.ezId") + "&type=review");
        if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
            url += "&runtime=native";
        }
        var dataObj = {};
        dataObj["title"] = title;
        dataObj["desc"] = des;
        dataObj["imgUrl"] = img;
        dataObj["link"] = url;
        dataObj["type"] = "appMessage";
        if (GameUtils.isIOSApp()) {
            dataObj["ios"] = 1;
        }
        if (GameUtils.isRelease()) {
            OpenSdk.share(dataObj, function () {
                //分享成功
                meru.tooltip("分享成功");
            }, this);
        }
    };
    p.resultShare = function (phase, code) {
        console.log("review share:" + phase);
        if (GameUtils.isIOSApp() && phase == "init") {
            return;
        }
        var shareInfo = PUser.getCache("i.shareInfo");
        var img = shareInfo["img_url"];
        var url = shareInfo["url"];
        var title = PUser.getCache("i.nNa") + " " + shareInfo["title"] + "的结算";
        var des = (PUser.getCache("i.nNa") + " 的牌局已经结束，点击查看积分详情");
        var join = "";
        if (url.indexOf("?") > -1) {
            join = "&";
        }
        else {
            join = "?";
        }
        url += (join + "resultId=" + code + "&sharefrom=" + PUser.getCache("i.ezId") + "&type=result");
        if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
            url += "&runtime=native";
        }
        var dataObj = {};
        dataObj["title"] = title;
        dataObj["desc"] = des;
        dataObj["imgUrl"] = img;
        dataObj["link"] = url;
        dataObj["type"] = "appMessage";
        if (GameUtils.isIOSApp()) {
            dataObj["ios"] = 1;
        }
        if (GameUtils.isRelease()) {
            OpenSdk.share(dataObj, function () {
                //分享成功
                meru.tooltip("分享成功");
            }, this);
        }
    };
    p.createShare = function (phase, data) {
        console.log("create share:" + phase);
        if (GameUtils.isIOSApp() && phase == "init") {
            return;
        }
        var shareInfo = PUser.getCache("i.shareInfo");
        var img = shareInfo["img_url"];
        var url = shareInfo["url"];
        var title = PUser.getCache("i.nNa") + " 邀请你加入" + shareInfo["title"];
        var des = shareInfo["description"];
        var code = -1;
        if (data) {
            code = data["code"];
            des = "自己人才懂的玩法，熟人线上约打！房间号:" + code;
            des += "【AA局】";
            var join = "";
            if (url.indexOf("?") > -1) {
                join = "&";
            }
            else {
                join = "?";
            }
            url += (join + "rcode=" + code + "&sharefrom=" + PUser.getCache("i.ezId") + "&type=room");
            if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
                url += "&runtime=native";
            }
        }
        var dataObj = {};
        dataObj["title"] = title;
        dataObj["desc"] = des;
        dataObj["imgUrl"] = img;
        dataObj["link"] = url;
        dataObj["type"] = "appMessage";
        if (GameUtils.isIOSApp()) {
            dataObj["ios"] = 1;
        }
        if (GameUtils.isRelease()) {
            OpenSdk.share(dataObj, function () {
                //分享成功
                meru.tooltip("分享成功");
            }, this);
        }
    };
    return ShareListener;
}());
egret.registerClass(ShareListener,'ShareListener');

/**
 * Created by brucex on 2016/11/17.
 */
var SocketCallback = (function () {
    function SocketCallback() {
        this._isReconnect = false;
    }
    var d = __define,c=SocketCallback,p=c.prototype;
    p.analysis = function (data) {
        console.log('Callback.analysis');
        if (is.array(data)) {
            for (var i = 0; i < data.length; i++) {
                var dataObj = data[i];
                this.analysisItem(dataObj);
            }
        }
        else {
            this.analysisItem(data);
        }
    };
    p.analysisItem = function (dataObj) {
        console.log(dataObj);
        meru.singleton(RuleCenter).analysis.analysisItem(dataObj);
    };
    p.onAdd = function (data) {
        // meru.tooltip("onAdd");
        console.log("%c onAdd:" + JSON.stringify(data), "color: #FF0000");
        meru.singleton(RuleCenter).analysis.onAdd({ "d": data["rus"], "sc": data["sc"] });
    };
    p.onClose = function () {
        console.log('Callback.onClose');
        // meru.tooltip("Callback.onClose");
        this._isReconnect = true;
    };
    p.onConnect = function () {
        console.log('Callback.onConnect');
        // meru.tooltip("Callback.onConnect");
        if (this._isReconnect) {
            meru.singleton(RuleCenter).analysis.reconnect();
        }
    };
    p.speedChange = function (ms) {
        meru.singleton(RuleCenter).analysis["speedChange"](ms);
    };
    p.onError = function (errData, t) {
        console.log('Callback.onError');
        // meru.tooltip("Callback.onError:"+t);
        console.log(errData);
        this._isReconnect = true;
        meru.singleton(ReportError).socketError(t);
    };
    p.onHeartBeat = function (data) {
        Stat.heartBeat();
    };
    return SocketCallback;
}());
egret.registerClass(SocketCallback,'SocketCallback',["andes.socket.ISocketCallback"]);

/**
 * Created by yang on 16/12/23.
 */
var SoundManager = (function () {
    function SoundManager() {
        this.volume = 0.07;
        this._lastMusic = "";
        if (!meru.localStorage.getItem("music")) {
            this.switchMusic(false);
        }
        if (!meru.localStorage.getItem("effect")) {
            this.switchEffect();
        }
        egret.MainContext.instance.stage.addEventListener(egret.Event.DEACTIVATE, this.onBlur, this);
        egret.MainContext.instance.stage.addEventListener(egret.Event.ACTIVATE, this.onFocus, this);
    }
    var d = __define,c=SoundManager,p=c.prototype;
    p.onBlur = function () {
        this.pauseBGM();
    };
    p.onFocus = function () {
        this.resumeBGM();
    };
    p.isMusicOpen = function () {
        return meru.localStorage.getItem("music") == "1";
    };
    p.isEffectOpen = function () {
        return meru.localStorage.getItem("effect") == "1";
    };
    p.switchMusic = function (user) {
        if (user === void 0) { user = true; }
        if (this.isMusicOpen()) {
            meru.localStorage.setItem("music", "2");
        }
        else {
            meru.localStorage.setItem("music", "1");
        }
        if (!user) {
            return;
        }
        if (this.isMusicOpen()) {
            this.playMusic();
        }
        else {
            this.dispose1();
        }
    };
    p.switchEffect = function () {
        if (this.isEffectOpen()) {
            meru.localStorage.setItem("effect", "2");
        }
        else {
            meru.localStorage.setItem("effect", "1");
        }
    };
    p.playBGM1 = function () {
        if (this._lastMusic == "music_bg_home_mp3") {
            return;
        }
        this._lastMusic = "music_bg_home_mp3";
        this.dispose1();
        this.playMusic();
    };
    p.playBMG = function () {
        if (this._lastMusic == "") {
            if (meru.UI.getScene().skinName == "MainSkin") {
                this.playBGM2();
            }
            else {
                this.playBGM1();
            }
        }
    };
    p.getLaseBMG = function () {
        return this._lastMusic;
    };
    p.pauseBGM = function () {
        if (this.isMusicOpen()) {
            if (this._soundChannel && !this._soundChannel["isStopped"]) {
                this._soundChannel.volume = 0;
            }
        }
    };
    p.resumeBGM = function () {
        if (this.isMusicOpen()) {
            if (this._soundChannel && !this._soundChannel["isStopped"]) {
                this._soundChannel.volume = this.volume;
            }
        }
    };
    p.dispose1 = function () {
        if (this._soundChannel) {
            this._soundChannel.stop();
            this._soundChannel = null;
        }
        if (this._sound) {
            this._sound.removeEventListener(egret.Event.COMPLETE, this.soundLoaded, this);
        }
    };
    p.dispose2 = function () {
        if (this._effectChannel) {
            this._effectChannel.stop();
        }
    };
    p.playBGM2 = function () {
        if (this._lastMusic == "music_bg_game_mp3") {
            return;
        }
        this._lastMusic = "music_bg_game_mp3";
        this.dispose1();
        this.playMusic();
    };
    p.playWin = function () {
        if (this._lastMusic == "win_mp3") {
            return;
        }
        this._lastMusic = "win_mp3";
        this.dispose1();
        this.playMusic();
    };
    p.playLose = function () {
        if (this._lastMusic == "lose_mp3") {
            return;
        }
        this._lastMusic = "lose_mp3";
        this.dispose1();
        this.playMusic();
    };
    p.playOver = function () {
        if (this._lastMusic == "over_mp3") {
            return;
        }
        this._lastMusic = "over_mp3";
        this.dispose1();
        this.playMusic();
    };
    p.playMusic = function () {
        if (!this.isMusicOpen()) {
            return;
        }
        if (GameUtils.isIOS()) {
            this.soundLoaded();
        }
        else {
            RES.getResAsync(this._lastMusic, this.soundLoaded, this);
        }
    };
    p.soundLoaded = function () {
        if (!this.isMusicOpen()) {
            return;
        }
        this._sound = RES.getRes(this._lastMusic);
        this._sound.type = egret.Sound.MUSIC;
        if (this._lastMusic.indexOf("music_bg") > -1) {
            this._soundChannel = this._sound.play(0, -1);
        }
        else {
            this._soundChannel = this._sound.play(0, 1);
        }
        this._soundChannel.volume = this.volume;
    };
    p.startEffect = function () {
        this.playEffect("start_mp3");
    };
    p.playEffect = function (res) {
        if (!this.isEffectOpen()) {
            return;
        }
        res = meru.singleton(PlatResource).soundRes(res);
        if (GameUtils.isIOS()) {
            var effect = RES.getRes(res);
            effect.type = egret.Sound.EFFECT;
            var channel = effect.play(0, 1);
            channel.volume = this.volume + 0.1;
        }
        else {
            RES.getResAsync(res, function () {
                var effect = RES.getRes(res);
                effect.type = egret.Sound.EFFECT;
                var channel = effect.play(0, 1);
                channel.volume = this.volume + 0.1;
            }, this);
        }
    };
    return SoundManager;
}());
egret.registerClass(SoundManager,'SoundManager');


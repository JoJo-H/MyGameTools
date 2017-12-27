declare class AssetAdapter implements eui.IAssetAdapter {
    /**
     * @language zh_CN
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
     */
    getAsset(source: string, compFunc: Function, thisObject: any): void;
}
declare class LoadingUI extends egret.Sprite {
    constructor();
    private textField;
    private createView();
    setProgress(current: number, total: number): void;
}
declare class Main extends eui.UILayer {
    /**
     * 加载进度界面
     * loading process interface
     */
    private loadingView;
    static isLoading: boolean;
    protected createChildren(): void;
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private onConfigComplete(event);
    private isThemeLoadEnd;
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the
     */
    private onThemeLoadComplete();
    private isResourceLoadEnd;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event);
    private createScene();
    private getPreloadGroup();
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event);
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private onResourceLoadError(event);
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(event);
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected startCreateScene(): void;
    private doLogin();
}
declare class ThemeAdapter implements eui.IThemeAdapter {
    /**
     * 解析主题
     * @param url 待解析的主题url
     * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
     * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject 回调的this引用
     */
    getTheme(url: string, compFunc: Function, errorFunc: Function, thisObject: any): void;
}
/**
 * Created by yang on 16/12/13.
 */
declare class CardData {
    private _data;
    constructor(data: any);
    data: any;
    type: number;
    grade: number;
    singleGrade: number;
    color: number;
    isJoker: boolean;
    notJoker: boolean;
    isBack: boolean;
    isCard: boolean;
}
/**
 * Created by yang on 16/12/16.
 */
declare class Const {
    static ROOM_STATUS_FREE: number;
    static ROOM_STATUS_PLAYING: number;
    static ROOM_STATUS_WAIT: number;
    static ONOFF: {};
    static afterFree(): number;
    static beforePlay(st: any): boolean;
    static SETTING_NORMAL: number;
    static SETTING_NO_SMALL: number;
    static SETTING_KING: number;
    static SETTING_SPECIAL: number;
    static SURRENDER_NORMAL: number;
    static SURRENDER_APPLY: number;
    static SURRENDER_AGREE: number;
    static SURRENDER_DISAGREE: number;
    static bengbu: string;
    static sange: string;
    static guilin: string;
    static nanning: string;
    static roundMap: {
        "1": number;
        "2": number;
        "3": number;
    };
}
declare class GameEvents {
    static STATUS_CHANGE: string;
    static DATA_CHANGE: string;
    static MY_DATA_CHANGE: string;
    static PASS_CHANGE: string;
    static SHOW_RECOMMEND: string;
    static HIDE_PLAYNODE: string;
    static HIDE_SHOWNODE: string;
    static HIDE_GRABNODE: string;
    static REFRESH_USER: string;
    static USER_CHAT: string;
    static CHAT_CHANGE: string;
    static CONTINUE_STATUS: string;
    static AUTO_SELECT: string;
}
declare class Effect {
    private static _pn;
    static register(pn: any): void;
    static show(data: any, container: eui.Group): void;
    static showEffect(): void;
}
declare class HeadLoader {
    private _img;
    private _url;
    private _loader;
    private _idx;
    constructor();
    init(img: eui.Image, url: any, idx: any): void;
    private startLoad();
    private onUrlLoaderHandler(e);
    private resourceLoadComplete(texture);
}
/**
 * Created by yang on 17/1/24.
 */
declare class Stat {
    static isOpen: boolean;
    static heartBeat(): void;
    static share(): void;
    static buy1(): void;
    static buy2(): void;
    static startLoad(): void;
    static endLoad(): void;
    static enterGame(): void;
}
/**
 * Created by yang on 17/1/11.
 */
declare class ActivityMutation extends meru.BaseMutation {
    init(): void;
    private invite(data, box);
    private award(data, box);
}
/**
 * Created by yang on 17/1/11.
 */
declare class ActivityView extends meru.BaseComponent {
    constructor();
    private _refreshed;
    onEnter(): void;
    private buildNormalTabItem(data);
    private initInfo();
    onExit(): void;
    awardTime: eui.Label;
    offerNode: eui.Group;
    inviteNode: eui.Group;
    inviteList: eui.List;
    pl1: eui.Label;
    pl2: eui.Label;
    pl3: eui.Label;
}
/**
 * Created by yang on 17/1/12.
 */
declare class InviteView extends meru.BaseComponent {
    constructor();
    onEnter(): void;
    onExit(): void;
    private initInfo();
    private onClose();
    bg: eui.Rect;
    pl1: eui.Label;
    pl2: eui.Label;
    pl3: eui.Label;
    gzh: eui.Label;
}
/**
 * Created by yang on 17/1/11.
 */
declare class UserHead extends meru.BaseComponent implements eui.IItemRenderer {
    selected: any;
    itemIndex: any;
    dataChanged(): void;
    head: eui.Image;
    loader: HeadLoader;
}
/**
 * Created by yang on 17/1/7.
 */
declare class ChatBubble extends meru.BaseComponent {
    private _data;
    private _timeId;
    private _list;
    refreshView(data: any): void;
    private showWordEffect(idx1, ct);
    private hideMe();
    voiceClick(): void;
    onEnter(): void;
    onExit(): void;
    label1: eui.Label;
    txtNode1: eui.Group;
    txtNode2: eui.Group;
    bq: eui.Group;
    bq2: eui.Image;
    voiceNode: eui.Group;
    voiceBtn: eui.Button;
    voiceLabel: eui.Label;
}
/**
 * Created by yang on 17/1/5.
 */
declare class ChatConst {
    static WORD: number;
    static EMOJI: number;
    static VOICE: number;
    static TYPING: number;
    static getEmojiDP(): eui.ArrayCollection;
    static getMessageDP(): eui.ArrayCollection;
    static getHistoryList(): any;
}
/**
 * Created by yang on 17/1/4.
 */
declare class ChatItem extends meru.BaseComponent implements eui.IItemRenderer {
    constructor();
    dataChanged(): void;
    onEnter(): void;
    onExit(): void;
    private getName();
    private voiceClick();
    nameLabel: eui.Label;
    txt: eui.Label;
    bq: eui.Image;
    voice: eui.Group;
    voiceLabel: eui.Label;
    voiceBtn: eui.Button;
    selected: any;
    itemIndex: any;
}
/**
 * Created by bruce on 2/14/17.
 */
declare class ChatMutation extends meru.BaseMutation {
    init(): void;
    dataChange(): void;
    private _historyList;
    historyList: eui.ArrayCollection;
    private _lastTabName;
    open(): void;
    createTabItem(label: any, skin: any, data: any): andes.operates.TabOperateInfo;
    typing(data: any, box: any): void;
    select(d: any): void;
}
/**
 * Created by yang on 17/1/5.
 */
declare class ChatView extends meru.BaseComponent {
    constructor();
    onEnter(): void;
    private onClose();
    onExit(): void;
    private buildNormalTabItem(data);
    private _change;
    private dataChange();
    private historyChange();
    private voice(data, ui, button);
    private chat(data, ui, button);
    private typing();
    private close();
    Scroller: eui.Scroller;
    bg: eui.Rect;
    input: eui.TextInput;
    chatView: eui.Group;
    historyView: eui.Group;
    tab: eui.TabBar;
    emojiList: eui.List;
    wordList: eui.List;
    historyList: eui.List;
}
/**
 * Created by yang on 17/1/5.
 */
declare class EmojiTemplate extends meru.BaseComponent implements eui.IItemRenderer {
    selected: any;
    itemIndex: any;
    constructor();
    dataChanged(): void;
    onExit(): void;
    bq: eui.Image;
    container: eui.Group;
}
/**
 * Created by yang on 17/1/9.
 */
declare class SocketSynchronize {
    private _timeId;
    private _chatPsid;
    register(psId: any): void;
    private timeOut();
    synchronize(cb?: any, ct?: any): void;
}
/**
 * Created by brucex on 2016/11/17.
 */
declare class SystemChatTip extends meru.BaseComponent {
    private _queue;
    private _showing;
    private _idx;
    private _autoHidden;
    autoHidden: boolean;
    private _animationType;
    animationType: string;
    constructor();
    private _isEnter;
    onEnter(): void;
    show(messages: any): void;
    check(): void;
    private getName(data);
    showTalk(): void;
    rightToLeft(group: egret.DisplayObject, maskObj: egret.DisplayObject, other: egret.DisplayObject): void;
    bottomToTop(group: egret.DisplayObject, maskObj: egret.DisplayObject, other: egret.DisplayObject): void;
    private static _marquee;
    static marquee: SystemChatTip;
}
/**
 * Created by yang on 16/12/13.
 */
declare class CardView extends meru.BaseComponent implements eui.IItemRenderer {
    private _select;
    constructor();
    choose(): boolean;
    selectChange(): void;
    setUnSelect(): void;
    private selectEffect();
    tap(): void;
    unTap(): void;
    isShowBack(): boolean;
    showBack(): void;
    hideBack(): void;
    selected: any;
    itemIndex: any;
    select: eui.Image;
    container: eui.Group;
    back: eui.Image;
}
declare class CommonMutation extends meru.BaseMutation {
    init(): void;
    netInfo(): void;
    removeBox(data: any, box: any): void;
}
declare class ConfirmView extends eui.Component {
    data: any;
}
declare enum NetworkQuality {
    none = 0,
    good = 1,
    average = 2,
    poor = 3,
}
declare class NetworkQualityView extends meru.BaseComponent {
    ms: any;
    onEnter(): void;
    updateText(quality: NetworkQuality, ms: string): void;
    speedChange(ms: any): void;
    onExit(): void;
}
/**
 * Created by yang on 2017/6/5.
 */
declare class RoomOption {
    getOption(box: any): {
        "rd": any;
        "scst": number;
        "p": number;
        "num": number;
    };
    getDefault(): {};
}
/**
 * Created by yang on 2017/6/17.
 */
declare class SpecialPointView extends meru.BaseComponent {
    refreshView(t: any, score: any): void;
    type: eui.Image;
    score: eui.BitmapLabel;
}
/**
 * Created by yang on 16/12/21.
 */
declare class CreateData extends meru.BaseData {
    init(): void;
    gc: string;
    test: boolean;
    other: boolean;
}
/**
 * Created by yang on 2017/6/5.
 */
declare class CreateForOtherView extends meru.BaseComponent {
    constructor();
    onEnter(): void;
    onExit(): void;
    private selectChange();
    people4: meru.RadioButton;
    check2: meru.RadioButton;
}
/**
 * Created by yang on 16/12/21.
 */
declare class CreateMutation extends meru.BaseMutation {
    init(): void;
    private share(data);
    private createForOthers();
    private roomList();
    private forOthers(data, box);
    private others();
    private back(data, box);
    private backBox(data, box);
    private enter(data, box);
}
/**
 * Created by yang on 17/2/27.
 */
declare class CreateView extends meru.BaseComponent {
    constructor();
    onEnter(): void;
    onExit(): void;
    private selectChange();
    people4: meru.RadioButton;
    check2: meru.RadioButton;
}
/**
 * Created by yang on 16/12/21.
 */
declare class EnterData extends meru.BaseData {
    test: boolean;
    init(): void;
    private _show;
    showLabel: string;
    reset(): void;
    back(): void;
    add(num: any): void;
}
/**
 * Created by yang on 16/12/21.
 */
declare class EnterMutation extends meru.BaseMutation {
    init(): void;
    private onDelete();
    private reset();
    private print(data, parent, button);
    private enter(data, box);
    private back(data, box);
}
/**
 * Created by yang on 16/12/21.
 */
declare class FriendData extends meru.BaseData {
    init(): void;
    list: any[];
}
/**
 * Created by yang on 16/12/21.
 */
declare class FriendMutation extends meru.BaseMutation {
}
/**
 * Created by yang on 16/12/29.
 */
declare class FriendView extends meru.BaseComponent {
    constructor();
    dailiBtn: eui.Button;
    inviteBtn: eui.Button;
    private group1;
    private group2;
    private invite;
    private daili;
    onEnter(): void;
    onExit(): void;
    private dailiClick();
    private inviteClick();
}
/**
 * Created by yang on 17/1/18.
 */
declare class ChooseRuleView extends meru.BaseComponent {
    bg: eui.Rect;
    constructor();
    onEnter(): void;
    private shezhiClick();
    private helpClick();
    private close();
    onExit(): void;
    shezhiBtn: eui.Button;
    bangzhuBtn: eui.Button;
}
/**
 * Created by yang on 16/12/13.
 */
declare class GameData {
    private _pailList;
    private _tripleList;
    private _boomList;
    private _straightList;
    private _myCards;
    ignore: boolean;
    myCard(): CardData[];
    private _list1;
    list1: any[];
    private _list2;
    list2: any[];
    private _list3;
    list3: any[];
    boomList(): any[];
    pailList(): any[];
    tripleList(): any[];
    straightList(): any[];
    reset(): void;
    myCardsChange(): void;
    getSortCard(str: any): any[];
    selectList: any[];
    selectChange(list: any): void;
    allSurrender(): boolean;
    canSurrender(): boolean;
    hasRule(t: any): boolean;
    getMaxNumber(): any;
}
/**
 * Created by yang on 16/12/12.
 */
declare class RuleCenter {
    private _curType;
    private _socket;
    private _ruleList;
    private _specialList;
    inject(rule: BaseRule): void;
    injectSpecial(rule: BaseRule): void;
    verify(list: any): BaseRule;
    getSpecial(): any[];
    initSocket(): void;
    init13zhang(): void;
    analysis: SocketInterface;
    dispose(): void;
}
/**
 * Created by yang on 16/12/15.
 */
declare class Recommend1 {
    private _recommendType;
    private _recommendIdx;
    private _recommends;
    private _done;
    private _tonghua;
    private _tonghuashun;
    private _shunzi;
    findRecommend(): void;
    private tonghuashun();
    private getLists();
    private tonghua();
    private recursive(list, num);
    private shunzi();
    private santiao();
    private duizi();
    private isSingle(card);
    private isPair(card);
    getRecommends(): {};
    doRecommend(t: any): void;
}
/**
 * Created by yang on 16/12/13.
 */
declare class GameMutation extends meru.BaseMutation {
    constructor();
    private rule();
    private chat();
    private back();
    private quit();
    private cancelSpecial(data, box);
    private confirmSpecial(data, box);
    private commit();
    private history();
    private realHistory();
}
/**
 * Created by yang on 16/12/14.
 */
declare class GameView extends meru.BaseComponent {
    constructor();
    private _pnMap;
    private _timeId;
    private _tickId;
    private _lastTurn;
    private _lastStatus;
    onEnter(): void;
    onExit(): void;
    private onTick();
    private baseDataChange();
    private refreshUserView();
    private refreshView();
    private backHomeVisible();
    private continueBtnChange(v);
    private onContinue();
    private backHome();
    backHomeBtn: eui.Button;
    continueBtn: eui.Button;
    inviteNode: eui.Group;
    backBtn: eui.Button;
    user0: UserView;
}
/**
 * Created by yang on 17/3/2.
 */
declare class HelpView extends meru.BaseComponent {
    constructor();
    onEnter(): void;
    private dataChange();
    onExit(): void;
    check1: eui.RadioButton;
    check2: eui.RadioButton;
}
/**
 * Created by yang on 17/1/5.
 */
declare class MyView extends meru.BaseComponent {
    private _list1;
    private _data1;
    private _beginX;
    private _beginY;
    private _selectList;
    private _beginCard;
    private gameData;
    constructor();
    onEnter(): void;
    private afterSynchronize();
    private surrenderVisible();
    private btnVisible();
    private dataChange();
    onExit(): void;
    private removeMe();
    private isTouchIn(x, y);
    private getList(list, idx1, idx2);
    private showSelectEffect();
    private selectChange();
    private doRecommend(list);
    private touchBegin(e);
    private touchMove(e);
    private touchEnd(e);
    private refreshMyView();
    private removeAllList();
    private cancel1();
    private cancel2();
    private cancel3();
    private autoClick();
    private partClick1();
    private partClick2();
    private partClick3();
    private refreshSpecial();
    private checkDone();
    xiList: eui.List;
    cardList1: eui.List;
    topList: eui.List;
    midList: eui.List;
    lastList: eui.List;
    topType: eui.Image;
    midType: eui.Image;
    lastType: eui.Image;
    part1Btn: eui.Image;
    part2Btn: eui.Image;
    part3Btn: eui.Image;
    topCancel: eui.Button;
    midCancel: eui.Button;
    lastCancel: eui.Button;
    commitBtn: eui.Button;
}
/**
 * Created by yang on 17/2/11.
 */
declare class SelectTab extends meru.BaseComponent {
    onEnter(): void;
    onExit(): void;
    reset(): void;
    private doRec2();
    private doRec3();
    private doRec4();
    private doRec5();
}
/**
 * Created by yang on 17/2/17.
 */
declare class ShowCardView extends meru.BaseComponent {
    refreshView(cards: any, idx: any, score: any): void;
    cardType: eui.Image;
    score: eui.BitmapLabel;
}
/**
 * Created by yang on 16/12/16.
 */
declare class UserView extends meru.BaseComponent {
    private _data;
    private _loader;
    private _idx;
    private _click;
    private _tempScore;
    constructor();
    onEnter(): void;
    onExit(): void;
    cardReview(): void;
    info(): void;
    refreshView(data: any, idx?: number): void;
    private refreshCardList();
    private refreshScore(txt, score);
    private refreshCurScore(score);
    private refreshHead();
    private _voiceTick;
    private _voiceTime;
    private voiceTick();
    private addVoiceTick();
    private removeVoiceTick();
    private chat(data);
    showScore(): void;
    private allShowBack();
    hideAll(surrender: any): void;
    showCards(idx: any, cards: any, score: any): void;
    scoreChange(score: any): void;
    showSpecial(t: any, score: any): void;
    private _mvList1;
    private _isDealing;
    playDealMovie(): void;
    private playMovie1(idx);
    point: eui.Group;
    voiceLabel: eui.BitmapLabel;
    offline: eui.Group;
    infoBtn: eui.Button;
    bubble: ChatBubble;
    baseContainer: eui.Group;
    head: eui.Image;
    curScore: eui.BitmapLabel;
    special: SpecialPointView;
    palyerName: eui.Label;
    score: eui.Label;
    cardList: eui.Group;
    arranging: eui.Group;
    headBg: eui.Image;
    ready: eui.Image;
    showCard: ShowCardView;
    dealNode: eui.Group;
}
/**
 * Created by yang on 17/1/9.
 */
declare class VoiceView extends meru.BaseComponent {
    voiceBtn: eui.Button;
    base: eui.Group;
    sendGroup: eui.Group;
    cancelGroup: eui.Group;
    private _mv;
    private _isSend;
    onEnter(): void;
    onExit(): void;
    private initVoice();
    private clearVoice();
    private touchBegin(e);
    private touchMove(e);
    private touchEnd(e);
    private afterStop();
    private uploadVoiceDone(id, time);
    private voiceRecordTimeOut();
}
/**
 * Created by yang on 17/2/13.
 */
declare class BaseStep {
    private _next;
    constructor(next?: BaseStep);
    getViewByUID(uid: any): any;
    getViewIdxByUID(uid: any): any;
    execute(): void;
    protected _isStop: boolean;
    stop(): void;
    protected _tickId: number;
    onTick(t?: number): void;
    onNext(): void;
}
/**
 * Created by yang on 17/2/20.
 */
declare class DealCard {
    execute(rus?: any): void;
    private step();
    static isDealing: boolean;
    getViewByUID(uid: any): any;
}
/**
 * Created by yang on 17/2/13.
 */
declare class ResultPlay {
    isPlaying: boolean;
    currentStep: BaseStep;
    private step1;
    private step2;
    private step3;
    private step4;
    private step5;
    curScore: number;
    curScoreList: any[];
    constructor();
    setData(): void;
    private start();
    stop(): void;
    playEnd(): void;
}
/**
 * Created by yang on 17/2/13.
 */
declare class Step1 extends BaseStep {
    execute(): void;
}
/**
 * Created by yang on 17/2/13.
 */
declare class Step2 extends BaseStep {
    protected stepIdx: number;
    execute(): void;
    private show();
    showEffect(view: any, cards: any, score: any): void;
}
/**
 * Created by yang on 17/2/13.
 */
declare class Step3 extends Step2 {
    protected stepIdx: number;
    showEffect(view: any, cards: any, score: any): void;
}
/**
 * Created by yang on 17/2/13.
 */
declare class Step4 extends Step2 {
    protected stepIdx: number;
    showEffect(view: any, cards: any, score: any): void;
}
/**
 * Created by yang on 2017/6/17.
 */
declare class Step5 extends BaseStep {
    execute(): void;
    private delay(view, t, score, delay);
}
/**
 * Created by yang on 17/1/28.
 */
declare class BuyCardGuide extends meru.BaseComponent {
    constructor();
    onEnter(): void;
    private initInfo();
    pl1: eui.Label;
    pl2: eui.BitmapLabel;
    bgTips: eui.Image;
    sgyx: eui.Image;
}
declare class HomeData extends meru.BaseData {
    init(): void;
    private _inited;
    initEvents(): void;
    newMail: any;
    notice: any;
    p: any;
    nNa: any;
    gc: string;
}
/**
 * Created by yang on 16/12/21.
 */
declare class HomeLayer extends meru.BaseComponent {
    constructor();
    private resize();
    onEnter(): void;
    onExit(): void;
    private _mv1;
    private _mv2;
    private _mv3;
    private _mv4;
    private _mv5;
    head: eui.Image;
    bottomNode: eui.Group;
    middleNode: eui.Group;
}
/**
 * Created by yang on 16/12/15.
 */
declare class HomeMutation extends meru.BaseMutation {
    private _lastRID;
    init(): void;
    private createRoom();
    private enterRoom();
    private share();
    private activity();
    private question();
    private rule();
    private setting();
    private review();
    private recharge();
}
/**
 * Created by yang on 17/1/4.
 */
declare class IdentifyMutation extends meru.BaseMutation {
    init(): void;
    private sure(data, box);
}
/**
 * Created by bruce on 1/28/17.
 */
declare class FaceButton extends meru.Button {
    icon: string;
}
/**
 * Created by bruce on 1/28/17.
 */
declare module qq {
    module maps {
        class LatLng {
            constructor(latitude: number, longitude: number);
        }
        module geometry {
            module spherical {
                function computeDistanceBetween(a: LatLng, b: LatLng): any;
            }
        }
    }
}
declare class InfoItemInfo extends egret.EventDispatcher {
    private _p;
    private _watch;
    constructor(obj: any);
    destory(): void;
    updateAds(): void;
    ads: any;
    p: any;
    showType(): void;
    isUnknow(obj: any): boolean;
    distance: any;
    nm: any;
    isFlag: boolean;
    toRad(d: any): number;
}
declare class InfoData extends meru.BaseData {
    constructor();
    static faceType: any;
    static lastUserData: any;
    static canRefresh(): boolean;
    static getFaceType(id: any): string;
}
import MovieClip = egret.MovieClip;
/**
 * Created by bruce on 1/28/17.
 */
declare class InfoMutation extends meru.BaseMutation {
    init(): void;
    faceAnim(obj: any): void;
    getViewByUID(uid: any): any;
    open(data: any): void;
    private getRusCollection(filterId);
    dynamicFace(data: any, host: any, btn: any, type: any): void;
}
/**
 * Created by yang on 17/1/12.
 */
declare class LoadingView extends meru.BaseComponent {
    constructor();
    onEnter(): void;
    setProgress(cur: any, total: any): void;
    private _mv;
    container: eui.Group;
    bar: eui.ProgressBar;
}
/**
 * Created by yang on 17/4/12.
 */
declare class MailData extends meru.BaseData {
    init(): void;
    private _source;
    list: eui.ArrayCollection;
    dataChange(): void;
    canAwd: boolean;
    canNotAwd: boolean;
}
/**
 * Created by yang on 17/4/12.
 */
declare class MailItem extends meru.ItemRenderer {
    dataChanged(): void;
}
/**
 * Created by yang on 17/4/12.
 */
declare class MailMutation extends meru.BaseMutation {
    init(): void;
    private open();
    private read(data);
    private awardAll();
    private award(data, ui);
}
/**
 * Created by yang on 17/1/7.
 */
declare class GameOverItem extends meru.ItemRenderer {
    dataChanged(): void;
    owner: eui.Image;
    head: eui.Image;
    nameLabel: eui.Label;
    maxScore: eui.Label;
    winLose: eui.Label;
    totalScore: eui.Label;
    icon: eui.Image;
    normal: eui.Image;
    me: eui.Image;
}
/**
 * Created by yang on 17/1/24.
 */
declare class GameOverShare extends meru.BaseComponent {
    private _data;
    constructor(data: any);
    onEnter(): void;
    onExit(): void;
    private close();
    list: eui.List;
    roomId: eui.Label;
    time: eui.Label;
    closeBtn: eui.Button;
}
/**
 * Created by yang on 17/1/24.
 */
declare class GameOverShareTipSkin extends meru.BaseComponent {
    constructor();
    onEnter(): void;
    onExit(): void;
    private initInfo();
    private onClose();
    bg: eui.Rect;
    pl1: eui.Label;
    pl2: eui.Label;
    pl3: eui.Label;
    gzh: eui.Label;
}
/**
 * Created by yang on 17/1/7.
 */
declare class GameOverView extends meru.BaseComponent {
    constructor();
    onEnter(): void;
    onExit(): void;
    private share();
    private close();
    list: eui.List;
    roomId: eui.Label;
    time: eui.Label;
    closeBtn: eui.Button;
    shareBtn: eui.Button;
}
/**
 * Created by yang on 16/12/21.
 */
declare class RoundMutation extends meru.BaseMutation {
    init(): void;
    private confirm(data, box);
    private check(data, box);
    static showed: boolean;
}
/**
 * Created by yang on 17/1/7.
 */
declare class RoundOverItem extends meru.ItemRenderer {
    dataChanged(): void;
    private _loader;
    list: eui.List;
    head: eui.Image;
    nameLabel: eui.Label;
    score: eui.Label;
}
declare class ScoreDetailItem extends meru.ItemRenderer {
    dataChanged(): void;
    txt: eui.Label;
}
/**
 * Created by yang on 17/1/7.
 */
declare class RoundOverView extends meru.BaseComponent {
    static register: boolean;
    private _d;
    constructor(d?: any);
    onEnter(): void;
    onExit(): void;
    private view();
    private goon();
    list: eui.List;
    viewBtn: eui.Button;
    goonBtn: eui.Button;
    bg: eui.Image;
    bg1: eui.Image;
}
/**
 * Created by yang on 16/12/21.
 */
declare class QuitData extends meru.BaseData {
    init(): void;
    private _isRound;
    setRound(v: any): void;
    roundOver: boolean;
    isQuit: boolean;
    notChoose: boolean;
    quitDataChange(): void;
    p: any;
}
/**
 * Created by yang on 16/12/21.
 */
declare class QuitMutation extends meru.BaseMutation {
    init(): void;
    private accept();
    private refuse();
    private over();
}
/**
 * Created by yang on 17/1/22.
 */
declare class QuitView extends meru.BaseComponent {
    constructor();
    private _timeRecorder;
    private _timeId;
    timeLabel: eui.Label;
    list: eui.List;
    onEnter(): void;
    private onTick();
    private refreshList();
    onExit(): void;
}
/**
 * Created by yang on 17/1/18.
 */
declare class RankData extends meru.BaseData {
    rank: any;
}
/**
 * Created by yang on 17/1/18.
 */
declare class RankItem extends meru.BaseComponent implements eui.IItemRenderer {
    selected: any;
    itemIndex: any;
    private _loader;
    constructor();
    dataChanged(): void;
    nameLabel: eui.Label;
    lastWeekLabel: eui.Label;
    maxLabel: eui.Label;
    rank: eui.Image;
    rankLabel: eui.Label;
    head: eui.Image;
}
/**
 * Created by yang on 17/1/18.
 */
declare class RankMutation extends meru.BaseMutation {
    init(): void;
    private help();
}
/**
 * Created by yang on 17/1/18.
 */
declare class RankView extends meru.BaseComponent {
    constructor();
    onEnter(): void;
    private refreshList();
    private refreshData();
    onExit(): void;
    static needRefresh: boolean;
    private _tab;
    private _curType;
    list: eui.List;
    myRank: eui.BitmapLabel;
}
/**
 * Created by yang on 17/1/12.
 */
declare class PaymentRefreshProxy {
    private _times;
    private _isDispose;
    private _time;
    private _timeId;
    constructor(time: number);
    start(): void;
    private startProxy();
    private onResponse(data);
    dispose(): void;
    private static _cur;
    static start(time: number): void;
}
/**
 * Created by yang on 17/1/11.
 */
declare class RechargeGuideData extends meru.BaseData {
    private _curPage;
    private _maxPage;
    init(): void;
    reset(): void;
    onLeft(): void;
    onRight(): void;
    dataChange(): void;
    not1: boolean;
    not4: boolean;
    is1: boolean;
    is2: boolean;
    is3: boolean;
    is4: boolean;
}
/**
 * Created by yang on 17/1/11.
 */
declare class RechargeGuideMutation extends meru.BaseMutation {
    init(): void;
    private left();
    private right();
}
/**
 * Created by yang on 17/1/12.
 */
declare class RechargeMutation extends meru.BaseMutation {
    init(): void;
    private recharge();
}
/**
 * Created by yang on 17/1/7.
 */
declare class HistoryItemView extends meru.BaseComponent implements eui.IItemRenderer {
    constructor();
    private _l;
    private _open;
    dataChanged(): void;
    onEnter(): void;
    onExit(): void;
    private showAll();
    private showSome();
    private detail();
    private showList();
    private check();
    private reviewClick();
    room: eui.Label;
    time: eui.Label;
    icon: eui.Image;
    checkBtn: eui.Button;
    reviewBtn: eui.Button;
    detailBtn: eui.Button;
    list: eui.List;
    selected: any;
    itemIndex: any;
}
declare class ItemRecordDetail1 extends meru.ItemRenderer {
    dataChanged(): void;
}
/**
 * Created by yang on 17/1/7.
 */
declare class HistoryRoundItemView extends meru.BaseComponent implements eui.IItemRenderer {
    constructor();
    onEnter(): void;
    onExit(): void;
    private detailClick();
    private _l;
    dataChanged(): void;
    private showList();
    private showAll();
    private showSome();
    private shareClick();
    detailBtn: eui.Button;
    xiangxiBtn: eui.Button;
    shareBtn: eui.Button;
    list: eui.List;
    selected: any;
    itemIndex: any;
}
declare class ItemRecordDetail2 extends meru.ItemRenderer {
    dataChanged(): void;
}
/**
 * Created by yang on 17/1/7.
 */
declare class HistoryRoundView extends meru.BaseComponent {
    static openMap: {};
    constructor(data: any);
    onEnter(): void;
    onExit(): void;
    private check();
    private close();
    topView: HistoryItemView;
    list: eui.List;
    backBtn: eui.Button;
}
/**
 * Created by yang on 17/1/7.
 */
declare class HistoryView extends meru.BaseComponent {
    static openMap: {};
    constructor();
    onEnter(): void;
    onExit(): void;
    private check();
    list: eui.List;
    checkBtn: eui.Button;
}
/**
 * Created by yang on 17/1/4.
 */
declare class Review extends meru.BaseComponent {
    constructor();
    private _pnMap;
    private _idx;
    private _max;
    onEnter(): void;
    onExit(): void;
    private prev();
    private next();
    private isOver();
    private baseInfo();
    private quit();
    private initPosition();
    private refreshView();
    private _myPos;
    rvId: eui.Label;
    quitBtn: eui.Button;
    preBtn: eui.Button;
    nextBtn: eui.Button;
}
/**
 * Created by yang on 17/1/14.
 */
declare class ReviewCodeView extends meru.BaseComponent {
    static auto: boolean;
    constructor();
    onEnter(): void;
    onExit(): void;
    private sure();
    sureBtn: eui.Button;
    input: eui.TextInput;
}
/**
 * Created by yang on 17/1/13.
 */
declare class ReviewController {
    static data: any;
    static rpId: number;
    static setData(data: any): void;
    static getName(pn: any): any;
    static getHead(pn: any): any;
    static getRole(pn: any): any;
    static curRule(): any[];
    static maxUser(): number;
}
/**
 * Created by yang on 17/1/4.
 */
declare class ReviewUserView extends meru.BaseComponent {
    private _data;
    private _loader;
    refreshView(data: any, idx: any): void;
    private refreshHead(pic, ldo);
    showResult(): void;
    private refreshScore(txt, score);
    headBg: eui.Image;
    head: eui.Image;
    palyerName: eui.Label;
    score: eui.Label;
    showCard: ShowCardView;
    curScore: eui.BitmapLabel;
    result: eui.Group;
}
/**
 * Created by yang on 2017/6/22.
 */
declare class PeopleRankItem extends meru.ItemRenderer {
    dataChanged(): void;
    private _loader;
    head: eui.Image;
}
/**
 * Created by yang on 2017/6/22.
 */
declare class RoundHistoryView extends meru.BaseComponent {
    constructor();
    onEnter(): void;
    onExit(): void;
    gList: eui.ArrayCollection;
    rList: eui.ArrayCollection;
    groupList: eui.List;
    rankList: eui.List;
}
/**
 * Created by yang on 2017/6/22.
 */
declare class RoundItem extends meru.BaseComponent implements eui.IItemRenderer {
    constructor();
    onEnter(): void;
    onExit(): void;
    private xiangxiClick();
    private detailClick();
    private _l;
    dataChanged(): void;
    private showList();
    private showAll();
    private showSome();
    detailBtn: eui.Button;
    xiangxiBtn: eui.Button;
    list: eui.List;
    selected: any;
    itemIndex: any;
}
/**
 * Created by yang on 17/1/6.
 */
declare class SettingView extends meru.BaseComponent {
    constructor();
    onEnter(): void;
    onExit(): void;
    private refreshView();
    private switchMusic();
    private switchEffect();
    musicOpen: eui.RadioButton;
    musicClose: eui.RadioButton;
    effectOpen: eui.RadioButton;
    effectClose: eui.RadioButton;
    music: eui.CheckBox;
}
/**
 * Created by yang on 17/1/5.
 */
declare class BaseVoice {
    init(): void;
    playList: any[];
    isPlaying: boolean;
    state: number;
    startTime: number;
    voiceTime: number;
    loadedList: VoiceData[];
    currentRecordId: any;
    currentDownloadId: any;
    getLocalId(serverId: any): any;
    startRecord(): void;
    protected startRecordCallBack(data: any): void;
    stopRecord(): void;
    protected stopRecordCallBack(mes: any): void;
    onVoiceRecordEnd(): void;
    protected onVoiceRecordEndCallBack(mes: any): void;
    uploadVoice(): void;
    protected uploadVoiceCallBack(mes: any): void;
    cleanRecord(): void;
    private alertFail(mes);
    downloadVoice(serverId: any): void;
    protected downloadVoiceCallBack(mes: any): void;
    playVoice(serverId: any): void;
    protected playVoiceCallBack(data: any): void;
    pauseVoice(serverId: any): void;
    protected pauseVoiceCallBack(): void;
    stopVoice(serverId: any): void;
    protected stopVoiceCallBack(): void;
}
declare class Voice {
    private static _voice;
    static getVoice(): BaseVoice;
}
declare class VoiceData {
    localId: any;
    serverId: any;
}
declare class VoiceEvent {
    static start(): void;
    static end(): void;
}
declare class VoiceState {
    static default: number;
    static starting: number;
    static recording: number;
    static stopping: number;
    static upLoading: number;
    static downLoading: number;
    static playing: number;
    static stopPlaying: number;
    static pausing: number;
}
/**
 * Created by yang on 17/1/5.
 */
declare class H5Voice extends BaseVoice {
    startRecord(): boolean;
    stopRecord(): void;
    onVoiceRecordEnd(): void;
    uploadVoice(): void;
    downloadVoice(serverId: any): void;
    playVoice(serverId: any): void;
    pauseVoice(serverId: any): void;
    stopVoice(serverId: any): void;
}
/**
 * Created by yang on 17/1/5.
 */
declare class NativeVoice extends BaseVoice {
}
/**
 * Created by yang on 16/12/21.
 */
declare class SocketAnalysis1 implements SocketInterface {
    constructor();
    private _lastMs;
    speedChange(ms: any): void;
    analysisItem(dataObj: any): void;
    private fixBug();
    private _auto;
    private autoTick();
    private _timeId;
    private register();
    private reload();
    private ignore(data);
    private isChat(data);
    onAdd(data: any): void;
    voiceChange(data: any): void;
    reconnect(): void;
    private afterSynchronize();
    cleanPushData(): void;
    private checkPush(data1);
    private checkPop();
    pushAll(): void;
    private pushData;
    beforeEnter: any[];
}
/**
 * Created by yang on 17/2/11.
 */
declare class BaseRule {
    type: number;
    isDao(list: any): boolean;
    verify(list: any): boolean;
    getLists(list: any): {
        "king": any[];
        "normal": any[];
    };
    level: number;
    compare(list1: any, list2: any): number;
}
/**
 * Created by yang on 17/2/11.
 */
declare class DuiziRule extends BaseRule implements RuleInterface {
    type: RuleType;
    source: string;
    private _list;
    verify(list: any): boolean;
    getDui(list: any): any;
    getDan(list: any): any[];
    compare(list1: any, list2: any): number;
    sound(list: any): string;
}
/**
 * Created by yang on 17/2/11.
 */
declare class SantiaoRule extends BaseRule implements RuleInterface {
    type: RuleType;
    source: string;
    private _list;
    verify(list: any): boolean;
    compare(list1: any, list2: any): number;
    sound(list: any): string;
}
/**
 * Created by yang on 16/12/12.
 */
declare class ShunziRule extends BaseRule implements RuleInterface {
    type: RuleType;
    source: string;
    private _list;
    verify(list: any): boolean;
    private isSpecial(list);
    private getRealList(list);
    compare(list1: any, list2: any): number;
    sound(list: any): string;
}
/**
 * Created by yang on 17/2/11.
 */
declare class TonghuaRule extends BaseRule implements RuleInterface {
    type: RuleType;
    source: string;
    private _list;
    verify(list: any): boolean;
    getRealList(list: any): any[];
    compare(list1: any, list2: any): number;
    sound(list: any): string;
}
/**
 * Created by yang on 17/2/11.
 */
declare class TonghuashunRule extends BaseRule implements RuleInterface {
    type: RuleType;
    source: string;
    private _rule;
    private _list;
    verify(list: any): boolean;
    compare(list1: any, list2: any): number;
    sound(list: any): string;
}
/**
 * Created by yang on 17/2/11.
 */
declare class WulongRule extends BaseRule implements RuleInterface {
    type: RuleType;
    source: string;
    private _list;
    verify(list: any): boolean;
    compare(list1: any, list2: any): number;
    sound(list: any): string;
}
/**
 * Created by yang on 16/12/12.
 */
interface RuleInterface {
    verify(list: any[]): boolean;
    compare(list1: any[], list2: any[]): number;
    level: number;
    type: RuleType;
    source: string;
    name?: string;
    movie?(): meru.Movie;
    pushMovie?(mv: meru.Movie): void;
    sound(list: any[]): string;
}
declare enum RuleType {
    Wulong = 0,
    Duizi = 1,
    Shunzi = 2,
    Tonghua = 3,
    Tonghuashun = 4,
    Santiao = 5,
    Tongguo = 100,
    Qinglianshun = 101,
    Quanshunzi = 102,
    Sansantiao = 103,
    Sigetou = 104,
    Santonghua = 105,
    Quanhei = 106,
    Quanhong = 107,
    Shuangqingshun = 108,
    Sanqingshun = 109,
    Shuangsantiao = 110,
}
declare var getRuleName: (type: any) => string;
/**
 * Created by yang on 16/12/21.
 */
interface SocketInterface {
    analysisItem(data: any): void;
    onAdd(data: any): void;
    reconnect(): void;
}
/**
 * Created by yang on 2017/6/22.
 */
declare class LianshunRule extends BaseRule {
    type: RuleType;
    verify(list: any): boolean;
    private test(list);
    private recursive(list, num);
    private isSpecial(list);
}
/**
 * Created by yang on 2017/6/22.
 */
declare class QinglianshunRule extends BaseRule {
    private _rule;
    type: RuleType;
    verify(list: any): boolean;
}
/**
 * Created by yang on 2017/6/20.
 */
declare class QuanheiRule extends BaseRule {
    type: RuleType;
    verify(list: any): boolean;
}
/**
 * Created by yang on 2017/6/20.
 */
declare class QuanhongRule extends BaseRule {
    type: RuleType;
    verify(list: any): boolean;
}
/**
 * Created by yang on 2017/6/20.
 */
declare class QuansantiaoRule extends BaseRule {
    private _rule;
    type: RuleType;
    verify(list: any): boolean;
}
/**
 * Created by yang on 2017/6/20.
 */
declare class SanqingRule extends BaseRule {
    private _rule;
    type: RuleType;
    verify(list: any): boolean;
}
/**
 * Created by yang on 2017/6/20.
 */
declare class SanshunqingRule extends BaseRule {
    private _rule;
    type: RuleType;
    verify(list: any): boolean;
}
/**
 * Created by yang on 2017/6/20.
 */
declare class ShuangsantiaoRule extends BaseRule {
    private _rule;
    type: RuleType;
    verify(list: any): boolean;
}
/**
 * Created by yang on 2017/6/20.
 */
declare class ShuangshunqingRule extends BaseRule {
    private _rule;
    type: RuleType;
    verify(list: any): boolean;
}
/**
 * Created by yang on 2017/6/20.
 */
declare class SigetouRule extends BaseRule {
    private _rule;
    type: RuleType;
    verify(list: any): boolean;
}
import Watcher = eui.Watcher;
/**
 * Created by yang on 17/1/7.
 */
declare function dependProperty(host: any, obj: any, chain?: any[], watchers?: Watcher[]): Watcher[];
declare class GameUtils {
    static isRelease(): boolean;
    static isIOS(): boolean;
    static getMyPos(): any;
    static confirmed(): boolean;
    static getWXName(): string;
    static getWXNumber(): string;
    static isIOSApp(): boolean;
    static checkBox(): void;
    static replenish(str: string): string;
    static formatTime(): string;
    static formatTime1(): string;
    static formatTime2(t: any): string;
    static formatTime3(t: any): string;
    static getRealLength(str: string): number;
    static formatName(name: any, data: any): any;
    static needGrade(list: any): any[];
}
import IListenerCallback = andes.listener.IListenerCallback;
/**
 * Created by brucex on 16/7/10.
 */
declare class ListenerCallback implements IListenerCallback {
    reloadError(proxy: meru.Proxy): void;
    doError(proxy: meru.Proxy): void;
}
/**
 * Created by brucex on 16/6/23.
 */
declare class LoginCallback implements andes.login.ILoginCallback {
    static jingdu: any;
    static weidu: any;
    login(data: any): void;
    loginParams(): any;
    checkLogin(): void;
    requestUserInfo(): void;
}
/**
 * Created by yang on 17/4/27.
 */
declare class PlatResource {
    private chatMessage1;
    private chatMessage2;
    private _fangyan;
    message: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
    };
    preloadGroup(): string;
    soundRes(res: any): any;
}
declare function _p_(moddo: any, p: any, mask?: boolean, cache?: boolean, dataMerge?: boolean, delay?: any): meru.ProxyInfo;
declare var PUser: {
    getInfo: (cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    getCache: (path: any, defVal?: any) => any;
    isCache: () => boolean;
    backHome: (cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
};
declare var PRoom: {
    getInfo: (cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    getCache: (path: any, defVal?: any) => any;
    isCache: () => boolean;
    createNew: (rd?: number, aa?: number, scst?: number, mpn?: number, cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    createEmpty: (rd?: number, scst?: number, mpn?: number, cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    joinOne: (code?: any, cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    callScore: (sc?: number, cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    brightBrand: (sc?: number, cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    robLandOwner: (type?: number, cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    playCard: (card?: any, cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    dissolve: (cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    cmReady: (cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    quit: (type?: number, cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    leave: (cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    historyList: (cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    getReplay: (rplId?: number, cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    historySm: (resultId?: any, cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    refreshAddress: (cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    surrender: (cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    roundResults: (rId?: number, cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    getHelpList: (cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
};
declare var PChat: {
    roomList: (cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    roomSay: (type?: number, ct?: any, drn?: number, toId?: any, cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
};
declare var PInvite: {
    getInfo: (cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    getCache: (path: any, defVal?: any) => any;
    isCache: () => boolean;
    getSelfAward: (invId?: any, cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
};
declare var PFriend: {
    getList: (cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    getCache: (path: any, defVal?: any) => any;
    isCache: () => boolean;
};
declare var PMail: {
    getList: (cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    getCache: (path: any, defVal?: any) => any;
    isCache: () => boolean;
    award: (mId?: number, cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
    awardAll: (cache?: boolean, mask?: boolean, dataMerge?: boolean, delay?: any) => meru.ProxyInfo;
};
/**
 * Created by yang on 17/2/3.
 */
declare class ReportError {
    private static _msgCache;
    init(): void;
    socketError(t: any): void;
}
/**
 * Created by yang on 17/1/6.
 */
declare type SharePhase = "init" | "share";
declare class ShareListener {
    roomShare(phase: SharePhase): void;
    friendShare(phase: SharePhase): void;
    reviewShare(phase: SharePhase, code: any, name: any, img: any): void;
    resultShare(phase: SharePhase, code: any): void;
    createShare(phase: SharePhase, data: any): void;
}
/**
 * Created by brucex on 2016/11/17.
 */
declare class SocketCallback implements andes.socket.ISocketCallback {
    private _isReconnect;
    analysis(data: any): void;
    analysisItem(dataObj: any): void;
    onAdd(data: any): void;
    onClose(): void;
    onConnect(): void;
    speedChange(ms: any): void;
    onError(errData: any, t: any): void;
    onHeartBeat(data: any): void;
}
/**
 * Created by yang on 16/12/23.
 */
declare class SoundManager {
    constructor();
    private volume;
    private onBlur();
    private onFocus();
    isMusicOpen(): boolean;
    isEffectOpen(): boolean;
    switchMusic(user?: boolean): void;
    switchEffect(): void;
    private _lastMusic;
    private _soundChannel;
    private _sound;
    private _effectChannel;
    private _effect;
    playBGM1(): void;
    playBMG(): void;
    getLaseBMG(): string;
    pauseBGM(): void;
    resumeBGM(): void;
    dispose1(): void;
    private dispose2();
    playBGM2(): void;
    playWin(): void;
    playLose(): void;
    playOver(): void;
    private playMusic();
    private soundLoaded();
    startEffect(): void;
    playEffect(res: any): void;
}

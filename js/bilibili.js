var msg = "点歌 魔都";
var second = 10;
var min_second = 10;
var timeout_id;
var isSign = false;
window.Notification.requestPermission();
var color = 16738408;
/**
 * 创建自动弹幕任务
 * @return {[type]} [description]
 */
var startSend = function() {
    msg = $("#musicname").val().charAt(0) == ">" ? $("#musicname").val().substr(1) : "点歌 " + $("#musicname").val();
    if (timeout_id) {
        showMsg("点歌插件已启动, 换歌名请先关闭插件.");
        return;
    }
    second = $("#second").val();
    second = !isNaN(second) && second < min_second ? min_second : second;
    showMsg("启动星痕点歌插件...点歌插件id为:" + timeout_id + ", 每隔" + second + "秒会发送一条点歌消息");
    sendMsg(msg);
    timeout_id = setInterval(function() {
        sendMsg(msg);
    }, second * 1000);
}

/**
 * 发送弹幕
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
var sendMsg = function(msg) {
    $.post("http://live.bilibili.com/msg/send", {
            color: color,
            fontsize: 25,
            mode: 1,
            msg: msg,
            rnd: new Date().getTime(),
            roomid: ROOMID
        }
    );
    showMsg("发送点歌<<" + msg + ">>消息成功. ");
}

/**
 * 关闭发弹幕任务
 * @return {[type]} [description]
 */
var closesend = function() {
    clearInterval(timeout_id);
    timeout_id = undefined;
    showMsg("点歌插件关闭.");
}

/**
 * 显示提示消息
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
var showMsg = function(msg) {
    var instance = new Notification("星痕点歌插件", {
        "body": msg,
        "icon": "http://static.hdslb.com/live-static/live-room/images/room-manage/loading.gif"
    });
    instance.onshow = function(event) {
        setTimeout(function() {
            instance.close();
        }, 3 * 1000);
    };
}

/**
 * 自动签到任务
 * @param {[type]} function( [description]
 */
var doSign = setInterval(function() {
    sign();
}, 60 * 1000);

/**
 * 签到
 * @return {[type]} [description]
 */
var sign = function() {
    if (!isSign) {
        $.post("http://live.bilibili.com/sign/doSign", function(data) {
            isSign = true;
            clearInterval(doSign);
        }, 'json');
    }
}

/**
 * 创建界面
 * @return {[type]} [description]
 */
var AddButton = function() {
    $("#profile-ctrl").append('<input id="musicname" placeholder="输入歌名" style="width:110px"/>');
    $("#profile-ctrl").append('<input id="second" type="number" style="width:35px" value="10" />');
    $("#profile-ctrl").append('<span id="startSend" onclick="startSend()" title="开启自动点歌" style="cursor: hand;margin: 5px;display: inline-block">√</span>');
    $("#profile-ctrl").append('<span id="closesend" onclick="closesend()" title="关闭自动点歌"  style="cursor: hand;margin: 5px;display: inline-block">×</span>');
}

// 初始化界面
AddButton();
// 签到
sign();

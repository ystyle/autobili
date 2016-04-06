var msg = "点歌 魔都";
var second = 10;
var timeout_id;
window.Notification.requestPermission();
var startSend = function(){
    msg = $("#musicname").val().charAt(0) == ">" ? $("#musicname").val().substr(1) : "点歌 "+ $("#musicname").val();
    if (timeout_id) {
        showMsg("点歌插件已启动, 换歌名请先关闭插件.");
        return;
    }
    showMsg("启动星痕点歌插件...");
    second = $("#second").val();
    second = !isNaN(second) && second < 10 ? 10 : second ;
    sendMsg(msg);
    timeout_id = setInterval(function(){
        sendMsg(msg);
    },second*1000);
    showMsg("点歌插件id为:"+timeout_id+", 每隔"+second+"秒会发送一条点歌消息");
}

var sendMsg = function (msg) {
    $.post(
        "http://live.bilibili.com/msg/send",
            { color:16777215,fontsize:25,mode:1,msg:msg,rnd:new Date().getTime(),roomid:ROOMID }
        );
    showMsg("发送点歌<<"+msg+">>消息成功. ");
}

var closesend = function(){
    clearInterval(timeout_id);
    timeout_id = undefined;
    showMsg("点歌插件关闭.");
}

var showMsg = function(msg){
    console.log(msg);
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

var AddButton = function() {
    $("#profile-ctrl").append('<input id="musicname" placeholder="输入歌名" style="width:110px"/>');
    $("#profile-ctrl").append('<input id="second" type="number" style="width:35px" value="10" />');
    $("#profile-ctrl").append('<span id="startSend" onclick="startSend()" title="开启自动点歌" style="cursor: hand;margin: 5px;display: inline-block">√</span>');
    $("#profile-ctrl").append('<span id="closesend" onclick="closesend()" title="关闭自动点歌"  style="cursor: hand;margin: 5px;display: inline-block">×</span>');
}
AddButton()

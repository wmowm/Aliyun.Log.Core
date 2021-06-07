var $ = (layui && layui.jquery) ? layui.jquery : $;
var jQuery = $;
$(".layui-colla-title").click(function () {
    $(window).trigger("resize");
});
$(".layui-form-select").find(".layui-input").click(function () {
    console.log("xxx");
    $(this).select();
});
$.fn.contip = function (opt) {
    opt = opt || {};
    for (var d in defOpt) {
        if (opt.hasOwnProperty(d))
            continue
        opt[d] = defOpt[d];
    }
    //新建提示框
    var that = new Contip(this, opt);
    that.id = ++_id;
    Contips['id' + that.id] = that;
    return that;
};
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var Fulu = {
    Goto: function (title, id) {
        var menus = parent.$("#J_Nav").find(".nav-item-inner");
        menus.each(function () {
            if ($(this).text() == title) {
                $(this).click();
                setTimeout(function () {
                    if (top.topManager) {
                        top.topManager.openPage({
                            id: id,
                            search: ''
                        });
                    }
                }, 150);
                return;
            }
        });
    },
    AreaList: function () {
        return [
            { AreaID: 1, text: "全国" }, { AreaID: 2, text: "辽宁" }, { AreaID: 20, text: "湖南" }, { AreaID: 44, text: "内蒙古" }, { AreaID: 93, text: "浙江" },
            { AreaID: 107, text: "安徽" }, { AreaID: 129, text: "贵州" }, { AreaID: 163, text: "西藏" }, { AreaID: 180, text: "黑龙江" }, { AreaID: 215, text: "陕西" },
            { AreaID: 227, text: "广西" }, { AreaID: 250, text: "湖北" }, { AreaID: 308, text: "福建" }, { AreaID: 319, text: "山西" }, { AreaID: 335, text: "江西" },
            { AreaID: 351, text: "海南" }, { AreaID: 356, text: "江苏" }, { AreaID: 375, text: "云南" }, { AreaID: 437, text: "河南" }, { AreaID: 462, text: "山东" },
            { AreaID: 481, text: "新疆" }, { AreaID: 542, text: "青海" }, { AreaID: 583, text: "吉林" }, { AreaID: 601, text: "河北" }, { AreaID: 617, text: "宁夏" },
            { AreaID: 625, text: "北京" }, { AreaID: 628, text: "天津" }, { AreaID: 631, text: "广东" }, { AreaID: 664, text: "上海" }, { AreaID: 667, text: "四川" },
            { AreaID: 709, text: "重庆" }, { AreaID: 715, text: "甘肃" }
        ];
    },
    ProviderList: function () {
        var pList = [
            { Provider: 1, text: "YD" },
            { Provider: 2, text: "DX" },
            { Provider: 3, text: "LT" },
            { Provider: 5, text: "固话" },
            { Provider: 11, text: "中石油" },
            { Provider: 12, text: "中石化" },
            { Provider: 13, text: "中海油" },
        ];
        $.ajax({
            type: "post",
            url: "/Goods/ProviderList",
            dataType: "json",
            async: false,
            timeout: 5000,
            success: function (json) {
                if (json.State == 1) {
                    var result = json.Result;
                    if (result.length > 0) {
                        pList = [];
                        for (var i = 0; i < result.length; i++) {
                            var one = result[i];
                            pList.push({
                                Provider: one.Provider,
                                text: one.ProviderName
                            });
                        }
                    }
                }
            }
        });
        return pList;
    },
    FlowTypeList:function(){
        return [
            { FlowType: 2, text: "全国流量" },
            { FlowType: 3, text: "分省漫游" },
            { FlowType: 4, text: "分省本地" }
        ];
    },
    Distinct: function (a) {
        var seen = {};
        return a.filter(function (item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    },
    ShowLoading: function (isParent) {
        var lay = isParent ? parent.layer : layer;
        return lay.load(2, { shade: [0.3, '#000'] });
    },
    CloseLoading: function (loadingObj) {
        try {
            layer.close(loadingObj);
        } catch (e) { console.log(e); }
        try {
            parent.layer.close(loadingObj);
        } catch (e) { console.log(e);}
    },
    Tips: function (id, show) {
        layer.tips(show, '#' + id, { time: 0, closeBtn: 2 });
    },
    Submit: function (url, data, isSuccessAlert, isCallback) {
        Fulu.Ajax(url, data, isSuccessAlert, true, isCallback);
    },
    Submit1: function (url, data, func1, func2) {
        var loading = Fulu.ShowLoading(false);
        $.ajax({
            type: "post",
            url: url,
            data: data,
            success: function (json) {
                Fulu.CloseLoading(loading);
                func1(json);
            },
            error: function (e) {
                Fulu.CloseLoading(loading);
                if (func2) {
                    func2(e);
                }
                else {
                    Fulu.AlertMsg("异常了，请刷新后重试！" + e);
                }
            }
        });
    },
    Ajax: function (url, data, isSuccessAlert, isLoading, isCallback) {
        var lodingDialog;
        if (isLoading) lodingDialog = parent.layer.load(2, { shade: [0.3, '#000'] });
        $.ajax({
            type: 'POST', url: url, data: data,
            success: function (json) {
                if (isLoading) parent.layer.close(lodingDialog);
                if (isCallback) Fulu.Callback();
                Fulu.ShowMsg(json, isSuccessAlert);
            }
        });
    },
    AjaxGetData: function (_url, data) {
        var ret;
        $.ajax({
            type: "post",
            url: _url,
            data: data,
            async: false,
            success: function (json) {
                if (json.State == 1) {
                    ret = json.Result;
                }
            }
        });
        return ret;
    },
    InitFormData: function (data) {
        $.FormDataInit(data);
    },
    ShowMsg: function (json, isSuccessAlert) {
        if (json.State == 1) {
            if (isSuccessAlert && $.trim(json.Msg) != '') {
                parent.layer.alert(json.Msg, {
                    icon: 1,
                    time: 2000,
                    end: function () {
                        if (json.RedirectPage)
                            Fulu.Redirect(json.RedirectPage);
                        Fulu.CloseLayer();
                    },
                    skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
                });

                
            }
            else {
                if (json.RedirectPage)
                    Fulu.Redirect(json.RedirectPage);
                Fulu.CloseLayer();
            }
        }
        else {
            parent.layer.alert(json.Msg, {
                icon: 2,
                skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
            });
        }
    },
    AlertError: function (msg) {
        parent.layer.alert(msg, {
            icon: 2,
            skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
        });
    },
    AlertSuccess: function (msg) {
        parent.layer.alert(msg, {
            icon: 1,
            time: 2000,
            end: function () {
                Fulu.CloseLayer();
            },
            skin: 'layer-ext-moon' //该皮肤由layer.seaning.com友情扩展。关于皮肤的扩展规则，去这里查阅
        });
    },
    AlertMsg: function (msg) {
        parent.layer.msg(msg);
    },
    Redirect: function (Url) {
        if ($.trim(Url) != '') {
            window.location = Url;
        }
        else {
            var _Purl = parent.$('.J_menuTab.active').attr('data-id');
            window.location = window.location;
            parent.$("iframe[data-id='" + _Purl + "']").attr('src', _Purl);
        }
    },
    GetRequest: function () {
        var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1])
            }
        } return theRequest
    },
    GetQueryParam: function (param) {
        var rq = Fulu.GetRequest();
        for (var o in rq) {
            if (o == param) {
                return rq[o];
            }
        }
        return "";
    },
    CloseLayer: function () {
        try {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
            return;
        } catch (e) { }
        try {
            var lay = parent ? parent.layer : layer;
            lay.closeAll();
        } catch (e) { }
        try {
            var lay = top ? top.layer : layer;
            lay.closeAll();
        } catch (e) { }
    },
    FormatTime: function (strTime) {
        var date = new Date(strTime);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    },
    Format: function () {
        if (arguments.length == 0)
            return null;
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    },
    AjaxBindSelect: function (id, _url, _ajaxdata, _textfield, _valuefield) {
        $.ajax({
            type: 'post',
            url: _url,
            data: _ajaxdata,
            async: false,
            success: function (json) {
                if (json.State != 1 || !json.Result) {
                    Fulu.ShowMsg(json, false);
                    return;
                }
                var options = '<option value="">---请选择---</option>';
                var options = '';
                var data = json.Result;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].Selected) {
                        options += "<option value='" + data[i][_valuefield] + "' selected='selected'>" + data[i][_textfield] + "</option>";
                    } else {
                        options += "<option value='" + data[i][_valuefield] + "'>" + data[i][_textfield] + "</option>";
                    }

                }
                $("#" + id).html("");
                $("#" + id).append(options);
            }
        });
    },
    IsExist: function (arr, attr, value) {
        if (attr) {
            for (var a in arr) {
                if (arr[a][attr] == value) {
                    return true;
                }
            }
            return false;
        } else {
            for (var a in arr) {
                if (arr[a] == value) {
                    return true;
                }
            }
            return false;
        }
    },
    FindByValue: function (arr, attr, value) {
        if (attr) {
            for (var a in arr) {
                if (arr[a][attr] == value)
                    return arr[a];
            }
        }
        return null;
    },
    FindListByValue: function (arr, attr, value) {
        var result = [];
        if (attr) {
            for (var a in arr) {
                if (arr[a][attr] == value)
                    result.push(arr[a]);
            }
        }
        return result;
    },
    DeleteByValue: function (arr, attr, value) {
        var result = [];
        if (attr) {
            for (var a in arr) {
                if (arr[a][attr] != value) {
                    result.push(arr[a]);
                }
            }
        } else {
            for (var a in arr) {
                if (arr[a] != value) {
                    result.push(arr[a]);
                }
            }
        }
        return result;
    },
    EditArrayListValue: function (arr, attr, value, editattr, editval) {
        if (attr) {
            for (var a in arr) {
                if (arr[a][attr] == value)
                    arr[a][editattr] = editval;
            }
        }
        return arr;
    },
    PhoneSlsLog: function (query) {
        var index = layui.layer.open({
            title: "话费日志查询",
            type: 2,
            content: '/Common/PhoneSlsLog?query=' + query,
            success: function (layero, index) {
                setTimeout(function () {
                    layui.layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        })
        layui.layer.full(index);
    },
    CardSlsLog: function (query) {
        var index = layui.layer.open({
            title: "卡密日志查询",
            type: 2,
            content: '/Common/CardSlsLog?query=' + query,
            success: function (layero, index) {
                setTimeout(function () {
                    layui.layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        })
        layui.layer.full(index);
    },
    SuspiciousOrderProcess: function (data, func) {
        Fulu.sop = func;
        Fulu.Submit1("/Common/CheckOrderState",
            data,
            function (json) {
                console.log(json.Msg);
                console.log(json.Msg.indexOf("正在处理该订单"));
                if (json.State == 1 || json.Msg.indexOf("正在处理该订单") >= 0) {
                    if (json.Msg.indexOf("正在处理该订单") >= 0) {
                        parent.layer.confirm(json.Msg, { icon: 3, title: '提示' }, function (index) {
                            parent.layer.close(index);
                            var index = layui.layer.open({
                                title: "订单核查",
                                type: 2,
                                content: '/Common/SuspiciousOrderProcess?orderId=' + data.KMOrderID + "&callback=sop",
                                success: function (layero, index) {
                                    setTimeout(function () {
                                        layui.layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                                            tips: 3
                                        });
                                    }, 500)
                                }
                            })
                            layui.layer.full(index);
                        });
                    } else {
                        var index = layui.layer.open({
                            title: "订单核查",
                            type: 2,
                            content: '/Common/SuspiciousOrderProcess?orderId=' + data.KMOrderID + "&callback=sop",
                            success: function (layero, index) {
                                setTimeout(function () {
                                    layui.layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                                        tips: 3
                                    });
                                }, 500)
                            }
                        })
                        layui.layer.full(index);
                    }
                } else {
                    Fulu.AlertMsg(json.Msg);
                }
            }
        );
    },
    sop: function (func) {

    },
    Verify: function (callback) {
        parent.layer.open({
            type: 2,
            title: '授权验证',
            shadeClose: false,
            shade: [0.3, '#000'],
            area: ['450px', '300px'],
            content: '/Common/LicenseVerify?callback=VerifyCallback'
        });
        Fulu.VerifyCallback = callback;
    },
    //VerifyCallback:function(func){
       
    //},
    Fail: function (callback) {
        parent.layer.open({
            type: 2,
            title: '提示',
            shadeClose: false,
            shade: [0.3, '#000'],
            area: ['550px', '380px'],
            content: '/Common/FailOptions?callback=FailCallback'
        });
        Fulu.FailCallback = callback;
    },
    //传对象到后台可以单对象或list对象
    Param: function (param, attrName) {
        return mvcParamMatch(param, attrName);
    },
    Callback: function (parm) {
        var callback = Fulu.GetQueryParam("callback");
        if (!callback)
            callback = "callback";
        try {
            var $obj;
            parent.$("#J_NavContent li.dl-tab-item").each(function () {
                if (!$(this).hasClass('ks-hidden')) {
                    $(this).find(".tab-content").each(function () {
                        if ($(this).css("display") == "block") {
                            $obj = $(this);
                            return false;
                        }
                    });
                }
            });
            if ($obj) {
                var obj = $obj.find("iframe")[0];
                if (obj) {
                    var str = "obj.contentWindow." + callback + "(parm);";
                    eval(str);
                    Fulu.CloseLayer();
                }
                return;
            }
        } catch (e) { console.log(e); }
        try {
            var str = "parent." + callback + "(parm)";
            eval(str);
            Fulu.CloseLayer();
            return;
        }
        catch (e) { console.log(e); }

    },
    BindSelect: function (id, data, _textfield, _valuefield) {
        var options = '';
        for (var i = 0; i < data.length; i++) {
            options += "<option value='" + data[i][_valuefield] + "'>" + data[i][_textfield] + "</option>";
        }
        $("#" + id).html("");
        $("#" + id).append(options);
    },
    Tip: function (obj,opt) {
        opt = opt || {};
    },
    UserGoodsManagerFuncLock: function (consumerID, consumerName, type) {
        Fulu.Verify(function () {
            var index = layui.layer.open({
                title: "用户商品配置功能锁定",
                type: 2,
                content: '/Common/UserGoodsManagerFunctionLock?callback=reloadGrid&consumerID=' + consumerID + '&consumerName=' + consumerName + '&type=' + type,
                success: function (layero, index) {
                    setTimeout(function () {
                        layui.layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500)
                }
            })
            layui.layer.full(index);
        });
    },
    UserGoodsManagerFuncUnLock: function (consumerID, type) {
        Fulu.Verify(function () {
            Fulu.Submit1("/Common/UserGoodsManagerFunctionUnLock",
                { consumerID: consumerID, type: type },
                function (json) {
                    Fulu.AlertMsg(json.Msg);
                }
            );
        });
    }
};
var mvcParamMatch = (function () {
    var MvcParameterAdaptive = {};
    //验证是否为数组  
    MvcParameterAdaptive.isArray = Function.isArray || function (o) {
        return typeof o === "object" &&
                Object.prototype.toString.call(o) === "[object Array]";
    };

    //将数组转换为对象  
    MvcParameterAdaptive.convertArrayToObject = function (/*数组名*/arrName, /*待转换的数组*/array, /*转换后存放的对象，不用输入*/saveOjb) {
        var obj = saveOjb || {};

        function func(name, arr) {
            for (var i in arr) {
                if (!MvcParameterAdaptive.isArray(arr[i]) && typeof arr[i] === "object") {
                    for (var j in arr[i]) {
                        if (MvcParameterAdaptive.isArray(arr[i][j])) {
                            func(name + "[" + i + "]." + j, arr[i][j]);
                        } else if (typeof arr[i][j] === "object") {
                            MvcParameterAdaptive.convertObject(name + "[" + i + "]." + j + ".", arr[i][j], obj);
                        } else {
                            obj[name + "[" + i + "]." + j] = arr[i][j];
                        }
                    }
                } else {
                    obj[name + "[" + i + "]"] = arr[i];
                }
            }
        }

        func(arrName, array);

        return obj;
    };

    //转换对象  
    MvcParameterAdaptive.convertObject = function (/*对象名*/objName,/*待转换的对象*/turnObj, /*转换后存放的对象，不用输入*/saveOjb) {
        var obj = saveOjb || {};

        function func(name, tobj) {
            for (var i in tobj) {
                if (MvcParameterAdaptive.isArray(tobj[i])) {
                    MvcParameterAdaptive.convertArrayToObject(i, tobj[i], obj);
                } else if (typeof tobj[i] === "object") {
                    func(name + i + ".", tobj[i]);
                } else {
                    obj[name + i] = tobj[i];
                }
            }
        }
        func(objName, turnObj);
        return obj;
    };

    return function (json, arrName) {
        arrName = arrName || "";
        if (typeof json !== "object") throw new Error("请传入json对象");
        if (MvcParameterAdaptive.isArray(json) && !arrName) throw new Error("请指定数组名，对应Action中数组参数名称！");

        if (MvcParameterAdaptive.isArray(json)) {
            return MvcParameterAdaptive.convertArrayToObject(arrName, json);
        }
        return MvcParameterAdaptive.convertObject("", json);
    };
})();
Fulu.DefaultPwd = "111111";
function VerifyCallback() {
    Fulu.VerifyCallback();
}
function sop() {
    Fulu.sop();
}
function FailCallback(data) {
    Fulu.FailCallback(data);
}

var _id = 0
  , Contips = {};
window.onresize = update_all;
function update_all() {
    for (var i in Contips) {
        Contips[i].update();
    };
}
function Contip(elm, opt) {
    this.options = opt;//$.extend(true, {}, defOpt, opt);
    this.$elm = $(elm);
    this.exist = false;
    this.enabled = true;
    var that = this
      , $elm = this.$elm
      , opt = this.options;
    //提示内容处理
    this.fixtitle();
    // 默认显示
    if (opt.show)
        this.show();
    // 如果不始终显示
    if (!opt.live) {
        //点击空白区域 关闭 sidebar
        $(document).click(function (e) { that.hide() });
        $elm.click(function (event) {
            event.stopPropagation(); // 防止事件冒泡
        });
    }
    // 气泡打开事件监听
    this.trigger();
}
Contip.prototype = {
    timeout: null, //显示或关闭延迟
    onFunc: {}, //事件监听
    html: function (html) {
        if (!this.enabled)
            return
        var $tip = this.tip()
          , $con = $tip.find('.contip-con');
        $con.html(html);
        //更新显示位置
        this.update();
    },
    show: function () {
        if (!this.enabled || this.exist)
            return
        //表示正在显示中
        this.exist = true;
        var opt = this.options
          , $tip = this.tip();
        // $tip.attr('original-style', $tip.attr('style'));
        $tip.remove().css({ display: 'block', visibility: 'hidden' }).prependTo(document.body);
        // 更新显示位置
        this.update();
        // 显示
        $tip.stop().css({ opacity: 0, visibility: 'visible' }).animate({ opacity: this.options.opacity }, this.options.fade);
        // 激活气泡，绑定事件
        this.revive();
        // 显示事件
        this._do('show', this.$tip);
        return this;
    },
    tip: function () {
        if (!this.$tip) {
            var that = this
              , o = this.options
              , html = o.html || '';
            this.$tip = $('<div class="contip ' + o.name + '" name="' + o.name + '" style="z-index:10000; position:absolute; opacity:' + o.opacity + '; background:' + o.bg + '; max-width:' + o.max_width + 'px; padding:' + o.padding + 'px; border-radius:' + o.radius + 'px;"></div>')
            .html('<div class="contip-v" style="position:absolute; width:0; height:0; border:solid transparent ' + o.v_size + 'px;"></div><div class="contip-con" style="color:' + o.color + '; font-size:' + o.font_size + '; background:' + o.fg + '; border-radius:' + o.radius + 'px;">' + html + '</div>');
            // 创建事件
            this._do('create', this.$tip);
        }
        return this.$tip;
    },
    // 初始化 绑定事件
    revive: function () {
        var that = this
          , opt = this.options
          , $tip = this.tip();
        // 如果不始终显示
        if (!opt.live) {
            $tip.click(function (event) {
                event.stopPropagation(); // 防止事件冒泡
            });
        }
        // 鼠标移入不关闭，移出关闭
        if (opt.hold) {
            $tip.mouseenter(function (event) {
                clearTimeout(that.timeout);
            });
            $tip.mouseleave(function (event) {
                clearTimeout(that.timeout);
                that.$elm.mouseleave(); // 调用关闭逻辑
            });
        }
        return this;
    },
    // 刷新显示位置等样式
    update: function () {
        // alert(this.$tip);
        if (!this.exist)
            return
        var tip_w = this.$tip[0].offsetWidth
          , tip_h = this.$tip[0].offsetHeight
          , elm_w = this.$elm[0].offsetWidth
          , elm_h = this.$elm[0].offsetHeight;
        //改变位置等样式
        // console.log([tip_w, tip_h, elm_w, elm_h]);
        this.offset(tip_w, tip_h, elm_w, elm_h);
        return this;
    },
    // tip 气泡样式
    offset: function (tip_w, tip_h, elm_w, elm_h) {
        var $tip = this.tip()
          , $v = $tip.find('.contip-v')
          , o = this.options
          , ofs = this.$elm.offset()
          , vsize = o.v_size * 2;
        switch (o.align) {
            case 'left':
                var vright = -vsize
                  , vtop = o.v_px + (tip_h - vsize) * o.v_pos
                  , ttop = ofs.top - vtop - o.v_size + elm_h * o.elm_pos + o.elm_px
                  , tleft = ofs.left - tip_w - o.v_size - o.rise;
                $v.css({ right: vright, top: vtop, borderLeftColor: o.bg });
                $tip.css({ left: tleft, top: ttop });
                return
            case 'right':
                var vleft = -vsize
                  , vtop = o.v_px + (tip_h - vsize) * o.v_pos
                  , ttop = ofs.top - vtop - o.v_size + elm_h * o.elm_pos + o.elm_px
                  , tleft = ofs.left + elm_w + o.v_size + o.rise;
                $v.css({ left: vleft, top: vtop, borderRightColor: o.bg });
                $tip.css({ left: tleft, top: ttop });
                return
            case 'bottom':
                var vtop = -vsize
                  , vleft = o.v_px + (tip_w - vsize) * o.v_pos
                  , tleft = ofs.left - vleft - o.v_size + elm_w * o.elm_pos + o.elm_px
                  , ttop = ofs.top + elm_h + o.v_size + o.rise;
                $v.css({ left: vleft, top: vtop, borderBottomColor: o.bg });
                $tip.css({ left: tleft, top: ttop });
                return
            case 'top':
            default:
                var vbottom = -vsize
                  , vleft = o.v_px + (tip_w - vsize) * o.v_pos
                  , tleft = ofs.left - vleft - o.v_size + elm_w * o.elm_pos + o.elm_px
                  , ttop = ofs.top - tip_h - o.v_size - o.rise;
                $v.css({ left: vleft, bottom: vbottom, borderTopColor: o.bg });
                $tip.css({ left: tleft, top: ttop });
                // console.log({left: tleft, top: ttop});
                return
        }
    },
    // 关闭提示框
    hide: function () {
        if (!this.exist)
            return
        if (this.options.fade) {
            this.tip().stop().fadeOut(this.options.fade, function () { $(this).remove(); });
        } else {
            this.tip().remove();
        }
        this.exist = false;
        this._do('hide');
        return this;
    },
    fixtitle: function () {
        var opt = this.options;
        if (opt.html)
            return
        var $elm = this.$elm;
        opt.html = $elm.attr(opt.attr);
        if (opt.attr == 'title') {
            $elm.attr('original-title', $elm.attr('title') || '').removeAttr('title');
        }
    },
    // 事件监听
    trigger: function () {
        var that = this
          , $elm = this.$elm
          , opt = this.options;
        //事件监听
        switch (opt.trigger) {
            case 'hover':
                $elm.on('mouseenter', function () {
                    if (that.timeout) {
                        clearTimeout(that.timeout);
                    }
                    that.timeout = setTimeout(function () {
                        that.show();
                        that.timeout = null;
                    }, opt.delay_in);
                });
                // 如果不始终显示
                if (!opt.live) {
                    $elm.on('mouseleave', function () {
                        if (that.timeout) {
                            clearTimeout(that.timeout);
                        }
                        that.timeout = setTimeout(function () {
                            that.hide();
                            that.timeout = null;
                        }, opt.delay_out);
                    });
                }
                break

            case 'focus':
                $elm.on('focusin', function () { that.show() });
                if (!opt.live)
                    $elm.on('focusout', function () { that.hide() });
                break;

            case 'click':
                $elm.on('click', function () { that.show() });
                break

        }
    },
    // 事件监听
    // show hide 
    on: function (name, func) {
        if (!this.onFunc[name])
            this.onFunc[name] = [];
        this.onFunc[name].push(func);
        return this;
    },
    // 执行监听的事件
    _do: function (name, err, data) {
        if (!this.onFunc[name])
            return
        for (var o in this.onFunc[name]) {
            this.onFunc[name][o](err, data);
        }
    },
    enable: function () { this.enabled = true; return this; },
    disable: function () { this.enabled = false; return this; },
    toggleEnabled: function () { this.enabled = !this.enabled; return this; }
};
var defOpt = {
    name: '', // .contip 元素的 name 和 class
    align: 'top', // 气泡出现的位置， top right bottom left
    padding: 7,
    radius: 4, // 气泡圆角大小 px
    opacity: 1, // 透明度
    max_width: 222, // 气泡最大宽度 px
    rise: 0, // 气泡相对浮动位置，可为负值
    bg: '#000', // 背景颜色
    fg: 'transparent', // 气泡内部颜色
    color: '#fff', // 正文字体颜色
    font_size: '12px', // 正文字体
    fade: 0, // 渐入渐出
    delay_in: 0, //延迟显示
    delay_out: 0, //延迟关闭
    live: false, // 总是显示
    hold: true, //鼠标移入不关闭
    html: '',
    attr: 'title', // attr 要处理的属性
    trigger: 'hover', // 绑定的事件 hover click dblclick focus ..
    show: false, // 是否默认显示
    v_size: 6, // 尖角的大小，像素
    v_pos: 0.5, // 尖角出现的位置
    v_px: 0, // 尖角出现的位置的偏移 px像素 可为负值
    elm_pos: 0.5, // 尖角相对于elm出现的位置
    elm_px: 0 // 尖角偏移 可为负值
}


var tabFilter, menu = [], liIndex, curNav, delMenu;
layui.define(["element", "jquery"], function (exports) {
    var element = layui.element(),
		$ = layui.jquery,
		layId,
		Tab = function () {
		    this.tabConfig = {
		        closed: true,
		        openTabNum: undefined,  //最大可打开窗口数量
		        tabFilter: "bodyTab",  //添加窗口的filter
		        url: undefined  //获取菜单json地址
		    }
		};

    //获取二级菜单数据
    Tab.prototype.render = function () {
        var url = this.tabConfig.url;
        $.get(url, function (data) {
            //显示左侧菜单
            if ($(".navBar").html() == '') {
                var _this = this;
                $(".navBar").html(navBar(data)).height($(window).height() - 245);
                element.init();  //初始化页面元素
                $(window).resize(function () {
                    $(".navBar").height($(window).height() - 245);
                })
            }
        })
    }

    //参数设置
    Tab.prototype.set = function (option) {
        var _this = this;
        $.extend(true, _this.tabConfig, option);
        return _this;
    };

    //通过title获取lay-id
    Tab.prototype.getLayId = function (title) {
        $(".layui-tab-title.top_tab li").each(function () {
            if ($(this).find("cite").text() == title) {
                layId = $(this).attr("lay-id");
            }
        })
        return layId;
    }
    //通过title判断tab是否存在
    Tab.prototype.hasTab = function (title) {
        var tabIndex = -1;
        $(".layui-tab-title.top_tab li").each(function () {
            if ($(this).find("cite").text() == title) {
                tabIndex = 1;
            }
        })
        return tabIndex;
    }

    //右侧内容tab操作
    var tabIdIndex = 0;
    Tab.prototype.tabAdd = function (_this) {
        if (window.sessionStorage.getItem("menu")) {
            menu = JSON.parse(window.sessionStorage.getItem("menu"));
        }
        var that = this;
        var closed = that.tabConfig.closed,
			openTabNum = that.tabConfig.openTabNum;
        tabFilter = that.tabConfig.tabFilter;
        if (_this.attr("target") == "_blank") {
            window.location.href = _this.attr("data-url");
        } else {
            var title = '';
            if (_this.find("i.iconfont,i.layui-icon").attr("data-icon") != undefined) {
                if (_this.find("i.iconfont").attr("data-icon") != undefined) {
                    title += '<i class="iconfont ' + _this.find("i.iconfont").attr("data-icon") + '"></i>';
                } else {
                    title += '<i class="layui-icon">' + _this.find("i.layui-icon").attr("data-icon") + '</i>';
                }
            }
            //已打开的窗口中不存在
            if (that.hasTab(_this.find("cite").text()) == -1 && _this.siblings("dl.layui-nav-child").length == 0) {
                if ($(".layui-tab-title.top_tab li").length == openTabNum) {
                    layer.msg('只能同时打开' + openTabNum + '个选项卡哦。不然系统会卡的！');
                    return;
                }
                tabIdIndex++;
                title += '<cite>' + _this.find("cite").text() + '</cite>';
                title += '<i class="layui-icon layui-unselect layui-tab-close" data-id="' + tabIdIndex + '">&#x1006;</i>';
                element.tabAdd(tabFilter, {
                    title: title,
                    content: "<iframe src='" + _this.attr("data-url") + "' data-id='" + tabIdIndex + "'></frame>",
                    id: new Date().getTime()
                })
                //当前窗口内容
                var curmenu = {
                    "icon": _this.find("i.iconfont").attr("data-icon") != undefined ? _this.find("i.iconfont").attr("data-icon") : _this.find("i.layui-icon").attr("data-icon"),
                    "title": _this.find("cite").text(),
                    "href": _this.attr("data-url"),
                    "layId": new Date().getTime()
                }
                menu.push(curmenu);
                window.sessionStorage.setItem("menu", JSON.stringify(menu)); //打开的窗口
                window.sessionStorage.setItem("curmenu", JSON.stringify(curmenu));  //当前的窗口
                element.tabChange(tabFilter, that.getLayId(_this.find("cite").text()));
                that.tabMove(); //顶部窗口是否可滚动
            } else {
                //当前窗口内容
                var curmenu = {
                    "icon": _this.find("i.iconfont").attr("data-icon") != undefined ? _this.find("i.iconfont").attr("data-icon") : _this.find("i.layui-icon").attr("data-icon"),
                    "title": _this.find("cite").text(),
                    "href": _this.attr("data-url")
                }
                window.sessionStorage.setItem("curmenu", JSON.stringify(curmenu));  //当前的窗口
                element.tabChange(tabFilter, that.getLayId(_this.find("cite").text()));
                that.tabMove(); //顶部窗口是否可滚动
            }
        }
    }

    //顶部窗口移动
    Tab.prototype.tabMove = function () {
        $(window).on("resize", function () {
            var topTabsBox = $("#top_tabs_box"),
				topTabsBoxWidth = $("#top_tabs_box").width(),
				topTabs = $("#top_tabs"),
				topTabsWidth = $("#top_tabs").width(),
				tabLi = topTabs.find("li.layui-this"),
				top_tabs = document.getElementById("top_tabs");;

            if (topTabsWidth > topTabsBoxWidth) {
                if (tabLi.position().left > topTabsBoxWidth || tabLi.position().left + topTabsBoxWidth > topTabsWidth) {
                    topTabs.css("left", topTabsBoxWidth - topTabsWidth);
                } else {
                    topTabs.css("left", -tabLi.position().left);
                }
                //拖动效果
                var flag = false;
                var cur = {
                    x: 0,
                    y: 0
                }
                var nx, dx, x;
                function down() {
                    flag = true;
                    var touch;
                    if (event.touches) {
                        touch = event.touches[0];
                    } else {
                        touch = event;
                    }
                    cur.x = touch.clientX;
                    dx = top_tabs.offsetLeft;
                }
                function move() {
                    var self = this;
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                    if (flag) {
                        var touch;
                        if (event.touches) {
                            touch = event.touches[0];
                        } else {
                            touch = event;
                        }
                        nx = touch.clientX - cur.x;
                        x = dx + nx;
                        if (x > 0) {
                            x = 0;
                        } else {
                            if (x < topTabsBoxWidth - topTabsWidth) {
                                x = topTabsBoxWidth - topTabsWidth;
                            } else {
                                x = dx + nx;
                            }
                        }
                        top_tabs.style.left = x + "px";
                        //阻止页面的滑动默认事件
                        document.addEventListener("touchmove", function () {
                            event.preventDefault();
                        }, false);
                    }
                }
                //鼠标释放时候的函数
                function end() {
                    flag = false;
                }
                //pc端拖动效果
                topTabs.on("mousedown", down);
                topTabs.on("mousemove", move);
                $(document).on("mouseup", end);
                //移动端拖动效果
                topTabs.on("touchstart", down);
                topTabs.on("touchmove", move);
                topTabs.on("touchend", end);
            } else {
                //移除pc端拖动效果
                topTabs.off("mousedown", down);
                topTabs.off("mousemove", move);
                topTabs.off("mouseup", end);
                //移除移动端拖动效果
                topTabs.off("touchstart", down);
                topTabs.off("touchmove", move);
                topTabs.off("touchend", end);
                topTabs.removeAttr("style");
                return false;
            }
        }).resize();
    }

    $("body").on("click", ".top_tab li", function () {
        //切换后获取当前窗口的内容
        var curmenu = '';
        var menu = JSON.parse(window.sessionStorage.getItem("menu"));
        curmenu = menu[$(this).index() - 1];
        if ($(this).index() == 0) {
            window.sessionStorage.setItem("curmenu", '');
        } else {
            window.sessionStorage.setItem("curmenu", JSON.stringify(curmenu));
            if (window.sessionStorage.getItem("curmenu") == "undefined") {
                //如果删除的不是当前选中的tab,则将curmenu设置成当前选中的tab
                if (curNav != JSON.stringify(delMenu)) {
                    window.sessionStorage.setItem("curmenu", curNav);
                } else {
                    window.sessionStorage.setItem("curmenu", JSON.stringify(menu[liIndex - 1]));
                }
            }
        }
        element.tabChange(tabFilter, $(this).attr("lay-id")).init();
    })

    //删除tab
    $("body").on("click", ".top_tab li i.layui-tab-close", function () {
        //删除tab后重置session中的menu和curmenu
        liIndex = $(this).parent("li").index();
        var menu = JSON.parse(window.sessionStorage.getItem("menu"));
        //获取被删除元素
        delMenu = menu[liIndex - 1];
        var curmenu = window.sessionStorage.getItem("curmenu") == "undefined" ? undefined : window.sessionStorage.getItem("curmenu") == "" ? '' : JSON.parse(window.sessionStorage.getItem("curmenu"));
        if (JSON.stringify(curmenu) != JSON.stringify(menu[liIndex - 1])) {  //如果删除的不是当前选中的tab
            // window.sessionStorage.setItem("curmenu",JSON.stringify(curmenu));
            curNav = JSON.stringify(curmenu);
        } else {
            if ($(this).parent("li").length > liIndex) {
                window.sessionStorage.setItem("curmenu", curmenu);
                curNav = curmenu;
            } else {
                window.sessionStorage.setItem("curmenu", JSON.stringify(menu[liIndex - 1]));
                curNav = JSON.stringify(menu[liIndex - 1]);
            }
        }
        menu.splice((liIndex - 1), 1);
        window.sessionStorage.setItem("menu", JSON.stringify(menu));
        element.tabDelete("bodyTab", $(this).parent("li").attr("lay-id")).init();
        new Tab().tabMove();
    })

    var bodyTab = new Tab();
    exports("bodyTab", function (option) {
        return bodyTab.set(option);
    });
})

var form = layui.form(),
    layer = layui.layer,
    element = layui.element();
$ = layui.jquery;
tab = layui.bodyTab({
    openTabNum: "50",  //最大可打开窗口数量
    url: "/Home/GetMenus" //获取菜单json地址
    //url: "../json/navs.js" //获取菜单json地址
});

//搜索组件
form.on('select(modules)', function (data) {
    var value = data.value;
    var text = $(data.elem).children('option:selected').text();
    $(".navBar .layui-nav .layui-nav-item cite").each(function () {
        var citeEle = $(this);
        var linkEle = citeEle.parent();
        var menuTitle = citeEle.text();
        var dataUrl = linkEle.attr("data-url");
        if (menuTitle == text && dataUrl == value) {
            setTimeout(function () { linkEle.trigger("click"); }, 100);
            return false;
        }
    }); 
});


//更换皮肤
function skins() {
    var skin = window.sessionStorage.getItem("skin");
    if (skin) {  //如果更换过皮肤
        if (window.sessionStorage.getItem("skinValue") != "自定义") {
            $("body").addClass(window.sessionStorage.getItem("skin"));
        } else {
            $(".layui-layout-admin .layui-header").css("background-color", skin.split(',')[0]);
            $(".layui-bg-black").css("background-color", skin.split(',')[1]);
            $(".hideMenu").css("background-color", skin.split(',')[2]);
        }
    }
}
skins();
$(".changeSkin").click(function () {
    layer.open({
        title: "更换皮肤",
        area: ["310px", "280px"],
        type: "1",
        content: '<div class="skins_box">' +
                    '<form class="layui-form">' +
                        '<div class="layui-form-item">' +
                            '<input type="radio" name="skin" value="默认" title="默认" lay-filter="default" checked="">' +
                            '<input type="radio" name="skin" value="橙色" title="橙色" lay-filter="orange">' +
                            '<input type="radio" name="skin" value="蓝色" title="蓝色" lay-filter="blue">' +
                            '<input type="radio" name="skin" value="自定义" title="自定义" lay-filter="custom">' +
                            '<div class="skinCustom">' +
                                '<input type="text" class="layui-input topColor" name="topSkin" placeholder="顶部颜色" />' +
                                '<input type="text" class="layui-input leftColor" name="leftSkin" placeholder="左侧颜色" />' +
                                '<input type="text" class="layui-input menuColor" name="btnSkin" placeholder="顶部菜单按钮" />' +
                            '</div>' +
                        '</div>' +
                        '<div class="layui-form-item skinBtn">' +
                            '<a href="javascript:;" class="layui-btn layui-btn-small layui-btn-normal" lay-submit="" lay-filter="changeSkin">确定更换</a>' +
                            '<a href="javascript:;" class="layui-btn layui-btn-small layui-btn-primary" lay-submit="" lay-filter="noChangeSkin">我再想想</a>' +
                        '</div>' +
                    '</form>' +
                '</div>',
        success: function (index, layero) {
            var skin = window.sessionStorage.getItem("skin");
            if (window.sessionStorage.getItem("skinValue")) {
                $(".skins_box input[value=" + window.sessionStorage.getItem("skinValue") + "]").attr("checked", "checked");
            };
            if ($(".skins_box input[value=自定义]").attr("checked")) {
                $(".skinCustom").css("visibility", "inherit");
                $(".topColor").val(skin.split(',')[0]);
                $(".leftColor").val(skin.split(',')[1]);
                $(".menuColor").val(skin.split(',')[2]);
            };
            form.render();
            $(".skins_box").removeClass("layui-hide");
            $(".skins_box .layui-form-radio").on("click", function () {
                var skinColor;
                if ($(this).find("span").text() == "橙色") {
                    skinColor = "orange";
                } else if ($(this).find("span").text() == "蓝色") {
                    skinColor = "blue";
                } else if ($(this).find("span").text() == "默认") {
                    skinColor = "";
                }
                if ($(this).find("span").text() != "自定义") {
                    $(".topColor,.leftColor,.menuColor").val('');
                    $("body").removeAttr("class").addClass("main_body " + skinColor + "");
                    $(".skinCustom").removeAttr("style");
                    $(".layui-bg-black,.hideMenu,.layui-layout-admin .layui-header").removeAttr("style");
                } else {
                    $(".skinCustom").css("visibility", "inherit");
                }
            })
            var skinStr, skinColor;
            $(".topColor").blur(function () {
                $(".layui-layout-admin .layui-header").css("background-color", $(this).val());
            })
            $(".leftColor").blur(function () {
                $(".layui-bg-black").css("background-color", $(this).val());
            })
            $(".menuColor").blur(function () {
                $(".hideMenu").css("background-color", $(this).val());
            })

            form.on("submit(changeSkin)", function (data) {
                if (data.field.skin != "自定义") {
                    if (data.field.skin == "橙色") {
                        skinColor = "orange";
                    } else if (data.field.skin == "蓝色") {
                        skinColor = "blue";
                    } else if (data.field.skin == "默认") {
                        skinColor = "";
                    }
                    window.sessionStorage.setItem("skin", skinColor);
                } else {
                    skinStr = $(".topColor").val() + ',' + $(".leftColor").val() + ',' + $(".menuColor").val();
                    window.sessionStorage.setItem("skin", skinStr);
                    $("body").removeAttr("class").addClass("main_body");
                }
                window.sessionStorage.setItem("skinValue", data.field.skin);
                layer.closeAll("page");
            });
            form.on("submit(noChangeSkin)", function () {
                $("body").removeAttr("class").addClass("main_body " + window.sessionStorage.getItem("skin") + "");
                $(".layui-bg-black,.hideMenu,.layui-layout-admin .layui-header").removeAttr("style");
                skins();
                layer.closeAll("page");
            });
        },
        cancel: function () {
            $("body").removeAttr("class").addClass("main_body " + window.sessionStorage.getItem("skin") + "");
            $(".layui-bg-black,.hideMenu,.layui-layout-admin .layui-header").removeAttr("style");
            skins();
        }
    })
})

//退出
$(".signOut").click(function () {
    window.sessionStorage.removeItem("menu");
    menu = [];
    window.sessionStorage.removeItem("curmenu");
})

//隐藏左侧导航
$(".hideMenu").click(function () {
    $(".layui-layout-admin").toggleClass("showMenu");
    //渲染顶部窗口
    tab.tabMove();
})

//渲染左侧菜单
tab.render();

// 解锁
$("body").on("click", "#unlock", function () {
    if ($(this).siblings(".admin-header-lock-input").val() == '') {
        layer.msg("请输入解锁密码！");
        $(this).siblings(".admin-header-lock-input").focus();
    } else {
        if ($(this).siblings(".admin-header-lock-input").val() == "123456") {
            window.sessionStorage.setItem("lockcms", false);
            $(this).siblings(".admin-header-lock-input").val('');
            layer.closeAll("page");
        } else {
            layer.msg("密码错误，请重新输入！");
            $(this).siblings(".admin-header-lock-input").val('').focus();
        }
    }
});
$(document).on('keydown', function () {
    if (event.keyCode == 13) {
        $("#unlock").click();
    }
});

//手机设备的简单适配
var treeMobile = $('.site-tree-mobile'),
    shadeMobile = $('.site-mobile-shade')

treeMobile.on('click', function () {
    $('body').addClass('site-mobile');
});

shadeMobile.on('click', function () {
    $('body').removeClass('site-mobile');
});

// 添加新窗口
$("body").on("click", ".layui-nav .layui-nav-item a", function () {
    if ($(this).attr("data-url")) {
        //如果不存在子级
        var obj;
        if ($(this).siblings().length == 0) {
            //obj = parent.layer.load(2, { shade: [0.3, '#000'] });
            addTab($(this));
            $('body').removeClass('site-mobile');  //移动端点击菜单关闭菜单层
        }
    }
    $(this).parent("li").siblings().removeClass("layui-nav-itemed");

    if (obj) {
        setTimeout(function () { parent.layer.close(obj); }, 500);
    }
})

//公告层
function showNotice() {
    layer.open({
        type: 1,
        title: "系统公告",
        closeBtn: false,
        area: '310px',
        shade: 0.8,
        id: 'LAY_layuipro',
        btn: ['火速围观'],
        moveType: 1,
        content: '<div style="padding:15px 20px; text-align:justify; line-height: 22px; text-indent:2em;border-bottom:1px solid #e2e2e2;"><p>哈哈哈</p></div>',
        success: function (layero) {
            var btn = layero.find('.layui-layer-btn');
            btn.css('text-align', 'center');
            btn.on("click", function () {
                window.sessionStorage.setItem("showNotice", "true");
            })
            if ($(window).width() > 432) {  //如果页面宽度不足以显示顶部“系统公告”按钮，则不提示
                btn.on("click", function () {
                    layer.tips('系统公告躲在了这里', '#showNotice', {
                        tips: 3
                    });
                })
            }
        }
    });
}
//判断是否处于锁屏状态(如果关闭以后则未关闭浏览器之前不再显示)
if (window.sessionStorage.getItem("lockcms") != "true" && window.sessionStorage.getItem("showNotice") != "true") {
    //showNotice();
}
$(".showNotice").on("click", function () {
    showNotice();
})

//刷新后打开所有原菜单，ligerui变形bug
//if (window.sessionStorage.getItem("menu") != null) {
//    menu = JSON.parse(window.sessionStorage.getItem("menu"));
//    curmenu = window.sessionStorage.getItem("curmenu");
//    var openTitle = '';
//    for (var i = 0; i < menu.length; i++) {
//        openTitle = '';
//        if (menu[i].icon) {
//            if (menu[i].icon.split("-")[0] == 'icon') {
//                openTitle += '<i class="iconfont ' + menu[i].icon + '"></i>';
//            } else {
//                openTitle += '<i class="layui-icon">' + menu[i].icon + '</i>';
//            }
//        }
//        openTitle += '<cite>' + menu[i].title + '</cite>';
//        openTitle += '<i class="layui-icon layui-unselect layui-tab-close" data-id="' + menu[i].layId + '">&#x1006;</i>';
//        console.log(openTitle);
//        element.tabAdd("bodyTab", {
//            title: openTitle,
//            content: "<iframe src='" + menu[i].href + "' data-id='" + menu[i].layId + "'></frame>",
//            id: menu[i].layId
//        })
//        //定位到刷新前的窗口
//        if (curmenu != "undefined") {
//            if (curmenu == '' || curmenu == "null") {  //定位到后台首页
//                element.tabChange("bodyTab", '');
//            } else if (JSON.parse(curmenu).title == menu[i].title) {  //定位到刷新前的页面
//                element.tabChange("bodyTab", menu[i].layId);
//            }
//        } else {
//            element.tabChange("bodyTab", menu[menu.length - 1].layId);
//        }
//    }
//    //渲染顶部窗口
//    tab.tabMove();
//}

//关闭其他
$(".closePageOther").on("click", function () {
    if ($("#top_tabs li").length > 2 && $("#top_tabs li.layui-this cite").text() != "后台首页") {
        var menu = JSON.parse(window.sessionStorage.getItem("menu"));
        $("#top_tabs li").each(function () {
            if ($(this).attr("lay-id") != '' && !$(this).hasClass("layui-this")) {
                element.tabDelete("bodyTab", $(this).attr("lay-id")).init();
                //此处将当前窗口重新获取放入session，避免一个个删除来回循环造成的不必要工作量
                for (var i = 0; i < menu.length; i++) {
                    if ($("#top_tabs li.layui-this cite").text() == menu[i].title) {
                        menu.splice(0, menu.length, menu[i]);
                        window.sessionStorage.setItem("menu", JSON.stringify(menu));
                    }
                }
            }
        })
    } else if ($("#top_tabs li.layui-this cite").text() == "后台首页" && $("#top_tabs li").length > 1) {
        $("#top_tabs li").each(function () {
            if ($(this).attr("lay-id") != '' && !$(this).hasClass("layui-this")) {
                element.tabDelete("bodyTab", $(this).attr("lay-id")).init();
                window.sessionStorage.removeItem("menu");
                menu = [];
                window.sessionStorage.removeItem("curmenu");
            }
        })
    } else {
        layer.msg("没有可以关闭的窗口了@_@");
    }
    //渲染顶部窗口
    tab.tabMove();
})
//关闭全部
$(".closePageAll").on("click", function () {
    if ($("#top_tabs li").length > 1) {
        $("#top_tabs li").each(function () {
            if ($(this).attr("lay-id") != '') {
                element.tabDelete("bodyTab", $(this).attr("lay-id")).init();
                window.sessionStorage.removeItem("menu");
                menu = [];
                window.sessionStorage.removeItem("curmenu");
            }
        })
    } else {
        layer.msg("没有可以关闭的窗口了@_@");
    }
    //渲染顶部窗口
    tab.tabMove();
})

//打开新窗口
function addTab(_this){
	tab.tabAdd(_this);
}

function navBar(strData) {
    var data;
    if (typeof (strData) == "string") {
        var data = JSON.parse(strData); //部分用户解析出来的是字符串，转换一下
    } else {
        data = strData;
    }
    var ulHtml = '<ul class="layui-nav layui-nav-tree">';
    for (var i = 0; i < data.length; i++) {
        if (data[i].spread) {
            ulHtml += '<li class="layui-nav-item layui-nav-itemed">';
        } else {
            ulHtml += '<li class="layui-nav-item">';
        }
        if (data[i].children != undefined && data[i].children.length > 0) {
            ulHtml += '<a href="javascript:;">';
            if (data[i].icon != undefined && data[i].icon != '') {
                if (data[i].icon.indexOf("icon-") != -1) {
                    ulHtml += '<i class="iconfont ' + data[i].icon + '" data-icon="' + data[i].icon + '"></i>';
                } else {
                    ulHtml += '<i class="layui-icon" data-icon="' + data[i].icon + '">' + data[i].icon + '</i>';
                }
            }
            ulHtml += '<cite>' + data[i].title + '</cite>';
            ulHtml += '<span class="layui-nav-more"></span>';
            ulHtml += '</a>';
            ulHtml += '<dl class="layui-nav-child">';
            for (var j = 0; j < data[i].children.length; j++) {
                if (data[i].children[j].target == "_blank") {
                    ulHtml += '<dd><a href="javascript:;" data-url="' + data[i].children[j].href + '" target="' + data[i].children[j].target + '">';
                } else {
                    ulHtml += '<dd><a href="javascript:;" data-url="' + data[i].children[j].href + '">';
                }
                if (data[i].children[j].icon != undefined && data[i].children[j].icon != '') {
                    if (data[i].children[j].icon.indexOf("icon-") != -1) {
                        ulHtml += '<i class="iconfont ' + data[i].children[j].icon + '" data-icon="' + data[i].children[j].icon + '"></i>';
                    } else {
                        ulHtml += '<i class="layui-icon" data-icon="' + data[i].children[j].icon + '">' + data[i].children[j].icon + '</i>';
                    }
                }
                ulHtml += '<cite>' + data[i].children[j].title + '</cite></a></dd>';
            }
            ulHtml += "</dl>";
        } else {
            if (data[i].target == "_blank") {
                ulHtml += '<a href="javascript:;" data-url="' + data[i].href + '" target="' + data[i].target + '">';
            } else {
                ulHtml += '<a href="javascript:;" data-url="' + data[i].href + '">';
            }
            if (data[i].icon != undefined && data[i].icon != '') {
                if (data[i].icon.indexOf("icon-") != -1) {
                    ulHtml += '<i class="iconfont ' + data[i].icon + '" data-icon="' + data[i].icon + '"></i>';
                } else {
                    ulHtml += '<i class="layui-icon" data-icon="' + data[i].icon + '">' + data[i].icon + '</i>';
                }
            }
            ulHtml += '<cite>' + data[i].title + '</cite></a>';
        }
        ulHtml += '</li>';
    }
    ulHtml += '</ul>';
    return ulHtml;
}



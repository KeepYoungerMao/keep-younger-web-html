//javascript for book
//create by mao at 2020-05-03

//查询条件
let param = {
    type: 0,        //类型id
    dynasty: 0,     //朝代id
    free: null,     //是否免费
    page: 1,        //页码
    row: 20        //每页数量
};

//判定数据加载完成
let ALL_LOAD = false;

$(function () {
    //数据加载
    loadBook();
});

//加载数据
function loadBook() {
    clearBookData();
    $(".book-loading").show();
    $(".book-load-error").hide();
    ALL_LOAD = false;
    loadBookData(true);
}

//加载数据
function loadBookData(first) {
    setTimeout(function () {
        $.ajax({
            url: REQUEST_URL + "/api/data/book",
            type: "POST",
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify(param),
            success: function (data) {
                console.log(data);
                if (data.code === 200){
                    if (first)
                        $(".book-loading").hide();
                    param.page++;
                    loadBookSuccessDo(data.data.data);
                } else {
                    loadBookErrorDo(true);
                }
            },
            error: function () {
                loadBookErrorDo(true);
            }
        });
    },500);
}

//成功加载数据后的事情
function loadBookSuccessDo(data) {
    if (null == data || data.length <= 0) {
        ALL_LOAD = true;
        loadBookErrorDo(false);
    }else {
        for (let i = 0; i < data.length; i++){
            let html = '<div class="book-item" onclick="pageBookSrc('+data[i].id+')">\n' +
                '            <div class="book-score">'+data[i].score+'</div>\n' +
                '            <div class="book-image">\n' +
                '                <img src="'+REQUEST_URL + data[i].s_image+'" alt="'+data[i].name+'">\n' +
                '            </div>\n' +
                '            <div class="book-content">\n' +
                '                <div class="book-title">'+data[i].name+'</div>\n' +
                '                <div class="book-intro">\n' +
                '                    <span class="book-intro-title">导读</span>\n' +
                '                    <span>'+data[i].guide+'</span>\n' +
                '                    <span style="font-weight: bold;color: #666666">【'+data[i].guide_auth+'】</span>\n' +
                '                </div>\n' +
                '                <div class="book-author">\n' +
                '                    <span>'+data[i].dynasty+'</span>\n' +
                '                    <span style="color: #666666"> | </span>\n' +
                '                    <span>'+data[i].type+'</span>\n' +
                '                    <span style="color: #666666"> | </span>\n' +
                '                    <span>'+data[i].auth+'</span>\n' +
                '                </div>\n' +
                '            </div>\n' +
                '        </div>';
            $("#book-item").append(html);
        }
    }
}

//清空古籍列表
function clearBookData() {
    $("#book-item").empty();
}

//查询失败处理
function loadBookErrorDo(status) {
    $(".book-load-error span").html(status ? "加载错误，请求失败" : "没有数据了");
    $(".book-load-error").show();
}

//获取参数
function getBookParam() {
    let free_box = $("#book-param-free").find(".book-type-item-active");
    if (free_box.length > 0){
        let free = $(free_box).attr("data-id");
        param.free = free === "1";
    }
    let type_box = $("#book-param-type").find(".book-type-item-active");
    if (type_box.length > 0){
        param.type = parseInt($(type_box).attr("data-id"));
    }
    let dynasty_box = $("#book-param-dynasty").find(".book-type-item-active");
    if (dynasty_box.length > 0){
        param.dynasty = parseInt($(dynasty_box).attr("data-id"));
    }
    param.page = 1;
}

//古籍选择关闭
function closeBookType() {
    $("#book-type").css("left","-1000px");
    setTimeout(function () {
        $("#book-type").hide();
    },300);
}
//古籍选择开启
function openBookType() {
    $("#book-type").show();
    setTimeout(function () {
        $("#book-type").css("left","0");
    },100);
}
//古籍选择清空
function clearBookType() {
    $("#book-type").find(".book-type-item").removeClass("book-type-item-active");
}
//古籍选择确认
function confirmBookType() {
    getBookParam();
    console.log(param);
    closeBookType();
    loadBook();
}
//古籍选择的点击
$(".book-type-item").on("click",function () {
    if ($(this).hasClass("book-type-item-active")){
        $(this).removeClass("book-type-item-active")
    } else {
        $(this).parent().parent().parent().find(".book-type-item").removeClass("book-type-item-active");
        $(this).addClass("book-type-item-active");
    }
});

//加载到底部时再次加载
$(document).ready(function () {
    window.addEventListener("scroll",function(e){
        if (($(document).scrollTop() + 1) >= ($(document).height() - $(window).height())) {
            if (ALL_LOAD){
                loadBookErrorDo(false);
            } else {
                loadBookData(false);
            }
        }
    });
});

//古籍点击事件
function pageBookSrc(id) {
    window.location.href = 'bookSrc.html?id=' + id;
}
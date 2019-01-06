$(function () {
    //接收从搜索框里传送过来的数据，因为数据经过了浏览器加密，所以需要解密出来
    var key = getQueryString('proName');
    var page = 1;
    //将ajax的data数据提成全局变量
    var obj = {
        proName: key,
        page: page,
        pageSize: 2
    };
    //页面一加载完毕，就请求数据
    getProduct(obj);

    //点击价格和销量按钮，请求后台数据可以进行升序降序排列
    $('.mui-card-header a').on('tap', function () {
        //获取点击的按钮名称及排序方式，默认为升序1
        var name = $(this).data('name');
        var sort = $(this).data('sort');
        sort = sort == 1 ? 2 : 1;
        //判断当前的排序，如果当前sort等于升序1，则变成2降序，否则反之
        $(this).data('sort', sort);
        //发送ajax请求后台数据,将点击按钮的名称加进obj的对象属性里，等于sort的排序值
        obj[name] = sort;
        //调用ajax函数
        getProduct(obj);
        //每次点击后，将之前的name属性的值改为‘’空字符串，否则后面点击的都会以前面的数据为准；
        obj[name] = '';

        //点击某个a标签时，将它的字体颜色变为红色
        $(this).addClass('active').siblings().removeClass('active');
        //判断i的类名是向上还是向下，向下则改为向上，否则反之
        if ($(this).find('i').hasClass('fa fa-angle-down')) {
            $(this).find('i').removeClass('fa fa-angle-down').addClass('fa fa-angle-up');
        } else {
            $(this).find('i').removeClass('fa fa-angle-up').addClass('fa fa-angle-down');
        }
    })

    //在本页面的输入框输入需要搜索的数据时，点击按钮同样可以发送请求
    $('#main .btn-search').on('tap', function () {
        key = $('#main input').val().trim();
        //判断输入的内容是否为空，为空则不处理数据，弹出提示
        if (key == '') {
            mui.alert('输入有误，重新输入', '温馨提示', function () {

            });
        }
        //不为空，则请求ajax数据
        obj.proName = key;
        getProduct(obj);
    })



    //封装一个ajax请求数据函数
    function getProduct(obj) {
        //发送ajax请求后台数据
        $.ajax({
            url: '/product/queryProduct',
            data: obj,
            success: function (res) {
                var html = template('contentTpl', res);
                $('#main .mui-row').html(html);
            }
        })
    }

    //这是一个解析浏览器地址中文乱码的函数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }

    //上拉刷新，下拉加载数据
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                height: 50,//可选,默认50.触发下拉刷新拖动距离,
                auto: false,//可选,默认false.首次加载自动下拉刷新一次
                contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () {
                    setTimeout(function () {
                        $.ajax({
                            url: '/product/queryProduct',
                            data: {
                                proName: key,
                                page: 1,
                                pageSize: 2
                            },
                            success: function (res) {
                                var html = template('contentTpl', res);
                                $('#main .mui-row').html(html);
                                /* 定时器结束后，结束刷新 */
                                //此时再启用下拉刷新
                                mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                                //下拉刷新
                                mui('#refreshContainer').pullRefresh().refresh(true);
                            }
                        })
                    }, 1000);
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            },
            up: {
                height: 50,//可选.默认50.触发上拉加载拖动距离
                auto: false,//可选,默认false.自动上拉加载一次
                contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                callback: function () {
                    page++;
                    setTimeout(function () {
                        $.ajax({
                            url: '/product/queryProduct',
                            data: {
                                proName: key,
                                page: page,
                                pageSize: 2
                            },
                            success: function (res) {
                                //如果返回数组的长度大于0，证明有数据，可以继续添加
                                if (res.data.length > 0) {
                                    var html = template('contentTpl', res);
                                    $('#main .mui-row').append(html);
                                    /* 定时器结束后，结束加载 */
                                    //下次再开启加载
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                                } else {
                                    //否则则提示没有更多数据
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                }

                            }
                        })
                    }, 1000);
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    })
})
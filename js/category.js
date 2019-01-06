$(function () {
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false //是否显示滚动条
    });

    //发送ajax请求后台数据，返回给页面一级分类
    $.ajax({
        url: '/category/queryTopCategory',
        success: function (data) {
            var html = template('leftBrand', data);
            $('#main .left ul').html(html);
        }
    })

    var index;
    /* 给每个li一个点击事件，但是li是动态生成的，所以要创建事件委托*/
    $('#main .left ul').on('click', 'li', function () {
        /* 获取点击的li里面的id */
        index = this.dataset['id'];
        $(this).addClass('active').siblings().removeClass('active');
        /* 点击后调用页面二级分类函数 */
        rightBrand(index);
    })

    /* 页面加载完毕，就刷新第一页 */
    rightBrand(1);
    //发送ajax请求后台数据，返回给页面二级分类
    function rightBrand(index) {
        $.ajax({
            data: {
                id: index
            },
            url: '/category/querySecondCategory',
            success: function (data) {
                var html = template('rightBrand', data);
                $('#content .mui-row').html(html);
            }
        })
    }
   
    





    // /* 原生写法：点击左边的li，显示对应的内容盒子 */

    // //获取左边的li
    // var liList = document.querySelector('#brand').children;
    // //获取对应的内容盒子
    // var conList = document.querySelector('#content').children;

    // //遍历li，设置dataset的对象属性
    // for (var i = 0; i < liList.length; i++) {
    //     liList[i].dataset.id = i;
    //     //给每一个li一个点击事件
    //     liList[i].addEventListener('click', function () {
    //         //取到自定义属性id
    //         var index = this.dataset.id;
    //         //循环遍历，给每个li去掉active类名，给点击的这个li加上
    //         for (var i = 0; i < liList.length; i++) {
    //             liList[i].classList.remove('active');
    //         }
    //         liList[index].classList.add('active');
    //         ////循环遍历，给每个div默认隐藏，给点击的这个显示出来
    //         for(var j=0;j<conList.length;j++){
    //             conList[j].style.display='none';
    //         }
    //         conList[index].style.display='block';
    //     })
    // }
})
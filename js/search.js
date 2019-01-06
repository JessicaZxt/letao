$(function () {
    /* 创建一个空数组，将每次输入的内容添加到里面 */
    var arr = [];
    /* 点击搜索按钮时，判断搜索框里的内容是否为空，为空则弹出提示，不为空则显示搜索数据 */
    $('#main .btn-search').on('click', function () {
        //先获取本地存储localStorage
        arr = localStorage.getItem('data');
        arr = JSON.parse(arr) || [];

        //判断用户输入的内容是否为空
        var content = $('#main input').val().trim();
        //为空
        if (content == '') {
            mui.toast('输入有误，重新输入');
            return;
        } else {
            //不为空
            //判断内容是否重复，如果重复则删除，然后重新添加
            if (arr.indexOf(content) != -1) {
                arr.splice(arr.indexOf(content), 1);
            }
            /* 往数组里面添加内容 */
            arr.unshift(content);
            //转为字符串
            data = JSON.stringify(arr);
            //加进localStorage
            localStorage.setItem('data', data);

            /* 每次搜索完毕后，搜索框里的内容为空 */
            $('#main input').val('');
        }
        setLi();
        location='productlist.html?proName='+content;
    })

    //定义一个函数，给页面添加数据
    function setLi() {
        var arr = localStorage.getItem('data');
        arr = JSON.parse(arr);
        //调用模板
        var html = template('tableView', { list: arr });
        console.log(html);
        //获取内容区的ul
        $('#main .mui-table-view').html(html);
    }
    setLi();

    //点击清空记录，删除ul里面的元素
    $('#main .btn-clear').on('click', function () {
        localStorage.clear();
        setLi();
    })

    //点击x按钮，删除单条记录
    //因为元素是异步添加的，所以要使用事件委托，给父元素点击事件委托到子元素上
    $('#main .mui-table-view').on('click', '.btn-li', function () {
        //先取出localstorage里面的本地存储
        var arr = localStorage.getItem('data');
        //转为js数据
        arr = JSON.parse(arr);
        //遍历这个数组，查找点击的span父元素的内容在存储的位置，然后删除
        var content = $(this).parent().prop('firstChild').nodeValue;
        content = content.trim();
        console.log(arr.indexOf(content));
        arr.splice(arr.indexOf(content), 1);
        var data = JSON.stringify(arr);
        localStorage.setItem('data', data);
        setLi();
    })


})
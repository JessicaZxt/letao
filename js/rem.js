setHtmlFontSize();
function setHtmlFontSize() {
    /* 假设设计稿大小 */
    var desiginWidth = 750;
    /* 假设设计稿元素大小 */
    var designFontSize = 200;
    /* 获取当前屏幕的宽度 */
    var windowWidth = document.documentElement.offsetWidth;
    /* 计算当前屏幕的根元素大小 */
    var nowFontSize = windowWidth / (desiginWidth / designFontSize);
    /* 设置到当前html元素上的font-size */
    document.documentElement.style.fontSize = nowFontSize + 'px';
}

window.addEventListener('resize',setHtmlFontSize);
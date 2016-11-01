var requests = require('../../requests/request.js');
var utils = require('../../utils/util.js');
//刷新动态球颜色
var iconColor = [
    '#353535', '#888888'
];

Page({
    data: {
        scrollHeight: 0, //scroll-view高度
        pageIndex: 0, //页码
        totalRecord: 0, //图书总数
        isInit: true, //是否第一次进入应用
        loadingMore: false, //是否正在加载更多
        footerIconColor: iconColor[0], //下拉刷新球初始颜色
        pageData: [], //图书数据
        searchKey: null //搜索关键字
    },
    onShow: function() {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({ scrollHeight: res.windowHeight - 40 });
            }
        });
    },
    //搜索输入框输入取值
    searchInputEvent: function(e) {
        this.setData({ searchKey: e.detail.value });
    },
    //搜索按钮点击事件
    searchClickEvent: function(e) {
        if (!this.data.searchKey)
            return;
        this.setData({ pageIndex: 0, pageData: [] });
        requestData.call(this);
    },
    //下拉请求数据
    scrollLowerEvent: function(e) {
        requestData.call(this);
    },
    //跳转到详情页
    toDetailPage: function(e) {
        var bid = e.currentTarget.dataset.bid; //图书id [data-bid]
        wx.navigateTo({
            url: '../detail/detail?id=' + bid
        });
    }
});

/**
 *请求图书信息
 */
function requestData() {
    var _this = this;
    var q = this.data.searchKey;
    var start = this.data.pageIndex;

    this.setData({ loadingMore: true, isInit: false });
    updateRefreshBall.call(this);

    requests.requestSearchBook({ q: q, start: start }, (data) => {
        if (data.total == 0) {
            //没有记录
            _this.setData({ totalRecord: 0 });
        } else {
            _this.setData({
                pageData: _this.data.pageData.concat(data.books),
                pageIndex: start + 1,
                totalRecord: data.total
            });
        }
    }, () => {
        _this.setData({ totalRecord: 0 });
    }, () => {
        _this.setData({ loadingMore: false });
    });
}

/**
 * 刷新下拉效果变色球
 */
function updateRefreshBall() {
    var cIndex = 0;
    var _this = this;
    var timer = setInterval(function() {
        if (!_this.data['loadingMore']) {
            clearInterval(timer);
        }
        if (cIndex >= iconColor.length)
            cIndex = 0;
        _this.setData({ footerIconColor: iconColor[cIndex++] });
    }, 100);
}
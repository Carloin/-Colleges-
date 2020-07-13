// pages/my_publish/my_publish.js
var page = 1;
var app = getApp();
var list = [];
var index = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    Goods: [],
    title: '',
    multiArray: [['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19', 'c20'], [101, 102, 103, 104, 105, 106, 107, 108, 109, 201, 202, 203, 204, 205, 206, 207, 208, 209, 301, 302, 303, 304, 305, 306, 307, 308, 309, 401, 402, 403, 404, 405, 406, 407, 408, 409, 501, 502, 503, 504, 505, 506, 507, 508, 509, 601, 602, 603, 604, 605, 606, 607, 608, 609,]],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    })
    console.log(this.data.userInfo)
    var isLogin = app.checkLogin();
    if (isLogin)
      that.GoodsShow();
  },

  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    var that = this;
    page++;
    that.GoodsShow();
  },

  GoodsShow: function () {
    var that = this;
    wx.request({
      method: 'GET',
      url: 'http://47.115.48.3:8080/order/seller/' + app.globalData.openId,
      header: {
        'content-type': 'json' //默认值
      },
      success: function (res) {
        var str = JSON.stringify(res.data.rows)
        var data = JSON.parse(str)
        console.log("selled_info:" + str)
        that.setData({
          Goods : data
        })
      },
      fail: function (res) {
        console.log(res.errMsg);
      }
    })
  },

  edit: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    console.log(id);
    var address = that.data.Goods[id].address
    console.log("index:" + that.data.Goods[id])
    console.log("index:" + address)
    if (address == null) {
      //index = address.split(",")
      wx.showActionSheet({
        itemList: ["卖家信息", "地址: 未填写地址", "手机: " + that.data.Goods[id].phone, "邮箱:  " + that.data.Goods[id].email],//显示的列表项
        success: function (res) {//res.tapIndex点击的列表项
          // console.log("点击了列表项：" + that[res.tapIndex])
        }
      })
    } else {
      index = address.split(",")
      wx.showActionSheet({
        itemList: ["买家信息","地址: " + that.data.multiArray[0][index[0]] + ", " + that.data.multiArray[1][index[1]], "手机: " + that.data.Goods[id].phone, "邮箱:  " + that.data.Goods[id].email],//显示的列表项
        success: function (res) {//res.tapIndex点击的列表项
          // console.log("点击了列表项：" + that[res.tapIndex])
        }
      })
    }
  },
})
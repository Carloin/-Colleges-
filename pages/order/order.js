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
    status: 1,
    multiArray: [['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19', 'c20'], [101, 102, 103, 104, 105, 106, 107, 108, 109, 201, 202, 203, 204, 205, 206, 207, 208, 209, 301, 302, 303, 304, 305, 306, 307, 308, 309, 401, 402, 403, 404, 405, 406, 407, 408, 409, 501, 502, 503, 504, 505, 506, 507, 508, 509, 601, 602, 603, 604, 605, 606, 607, 608, 609,]],
    phone:'',
    email:'',
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
    console.log(app.globalData.openId)
    wx.request({
      method: 'GET',
      url: 'http://47.115.48.3:8080/order/buyer/' + app.globalData.openId,
      header: {
        'content-type': 'json' //默认值
      },
      data: {
        
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          Goods: res.data.rows
        })
      },
      fail: function (res) {
        console.log("order:" + res.errMsg);
      }
    })
  },

  edit: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '请确定收货吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            method: 'GET',
            url: 'http://47.115.48.3:8080/order/confirm/' + id,
            header: {
              'content-type': 'json' //默认值
            },
            success: function (res) {
              console.log(res.data);
              console.log("确认收货成功");
              // 1.第一种方法
              that.GoodsShow();
              // 2.第二种方法
              // that.setData({
              //   list: res.data.rows,
              //   title: res.data.rows.title
              // })
            }, fail: function () {
              wx.showToast({
                title: '确认收货失败',
                icon: 'loading',
                duration: 2000,
              })
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  goods_delete: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          let id = e.currentTarget.dataset.id;
          console.log(id);
          wx.request({
            method: 'GET',
            url: 'http://47.115.48.3:8080/order/cancel/' + id,
            header: {
              'content-type': 'json' //默认值
            },
            success: function (res) {
              console.log(res.data);
              console.log("取消成功");
              // 1.第一种方法
              that.GoodsShow();
              // 2.第二种方法
              // that.setData({
              //   list: res.data.rows,
              //   title: res.data.rows.title
              // })
            }, fail: function () {
              wx.showToast({
                title: '取消失败',
                icon: 'loading',
                duration: 2000,
              })
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  catchTapCategory:function(e){
    var that = this;
    let id = e.currentTarget.dataset.index;
    var address = that.data.Goods[id].address
    console.log("index:" + that.data.Goods[id])
    console.log("index:" + address)
    if(address == null){
      //index = address.split(",")
      wx.showActionSheet({
        itemList: ["卖家信息","地址: 未填写地址", "手机: " + that.data.Goods[id].phone, "邮箱:  " + that.data.Goods[id].email],//显示的列表项
        success: function (res) {//res.tapIndex点击的列表项
          // console.log("点击了列表项：" + that[res.tapIndex])
        }
      })
    }else{
      index = address.split(",")
      wx.showActionSheet({
        itemList: ["卖家信息","地址: " + that.data.multiArray[0][index[0]] + ", " + that.data.multiArray[1][index[1]] , "手机: " + that.data.Goods[id].phone, "邮箱:  " + that.data.Goods[id].email],//显示的列表项
        success: function (res) {//res.tapIndex点击的列表项
          // console.log("点击了列表项：" + that[res.tapIndex])
        }
      })
    }
  }
})
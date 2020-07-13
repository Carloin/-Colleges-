// pages/my_publish/my_publish.js
var page = 1;
var app = getApp();
var list = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    Goods:[],
    title:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad");
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    })
    console.log("testetst"+this.data.userInfo)
    var isLogin = app.checkLogin();
    if (isLogin)
      page = 1;
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
      url: 'http://47.115.48.3:8080/item/my_publish?uid='+app.globalData.openId+'&page='+page+'&rows=8',
      header: {
        'content-type': 'json' //默认值
      },
      success: function (res) {
        console.log("GoodsShowtest1" + res.data)
        // console.log(res.data.rows)
        // that.setData({
        //   list: res.data.rows
        // })
        if (res.data.rows.length > 0) {
          if (page == 1) {
            list = res.data.rows;
          } else {
            list = list.concat(res.data.rows)
          }
          that.setData({
            Goods: list
          })
          console.log("GoodsShowtest2" + that.data.Goods);
      }else{
        // that.setData({
        //   hidden : true
        // })
        wx.showToast({
          title: '暂无更多内容',
          icon: 'loading',
          duration: 2000
        })
      }
      },
      fail:function(res){
        console.log(res.errMsg);
      }
    })
  },

  edit:function(e){
    let id = e.currentTarget.dataset.id;
    console.log(e.currentTarget.dataset);
    wx.navigateTo({ url: '../edit/edit?id=' + id})
  },

  goods_delete:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要下架吗？',
      success: function (sm) {
        if (sm.confirm) {
          let id = e.currentTarget.dataset.id;
          console.log("id:"+ id);
          wx.request({
            method: 'GET',
            url: 'http://47.115.48.3:8080/item/delete/' + id,
            header: {
              'content-type': 'json' //默认值
            },
            success: function (res) {
              console.log(res.data);
              console.log("下架成功");
              // 1.第一种方
              page = 1;
              that.GoodsShow();
              wx.showToast({
                title: '下架成功',
                icon: 'success',
                duration: 1000,
              })
              // 2.第二种方法
              // that.setData({
              //   list: res.data.rows,
              //   title: res.data.rows.title
              // })
            }, fail: function (res) {
              console.log(res.errMsg)
              wx.showToast({
                title: '下架失败',
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
  }
})
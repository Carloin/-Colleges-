
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personalSign: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    if (app.globalData.userInfo) {
      this.setData({
        personalSign: app.globalData.pernalSign,
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            personalSign: app.globalData.pernalSign,
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // console.log("获取缓存" + wx.getStorageSync(app.globalData.pernalSign));
    console.log("app.globalData.pernalSign:" + app.globalData.pernalSign);
  },
  //显示个性签名
onShow:function(){
  console.log("个性签名:" + app.globalData.pernalSign);
this.setData({
  personalSign: app.globalData.pernalSign,
})
},

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  my_publish:function(){
    wx.navigateTo({
      url: '../my_publish/my_publish'})
    },

  PersonalInfo:function(){
    wx.navigateTo({
      url: '../personal_info/info'})
  },
  orderInfo: function () {
    wx.navigateTo({
      url: '../order/order'
    })
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../personal_info/info'
    })
  },
  selledInfo: function () {
    wx.navigateTo({
      url: '../selled_info/index'
    })
  },

  exit_number:function(){
    wx.showModal({
      title: '提示',
      content: '是否确认退出',
      success: function (res) {
        if (res.confirm) {
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})
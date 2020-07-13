//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success:function(res) {
        console.log("res:" + res.code)
        var id = that.getNeededUserInfo(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("that.globalData.openId2:" + id)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getNeededUserInfo: function (code) {
    var that = this;
    var id = '';
    　wx.request({
       url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx2bc2b4f1c54972ad&secret=40e4cdc634802e705b1f73d1cef49879&js_code='+code+'&grant_type=authorization_code',
      　method: 'POST',
      　data: {
        　　code: code
      　},
      success: function (res) {
        var str = JSON.stringify(res)
        var str2 = JSON.parse(str)
        console.log("res.unionid：" + str2.data.openid)
        that.globalData.openId = str2.data.openid　　　　　　// 可以返回前端需要的用户信息（包括unionid、openid、user_id等）
       
        that.checkUserMeg(str2.data.openid);
      　　}
    　})
  },

  checkUserMeg: function (id){
    var that = this;
    wx.request({
      method: 'GET',
      url: 'http://47.115.48.3:8080/user/find/' + id,
      header: {
        'content-type': 'json' //默认值
      },
      success: function (res) {
        var str = JSON.stringify(res.data)
        var data = JSON.parse(str);
        that.globalData.pernalSign = data.data.catchword;
        if (res.data.status == 200) {
          console.log("该用户已存在。")
        } else if (res.data.status == 500) {
          wx.showModal({
            title: '个人信息',
            content: '您尚未完成您的个人信息',
            showCancel: false,
            confirmText: "立即前往",//默认是“确定”
            confirmColor: 'skyblue',//确定文字的颜色
            success: function (res) {
              wx.redirectTo({
                url: '../personal_info/info',
              })
            },
            fail: function (res) { },//接口调用失败的回调函数
            complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg);
      }
    })
  },


  myData: {
    userInfo : ''
  },
  globalData: {
    userInfo: '',
    openId: '',
    pernalSign:''
  },

  checkLogin:function(){
    console.log("this.globalData.userInfo" + this.globalData.userInfo)
    console.log("this.globalData.openId" + this.globalData.openId)
    if(this.globalData.userInfo == '' || this.globalData.openId == ''){
      wx.showModal({
        title: '提示',
        content: '您还没登录，是否前往登录',
        cancelText: "否",//默认是“取消”
        cancelColor: 'skyblue',//取消文字的颜色
        confirmText: "是",//默认是“确定
        success: function (sm) {
          if (sm.confirm) {
            wx.switchTab({
              url: '../my_home/my_home',
            })
          } else if (sm.cancel) {
            console.log('用户点击取消')
            return false;
          }
        }
      })
    }else{
      return true;
    }
  },
  
  logout:function(){
    wx.removeStorageSync('logs');
  }

})
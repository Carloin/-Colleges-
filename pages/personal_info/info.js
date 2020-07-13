// pages/personal_info/info.js
var app = getApp();
var address_list = [];
var openId = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wechat: '',
    idCard: '',   //日期
    multiArray: [['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19', 'c20'], [101, 102, 103, 104, 105, 106, 107, 108, 109, 201, 202, 203, 204, 205, 206, 207, 208, 209, 301, 302, 303, 304, 305, 306, 307, 308, 309, 401, 402, 403, 404, 405, 406, 407, 408, 409, 501, 502, 503, 504, 505, 506, 507, 508, 509, 601, 602, 603, 604, 605, 606, 607, 608, 609,]],
    multiIndex: [-1, -1],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    email: '',      //邮箱
    phone: '',      //电话
    personSign: ''  //个性签名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    openId = app.globalData.openId;
    console.log(app.globalData.openId)
    that.setData({
      wechat: app.globalData.userInfo.nickName
    })
    if (app.globalData.userInfo) {
      this.setData({
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
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if(app.checkLogin){
      that.MegShow();
    }
  },

  inputWechat: function (e) {
    this.setData({
      wechat: e.detail.value
    })
    console.log(e.detail.value)
  },

  idCardInput: function (e){
    console.log("身份证test" + e.detail.value)
    var test = e.detail.value
    console.log("testtest"+test)
    this.setData({
      idCard: e.detail.value
    })
    //console.log("身份证" + idCard)
  },
  //地址选择
  changeMultiPicker: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
    console.log(this.data.multiArray[0][e.detail.value[0]], this.data.multiArray[1][e.detail.value[1]])
  },
  inputEmail: function (e) {
    console.log("email:" + e.detail.value);
    this.setData({
      email: e.detail.value
    })
  },
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  personSignInput: function (e) {
    this.setData({
      personSign: e.detail.value
    })
  },

  checkAll: function () {
    var that = this
    //手机号码正则表达式
    var phone_test = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    var email_test = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
    var idCard_test = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
   
    if (that.data.multiIndex[0] == -1 || that.data.multiIndex[1] == -1) {
      wx.showModal({
        title: '地址',
        content: '地址不得为空',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    }
    if (that.data.wechat == '') {
      wx.showModal({
        title: '昵称',
        content: '昵称不能为空',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    } 
    if (that.data.phone == '') {
      wx.showModal({
        title: '手机号码',
        content: '手机号码不能为空',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    } 
    else if (!phone_test.test(that.data.phone)) {
      wx.showModal({
        title: '手机号码',
        content: '请输入正确的手机号码',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    }
    //邮箱正则表达式
    if (that.data.email == '')
      return true;
    else if (!email_test.test(that.data.email)) {
      wx.showModal({
        title: '邮箱',
        content: '请输入有效的邮箱',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    }
    if (that.data.idCard == '')
      return true;
   
    else if (!idCard_test.test(that.data.idCard)) {
      wx.showModal({
        title: '身份证',
        content: '请输入有效的身份证',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    }
    return true;
   
  },

  submitMeg:function(){
    var that = this;
    var address = that.data.multiIndex[0] + "," +  that.data.multiIndex[1];
    console.log("openId: " + openId)
    console.log("username: " + that.data.wechat)
    console.log("myidcardtest: " + that.data.idCard)
    if(that.checkAll())
      wx.request({
        method: 'POST',
        url: 'http://47.115.48.3:8080/user/rou/',
        header: {
          'content-type': 'application/x-www-form-urlencoded'//默认值
        },
        data: {
          id: openId,
          username:that.data.wechat,
          email: that.data.email,
          catchword : that.data.personSign,
          idCard: that.data.idCard,
          address: address,
          phone: that.data.phone
        },
        success: function (res) {
          app.globalData.pernalSign = that.data.personSign;
          console.log(app.globalData.pernalSign)
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000,
          })
        // // 设置缓存
        //   console.log('缓存', wx.getStorageSync(app.globalData.pernalSign))
          wx.switchTab({
            url: '../my_home/my_home',
          })
        }, fail: function () {
          wx.showToast({
            title: '连接出现问题',
            icon: 'loading',
            duration: 2000,
          })
        }
      })
  },

   MegShow:function(){
    var that = this;
    wx.request({
      method: 'GET',
      url: 'http://47.115.48.3:8080/user/find/' + openId,
      header: {
        'content-type': 'json' //默认值
      },
      data: {
        
      },
      success: function (res) {
        var list = res.data;
        var str = JSON.stringify(list)
        var data = JSON.parse(str);
        var address = data.data.address;
     
      
        // console.log("str:" + str)
        // console.log("data:" + data)
        address_list = address.split(",");
        console.log(address_list[0],address_list[1])
        app.globalData.pernalSign = data.data.catchword;
        console.log(app.globalData.pernalSign)
        //显示身份证
        // console.log("身份证：" + data.data.idCard)
        // console.log("身份证长度：" + data.data.idCard.length)
        // console.log("身份证字符串截取：" + data.data.idCard.substring(0, 4))
        // console.log("身份证字符串截取2：" + data.data.idCard.substring(14, 18))
        that.setData({
          email: data.data.email,
          personSign: data.data.catchword,
          wechat: data.data.username,
          multiIndex: address_list,
          phone: data.data.phone,
          idCard: data.data.idCard
        })
      }, fail: function () {
        wx.showToast({
          title: '连接似乎出现问题',
          icon: 'loading',
          duration: 2000,
        })
      }
    })
  }
})
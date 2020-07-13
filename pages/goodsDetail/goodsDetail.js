
var list = [];
var img_list = [];
var str = '';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : '',
    goods:[],
    phone:null,
    desc:[], 
    username:'',
    isLike: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sid = options.goodsid;
    var that = this
    that.setData({
      id : sid,
    })
    that.GoodsDetail();
  },

  GoodsDetail: function () {
    var that = this;
    wx.request({
      method: 'GET',
      url: 'http://47.115.48.3:8080/item/detail/' + this.data.id,
      header: {
        'content-type': 'json' //默认值
      },
      success: function (res) {
        console.log(res.data);
        list = res.data;
        str = res.data.item_desc;
        console.log("res.data.itemDesc: " + str)
        //获取图片列表进行分割
        img_list = str.split(",");
        // console.log(res.data.user);
        // // console.log(res.data.desc);
        that.setData({
          goods: list,
          phone: res.data.phone,
          desc: img_list,
          username:res.data.username,
        })
        // console.log(that.data.desc);
      }
    })
  },

  contact:function(){
      wx.showModal({
        title: '联系电话',
        content: this.data.phone, 
        showCancel:false,
      })
  },

  addLike:function() {
    var that = this;
    var flag = app.checkLogin();
    if(flag){
      wx.request({
        method: 'POST',
        url: 'http://47.115.48.3:8080/order/save',
        header: {
          'content-type': 'application/x-www-form-urlencoded'//默认值
        },
        data: {
          userId: app.globalData.openId,
          itemId: that.data.id,
          title: that.data.goods.title,
          price: that.data.goods.price,
          picPath: that.data.desc[0],
        },
        success: function (res) {
          wx.showToast({
            title: '订购成功',
            icon: "success",
            duration: 2000
          })
          that.setData({
            isLike: !that.data.isLike
          })
        }
      })
    }
  },
})
var list = [];
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagelist: [],
    // items:[{name:'y',value:'是'},{name:'n',value:'否',checked:'true'}],
    price_botton: true,
    negotiation_botton: false,
    selectShow: false,
    selectData: [],
    index: -1,
    index2: -1,
    // pub_phone: '',
    pub_title: '',
    pub_text: '',
    pub_price: '',
    price_result: '',   //价钱的正则表达式结果
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //that.image();
    //console.log(app.globalData.userInfo)
    var isLogin = app.checkLogin(); 
  },

  //商品名称
  pub_nameInput: function(e) {
    var that = this;
    var title = e.detail.value;
    that.setData({
      pub_title : title
    })
  },

  //商品细节
  pub_texts: function(e) {
    var that = this;
    var text = e.detail.value;
    that.setData({
      pub_text:text
    })
  },

  //商品具体价格
  price_texts:function(e){
    var that = this;
    var price = e.detail.value;
      that.setData({
        pub_price: price
      })
  },

  //商品联系方式
  // phone_Input:function(e){
  //   var that = this;
  //   var phone = e.detail.value;
  //   console.log(phone);
  //   that.setData({
  //     pub_phone: phone
  //   })
  // },
  // 获取商品类型
  selectTap(e) {
    this.setData({
      selectShow: !this.data.selectShow,
    });
    var that = this;
    wx.request({
      method: 'GET',
      url: 'http://47.115.48.3:8080/item/cat/list',
      header: {
        'content-type': 'json' //默认值
      },
      success: function (res) {
        var list = res.data;
        console.log(list);
        that.setData({
          selectData: list
        })
      }
    })
  },
  optionTap(e) {
    //商品类型下标
    let Index = e.currentTarget.dataset.index;
    console.log(Index);
    this.setData({
      index: Index,
      selectShow: !this.data.selectShow
    });
  },

  price_action: function() {
    this.setData({
      price_botton: true,
      negotiation_botton: false
    })
  },
  negotiation_action: function() {
    this.setData({
      negotiation_botton: true,
      price_botton: false,
    })
  },


  // 获取访问相册的功能
  image: function() {
    var that = this
    wx.showActionSheet({
      itemList: ['从手机相册选择', '拍照'],
      success: function(res) {
        console.log("tapIndex:" + res.tapIndex)
        wx.chooseImage({
          count: 9, // 默认9
          success: function(res) {
            //console.log("cancel:" + res.cancel)
            if (!res.cancel) {
              if (res.tapIndex == 0) {
                that.chooseWxImageShop('album')
              } else if (res.tapIndex == 1) {
                that.chooseWxImageShop('camera')
              }
            }
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var image_list = that.data.imagelist;
            // console.log("image_list:" + image_list.length)
            if(image_list.length < 9){
              var filePaths = res.tempFilePaths
              console.log("res.tempFilePaths:" + filePaths +"\n图片的长度为："+ filePaths.length)
              for (var i = 0; i < filePaths.length;i++){
                console.log("filePaths[i]" + filePaths[i])
                that.upload_file('http://47.115.48.3:8080/pic/upload', filePaths[i])
              }
            }else{
              wx.showToast({
                title: '最多九张图片',
                image: '../../images/fail.png',
                duration: 3000
              })
            }
          }
        })
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  // 调用手机相册还是相机
  chooseWxImageShop: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {}
    })
  },
  upload_file: function (url, filePath) {

    var that = this;
    console.log("文件路径"+filePath);
    wx.uploadFile({
      url: url,
      filePath: filePath,
      name: 'uploadFile',
      header: {
      //  'content-type': 'json',
        'content-type': 'multipart/form-data'
        // 'content-type':'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      // formData: { 'shopId': wx.getStorageSync('shopId') }, // HTTP 请求中其他额外的 form data
      success: function (res) {
        var jsonObj = JSON.parse(res.data);
        
        console.log("接受结束"+res.data)
        console.log("接受的url:" + jsonObj.url)
        // list = list.concat(jsonObj.url)
        // console.log("接受url后的imagelist为：" + list)
        that.setData({
          imagelist: that.data.imagelist.concat(jsonObj.url)
        })
        //  console.log(this.data.imagelist);
        
      },
      fail: function (res) {
        console.log("上传失败"+res.errMsg)
      }
    })
  },

// 触发发布按钮
  pub_button:function(){
    var that = this;
    var isLogin = app.checkLogin();   //检查是否登录
    var image_str = this.data.imagelist.join(",");
    console.log("image_str:",image_str);
    if (isLogin){
      var flag = that.checkAll(image_str);
      if(flag){
        var image_first = this.data.imagelist[0].toString();
        console.log(image_first);
        var pub_title = that.removeXss(this.data.pub_title);
        var pub_text = that.removeXss(this.data.pub_text);                                            
        wx.request({
          method: 'POST',
          url: 'http://47.115.48.3:8080/item/save',
          header: {
            'content-type': 'application/x-www-form-urlencoded'//默认值
          },
          data:{
              uid:app.globalData.openId,
              cid:this.data.index,
              title: pub_title,
              sellPoint:pub_text,
              price : this.data.pub_price,
              num:'1',
              // barcode:'123123',
              image: image_first,
              desc:image_str,
              // phone: this.data.pub_phone,
              // id: this.data.index,
              // imagelist:this.data.imagelist
          },
          success: function (res) {
            console.log(res.data)
            //刷新数据
            that.setData({
              imagelist: [],
              pub_title: '',
              pub_text: '',
              // pub_phone: '',
              pub_price: '',
              index: -1
            })
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 3000
            })  
          },
          fail:function(res){
            wx.showToast({
              title: '发布失败',
              image: '../../image/close.png',
              duration: 3000
            })  
          }
        })
       }
     }
  },
  //删除照片
  deleteImvBanner: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          var image_list = that.data.imagelist;
          console.log("e.value.id:" + index);
          image_list.splice(index, 1);
          that.setData({
            imagelist: image_list
          })
          console.log("删除后的imagelist为:" + that.data.imagelist);
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  checkAll: function (image_str){
    //手机号码正则表达式
    var phone_test = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    var price_test = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
    if (image_str == '') {
      wx.showModal({
        title: '照片',
        content: '至少一张照片',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    }
    if (this.data.pub_title == ''){
      wx.showModal({
        title: '商品名称',
        content: '商品名称不能为空',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    }
    if (this.data.pub_text == '') {
      wx.showModal({
        title: '商品细节',
        content: '商品细节不能为空',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    }
    // if (this.data.pub_phone == '') {
    //   wx.showModal({
    //     title: '手机号码',
    //     content: '手机号码不能为空',
    //     showCancel: false,//是否显示取消按钮
    //   })
    //   return false;
    // } else if (!phone_test.test(this.data.pub_phone)) {
    //   wx.showModal({
    //     title: '手机号码',
    //     content: '请输入正确的手机号码',
    //     showCancel: false,//是否显示取消按钮
    //   })
    //   return false;
    // }
    //价格正则表达式
    if (this.data.pub_price == '') {
      wx.showModal({
        title: '价格',
        content: '价格不能为空',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    } else if (!price_test.test(this.data.pub_price)) {
      console.log(this.data.price)
      wx.showModal({
        title: '价格',
        content: '请输入有效的价格',
        showCancel: false,//是否显示取消按钮
      })
      return false;
    }
    return true;
  },
  removeXss: function (val) {
    var parttern = '';
    val = val.replace(/([\x00-\x08][\x0b-\x0c][\x0e-\x20])/g, '');

    var search = 'abcdefghijklmnopqrstuvwxyz';
    search += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    search += '1234567890!@#$%^&*()';
    search += '~`";:?+/={}[]-_|\'\\';

    for (var i = 0; i < search.length; i++) {
      var re = new RegExp('(&#[x|X]0{0,8}' + parseInt(search[i].charCodeAt(), 16) + ';?)', 'gi');
      val = val.replace(re, search[i]);
      re = new RegExp('(&#0{0,8}' + search[i].charCodeAt() + ';?)', 'gi');
      val = val.replace(re, search[i]);
    }

    var ra1 = ['javascript', 'vbscript', 'expression', 'applet', 'meta', 'blink', 'link', 'script', 'embed', 'object', 'iframe', 'frame', 'frameset', 'ilayer', 'layer', 'bgsound', 'title'];
    var ra2 = ['onabort', 'onactivate', 'onafterprint', 'onafterupdate', 'onbeforeactivate', 'onbeforecopy', 'onbeforecut', 'onbeforedeactivate', 'onbeforeeditfocus', 'onbeforepaste', 'onbeforeprint', 'onbeforeunload', 'onbeforeupdate', 'onblur', 'onbounce', 'oncellchange', 'onchange', 'onclick', 'oncontextmenu', 'oncontrolselect', 'oncopy', 'oncut', 'ondataavailable', 'ondatasetchanged', 'ondatasetcomplete', 'ondblclick', 'ondeactivate', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'onerror', 'onerrorupdate', 'onfilterchange', 'onfinish', 'onfocus', 'onfocusin', 'onfocusout', 'onhelp', 'onkeydown', 'onkeypress', 'onkeyup', 'onlayoutcomplete', 'onload', 'onlosecapture', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onmove', 'onmoveend', 'onmovestart', 'onpaste', 'onpropertychange', 'onreadystatechange', 'onreset', 'onresize', 'onresizeend', 'onresizestart', 'onrowenter', 'onrowexit', 'onrowsdelete', 'onrowsinserted', 'onscroll', 'onselect', 'onselectionchange', 'onselectstart', 'onstart', 'onstop', 'onsubmit', 'onunload'];
    var ra = [].concat(ra1, ra2);

    var found = true;
    while (found == true) {
      var val_before = val;
      for (var i = 0; i < ra.length; i++) {
        var pattern = '';
        for (var j = 0; j < ra[i].length; j++) {
          if (j > 0) {
            pattern += '(';
            pattern += '(&#[x|X]0{0,8}([9][a][b]);?)?';
            pattern += '|(&#0{0,8}([9][10][13]);?)?';
            pattern += ')?';
          }
          pattern += ra[i][j];
        }
        parttern = new RegExp(pattern, 'gi');
        var replacement = ra[i].substr(0, 2) + '<x>' + ra[i].substr(2);
        val = val.replace(parttern, replacement);
        if (val_before == val) {
          found = false;
        }
      }
    }
    return val;
  },

})
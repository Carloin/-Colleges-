// pages/home/search/search.js
var list = [];
var page = 1;
var flag = true;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue : null,
    Goods:[],
    hidden:false,
    nodes:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      searchValue : options.searchValue
    })
    page = options.page;
    console.log("page"+page)
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

  // onReady:function(){
  //   console.log("onReady()");
  // },

  GoodsShow: function () {
    var that = this;
    console.log(that.data.searchValue);
    if (that.data.searchValue == '') {
      console.log("true");
      //没有搜索词 友情提示
      that.setData({
        hidden: true
      })    
      console.log("搜索结果为空！");
      wx.showToast({
        title: '输入不得为空',
        image: '../../../images/noinput.png',
        duration: 2000,
      })
    }else{
      var search = that.removeXss(this.data.searchValue);
      console.log("searchXSS:" + search);
      wx.request({
        method: 'GET',
        url: 'http://47.115.48.3:8083/search/query?q='+search+'&page='+page+'&rows=8',
        header: {
          'content-type': 'json' //默认值
        },
        success: function (res) {
          var str = JSON.stringify(res.data)
          console.log("search:" + str);
          var data = JSON.parse(str)
          if (res.data.rows.length > 0) {
            if (page == 1) {
              list = res.data.rows;
            } else {
              list = list.concat(res.data.rows)
            }
            that.setData({
              Goods: list
            })
            if (res.data.rows.length < 4){
              that.setData({
                hidden: true
              })
            }
          } else {
            that.setData({
              hidden: true
            })
            wx.showToast({
              title: '暂无更多内容',
              icon: 'loading',
              duration: 1000
            })
          }
        },fail:function(){
          wx.showToast({
            title: '连接出错',
            icon: 'loading',
            duration: 2000
          })
        }
      })
    }
  },
  catchTapCategory: function (e) {
    var that = this;
    var goodsId = e.currentTarget.dataset.goodsid;
    //跳转商品详情
    wx.navigateTo({ url: '../../goodsDetail/goodsDetail?goodsid=' + goodsId })
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
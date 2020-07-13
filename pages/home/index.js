
var list = [];
var page = 1;
var ifLoadMore = true;
var cid = null;
var firstFlag = true;
Page({

  /**
   * 页面的初始数据
   */

  data: {
    Goods:[],           //首页显示商品的数组
    selectData: [],      //商品类型数组
    searchValue : '',   //搜索输入框的数据
    searchData:[],       //搜索出来后得到的数据
    hidden:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    that.selectTap();
    that.GoodsShow();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      var that = this;
      page++;
      if(ifLoadMore){
        firstFlag = false;
        that.GoodsShow();
      }else{
        that.optionTap();
        console.log("that.optionTap()");
      }
  },

  //搜索框文本内容显示
  inputBind: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
    console.log('bindInput' + this.data.searchValue)
  },

  GoodsShow: function(){
    if(firstFlag){
      page = 1;
    }
    var that = this;
    wx.request({
      method: 'GET',
      url: 'http://47.115.48.3:8080/item/list?page=' + page + '&rows=10',
      // url: 'http://123.57.248.22:8080/item/list?page=' + page + '&rows=10',x
      header: {
        'content-type': 'json' //默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.rows.length > 0) {
          if(page == 1){
            list = res.data.rows;
          }else{
            list = list.concat(res.data.rows)
          }
          that.setData({
            Goods: list
          })
          console.log(that.data.Goods);
        }else{
          that.setData({
            hidden : true
          })
          wx.showToast({
            title: '暂无更多内容',
            icon: 'loading',
            duration: 2000
          })
        }
      },
    })
  },
  catchTapCategory: function(e){
    var that = this;
    var goodsId = e.currentTarget.dataset.goodsid;
    //跳转商品详情
    wx.navigateTo({ url: '../goodsDetail/goodsDetail?goodsid='+goodsId })
  },

  headTap: function(opt){
    console.log(opt.id);
  },

  // 获取商品类型
  selectTap:function() {
    var that = this;
    wx.request({
      method: 'GET',
      url: 'http://47.115.48.3:8080/item/cat/list',
      header: {
        'content-type': 'json' //默认值
      },
      success: function (res) {
        var select_list = res.data;
        console.log(select_list);
        that.setData({
          selectData: select_list
        })
      }
    })
  },

  optionTap: function (e) {
     if(e != null){
      page = 1;
      let id = e.currentTarget.dataset.id;
      cid = id;
     }
    // page = 1;
    ifLoadMore = false;
    var that = this;
    wx.request({
      method: 'GET',
      url: 'http://47.115.48.3:8080/item/category?cid='+cid+'&page='+page+'&rows=8',
      header: {
        'content-type': 'json' //默认值
      },
      success: function (res) {
        console.log("who"+res.data.rows)
        if (res.data.rows.length > 0) {
          if (page == 1) {
            list = res.data.rows;
            // console.log("list:"+list)
          } else {
            list = list.concat(res.data.rows)
           
          }
          that.setData({
            Goods: list
          })
        } else {
          ifLoadMore = false;
          that.setData({
            hidden : true
          })
          wx.showToast({
            title: '暂无更多内容',
            icon: 'loading',
            duration: 1000
          })
        }
      }
    })
  },

  query:function(){
    var that = this;
    page = 1;
    console.log("input:" + that.data.searchValue);
    if(that.data.searchValue == null){
      console.log("change");
      that.setData({
        searchValue : ''
      })
    }
    wx.navigateTo({
      url: 'search/search?searchValue=' + that.data.searchValue + '&page=' + page,
    })
  },
// 软键盘搜索框触发查询事件
query_solf:function (e) {
  var that=this;
    page = 1;
    //var valuename=JSON.stringify(e.detail.value['search - input'] ?e.detail.value['search - input'] : e.detail.value )json传值
  var valuename=e.detail.value['search - input'] ?e.detail.value['search - input'] : e.detail.value 
  console.log('e.detail.value', valuename);

if(valuename == null){
  console.log("change");
  that.setData({
    searchValue : ''
  })
}
wx.navigateTo({
  url: 'search/search?searchValue=' + that.data.searchValue + '&page=' + page,
})
}

})
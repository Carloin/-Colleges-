// 声明api全局变量调用地址
const api = "http://47.115.48.3:8080/item";

function request(opt){
  wx.request({
    method: 'GET',
    url: api+opt.url,
    header: {
      'content-type': 'json' //默认值
    },
    data: opt.data,
    success: function (res) {
      if (res.data.code == 100) {
        if (opt.success) {
          opt.success(res.data);
        }
      } else {
        console.error(res);
        // wx.showToast({
        //   title: res.data.errMsg,
        // })
      }
    }
  })
}
module.exports.request = request
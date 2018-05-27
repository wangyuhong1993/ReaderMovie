function convertToStarsArray(stars) {
  // 十颗星亮一盏 
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    }
    else {
      array.push(0);
    }
  }
  return array;
}
function http(url,callback) {
  var that = this;
  // 显示加载中
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: url,
    data: {},
    success: function (res) {
      // console.log(res.data);
      callback(res.data);
      // 关闭加载中
      wx.hideLoading();
    },
    fail: function (error) {
      console.log("failed");
    },
    complete: function () {
      // complete
    }
  })
}
module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http
}
// pages/welcome/welcome.js
Page({
  // 跳转至首页
  onContainerTap:function(){
    wx.switchTab({
      url: '../post/post',
    })
  }
})
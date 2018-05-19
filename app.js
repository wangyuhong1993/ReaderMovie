//app.js
App({
  globalData: {
    g_isPlayingMusic: false,  //音乐播放状态
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  }
})
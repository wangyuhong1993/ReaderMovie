//app.js
App({
  globalData: {
    g_isPlayingMusic: false,  //音乐播放状态
    g_currentMusicPostId:null, // 当前播放id
    innerAudioContext:null, // 播放器对象
    doubanBase: "http://t.yushu.im" //豆瓣官网 
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  }
})
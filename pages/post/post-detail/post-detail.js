var postsData = require('../../../data/posts-data.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    postData:null, // 页面数据
    currentPostId:'', // 当前新闻id
    collected:false, // 未收藏
    isPlayingMusic:false, // 是否播放
    currentTime:'', // 播放时长
  },
  onLoad:function(option){
    var that = this;
    var innerAudioContext = app.globalData.innerAudioContext; // 全局播放器对象
    var postId = option.id;;  
    var postData = postsData.postList[postId]; // 新闻数据
    this.setData({
      currentPostId: postId, // 当前新闻id
      postData: postData
    })
    
    // 判断收藏是否存在
    var postsCollected = wx.getStorageSync("posts_collected");
    // 具有整体数据
    if (postsCollected){
      var postColected = postsCollected[postId];
      // 具有单个数据
      if (postColected){
        this.setData({
          collected: postColected
        })
      }else {
        // 无单个数据
        postsCollected[postId] = false;
        wx.setStorageSync("posts_collected", postsCollected);
      }
    }else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync("posts_collected", postsCollected);
    }
    
    // 全局播放器不存在
    if (!innerAudioContext){
      var innerAudioContext = wx.createInnerAudioContext(); // 播放器对象
      innerAudioContext.volume = 0.3;
      innerAudioContext.src = postsData.postList[postId].music.url;

      app.globalData.innerAudioContext = innerAudioContext;   
    }else {
      // 如果存在，直接暂停其他播放对象
      var innerAudioContext = app.globalData.innerAudioContext;
      innerAudioContext.src = postsData.postList[postId].music.url;
    }
   
    // 全局播放控制
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId ){
      this.setData({
        isPlayingMusic: true
      })
    }
  },
  // 添加收藏
  onColletionTap:function(event){
    var postsCollected = wx.getStorageSync("posts_collected");
    var postCollected = postsCollected[this.data.currentPostId];
    // 收藏变未收藏  未收藏变收藏
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    
    this.showToast(postsCollected, postCollected);
    // this.showModal(postsCollected, postCollected);
  },
  showToast: function (postsCollected, postCollected){
    // 更新文章是否有缓存值
    wx.setStorageSync("posts_collected", postsCollected);

    // 跟新数据绑定变量,从而实现切换图片
    this.setData({
      collected: postCollected
    })
    // 消息提示
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      icon: 'success',
      duration: 1000
    })
  },
  showModal: function (postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章？':'取消收藏该文章？',
      showCancel: "true",
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success: function (res) {
        if(res.confirm){
          // 更新文章是否有缓存值
          wx.setStorageSync("posts_collected", postsCollected);
          
          // 跟新数据绑定变量,从而实现切换图片
          that.setData({
            collected: postCollected
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 分享
  onShareTap: function(){
    var itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博'
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success:function(res){
        
      }
    })
  },
  // 音频播放
  onMusicTap: function(event){
    var isPlayingMusic = this.data.isPlayingMusic;
    var innerAudioContext = app.globalData.innerAudioContext;
    
    // 播放暂停
    if (isPlayingMusic){
      console.log(1);
      innerAudioContext.pause();
      console.log(innerAudioContext)
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    }else {
      console.log(2);
      innerAudioContext.play();
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = this.data.currentPostId;
    }

    this.setData({
      isPlayingMusic: !isPlayingMusic
    })

  }
})
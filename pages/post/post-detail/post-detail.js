var postsData = require('../../../data/posts-data.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    postData:null, // 页面数据
    currentPostId:'', // 当前新闻id
    collected:false, // 未收藏
    innerAudioContext:'', // 播放器对象
    isPlayingMusic:false, // 是否播放
    currentTime:'', // 播放时长
  },
  onLoad:function(option){
    var that = this;
    var postId = option.id;
    this.data.currentPostId = postId;  // 当前新闻id
    var postData = postsData.postList[postId];
    this.setData({
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

    var innerAudioContext = wx.createInnerAudioContext(); // 播放器对象
    this.setData({
      innerAudioContext: innerAudioContext
    })
    // 音频播放更新
    innerAudioContext.onStop(function(){
      that.setData({
        currentTime: innerAudioContext.currentTime
      })
    })

  },
  // 添加收藏
  onColletionTap:function(event){
    var postsCollected = wx.getStorageSync("posts_collected");
    var postCollected = postsCollected[this.data.currentPostId];
    console.log(this.data.currentPostId);
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
    var innerAudioContext = this.data.innerAudioContext;
    // 播放暂停
    if (isPlayingMusic){
      innerAudioContext.autoplay = false;
    }else {
      innerAudioContext.autoplay = true;
      innerAudioContext.src = 'http://dl.stream.qqmusic.qq.com/C400003baW852UMpHC.m4a?vkey=340BED4D51B6765A8CD75FE18FCF6B65C099178243A8B2DE221095E527C2DA3B7F2E3252DC5417178C6C33C510F8B292A33DCDE11D1A5F96&guid=7013596353&uin=0&fromtag=66';
      innerAudioContext.volume = 0.3;
      // innerAudioContext.seek = this.data.currentTime;
      console.log();
    }
    this.setData({
      isPlayingMusic: !isPlayingMusic
    })

  }
})
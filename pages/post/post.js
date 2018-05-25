// pages/post/post.js
var postData = require('../../data/posts-data.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    postList: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      postList:postData.postList
    })
  },
  // 列表跳转
  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: './post-detail/post-detail?id=' + postId
    })
  },
  // 轮播图跳转
  onSwiperTap: function (event) {
    // target 和 currentTarget
    // target指的是当前点击的组件 和 currentTarget 指的是事件捕获的组件
    // target这里指的是image,currentTarget指的是swiper
    var postId = event.target.dataset.postId;
    wx.navigateTo({
      url: './post-detail/post-detail?id=' + postId
    })
  }

})
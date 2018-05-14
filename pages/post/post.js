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
  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: './post-detail/post-detail?id=' + postId
    })
  }

})
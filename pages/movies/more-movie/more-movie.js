// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies:[], // 电影数据
    category:'', // 导航标题
    requestUrl: "", // 请求地址
    totalCount: 0, // 加载的总数量
    isEmpty:true, // 是否为空
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    this.setData({
      category: category
    })
    var dataUrl = "";
    switch(category){
      case "正在热映":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/in_theaters"; 
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/coming_soon"; 
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/top250"; 
        break;
    }
    this.setData({
      requestUrl: dataUrl
    });
    util.http(dataUrl, this.processDoubanData);

  },
  onReachBottom :function(){
    console.log("加载更多");
    var nextUrl = this.data.requestUrl+
      "?start=" + this.data.totalCount+"&count=20";
    util.http(nextUrl, this.processDoubanData);
  },
  onPullDownRefresh:function (event) {
    var refreshUrl = this.data.requestUrl +
      "?star=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.stopPullDownRefresh()
  },  
  processDoubanData: function(moviesDouban){
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length > 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        stars: util.convertToStarsArray(subject.rating.stars),
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
      }
      movies.push(temp);
    }    
    var totalMovies = {};
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies);
    }else{
      totalMovies = movies;
      this.data.isEmpty=false;
    }
    // 拼接的对象设置数据
    this.setData({
      movies: totalMovies
    });
    // 加载一次，起始数据加20
    this.data.totalCount+=20; 
  },
  onReady:function () {
    // 设置导航条条标题
    wx.setNavigationBarTitle({
      title: this.data.category
    })
  }
})
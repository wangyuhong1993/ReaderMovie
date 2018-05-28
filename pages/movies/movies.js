// pages/movies/movies.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters:{}, // 正在热映
    comingSoonUrl: {}, // 即将上映
    top250: {}, // top250
    searchResult: {}, // 搜索结果
    containerShow: true, // 电影列表显示
    searchPanelShow: false, // 电影搜索面板
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheatersUrl = app.globalData.doubanBase + 
    "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + 
    "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + 
      "/v2/movie/top250" + "?start=0&count=3";
    
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },
  onBindFocus: function(){
    this.setData({
      containerShow:false,
      searchPanelShow:true
    })
  },
  onCancelImgTap:function(){
    this.setData({
      containerShow: true,
      searchPanelShow: false
    })
  },
  onBindBlur:function(event){
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase +
      "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl,"searchResult","");
  },
  getMovieListData: function (url, settedKey,title){
    var that = this;
    wx.request({
      url: url,
      data: {},
      success: function (res) {
        // console.log(res.data);
        that.processDoubanData(res.data, settedKey, title);
      },
      fail: function(error){
        console.log("failed");
      },
      complete:function(){
        // complete
      }
    })
  },
  processDoubanData: function (moviesDouban, settedKey, categoryTitle){
    var movies = [];
    for (var idx in moviesDouban.subjects){
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if(title.length>6){
        title = title.substring(0,6)+"...";
      }
      var temp ={
        title: title,
        stars: util.convertToStarsArray(subject.rating.stars),
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
      }
      movies.push(temp);
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    };
    // 拼接的对象设置数据
    this.setData(readyData);
  },
  // 更多电影
  onMoretap:function(event){
    var category = event.currentTarget.dataset.categroy;
    wx.navigateTo({
      url: './more-movie/more-movie?category=' + category
    })
  },
  // 电影详情
  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    // console.log(movieId);
    wx.navigateTo({
      url: './movie-detail/movie-detail?id=' + movieId
    })
  }
})
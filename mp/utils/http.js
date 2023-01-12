const app = getApp()

var request = function(data,path,method, callback){
  wx.request({
    url: app.globalData.URL+path, //仅为示例，并非真实的接口地址
    method: method,
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success(res) {
      // console.log(res.data)
      if (res.data.code == 0) {
        // const hide = $wuxNotification().show({
        //   title: '提示',
        //   text: '操作成功',
        //   data: {
        //     message: ''
        //   },
        //   duration: 4000,
        // })
        // hide.then(() => console.log('success'))
        callback(res.data)
      }

    }
  })
}

module.exports = request

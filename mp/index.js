var mqtt = require('../utils/mqtt.min.js')
var request = require('../utils/http.js')
var util = require('../utils/WSCoordinate.js')
var client = null;
Page({
  data: {
    deviceid:'8888888',
    value: 1,
    subTopic: "/iot/hit/s/", //小程序订阅
    pubTopic: "/iot/hit/p/", //服务器订阅
    hit: false,
    value: '正常',
    list:[],
    latitude: 0,
    longitude: 0,
    markers: [],
  },
  onShow() {
    this.setData({
      subTopic:this.data.subTopic+this.data.deviceid, //小程序订阅
      pubTopic:this.data.pubTopic+this.data.deviceid, //esp订阅
    })
    this.connectMqtt()
    var that = this

  },
  connectMqtt() {
    const options = {
      connectTimeout: 4000,
      clientId: 'mp' + Math.ceil(Math.random() * 100),
      port: 8084,
      username: 'xxx', //mqtt用户名
      password: 'xxx', //mqtt密码
    }

    client = mqtt.connect('wxs://t.xx.fun/mqtt', options)
    client.on('reconnect', (error) => {
      console.log('正在重连:', error)
    })

    client.on('error', (error) => {
      console.log('连接失败:', error)
    })
    let that = this
    client.on('connect', (e) => {
      console.log('成功连接服务器')
      client.subscribe(that.data.subTopic, {
        qos: 0
      }, function (err) {
        if (!err) {
          client.publish(that.data.pubTopic, 'clientlogin')
        }
      })
    });
    client.on('message', function (topic, message) {
      let msg = message.toString()
      // let json = JSON.parse(msg);
      console.log(msg)
      if (msg == 'hit') {
        var arr = that.data.list
        let time = new Date()
        arr.splice(0,0,time.toLocaleString());
        that.setData({
          hit: true,
          value: "被撞了",
          list:arr
        })
        setTimeout(() => {
          that.setData({
            hit: false,
            value: "正常"
          })
        }, 4000)
        
      }else{
        
        let ne = JSON.parse(msg)
        let result = util.transformFromWGSToGCJ(that.NEToGPs(ne['N']), that.NEToGPs(ne['E']));
        console.log(result)
        that.setData({
          latitude: result['latitude'],
          longitude: result['longitude'],
          markers: [{
            id: 1,
            latitude: result['latitude'],
            longitude: result['longitude'],
            title: 'abc'
          }]
        })
      }
      
    })
  },
  NEToGPs(val) {
    return Math.trunc(val / 100) + (val % 100) / 60
  },

})

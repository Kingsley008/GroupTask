var appjson = {
  "pages": [
    "pages/index/index", //首页地图
    "pages/scanresult/index", // 扫一扫订车位 --> 成功跳转到计费页面
    "pages/count/index", // 计时收费页面
    "pages/my/index",   // 个人信息页面
    "pages/settlement/index", // 点击结账--> 调用微信的支付接口 --> 返回结账的结果页面
    "pages/logs/logs"
  ],
    "window": {
    "backgroundTextStyle": "light",
      "navigationBarBackgroundColor": "#b9dd08",
        "navigationBarTitleText": "点点 停车",
          "navigationBarTextStyle": "black"
  }
}
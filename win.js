const fetch = require("node-fetch");
const wifi = require("node-wifi");
const os = require('os');
let stop = 5; // 若无法登录尝试登录 5-1=4 次
const device = "0"; // 伪装设备，0 为电脑，1 为手机
const account = "xxxxx"; // 帐号
const passwd = "xxxxx"; // 密码
const type = "cmcc"; // cmcc 为移动，telecom 为电信
const wifiList = ['CQUPT', 'CQUPT-2.4G', 'CQUPT-5G']; // 仅连接到以下网络时才运行

wifi.init({
  iface: null
});

wifi.getCurrentConnections((error, currentConnections) => {
  if (error) {
    // console.log(error);
  } else if (wifiList.includes(currentConnections[0].ssid)) {
    main();
  }
});

function main() {
  // 最多运行 4 次，一直连不上就是网络本身的问题
  if (!stop--) {
    console.log("无法登录，您可能欠费停机");
    return;
  }

  /*
   * 通过 msg 判断
   * msg: "认证成功" 登录成功
   * msg: "" 本机已登录
   * 其他就是 其他设备已登录
  */
  fetch(`http://192.168.200.2:801/eportal/?c=Portal&a=login&callback=dr1003&login_method=1&user_account=%2C${device}%2C${account}%40${type}&user_password=${passwd}&wlan_user_ip=${getIPAddress()}&wlan_user_ipv6=&wlan_user_mac=000000000000&wlan_ac_ip=&wlan_ac_name=`)
    .then(res => res.text())
    .then(res => JSON.parse(res.slice(7, -1)))
    .then(res => {
      if (res.msg == '认证成功') {
        console.log("登录成功");
        return;
      } else if (res.msg == '') {
        console.log("本机已登录");
        return;
      } else {
        main();
      }
    })
}

function getIPAddress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

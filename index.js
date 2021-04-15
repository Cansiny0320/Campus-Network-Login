const fetch = require("node-fetch")
const os = require("os")
const internalIp = require("internal-ip")
const device = "0" // 伪装设备，0 为电脑，1 为手机
const account = "" // 帐号
const passwd = "" // 密码
const type = "cmcc" // cmcc 为移动，telecom 为电信
const wifiList = ["CQUPT-5G", "CQUPT", "CQUPT-2.4G"] // 校园网WiFi列表，按优先级排序
let stop = 5 // 无法登录重尝 5-1 次

if (os.type() == "Windows_NT") {
  ;(async () => {
    try {
      const wifi = require("node-wifi")
      wifi.init({
        iface: null,
      })
      const currentConnections = await wifi.getCurrentConnections()
      if (currentConnections.some(item => wifiList.includes(item.ssid))) {
        main()
        return
      }
      const networks = await wifi.scan()
      let ssid
      const ssids = networks.map(item => {
        if (wifiList.includes(item.ssid)) {
          return item.ssid
        }
      })
      wifiList.some(item => {
        if (ssids.includes(item)) {
          ssid = item
          return true
        }
      })
      if (ssid) {
        await wifi.connect({ ssid })
        main()
      } else {
        console.log("附近没有校园WiFi")
        return
      }
    } catch (error) {
      main()
    }
  })()
} else if (os.type() == "Linux") {
  const { exec } = require("child_process")
  exec("nmcli -t -f NAME connection show --active", (err, stdout) => {
    if (err) {
      console.log(err)
      return
    } else if (wifiList.includes(stdout.slice(0, -1))) {
      main()
    }
  })
} else if (os.type() == "Darwin") {
  //mac 没有设备
}

async function main() {
  try {
    // 最多运行 4 次，一直连不上就是网络本身的问题
    if (!stop--) {
      console.log("无法登录，您可能欠费停机或者校园网已关闭")
      return
    }
    console.log("login...")
    /*
     * 通过 msg 判断
     * msg: "认证成功" 登录成功
     * msg: "" 本机已登录
     * 其他就是 其他设备已登录
     */
    const msg = await login()
    console.log(msg)
    if (msg === "认证成功") {
      console.log("登录成功")
      return
    } else if (msg === "") {
      console.log("本机已登录")
      return
    } else if (msg === "bGRhcCBhdXRoIGVycm9y") {
      console.log("密码错误")
      return
    } else {
      main()
    }
  } catch (error) {
    console.log(error)
  }
}

function getIPAddress() {
  return internalIp.v4()
}

async function login() {
  try {
    const response = await fetch(
      `http://192.168.200.2:801/eportal/?c=Portal&a=login&callback=dr1003&login_method=1&user_account=%2C${device}%2C${account}%40${type}&user_password=${passwd}&wlan_user_ip=${await getIPAddress()}&wlan_user_ipv6=&wlan_user_mac=000000000000&wlan_ac_ip=&wlan_ac_name=`,
    )
    const info = await response.text()
    const { msg } = JSON.parse(info.slice(7, -1))
    return msg
  } catch (error) {
    console.log("请求失败")
  }
}

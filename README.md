# Campus-Network-Login

校园网一键登录，用于**重庆邮电大学**

- 支持伪装设备类型，自由切换手机电脑
- 识别 WiFi 类型，windows 下可自动连接 WiFi，linux 下仅连接校园网时才执行脚本
- 支持 Linux&Windows

### Usage

需要提前安装 nodejs，Linux 需要额外安装 NetworkManager，Mac 可以自行修改，主要是判断当前连接的 Wifi。

```shell
git clone https://github.com/ourongxing/Campus-Network-Login.git
cd Campus-Network-Login & yarn
# 修改代码
# const device = "0"; // 伪装设备，0 为电脑，1 为手机
# const account = "xxxxx"; // 帐号
# const passwd = "xxxxx"; // 密码
# const type = "cmcc"; // cmcc 为移动，telecom 为电信

# then
node index.js
```

Win 可以尝试搭配计划任务来实现开机自动登录，Linux 就不用多说了，自动执行的方法很多。Mac 的话由于我没有设备，不过你简单修改应该也可以。

### More

如果你的 iOS 设备同样需要，可以使用下方的快捷指令，也是我所写，可以结合自动化来实现连接校园网时执行快捷指令

[一键登录校园网](https://www.icloud.com/shortcuts/f8c149eed3874a36a2f96283986b4e06)

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const USER_DATA = {
  "admin": "123456",
  "缘来一家人": "888888"
};
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (USER_DATA[username] && USER_DATA[username] === password) {
    res.json({ success: true, msg: "登录成功" });
  } else {
    res.json({ success: false, msg: "账号或密码错误" });
  }
});
app.listen(5000, () => {
  console.log('Node.js后端服务启动：http://127.0.0.1:5000');
});
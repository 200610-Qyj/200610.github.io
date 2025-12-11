const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000; 

// 1. 修复跨域配置（兼容origin为空的情况）
app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:5500', 'http://127.0.0.1:5500'];
    const origin = req.headers.origin;
    // 兼容origin为空的场景，避免跨域拦截
    if (allowedOrigins.includes(origin) || !origin) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// 2. 基础中间件（保留）
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// 3. 初始化默认用户（补全缺失的核心逻辑）
const initUsers = async () => {
    const saltRounds = 10;
    return [
        { username: '缘来一家人', password: await bcrypt.hash('888888', saltRounds) }, 
        { username: 'admin', password: await bcrypt.hash('admin456', saltRounds) }    
    ];
};
let users = [];
initUsers().then(data => { 
    users = data; 
    console.log('✅ 默认用户初始化完成！');
});

// 4. 补全参数校验中间件（修复未定义问题）
const validateLoginParams = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ code: 400, msg: '用户名和密码不能为空！' });
    }
    if (password.length < 6) {
        return res.json({ code: 400, msg: '密码长度不能少于6位！' });
    }
    next();
};

// 5. 注释/删除限流中间件（测试阶段禁用，避免拦截）
// let loginRequestCount = {};
// const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
// const RATE_LIMIT_MAX = 5;
// const rateLimitMiddleware = (req, res, next) => { ... };

// 6. 登录接口（移除限流中间件，修复依赖）
app.post('/login', /*rateLimitMiddleware,*/ validateLoginParams, async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.json({ code: 401, msg: '用户名不存在！' }); 
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.json({ code: 200, msg: '登录成功！缘来人，欢迎回来～🤗' });
        } else {
            res.json({ code: 401, msg: '密码错误！🤪' });  
        }
    } catch (error) {
        console.error('❌ 登录接口异常：', error);
        res.json({ code: 500, msg: '服务器出错啦，请稍后重试！🙂‍↔️' });
    }
});                                                                                                        

// 7. 启动服务（修复日志提示，补充5500端口）
app.listen(port, () => {
    console.log(`✅ 后端服务已启动！`);
    console.log(`📌 服务地址：http://localhost:${port}`);
    console.log(`🌐 允许跨域的前端地址：http://localhost:8080、http://127.0.0.1:8080、http://localhost:5500、http://127.0.0.1:5500`);
    console.log(`🔑 默认测试账号1：用户名=缘来一家人，密码=888888`);
    console.log(`🔑 默认测试账号2：用户名=admin，密码=admin456`);
});
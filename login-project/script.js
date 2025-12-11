const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const tip = document.getElementById('tip');
function clearTip() {
    tip.textContent = '';
    tip.className = 'tip';
}
function validateForm() {
    clearTip();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username) {
        tip.textContent = '用户名不能为空！';
        tip.className = 'tip error';
        return false;
    }
    const specialCharReg = /[^\w\u4e00-\u9fa5]/;
    if (specialCharReg.test(username)) {
        tip.textContent = '用户名仅支持汉字、字母、数字和下划线！';
        tip.className = 'tip error';
        return false;
    }
    if (!password) {
        tip.textContent = '密码不能为空！';
        tip.className = 'tip error';
        return false;
    }
    if (password.length < 6) {
        tip.textContent = '密码长度不能少于6位！';
        tip.className = 'tip error';
        return false;
    }
    return { username, password };
}
async function login() {
    const formData = validateForm();
    if (!formData) return;
    loginBtn.disabled = true;
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(formData), 
            credentials:'include'
        });
        if (!response.ok) {
            throw new Error(`请求失败：${response.status}`);
        }
        const result = await response.json();
        if (result.code === 200) {
            tip.textContent = result.msg;
            tip.className = 'tip success';
            setTimeout(() => {
                window.location.href='After Loading/home.html';
            }, 1000);
        } else {
            tip.textContent = result.msg;
            tip.className = 'tip error';
        }
    } catch (error) {
        tip.textContent = '网络出错啦，请重试！';
        tip.className = 'tip error';
        console.error('登录请求失败：', error);
    } finally {
        setTimeout(() => {
            loginBtn.disabled = false;
        }, 800);
    }
}
loginBtn.addEventListener('click', login);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement !== loginBtn) {
        login();
    }
});
usernameInput.addEventListener('input', clearTip);
passwordInput.addEventListener('input', clearTip);
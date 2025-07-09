// 等待页面加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 获取表单元素
    const loginForm = document.getElementById('loginForm');
    const usernameSelect = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');

    // 设置正确的密码
    const CORRECT_PASSWORD = '2025531';

    // 如果有保存的用户名，自动选择
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
        const options = Array.from(usernameSelect.options);
        const savedOption = options.find(option => option.value === savedUsername);
        if (savedOption) {
            savedOption.selected = true;
            rememberCheckbox.checked = true;
        }
    }

    // 添加表单提交事件监听
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // 阻止表单默认提交行为

        // 获取输入值
        const username = usernameSelect.value;
        const password = passwordInput.value.trim();

        // 表单验证
        if (!username) {
            showError('请选择你的名字');
            return;
        }
        if (!password) {
            showError('请输入密码');
            return;
        }

        // 验证密码
        if (password !== CORRECT_PASSWORD) {
            showError('密码错误，请重试');
            passwordInput.value = ''; // 清空密码输入框
            return;
        }

        // 处理"记住我"选项
        if (rememberCheckbox.checked) {
            localStorage.setItem('rememberedUsername', username);
        } else {
            localStorage.removeItem('rememberedUsername');
        }

        // 显示加载动画
        const button = loginForm.querySelector('button');
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = '深入中...';
        
        // 预加载音乐并设置自动播放标志
        await preloadMusic();
        localStorage.setItem('autoplay', 'true');
        
        // 密码正确，继续登录过程
        simulateLogin(username);
    });

    // 添加选择框和输入框焦点效果
    const inputs = document.querySelectorAll('.form-group input[type="password"], .form-group select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        });

        input.addEventListener('blur', () => {
            input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        });
    });

    // 添加背景视差效果
    document.addEventListener('mousemove', (e) => {
        const background = document.querySelector('.background');
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (clientX - centerX) / 100;
        const moveY = (clientY - centerY) / 100;
        
        background.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
    });

    // 更新时间
    updateTime();
    setInterval(updateTime, 1000);
    
    // 更新天气
    updateWeather();
    // 每30分钟更新一次天气
    setInterval(updateWeather, 30 * 60 * 1000);
});

// 显示错误信息
function showError(message) {
    // 创建错误提示元素
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: rgba(255, 71, 71, 0.2);
        border: 1px solid rgba(255, 71, 71, 0.5);
        color: white;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        animation: shake 0.5s ease;
        backdrop-filter: blur(5px);
    `;
    errorDiv.textContent = message;

    // 添加抖动动画
    const keyframes = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    // 插入错误信息
    const form = document.getElementById('loginForm');
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    form.insertBefore(errorDiv, form.firstChild);

    // 3秒后自动移除错误信息
    setTimeout(() => {
        errorDiv.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

// 模拟登录过程
function simulateLogin(username) {
    const loginButton = document.querySelector('.login-button');
    const originalText = loginButton.textContent;

    // 禁用登录按钮并显示加载状态
    loginButton.disabled = true;
    loginButton.innerHTML = '<span class="loading">深入中...</span>';
    loginButton.style.background = 'rgba(255, 255, 255, 0.5)';

    // 模拟网络请求延迟
    setTimeout(() => {
        // 登录成功后跳转到主页
        window.location.href = 'index.html';
    }, 1500);
}

// 配置API密钥
const AMAP_KEY = 'YOUR_AMAP_KEY'; // 高德地图Web API密钥
const QWEATHER_KEY = 'YOUR_QWEATHER_KEY'; // 和风天气API密钥

// 更新时间显示
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('currentTime');
    const dateElement = document.getElementById('currentDate');
    
    // 格式化时间
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    
    // 格式化日期
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekDay = weekDays[now.getDay()];
    dateElement.textContent = `${year}年${month}月${date}日 ${weekDay}`;
}

// 预加载音乐
function preloadMusic() {
    const audio = new Audio();
    audio.src = 'assets/music/林俊杰 - 不为谁而作的歌 (V0).mp3';
    audio.preload = 'auto';
    return new Promise((resolve) => {
        audio.addEventListener('canplaythrough', resolve, { once: true });
        audio.addEventListener('error', resolve, { once: true }); // 即使加载失败也继续
    });
}

// 更新天气信息
async function updateWeather() {
    const weatherTemp = document.querySelector('.weather-temp');
    const weatherDesc = document.querySelector('.weather-desc');
    const locationCity = document.querySelector('.location-city');
    const locationDistrict = document.querySelector('.location-district');
    
    weatherTemp.textContent = '获取中...';
    weatherDesc.textContent = '请稍候';
    
    try {
        // 深圳龙岗的坐标（华南城位置）
        const LONGGANG_LOCATION = {
            latitude: 22.6986,  // 华南城纬度
            longitude: 114.2783 // 华南城经度
        };

        // 设置位置信息
        locationCity.textContent = '广东省深圳市';
        locationDistrict.textContent = '龙岗区华南城';
        
        // 使用OpenWeatherMap API获取天气
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LONGGANG_LOCATION.latitude}&lon=${LONGGANG_LOCATION.longitude}&units=metric&lang=zh_cn&appid=6d055e39ee237af35ca066f35474e9df`);
        
        if (!response.ok) {
            throw new Error(`天气API响应错误: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('龙岗天气数据:', data);
        
        if (data.main && data.weather) {
            const temp = Math.round(data.main.temp);
            const desc = data.weather[0].description;
            weatherTemp.textContent = `${temp}℃`;
            weatherDesc.textContent = desc;
        } else {
            throw new Error('天气数据格式错误');
        }
    } catch (error) {
        console.error('获取天气信息失败:', error);
        weatherTemp.textContent = '--℃';
        weatherDesc.textContent = '获取失败';
    }
}

// 添加动态标题效果
const title = document.querySelector('.dynamic-title h1');
const decoration = document.querySelector('.title-decoration');

// 标题浮动动画
function floatAnimation() {
    let y = 0;
    let direction = 1;
    const maxY = 10;
    const speed = 0.05;
    
    function animate() {
        y += speed * direction;
        if (y >= maxY) {
            y = maxY;
            direction = -1;
        } else if (y <= 0) {
            y = 0;
            direction = 1;
        }
        
        title.style.transform = `translateY(${-y}px)`;
        decoration.style.transform = `translateY(${y}px)`;
        requestAnimationFrame(animate);
    }
    
    animate();
}

floatAnimation(); 
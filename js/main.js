// 全局变量
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = {
    'image/jpeg': true,
    'image/png': true,
    'image/gif': true,
    'video/mp4': true,
    'video/webm': true
};

// 精选照片数组
const featuredPhotos = [
    {
        url: 'images/1 (1).jpg',
        caption: '记忆创造者 - 郑博瑄'
    },
    {
        url: 'images/1 (2).jpg',
        caption: '记忆创造者 - 胡家源'
    },
    {
        url: 'images/1 (3).jpg',
        caption: '记忆创造者 - 洪宇航'
    },
    {
        url: 'images/1 (4).jpg',
        caption: '记忆创造者 - 邓梓轩'
    },
    {
        url: 'images/1 (5).jpg',
        caption: '记忆创造者 - 傅梓耀'
    }
];

// 背景图片数组
const backgroundImages = [
    'images/longgang.jpg',
    'images/640 (1).jpg',
    'images/640 (2).jpg',
    'images/640 (3).jpg',
    'images/640 (4).jpg',
    'images/640 (5).jpg',
    'images/640 (6).jpg',
    'images/640 (7).jpg',
    'images/640 (8).jpg',
    'images/640 (9).jpg',
    'images/640 (10).jpg',
    'images/640 (11).jpg',
    'images/640 (12).jpg',
    'images/640 (13).jpg',
    'images/640 (14).jpg',
    'images/640.jpg'
];

// 预加载的图片对象
const preloadedImages = new Map();

// DOM 元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadProgress = document.getElementById('uploadProgress');
const progressText = document.getElementById('progressText');
const filesGrid = document.getElementById('filesGrid');
const storageText = document.getElementById('storageText');
const backgroundContainer = document.querySelector('.background-container');
const photoGrid = document.getElementById('photoGrid');

// 文件存储状态
let totalStorage = 1024 * 1024 * 1024; // 1GB
let usedStorage = 0;
let uploadedFiles = [];
let currentImageIndex = 0;
let imageFiles = [];
let currentBackgroundIndex = -1;
let activeBackgroundElement = null;

// 音乐播放器控制
const playlist = [
    { title: '不为谁而作的歌 - 林俊杰', file: '林俊杰 - 不为谁而作的歌 (V0).mp3' },
    { title: '心如止水 - Ice Paper', file: 'Ice Paper - 心如止水 (V0).mp3' },
    { title: 'Unstoppable - Sia', file: 'Sia - Unstoppable (V0).mp3' },
    { title: 'See You Again - Wiz Khalifa & Charlie Puth', file: 'Wiz Khalifa _ Charlie Puth - See You Again (V0).mp3' },
    { title: '遇见 - 孙燕姿', file: '孙燕姿 - 遇见 (V0).mp3' },
    { title: 'Waiting For Love (Remix) - Max & Subai & 7evens', file: 'Max _ Subai _ 7evens - Waiting For Love (Remix) (V0).mp3' }
];

document.addEventListener('DOMContentLoaded', () => {
    const musicPlayer = document.querySelector('.music-player');
    const audio = document.getElementById('bgMusic');
    const songTitle = document.querySelector('.song-title');
    const progress = document.querySelector('.progress');
    const progressBar = document.querySelector('.progress-bar');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentTrack = 0;
    let isPlaying = false;

    // 加载音乐
    function loadTrack(trackIndex) {
        const track = playlist[trackIndex];
        audio.src = `assets/music/${track.file}`;
        songTitle.textContent = track.title;
        audio.load();
        
        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('播放出错:', error);
                });
            }
        }
    }

    // 播放下一首
    function nextTrack() {
        currentTrack = (currentTrack + 1) % playlist.length;
        loadTrack(currentTrack);
    }

    // 播放上一首
    function prevTrack() {
        currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrack);
    }

    // 更新进度条
    function updateProgress() {
        if (audio.duration) {
            const { currentTime, duration } = audio;
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = `${progressPercent}%`;
        }
    }

    // 设置播放进度
    function setProgress(e) {
        const width = progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    // 检查是否从登录页面跳转来的
    const shouldAutoplay = localStorage.getItem('autoplay') === 'true';
    
    // 初始化第一首歌
    loadTrack(0);
    
    // 如果是从登录页面来的，立即播放
    if (shouldAutoplay) {
        audio.play().then(() => {
            isPlaying = true;
            musicPlayer.classList.remove('paused');
            // 清除自动播放标志
            localStorage.removeItem('autoplay');
        }).catch(error => {
            console.log('自动播放失败:', error);
            // 如果自动播放失败，等待用户第一次点击
            document.addEventListener('click', () => {
                if (!isPlaying) {
                    audio.play().then(() => {
                        isPlaying = true;
                        musicPlayer.classList.remove('paused');
                    });
                }
            }, { once: true });
        });
    }

    // 点击唱片播放/暂停
    musicPlayer.querySelector('.vinyl-player').addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicPlayer.classList.add('paused');
        } else {
            audio.play();
            musicPlayer.classList.remove('paused');
        }
        isPlaying = !isPlaying;
    });

    // 上一首按钮
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止触发整个播放器的点击事件
        prevTrack();
    });

    // 下一首按钮
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止触发整个播放器的点击事件
        nextTrack();
    });

    // 监听音频播放状态
    audio.addEventListener('play', () => {
        isPlaying = true;
        musicPlayer.classList.remove('paused');
    });

    audio.addEventListener('pause', () => {
        isPlaying = false;
        musicPlayer.classList.add('paused');
    });

    // 更新进度条
    audio.addEventListener('timeupdate', updateProgress);

    // 点击进度条快进
    progressBar.addEventListener('click', setProgress);

    // 一首歌播放完后自动播放下一首
    audio.addEventListener('ended', nextTrack);

    // 添加错误处理
    audio.addEventListener('error', (e) => {
        console.log('音频播放错误:', e);
        // 如果当前歌曲播放失败，尝试播放下一首
        nextTrack();
    });

    setupDragAndDrop();
    setupFileInput();
    setupClickUpload();
    loadExistingFiles();
    initializeBackground();
    // 添加记忆创造者照片
    addFeaturedPhotos(featuredPhotos);
});

// 预加载所有背景图片
async function preloadBackgroundImages() {
    const loadPromises = backgroundImages.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                preloadedImages.set(src, img);
                resolve();
            };
            img.onerror = reject;
            img.src = src;
        });
    });

    try {
        await Promise.all(loadPromises);
        console.log('所有背景图片预加载完成');
    } catch (error) {
        console.error('背景图片预加载失败:', error);
    }
}

// 初始化背景
function initializeBackground() {
    // 创建两个背景元素用于交替显示
    backgroundContainer.innerHTML = `
        <div class="background-image"></div>
        <div class="background-image"></div>
        <div class="background-overlay"></div>
    `;
    
    // 获取背景元素
    const backgrounds = backgroundContainer.querySelectorAll('.background-image');
    
    // 显示第一张图片
    showNextBackground();
    
    // 设置定时器，每3秒切换一次背景
    setInterval(showNextBackground, 3000);
}

// 显示下一张背景图片
function showNextBackground() {
    // 获取两个背景元素
    const backgrounds = backgroundContainer.querySelectorAll('.background-image');
    
    // 计算下一个图片索引
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
    
    // 确定当前活动和下一个背景元素
    const activeIndex = backgrounds[0].classList.contains('active') ? 0 : 1;
    const nextIndex = activeIndex === 0 ? 1 : 0;
    
    // 设置下一个背景图片
    backgrounds[nextIndex].style.backgroundImage = `url('${backgroundImages[currentBackgroundIndex]}')`;
    
    // 切换显示状态
    backgrounds[activeIndex].classList.remove('active');
    backgrounds[nextIndex].classList.add('active');
}

// 设置点击上传
function setupClickUpload() {
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
}

// 设置拖放功能
function setupDragAndDrop() {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    uploadArea.addEventListener('drop', handleDrop, false);
}

// 设置文件输入
function setupFileInput() {
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

// 阻止默认行为
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// 高亮拖放区域
function highlight(e) {
    uploadArea.classList.add('drag-over');
}

// 取消高亮拖放区域
function unhighlight(e) {
    uploadArea.classList.remove('drag-over');
}

// 处理文件拖放
function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// 处理文件
function handleFiles(files) {
    const fileArray = Array.from(files);
    
    // 验证文件
    const validFiles = fileArray.filter(file => {
        if (!ALLOWED_TYPES[file.type]) {
            alert(`不支持的文件类型: ${file.type}`);
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            alert(`文件过大: ${file.name}`);
            return false;
        }
        return true;
    });

    if (validFiles.length === 0) return;

    // 显示加载提示
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'flex';

    // 处理每个文件
    let processedFiles = 0;
    validFiles.forEach(file => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const fileData = {
                name: file.name,
                type: file.type,
                size: file.size,
                data: e.target.result,
                timestamp: new Date().getTime()
            };
            
            // 保存到本地存储
            saveFileToStorage(fileData);
            
            // 添加到界面
            addFileToGrid(fileData);
            
            // 如果是图片，添加到图片数组
            if (file.type.startsWith('image/')) {
                imageFiles.push(fileData);
            }

            // 检查是否所有文件都处理完成
            processedFiles++;
            if (processedFiles === validFiles.length) {
                // 隐藏加载提示
                loadingIndicator.style.display = 'none';
                // 清空文件输入框，允许重复上传相同文件
                fileInput.value = '';
            }
        };
        
        reader.readAsDataURL(file);
    });
}

// 保存文件到Firebase
async function saveFileToStorage(fileData) {
    try {
        // 生成唯一文件名
        const fileName = `${new Date().getTime()}_${fileData.name}`;
        
        // 上传文件到Firebase Storage
        const storageRef = storage.ref(`uploads/${fileName}`);
        
        // 从base64数据创建Blob
        const fetchResponse = await fetch(fileData.data);
        const blob = await fetchResponse.blob();
        
        // 上传文件
        const uploadTask = storageRef.put(blob);
        
        // 监听上传进度
        uploadTask.on('state_changed', 
            (snapshot) => {
                // 显示上传进度
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('上传进度: ' + progress + '%');
            },
            (error) => {
                // 处理错误
                console.error('上传失败:', error);
                alert('文件上传失败，请重试');
            },
            async () => {
                // 上传完成后获取下载URL
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                
                // 保存文件信息到Firestore
                const fileInfo = {
                    name: fileData.name,
                    type: fileData.type,
                    size: fileData.size,
                    timestamp: fileData.timestamp,
                    uploadedBy: localStorage.getItem('rememberedUsername') || '匿名用户',
                    uploadDate: new Date(),
                    url: downloadURL
                };
                
                await filesCollection.add(fileInfo);
                console.log('文件信息已保存到Firestore');
                
                // 更新存储信息
                updateStorageInfo(fileData.size);
            }
        );
    } catch (error) {
        console.error('保存文件时出错:', error);
        alert('保存文件失败，请重试');
    }
}

// 添加文件到网格
function addFileToGrid(fileData) {
    const fileCard = document.createElement('div');
    fileCard.className = 'file-card fade-in';
    
    // 添加文件ID作为属性，用于后续删除操作
    if (fileData.id) {
        fileCard.setAttribute('data-id', fileData.id);
    }
    
    const isImage = fileData.type.startsWith('image/');
    const preview = isImage ? createImagePreview(fileData) : createVideoPreview(fileData);
    
    // 获取当前用户名
    const currentUser = localStorage.getItem('rememberedUsername');
    
    // 确定是否显示删除按钮（只有上传者才能删除）
    const showDeleteButton = fileData.uploadedBy === currentUser;
    
    fileCard.innerHTML = `
        <div class="file-preview">
            ${preview}
        </div>
        <div class="file-info">
            <p class="file-name">${fileData.name}</p>
            <p class="file-size">${formatFileSize(fileData.size)}</p>
            <p class="file-uploader">上传者: ${fileData.uploadedBy || '匿名用户'}</p>
        </div>
        <div class="file-actions">
            <button onclick="downloadFile('${fileData.timestamp}')" class="action-btn download-btn">
                下载
            </button>
            ${showDeleteButton ? `
            <button onclick="deleteFile(this, '${fileData.timestamp}')" class="action-btn delete-btn">
                删除
            </button>
            ` : ''}
        </div>
    `;
    
    filesGrid.appendChild(fileCard);
}

// 创建图片预览
function createImagePreview(fileData) {
    return `
        <div class="preview-container">
            <span class="file-type-badge">图片</span>
            <img src="${fileData.data}" alt="${fileData.name}" class="preview-img" 
                onclick="openImageModal('${fileData.data}', ${imageFiles.length})" 
                onload="this.parentElement.style.backgroundImage = 'url(${fileData.data})'">
        </div>
    `;
}

// 创建视频预览
function createVideoPreview(fileData) {
    return `
        <div class="preview-container">
            <span class="file-type-badge">视频</span>
            <video class="preview-video" controls>
                <source src="${fileData.data}" type="${fileData.type}">
                您的浏览器不支持视频预览
            </video>
        </div>
    `;
}

// 更新存储信息
function updateStorageInfo(fileSize) {
    usedStorage += fileSize;
    const percentage = Math.min(100, (usedStorage / totalStorage) * 100);
    document.querySelector('.storage-used').style.width = `${percentage}%`;
    storageText.textContent = `${percentage.toFixed(1)}%`;
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 下载文件
async function downloadFile(timestamp) {
    try {
        // 从UI元素获取文件ID
        const fileCard = document.querySelector(`.file-card[data-timestamp="${timestamp}"]`);
        
        if (fileCard) {
            const fileId = fileCard.getAttribute('data-id');
            
            // 如果有文件ID，从Firestore获取文件信息
            if (fileId) {
                const docRef = await filesCollection.doc(fileId).get();
                
                if (docRef.exists) {
                    const fileData = docRef.data();
                    
                    // 创建下载链接
                    const link = document.createElement('a');
                    link.href = fileData.url;
                    link.download = fileData.name;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    return;
                }
            }
        }
        
        // 如果没有找到文件ID或文档不存在，尝试从imageFiles数组中查找
        const file = imageFiles.find(f => f.timestamp == timestamp);
        if (file) {
            const link = document.createElement('a');
            link.href = file.data;
            link.download = file.name;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error('找不到要下载的文件');
        }
    } catch (error) {
        console.error('下载文件时出错:', error);
        alert('下载文件失败，请重试');
    }
}

// 删除文件
async function deleteFile(button, timestamp) {
    try {
        const fileCard = button.closest('.file-card');
        const fileId = fileCard.getAttribute('data-id');
        
        if (!fileId) {
            console.error('找不到文件ID');
            return;
        }
        
        // 获取当前用户名
        const currentUser = localStorage.getItem('rememberedUsername');
        
        // 获取文件信息
        const docRef = await filesCollection.doc(fileId).get();
        
        if (!docRef.exists) {
            console.error('文件不存在');
            return;
        }
        
        const fileData = docRef.data();
        
        // 检查是否是文件上传者
        if (fileData.uploadedBy !== currentUser) {
            alert('您只能删除自己上传的文件');
            return;
        }
        
        // 从Firebase Storage删除文件
        const fileUrl = fileData.url;
        const storageRef = storage.refFromURL(fileUrl);
        await storageRef.delete();
        
        // 从Firestore删除文件记录
        await filesCollection.doc(fileId).delete();
        
        // 从图片数组中移除
        imageFiles = imageFiles.filter(f => f.timestamp != timestamp);
        
        // 从UI中移除
        fileCard.classList.add('fade-out');
        setTimeout(() => {
            fileCard.remove();
            updateStorageInfo();
        }, 300);
        
        console.log('文件已成功删除');
    } catch (error) {
        console.error('删除文件时出错:', error);
        alert('删除文件失败，请重试');
    }
}

// 加载所有用户上传的文件
async function loadExistingFiles() {
    try {
        // 显示加载指示器
        document.getElementById('loadingIndicator').style.display = 'flex';
        
        // 从Firestore获取所有文件信息
        const snapshot = await filesCollection.orderBy('uploadDate', 'desc').get();
        
        if (snapshot.empty) {
            console.log('没有找到文件');
            document.getElementById('loadingIndicator').style.display = 'none';
            return;
        }
        
        let totalSize = 0;
        
        // 处理每个文件
        snapshot.forEach(doc => {
            const fileData = doc.data();
            fileData.id = doc.id; // 保存文档ID，用于后续删除操作
            
            // 转换为适合显示的格式
            const displayData = {
                name: fileData.name,
                type: fileData.type,
                size: fileData.size,
                timestamp: fileData.timestamp,
                data: fileData.url, // 使用Firebase存储的URL
                id: fileData.id,
                uploadedBy: fileData.uploadedBy
            };
            
            // 添加到网格
            addFileToGrid(displayData);
            
            // 如果是图片，添加到图片数组
            if (fileData.type.startsWith('image/')) {
                imageFiles.push(displayData);
            }
            
            // 累计文件大小
            totalSize += fileData.size;
        });
        
        // 更新存储信息
        usedStorage = totalSize;
        updateStorageInfo(0);
        
        // 隐藏加载指示器
        document.getElementById('loadingIndicator').style.display = 'none';
    } catch (error) {
        console.error('加载文件时出错:', error);
        alert('加载文件失败，请刷新页面重试');
        document.getElementById('loadingIndicator').style.display = 'none';
    }
}

// 打开图片预览模态框
function openImageModal(url, index) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const imageCounter = document.getElementById('imageCounter');
    
    // 找到当前图片在imageFiles中的索引
    currentImageIndex = imageFiles.findIndex(file => file.data === url);
    if (currentImageIndex === -1) currentImageIndex = 0;
    
    modalImage.src = url;
    modalImage.classList.add('loading');
    
    updateImageCounter();
    modal.classList.add('active');
    
    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
    
    // 图片加载完成后移除加载动画
    modalImage.onload = () => {
        modalImage.classList.remove('loading');
    };

    // 更新导航按钮状态
    updateNavigationButtons();
}

// 关闭图片预览模态框
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// 显示上一张图片
function showPrevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        const prevFile = imageFiles[currentImageIndex];
        document.getElementById('modalImage').src = prevFile.data;
        updateImageCounter();
        updateNavigationButtons();
    }
}

// 显示下一张图片
function showNextImage() {
    if (currentImageIndex < imageFiles.length - 1) {
        currentImageIndex++;
        const nextFile = imageFiles[currentImageIndex];
        document.getElementById('modalImage').src = nextFile.data;
        updateImageCounter();
        updateNavigationButtons();
    }
}

// 更新图片计数器
function updateImageCounter() {
    const counter = document.getElementById('imageCounter');
    counter.textContent = `${currentImageIndex + 1} / ${imageFiles.length}`;
}

// 更新导航按钮状态
function updateNavigationButtons() {
    const prevButton = document.querySelector('.modal-prev');
    const nextButton = document.querySelector('.modal-next');
    
    if (prevButton && nextButton) {
        prevButton.style.visibility = currentImageIndex > 0 ? 'visible' : 'hidden';
        nextButton.style.visibility = currentImageIndex < imageFiles.length - 1 ? 'visible' : 'hidden';
    }
}

// 添加键盘快捷键支持
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('imageModal');
    if (modal.classList.contains('active')) {
        switch(e.key) {
            case 'Escape':
                closeImageModal();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }
});

// 点击模态框背景关闭
document.getElementById('imageModal').addEventListener('click', (e) => {
    if (e.target.classList.contains('image-preview-modal')) {
        closeImageModal();
    }
});

// 添加文件卡片样式
const style = document.createElement('style');
style.textContent = `
    .file-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 1rem;
        transition: all 0.3s ease;
    }

    .file-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .file-preview {
        width: 100%;
        height: 150px;
        overflow: hidden;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

    .preview-img,
    .preview-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .file-info {
        margin-bottom: 1rem;
    }

    .file-name {
        font-weight: 500;
        margin-bottom: 0.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .file-size {
        color: #666;
        font-size: 0.9rem;
    }

    .file-actions {
        display: flex;
        gap: 0.5rem;
    }

    .action-btn {
        flex: 1;
        padding: 0.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s ease;
    }

    .download-btn {
        background-color: var(--primary-color);
        color: white;
    }

    .delete-btn {
        background-color: var(--error-color);
        color: white;
    }

    .action-btn:hover {
        opacity: 0.9;
    }

    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateY(10px);
        }
    }

    .fade-out {
        animation: fadeOut 0.3s ease-out forwards;
    }
`;

document.head.appendChild(style);

// 添加精选照片
function addFeaturedPhoto(photoData) {
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    photoItem.innerHTML = `
        <img src="${photoData.url}" alt="${photoData.caption}" loading="lazy">
        <div class="photo-caption">${photoData.caption}</div>
    `;
    
    // 添加点击事件，打开预览模态框
    photoItem.addEventListener('click', () => {
        openImageModal(photoData.url, featuredPhotos.indexOf(photoData));
    });
    
    photoGrid.appendChild(photoItem);
}

// 批量添加精选照片
function addFeaturedPhotos(photos) {
    photos.forEach(photo => addFeaturedPhoto(photo));
} 
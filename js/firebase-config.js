// Firebase配置文件
// 初始化Firebase应用

// Firebase配置信息
const firebaseConfig = {
  apiKey: "AIzaSyB_jdD63zP-D7MUsGIfDopI017FT_f31iE",
  authDomain: "longgangxing.firebaseapp.com",
  projectId: "longgangxing",
  storageBucket: "longgangxing.firebasestorage.app",
  messagingSenderId: "900305333679",
  appId: "1:900305333679:web:56b18ce89d4edec894535a",
  measurementId: "G-EQT015W1YC"
};

// 初始化Firebase
firebase.initializeApp(firebaseConfig);

// 获取Firebase服务引用
const auth = firebase.auth();
const storage = firebase.storage();
const db = firebase.firestore();

// 共享文件集合引用
const filesCollection = db.collection('files');

// 匿名登录函数
async function signInAnonymously() {
  try {
    const userCredential = await auth.signInAnonymously();
    console.log('匿名登录成功:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('匿名登录失败:', error);
    return null;
  }
}

// 在页面加载时尝试匿名登录
document.addEventListener('DOMContentLoaded', () => {
  signInAnonymously();
});

// 导出Firebase服务
const firebaseServices = {
  storage,
  db,
  filesCollection
}; 
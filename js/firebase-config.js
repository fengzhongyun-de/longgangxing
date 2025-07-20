// Firebase 配置文件
// 初始化 Firebase 应用

// Firebase 配置对象
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // 需要替换为您的Firebase API密钥
  authDomain: "longgangxing.firebaseapp.com",        // 需要替换为您的Firebase项目域名
  projectId: "longgangxing",                         // 需要替换为您的Firebase项目ID
  storageBucket: "longgangxing.appspot.com",         // 需要替换为您的Firebase存储桶
  messagingSenderId: "123456789012",                 // 需要替换为您的Firebase消息发送者ID
  appId: "1:123456789012:web:abcdef1234567890"       // 需要替换为您的Firebase应用ID
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 获取 Storage 和 Firestore 实例
const storage = firebase.storage();
const db = firebase.firestore();

// 导出实例供其他文件使用
const firebaseServices = {
  storage,
  db,
  storageRef: storage.ref(),
  filesCollection: db.collection('files')
}; 
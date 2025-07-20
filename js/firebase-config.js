// Firebase配置文件
// 初始化Firebase应用

// Firebase配置信息
const firebaseConfig = {
  apiKey: "AIzaSyA1234567890abcdefghijklmnopqrstuvwxyz", // 请替换为您的Firebase API Key
  authDomain: "longgangxing.firebaseapp.com", // 请替换为您的Firebase项目域名
  projectId: "longgangxing", // 请替换为您的Firebase项目ID
  storageBucket: "longgangxing.appspot.com", // 请替换为您的Firebase存储桶
  messagingSenderId: "123456789012", // 请替换为您的Firebase消息发送者ID
  appId: "1:123456789012:web:abcdef1234567890" // 请替换为您的Firebase应用ID
};

// 初始化Firebase
firebase.initializeApp(firebaseConfig);

// 获取Firebase存储和数据库引用
const storage = firebase.storage();
const db = firebase.firestore();

// 共享文件集合引用
const filesCollection = db.collection('files');

// 导出Firebase服务
const firebaseServices = {
  storage,
  db,
  filesCollection
}; 
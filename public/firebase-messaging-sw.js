
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBwCl__oZ2ilXheZE-21RaWeghyomJXvsM",
    authDomain: "hmizik-eddaa.firebaseapp.com",
    projectId: "hmizik-eddaa",
    storageBucket: "hmizik-eddaa.firebasestorage.app",
    messagingSenderId: "438498402375",
    appId: "1:438498402375:web:3dc3ef6de2a6c889d49162"
};


firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Notifikasyon resevwa nan background:', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './pwa-192x192.png', 
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
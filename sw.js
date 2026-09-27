// sw.js
self.addEventListener('install', function(event){
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event){
  // 不拦截，直接放行
});

self.addEventListener('message', function(event){
  var data = event.data || {};
  if(data.type === 'SHOW_NOTIFICATION' && data.payload){
    var p = data.payload;
    self.registration.showNotification(p.title || '新消息', {
      body: p.body || '',
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: 'koi-msg-' + (p.time || Date.now()),
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: './' }
    });
  }
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list){
      for(var i = 0; i < list.length; i++){
        if(list[i].url.indexOf(url) !== -1 && 'focus' in list[i]){
          return list[i].focus();
        }
      }
      if(clients.openWindow){
        return clients.openWindow(url);
      }
    })
  );
});

# tns-wechat
A WeChat plugin for NativeScript Project.  
Currently this plugin only suport Android platform, iOS is on its way coming.

### I wanna share my staff to WeChat
For Android developer, Please make sure you've gotten the **AppID** from Tecent.
Otherwise it will FAIL sharing any staff to WeChat platform.

### How Can I install this plugin?
At currently stage, the plugin still need some polishing work before being published. So if you wanna have a trial, or help me find any bugs or inappropriated places, you may install it via entering cammand  
``` tns plugin add https://github.com/ZixiaoWang/tns-wechat.git```

### How Can I use this plugin?
**Quick example**
```javascript
    import * as WeChat from ('tns-wechat');

    function MyClass(){
        // Register your appID
        // 注册你的appID
        let wechat = new WeChat('wx1234567890123456');
        
        // Share text to Session
        // 分享文字信息到我的好友
        wechat
            .sendText('Hello World')
            .toSession(); 

        // Share Webpage to Timeline
        // 分享网页到我的朋友圈
        wechat
            .sendWebpage('https://www.google.com')
            .addTitle('Google')
            .addDescription('This is description')
            .toTimeline();      

        // Share Image to Favorite
        // 将图片加入微信“我的收藏”
        wechat
            .sendImage('/your/image/path/image.png')
            .toFavorite();
    }
```

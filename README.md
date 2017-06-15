# tns-wechat
A WeChat plugin for NativeScript Project.  
Currently this plugin only suport Android platform, iOS is on its way coming.

### I wanna share my stuff to WeChat
For Android developer, Please make sure you've gotten the **AppID** from Tecent.
Otherwise it will FAIL sharing any stuff to WeChat platform.

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
        
        // Share Webpage to Timeline
        // 分享网页到我的朋友圈
        wechat
            .sendWebpage('https://www.google.com')
            .addTitle('Google')
            .addDescription('This is description')
            .addThumbnail('data:image/png;base64,AIND923kdf....')
            .toTimeline();      
    }
```

### APIs
#### isInstalled
```
    isInstalled(): boolean
```
#### Send
```
    sendText(txt: string): WeChat    
    sendWebpage(url: string): WeChat    
    sendImage(path: string): WeChat  
    sendImage(base64String: string): WeChat
```
#### Add
```
    addTitle(title?: string): WeChat
    addDescription(description: string): WeChat
    addMessageTagName(msgTagName: string): WeChat
    addMessageAction(msgAction: string): WeChat
    addMessageExt(msgExt: string): WeChat
    addThumbnail(path: string): WeChat
    addThumbnail(base64String: string): WeChat

    decorate({
        title?: string,
        description?: string,
        messageTagName?: string,
        messageAction?: string,
        messageExt?: string,
        thumbData?: string (imagePath or Base64String)
    }): WeChat
```
#### To
```
    to(target: string): boolean (target must be in ["session", "timeline", "favorite"])
    toSession(): boolean
    toTimeline(): boolean
    toFavorite(): boolean
```

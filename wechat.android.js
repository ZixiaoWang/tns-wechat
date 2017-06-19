/// <reference path="./wechat.d.ts" />

var Application = require('tns-core-modules/application');
var utils = require('utils/utils');
var ImageSourceModule = require("image-source");
var ImageSource = require('image-source');


function setThumbnailQuality(width, height){
    if( !width || typeof width !== 'number'){
        throw new Error('Parameters must be a valid number');
    }
    if(height){
        this.THUMB_WIDTH = width;
        this.THUMB_HEIGHT = height;
    }else{
        this.THUMB_WIDTH = width;
        this.THUMB_HEIGHT = height;
    }
    return this;
}
function base64ToByteArray(base64String){
    return android.util.Base64.decode(base64String, android.util.Base64.DEFAULT);
}
function base64ToBitMap(base64String){
    let imageByteArray = android.util.Base64.decode(base64String, android.util.Base64.DEFAULT);
    return android.graphics.BitmapFactory.decodeByteArray(imageByteArray, 0, imageByteArray.length);
}


export function WeChat(appID){
    if(!/^wx[\w]{16}$/g.test(appID)){
        throw new Error('This is not a valid WeChat Application ID');
    }
    this.appID = appID;
    this.wxAPI;
    this.mediaMessage;
    this.wxScene;
    this.THUMB_WIDTH = 150;
    this.THUMB_HEIGHT = 150;

    let self = this;

    let register = function(){
        let context = utils.ad.getApplicationContext();
        self.wxAPI = com.tencent.mm.opensdk.openapi.WXAPIFactory.createWXAPI(context, self.appID, true);
        self.wxAPI.registerApp(self.appID);
    }

    Application.on('resume', register);
    Application.on('launch', register);
    register();
}

WeChat.prototype.isInstalled = function(){
    return this.wxAPI.isWXAppInstalled();
}
WeChat.prototype.config = {
    setThumbnailSize: setThumbnailQuality.apply(this)
}

// Send
WeChat.prototype.sendText = function(text){
    if(!text){
        throw new Error('Text cannot be empty');
    }
    let textObject = new com.tencent.mm.opensdk.modelmsg.WXTextObject(text);
    this.mediaMessage = this.mediaMessage || new com.tencent.mm.opensdk.modelmsg.WXMediaMessage();
    this.mediaMessage.mediaObject = textObject;
    this.decorate();
    return this;
}
WeChat.prototype.sendWebpage = function(url){
    if(!url){
        throw new Error('URL cannot be empty');
    }
    let webpageObject = new com.tencent.mm.opensdk.modelmsg.WXWebpageObject(url);
    this.mediaMessage = this.mediaMessage || new com.tencent.mm.opensdk.modelmsg.WXMediaMessage();
    this.mediaMessage.mediaObject = webpageObject;
    this.decorate();
    return this;
}
WeChat.prototype.sendImage = function(arg){
    if(!arg){
        throw new Error('Image Path/Data cannot be empty');
    }
    let pureArg = arg.replace(/^data:image\/\w*;base64,/, '');
    let imageObject = new com.tencent.mm.opensdk.modelmsg.WXImageObject();
    this.mediaMessage = this.mediaMessage || new com.tencent.mm.opensdk.modelmsg.WXMediaMessage();
    if(/^([A-Za-z0-9+\/]{4})*([A-Za-z0-9+\/]{4}|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{2}==)$/.test(pureArg)){
        let imageBitMap = base64ToBitMap(pureArg);
        imageObject = new com.tencent.mm.opensdk.modelmsg.WXImageObject(imageBitMap);
    }else{
        imageObject.setImagePath(pureArg);
    }
    this.mediaMessage.mediaObject = imageObject;
    this.addThumbnail(pureArg);
    this.decorate();
    return this;
}


// Add 
WeChat.prototype.decorate = function(opt){
    let options = opt || {};
    this.mediaMessage = this.mediaMessage || new com.tencent.mm.opensdk.modelmsg.WXMediaMessage();
    this.mediaMessage.title = options.title || ' ';
    this.mediaMessage.description = options.description || ' ';
    if(options.thumbData){
        this.mediaMessage.thumbData = this.addThumbnail(options.thumbData);
    }
    if(options.messageTagName){
        this.mediaMessage.messageTagName = options.messageTagName || ' ';
    }
    if(options.messageAction){
        this.mediaMessage.messageAction = options.messageAction || ' ';
    }
    if(options.messageExt){
        this.mediaMessage.messageExt = options.messageExt || ' ';
    }
    return this;
}
WeChat.prototype.addTitle = function(title){
    this.mediaMessage = this.mediaMessage || new com.tencent.mm.opensdk.modelmsg.WXMediaMessage();
    this.mediaMessage.title = title || ' ';
    return this;
}
WeChat.prototype.addDescription = function(description){
    this.mediaMessage = this.mediaMessage || new com.tencent.mm.opensdk.modelmsg.WXMediaMessage();
    this.mediaMessage.description = description || ' ';
    return this;
}
WeChat.prototype.addMessageTagName = function(messageTagName){
    this.mediaMessage = this.mediaMessage || new com.tencent.mm.opensdk.modelmsg.WXMediaMessage();
    this.mediaMessage.messageTagName = messageTagName || ' ';
    return this;
}
WeChat.prototype.addMessageAction = function(messageAction){
    this.mediaMessage = this.mediaMessage || new com.tencent.mm.opensdk.modelmsg.WXMediaMessage();
    this.mediaMessage.messageAction = messageAction || ' ';
    return this;
}
WeChat.prototype.addMessageExt = function(messageExt){
    this.mediaMessage = this.mediaMessage || new com.tencent.mm.opensdk.modelmsg.WXMediaMessage();
    this.mediaMessage.messageExt = messageExt || ' ';
    return this;
}
WeChat.prototype.addThumbnail = function(arg){
    let pureArg = arg.replace(/^data:image\/\w*;base64,/, '');
    if(/^([A-Za-z0-9+\/]{4})*([A-Za-z0-9+\/]{4}|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{2}==)$/.test(pureArg)){
        let imageBitMap = base64ToBitMap(pureArg);
        let scaledImageBitMap = android.graphics.Bitmap.createScaledBitmap(imageBitMap, this.THUMB_WIDTH, this.THUMB_HEIGHT, true);
        imageBitMap.recycle();
        this.mediaMessage.setThumbImage(scaledImageBitMap);
        // let stream = new java.io.ByteArrayOutputStream();
        // imageBitMap.compress(android.graphics.Bitmap.CompressFormat.JPEG, this.thumbnailQuality, stream);
        // this.mediaMessage.thumbData = stream.toByteArray();
        return this;
    }else{
        // var imageInBase64 = ImageSourceModule.fromNativeSource(arg).toBase64('png');
        // return this.addThumbnail(imageInBase64);
        let image = ImageSourceModule.fromFileOrResource(arg);
        let imageBitMap = android.graphics.Bitmap.createBitmap(image.android);
        let scaledImageBitMap = android.graphics.Bitmap.createScaledBitmap(imageBitMap, this.THUMB_WIDTH, this.THUMB_HEIGHT, true);
        imageBitMap.recycle();
        this.mediaMessage.setThumbImage(scaledImageBitMap);
        return this;
    }
}


// To
WeChat.prototype.to = function(scene){
    let request = new com.tencent.mm.opensdk.modelmsg.SendMessageToWX.Req();
    let result;
    request.transaction = new Date().getTime().toString();
    request.message = this.mediaMessage;

    switch (scene){
        case 'SESSION':
        case 'session':
            request.scene = com.tencent.mm.opensdk.modelmsg.SendMessageToWX.Req.WXSceneSession;
            result = this.wxAPI.sendReq(request);
            break;
        case 'TIMELINE':
        case 'timeline':
            request.scene = com.tencent.mm.opensdk.modelmsg.SendMessageToWX.Req.WXSceneTimeline;
            result = this.wxAPI.sendReq(request);
            break;
        case 'FAVORITE':
        case 'favorite':
            request.scene = com.tencent.mm.opensdk.modelmsg.SendMessageToWX.Req.WXSceneFavorite;
            result = this.wxAPI.sendReq(request);
            break;
        default:
            throw new Error('Invalid WeChat Scene, it should be one of "session", "timeline" or "favorite"');
    }

    return result;
}
WeChat.prototype.toSession = function(){
    this.to('session');
}
WeChat.prototype.toTimeline = function(){
    this.to('timeline');
}
WeChat.prototype.toFavorite = function(){
    this.to('favorite');
}

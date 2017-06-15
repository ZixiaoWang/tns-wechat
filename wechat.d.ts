declare var com: any;
declare var java: any;
declare var org: any;
declare var android: any;
declare class IWXAPI{
    registerApp(id: string)
    sendReq(req: any)
}
declare class WXMediaMessage{
    public mediaObject: any;
    public description: string;
}
declare class WXTextObject{
    public text: string;
}
declare class SendMessageToWX{
    public Req();
}

declare interface WXScene{
    WXSceneSession,
    WXSceneTimeline,
    WXSceneFavorite
}
declare interface SendMessageToWX{
    Req
}
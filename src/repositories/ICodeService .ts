export interface ICodeService {
    codeGenerator(): Promise<{ code: string, hashedCode: string, codeExpiration: Date }>
    codeVerifier(email:string, code:string): Promise<{isValid:boolean, data:object | null}>
    
    // codeSender(email:string): Promise<{isSent:boolean, message:string, hashed: string, expiration:Date}>
    // codeReSender(email:string): Promise<{isSent:boolean, status:number, message:string}>
    
    // resetPasswordEmailSender(email:string, url:string): Promise<{isSent:boolean, message:string}> 
};
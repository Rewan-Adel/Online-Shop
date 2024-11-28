export interface IAuthService {
    signup(username:string, email: string, password: string ): Promise<{ message:string, data:object}>;
    login(email: string, password: string ): Promise<{isLogin: boolean, message:string, data:object}>;
    forgotPassword(  email: string ): Promise<{ message:string, data:{resetUrl:string}}>;
    resetPassword(email:string,  password:string): Promise<{message:string, data:{user:object, token:string}}>;
    
    resendCodeForSignup(email:string): Promise<{ message:string }>
    resendCodeForReset(email:string): Promise<{ message:string }>
}
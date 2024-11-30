export interface IAuthService {
    signup(username:string, email: string, password: string ): Promise<{ message:string, data:object | null}>;
    login(email: string, password: string ): Promise<{isLogin: boolean, message:string, data:object | null}>;
    forgotPassword(  email: string ): Promise<{ message:string, data:object | null}>;
    resetPassword(resetToken:string,userID,password:string): Promise<{message:string, data:{user:object, token:string} | null}>;
    
    resendCodeForSignup(email:string): Promise<{ message:string }>
    resendCodeForReset(email:string): Promise<{ message:string }>
}
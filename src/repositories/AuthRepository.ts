interface AuthRepository {
    signup(username:string, email: string, password: string ): Promise<{isSignup:boolean, message:string, data?:object | null}>;
    login(email: string, password: string ): Promise<{isLogin: boolean, message:string, data:object | null}>;
    forgotPassword(email: string ): Promise<{isSent:boolean, message:string, data:{ userID: string,
        resetToken: string} | null} >;
    resetPassword(resetToken:string,userID,password:string): Promise<{isReset: boolean, message:string, data:{user:object, token:string} | null}>;
    
    ValidateUserEmail(email: string, code: string): Promise<{isValid:boolean, message:string, data?:object | null } >

    sendSignupCode(email:string): Promise<{isSent:boolean, message:string }>
    sendResetPasswordCode(email:string): Promise<{ message:string }>
};
export default AuthRepository;
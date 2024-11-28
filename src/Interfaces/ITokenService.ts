export interface ITokenService{
    generateToken(userId:string): string;
    verifyToken(token: string)
}
import jwt from "jsonwebtoken";

export interface IToken{
    generateToken(userId:string): string;
    verifyToken(token: string) : string | jwt.JwtPayload
};

class Token implements IToken{
    private secret: string;
    private expiresIn: string;

    constructor() {
        this.secret = process.env.JWT_SECRET || "defaultSecret";
        this.expiresIn = "90d";
    }

    generateToken(userId:string){
        const token = jwt.sign({
            userID: userId,
        }, this.secret);

        return token;
    }

    verifyToken(token: string) {
        return jwt.verify(token, this.secret) ;
    }
}

export default Token;

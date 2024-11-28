import jwt from "jsonwebtoken";
import { ITokenService } from "../repositories/ITokenService";

// interface Payload {
//     userID: string;
//     email: string;
//     [key: string]: unknown;
// }

class TokenService implements ITokenService{
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

export default TokenService;

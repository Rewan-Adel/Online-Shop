import bcrypt from "bcrypt";
import Logger from "../logger";

class EncryptionService {
    async hash(data: string): Promise<string> {
        try {
            return await bcrypt.hash(data, 10);
        } catch (error : any)  {
            Logger.error(error.message);
            throw new Error('Error hashing the password');
        }
    }
    
    async compare(data: string, hashedData: string): Promise<boolean> {
        try {
            return await bcrypt.compare(data, hashedData);
        } catch (error : any)  {
            Logger.error(error.message);
            throw new Error('Error comparing passwords');
        }
    }
    
}

export default EncryptionService;
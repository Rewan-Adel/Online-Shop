import bcrypt from "bcrypt";
import Logger from "./Logger";

class Encryption{
    async hash(data: string): Promise<string> {
        try {
            return await bcrypt.hash(data, 10);
        } catch (error: unknown) {
            if (error instanceof Error) {
               Logger.error(error)
                throw new Error('Error hashing the password');
            } else {
                Logger.error('Unknown error');
                throw new Error('Error hashing the password');
            }
        }
    }
    
    async compare(data: string, hashedData: string): Promise<boolean> {
        try {
            return await bcrypt.compare(data, hashedData);
        } catch (error: unknown) {
            if (error instanceof Error) {
               Logger.error(error)
                throw new Error('Error comparing passwords');
            } else {
                Logger.error('Unknown error');
                throw new Error('Error comparing passwords');
            }
        }
    }
    
}

export default Encryption;
import Encryption from '../shared/Encryption';

class Otp{
    private encryptionService: Encryption = new Encryption();
    /**
    * Generates a new OTP, hashes it, and sets an expiration time.
     * @returns {Promise<{ code: string, hashedCode: string, codeExpiration: Date }>}
     */
    public async otpGenerator(): Promise<{ code: string, hashedCode: string, codeExpiration: Date }> {
        const code =  Math.floor(100000 + Math.random() * 900000).toString();
        const hashedCode = await this.encryptionService.hash(code);
        const codeExpiration = new Date(Date.now() + 10 * 60 * 1000);
        
        return{
            code,
            hashedCode,
            codeExpiration
        }
    };
};

export default Otp;
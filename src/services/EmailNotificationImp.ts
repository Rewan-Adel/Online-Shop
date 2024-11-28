import { INotification } from "../repositories/INotification";
import { URLSearchParams } from "url";

class EmailNotificationImp implements INotification{
    async send(recipient: string, subject: string, content: string): Promise<boolean> {
        const params = new URLSearchParams();
        params.append("email", recipient);
        params.append("subject", subject);
        params.append("text", content);
        
        try{
            const response = await fetch(process.env.EMAIL_FORM_URL as string ,{
                method: "POST",
                body: params,
            });
            if(!response.ok)
                return false;
                
            return true;
        }
        catch (error : any) {
            throw new Error(error.message)
        }
    }
}

export default EmailNotificationImp;
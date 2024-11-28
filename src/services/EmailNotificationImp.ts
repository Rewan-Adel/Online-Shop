import { INotification } from "../repositories/INotification";
import { URLSearchParams } from "url";

class EmailNotificationImp implements INotification{
    async send(recipient: string, subject: string, content: string, options?: string): Promise<boolean> {
        const params = new URLSearchParams();
        params.append("email", recipient);
        params.append("subject", subject);
        params.append("text", content);
        params.append("html", options);
        
        try{
            const response = await fetch(process.env.EMAIL_FORM_URL,{
                method: "POST",
                body: params,
            });
            if(!response.ok)
                return false;
                
            return true;
        }
        catch(error){
            throw new Error(error.message)
        }
    }
}

export default EmailNotificationImp;
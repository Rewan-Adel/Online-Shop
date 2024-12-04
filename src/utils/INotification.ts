interface INotification{
    send(recipient: string, subject: string, content: string, options?: string): Promise<boolean>
};

export default INotification;
import { Payload } from '../path-to-payload-definition'; // Replace with the actual path to your Payload type

interface Payload {
    userID: string;
    [key: string]: unknown;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: Payload; // Add the `user` property to the Request interface
    }
}
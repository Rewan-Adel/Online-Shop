// the .d.ts file ensures that TypeScript globally augments the Request interface.
// Updating tsconfig.json guarantees that the compiler includes custom type definitions.
// Restarting the TypeScript server refreshes TypeScript’s understanding of the new types.
// If this still doesn’t resolve the issue, double-check:

// The location of your express.d.ts file.
// That the Payload type is correctly defined and imported.

interface Payload {
    userID: string;
    [key: string]: unknown;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: Payload; // Add the `user` property to the Request interface
    }
}
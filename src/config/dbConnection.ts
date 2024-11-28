import mongoose from "mongoose";

class dbConnection{
    private dbUri = process.env.DB_URI;

    constructor(){
        this.dbUri =process.env.DB_URI;
        this.connection()
    }
    public connection(){
        mongoose.connect(this.dbUri)
        .then(()=>{
            console.log("Database connected successfully.");
        })
        .catch((error)=>{
            console.log("Database connection failed.", error);
        })
    }
};

export default dbConnection;

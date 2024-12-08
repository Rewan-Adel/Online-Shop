import { Types } from "mongoose";
import Image from "./ImageType";

type Color = {
    id         : number, 
    hexadecimal: string, 
    plus_price : number, 
    stock_num  : number 
}; 

type Variation = {
    color  : Color,  
    size   : string
};

type ProductType = {
    _id:  Types.ObjectId;
    variations: [Variation];
    
    name       : string,
    slug       : string,
    brand      : string,
    description: string,

    original_price: number,
    stock_num     : number;
    avg_rating    : number;

    available   : boolean;
    isOffered   : boolean;
    
    main_image: Image;
    images    : [Image];
    

    category : Types.ObjectId;
    offer    : Types.ObjectId;
    reviews  : Types.ObjectId[];

    createdAt: Date;
    updatedAt: Date;
};

export default ProductType;
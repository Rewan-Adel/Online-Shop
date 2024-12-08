import { Types } from "mongoose";
import Image from "./ImageType";

type CategoryType = {
    _id   :  Types.ObjectId;
    name  : string;
    image : Image;
    parent: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export default CategoryType;
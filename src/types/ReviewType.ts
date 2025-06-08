type ReviewType ={
    productId: string; 
    userId: string;
    rating: number;
    title: string;
    content: string;
    likes?: number; 
    replies?: {
        userId: string; 
        comment: string;
        createdAt?: Date; 
    }[];
    createdAt?: Date; 
    updatedAt?: Date; 
}
export default ReviewType;
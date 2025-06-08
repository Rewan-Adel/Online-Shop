import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/category.model';
import Product from '../models/product.model';
import Review from '../models/Review.model';

// Load environment variables
dotenv.config();

// Furniture and Home specific categories with matching images and products
const categoriesData = [
    {
        name: 'Living Room Furniture',
        image: {
            url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749392019/Antique/Living_Room_Furniture_kaivvu.jpg",
            public_id: "Living_Room_Furniture_kaivvu"
        },
        products: [
            { name: 'Modern Sofa Set', brand: 'IKEA', price: 899.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391971/Antique/Modern_Sofa_Set_aqd7po.jpg", public_id: "Modern_Sofa_Set_aqd7po" },
            ] },
            { name: 'Coffee Table', brand: 'West Elm', price: 299.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391709/Antique/Coffee_Table_ri97mt.webp", public_id: "Coffee_Table_ri97mt" },
            ] },
            { name: 'TV Stand', brand: 'Wayfair', price: 199.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391780/Antique/TV_Stand_n7bbpk.jpg", public_id: "TV_Stand_n7bbpk" },
            ] }
        ]
    },
    {
        name: 'Bedroom Furniture',
        image: {
           url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391709/Antique/Bedroom_tysv12.jpg",
            public_id: "Bedroom_tysv12"
          },
        products: [
            { name: 'Queen Size Bed Frame', brand: 'Ashley', price: 549.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391709/Antique/Bed_kougq2.webp", public_id: "Bed_kougq2" },
            ] },
            { name: 'Nightstand', brand: 'IKEA', price: 89.99 , images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391717/Antique/Nightstand_gabaee.webp", public_id: "Nightstand_gabaee" },
            ]
            },
            { name: 'Dresser with Mirror', brand: 'Pottery Barn', price: 699.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391711/Antique/Dresser_with_Mirror_neks8o.jpg", public_id: "Dresser_with_Mirror_neks8o" },
            ]
            }
        ]
    },
    {
        name: 'Dining Room',
        image: {
            url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749392018/Antique/Dining_room_rjor2g.jpg",
            public_id: "Dining_room_rjor2g"
        },
        products: [
            { name: 'Dining Table Set', brand: 'Crate & Barrel', price: 799.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391711/Antique/Dining_Table_Set_ilygdd.webp", public_id: "Dining_Table_Set_ilygdd" },
            ] },
            { name: 'Dining Chairs (Set of 4)', brand: 'CB2', price: 399.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391709/Antique/Dining_Chairs_o3ucex.webp", public_id: "Dining_Chairs_o3ucex" },
            ] },
            { name: 'China Cabinet', brand: 'Restoration Hardware', price: 1299.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391708/Antique/China_Cabinet_curuzy.webp", public_id: "China_Cabinet_curuzy" },
            ] }
        ]
    },
    {
        name: 'Office Furniture',
        image: {
            url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391720/Antique/Office_se2igx.webp",
            public_id: "Office_se2igx"
        },
        products: [
            { name: 'Executive Office Desk', brand: 'Herman Miller', price: 899.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391713/Antique/Executive_Office_Desk_wufxhi.webp", public_id: "Executive_Office_Desk_wufxhi" },
            ] },
            { name: 'Ergonomic Office Chair', brand: 'Steelcase', price: 449.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391711/Antique/Ergonomic_Office_Chair_i0l5ef.jpg", public_id: "Ergonomic_Office_Chair_i0l5ef" },
            ] },
        ]
    },
    {
        name: 'Home Decor',
        image: {
            url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391711/Antique/Home_Decor_vhr1p4.webp",
            public_id: "Home_Decor_vhr1p4"
        },
        products: [
            { name: 'Wall Art Canvas Set', brand: 'Arteza', price: 89.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391773/Antique/Wall_Art_Canvas_Set_xfaxvn.webp", public_id: "Wall_Art_Canvas_Set_xfaxvn" },
            ] },
            { name: 'Table Lamp', brand: 'Philips', price: 79.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391760/Antique/Table_Lamp_nz1meb.webp", public_id: "Table_Lamp_nz1meb" },
            ] },
            { name: 'Decorative Vase', brand: 'Pottery Barn', price: 49.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391709/Antique/Decorative_Vase_p2rrwe.webp", public_id: "Decorative_Vase_p2rrwe" },
            ] }
        ]
    },
    {
        name: 'Storage Solutions',
        image: {
            url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391774/Antique/Storage_Solutions_fl6wfr.webp",
            public_id: "Storage_Solutions_fl6wfr"
        },
        products: [
            { name: 'Wardrobe Closet', brand: 'IKEA', price: 299.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391786/Antique/Wardrobe_Closet_dpu5al.webp", public_id: "Wardrobe_Closet_dpu5al" },
            ] },
        ]
    },
    {
        name: 'Lighting',
        image: {
            url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391728/Antique/Lighting_ysunuy.jpg",
            public_id: "Lighting_ysunuy"
        },
        products: [
            { name: 'Ceiling Fan with Light', brand: 'Hunter', price: 199.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391708/Antique/Ceiling_Fan_with_Light_qx1qjb.webp", public_id: "Ceiling_Fan_with_Light_qx1qjb" },
            ] },
            { name: 'Floor Lamp', brand: 'West Elm', price: 149.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391710/Antique/Floor_Lamp_g7stkp.webp", public_id: "Floor_Lamp_g7stkp" },
            ] },
        ]
    },
    {
        name: 'Rugs & Carpets',
        image: {
            url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391747/Antique/Rugs_Carpets_ghxlzk.jpg",
            public_id: "Rugs_Carpets_ghxlzk"
        },
        products: [
            { name: 'Persian Area Rug', brand: 'Rugs USA', price: 299.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391755/Antique/Persian_Area_Rug_x6nrn5.jpg", public_id: "Persian_Area_Rug_x6nrn5" },
            ] },
            { name: 'Shag Carpet', brand: 'Safavieh', price: 149.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391761/Antique/Shag_Carpet_qfpywl.jpg", public_id: "Shag_Carpet_qfpywl" },
            ] },
        ]
    },
    {
        name: 'Kitchen Furniture',
        image: {
            url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391719/Antique/Kitchen_nh5yhj.jpg",
            public_id: "Kitchen_nh5yhj"
        },
        products: [
            { name: 'Pantry Cabinet', brand: 'Home Depot', price: 249.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391740/Antique/Pantry_Cabinet_tvfrus.webp", public_id: "Pantry_Cabinet_tvfrus" },
        ]}]
    },
    {
        name: 'Bathroom Furniture',
        image: {
            url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391708/Antique/Bathroom_xnjrg3.webp",
            public_id: "Bathroom_xnjrg3"
        },
        products: [
            { name: 'Bathroom Vanity', brand: 'Home Decorators', price: 449.99, images:[
                { url: "https://res.cloudinary.com/dt6idcgyw/image/upload/v1749391709/Antique/Bathroom_Vanity_itgiyw.jpg", public_id: "Bathroom_Vanity_itgiyw" },
            ] },
        ]
    }
];

const colors = ['#000000', '#FFFFFF', '#FF0000', '#0000FF', '#008000', '#C0C0C0', '#FFD700'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const reviewTitles = [
    'Great product!', 'Love it!', 'Excellent quality', 'Highly recommended',
    'Good value for money', 'Perfect!', 'Amazing!', 'Worth buying'
];

const reviewContents = [
    'This product exceeded my expectations. The quality is outstanding and delivery was fast.',
    'Really happy with this purchase. Works exactly as described.',
    'Excellent build quality and great customer service.',
    'Amazing quality and fast shipping. Will definitely buy again!',
    'Perfect for my needs. Highly recommend to others.'
];

// Utility functions
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min;

const generateSlug = (name: string) => 
    name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

// Generate specific categories
const generateCategories = async () => {
    console.log('Starting to generate furniture and home categories...');
    const createdCategories: Array<ReturnType<typeof Category.prototype.toObject> & { productsData: { name: string; brand: string; price: number; }[] }> = [];

    for (const categoryData of categoriesData) {
        try {
            const newCategory = new Category({
                name: categoryData.name,
                image: categoryData.image
            });
            const saved = await newCategory.save();
            createdCategories.push({ ...saved.toObject(), productsData: categoryData.products });
            console.log(`Created category: ${saved.name}`);
        } catch (error: any) {
            console.log(`Error creating category ${categoryData.name}:`, error.message);
        }
    }

    console.log(`Successfully created ${createdCategories.length} furniture and home categories`);
    return createdCategories;
};

// Generate specific products
const generateProducts = async (categories: any[]) => {
    console.log('Starting to generate furniture and home products...');
    const products: mongoose.Document[] = [];

    for (const category of categories) {
        for (const productData of category.productsData) {
            const product = {
                name: productData.name,
                slug: generateSlug(productData.name),
                brand: productData.brand,
                description: `Premium ${productData.name.toLowerCase()} from ${productData.brand}. Perfect addition to your home and living space.`,
                original_price: productData.price,
                stock_num: randomInt(5, 50),
                avg_rating: Math.round(randomFloat(4, 5) * 10) / 10,
                available: true,
                isOffered: Math.random() < 0.25,
                main_image: productData.images ? productData.images[0] : category.image,
                images: productData.images || [category.image],
                variations: Array.from({ length: randomInt(1, 2) }, () => ({
                    color: {
                        hexadecimal: randomElement(colors),
                        plus_price: randomFloat(0, 50),
                        stock_num: randomInt(3, 20)
                    },
                    size: randomElement(sizes)
                })),
                category: category._id
            };

            try {
                const newProduct = new Product(product);
                const saved = await newProduct.save();
                products.push(saved);
                console.log(`Created product: ${saved.name} in ${category.name}`);
            } catch (error: any) {
                console.log(`Error creating product ${productData.name}:`, error.message);
            }
        }
    }

    console.log(`Successfully created ${products.length} furniture and home products`);
    return products;
};

// Generate reviews
const generateReviews = async (products: any[], count: number = 50) => {
    console.log('Starting to generate reviews...');
    const reviews: mongoose.Document[] = [];
    
    const userIds = Array.from({ length: 15 }, () => new mongoose.Types.ObjectId());

    for (let i = 0; i < count; i++) {
        const review = {
            productId: randomElement(products)._id,
            userId: randomElement(userIds),
            rating: randomInt(4, 5),
            title: randomElement(reviewTitles),
            content: randomElement(reviewContents),
            likes: randomInt(0, 25),
            replies: Math.random() < 0.2 ? [{
                userId: randomElement(userIds),
                comment: 'Thanks for the review! Very helpful.',
                createdAt: new Date()
            }] : []
        };

        try {
            const newReview = new Review(review);
            const saved = await newReview.save();
            reviews.push(saved);
            console.log(`Created review ${i + 1}`);
        } catch (error: any) {
            console.log(`Error creating review ${i}:`, error.message);
        }
    }

    console.log(`Successfully created ${reviews.length} reviews`);
    return reviews;
};

// Main seed function
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.DB_URI || 'mongodb://localhost:27017/online-shop';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB successfully');

        // Clear existing data
        console.log('Clearing existing data...');
        await Promise.all([
            Category.deleteMany({}),
            Product.deleteMany({}),
            Review.deleteMany({})
        ]);
        console.log('Existing data cleared');

        // Generate data
        const categories = await generateCategories();
        if (categories.length === 0) {
            throw new Error('No categories were created');
        }

        const products = await generateProducts(categories);
        if (products.length === 0) {
            throw new Error('No products were created');
        }

        const reviews = await generateReviews(products, 60);

        console.log('\n=== SEED SUMMARY ===');
        console.log(`Categories created: ${categories.length}`);
        console.log(`Products created: ${products.length}`);
        console.log(`Reviews created: ${reviews.length}`);
        console.log('Seed completed successfully!');
        
        process.exit(0);
    } catch (error: any) {
        console.error('Error seeding database:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    seedDatabase();
}

export default seedDatabase;

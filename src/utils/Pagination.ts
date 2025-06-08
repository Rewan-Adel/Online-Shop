const Pagination = async (page: string, Model)=>{
    const limit = 15;
    const currentPage  = parseInt(page) || 1;
    const skip  = (currentPage - 1) * limit;

    const totalObj = await Model.countDocuments();
    const totalPages = Math.ceil(totalObj / limit);

    return{
        limit,
        skip,
        totalObj,
        currentPage,
        totalPages
    };
};

export default Pagination;
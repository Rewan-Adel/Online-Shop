import UserType from "../types/userType";

interface UserRepository {
    findById(id: string): Promise<UserType | null>;
    findByEmail(email: string): Promise<UserType | null>;
    updateUser(userID: string, data: object): Promise<UserType | null>;
    deleteUser(userID: string): Promise<void>;
    deleteAll(): Promise<void>;
    findAll(page:string): Promise<{data:{
        users: UserType [] | null,
        total_users:  number,
        current_page: number,
        total_pages: number,
    }}>;
    createUser(username: string, email: string, password: string): Promise<UserType | null>;

    changeAvatar(userID: string, avatar: string): Promise<UserType | null >;
    deleteAvatar(userID: string): Promise<UserType | null>
    
    isActiveUser(userID: string): Promise<boolean>;
    enableUser(userID: string): Promise<UserType  | null>;    
    disableUser(userID: string): Promise<UserType | null>
};

export default UserRepository;
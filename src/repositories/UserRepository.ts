import UserType from "../types/userType";

interface UserRepository {
    findById(id: string): Promise<UserType | null>;
    findByEmail(email: string): Promise<UserType | null>;
    updateUser(userID: string, data: object): Promise<UserType | null>;
    deleteUser(userID: string): Promise<void>;
    deleteAll(): Promise<void>;
    findAll(): Promise<UserType[]>;
    createUser(username: string, email: string, password: string): Promise<UserType | null>;

    changeAvatar(userID: string, avatar: string): Promise<UserType | null >;
    deleteAvatar(userID: string): Promise<UserType | null>
    
    isActiveUser(userID: string): Promise<boolean>;
    enableUser(userID: string): Promise<UserType  | null>;    
    disableUser(userID: string): Promise<UserType | null>
};

export default UserRepository;
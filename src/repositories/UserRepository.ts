import UserType from "../types/userType";

interface UserRepository {
    createUser(username: string, email: string, password: string): Promise<UserType | null>;

    findById(id: string): Promise<UserType | null>;
    findByEmail(email: string): Promise<UserType | null>;
    findAll(currentUserId: string,page:string): Promise<{data:{
        users: UserType [] | null,
        total_users:  number,
        current_page: number,
        total_pages: number,
    }}>;

    updateUser(userID: string, data: object): Promise<UserType | null>;
    deleteUser(userID: string): Promise<void>;
    deleteAll(): Promise<void>;

    changeEmail(userID: string, email: string): Promise<{
        isSent:boolean,
        message: string }>;
    changePassword(userID: string, currentPassword: string, newPassword: string): Promise<{
        isChanged: boolean,
        message: string
    }>;
    changeAvatar(userID: string, avatar: string): Promise<UserType | null >;
    deleteAvatar(userID: string): Promise<UserType | null>
    isActiveUser(userID: string): Promise<{data:{message:string,active: boolean | null}}>
    enableUser(userID: string): Promise<UserType  | null>;    
    disableUser(userID: string): Promise<UserType | null>

    filterUsers(currentUserId: string, query: string, page: string): Promise<{data:{
        users: UserType [],
        total_users:  number,
        current_page: number,
        total_pages: number,
    }}>

    filterByStatus(currentUserId: string, query: string, page: string): Promise<{data:{
        users: UserType [],
        total_users:  number,
        current_page: number,
        total_pages: number,
    }}>
};

export default UserRepository;
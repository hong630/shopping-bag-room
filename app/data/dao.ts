export interface UserDao {
    email:string,
    nickname:string,
    password:string,
    question:string,
    answer:string
}

export interface ErrorResponse {
    state: string;
}


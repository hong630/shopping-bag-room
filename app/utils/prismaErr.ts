export const catchErrCode = (code:string)=>{
    switch (code) {
        case 'P2002':
            return { state: 'already email exists' };
        case 'P2003':
            return { state: 'Foreign key constraint violation.' };
        case 'P2004':
            return { state: 'A database constraint was violated.' };
        case 'EAUTH':
            return { state: 'invalid email' };
        case 'P2025':
            return { state: 'invalid email' };
        // 추가적인 오류 코드를 여기에 처리할 수 있음.
        default:
            return { state: 'An unknown error occurred.' };
    }
}


export interface USERDATA {
    email: string,
    nickname: string,
    belong: Array<string>,
    authority: Array<UserDataAuthority>
}

export interface UserDataAuthority{
    id: string,
    role: string
}

export interface MEMBER {
    email: string,
    nickname: string
}

export interface SHOPPINGLIST {
    name: string,
    shopped: boolean,
    id : number | null
}

export interface ROOMDETAILDATA {
    id:string,
    myShoppingRoom:string,
    detail:string,
    members:Array<MEMBER>,
    invitationLink:string,
    shoppingList:Array<SHOPPINGLIST>,
    authority:string
}

// INFO 로그인 세션
export interface User {
    id: number;
    email: string;
    nickname: string;
}

export interface LoggedInUserData {
    user: User | null;
    isLoggedIn: boolean;
}

export interface GetRoomDto {
    email:string,
    title:string,
    description:string
}

//INFO 룸

export interface RoomDto {
    roomId : number,
    title:string,
    description:string
}

//INFO 룸 상세
export interface RoomDetailMembersDto{
    email : string,
    nickname : string
}
export interface RoomDetailDto {
    code : string,
    description : string,
    master : Array<string>,
    members : Array<RoomDetailMembersDto>,
    roomId : number,
    title : string
}

//INFO 방정보 변경하기
export interface RoomChangeDto {
    email : string,
    title : string,
    description : string,
    roomId : number
}

//INFO 권한정보 변경하기
export interface MemberListProps {
    memberData: RoomDetailMembersDto[],
    authority : boolean,
    email : string,
    roomId : number
}
export interface AuthorityChangeDto {
    originManagerEmail : string,
    newManagerEmail : string,
    roomId : number
}

//INFO 쇼핑리스트
export interface ShoppingListDto{
    name : string,
    roomId : number
}

export interface ChangeShoppedDto{
    id : number,
    shopped : boolean
}
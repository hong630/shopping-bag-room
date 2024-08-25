import {ActionFunction, LoaderFunction} from "@remix-run/node";
import {PrismaClient} from "@prisma/client";
import {AuthorityChangeDto, GetRoomDto, RoomChangeDto} from "~/data/dto";


const prisma = new PrismaClient();

//INFO 방 만들기
//5자리 코드 생성
async function generateRandomCode(length: number){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters[randomIndex];
    }

    return result;
}

async function createRoom(title:string, description:string, code:string){
    return prisma.room.create({
        data: { title:title, description:description, code:code },
    });
}
//MemberRoom에 방 Id & 사용자 이메일 & master로 저장
export async function createMemberRoom(email:string, roomId:number, authority:string){
    return prisma.memberRoom.create({
        data: { email:email, roomId:roomId, authority:authority },
    });
}

async function makeRoom(body:GetRoomDto){
    try{
        const randomCode = await generateRandomCode(5);
        //저장된 방 정보
        const room = await createRoom(body.title, body.description, randomCode);
        await createMemberRoom(body.email, room.roomId, "master");
        return  {state:"Success"}
    }catch (err){
        //console.log(err)
        return  {state:err}
    }
}

//INFO 사용자 email로 참여하고 있는 방 정보 가져오기
async function getRoomInfoAll(email:string){
    const memberRooms = await prisma.memberRoom.findMany({
        where: {
            email: email
        },
        include: {
            room: true
        }
    });
    //Room 정보만 추출
    const rooms = memberRooms.map(memberRoom => memberRoom.room);
    return rooms;
}

//INFO 방 id별로 방 정보 보여주기
async function getRoomInfoDetail(roomId:number){
    const roomDetail = await prisma.room.findUnique({
        where: {
            roomId: roomId
        },
        include:{
            members : {
                    include : {
                        user : true
                    }
            }
        }
    });

    if (!roomDetail) {
        return {state : 'no room'};
    }

    const roomDetailInfo = {
        roomId: roomDetail.roomId,
        title: roomDetail.title,
        description: roomDetail.description,
        code: roomDetail.code,
        members: roomDetail.members.map(member => ({
            email: member.email,
            nickname: member.user.nickname
        })),
        master : roomDetail.members
            .filter(member => member.authority === 'master')
            .map(member => member.user.nickname[0] || '')
    };

    return roomDetailInfo;
}

//INFO 코드입력하면 방에 들어가기
async function enterRoomWithCode(email:string, roomId:number, code:string) {
    try{
        const roomData = await prisma.room.findUnique({
            where: {
                roomId: roomId
            }
        })

        // 방이 없음 에러
        if (!roomData) {
            return { state: 'Room not found' };
        }
        const roomCode = roomData.code;

        if(roomCode === code){
            await prisma.memberRoom.create({
                data: { email:email, roomId:roomId, authority:'normal'},
            });
            return {state : 'Success'}
        }else{
            return {state : 'Invalid Code'}
        }
    }catch(err){
        return {state : err}
    }
}

//INFO 권한 체크하기
//권한 가져오기
async function getAuthority(email:string, roomId:number){
    const userAuthority = await prisma.memberRoom.findUnique({
            where : {
                email_roomId:{
                    email : email,
                    roomId : roomId
                },
            },
            select : {
                authority : true
            }
        })
    return userAuthority
}

async function checkAuthority(email:string, roomId:number){
    try{
        const userAuthority = await getAuthority(email, roomId);
        if (!userAuthority) {
            throw new Error('Matched data not found');
        }

        return {state : userAuthority}

    }catch(err){
        return {state : 'Invalid email, roomId, or both'}
    }
}

//INFO 방정보 변경하기
async function changeRoomInfo(body:RoomChangeDto){
    try{
        const email = body.email;
        const title = body.title;
        const description = body.description;
        const roomId = Number(body.roomId);
        const userAuthority = await getAuthority(email, roomId);

        if (!userAuthority) {
            throw new Error('Matched data not found');
        }

        if(userAuthority.authority === 'master'){
            await prisma.room.update({
                where :{
                    roomId : roomId
                },
                data : {
                    title : title,
                    description : description
                }
            })
            return {state : 'Success'}
        }else{
            return {state : 'Not a master'}
        }
    }catch(err){
        return {state : err}
    }
}

//INFO 권한 변경하기
async function changeAuthority(email:string, roomId:number, authority:string){
    const changedAuthority = await prisma.memberRoom.update({
        where :{
            email_roomId:{
                email : email,
                roomId : roomId
            },
        },
        data : {
            authority : authority
        }
    })
    return changedAuthority
}

async function changeMaster(body:AuthorityChangeDto){

    const originManager = body.originManagerEmail;
    const newManager = body.newManagerEmail;
    const roomId = Number(body.roomId);

    //기존 마스터가 마스터인지, 다른 유저가 일반 유저인지 체크
    const checkMaster =  await getAuthority(originManager, roomId);
    const checkNormal = await getAuthority(newManager, roomId);

    if(!checkMaster || !checkNormal){
        return {state : 'Invalid users'}
    }

    if(checkMaster.authority === 'master' &&
        checkNormal.authority === 'normal'){
        //기존 마스터는 일반 유저로, 일반 유저는 마스터로 변경
        await changeAuthority(originManager, roomId, 'normal');
        await changeAuthority(newManager, roomId, 'master');
        return {state : 'Success'}
    }else{
        return {state : 'Invalid successor'}
    }
}

//INFO 방 나가기
async function deleteMemberRoom(email:string, roomId:number){
    const deletedMemberRoom = await prisma.memberRoom.delete({
        where : {
            email_roomId :{
                email : email,
                roomId : roomId
            }
        }
    })
    return deletedMemberRoom;
}

async function outRoom(email:string, roomId:number){
    //나가려는 멤버가 master인지 체크
    const checkMaster =  await getAuthority(email, roomId)
    if(!checkMaster){
        return {state : 'Invalid users'}
    }

    if(checkMaster.authority === 'master'){
        //마스터일 경우 권한 위임부터 부탁
        return {state : 'Master member cannot go out'}
    }else{
        //마스터가 아닐 경우 방에서 내보냄
        await deleteMemberRoom(email, roomId);
        return {state : 'Success'}
    }
}

//INFO 방 삭제 기능
async function deleteRoomData(roomId:number){
    await prisma.room.delete({
        where : {
            roomId : roomId
        }
    });
}
async function deleteRoom(email:string, roomId:number){
    //삭제하려는 멤버가 master인지 체크
    const checkMaster =  await getAuthority(email, roomId)
    if(!checkMaster){
        return {state : 'Invalid users'}
    }
    if(checkMaster.authority !== 'master'){
        //마스터가 아닐 경우 삭제 불가능
        return {state : 'Normal member cannot delete a room'}
    }else{
        //마스터일 경우 삭제
        //console.log('roomId', roomId)
        await deleteRoomData(roomId);
        return {state : 'Success'}
    }
}


export const loader:LoaderFunction = async ({request}) => {
    const loaderUrl = new URL(request.url);
    const email = loaderUrl.searchParams.get('email') || '';
    const type = loaderUrl.searchParams.get('type') || '';
    const roomId = Number(loaderUrl.searchParams.get('roomId')) || 0;
    switch(type){
        case 'all':
            //참여하고 있는 방 목록 가져옴
            return await getRoomInfoAll(email);
        case 'detail':
            //개별 방정보 가져옴
            return await getRoomInfoDetail(roomId);
        case 'authority' :
            return await checkAuthority(email,roomId)
        default:
            return {state : 'Invalid Type'}
    }
}


export const action:ActionFunction = async ({request}) => {
    const body = await request.json();
    const type = body.type;
    const email = body.email;
    const roomId = Number(body.roomId);
    const code = body.code;
    switch(type){
        case 'makeRoom':
            //방 만들기
            return await makeRoom(body);
        case 'enter':
            //방 들어가기
            return await enterRoomWithCode(email, roomId, code);
        case 'update':
            //방 정보
            return await changeRoomInfo(body);
        case 'changeMaster':
            //방 권한 변경
            return await changeMaster(body);
        case 'outRoom':
            //방 나가기
            return await outRoom(email, roomId);
        case 'deleteRoom':
            //방 삭제하기
            return await deleteRoom(email, roomId);
        default:
            return {state : 'Invalid Type'}
    }
}
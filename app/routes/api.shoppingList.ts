import {PrismaClient} from "@prisma/client";
import {ActionFunction, LoaderFunction} from "@remix-run/node";
import {ChangeShoppedDto, ShoppingListDto} from "~/data/dto";

const prisma = new PrismaClient();

//INFO 쇼핑리스트 추가하기
async function createShoppingList(name:string, roomId:number){
    const createdShoppingItem = await prisma.shoppingItem.create({
        data: { name:name, shopped:false, roomId:roomId},
    })
    return createdShoppingItem;
}

async function addShoppingList(body:ShoppingListDto){
    const name = body.name;
    const roomId = Number(body.roomId);
    try{
        const createdShoppingItem = await createShoppingList(name, roomId);
        return {state : createdShoppingItem}
    }catch(err){
        return {state : err}
    }
}

//INFO 쇼핑리스트 삭제하기
async function deleteShoppingListData(id:number){
    await prisma.shoppingItem.delete({
        where:{
            id:id
        }
    })
}
async function deleteShoppingList(id:number){
    try{
        await deleteShoppingListData(id);
        return {state : 'Success'}
    }catch(err){
        return {state : err}
    }
}

//INFO 쇼핑리스트 정보 불러오기
async function getShoppingListData(roomId:number){
    const shoppingList = await prisma.shoppingItem.findMany({
        where: {
            roomId: roomId
        }
    });

    if (!shoppingList) {
        return {state : 'no shoppingList'};
    }

    const formattedShoppingList = shoppingList.map((list)=>{
        return {
            name : list.name,
            shopped : list.shopped,
            id : list.id}
    })

    return formattedShoppingList
}

async function getShoppingList(roomId : number){
    try{
        const shoppingList = await getShoppingListData(roomId);
        return {state : shoppingList}
    }catch(err){
        return {state : err}
    }
}

//INFO 쇼핑리스트 정보 변경하기 (shopped true-false)
async function changeShoppedData(id:number, shopped:boolean){
    const changedShopped = await prisma.shoppingItem.update({
        where :{
            id : id
        },
        data : {
            shopped : shopped
        }
    })
    return changedShopped
}

async function changeShopped(body:ChangeShoppedDto){
    const id = Number(body.id);
    const shopped = body.shopped;

    try{
        await changeShoppedData(id,shopped);
        return {state : 'Success'}
    }catch(err){
        return {state : err}
    }
}

export const action:ActionFunction = async ({request}) => {
    const body = await request.json();
    const type = body.type;
    const id = Number(body.id);
    switch(type){
        case 'addShoppingList':
            //쇼핑리스트 추가
            return await addShoppingList(body);
        case 'deleteShoppingList':
            //쇼핑리스트 삭제
            return await deleteShoppingList(id);
        case 'changeShopped':
            //쇼핑 목록 상태 변경
            return await changeShopped(body);
        default:
            return {state : 'Invalid Type'}
    }
}

export const loader:LoaderFunction = async ({request}) => {
    const loaderUrl = new URL(request.url);
    const type = loaderUrl.searchParams.get('type') || '';
    const roomId = Number(loaderUrl.searchParams.get('roomId')) || 0;
    switch(type){
        case 'getShoppingList':
            //쇼핑리스트 목록 가져옴
            return await getShoppingList(roomId);
        default:
            return {state : 'Invalid Type'}
    }
}
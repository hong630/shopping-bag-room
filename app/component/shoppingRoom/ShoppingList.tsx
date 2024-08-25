import React, {useEffect, useRef, useState} from "react";
import {SHOPPINGLIST} from "~/data/dto";
import {getBaseUrl, getWsUrl} from "~/utils/getBaseUrl";

const ShoppingList = (props:{email:string, managerName:string, roomId:number}) => {
    const apiUrl = getBaseUrl();
    const originShoppingList:Array<SHOPPINGLIST> = [{name:'아직 장바구니 목록이 없습니다.',shopped:false, id:null}];
    const [shoppingList, setShoppingList] = useState<Array<SHOPPINGLIST>>(originShoppingList)

    const [websocket, setWebsocket] = useState<WebSocket|null>(null)

    const getShoppingList = () => {
        const url = new URL(`${apiUrl}/api/shoppingList`);
        url.searchParams.append('roomId', props.roomId.toString());
        url.searchParams.append('type', 'getShoppingList');
        fetch(url,
            {
                method: "GET",
            })
            .then(async (res)=>{
                const data = await res.json();
                setShoppingList(data.state)
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    useEffect(()=>{

        // 전역 클릭 테스트

        window.onclick = (event)=>{
            if (event.target === null) return
            let target = event.target as HTMLElement
            if (target.closest("li") === null) {
                setNewList(false)
                return;
            }
        }

        //쇼핑리스트 불러오기 API
        getShoppingList()
        const wsUrl = getWsUrl();
        const ws = new WebSocket(wsUrl);

        ws.onmessage = (event) => {
            console.log("event check")
            const message = JSON.parse(event.data);
            //TODO 다른 메시지 처리 로직 추가
            if (message.type === "createGroup"){
                // console.log('Received createGroup message:', message);
                ws.send(JSON.stringify({ type:"joinGroup",groupId:props.roomId, userId:props.email}))
            } else {
                // console.log('Received message:', message);
                getShoppingList()
            }
        };
        ws.onopen = () => {
            ws.send(JSON.stringify({ type:"createGroup",groupId:props.roomId, userId:props.email}))
        }
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
        ws.onerror = (error) => {
            console.log('WebSocket error:', error);
        };

        setWebsocket(ws)

        return ()=>{
            ws.close()
        }

    },[])


    const inputElement = useRef<HTMLInputElement>(null)

    const sendMessage = () => {
        // console.log("Send!!!")
        websocket?.send(JSON.stringify({ type:"message",groupId:props.roomId, message:"modify Shopping list"}))
    }

    //쇼핑리스트 추가하기
    const addShoppingList = () => {
        const shopValue = inputElement.current?.value || ""

        //쇼핑리스트 추가하기 API
        fetch(`${apiUrl}/api/shoppingList`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "addShoppingList",
                    name : shopValue,
                    roomId : props.roomId,
                }),
            })
            .then(async (res)=>{
                const data = await res.json()
                const response = data.state;
                if (response){
                    if (shopValue !== undefined && shopValue !== null ){
                        const addedListObject:SHOPPINGLIST = {name:shopValue, shopped:false, id:response.id}
                        if(shoppingList.findIndex((value)=>{return value["name"] === shopValue}) < 0){
                            setShoppingList([... shoppingList, addedListObject]);
                            setNewList(false);
                            sendMessage()
                        }else{
                            alert("이미 동일한 장바구니 목록이 존재합니다.")
                        }
                    }
                }else{
                    console.log('response :', response)
                }
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    const listUp = async (event:React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === "Enter") {
            await addShoppingList()
            // if(inputElement.current !== null){
            //     inputElement.current.value = ""
            // }
            setNewList(false);
        }
    }

    //쇼핑리스트 삭제하기
    const removeShoppingList = (event:React.MouseEvent<HTMLButtonElement>) => {
        const previousSibling = event.currentTarget.previousSibling;
        const parentElement = event.currentTarget.closest('li');
        if(parentElement){
            const shoppingItemId = parentElement.getAttribute('data-key');
            //쇼핑리스트 삭제하기 API
            fetch(`${apiUrl}/api/shoppingList`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "deleteShoppingList",
                        id : shoppingItemId,
                    }),
                })
                .then(async (res)=>{
                    const data = await res.json()
                    const response = data.state;
                    if (response === 'Success'){
                        if(previousSibling !== null){
                            const previousSiblingText = previousSibling.textContent
                            const newShoppingList = shoppingList.filter((value)=>{
                                return value["name"] !== previousSiblingText
                            })
                            setShoppingList([... newShoppingList])
                            sendMessage()
                        }
                    }else{
                        console.log('response :', response)
                    }
                })
                .catch((err)=>{
                    console.log(err)
                })
        }
    }

    //쇼핑리스트 완료하기
    const checkShoppedList = (event:React.MouseEvent<HTMLButtonElement>) => {
        const parentElement = event.currentTarget.closest('li');
        if(parentElement){
            const shoppingItemId = parentElement.getAttribute('data-key');
            const shoppingItemShopped = parentElement.getAttribute('data-shoppped');
            const isShopped = shoppingItemShopped === 'true';
            //쇼핑리스트 상태 변경하기 API
            fetch(`${apiUrl}/api/shoppingList`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "changeShopped",
                        id : shoppingItemId,
                        shopped : !isShopped
                    }),
                })
                .then(async (res)=>{
                    const data = await res.json()
                    const response = data.state;
                    if (response === 'Success'){
                        shoppingList.map((value)=>{
                            if(value["id"] == shoppingItemId) value["shopped"] = !isShopped
                        })
                        setShoppingList([...shoppingList]);
                        sendMessage()
                    }else{
                        console.log('response :', response)
                    }
                })
                .catch((err)=>{
                    console.log(err)
                })
        }
    }

    //새로운 리스트 추가
    const [newList, setNewList] = useState(false);

    const addNewList = () => {
        setNewList(true);
    }

    return (
        <>
            <h1 className="shopping-list-title">사야할 것</h1>
            <ul className="room-list">
                <li className="room-item">
                    <button className="btn-add-list" onClick={addNewList}>
                        <svg className="icon-room-list"  viewBox="0 0 448 512">
                            <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z">
                            </path>
                        </svg>
                        <span className="room-title">추가하기</span>
                    </button>
                </li>
                {
                    newList?
                        <li className="room-item add-list">
                            <div className="input-container">
                                <div className="img-container icon-shopped">
                                    <img src="/icon-unshopped.png" alt="구매하지않음 아이콘"/>
                                </div>
                                <input className="room-title" type="text" id="new_item"
                                       ref={inputElement} onKeyDown={listUp} placeholder="입력 중..."/>
                            </div>
                            <button className="btn-complete" onClick={addShoppingList}>
                                완료
                            </button>
                        </li>:
                        <div></div>
                }
                {shoppingList.map((item) => {
                    return (
                        <li className="room-item item-shopping-list" key={item.id} data-key={item.id} data-shoppped={item.shopped}>
                            <div className="shopping-list-container">
                                <button onClick={checkShoppedList} className="btn-list-function">
                                    <div className="img-container icon-shopped">
                                        <img src={item.shopped ? "/icon-shopped.png" : "/icon-unshopped.png"} alt={item.shopped ? "구매함" : "구매하지 않음"}/>
                                    </div>
                                </button>
                                <span className="room-title">{item.name}</span>
                            </div>
                            <button onClick={removeShoppingList} className="btn-list-function">
                                <svg className="icon-room-list"  viewBox="0 0 24 24">
                                    <path d="M0 0h24v24H0z" fill="none">
                                    </path>
                                    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
                                    </path>
                                </svg>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </>
    )
}

export default ShoppingList;
//세션에서 로그인한 사용자 정보 가져오기
import {useLoaderData, useParams} from "react-router";
import {LoggedInUserData, RoomDetailDto} from "~/data/dto";
import {LoaderFunction, redirect} from "@remix-run/node";
import {getUserSession} from "~/routes/session";
import SimpleHeader from "~/component/common/SimpleHeader";
import React, {useEffect, useState} from "react";
import {getBaseUrl} from "~/utils/getBaseUrl";

export const loader: LoaderFunction = async ({ request }) => {
    const data:LoggedInUserData = await getUserSession(request);
    if (!data.isLoggedIn) {
        // 로그인하지 않았으면 로그인 페이지로 리다이렉트
        return redirect("/room");
    }
    return data;
};
const DeleteRoom = () => {
    const params = useParams<string>()
    const roomId:string = params.id || "";
    const data = useLoaderData() as LoggedInUserData;
    const { user } = data;
    const userEmail = user?.email || "";
    const apiUrl = getBaseUrl();
    const submitToDeleteRoom = () => {
        fetch(`${apiUrl}/api/room`,
            {
                method : "DELETE",
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify({
                    type: "deleteRoom",
                    email : userEmail,
                    roomId : Number(roomId)
                }),
            }).then(async(res)=>{
            const data = await res.json();
            const response = data.state;
            if(response === 'Success'){
                location.href = '/room'
            }else{
                //console.log('response : ', response)
            }
        }).catch((err)=>{
            //console.log(err)
        })
    }
    //방정보 담기
    const [roomDetailInfo, setRoomDetailInfo] = useState<RoomDetailDto | null>(null)

    useEffect(()=>{
        const url = new URL(`${apiUrl}/api/room`);
        url.searchParams.append('roomId', roomId);
        url.searchParams.append('type', 'detail');
        //로그인 API
        fetch(url,
            {
                method: "GET",
            })
            .then(async (res)=>{
                const data:RoomDetailDto = await res.json();
                setRoomDetailInfo(data);
            })
            .catch((err)=>{
                //console.log(err)
            })
    },[])

    return (
        <div>
            <SimpleHeader title="장바구니 삭제하기"></SimpleHeader>
            <div className="wrap alert-wrap">
                <svg className="icon-modal"  viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none">
                    </path>
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z">
                    </path>
                </svg>
                <p className="alert-title-message">정말로 장바구니를 삭제하시겠습니까?</p>
                {
                    roomDetailInfo?
                        <p className="alert-sub-message">장바구니 : {roomDetailInfo.title}</p>
                        :<div></div>
                }
                <div className="buttons-wrap">
                    <button onClick={submitToDeleteRoom}>예</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteRoom;
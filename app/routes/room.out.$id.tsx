import {LoaderFunction, redirect} from "@remix-run/node";
import {LoggedInUserData, RoomDetailDto} from "~/data/dto";
import {getUserSession} from "~/routes/session";
import {useLoaderData, useParams} from "react-router";
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

const OutRoom = () => {
    const params = useParams<string>()
    const roomId:string = params.id || "";
    const data = useLoaderData() as LoggedInUserData;
    const { user } = data;
    const userEmail = user?.email || "";
    const apiUrl = getBaseUrl();
    //권한 설정
    const [authority, setAuthority] = useState(false);
    //권한 체크
    const checkAuthority = () => {
        const url = new URL(`${apiUrl}/api/room`);
        url.searchParams.append('type', 'authority');
        url.searchParams.append('email', userEmail);
        url.searchParams.append('roomId', roomId.toString());

        fetch(url)
            .then(async(res)=>{
                const data = await res.json();
                if(data.state.authority === 'master'){
                    //주인일 시 나갈 수 없음
                    setAuthority(true)
                }else{
                    //주인 아닐 시 나갈 수 있음
                    setAuthority(false)
                }
            }).catch((err)=>{
            //console.log(err)
        })
    }

    //방정보 담기
    const [roomDetailInfo, setRoomDetailInfo] = useState<RoomDetailDto | null>(null)

    //방 나가기
    const outOfRoom = async () => {
        //방 나가기 API
        fetch(`${apiUrl}/api/room`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "outRoom",
                    email : userEmail,
                    roomId : roomId,
                }),
            })
            .then(async (res)=>{
                const data = await res.json()
                const response = data.state;
                if (response === 'Success'){
                    //방 목록 페이지로 이동
                    location.href = '/room';
                }else if (response === 'Master member cannot go out'){
                    alert('주인은 나갈 수 없습니다. 주인 권한을 위임한 후 나가주세요.');
                }else{
                    //console.log('response :', response)
                }
            })
            .catch((err)=>{
                //console.log(err)
            })
    }
    useEffect(()=>{
        checkAuthority();
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
            <SimpleHeader title="장바구니 나가기"></SimpleHeader>
            <div className="wrap alert-wrap">
                <svg className="icon-modal"  viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none">
                    </path>
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z">
                    </path>
                </svg>
                {
                    authority ?
                        <div>
                            <p className="alert-title-message">주인은 장바구니를 나갈 수 없습니다.<br/>
                                권한을 위임하거나 장바구니를 삭제해주세요.</p>
                            {
                                roomDetailInfo?
                                    <p className="alert-sub-message">장바구니 : {roomDetailInfo.title}</p>
                                    :<div></div>
                            }
                        </div>
                        : <div>
                            <p className="alert-title-message">정말로 장바구니를 나가시겠습니까?</p>
                            {
                                roomDetailInfo?
                                    <p className="alert-sub-message">장바구니 : {roomDetailInfo.title}</p>
                                    :<div></div>
                            }
                            <div className="buttons-wrap">
                                <button onClick={outOfRoom}>예</button>
                            </div>
                        </div>
                }

            </div>
        </div>
    )
}
export default OutRoom;
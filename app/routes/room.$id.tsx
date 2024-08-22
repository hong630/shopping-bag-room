import {LoggedInUserData, RoomDetailDto} from "~/data/dto";
import React, {useEffect, useState} from 'react';
import ShoppingList from "~/component/shoppingRoom/ShoppingList";
import {useLoaderData, useParams} from "react-router";
import {Form, Link} from "@remix-run/react";
import {LoaderFunction, redirect} from "@remix-run/node";
import {getUserSession} from "~/routes/session";
import RoomHeader from "~/component/common/RoomHeader";
import type {LinksFunction} from "@remix-run/node"
import styles from "~/styles/room-detail.css?url"
import SimpleHeader from "~/component/common/SimpleHeader";
import {sanitizeValue} from "~/utils/sanitize";
import {getBaseUrl} from "~/utils/getBaseUrl";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

//세션에서 로그인한 사용자 정보 가져오기
export const loader: LoaderFunction = async ({ request }) => {
    const data:LoggedInUserData = await getUserSession(request);
    if (!data.isLoggedIn) {
        // 로그인하지 않았으면 로그인 페이지로 리다이렉트
        return redirect("/room");
    }
    return data;
};

const DetailRoom = () => {
    const params = useParams<string>()
    const roomId:string = params.id || "";
    const data = useLoaderData() as LoggedInUserData;
    const { user } = data;
    const userEmail = user?.email || "";
    const userNickname = user?.nickname || "";
    const apiUrl = getBaseUrl();

    const copyInvitationLink = (event:React.MouseEvent<HTMLButtonElement>) => {
        const code = event.currentTarget.value;

        const invitationText = `우리 같은 장바구니 공유하지 않을래요? ${apiUrl}/room/${roomId} 에 접속 후, 코드 ${code}를 입력해 들어와주세요.`

        if (typeof navigator !== "undefined") {
            navigator.clipboard.writeText(invitationText).then(() => {
                //복사 성공하면 성공했다는 토스트 팝업 만들어야 함
                alert('초대메시지가 복사되었습니다. 장바구니를 공유하고 싶은 친구에게 메시지를 보내주세요!');
            }).catch(err => {
                console.error('복사 실패:', err);
                //복사 실패하면 실패했다는 토스트 팝업 만들어야 함
            });
        }
    }

    //방 멤버 여부 판별
    const [notMember, setNotMember] = useState(false);
    //방정보 담기
    const [roomDetailInfo, setRoomDetailInfo] = useState<RoomDetailDto | null>(null)

    //권한 설정
    const [authority, setAuthority] = useState(false);

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
                console.log(data);
                const roomMember = data.members.filter(member => member.email === userEmail);
                setRoomDetailInfo(data);
                console.log(data);
                if(roomMember.length > 0){
                    //회원의 방의 멤버일 때
                    setNotMember(false);
                }else{
                    //회원의 방의 멤버가 아닐 때
                    setNotMember(true);
                }
            })
            .catch((err)=>{
                console.log(err)
            })
    },[])


    const enterRoom = async (event:React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(event.currentTarget);
        const code = formData.get("code");

        if(code !== null){
            const sanitizedCode = await sanitizeValue(code.toString().toUpperCase())

            //방 들어가기 API
            fetch(`${apiUrl}/api/room`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "enter",
                        email : userEmail,
                        roomId : roomId,
                        code : sanitizedCode
                    }),
                })
                .then(async (res)=>{
                    console.log(res)
                    const data = await res.json()
                    const response = data.state;
                    if (response === 'Success'){
                        //방 목록 페이지로 이동
                        location.reload();
                    }else{
                        console.log('response :', response)
                        alert('코드가 올바르지 않습니다. 다시 입력해주세요.')
                    }
                })
                .catch((err)=>{
                    console.log(err)
                })
        }

    }

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
                    //주인일 시 방소개 변경 노출
                    setAuthority(true)
                }else{
                    //주인 아닐 시 방소개 변경 숨김
                    setAuthority(false)
                }
            }).catch((err)=>{
            console.log(err)
        })
    }


    useEffect(()=>{
        //권한 체크
        checkAuthority();
    },[])

    return (
        <div>
            {
                notMember?
                    <div>
                        <SimpleHeader title="장바구니 입장하기"></SimpleHeader>
                        <Form onSubmit={enterRoom}>
                            <div className="wrap alert-wrap">
                                <svg className="icon-modal"  viewBox="0 0 24 24">
                                    <path d="M0 0h24v24H0V0z" fill="none">
                                    </path>
                                    <path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zM16 5v3H6V5h10zm2.5 3H18V5h.5c.83 0 1.5.67 1.5 1.5S19.33 8 18.5 8zM4 19h16v2H4v-2z">
                                    </path>
                                </svg>
                                <h1>코드 입력</h1>
                                {
                                    roomDetailInfo?
                                        <p className="alert-message">'{roomDetailInfo.title}'에 입장하기위한 코드를 입력해주세요.</p>
                                        :<div></div>
                                }
                                <label className="visually-hidden" htmlFor="code">코드 입력</label>
                                <input type="text" name="code" placeholder="코드를 입력해주세요."/>
                                <div className="buttons-wrap">
                                    <button type="submit">예</button>
                                </div>
                            </div>
                        </Form>
                    </div>
                    :
                    <div></div>
            }
            {
                roomDetailInfo && !notMember?
                    <div>
                        <RoomHeader userName={userNickname} roomId={roomId} userEmail={userEmail}></RoomHeader>
                        <div className="wrap room-detail">
                            <h1 className="room-title">{roomDetailInfo.title}</h1>
                            <div className="room-info-container">
                                <div className="room-text-info-container">
                                    <div className="room-text-info">
                                        <svg className="icon-bag" viewBox="0 0 24 24">
                                            <path d="M0 0h24v24H0V0z" fill="none">
                                            </path>
                                            <path d="M5 8v12h14V8H5zm7 6c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z" opacity=".3">
                                            </path>
                                            <path d="M17 6c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-2zm-5-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z">
                                            </path>
                                        </svg>
                                        <span>장바구니 번호 : {roomId}</span>
                                    </div>
                                    <div className="room-text-info">
                                        <svg className="icon-person" viewBox="0 0 24 24">
                                            <path d="M0 0h24v24H0V0z" fill="none">
                                            </path>
                                            <path opacity=".3" d="M12 5.9a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 1 0 0-4.2zM12 14.9c-2.97 0-6.1 1.46-6.1 2.1v1.1h12.2V17c0-.64-3.13-2.1-6.1-2.1z">
                                            </path>
                                            <path d="M12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6.1 5.1H5.9V17c0-.64 3.13-2.1 6.1-2.1s6.1 1.46 6.1 2.1v1.1zM12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6.1a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2z">
                                            </path>
                                        </svg>
                                        <span>주인 : {roomDetailInfo?.master[0]}</span>
                                    </div>
                                </div>
                                <div className="room-function-container">
                                    <button className="btn-invite" onClick={copyInvitationLink} value={roomDetailInfo.code}>
                                        <svg className="icon-invitation" viewBox="0 0 24 24">
                                            <path fill="none" d="M0 0h24v24H0z">
                                            </path>
                                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9v-2H4V8l8 5 8-5v5h2V6c0-1.1-.9-2-2-2zm-8 7L4 6h16l-8 5zm7 4 4 4-4 4v-3h-4v-2h4v-3z">
                                            </path>
                                        </svg>
                                        <span>초대하기</span>
                                    </button>
                                    <Link to={`/room/members/${roomId}`}
                                          className="anchor-edit">
                                        <svg className="icon-members"  viewBox="0 0 24 24">
                                            <path d="M0 0h24v24H0z" fill="none">
                                            </path>
                                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z">
                                            </path>
                                        </svg>
                                        <span>참여자</span>
                                    </Link>
                                </div>
                            </div>
                            <p className="room-info-detail">{roomDetailInfo.description}</p>
                            <ShoppingList email={userEmail || ""} managerName={roomDetailInfo?.master[0]} roomId={Number(roomId)}/>
                        </div>
                    </div> :
                    <div></div>
            }

        </div>
    )
}
export default DetailRoom;
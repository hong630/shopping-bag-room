import {useParams} from "react-router";
import React, {useEffect, useState} from "react";
import {RoomDetailDto, RoomDetailMembersDto} from "~/data/dto";
import SimpleHeader from "~/component/common/SimpleHeader";
import type {LinksFunction} from "@remix-run/node"
import styles from "~/styles/room-detail.css?url"
import {getBaseUrl} from "~/utils/getBaseUrl";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];
const MemberList = () => {
    const params = useParams<string>()
    const roomId:string = params.id || "";
    const apiUrl = getBaseUrl();
    //방정보 담기
    const [roomMembers, setRoomMembers] = useState<RoomDetailMembersDto[]>([]);
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
                setRoomMembers(data.members);
            })
            .catch((err)=>{
                //console.log(err)
            })
    },[])
    return (
        <div>
            <div>
                <SimpleHeader title="참여자 보기"></SimpleHeader>
                <div className="wrap member-list-wrap">
                    <ul className="room-list">
                        {
                            roomMembers?.map((member, index)=> (
                                <li key={index} className="room-item">
                                    <div className="box">
                                        <svg className="icon-room-list"  viewBox="0 0 24 24">
                                            <path d="M0 0h24v24H0V0z" fill="none">
                                            </path>
                                            <path opacity=".3" d="M12 5.9a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 1 0 0-4.2zM12 14.9c-2.97 0-6.1 1.46-6.1 2.1v1.1h12.2V17c0-.64-3.13-2.1-6.1-2.1z">
                                            </path>
                                            <path d="M12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6.1 5.1H5.9V17c0-.64 3.13-2.1 6.1-2.1s6.1 1.46 6.1 2.1v1.1zM12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6.1a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2z">
                                            </path>
                                        </svg>
                                        <span className="room-title">{member.nickname}</span>
                                        <span className="room-detail">({member.email})</span>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default MemberList;
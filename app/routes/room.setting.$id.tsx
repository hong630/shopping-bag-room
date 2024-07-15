import SimpleHeader from "~/component/common/SimpleHeader";
import React from "react";
import type {LinksFunction, LoaderFunction} from "@remix-run/node"
import styles from "~/styles/room-detail.css?url"
import {useLoaderData, useParams} from "react-router";
import {Link} from "@remix-run/react";
import {LoggedInUserData} from "~/data/dto";
import {getUserSession} from "~/routes/session";
import {redirect} from "@remix-run/node";

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

const SettingRoom = () => {
    const params = useParams<string>()
    const roomId:string = params.id || "";
    const data = useLoaderData() as LoggedInUserData;
    const { user } = data;

    return (
        <div>
            <SimpleHeader title="장바구니 관리"></SimpleHeader>
            <div className="wrap setting-wrap">
                <ul className="room-list">
                    <li className="room-item">
                        <Link to={`/room/edit/${roomId}`}>
                            <svg className="icon-room-list"  viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none">
                                </path>
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z">
                                </path>
                            </svg>
                            <span className="room-title">장바구니 정보 변경</span>
                        </Link>
                    </li>
                    <li className="room-item">
                        <Link to={`/room/authority/${roomId}`}>
                            <svg className="icon-room-list"  viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none">
                                </path>
                                <path d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z">
                                </path>
                            </svg>
                            <span className="room-title">주인 변경하기</span>
                        </Link>
                    </li>
                    <li className="room-item">
                        <Link to={`/room/delete/${roomId}`}>
                            <svg className="icon-room-list"  viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0V0z" fill="none">
                                </path>
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z">
                                </path>
                            </svg>
                            <span className="room-title">장바구니 삭제하기</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default SettingRoom;
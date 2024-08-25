import SimpleHeader from "~/component/common/SimpleHeader";
import React, {useEffect, useRef, useState} from "react";
import type {LinksFunction, LoaderFunction} from "@remix-run/node"
import styles from "~/styles/room-detail.css?url"
import {useLoaderData, useParams} from "react-router";
import {LoggedInUserData, RoomDetailDto, RoomDetailMembersDto} from "~/data/dto";
import {Form, Link} from "@remix-run/react";
import {getUserSession} from "~/routes/session";
import {redirect} from "@remix-run/node";
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

const ChangeMaster = () => {
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
                    //주인일 시 방소개 변경 노출
                    setAuthority(true)
                }else{
                    //주인 아닐 시 방소개 변경 숨김
                    setAuthority(false)
                }
            }).catch((err)=>{
            //console.log(err)
        })
    }

    useEffect(()=>{
        //권한 체크
        checkAuthority();
        const url = new URL(`${apiUrl}/api/room`);
        url.searchParams.append('roomId', roomId);
        url.searchParams.append('type', 'detail');
        //멤버정보 가져오기 API
        fetch(url,
            {
                method: "GET",
            })
            .then(async (res)=>{
                const data:RoomDetailDto = await res.json();
                //console.log(data);
                setMemberDataExceptMaster(data.members);
            })
            .catch((err)=>{
                //console.log(err)
            })
    },[])

    //후임자 리스트
    const [successorList, setSuccessorList] = useState<RoomDetailMembersDto[] | null>(null);

    const setMemberDataExceptMaster = (memberData:RoomDetailMembersDto[]) => {
        //console.log('memberData', memberData)
        if(memberData !== null){
            const successorMemberData = memberData.filter(member => member.email !== userEmail);
            setSuccessorList(successorMemberData);
        }
    }
    const formRef = useRef(null);

    const changeMaster = (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(formRef.current){
            const formData = new FormData(formRef.current);
            const newManagerEmail = formData.get('master');

            //권한 변경 API
            fetch(`${apiUrl}/api/room`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "changeMaster",
                        originManagerEmail : userEmail,
                        newManagerEmail : newManagerEmail,
                        roomId : roomId
                    }),
                })
                .then(async (res)=>{
                    const data = await res.json()
                    const response = data.state;
                    if (response === 'Success'){
                        //방 목록 페이지로 이동
                        location.reload();
                    }else{
                        //console.log('response :', response)
                    }
                })
                .catch((err)=>{
                    //console.log(err)
                })
        }
    }
    const [checkedInput, setCheckedInput] = useState('');
    const changeInputStyle = (event:React.ChangeEvent<HTMLInputElement>) => {
        setCheckedInput(event.currentTarget.value);
    }
    return (
        <div>
            <SimpleHeader title="주인 변경하기"></SimpleHeader>
            {
                authority ?
                    <div>
                        <div className="wrap member-list-wrap">
                            <Form ref={formRef} onSubmit={changeMaster}>
                                {successorList && successorList.length > 0 ? (
                                    <div>
                                        <p className="authority-changing-guide">주인으로 변경하고 싶은 참여자를 선택해주세요.</p>
                                        <ul className="room-list authority-user-list">
                                            {successorList.map((member, index) => {
                                                return (
                                                    <li className="room-item item-shopping-list" key={index}>
                                                        <div className="box">
                                                            <div className={checkedInput === member.email ? 'icon-selected' : 'icon-unselected'}></div>
                                                            <label htmlFor="master" className="room-title">{member.nickname} ({member.email})</label>
                                                            <input className="authority-input" type="radio" name="master" value={member.email} onChange={changeInputStyle}/>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <div className="wrap buttons-wrap">
                                            <button type="submit">확인</button>
                                        </div>
                                    </div>
                                ): (
                                    <div>
                                        <p>선택할 수 있는 참여자가 없습니다.</p>
                                    </div>
                                )}
                            </Form>
                        </div>
                    </div>:
                    <div>
                        <div className="wrap authority-room-wrap">
                            <p>주인만 장바구니 정보를 변경할 수 있습니다.</p>
                            <div className="buttons-wrap">
                                <Link to="/room">확인</Link>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}
export default ChangeMaster;
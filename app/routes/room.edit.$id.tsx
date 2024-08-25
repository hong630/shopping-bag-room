import SimpleHeader from "~/component/common/SimpleHeader";
import {Form, Link} from "@remix-run/react";
import React, {useEffect, useRef, useState} from "react";
import {LoggedInUserData, RoomDetailDto} from "~/data/dto";
import {useLoaderData, useParams} from "react-router";
import {LoaderFunction, redirect} from "@remix-run/node";
import {getUserSession} from "~/routes/session";
import type { LinksFunction } from "@remix-run/node"
import styles from "~/styles/make-room.css?url"
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

const EditRoom = () => {
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
        const url = new URL(`${apiUrl}/api/room`);
        url.searchParams.append('roomId', roomId);
        url.searchParams.append('type', 'detail');
        //방정보 API
        fetch(url,
            {
                method: "GET",
            })
            .then(async (res)=>{
                const data:RoomDetailDto = await res.json();
                setTitleText(data.title);
                setDetailText(data.description);
                //console.log(data);
            })
            .catch((err)=>{
                //console.log(err)
            })

        checkAuthority();
    },[])
    const submitChangedRoomInfo = async(event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const title = formData.get("title");
        const description = formData.get("description");

        if(title !== null && description!== null){
            const sanitizedTitle = await sanitizeValue(title.toString());
            const sanitizedDescription = await sanitizeValue(description.toString());

            if(sanitizedTitle.trim() === ''){
                alert('제목을 입력해주세요.');
            }else{
                fetch(`${apiUrl}/api/room`,
                    {
                        method : "PUT",
                        headers : {
                            "Content-Type" : "application/json",
                        },
                        body : JSON.stringify({
                            type: "update",
                            email : userEmail,
                            title : sanitizedTitle,
                            description : sanitizedDescription,
                            roomId : roomId
                        }),
                    }).then(async(res)=>{
                    const data = await res.json();
                    const response = data.state;
                    if(response === 'Success'){
                        location.href = `/room/${roomId}`;
                    }else{
                        //console.log('response : ', response)
                    }
                }).catch((err)=>{
                    //console.log(err)
                })
            }
        }
    }

    // 텍스트 카운트
    const [titleText, setTitleText] = useState('');
    const [detailText,setDetailText] = useState('');
    const handleTitleChange = (event:React.ChangeEvent<HTMLTextAreaElement>) => {
        if (event.currentTarget.value.length <= 50) {
            setTitleText(event.currentTarget.value);
        }
    };

    const handleDetailChange = (event:React.ChangeEvent<HTMLTextAreaElement>) => {
        if (event.currentTarget.value.length <= 100) {
            setDetailText(event.currentTarget.value);
        }
    };
    //포커스 시 스타일 변화
    const textareaContainer = useRef<(HTMLDivElement | null)[]>([]);
    const changeTextareaContainerStyle = (index:number) => {
        textareaContainer.current.forEach((container, idx)=>{
            if(container){
                if(idx === index){
                    container.classList.add('active');
                }else{
                    container.classList.remove('active');
                }
            }
        })
    }
    return(
        <div>
            {
                authority ?
                    <div>
                        <SimpleHeader title="장바구니 정보 변경"></SimpleHeader>
                        <div className="wrap content-container">
                            <Form onSubmit={submitChangedRoomInfo} className="form-make-room">
                                <div>
                                    <p>장바구니 제목</p>
                                    <div className="textarea-container short"
                                         ref = {(el:HTMLDivElement) => (textareaContainer.current[0] = el)}>
                                    <textarea name="title" className="textarea-short"
                                      value={titleText} placeholder='장바구니 제목을 적어주세요.'
                                      onChange={handleTitleChange}
                                      onFocus={()=>(changeTextareaContainerStyle(0))}></textarea>
                                        <span className="limited-length">{titleText.length}/50</span>
                                    </div>
                                </div>
                                <div>
                                    <p>장바구니 설명</p>
                                    <div className="textarea-container long"
                                         ref = {(el:HTMLDivElement) => (textareaContainer.current[1] = el)}>
                            <textarea name="description" className="textarea-long"
                                      value={detailText} placeholder='장바구니 설명을 적어주세요.'
                                      onChange={handleDetailChange}
                                      onFocus={()=>(changeTextareaContainerStyle(1))}></textarea>
                                        <span className="limited-length">{detailText.length}/100</span>
                                    </div>
                                </div>
                                <div className="buttons-wrap">
                                    <button type="submit">확인</button>
                                </div>
                            </Form>
                        </div>
                    </div>:
                    <div>
                        <div className="wrap edit-room-wrap">
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

export default EditRoom
import SimpleHeader from "~/component/common/SimpleHeader";
import {LoaderFunction, redirect} from "@remix-run/node";
import {LoggedInUserData} from "~/data/dto";
import {getUserSession} from "~/routes/session";
import {useLoaderData} from "react-router";
import {sanitizeValue} from "~/utils/sanitize";
import React, {useRef, useState} from "react";
import {Form} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node"
import styles from "~/styles/make-room.css?url"
import {getBaseUrl} from "~/utils/getBaseUrl";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

//세션에서 로그인한 사용자 정보 가져오기
export const loader: LoaderFunction = async ({ request }) => {
    const data:LoggedInUserData = await getUserSession(request);
    if (!data.isLoggedIn) {
        // 로그인하지 않았으면 로그인 페이지로 리다이렉트
        return redirect("/login");
    }
    return data;
};

const MakeRoom = () => {
    const data = useLoaderData() as LoggedInUserData;
    const { user, isLoggedIn } = data;
    const email = user?.email || "";
    const userNickname = user?.nickname || "";
    const apiUrl = getBaseUrl();
    const makeRoom = async (event:React.FormEvent<HTMLFormElement>) => {

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title");
    const description = formData.get("description");

    if(title !== null && description!==null){
        const sanitizedTitle = await sanitizeValue(title.toString());
        const sanitizedDescription = await sanitizeValue(description.toString());

        if(sanitizedTitle.trim() === ''){
            alert('제목을 입력해주세요.');
        }else{
            //방만들기 API
            fetch(`${apiUrl}/api/room`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "makeRoom",
                        email: email,
                        title: sanitizedTitle,
                        description: sanitizedDescription
                    }),
                })
                .then(async (res)=>{
                    const data = await res.json()
                    const response = data.state;
                    if (response === 'Success'){
                        //방 목록 페이지로 이동
                        location.href = '/room';
                    }else{
                        //console.log('response :', response)
                    }
                })
                .catch((err)=>{
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

    return (
        <div>
            <SimpleHeader title="새로운 장바구니 만들기"></SimpleHeader>
            <div className="wrap content-container">
                <Form onSubmit={makeRoom} className="form-make-room">
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
        </div>
    )
}
export default MakeRoom;
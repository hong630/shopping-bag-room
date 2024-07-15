import SimpleHeader from "~/component/common/SimpleHeader";
import React, {useRef, useState} from "react";
import {Form} from "@remix-run/react";
import type {LinksFunction, LoaderFunction} from "@remix-run/node"
import styles from "~/styles/mypage.css?url"
import {LoggedInUserData} from "~/data/dto";
import {getUserSession} from "~/routes/session";
import {redirect} from "@remix-run/node";
import {useLoaderData} from "react-router";
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
const ChangeNickname = () => {
    const data = useLoaderData() as LoggedInUserData;
    const { user, isLoggedIn } = data;
    const email = user?.email;
    const apiUrl = getBaseUrl();
    const [detailText,setDetailText] = useState('');
    const handleDetailChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.value.length <= 10) {
            setDetailText(event.currentTarget.value);
        }
    };
    //포커스 시 스타일 변화
    const inputContainer = useRef<HTMLDivElement>(null);
    const focusInput = () => {
        inputContainer.current?.classList.add('active');
        setNicknameError(false);
    }
    const blurInput = () => {
        inputContainer.current?.classList.remove('active');
    }
    //닉네임 변경

    const [nicknameError, setNicknameError] = useState(false);
    const changeNickname = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const nickname = formData.get("nickname");
        console.log(nickname)
        if(nickname !== null){
            const sanitizedNickname = await sanitizeValue(nickname.toString());
            console.log('여기?')
            if(sanitizedNickname.trim() === ''){
                setNicknameError(true);
            }else{
                //닉네임 변경 API
                fetch(`${apiUrl}/api/changeUser`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            type : 'nickname',
                            email: email,
                            nickname: sanitizedNickname
                        }),
                    })
                    .then(async (res)=>{
                        console.log(res)
                        const data = await res.json()
                        const response = data.state;
                        if (response === 'Success'){
                            setNicknameError(false);
                            alert('닉네임 변경을 성공하였습니다.');
                            location.href = '/mypage';
                        }else{
                            console.log('response :', response)
                            setNicknameError(true);
                        }
                    })
                    .catch((err)=>{
                        setNicknameError(true);
                    })
            }
        }

    }
    return (
        <div>
            <SimpleHeader title="닉네임 변경하기"></SimpleHeader>
            <div className="wrap nickname-wrap">
                <p className="nickname-title">변경하실 닉네임을 입력해주세요.</p>
                <Form onSubmit={changeNickname}>
                    <div className="input-container"
                         ref = {inputContainer}>
                        <input name="nickname"
                               value={detailText} placeholder='10자 이하로 입력해주세요.'
                               onChange={handleDetailChange}
                               onFocus={focusInput}
                               onBlur={blurInput}/>
                        <span className="limited-length">{detailText.length}/10</span>
                    </div>
                    {nicknameError ?
                        <p className="warning-message">변경할 닉네임을 입력하지 않았습니다.</p>
                        :
                        <div></div>
                    }
                    <div className="buttons-wrap">
                        <button type="submit">확인</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default ChangeNickname;
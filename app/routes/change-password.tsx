import { Form } from '@remix-run/react';
import React, {useEffect, useState} from "react";
import type {LinksFunction, LoaderFunction} from "@remix-run/node"
import styles from "../styles/signup.css?url"
import {checkOver, sanitizeValue, validateEmail, validatePassword} from "~/utils/sanitize";
import {togglePasswordVisibility} from "~/utils/buttonsFunction";
import VisibilityIcon from "~/component/common/VisibilityIcon";
import AuthHeader from "~/component/common/AuthHeader";
import {LoggedInUserData} from "~/data/dto";
import {getUserSession} from "~/routes/session";
import {redirect} from "@remix-run/node";
import {useLoaderData} from "react-router";
import SimpleHeader from "~/component/common/SimpleHeader";
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
const ChangePassword = () => {

    const data = useLoaderData() as LoggedInUserData;
    const { user, isLoggedIn } = data;
    const email = user?.email;

    //비밀번호 유효성 검사 에러 메시지
    const [incorrectPassword, setIncorrectPassword] = useState(false);
    const [noPassword, setNoPassword] = useState(false);

    let apiUrl = '';
    useEffect(()=>{
        apiUrl = getBaseUrl();
    },[])

    const changingPasswordApi = (password:string) => {
        //비밀번호 변경 API
        fetch(`${apiUrl}/api/changeUser`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type : 'password',
                    email: email,
                    password: password.trim()
                }),
            })
            .then(async (res)=>{
                console.log(res)
                const data = await res.json()
                // console.log(data)
                const response = data.state;
                if (response === 'Success'){
                    alert('비밀번호 변경을 성공하였습니다.');
                    location.href = '/mypage';
                }else{
                    alert('비밀번호 변경을 실패하였습니다.');
                }
            })
            .catch((err)=>{
                alert('비밀번호 변경을 실패하였습니다.');
            })
    }

    //비밀번호 변경
    const changePassword = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const password = formData.get("password");

        //유효성 검사
        if(password !== null){
            const sanitizedPassword = await sanitizeValue(password.toString());
            //비밀번호 유효성 검사
            const checkedPassword = await checkPassword(sanitizedPassword);
            switch (checkedPassword){
                case 'noPassword' :
                    //비밀번호가 없을 때
                    setNoPassword(true);
                    break;
                case 'correctPassword' :
                    //옳은 비밀번호일 때
                    setNoPassword(false);
                    setIncorrectPassword(false);
                    break;
                case 'incorrectPassword' :
                    //옳지 않은 비밀번호일 때
                    setIncorrectPassword(true);
                    break;
                default:
                    alert('에러가 발생했습니다. 다시 시도해주세요.');
                    break;
            }
            //모든 조건을 충족 시 회원가입 API
            if(checkedPassword === 'correctPassword'){
                changingPasswordApi(sanitizedPassword)
            }
        }
    }


    //비밀번호 유효성 검사
    const checkPassword = async (password:string)=>{
        if(password === null){
            return 'noPassword'
        }else{
            const validatedPassword = await validatePassword(password);
            switch (validatedPassword) {
                case true :
                    return 'correctPassword';
                    break;
                case false:
                    return 'incorrectPassword';
                    break;
                default:
                    return validatedPassword;
                    break;
            }
        }
    }


    //비밀번호 노출/비노출 관련 기능
    const [visibility, setVisibility] = useState(true);

    const toggleVisibilityIcon = () => {
        setVisibility(!visibility);
    }

    const handleVisibility = (event: React.MouseEvent<HTMLButtonElement>) => {
        togglePasswordVisibility(event);
        toggleVisibilityIcon();
    }


    const passwordInputStyle = {
        color: (incorrectPassword || noPassword) ? '#d64d46' : 'inherit'
    };

    const passwordErrorHandleFocus = () => {
        setIncorrectPassword(false);
        setNoPassword(false);
    }

    return (
        <div>
            <SimpleHeader title="비밀번호 변경하기"></SimpleHeader>
            <div className="wrap">
                <p className="title">변경하실 비밀번호를 입력해주세요.</p>
                <Form onSubmit={changePassword} className="form-container">
                    <div className="input-container">
                        <label className="visually-hidden" htmlFor="password">비밀번호</label>
                        <div className="password-input-container">
                            <input type="password" name="password" style={passwordInputStyle}
                                   onFocus={passwordErrorHandleFocus} placeholder="특수문자 포함 8자 이상" required/>
                            <button type="button" className="btn-visibility" onClick={handleVisibility}>
                                <VisibilityIcon visibility={visibility}></VisibilityIcon>
                            </button>
                        </div>
                        {incorrectPassword ?
                            <p className="warning-message">올바른 비밀번호 형식이 아닙니다.</p>
                            :
                            <div></div>
                        }
                        {noPassword ?
                            <p className="warning-message">비밀번호를 입력하지 않았습니다.</p>
                            :
                            <div></div>
                        }
                    </div>
                    <div className="buttons-wrap">
                        <button type="submit">확인</button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
export default ChangePassword;

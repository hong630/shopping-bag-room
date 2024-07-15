import React, {useState} from "react";
import type { LinksFunction } from "@remix-run/node"
import styles from "~/styles/find-password.css?url"
import {Form, Link} from "@remix-run/react";
import {sanitizeValue} from "~/utils/sanitize";
import AuthHeader from "~/component/common/AuthHeader";
import {getBaseUrl} from "~/utils/getBaseUrl";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

const FindPassword = () => {
    //비밀번호 찾기 모달 토글
    const [findingPasswordPage, setFindingPasswordPage] = useState<boolean>(true);

    //비밀번호 찾기 결과 메시지
    const [findingPasswordResult, setFindingPasswordResult] = useState<string>('');

    //없는 이메일일 때 다시 입력해달라는 메시지 열기
    const openModalAskingRetry = () => {
        setFindingPasswordResult('none');
    }

    //있는 이메일일 때 리셋 이메일 보냈다는 안내 메시지 열기
    const openModalResetCompleted = () => {
        setFindingPasswordResult('email');
    }
    const apiUrl = getBaseUrl();
    //비밀번호 찾기 결과 보여주기
    const showFindingPasswordResult = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //비밀번호 찾기 모달 닫기
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        console.log(email)
        if(email !== null){
            //스크립트 태그, HTML 태그 제거
            const sanitizedEmail = await sanitizeValue(email.toString());
            console.log(sanitizedEmail)
            fetch(`${apiUrl}/api/changeUser`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type : 'resetPassword',
                        email: sanitizedEmail
                    }),
                })
                .then(async (res)=>{
                    const data = await res.json()
                    const response = data.state;
                    if (response === 'Success'){
                        //있는 이메일일 때 리셋 이메일 보냈다는 안내 메시지 열기
                        setFindingPasswordPage(false);
                        openModalResetCompleted();
                    }else{
                        //없는 이메일일 때 다시 입력해달라는 메시지 열기
                        openModalAskingRetry();
                    }
                })
                .catch((err)=>{
                    //없는 이메일일 때 다시 입력해달라는 메시지 열기
                    openModalAskingRetry();
                })
        }
    }
    //input에 유효성 검사 경고 스타일
    const emailInputStyle = {
        color: (findingPasswordResult === 'none') ? '#d64d46' : 'inherit'
    };

    //input에 포커스 시 스타일 변화 해제
    const errorHandleFocus = () => {
        setFindingPasswordResult('');
    };
    return (
        <div>
            <AuthHeader/>
            <div className="wrap">
                <div className="img-container img-shopping">
                    <img src="/shopping.png" alt="shopping image"/>
                </div>
                <h1>비밀번호 찾기</h1>
                {
                    findingPasswordPage ?
                        <div>
                            <Form onSubmit={showFindingPasswordResult}>
                                <label htmlFor="email" className="visually-hidden">아이디</label>
                                <input type="text" name="email" placeholder="아이디를 입력해주세요."
                                        style={emailInputStyle} onFocus={errorHandleFocus}/>
                                {findingPasswordResult === 'none' ?
                                    <p className="warning-message">존재하지 않는 아이디입니다.</p>
                                    :
                                    <div></div>
                                }
                                <div className="buttons-wrap">
                                    <button type="submit">확인</button>
                                </div>
                            </Form>
                        </div>
                        :
                        <div></div>
                }
                {
                    findingPasswordResult === 'email' ? (
                        <div>
                            <p>임시 비밀번호를 이메일로 전송했습니다. 이메일을 확인해주세요.</p>
                            <div className="buttons-wrap">
                                <Link to="/login">확인</Link>
                            </div>
                        </div>
                    ) : (<div></div>)
                }
            </div>

        </div>
    )
}

export default FindPassword;
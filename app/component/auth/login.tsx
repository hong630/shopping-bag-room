import {Form, Link} from "@remix-run/react";
import React, {useState} from "react";
import AuthHeader from "~/component/common/AuthHeader";
import {getBaseUrl} from "~/utils/getBaseUrl";
import { sanitizeValue } from "~/utils/sanitize";


const LoginComponent = () => {
    //로그인 실패 메시지
    const [failedLogin, setFailedLogin] = useState<string>('');

    //로그인 성공 체크
    const apiUrl = getBaseUrl();
    const tryLogin = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        if(email!==null && password!==null){
            //스크립트 태그, HTML 태그 제거
            const sanitizedEmail = await sanitizeValue(email.toString());
            const sanitizedPassword = await sanitizeValue(password.toString());

            //로그인 API
            fetch(`${apiUrl}/api/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: sanitizedEmail.trim(),
                        password: sanitizedPassword.trim()
                    }),
                })
                .then(async (res)=>{
                    const data = await res.json()
                    const response = data.state;
                    if (response === 'Success'){
                        //방 목록 페이지로 이동
                        location.href = '/room';
                    }else if(response === 'Invalid Email'){
                        //로그인 실패 모달 열기
                        setFailedLogin('Invalid Email');
                    }else if(response === 'Invalid Password'){
                        //로그인 실패 모달 열기
                        setFailedLogin('Invalid Password');
                    }else{
                        console.log('response :', response)
                    }
                })
                .catch((err)=>{
                    console.log(err)
                })
        }
    }

    //유효성 검사 경고 시 스타일 변화
    const emailInputStyle = {
        color: (failedLogin === 'Invalid Email') ? '#d64d46' : 'inherit'
    };

    const passwordInputStyle = {
        color: (failedLogin === 'Invalid Password') ? '#d64d46' : 'inherit'
    };

    //input에 포커스 시 스타일 변화 해제
    const errorHandleFocus = () => {
        setFailedLogin('');
    };

    return (
        <div>
            <div>
                <AuthHeader/>
                <div className="wrap">
                    <div className="img-container img-shopping">
                        <img src="/shopping.png" alt="shopping image"/>
                    </div>
                    <h1>로그인하기</h1>
                    <Form onSubmit={tryLogin} className="login-form">
                        <div className="input-container">
                            <label className="visually-hidden" htmlFor="email">아이디</label>
                            <input type="text" name="email"
                                   style={emailInputStyle} onFocus={errorHandleFocus}
                                   placeholder="이메일을 입력하세요." required/>
                            {failedLogin === 'Invalid Email' ?
                                <p className="warning-message">존재하지 않는 아이디입니다.</p>
                                :
                                <div></div>
                            }
                        </div>
                        <div className="input-container">
                            <label className="visually-hidden" htmlFor="password">비밀번호</label>
                            <input type="password" name="password"
                                   style={passwordInputStyle} onFocus={errorHandleFocus}
                                   placeholder="비밀번호를 입력하세요." required/>
                            {failedLogin === 'Invalid Password' ?
                                <p className="warning-message">비밀번호를 다시 확인해주세요.</p>
                                :
                                <div></div>
                            }
                        </div>
                        <Link to="/find-password">비밀번호가 기억이 안나세요?</Link>
                        <div className="buttons-wrap">
                            <button type="submit">로그인</button>
                            <Link to="/signup">계정이 없으세요? 여기서 가입하세요!</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default LoginComponent;
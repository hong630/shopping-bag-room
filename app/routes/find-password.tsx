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

    //비밀번호 찾기 질문 표
    const [passwordQuestion, setPasswordQuestion] = useState(null);

    //비밀번호 찾기 결과 메시지
    const [findingPasswordResult, setFindingPasswordResult] = useState<string>('');

    //비밀번호 찾기 완료
    const [resetSuccess, setResetSuccess] = useState(null);

    //사용자 이메일
    const [userEmail, setUserEmail] = useState('');


    //없는 이메일일 때 다시 입력해달라는 메시지 열기
    const openModalAskingRetry = () => {
        setFindingPasswordResult('none');
    }

    //있는 이메일일 때
    //TODO 이메일과 대답 맞는 지 확인하기
    //TODO 맞는 경우 랜덤 비밀번호로 바꾸고 보여주기


    const apiUrl = getBaseUrl();

    //TODO 이메일가지고 질문 가져오기
    const getUserPasswordQuestion = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //비밀번호 찾기 모달 닫기
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const url = new URL(`${apiUrl}/api/changeUser`);
        if(email !== null){
            //스크립트 태그, HTML 태그 제거
            const sanitizedEmail = await sanitizeValue(email.toString());
            url.searchParams.append('email', sanitizedEmail);
            url.searchParams.append('type', 'getQuestion');
            fetch(url,
              {
                  method: "GET",
              })
              .then(async (res)=>{
                  const data = await res.json()
                  const response = data.state;
                  //이메일 저장
                  setUserEmail(sanitizedEmail);
                  //질문 UI 보여주기
                  setFindingPasswordPage(false);
                  setPasswordQuestion(response);
              })
              .catch(()=>{
                  //없는 이메일일 때 다시 입력해달라는 메시지 열기
                  openModalAskingRetry();
              })
        }
    }

    //비밀번호 찾기 결과 보여주기
    const showFindingPasswordResult = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //비밀번호 찾기 모달 닫기
        const formData = new FormData(event.currentTarget);
        const answer = formData.get("passwordAnswer");
        if(answer!==null){
            //스크립트 태그, HTML 태그 제거
            const sanitizedAnswer = await sanitizeValue(answer.toString());
            fetch(`${apiUrl}/api/changeUser`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type : 'resetPassword',
                        email: userEmail,
                        answer: sanitizedAnswer
                    }),
                })
                .then(async (res)=>{
                    const data = await res.json()
                    const response = data.state;
                    if (response === 'Success'){
                        //있는 이메일일 때 리셋 이메일 보냈다는 안내 메시지 열기
                        setFindingPasswordPage(false);
                        setPasswordQuestion(null);
                        setResetSuccess(data.password);
                    }else{
                        //틀린 답이라는 메시지
                        setFindingPasswordResult("wrongAnswer");
                    }
                })
                .catch(()=>{
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
                    <img src="/shopping.png" alt="shopping"/>
                </div>
                <h1>비밀번호 찾기</h1>
                {
                    findingPasswordPage ?
                        <div>
                            <Form onSubmit={getUserPasswordQuestion}>
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
                    passwordQuestion ? (
                      <div>
                          <p className="subtitle">다음의 질문에 대답해주세요.</p>
                          <Form onSubmit={showFindingPasswordResult}>
                              <label htmlFor="passwordAnswer" className="title">{passwordQuestion}</label>
                              <input type="text" name="passwordAnswer" placeholder="10자 이내로 입력해주세요."/>
                              {findingPasswordResult === 'wrongAnswer' ?
                                <p className="warning-message">틀린 답변입니다. 다시 입력해주세요.</p>
                                :
                                <div></div>
                              }
                              <div className="buttons-wrap">
                                  <button type="submit">확인</button>
                              </div>
                          </Form>
                      </div>
                    ):(
                      <div></div>
                    )
                }
                {
                    resetSuccess ? (
                        <div>
                            <p>임시 비밀번호는 <span>{resetSuccess}</span> 입니다.
                            임시 비밀번호로 로그인하신 후엔 비밀번호를 변경해주세요.</p>
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
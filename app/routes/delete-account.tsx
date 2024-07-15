import React, {useEffect, useState} from "react";
import SimpleHeader from "~/component/common/SimpleHeader";
import {useLoaderData} from "react-router";
import {LoggedInUserData} from "~/data/dto";
import {LoaderFunction, redirect} from "@remix-run/node";
import {getUserSession} from "~/routes/session";
import {Link} from "@remix-run/react";
import {getBaseUrl} from "~/utils/getBaseUrl";
//세션에서 로그인한 사용자 정보 가져오기
export const loader: LoaderFunction = async ({ request }) => {
    const data:LoggedInUserData = await getUserSession(request);
    if (!data.isLoggedIn) {
        // 로그인하지 않았으면 로그인 페이지로 리다이렉트
        return redirect("/room");
    }
    return data;
};

const DeleteAccount = () => {
    const data = useLoaderData() as LoggedInUserData;
    const { user, isLoggedIn } = data;
    const userEmail = user?.email || "";
    //탈퇴하기
    const [withdrawModal, setWithdrawModal] = useState(false);

    const widthdrawService = () => {
        const apiUrl = getBaseUrl();
        fetch(`${apiUrl}/api/register`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userEmail,
                }),
            })
            .then(async (res)=>{
                const data = await res.json()
                // console.log(data)
                const response = data.state;
                if (response === 'Success'){
                    setWithdrawModal(true);
                }else{
                    console.log('response :', response)
                    alert('탈퇴를 실패하였습니다. 다시 시도해주세요.')
                    location.reload();
                }
            })
            .catch((err)=>{
                alert('탈퇴를 실패하였습니다. 다시 시도해주세요.')
                location.reload();
            })
    }

  return (
      <div>
          <SimpleHeader title="탈퇴하기"></SimpleHeader>
          {
              !withdrawModal ?
              <div>
                  <div className="wrap alert-wrap">
                      <svg className="icon-modal"  viewBox="0 0 24 24">
                          <path d="M0 0h24v24H0z" fill="none">
                          </path>
                          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z">
                          </path>
                      </svg>
                      <p className="alert-title-message">정말로 탈퇴하시겠습니까?</p>
                      <div className="buttons-wrap">
                          <button onClick={widthdrawService}>예</button>
                      </div>
                  </div>
              </div> :
              <div>
                  <div className="wrap alert-wrap">
                      <svg className="icon-modal"  viewBox="0 0 24 24">
                          <path d="M0 0h24v24H0z" fill="none">
                          </path>
                          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z">
                          </path>
                      </svg>
                      <p className="alert-title-message">탈퇴가 완료되었습니다. <br/> 서비스를 이용해주셔서 감사했습니다!</p>
                      <div className="buttons-wrap">
                          <Link to="/">메인 화면으로 가기</Link>
                      </div>
                  </div>
              </div>
          }

      </div>
  )
}
export default DeleteAccount;
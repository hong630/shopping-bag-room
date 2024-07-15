import React, {useState} from "react";
import {Form, Link} from "@remix-run/react";
import {LoaderFunction, redirect} from "@remix-run/node";
import {LoggedInUserData} from "~/data/dto";
import {getUserSession} from "~/routes/session";
import {useLoaderData} from "react-router";
import HeaderLayout from "~/component/common/header";
import type {LinksFunction} from "@remix-run/node"
import styles from "~/styles/mypage.css?url"

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

const Mypage = () => {
    const data = useLoaderData() as LoggedInUserData;
    const { user, isLoggedIn } = data;
    const userNickname = user?.nickname || "";

    return (
        <div>
            {
                isLoggedIn && user!== null?
                    <div>
                        <HeaderLayout userName={userNickname} title="Mypage"></HeaderLayout>
                        <div className="wrap mypage-wrap">
                            <Link to={`/mypage/nickname`}>
                                <div className="mypage-container">
                                    <svg className="icon-mypage"  viewBox="0 0 640 512">
                                        <path d="M192 160C192 177.7 177.7 192 160 192C142.3 192 128 177.7 128 160V128C128 74.98 170.1 32 224 32C277 32 320 74.98 320 128V135.8C320 156.6 318.8 177.4 316.4 198.1L438.8 161.3C450.2 157.9 462.6 161.1 470.1 169.7C479.3 178.3 482.1 190.8 478.4 202.1L460.4 255.1H544C561.7 255.1 576 270.3 576 287.1C576 305.7 561.7 319.1 544 319.1H416C405.7 319.1 396.1 315.1 390 306.7C384 298.4 382.4 287.6 385.6 277.9L398.1 240.4L303.7 268.7C291.9 321.5 272.2 372.2 245.3 419.2L231.4 443.5C218.5 466.1 194.5 480 168.5 480C128.5 480 95.1 447.5 95.1 407.5V335.6C95.1 293.2 123.8 255.8 164.4 243.7L248.8 218.3C253.6 191.1 255.1 163.5 255.1 135.8V128C255.1 110.3 241.7 96 223.1 96C206.3 96 191.1 110.3 191.1 128L192 160zM160 335.6V407.5C160 412.2 163.8 416 168.5 416C171.5 416 174.4 414.4 175.9 411.7L189.8 387.4C207.3 356.6 221.4 324.1 231.8 290.3L182.8 304.1C169.3 309 160 321.5 160 335.6V335.6zM24 368H64V407.5C64 410.4 64.11 413.2 64.34 416H24C10.75 416 0 405.3 0 392C0 378.7 10.75 368 24 368zM616 416H283.5C291.7 400.3 299.2 384.3 305.9 368H616C629.3 368 640 378.7 640 392C640 405.3 629.3 416 616 416z">
                                        </path>
                                    </svg>
                                    <span>닉네임 변경하기</span>
                                </div>
                                <svg className="icon-mypage"   viewBox="0 0 24 24">
                                    <path d="M0 0h24v24H0z" fill="none">
                                    </path>
                                    <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z">
                                    </path>
                                </svg>
                            </Link>
                            <Link to={`/change-password`}>
                                <div className="mypage-container">
                                    <svg className="icon-mypage"  viewBox="0 0 512 512">
                                        <path d="M282.3 343.7L248.1 376.1C244.5 381.5 238.4 384 232 384H192V424C192 437.3 181.3 448 168 448H128V488C128 501.3 117.3 512 104 512H24C10.75 512 0 501.3 0 488V408C0 401.6 2.529 395.5 7.029 391L168.3 229.7C162.9 212.8 160 194.7 160 176C160 78.8 238.8 0 336 0C433.2 0 512 78.8 512 176C512 273.2 433.2 352 336 352C317.3 352 299.2 349.1 282.3 343.7zM376 176C398.1 176 416 158.1 416 136C416 113.9 398.1 96 376 96C353.9 96 336 113.9 336 136C336 158.1 353.9 176 376 176z">
                                        </path>
                                    </svg>
                                    <span>비밀번호 변경하기</span>
                                </div>
                                <svg className="icon-mypage"   viewBox="0 0 24 24">
                                    <path d="M0 0h24v24H0z" fill="none">
                                    </path>
                                    <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z">
                                    </path>
                                </svg>
                            </Link>
                            <Link to={`/help`}>
                                <div className="mypage-container">
                                    <svg className="icon-mypage"  viewBox="0 0 512 512">
                                        <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 400c-18 0-32-14-32-32s13.1-32 32-32c17.1 0 32 14 32 32S273.1 400 256 400zM325.1 258L280 286V288c0 13-11 24-24 24S232 301 232 288V272c0-8 4-16 12-21l57-34C308 213 312 206 312 198C312 186 301.1 176 289.1 176h-51.1C225.1 176 216 186 216 198c0 13-11 24-24 24s-24-11-24-24C168 159 199 128 237.1 128h51.1C329 128 360 159 360 198C360 222 347 245 325.1 258z">
                                        </path>
                                    </svg>
                                    <span>Help & support</span>
                                </div>
                                <svg className="icon-mypage"   viewBox="0 0 24 24">
                                    <path d="M0 0h24v24H0z" fill="none">
                                    </path>
                                    <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z">
                                    </path>
                                </svg>
                            </Link>
                            <Link to={`/delete-account`}>
                                <div className="mypage-container">
                                    <svg className="icon-mypage"  viewBox="0 0 512 512">
                                        <path d="M160 416H96c-17.67 0-32-14.33-32-32V128c0-17.67 14.33-32 32-32h64c17.67 0 32-14.33 32-32S177.7 32 160 32H96C42.98 32 0 74.98 0 128v256c0 53.02 42.98 96 96 96h64c17.67 0 32-14.33 32-32S177.7 416 160 416zM502.6 233.4l-128-128c-12.51-12.51-32.76-12.49-45.25 0c-12.5 12.5-12.5 32.75 0 45.25L402.8 224H192C174.3 224 160 238.3 160 256s14.31 32 32 32h210.8l-73.38 73.38c-12.5 12.5-12.5 32.75 0 45.25s32.75 12.5 45.25 0l128-128C515.1 266.1 515.1 245.9 502.6 233.4z">
                                        </path>
                                    </svg>
                                    <span>탈퇴하기</span>
                                </div>
                                <svg className="icon-mypage"   viewBox="0 0 24 24">
                                    <path d="M0 0h24v24H0z" fill="none">
                                    </path>
                                    <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z">
                                    </path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                    : <div></div>

            }
        </div>
    );

}

export default Mypage;
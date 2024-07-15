import React from "react";
import {Link} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node"
import styles from "../styles/main.css?url"

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

export default function Index() {
  return (
    <div>
      <div className="wrap main-wrap">
        <div className="img-container img-main">
          <img src="/cart.png" alt="cart image"/>
        </div>
      </div>
      <div className="wrap text-wrap">
        <p>우리 장바구니</p>
        <p>너도 샀는데 나도 사서 곤란했던 경험, 아니면 아무도 사지 않아서 곤란했던 경험 없나요? 이제 우리 장바구니에서 리스트를 공유해서 필요한 것들이 떨어지지않도록 해봐요.</p>
      </div>
      <div className="wrap buttons-wrap">
        <Link to="/signup">가입하기</Link>
        <Link to="/login">로그인하기</Link>
      </div>
    </div>
  );
}

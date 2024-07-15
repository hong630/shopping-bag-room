import {LinksFunction} from "@remix-run/node";
import styles from "../styles/help.css?url"
import SimpleHeader from "~/component/common/SimpleHeader";
import React from "react";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];
const HelpAndSupport = () => {
    return (
        <div>
            <SimpleHeader title="Help&Support"></SimpleHeader>
            <div className="wrap">
                <p>서비스를 이용할 때 어려움이 있거나 문의사항이 있으실 경우, </p>
                <p><span className="highlight">hongihongi60@gmail.com</span></p>
                <p>으로 이메일 부탁드립니다.</p>
                <p>좋은 하루 보내세요! 감사합니다.</p>
            </div>
        </div>
    )
}
export default HelpAndSupport
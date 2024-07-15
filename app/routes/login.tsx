import LoginComponent from '../component/auth/login';
import type {LinksFunction, LoaderFunction} from "@remix-run/node"
import styles from "~/styles/login.css?url"
import {LoggedInUserData} from "~/data/dto";
import {getUserSession} from "~/routes/session";
import {redirect} from "@remix-run/node";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];
//세션에서 로그인한 사용자 정보 가져오기
export const loader: LoaderFunction = async ({ request }) => {
    const data:LoggedInUserData = await getUserSession(request);
    if (data.isLoggedIn) {
        // 로그인했으면 메인 페이지로 리다이렉트
        return redirect("/room");
    }
    return data;
};
const Login = () => {
    return (
        <div>
            <LoginComponent/>
        </div>
    )
}

export default Login;
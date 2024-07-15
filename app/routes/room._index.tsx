import RoomLayout from "~/component/roomLayout/RoomLayout";
import {LoaderFunction, redirect} from "@remix-run/node";
import {getUserSession} from "~/routes/session";
import {useLoaderData} from "react-router";
import {LoggedInUserData} from "~/data/dto";
import type { LinksFunction } from "@remix-run/node"
import styles from "~/styles/room.css?url"

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

//세션에서 로그인한 사용자 정보 가져오기
export const loader: LoaderFunction = async ({ request }) => {
    const data:LoggedInUserData = await getUserSession(request);
    if (!data.isLoggedIn) {
        // 로그인하지 않았으면 로그인 페이지로 리다이렉트
        return redirect("/login");
    }
    return data;
};

const RoomIndex = () => {
    const data = useLoaderData() as LoggedInUserData;
    const { user, isLoggedIn } = data;
    const email = user?.email || "";
    const userNickname = user?.nickname || "";
    return (
        <div>
            <RoomLayout email={email} userName={userNickname}/>
        </div>
    )
}

export default RoomIndex;

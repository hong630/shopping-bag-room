import {useRef} from "react";
import ShoppingRoomListComponent from "~/component/shoppingRoom/shoppingRoomList";
import HeaderLayout from "~/component/common/header";
import {Link} from "@remix-run/react";

const RoomLayout = (props:{email:string, userName:string}) => {

    //방으로 가기
    const searchInput = useRef<HTMLInputElement>(null);
    const goRoomWithRoomId = () => {
        location.href="/room/" + searchInput.current?.value;
    }
    return (
        <div>
            <div>
                <HeaderLayout userName={props.userName} title="Main"></HeaderLayout>
                <div className="wrap">
                    <div className="content-wrap">
                        <div className="content">
                            <svg className="icon-room"  viewBox="0 0 24 24">
                                <path fill="none" d="M0 0h24v24H0z">
                                </path>
                                <path opacity=".3" d="M7 7h14v9H7z">
                                </path>
                                <path d="M3 9H1v11c0 1.11.89 2 2 2h17v-2H3V9z">
                                </path>
                                <path d="M18 5V3c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H5v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5h-5zm-6-2h4v2h-4V3zm9 13H7V7h14v9z">
                                </path>
                            </svg>
                            <span className="title">장바구니 번호로 들어가기</span>
                        </div>
                        <div className="content input-content">
                            <label htmlFor="roomId" className="visually-hidden">장바구니 번호</label>
                            <input type="text" ref={searchInput} name="roomId" placeholder="장바구니 번호를 입력하세요"/>
                            <svg className="icon-room"  viewBox="0 0 512 512">
                                <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z">
                                </path>
                            </svg>
                            <button className="btn-search" onClick={goRoomWithRoomId}>찾기</button>
                        </div>
                    </div>
                </div>
                <ShoppingRoomListComponent email={props.email} nickname={props.userName}/>
                <Link to="/make-room" className="anchor-make-room wrap">
                    <svg className="icon-plus" viewBox="0 0 448 512">
                        <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z">
                        </path>
                    </svg>
                    <span>새로운 장바구니 만들기</span>
                </Link>
            </div>
        </div>
    )
}

export default RoomLayout
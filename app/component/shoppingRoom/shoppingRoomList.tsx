import {useEffect, useState} from "react";
import {Link} from "@remix-run/react";
import {RoomDto} from "~/data/dto";
import {getBaseUrl} from "~/utils/getBaseUrl";

const ShoppingRoomListComponent = (props:{email:string, nickname:string}) => {
    const [shoppingRoomList, setShoppingRoomList] = useState<RoomDto[] | null>(null);

    const apiUrl = getBaseUrl();

    useEffect(()=>{
        const url = new URL(`${apiUrl}/api/room`);
        url.searchParams.append('email', props.email);
        url.searchParams.append('type', 'all');
        //로그인 API
        fetch(url,
            {
                method: "GET",
            })
            .then(async (res)=>{
                const data:RoomDto[] = await res.json();
                setShoppingRoomList(data);
            })
            .catch((err)=>{
                console.log(err)
            })
    },[])

    return (
        <div>
            <div className="wrap content-wrap shopping-list-wrap">
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
                    <span className="title">{props.nickname}의 장바구니들</span>
                </div>
                <ul className="room-list">
                    {
                        shoppingRoomList?.map((room)=> (
                            <li key={room.roomId} className="room-item">
                                <Link to={`/room/${room.roomId}`}>
                                    <svg className="icon-room-list"  viewBox="0 0 24 24">
                                        <path fill="none" d="M0 0h24v24H0z">
                                        </path>
                                        <path d="M12 3 1 11.4l1.21 1.59L4 11.62V21h16v-9.38l1.79 1.36L23 11.4 12 3zM8 15c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z">
                                        </path>
                                    </svg>
                                    <span className="room-title">{room.title}</span>
                                    <span className="room-detail">{room.description}</span>
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default ShoppingRoomListComponent
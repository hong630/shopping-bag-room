import {useState} from "react";
import {getBaseUrl} from "~/utils/getBaseUrl";

const DeleteRoom = (props : {email : string, roomId : number, authority : boolean}) => {
    const apiUrl = getBaseUrl();
    //방정보삭제 모달 노출
    const [openingDeleteModal, setOpeningDeleteModal] = useState(false);

    const openDeleteModal = () => {
        setOpeningDeleteModal(true);
    }
    const closeDeleteModal = () => {
        setOpeningDeleteModal(false);
    }

    const submitToDeleteRoom = () => {
        const roomId = Number(props.roomId);
        fetch(`${apiUrl}/api/room`,
            {
                method : "DELETE",
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify({
                    type: "deleteRoom",
                    email : props.email,
                    roomId : roomId
                }),
            }).then(async(res)=>{
            const data = await res.json();
            const response = data.state;
            if(response === 'Success'){
                location.href = '/room'
            }else{
                //console.log('response : ', response)
            }
        }).catch((err)=>{
            //console.log(err)
        })
    }
    return (
        <div>
            {
                props.authority ?
                    <div><button onClick={openDeleteModal}>방 삭제하기</button></div>
                    :
                    <div></div>
            }
            {
                openingDeleteModal && props.authority ?
                    <div>
                        <h1>정말로 방을 삭제하시겠습니까?</h1>
                        <button onClick={submitToDeleteRoom}>방을 삭제할게요</button>
                        <button onClick={closeDeleteModal}>변경을 취소할래요</button>
                    </div>
                    : <div></div>
            }
        </div>
    )
}

export default DeleteRoom;

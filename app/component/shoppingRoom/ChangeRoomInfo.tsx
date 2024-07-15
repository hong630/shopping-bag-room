import {Form} from "@remix-run/react";
import React, {useState} from "react";
import {getBaseUrl} from "~/utils/getBaseUrl";

const ChangeRoomInfo = (props : {email : string, roomId : number, authority : boolean}) => {
    const apiUrl = getBaseUrl();

    //방정보변경 모달 노출
    const [openingChangeModal, setOpeningChangeModal] = useState(false);

    const openChangeModal = () => {
        setOpeningChangeModal(true);
    }
    const closeChangeModal = () => {
        setOpeningChangeModal(false);
    }

    const submitChangedRoomInfo = (event:React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const title = formData.get("title");
      const description = formData.get("description");

      fetch(`${apiUrl}/api/room`,
          {
              method : "PUT",
              headers : {
                  "Content-Type" : "application/json",
              },
              body : JSON.stringify({
                  type: "update",
                  email : props.email,
                  title : title,
                  description : description,
                  roomId : props.roomId
              }),
      }).then(async(res)=>{
        const data = await res.json();
        const response = data.state;
        if(response === 'Success'){
            location.reload();
        }else{
            console.log('response : ', response)
        }
      }).catch((err)=>{
          console.log(err)
      })
    }
    return (
        <div>
            {
                props.authority ?
                    <div><button onClick={openChangeModal}>방 정보를 변경하시겠습니까?</button></div>
                    :
                    <div></div>
            }
            {
                openingChangeModal && props.authority ?
                    <div>
                        <Form onSubmit={submitChangedRoomInfo}>
                            <label htmlFor="">
                                방 이름 : <input type="text" name="title"/>
                            </label>
                            <label htmlFor="">
                                방 설명 : <input type="text" name="description"/>
                            </label>
                            <button type="submit">제출</button>
                        </Form>
                        <button onClick={closeChangeModal}>변경을 취소할래요</button>
                    </div>
                    : <div></div>
            }
        </div>
    )
}

export default ChangeRoomInfo;

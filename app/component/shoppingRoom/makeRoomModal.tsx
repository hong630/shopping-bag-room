import { Form } from '@remix-run/react';
import React from "react";
import {getBaseUrl} from "~/utils/getBaseUrl";
const MakeRoomModal = (props:{email:string}) => {
    const apiUrl = getBaseUrl();
    const makeRoom = (event:React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(event.currentTarget);
        const title = formData.get("title");
        const description = formData.get("description");
        //방만들기 API
        fetch(`${apiUrl}/api/room`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "makeRoom",
                    email: props.email,
                    title: title,
                    description: description
                }),
            })
            .then(async (res)=>{
                const data = await res.json()
                const response = data.state;
                if (response === 'Success'){
                    //방 목록 페이지로 이동
                    location.reload();
                }else{
                    //console.log('response :', response)
                }
            })
            .catch((err)=>{
                //console.log(err)
            })
    }

    return (
        <div style={{
            backgroundColor: 'pink',
            position : 'fixed',
            top : '50%',
            left : '50%',
            transform : 'translate(-50%,-50%)'
        }}>
            <Form onSubmit={makeRoom}>
                <label htmlFor="">
                     이름 : <input type="text" name='title' placeholder='장바구니공유방 이름을 적어주세요.'/>
                </label>
                <label htmlFor="">
                    설명 : <input type="text" name='description' placeholder='장바구니공유방 설명을 적어주세요.'/>
                </label>
                <button type="submit">제출</button>
            </Form>
        </div>
    )
}

export default MakeRoomModal;
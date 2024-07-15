import {MemberListProps, RoomDetailMembersDto} from "~/data/dto";
import React, {useEffect, useRef, useState} from "react";
import {Form} from "@remix-run/react";
import {getBaseUrl} from "~/utils/getBaseUrl";


const ChangeAuthority:React.FC<MemberListProps> = ({memberData, authority, email, roomId}) => {

    const apiUrl = getBaseUrl();

    //authority변경 모달 열기
    const [openingAuthorityModal, setOpeningAuthorityModal] = useState(false)
    //후임자 리스트
    const [successorList, setSuccessorList] = useState<RoomDetailMembersDto[] | null>(null);
    const setMemberDataExceptMaster = () => {
        const successorMemberData = memberData.filter(member => member.email !== email);
        setSuccessorList(successorMemberData);
    }

    //authority변경 모달 열기
    const openAuthorityModal = () => {
        setOpeningAuthorityModal(true);
    }
    //authority변경 모달 닫기
    const closeAuthorityModal = () => {
        setOpeningAuthorityModal(false);
    }

    const formRef = useRef(null);

    const changeMaster = (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(formRef.current){
            const formData = new FormData(formRef.current);
            const newManagerEmail = formData.get('master');

            //권한 변경 API
            fetch(`${apiUrl}/api/room`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: "changeMaster",
                        originManagerEmail : email,
                        newManagerEmail : newManagerEmail,
                        roomId : roomId
                    }),
                })
                .then(async (res)=>{
                    const data = await res.json()
                    const response = data.state;
                    if (response === 'Success'){
                        //방 목록 페이지로 이동
                        location.reload();
                    }else{
                        console.log('response :', response)
                    }
                })
                .catch((err)=>{
                    console.log(err)
                })
        }
    }

    useEffect(()=>{
        setMemberDataExceptMaster();
        console.log(successorList)
    },[])

    return (
        <div>
            {
                authority ?
                    <div>
                        <button onClick={openAuthorityModal}>주인 변경</button>
                    </div>:
                    <div></div>
            }
            {authority && openingAuthorityModal && successorList && successorList.length > 0 ? (
                <div>
                    <Form ref={formRef} onSubmit={changeMaster}>
                        <ul>
                            <h1>변경 후보 목록</h1>
                            {successorList?.map((member, index) => (
                                <li key={index}>
                                    <label htmlFor="">
                                        {member.nickname} : <input type="radio" name="master" value={member.email}/>
                                    </label>
                                </li>
                            ))}
                        </ul>
                        <button type="submit">제출</button>
                    </Form>
                    <button onClick={closeAuthorityModal}>취소</button>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )
}

export default ChangeAuthority;
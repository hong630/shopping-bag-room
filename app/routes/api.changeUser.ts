import {ActionFunction, json} from "@remix-run/node";
import {ErrorResponse, UserDao} from "~/data/dao";
import {Prisma, PrismaClient} from "@prisma/client";
import dotenv from "dotenv";
import {commitSession, getSession} from "~/routes/session";
import {catchErrCode} from "~/utils/prismaErr";
import {hashPassword} from "~/routes/api.register";

dotenv.config();

const prisma = new PrismaClient();

//비밀번호 변경 (prisma)
async function updatePassword(email:string, newPassword:string): Promise<UserDao | ErrorResponse> {
    const hashedNewPassword = await hashPassword(newPassword);
    try {
        const updatedUser = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                password: hashedNewPassword,
            },
        });
        return updatedUser;
    } catch (err) {
        console.error('Error updating password:', err);
        if(err instanceof Prisma.PrismaClientKnownRequestError){
            return catchErrCode(err.code)
        }
        return  {state:'An error occurred while resetting password.'}
    }
}

//비밀번호 변경
async function changePassword(body:UserDao){
    try {
        await updatePassword(body.email,body.password)
        return  {state:"Success"}
    } catch (err){
        return  {state:err}
    }
}


//INFO 닉네임 변경

//닉네임 변경 (prisma)
async function updateNickname(email:string, nickname:string) {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                nickname: nickname,
            },
        });
    } catch (error) {
        console.error('Error updating nickname:', error);
    }
}
//닉네임 변경
async function changeNickname(body:UserDao, cookie:string | null){
    try {
        await updateNickname(body.email,body.nickname);
        //세션 갱신
        const userData = await prisma.user.findUnique({where:{email:body.email}})
        if(userData !== null){
            const session = await getSession(cookie);
            session.set('user', {
                id: userData.id,
                email: userData.email,
                nickname: body.nickname,
            });
            return json(
                { state: 'Success' },
                {
                    headers: {
                        "Set-Cookie": await commitSession(session),
                    },
                });
        }
    } catch (err){
        return  {state:err}
    }
}

//INFO 비밀번호 초기화

// 랜덤 비밀번호 생성 함수
function generateRandomPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let password = '';
    for (let i = 0; i < 5; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// TODO 이메일 전송 설정
// const transporter = nodemailer.createTransport({
//     service: 'Gmail', // 원하는 이메일 서비스 사용
//     auth: {
//         user: 'hongihongi60@gmail.com',
//         pass: process.env.EMAIL_PASSWORD,
//     },
// });

async function resetPassword(body:UserDao){
    try{
    // 무작위 비밀번호 생성
    const newPassword = generateRandomPassword();

    //데이터베이스 비밀번호 업데이트
    const updatedPassword = await updatePassword(body.email, newPassword);
    //없는 이메일인 경우
    if ('state' in updatedPassword) {
        return  {state: 'invalid email'}
    }

    // TODO 이메일 전송
    // const mailOptions = {
    //     from: 'hongihongi60@gmail.com',
    //     to: body.email,
    //     subject: '비밀번호를 변경하였습니다.',
    //     text: `새로운 비밀번호는 ${newPassword} 입니다. 로그인 후 비밀번호를 변경해주세요.`,
    // };
    //
    // await transporter.sendMail(mailOptions);

    return { state : 'Success' };
    } catch (err) {
        if(err instanceof Prisma.PrismaClientKnownRequestError){
            return catchErrCode(err.code)
        }
        return  {state:'An error occurred while resetting password.'}
    }

}



export const action:ActionFunction = async ({ request }) => {
    const body = await request.json();
    const cookie = request.headers.get("Cookie");
    switch (body.type) {
        case "password":
            return await changePassword(body);
        case "nickname":
            return await changeNickname(body, cookie);
        case "resetPassword":
            return await resetPassword(body);
        default :
            return {state: "Err"}
    }
}
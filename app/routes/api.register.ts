import {Prisma, PrismaClient} from '@prisma/client';
import {ActionFunction, json} from "@remix-run/node";
import {catchErrCode} from "~/utils/prismaErr";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {UserDao} from "~/data/dao";
import {commitSession, destroySession, getSession} from "~/routes/session";

dotenv.config();

const prisma = new PrismaClient();

// 회원가입
// 비밀번호 암호화
const saltRoundsEnv = process.env.SALT_ROUNDS;
if (!saltRoundsEnv) {
        throw new Error("SALT_ROUNDS 환경 변수가 정의되지 않았습니다.");
}
const saltRounds = parseInt(saltRoundsEnv, 10);

//INFO 회원가입

// 비밀번호 해싱 함수
export async function hashPassword(password:string) {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
}
// 회원 정보 DB 입력
export async function createUser(email: string, nickname:string, password: string) {
        const hashedPassword = await hashPassword(password);
        return prisma.user.create({
                data: { email, nickname, password: hashedPassword },
        });
}
// 회원 가입
async function signUp(body:UserDao){
        try {
                await createUser(body.email,body.nickname, body.password)
                return  {state:true}
        } catch (err){
                if(err instanceof Prisma.PrismaClientKnownRequestError){
                        return catchErrCode(err.code)
                }
                return  {state:'An error occurred while creating the user.'}
        }
}

//INFO LOGIN

// 로그인
export async function login(body: UserDao, cookie:string|null){
        const loginEmail = body.email as string
        const loginPassword = body.password as string

        // 확인해야함
        return {state: loginEmail + "/" + loginPassword + "/" + cookie  + "/" + "api check"}
        //
        // const userData = await prisma.user.findUnique({where:{email:loginEmail}})
        //
        // if (userData !== null){
        //         const compareBool =  await bcrypt.compare(loginPassword, userData.password)
        //         if(compareBool){
        //                 // 세션에 user 전달
        //                 const session = await getSession(cookie);
        //                 session.set("user", { id: userData.id, email: userData.email, nickname: userData.nickname });
        //                 return json(
        //                     { state: 'Success' },
        //                     {
        //                             headers: {
        //                                 "Set-Cookie": await commitSession(session),
        //                         },
        //                 });
        //         } else {
        //                 return {state:'Invalid Password'}
        //         }
        // } else {
        //         return {state:'Invalid Email'}
        // }

}

//INFO 탈퇴하기

// 회원 정보 DB 삭제
async function deleteUser(email: string) {
        return prisma.user.delete({
                where: {email: email},
        });
}
// 탈퇴하기
export async function withdraw(body: UserDao, cookie:string|null){
        try {
                await deleteUser(body.email);
                //세션 파기
                const session = await getSession(cookie);
                return json(
                    { state: 'Success' },
                    {
                            headers: {
                                    "Set-Cookie": await destroySession(session),
                            },
                    });
        } catch (err){
                return  {state:err}
        }
}

export const action:ActionFunction = async ({ request }) => {
        const method = request.method;
        const body = await request.json();
        const cookie = request.headers.get("Cookie")
        switch (method) {
                case "POST":
                        return await login(body, cookie);
                case "PUT":
                        return await signUp(body);
                case "DELETE":
                        return await withdraw(body, cookie);
                default :
                        return {state: "Err"}
        }
}


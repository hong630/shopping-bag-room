import {ActionFunction, json} from "@remix-run/node";
import {destroySession, getSession} from "~/routes/session";

export const action: ActionFunction = async ({ request }) => {
    try{
        const session = await getSession(request.headers.get("Cookie"));

        return json(
            { state: 'Success' },
            {
                headers: {
                    "Set-Cookie": await destroySession(session),
                },
            });
    }catch(error){
        return json(
            { state: 'Error' }
        );
    }

};

import { NextResponse } from "next/server";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

const MAX_AGE = 60 * 60 * 24 * 30; //days

export async function POST(request: Request) {
  const body = await request.json();  

  try {
    const { data } = await axios.post(process.env.BACKEND_PORT + "users/login", body);
    let datatoken = data;
    let hasil = datatoken;    

    // serialize(COOKIE_NAME, hasil["accessToken"], {
    //   //COOKIE_NAME berasal dari constants/index.ts
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: MAX_AGE,
    //   path: "/",
    // });
    try {
      cookies().set({
        name: COOKIE_NAME,
        value: hasil["accessToken"],
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: MAX_AGE,
        path: "/",
      }) 

      const response = {
        message: "Authenticated",
      };
  
      return new Response(JSON.stringify(response), {
        status: 200,       
      });
      
    } catch (error) {
      const response = {
        message: error,
      };
  
      return new Response(JSON.stringify(response), {
        status: 200,       
      });
    }

    // //redirect the user to dashboard
    // router.push("/dashboard");

    //ALWAYS CHECK THISS    

    // const serialized = serialize(COOKIE_NAME, hasil["accessToken"], {
    //   //COOKIE_NAME berasal dari constants/index.ts
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: MAX_AGE,
    //   path: "/",
    // });

    // const response = {
    //   message: "Authenticated!",
    // };

    // return new Response(JSON.stringify(response), {
    //   status: 200,
    //   headers: { "Set-Cookie": serialized },
    // });

  } catch (e) {
    const error = e as AxiosError;
    console.log(error);
    alert(error.message);
  }
}

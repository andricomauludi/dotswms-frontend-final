import { BACKEND_PORT, COOKIE_NAME, MAX_AGE } from "@/constants";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

export async function POST() {
    try {
      // const { data } = await axios.delete(process.env.BACKEND_PORT + "users/logout");
      // let datatoken = data;
      // let hasil = datatoken;    
      const cookieStore = cookies();

      let token = cookieStore.get(COOKIE_NAME);             //COOKIE_NAME diambil dari constants index.ts
  
  
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
          value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTEwMDNhNy00YjRiLTQ5NjctOGRjOC1iNWYyY2FmOTNiYmIiLCJ1c2VyTmFtZSI6Ik11aGFtbWFkIFNyaSBHaWxicmFuIEJpbGxhaHB1dHJhIiwiZW1haWwiOiJnaWxicmFuYmlsbGFocHV0cmFAZ21haWwuY29tIiwicm9sZSI6ImJ1c2luZXNzIGRldmVsb3BtZW50IiwiaWF0IjoxNzAzNDk1ODE4LCJleHAiOjE3MDM1ODIyMTh9.HTUZfyjjkWNMtNdBng_B9cdEvplqZNhFn8feLjprUyA',
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: -1,
          path: "/",
        }) 
  
        const response = {
          message: "Logout!",
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
      const response = {
        message: error,
        status:404
      };
  
      return new Response(JSON.stringify(response), {
        status: 200,       
      });
    }
  }
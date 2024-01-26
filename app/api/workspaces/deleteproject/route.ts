import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json();
 
  const cookieStore = cookies();

  const token = cookieStore.get(COOKIE_NAME);

  try {
    const { data } = await axios.delete(
      process.env.BACKEND_PORT + "workspaces/delete-project/"+body._id,
      {
        headers: { Authorization: `Bearer ${token?.value}`, 'Content-Type': 'multipart/form-data' },
      }
    );    

    const response = {
      data,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (e) {
    const error = e as AxiosError;
    console.log(error);
    console.log(error.message);
  }
}

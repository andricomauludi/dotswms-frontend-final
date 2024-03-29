import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.formData();
 
  const cookieStore = cookies();

  const token = cookieStore.get(COOKIE_NAME);

  try {
    const { data } = await axios.patch(
      process.env.BACKEND_PORT + "workspaces/edit-project/",
      body,
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

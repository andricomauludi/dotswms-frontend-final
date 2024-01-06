import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();

  const token = cookieStore.get(COOKIE_NAME); //COOKIE_NAME diambil dari constants index.ts

  try {
    const { data } = await axios.get(
      process.env.BACKEND_PORT +
        "workspaces/all-group-project",
      { headers: { Authorization: `Bearer ${token?.value}` } }
    );
    let datatoken = data;
    let hasil = datatoken;

    const response = {
      data,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
    // console.log(datatoken);
  } catch (e) {
    const error = e as AxiosError;
    console.log(error);
    alert(e);
  }
}

export async function POST(request: Request) {
  const body = await request.formData();
 
  const cookieStore = cookies();

  const token = cookieStore.get(COOKIE_NAME);

  try {
    const { data } = await axios.post(
      process.env.BACKEND_PORT + "workspaces/create-table-project",
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

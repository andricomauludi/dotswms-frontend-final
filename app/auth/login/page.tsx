"use client";

import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      email: event.currentTarget.email.value,
      password: event.currentTarget.password.value,
    };
    console.log(payload);
    try {
      const { data } = await axios.post("/api/auth/login", payload);
      alert(JSON.stringify(data));
      //redirect the user to dashboard
      router.push("/");
    } catch (e) {
      const error = e as AxiosError;
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div
        className="absolute top-0 w-full h-full bg-black bg-no-repeat bg-full"
        style={{
          backgroundImage: "url('/images/register_bg_2.png')",
        }}
      >
        <div className="container mx-auto px-4 h-full">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-boxdark border-0">
                <div className="rounded-t mb-0 px-6 py-6">
                  <div className="flex content-center items-center justify-center h-full">
                    <Image
                      width={176}
                      height={32}
                      src={"/images/dots-logo-white.png"}
                      alt="Logo"
                    />
                  </div>
                  <div className="text-center mt-5 mb-3">
                    <h1 className="text-white font-bold">Sign in</h1>
                  </div>
                  {/* <div className="btn-wrapper text-center">
                    <button
                      className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                      type="button"
                    >
                      <img
                        alt="..."
                        className="w-5 mr-1"
                        src="/img/github.svg"
                      />
                      Github
                    </button>
                    <button
                      className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                      type="button"
                    >
                      <img
                        alt="..."
                        className="w-5 mr-1"
                        src="/img/google.svg"
                      />
                      Google
                    </button>
                  </div> */}
                  <hr className="mt-6 border-b-1 border-blueGray-300" />
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-white text-xs font-bold mb-2"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Email"
                        name="email"
                        id="email"
                        required
                      />
                    </div>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-white text-xs font-bold mb-2"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                        id="password"
                        name="password"
                        required
                      />
                    </div>
                    <div className="text-center mt-6">
                      <button className="w-full cursor-pointer rounded-lg border p-4 text-white transition hover:bg-opacity-20"  style={{backgroundImage:"linear-gradient(to right, green , yellow)", color:"black"}} >
                        Sign In
                      </button>
                    </div>
                  </form>
                  <form></form>
                </div>
              </div>
              {/* <div className="flex flex-wrap mt-6 relative">
                <div className="w-1/2">
                  <a
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    className="text-blueGray-200"
                  >
                    <small>Forgot password?</small>
                  </a>
                </div>
                <div className="w-1/2 text-right">
                  <Link href="/auth/register" className="text-blueGray-200">
                    <small>Create new account</small>
                  </Link>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";
import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import { useState, useEffect, useLayoutEffect } from "react";
import Loader from "@/components/common/Loader";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

interface UserResponse {
  user: string | null;
  error: AxiosError | null;
}
async function getUser(): Promise<UserResponse> {
  try {
    console.log("masuk getUser")
    const { data } = await axios.get("/api/auth/me"); //ngambil api dari auth me    
    return {
      user: data,
      error: null,
    };
  } catch (e) {
    const error = e as AxiosError;

    return {
      user: null,
      error,
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 1000);
  // }, []);

  const [isSuccess, setIsSuccess] = useState<boolean>(false); //untuk membuat state apakah sukses atau nggak untuk fetching cookie, kalo nggak maka nanti di print loading
  const router = useRouter();  
  useLayoutEffect(() => {    
    setTimeout(() => setLoading(true), 1000);
    (async () => {
      const { user, error } = await getUser();
      
      if (error) {        
        setTimeout(() => setLoading(false), 1000);
        router.push("/auth/login"); //akan dikembalikan kalo gaada cookies
        setSidebarOpen(true);
        
        
        return;
      }      
      setTimeout(() => setLoading(false), 1000);

      //if error didnt happen, if everythins is alright
      setIsSuccess(true);
    })();
  }, [router]);

  if (!isSuccess) {
    setTimeout(() => setLoading(false), 1000);
  }

  return (          
        <body suppressHydrationWarning={true}>
          <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {loading ? (
              <Loader />
            ) : (
              <div className="flex h-screen overflow-hidden">
                {/* <!-- ===== Sidebar Start ===== --> */}
                <Sidebar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  
                />
                {/* <!-- ===== Sidebar End ===== --> */}

                {/* <!-- ===== Content Area Start ===== --> */}
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                  {/* <!-- ===== Header Start ===== --> */}
                  <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                  {/* <!-- ===== Header End ===== --> */}

                  {/* <!-- ===== Main Content Start ===== --> */}
                  <main>
                    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                      {children}
                    </div>
                  </main>
                  {/* <!-- ===== Main Content End ===== --> */}
                </div>
                {/* <!-- ===== Content Area End ===== --> */}
              </div>
            )}
          </div>
        </body>      
  );
}

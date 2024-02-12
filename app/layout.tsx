"use client";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

interface UserResponse {
  user: string | null;
  error: AxiosError | null;
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {  

  return (    
      <html lang="en">
       {children}
      </html>    
  );
}

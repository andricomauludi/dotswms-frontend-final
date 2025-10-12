"use client";
import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import axios, { AxiosError } from "axios";

// import { CookiesProvider } from 'next-client-cookies/server';

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

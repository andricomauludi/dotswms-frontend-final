"use client";
import React, { useEffect, useState } from "react";
import ChatCard from "../Chat/ChatCard";
import CardDataStats from "../CardDataStats";
// import Map from "../Maps/TestMap";

// without this the component renders on server and throws an error
import dynamic from "next/dynamic";
import CardDataStatsGreen from "../CardDataStatsGreen";
import axios, { AxiosError } from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsProgress, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons/faSquareCheck";
import { useCookies } from "next-client-cookies";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import { useRouter } from "next/navigation";
import TableOne from "../Tables/TableOne";
import ChartTwo from "../Charts/ChartTwo";
import ChartOne from "../Charts/ChartOne";

const MapOne = dynamic(() => import("../Maps/MapOne"), {
  ssr: false,
});

const ECommerce: React.FC = () => {
  const router = useRouter();

  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true);
  const cookies = useCookies();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // try {
      //   const { data: response } = await axios.get("/api/dashboard/content-card");
      //   setData(await response.data);
      // } catch (e) {
      //   const error = e as AxiosError;
      //   console.log(error);
      // }

      try {
        const { data } = await axios.get(
          BACKEND_PORT + "dashboard/get-contents-card",
          { headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` } }
        );
        setData(await data);        
      } catch (e) {
        const error = e as AxiosError;
        console.log(error);
        router.push("/auth/login");      

      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="On Going Project" total={data.project.count}>
          {/* <CardDataStats title="Total Group Project" total={data.groupproject} rate="0.43%" levelUp> */}
          <FontAwesomeIcon icon={faBarsProgress} />
        </CardDataStats>
        <CardDataStats title="On Going Item" total={data.tableproject.count}>
          {/* <CardDataStats title="Total Profit" total="$45,2K" rate="4.35%" levelUp> */}
          <FontAwesomeIcon icon={faListCheck} />
        </CardDataStats>
        <CardDataStats title="On Going Sub Item" total={data.subitem.count}>
          {/* <CardDataStats title="Total Product" total="2.450" rate="2.59%" levelUp> */}
          <FontAwesomeIcon icon={faSquareCheck} />
        </CardDataStats>

        <CardDataStatsGreen title="Total Users" total={data.user}>
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStatsGreen>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* <ChartOne /> */}
        <ChatCard />
        {/* <ChatCardOri /> */}
        {/* <ChartThree /> */}
        {/* <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChartTwo /> */}
      </div>
    </>
  );
};

export default ECommerce;

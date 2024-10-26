import Link from "next/link";
import Image from "next/image";
import { Chat } from "@/types/chat";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import { useCookies } from "next-client-cookies";

// const chatData: Chat[] = [
//   {
//     avatar: "/images/user/user-01.png",
//     name: "Devid Heilo",
//     text: "How are you?",
//     time: 12,
//     textCount: 3,
//     dot: 3,
//   },
//   {
//     avatar: "/images/user/user-02.png",
//     name: "Henry Fisher",
//     text: "Waiting for you!",
//     time: 12,
//     textCount: 0,
//     dot: 1,
//   },
//   {
//     avatar: "/images/user/user-04.png",
//     name: "Jhon Doe",
//     text: "What's up?",
//     time: 32,
//     textCount: 0,
//     dot: 3,
//   },
//   {
//     avatar: "/images/user/user-05.png",
//     name: "Jane Doe",
//     text: "Great",
//     time: 32,
//     textCount: 2,
//     dot: 6,
//   },
//   {
//     avatar: "/images/user/user-01.png",
//     name: "Jhon Doe",
//     text: "How are you?",
//     time: 32,
//     textCount: 0,
//     dot: 3,
//   },
//   {
//     avatar: "/images/user/user-03.png",
//     name: "Jhon Doe",
//     text: "How are you?",
//     time: 32,
//     textCount: 3,
//     dot: 6,
//   },
// ];

const ChatCard = () => {
  const [data, setData] = useState();
  const [imageloader, setImageLoader] = useState();
  const [isLoading, setLoading] = useState(true);
  const cookies = useCookies();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // try {
      //   const { data: response } = await axios.get("/api/users/all");
      //   setData(await response.data.user);
      //   setImageLoader(`/img/${await response.data.user.profile_picture}`);
      // } catch (error: any) {
      //   console.error(error.message);
      // }



      try {
        const { data } = await axios.get(
          BACKEND_PORT + "dashboard/get-users-dashboard",
          { headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` } }
        );
        setImageLoader(`/img/${await data.user.profile_picture}`);
        setData(await data.user);        
      } catch (e) {
        const error = e as AxiosError;
        console.log(error);
        alert(e);
      }



      setLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4" >
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Users
      </h4>
      <div>
        {data.map((item, key) => (
          <Link
            href="/"
            className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
          >
            <div className="relative h-14 w-14 rounded-full">
              <Image
                src={`data:image/jpeg;base64,${item.profile_picture}`}
                alt="User"
                style={{
                  borderRadius: "50%",
                  margin: "auto",
                  objectFit: "cover",
                }}
                layout="fill"
              />

              {/* <Image src={item.profile_picture} alt="User" width={57} height={56} /> */}
              {/* <span
                className={`absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                  chat.dot === 6 ? "bg-meta-6" : `bg-meta-${chat.dot}`
                } `}
              ></span> */}
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {item.full_name}
                </h5>
                <p>
                  <span className="text-sm text-black dark:text-white">
                    {item.email}
                  </span>
                </p>
                <p
                  className={"inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium text-warning bg-warning"}
                >
                  {item.role}
                </p>
              </div>
              {/* {chat.textCount !== 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-medium text-white">
                    {" "}
                    {chat.textCount}
                  </span>
                </div>
              )} */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatCard;

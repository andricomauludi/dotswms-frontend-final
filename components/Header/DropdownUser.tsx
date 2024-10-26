import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Buttonlogout from "./ButtonLogout";
import axios, { AxiosError } from "axios";
import ButtonShowProfile from "./ButtonShowProfile";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";


const DropdownUser = () => {
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [data, setData] = useState();
  const [imageloader, setImageLoader] = useState();
  const [isLoading, setLoading] = useState(true);
  const cookies = useCookies();


  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  //show profile data

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // try {
      //   const { data: response } = await axios.get("/api/users/me");
      //   setData(await response.data.user);
      // } catch (e) {
      //   setLoading(false);
      //   const error = e as AxiosError;
      //   console.log(error);      
      // }



      try {
        const { data } = await axios.get(
          BACKEND_PORT + "users/me",
          { headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` } }
        );
        setImageLoader(`/img/${await data.user.profile_picture}`);
      
        setData(await data.user);        
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
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {data.full_name}
          </span>
          <span className="block text-xs">{data.role}</span>
        </span>

        <span className="h-12 w-12 rounded-full" style={{width:48, height:48, position: 'relative'}}>  
               
            <Image
              src={`/images/avatar/${data.profile_picture}`}
              alt="User"                                                                                    
              style={{
                borderRadius: "50%",     
                margin:"auto",
                objectFit:"cover"                         

              }}
              layout="fill"
            />          
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <li>
            <ButtonShowProfile />
          </li>
        </ul>
        <Buttonlogout />
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownUser;

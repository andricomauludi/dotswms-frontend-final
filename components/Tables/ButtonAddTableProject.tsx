import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
  Chip,
  Spinner,
} from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Flip, ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faList,
  faListCheck,
  faTimesCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import { useCookies } from "next-client-cookies";
import io from "socket.io-client";

interface IprofileState {
  //interface merupakan rangka object yang mau kita masukin dari api
  _id: string;
  full_name: string;
  address: string;
  birthday: string;
  date: string;
  email: string;
  phone: string;
  profile_picture: string;
  role: string;
}

const socket = io(BACKEND_PORT); // Replace with your backend URL

const ButtonAddTableProject = forwardRef(
  ({ parentFunction, tableData }, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState([]);
    const [dataImage, setDataImage] = useState([]);
    const [imageloader, setImageLoader] = useState();
    const [isLoading, setLoading] = useState(true);
    const [isLoadingModal, setLoadingModal] = useState(false);
    const [size, setSize] = React.useState("5xl");
    const cookies = useCookies();

    const handleChildEvent = () => {
      // Do something in the child component
      parentFunction(); // Call the parent function
    };

    useImperativeHandle(ref, () => ({
      // Expose parent function to parent component
      callParentFunction: handleChildEvent,
    }));

    const handleOpen = async (size: any) => {
      setSize(size);
      onOpen();
      // try {
      //   const { data } = await axios.get("/api/users/me");
      //   const profiles: IprofileState[] = await data.data.user;
      //   console.log(profiles);
      //   if (data.status == 404) {
      //     alert(data.message);
      //   }
      // } catch (e) {
      //   const error = e as AxiosError;
      //   console.log(error);
      //   alert(error.message);
      // }
    };
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      setLoadingModal(true);

      var formData = new FormData();
      event.preventDefault();

      const contentposting: any = document.querySelector("#contentposting");
      const contentpostingarray: any = contentposting.files;

      if (contentposting.files[0] !== undefined) {
        // formData.append("contentposting", contentposting.files[0]);

        [...contentpostingarray].forEach((file) => {
          formData.append("contentposting", file);
        });
      } else {
        formData.append("contentposting", "");
      }

      // console.log(contentposting.files[0]);
      // console.log(contentposting.files);

      //   for (var pair of formData.entries()) {
      //     console.log(pair[0]+ ', ' + pair[1]);
      // }
      // console.log(contentposting.files)
      //   throw new Error("ngentot")

      formData.append("item", event.currentTarget.item.value);
      formData.append(
        "postingschedule",
        event.currentTarget.postingschedule.value
      );
      formData.append(
        "lead_name",
        data[event.currentTarget.lead.value]["full_name"]
      );
      formData.append(
        "lead_email",
        data[event.currentTarget.lead.value]["email"]
      );
      formData.append(
        "contentcategory",
        event.currentTarget.contentcategory.value
      );
      formData.append(
        "postingtime",
        event.currentTarget.postingtime1.value +
          ":" +
          event.currentTarget.postingtime2.value
      );
      formData.append(
        "postingcaption",
        event.currentTarget.postingcaption.value
      );
      formData.append(
        "contenttextlink",
        event.currentTarget.contenttextlink.value
      );
      formData.append("contenttext", event.currentTarget.contenttext.value);
      formData.append("postingstatus", event.currentTarget.postingstatus.value);
      formData.append(
        "lead_avatar",
        data[event.currentTarget.lead.value]["profile_picture"]
      );
      formData.append("updated_by_avatar", dataImage.profile_picture);
      formData.append("created_by_avatar", dataImage.profile_picture);
      formData.append("project_id", tableData._id);
      formData.append("project_name", tableData.project_name);
      formData.append("created_by", dataImage.full_name);
      formData.append("updated_by", dataImage.full_name);

      // const payload = {
      //   item: event.currentTarget.item.value,
      //   postingschedule: event.currentTarget.postingschedule.value,
      //   lead: event.currentTarget.lead.value,
      //   contentcategory: event.currentTarget.contentcategory.value,
      //   postingtime: event.currentTarget.postingtime.value,
      //   postingcaption: event.currentTarget.postingcaption.value,
      //   contenttextlink: event.currentTarget.contenttextlink.value,
      //   contentposting: event.currentTarget.contentposting.value,
      //   instagrampostingstatus: event.currentTarget.instagrampostingstatus.value,
      //   tiktokpostingstatus: event.currentTarget.tiktokpostingstatus.value,
      // };
      // console.log(data[event.currentTarget.lead.value]['full_name']);
      try {
        // const { data } = await axios.post(
        //   "/api/workspaces/tableproject",
        //   formData,
        //   {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //   }
        // );

        

        const { data } = await axios.post(
          BACKEND_PORT + "workspaces/create-table-project",
          formData,
          {
            headers: {
              Authorization: `Bearer ${cookies.get(COOKIE_NAME)}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setLoadingModal(false);

        onClose();
        onClose();        

        //redirect the user to dashboard
      } catch (e) {
        setLoadingModal(false);
        const error = e as AxiosError;
        console.log(error);
        alert(error.message);
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {         
          const { data } = await axios.get(
            BACKEND_PORT +
              "users/dropdown-user",
            { headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` } }
          );       
          console.log(data);
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
    
    useEffect(() => {
      socket.on("newTableProject", (newProject) => {
        console.log(newProject);
        setData((prevData) => {
          // If the existing data is empty, add the new project directly
          if (prevData.length === 0) {
            return [newProject];
          }
      
          // Check if there's a project with the same project_id
          const matchingProject = prevData.find(
            (project) => project.project_id === newProject.project_id
          );
      
          // If a matching project is found, add the new project to the data
          if (matchingProject) {
            return [...prevData, newProject];
          }
      
          // If no matching project is found, return the existing data unchanged
          return prevData;
        });
      });
      
      // Clean up the socket listener on component unmount
      return () => {
        socket.off("newTableProject");
      };
    }, []);

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(
            BACKEND_PORT + "users/me",
            {
              headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` },
            }
          );
          setDataImage(await data.user);
        } catch (error: any) {
          console.error(error.message);
        }
        setLoading(false);
      };

      fetchData();
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No profile data</p>;
    if (isLoadingModal)
      return (
        <Modal
          className="sticky top-0 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
          size={"2xl"}
          isOpen={isOpen}
          scrollBehavior={"outside"}
          backdrop="blur"
          isDismissable={false}
          style={{ zIndex: 99999 }}
        >
          <ModalContent className="">
            <div
              className="text-center"
              style={{
                margin: "40px",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Spinner label="Loading" color="success" labelColor="success" />
            </div>
          </ModalContent>
        </Modal>
      );

    return (
      <>
        <div className="flex flex-wrap gap-3">
          <Button
            key={"5xl"}
            onPress={() => handleOpen("5xl")}
            color="primary"
            style={{
              backgroundImage: "linear-gradient(to right, green , yellow)",
              color: "black",
            }}
            // variant="bordered"
          >
            Add Item
          </Button>
        </div>
        <div>
          <Modal
            className="sticky top-0 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
            size={"5xl"}
            style={{ zIndex: "99999" }}
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior={"outside"}
            isDismissable={false}
            backdrop="blur"
          >
            <ModalContent className="">
              <div className="w-full max-w-200 rounded-lg bg-white py-12 px-8 dark:bg-boxdark md:py-15 md:px-17.5">
                <h3 className="font-medium text-black dark:text-white">
                  Add Item
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                    <div className="flex flex-col gap-9">
                      {/* <!-- Contact Form --> */}
                      <div className="p-6.5">
                        <div className="mb-4.5">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Item
                            {/* <span className="text-meta-1">*</span> */}
                          </label>
                          <input
                            name="item"
                            id="item"
                            type="text"
                            placeholder="Enter the item"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          />
                        </div>
                        <div className="mb-4.5">
                          <div>
                            <label className="mb-3 block text-black dark:text-white">
                              Posting Schedule
                            </label>
                            <div className="relative">
                              <input
                                name="postingschedule"
                                id="postingschedule"
                                type="date"
                                className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-4.5">
                          <div>
                            <label className="mb-3 block text-black dark:text-white">
                              Lead
                            </label>
                            <div className="relative z-20 bg-white dark:bg-form-input">
                              <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                <FontAwesomeIcon icon={faUser} />
                              </span>
                              <select
                                name="lead"
                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                              >
                                {data.map((item, key) => (
                                  <>
                                    <option value={key}>
                                      {item.full_name}
                                    </option>
                                  </>
                                ))}
                              </select>
                              <span className="absolute top-1/2 right-4 z-20 -translate-y-1/2">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g opacity="0.8">
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                      fill="#637381"
                                    ></path>
                                  </g>
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-4.5">
                          <div>
                            <label className="mb-3 block text-black dark:text-white">
                              Content Category
                            </label>
                            <div className="relative z-20 bg-white dark:bg-form-input">
                              <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                <FontAwesomeIcon icon={faList} />
                              </span>
                              <select
                                name="contentcategory"
                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                              >
                                <option value="reels">Reels</option>
                                <option value="tiktok">Tiktok</option>
                                <option value="design">Design</option>
                                <option value="photo">Photo</option>
                                <option value="youtubevideo">
                                  Youtube Video
                                </option>
                              </select>
                              <span className="absolute top-1/2 right-4 z-20 -translate-y-1/2">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g opacity="0.8">
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                      fill="#637381"
                                    ></path>
                                  </g>
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                          <div className="w-1/2 xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Posting Time
                            </label>
                            <div className="relative z-20 bg-white dark:bg-form-input">
                              <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                <FontAwesomeIcon icon={faClock} />
                              </span>
                              <select
                                name="postingtime1"
                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                              >
                                <option value="01">01</option>
                                <option value="02">02</option>
                                <option value="03">03</option>
                                <option value="04">04</option>
                                <option value="05">05</option>
                                <option value="06">06</option>
                                <option value="07">07</option>
                                <option value="08">08</option>
                                <option value="09">09</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="15">15</option>
                                <option value="16">16</option>
                                <option value="17">17</option>
                                <option value="18">18</option>
                                <option value="19">19</option>
                                <option value="20">20</option>
                                <option value="21">21</option>
                                <option value="22">22</option>
                                <option value="23">23</option>
                                <option value="24">24</option>
                              </select>
                              <span className="absolute top-1/2 right-4 z-20 -translate-y-1/2">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g opacity="0.8">
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                      fill="#637381"
                                    ></path>
                                  </g>
                                </svg>
                              </span>
                            </div>
                          </div>

                          <div className="">
                            <label className="mb-4 block text-black dark:text-white">
                              <br></br>
                            </label>
                            :
                          </div>

                          <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              <br></br>
                            </label>
                            <div className="relative z-20 bg-white dark:bg-form-input">
                              {/* <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                              <FontAwesomeIcon icon={faClock}/>
                              </span> */}
                              <select
                                name="postingtime2"
                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                              >
                                <option value="00">00</option>
                                <option value="05">05</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="25">25</option>
                                <option value="30">30</option>
                                <option value="35">35</option>
                                <option value="40">40</option>
                                <option value="45">45</option>
                                <option value="50">50</option>
                                <option value="55">55</option>
                              </select>
                              <span className="absolute top-1/2 right-4 z-20 -translate-y-1/2">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g opacity="0.8">
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                      fill="#637381"
                                    ></path>
                                  </g>
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* <div className="mb-4.5">
                          <div>
                            <label className="mb-3 block text-black dark:text-white">
                              Posting Time
                            </label>
                            <div className="relative z-20 bg-white dark:bg-form-input">
                              <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g opacity="0.8">
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M10.0007 2.50065C5.85852 2.50065 2.50065 5.85852 2.50065 10.0007C2.50065 14.1428 5.85852 17.5007 10.0007 17.5007C14.1428 17.5007 17.5007 14.1428 17.5007 10.0007C17.5007 5.85852 14.1428 2.50065 10.0007 2.50065ZM0.833984 10.0007C0.833984 4.93804 4.93804 0.833984 10.0007 0.833984C15.0633 0.833984 19.1673 4.93804 19.1673 10.0007C19.1673 15.0633 15.0633 19.1673 10.0007 19.1673C4.93804 19.1673 0.833984 15.0633 0.833984 10.0007Z"
                                      fill="#637381"
                                    ></path>
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M0.833984 9.99935C0.833984 9.53911 1.20708 9.16602 1.66732 9.16602H18.334C18.7942 9.16602 19.1673 9.53911 19.1673 9.99935C19.1673 10.4596 18.7942 10.8327 18.334 10.8327H1.66732C1.20708 10.8327 0.833984 10.4596 0.833984 9.99935Z"
                                      fill="#637381"
                                    ></path>
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M7.50084 10.0008C7.55796 12.5632 8.4392 15.0301 10.0006 17.0418C11.5621 15.0301 12.4433 12.5632 12.5005 10.0008C12.4433 7.43845 11.5621 4.97153 10.0007 2.95982C8.4392 4.97153 7.55796 7.43845 7.50084 10.0008ZM10.0007 1.66749L9.38536 1.10547C7.16473 3.53658 5.90275 6.69153 5.83417 9.98346C5.83392 9.99503 5.83392 10.0066 5.83417 10.0182C5.90275 13.3101 7.16473 16.4651 9.38536 18.8962C9.54325 19.069 9.76655 19.1675 10.0007 19.1675C10.2348 19.1675 10.4581 19.069 10.6159 18.8962C12.8366 16.4651 14.0986 13.3101 14.1671 10.0182C14.1674 10.0066 14.1674 9.99503 14.1671 9.98346C14.0986 6.69153 12.8366 3.53658 10.6159 1.10547L10.0007 1.66749Z"
                                      fill="#637381"
                                    ></path>
                                  </g>
                                </svg>
                              </span>
                              <select
                                name="postingtime"
                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                              >
                                <option value="09:00">09:00</option>
                                <option value="12:00">12:00</option>
                                <option value="17:00">17:00</option>
                                <option value="19:00">19:00</option>
                                <option value="21:00">21:00</option>
                              </select>
                              <span className="absolute top-1/2 right-4 z-20 -translate-y-1/2">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g opacity="0.8">
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                      fill="#637381"
                                    ></path>
                                  </g>
                                </svg>
                              </span>
                              
                            </div>
                          </div>
                        </div> */}
                        <div className="mb-4.5">
                          <div>
                            <label className="mb-3 block text-black dark:text-white">
                              Posting Caption
                            </label>
                            <textarea
                              name="postingcaption"
                              rows={6}
                              placeholder="Write your caption"
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-9">
                      {/* <!-- Contact Form --> */}
                      <div className="p-6.5">
                        <div className="mb-4.5">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Content Text Link{" "}
                            {/* <span className="text-meta-1">*</span> */}
                          </label>
                          <input
                            name="contenttextlink"
                            type="text"
                            placeholder="Enter context text link"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          />
                        </div>
                        <div className="mb-4.5">
                          <div>
                            <label className="mb-3 block text-black dark:text-white">
                              Content Text
                            </label>
                            <textarea
                              name="contenttext"
                              rows={6}
                              placeholder="Enter Content text"
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            ></textarea>
                          </div>
                        </div>
                        <div className="mb-4.5">
                          <div>
                            <label className="mb-3 block text-black dark:text-white">
                              Content Posting
                            </label>
                            <input
                              name="contentposting"
                              id="contentposting"
                              type="file"
                              multiple
                              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                            />
                          </div>
                        </div>
                        <div className="mb-4.5">
                          <div>
                            <label className="mb-3 block text-black dark:text-white">
                              Posting Status
                            </label>
                            <div className="relative z-20 bg-white dark:bg-form-input">
                              <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                                <FontAwesomeIcon icon={faListCheck} />
                              </span>
                              <select
                                name="postingstatus"
                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                              >
                                <option value="not yet">Not Yet</option>
                                <option value="on preview">On Preview</option>
                                <option value="on hold">On Hold</option>
                                <option value="posted">Posted</option>
                              </select>
                              <span className="absolute top-1/2 right-4 z-20 -translate-y-1/2">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g opacity="0.8">
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                      fill="#637381"
                                    ></path>
                                  </g>
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="-mx-3 flex flex-wrap gap-y-4">
                    {/* <div className="w-full px-3 2xsm:w-1/2">
                  <Button
                  className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  >
                  Close
                  </Button>
                </div> */}
                    <div className="w-full px-3 2xsm:w-1/2">
                      <Button
                        type="submit"
                        className="block w-full rounded p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, green , yellow)",
                        }}
                      >
                        Add Item
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </ModalContent>
          </Modal>

          <ToastContainer />
          {/* <div         
          className="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
          style={{zIndex:1000000}}
        >
          <div style={{zIndex:1000001}} className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
            <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
              Your Message Sent Successfully
            </h3>
            <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
            <p className="mb-10 font-medium">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since
            </p>
            <div className="-mx-3 flex flex-wrap gap-y-4">
              <div className="w-full px-3 2xsm:w-1/2">
                <button className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1">
                  Cancel
                </button>
              </div>
              <div className="w-full px-3 2xsm:w-1/2">
                <button className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div> */}
        </div>
      </>
    );
  }
);
export default ButtonAddTableProject;

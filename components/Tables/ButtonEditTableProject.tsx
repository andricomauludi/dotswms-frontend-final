import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Modal,
  ModalContent,
  Button,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faEdit,
  faList,
  faListCheck,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Flip, ToastContainer, toast } from "react-toastify";
import CheckboxDeleteFile from "../Checkboxes/CheckboxDeleteFile";
import { useCookies } from "next-client-cookies";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";

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

const ButtonEditTableProject = forwardRef(
  ({ parentFunction, tableData }, ref) => {
    let text = tableData.postingtime;
    const myArray = text.split(":");
    let hourpostingtime = myArray[0];
    let minutepostingtime = myArray[1];

    const cookies = useCookies();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState([]);
    const [dataImage, setDataImage] = useState([]);
    const [imageloader, setImageLoader] = useState();
    const [contentDelete, setContentDelete] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isLoadingModal, setLoadingModal] = useState(false);
    const [size, setSize] = React.useState("5xl");
    const [type, setType] = useState("text");
    const [type2, setType2] = useState("text");

    const handleChildEvent = () => {
      // Do something in the child component
      parentFunction(); // Call the parent function
    };

    // const sendDataToParent = (index) => { // the callback. Use a better name
    //   setContentDelete(index);
    // };

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

      formData.append("_id", tableData._id);
      formData.append("item", event.currentTarget.item.value);
      formData.append(
        "postingschedule",
        event.currentTarget.postingschedule.value
      );
      if (!event.currentTarget.lead.value == "default") {
        formData.append(
          "lead_name",
          data[event.currentTarget.lead.value]["full_name"]
        );
        formData.append(
          "lead_email",
          data[event.currentTarget.lead.value]["email"]
        );
        formData.append(
          "lead_avatar",
          data[event.currentTarget.lead.value]["profile_picture"]
        );
      }
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
      formData.append("created_by_avatar", tableData.created_by_avatar);
      formData.append("project_id", tableData.project_id);
      formData.append("project_name", tableData.project_name);
      formData.append("created_by", tableData.created_by);
      formData.append("updated_by", dataImage.full_name);
      formData.append("updated_by_avatar", dataImage.profile_picture);
      //   for (var pair of formData.entries()) {
      //     console.log(pair[0]+ ', ' + pair[1]);
      // }

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

      // Log FormData contents
      for (let [key, value] of formData.entries()) {
        // console.log(`${key}: ${value}`);
      }
      if (contentDelete) {
        try {
          const payload = {
            id: contentDelete,
          };
          const { data } = await axios.post(
            BACKEND_PORT + "workspaces/delete-content-posting",
            payload,
            { headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` } }
          );
        } catch (e) {
          const error = e as AxiosError;
          console.log(error);
          alert(error.message);
        }
      }

      try {
        const { data } = await axios.patch(
          BACKEND_PORT + "workspaces/edit-table-project/",
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
        // handleChildEvent();

        // toast.success("Item Edited!", {
        //   autoClose: 3000,
        //   position: "top-right",
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "colored",
        //   transition: Flip,
        //   // onClose: () => handleChildEvent(),
        // });
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
            BACKEND_PORT + "users/dropdown-user",
            { headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` } }
          );
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
      const fetchData = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get(BACKEND_PORT + "users/me", {
            headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` },
          });
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
        <button className="hover:text-warning">
          <FontAwesomeIcon
            icon={faEdit}
            key={"5xl"}
            onClick={() => handleOpen("5xl")}
          />
        </button>
        <div>
          <Modal
            className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
            size={"5xl"}
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior={"outside"}
            isDismissable={false}
            backdrop="blur"
          >
            <ModalContent className="">
              <div className="w-full max-w-200 rounded-lg bg-white py-12 px-8 dark:bg-boxdark md:py-15 md:px-17.5">
                <h3 className="font-medium text-black dark:text-white">
                  Edit Item
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
                            placeholder={tableData.item}
                            defaultValue={tableData.item}
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
                                type={type}
                                onFocus={() => setType("date")}
                                onBlur={() => setType("text")}
                                id="postingschedule"
                                defaultValue={tableData.postingschedule}
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
                                key={tableData._id}
                                name="lead"
                                defaultValue="default"
                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                              >
                                <option hidden value="default">
                                  {tableData.lead_name}
                                </option>
                                {data.map((item,key) => (
                                  <option key={item._id} value={key}>
                                    {item.full_name}
                                  </option>
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
                                defaultValue={tableData.contentcategory}
                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                              >
                                <option
                                  hidden
                                  value={tableData.contentcategory}
                                >
                                  {tableData.contentcategory}
                                </option>
                                <option value="reels">Reels</option>
                                <option value="tiktok">Tiktok</option>
                                <option value="photo">Photo</option>
                                <option value="design">Design</option>
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
                                defaultValue={hourpostingtime}
                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                              >
                                <option hidden value={hourpostingtime}>
                                  {hourpostingtime}
                                </option>
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
                                defaultValue={minutepostingtime}
                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                              >
                                <option hidden value={minutepostingtime}>
                                  {minutepostingtime}
                                </option>
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
                        <div className="mb-4.5">
                          <div>
                            <label className="mb-3 block text-black dark:text-white">
                              Posting Caption
                            </label>
                            <textarea
                              name="postingcaption"
                              rows={6}
                              defaultValue={tableData.postingcaption}
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
                            placeholder={tableData.contenttextlink}
                            defaultValue={tableData.contenttextlink}
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
                              defaultValue={tableData.contenttext}
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            ></textarea>
                          </div>
                        </div>
                        <div className="mb-4.5">
                          <div>
                            <label className="mb-3 block text-black dark:text-white">
                              Remove Content Posting
                            </label>
                            {/* <Image
                              src={`data:image/jpeg;base64,${tableData.contentposting}`}
                              style={{ marginBottom: "20px" }}
                              alt="Brand"
                              width={200}
                              height={200}
                              onClick={() => handleOpen("5xl")}
                            /> */}
                            <CheckboxDeleteFile
                              itemId={tableData._id}
                              sendDataToParent={(value) =>
                                setContentDelete(value)
                              }
                            />
                            {/* <Checkbox className="mb-3"  color="danger">Danger</Checkbox> */}
                            <label className="mt-3 mb-3 block text-black dark:text-white">
                              Add Content Posting
                            </label>

                            <input
                              name="contentposting"
                              id="contentposting"
                              type="file"
                              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                              multiple
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
                                defaultValue={tableData.postingstatus}
                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                              >
                                <option hidden value={tableData.postingstatus}>
                                  {tableData.postingstatus}
                                </option>
                                <option value="not yet">Not Yet</option>
                                <option value="on preview">On Preview</option>
                                <option value="on hold">On Hold</option>
                                <option value="posted">Posted</option>
                                <option value="on revised">On Revised</option>
                                <option value="on scheduled">On Scheduled</option>
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
                        Edit Item
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
export default ButtonEditTableProject;

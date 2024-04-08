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
import styles from "./ButtonAddSubItem.module.css";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPalette } from "@fortawesome/free-solid-svg-icons";
import { Flip, ToastContainer, toast } from "react-toastify";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import { useCookies } from "next-client-cookies";

const ButtonEditProject = forwardRef(({ parentFunction, tableData }, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [data, setData] = useState([]);
  const [imageloader, setImageLoader] = useState();
  const [isLoadingModal, setLoadingModal] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [size, setSize] = React.useState("2xl");
  const [type, setType] = useState("text");
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

    formData.append("_id", tableData._id);
    formData.append("project_name", event.currentTarget.projectname.value);        
    if (event.currentTarget.projectcolor.value !== "default") {
      formData.append("color_project", event.currentTarget.projectcolor.value);     
    }

    try {
      // const { data } = await axios.post(
      //   "/api/workspaces/editproject",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );

      const { data } = await axios.patch(
        BACKEND_PORT + "workspaces/edit-project/",
        formData,
        {
          headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}`, 'Content-Type': 'multipart/form-data' },
        }
      );    
      setLoadingModal(false);

      onClose();
      onClose();
      handleChildEvent()

      toast.success("Project Edited!", {
        autoClose: 3000,
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Flip,
        // onClose: () => handleChildEvent(),
      });
      //redirect the user to dashboard
    } catch (e) {
      setLoadingModal(false);
      const error = e as AxiosError;
      console.log(error);
      alert(error.message);
    }
  };

  // if (isLoading)
  //   return (
  //     <Button color="default" isLoading>
  //       Loading
  //     </Button>
  //   );
  // if (!data) return <p>No profile data</p>;
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
          size="xs"
          onClick={() => handleOpen("5xl")}
        />
      </button>
      <div>
        <Modal
          className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
          size={"2xl"}
          isOpen={isOpen}
          onClose={onClose}
          scrollBehavior={"outside"}
          backdrop="blur"
        >
          <ModalContent className="">
            <div className="w-full max-w-200 rounded-lg bg-white py-12 px-8 dark:bg-boxdark md:py-15 md:px-17.5">
              <h3 className="font-medium text-black dark:text-white">
                Edit Project
              </h3>
              <form onSubmit={handleSubmit}>
                {/* <!-- Contact Form --> */}
                <div className="p-6.5">
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Project Name
                    </label>
                    <input
                      name="projectname"
                      id="projectname"
                      type="text"
                      defaultValue={tableData.project_name}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-4.5">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        Project Color
                      </label>
                      <div className="relative z-20 bg-white dark:bg-form-input">
                        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                        <FontAwesomeIcon icon={faPalette} />
                        </span>
                        <select
                          name="projectcolor"
                          defaultValue="default"

                          className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                        >
                          <option hidden value="default">
                            {`${
                          tableData.color_project === "border-l-6 border-warning"
                            ? "Yellow"
                            : tableData.color_project === "border-l-6 border-primary"
                            ? "Blue"
                            : tableData.color_project === "border-l-6 border-danger"
                            ? "Red"
                            : tableData.color_project === "border-l-6 border-secondary"
                            ? "Purple"
                            : tableData.color_project === "border-l-6 border-success"
                            ? "Green"
                            : ""
                        }`}
                          </option>
                          <option value="border-l-6 border-warning">
                            Yellow
                          </option>
                          <option value="border-l-6 border-primary">
                            Blue
                          </option>
                          <option value="border-l-6 border-danger">Red</option>
                          <option value="border-l-6 border-secondary">
                            Purple
                          </option>
                          <option value="border-l-6 border-success">
                            Green
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
                </div>

                <Button
                  type="submit"
                  className="block w-full rounded p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, green , yellow)",
                  }}
                >
                  Edit Project
                </Button>
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
});
export default ButtonEditProject;

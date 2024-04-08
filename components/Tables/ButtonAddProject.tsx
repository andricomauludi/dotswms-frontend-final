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
import { faPalette } from "@fortawesome/free-solid-svg-icons";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import { useCookies } from "next-client-cookies";

const ButtonAddProject = forwardRef(({ parentFunction, tableData }, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  const [imageloader, setImageLoader] = useState();
  const [isLoading, setLoading] = useState(true);
  const [isLoadingModal, setLoadingModal] = useState(false);
  const [size, setSize] = React.useState("2xl");
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
    formData.append("project_name", event.currentTarget.projectname.value);
    formData.append("group_project", tableData.group_project);
    formData.append("group_project_id", tableData._id);
    formData.append("color_project", event.currentTarget.projectcolor.value);
    formData.append("created_by", "admin1");
    formData.append("updated_by", "admin1");

    try {
      // const { data } = await axios.post(
      //   "/api/workspaces/addproject",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );


      const { data } = await axios.post(
        BACKEND_PORT + "workspaces/create-project",
        formData,
        {
          headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}`, 'Content-Type': 'multipart/form-data' },
        }
      );    

      
      setLoadingModal(false);

      onClose();
      onClose();
      handleChildEvent();

      toast.success("New Project Added!", {
        autoClose: 3000,
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Flip,
        // onClose: () => handleChildEvent()
      });
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
          BACKEND_PORT + "users/me",
          { headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` } }
        );
        setImageLoader(`/img/${await data.user.profile_picture}`);
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

  if (isLoading) return <p>Loading...</p>;
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
  if (!data) return <p>No profile data</p>;

  return (
    <>
      <Button
        key={"2xl"}
        onPress={() => handleOpen("2xl")}
        className="hover:bg-opacity-30"
      >
        <span className="text-lime-400">Add Project</span>
      </Button>
      <Modal
        className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
        size={"2xl"}
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior={"outside"}
        backdrop="blur"
        isDismissable={false}
      >
        <ModalContent className="">
          <div className="w-full max-w-200 rounded-lg bg-white py-12 px-8 dark:bg-boxdark md:py-15 md:px-17.5">
            <h3 className="font-medium text-black dark:text-white">
              Add Project
            </h3>
            <form onSubmit={handleSubmit}>
              {/* <!-- Contact Form --> */}
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Project Name
                    {/* <span className="text-meta-1">*</span> */}
                  </label>
                  <input
                    name="projectname"
                    id="item"
                    type="text"
                    placeholder="Enter the project name"
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
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                      >
                        <option value="border-l-6 border-warning">
                          Yellow
                        </option>
                        <option value="border-l-6 border-primary">Blue</option>
                        <option value="border-l-6 border-danger">Red</option>
                        <option value="border-l-6 border-secondary">
                          Purple
                        </option>
                        <option value="border-l-6 border-success">Green</option>
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
                  backgroundImage: "linear-gradient(to right, green , yellow)",
                }}
              >
                Add Project
              </Button>
            </form>
          </div>
        </ModalContent>
      </Modal>
      <ToastContainer />
    </>
  );
});
export default ButtonAddProject;

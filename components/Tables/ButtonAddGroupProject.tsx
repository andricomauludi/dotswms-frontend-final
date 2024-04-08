import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
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
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "next-client-cookies";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";

const ButtonAddGroupProject = forwardRef(( {parentFunction} , ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);  
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
  };

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoadingModal(true);
    var formData = new FormData();
    event.preventDefault();
    formData.append(
      "group_project",
      event.currentTarget.groupprojectname.value
    );
    formData.append("description", event.currentTarget.description.value);
    formData.append("created_by", "admin1");
    formData.append("updated_by", "admin1");

    try {
      // const { data } = await axios.post(
      //   "/api/workspaces/group-project",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );


      const { data } = await axios.post(
        BACKEND_PORT + "workspaces/create-group-project",
        formData,
        {
          headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}`, 'Content-Type': 'multipart/form-data' },
        }
      );    
      setLoadingModal(false);
      // alert("Success");

      onClose();
      onClose();  
      handleChildEvent();    
      
      toast.success("New Group Project Added!", {
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
      // try {
      //   const { data: response } = await axios.get(
      //     "/api/workspaces/dropdownuser"
      //   );
      //   setData(await response.data.user);
      // } catch (error: any) {
      //   console.error(error.message);
      // }



      try {
        const { data } = await axios.get(
          BACKEND_PORT +
            "users/dropdown-user",
          { headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` } }
        );                
    
        setData(await data.user);

        // console.log(datatoken);
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
        variant="flat"
        key={"2xl"}
        onPress={() => handleOpen("2xl")}
        style={{
          backgroundImage: "linear-gradient(to right, green , yellow)",
          color: "black",
        }}
        className="hover:bg-opacity-30"
        isIconOnly
      >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <div style={{ zIndex: 99999 }}>
        <Modal
          className="sticky top-0 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
          size={"2xl"}
          isOpen={isOpen}
          onClose={onClose}
          scrollBehavior={"outside"}
          backdrop="blur"
          isDismissable={false}
          style={{ zIndex: 99999 }}
        >
          <ModalContent className="">
            <div className="w-full max-w-200 rounded-lg bg-white py-12 px-8 dark:bg-boxdark md:py-15 md:px-17.5">
              <h3 className="font-medium text-black dark:text-white">
                Add Group Project
              </h3>
              <form onSubmit={handleSubmit}>
                {/* <!-- Contact Form --> */}
                <div className="p-6.5">
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Group Project Name
                      {/* <span className="text-meta-1">*</span> */}
                    </label>
                    <input
                      name="groupprojectname"
                      id="item"
                      type="text"
                      placeholder="Enter the group project name"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-4.5">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        Description
                      </label>
                      <textarea
                        name="description"
                        rows={6}
                        placeholder="Write your description"
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="block w-full rounded p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, green , yellow)",
                    color: "black",
                  }}
                >
                  Add Group Project
                </Button>
              </form>
            </div>
          </ModalContent>
        </Modal>
        <ToastContainer />
      </div>
    </>
  );
});
export default ButtonAddGroupProject;

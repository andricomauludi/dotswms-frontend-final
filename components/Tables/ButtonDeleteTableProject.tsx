import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
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
import styles from "./ButtonAddProject.module.css";
import { Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Flip, ToastContainer, toast } from "react-toastify";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import { useCookies } from "next-client-cookies";

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

const ButtonDeleteTableProject = forwardRef(
  ({ parentFunction, tableData }, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState();
    const [imageloader, setImageLoader] = useState();
    const [isLoadingModal, setLoadingModal] = useState(false);
    const [isLoading, setLoading] = useState(true);
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

    const handleDelete = async () => {
      setLoadingModal(true);

      const payload = {
        _id: tableData._id,
      };
      try {
        // const { data } = await axios.post(
        //   "/api/workspaces/deletetableproject",
        //   payload
        // );

        const { data } = await axios.delete(
          BACKEND_PORT + "workspaces/delete-table-project/"+tableData._id,
          {
            headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}`, 'Content-Type': 'multipart/form-data' },
          }
        );    
    
        setLoadingModal(false);

        onClose();
        onClose();
        // handleChildEvent()

        // toast.success("Item Deleted!", {
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
        //redirect the user to dashboard
      } catch (e) {
        setLoadingModal(false);
        const error = e as AxiosError;
        console.log(error);
        alert(error.message);
      }
    };

    // useEffect(() => {
    //   const fetchData = async () => {
    //     setLoading(true);
    //     try {
    //       const { data: response } = await axios.get("/api/users/me");
    //       setData(await response.data.user);
    //       setImageLoader(`/img/${await response.data.user.profile_picture}`);
    //     } catch (error: any) {
    //       console.error(error.message);
    //     }
    //     setLoading(false);
    //   };

    //   fetchData();
    // }, []);

    // if (isLoading) return <p>Loading...</p>;
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
        <button className="hover:text-danger">
          <FontAwesomeIcon
            icon={faTrash}
            key={"md"}
            onClick={() => handleOpen("md")}
          />
        </button>
        <div>
          <Modal
            className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
            size={"md"}
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior={"outside"}
            isDismissable={false}
            backdrop="blur"
          >
            <ModalContent className="">
              <div className="w-full max-w-200 rounded-lg bg-white py-12 px-8 dark:bg-boxdark md:py-15 md:px-17.5">
                {/* <h3 className="font-medium text-black dark:text-white">
                Warning
              </h3> */}
                {/* <!-- Contact Form --> */}
                <div className="p-6.5">
                  <div className="mb-4.5">
                    <div>
                      <h1 className="text-large text-center text-black dark:text-white">
                        Are you sure want to delete?
                      </h1>
                    </div>
                  </div>
                </div>
                <Row>
                  <div className="text-right">
                    <Button
                      className=" rounded border text-center"
                      color="danger"
                      variant="flat"
                      onPress={handleDelete}
                    >
                      Delete
                    </Button>
                    <Button
                      className=" rounded border text-center"
                      color="primary"
                      style={{ marginLeft: 20 }}
                      onPress={onClose}
                    >
                      Cancel
                    </Button>
                  </div>
                </Row>
              </div>
            </ModalContent>
          </Modal>
          <ToastContainer />
        </div>
      </>
    );
  }
);
export default ButtonDeleteTableProject;

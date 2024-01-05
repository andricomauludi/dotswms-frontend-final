import React, { useEffect, useState } from "react";
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
} from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import styles from "./ButtonAddProject.module.css";
import { Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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

export default function ButtonDeleteTableProject({ tableData }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState();
  const [imageloader, setImageLoader] = useState();
  const [isLoading, setLoading] = useState(true);
  const [size, setSize] = React.useState("5xl");

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
    const payload = {
      _id: tableData._id,     
    };    
    try {
      const { data } = await axios.post(
        "/api/workspaces/deletetableproject",
        payload,      
      );
      alert("Success");

      onClose;
      //redirect the user to dashboard
    } catch (e) {
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
                      style={{marginLeft:20}}
                      onPress={onClose}
                    >
                      Cancel
                    </Button>
                  </div>
                </Row>              
            </div>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}

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
import { Container } from "react-bootstrap";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

export default function ShowFileProject({ tableData }) {
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
  // const router = useRouter();
  // if (isLoading) return <p>Loading...</p>;
  // if (!data) return <p>No profile data</p>;

  return (
    <>
      <p className="text-black dark:text-white">
        {/* <embed
                      src={`data:application/pdf;base64,${packageItem.contenttext}`}
                    /> */}
        <Link
          onClick={() => handleOpen("5xl")}
          href={"#"}
          className="flex items-center gap-3.5 text-xs font-medium duration-300 ease-in-out hover:text-primary lg:text-xs"
          // className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
        >
          <FontAwesomeIcon icon={faFile} />
          Content Text
        </Link>
        <div>
          <Modal
            className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
            size={"5xl"}
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior={"outside"}
            backdrop="blur"
          >
            <ModalContent className="">
              <div className="w-full max-w-200 rounded-lg bg-white py-12 px-8 dark:bg-boxdark md:py-15 md:px-17.5">
                <h3 className="font-medium text-black dark:text-white" style={{paddingBottom:"20px"}}>
                  Content Text
                </h3>                
                {/* <embed
                  key={tableData._id}
                  src={`data:application/pdf;base64,${tableData.contenttext}`}
                  height={600}
                  width={900}
                /> */}                
                <iframe src={`${tableData.contenttext}`} height={600}
                  width={900} ></iframe>             
              </div>
            </ModalContent>
          </Modal>
        </div>
      </p>
    </>
  );
}

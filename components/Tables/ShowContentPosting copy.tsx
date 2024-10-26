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
import {
  faDownload,
  faImage,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import { useCookies } from "next-client-cookies";

export default function ShowContentPosting({ contentPostingItem }) {
  const cookies = useCookies();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState();
  const [imageloader, setImageLoader] = useState();
  const [isLoading, setLoading] = useState(true);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState(""); // To track media type (image or video)
  const [size, setSize] = React.useState("5xl");
  const [error, setError] = useState("");

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
  // if (!data) return <p>No profile data</p>;

  useEffect(() => {

    const handleFetchFile = async () => {
      try {
        setLoading(true);
        const payload = {
          file_name: contentPostingItem.file_name,
          file_type: contentPostingItem.file_type,
        };
        const response = await axios.post(
          BACKEND_PORT + "workspaces/show-content-posting",
          payload,
          {
            headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` },
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));

        setMediaUrl(url);
      } catch (error: any) {
        console.error(error.message);
      }
      setLoading(false);
    };

    handleFetchFile();
  }, [contentPostingItem]);

  if (isLoading) return <p>Loading...</p>;
  // if (!data) return <p>Error</p>;

  return (
    <>
      {contentPostingItem.file_type === "image/jpg" ? (
        <p className="text-black dark:text-white">
          <FontAwesomeIcon icon={faImage} onClick={() => handleOpen("5xl")} />

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
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                    <h3
                      className="font-medium text-black dark:text-white"
                      style={{ paddingBottom: "20px" }}
                    >
                      Content Posting
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {/* <a
                      style={{ paddingBottom: "20px" }}
                      download={`${contentPostingItem.file_name}`}
                      href={`data:image/jpg;base64,${data.contentfile}`}
                    >
                      <Button
                        key={"5xl"}
                        onPress={() => handleOpen("5xl")}
                        color="primary"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, green , yellow)",
                          color: "black",
                        }}
                        // variant="bordered"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                        Download
                      </Button>
                    </a> */}
                  </div>
                  <div className="flex-shrink-0 text-center place-content-center">
                    <img
                      src={mediaUrl}
                      alt="Fetched content"
                      style={{ maxWidth: "600px", maxHeight: "400px" }}
                    />
                    <h3
                      className="font-medium text-black dark:text-white"
                      style={{ paddingTop: "20px" }}
                    >
                      {contentPostingItem.file_name}
                    </h3>
                    <div>{/* <ShowFileProject /> */}</div>
                  </div>
                </div>
              </ModalContent>
            </Modal>
          </div>
        </p>
      ) : contentPostingItem.file_type === "image/jpeg" ? (
        <p className="text-black dark:text-white">
          <FontAwesomeIcon icon={faImage} onClick={() => handleOpen("5xl")} />
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
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                    <h3
                      className="font-medium text-black dark:text-white"
                      style={{ paddingBottom: "20px" }}
                    >
                      Content Posting
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3"></div>
                  <div className="flex-shrink-0 text-center">
                    <img
                      src={mediaUrl}
                      alt="Fetched content"
                      style={{ maxWidth: "600px", maxHeight: "400px" }}
                    />
                    <h3
                      className="font-medium text-black dark:text-white"
                      style={{ paddingBottom: "20px" }}
                    >
                      {contentPostingItem.file_name}
                    </h3>
                    <div>{/* <ShowFileProject /> */}</div>
                  </div>
                </div>
              </ModalContent>
            </Modal>
          </div>
        </p>
      ) : contentPostingItem.file_type === "image/png" ? (
        <p className="text-black dark:text-white">
          <FontAwesomeIcon icon={faImage} onClick={() => handleOpen("5xl")} />

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
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                    <h3
                      className="font-medium text-black dark:text-white"
                      style={{ paddingBottom: "20px" }}
                    >
                      Content Posting
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3"></div>
                  <div className="flex-shrink-0 text-center">
                    <img
                      src={mediaUrl}
                      alt="Fetched content"
                      style={{ maxWidth: "600px", maxHeight: "400px" }}
                    />
                    <h3
                      className="font-medium text-black dark:text-white"
                      style={{ paddingBottom: "20px" }}
                    >
                      {contentPostingItem.file_name}
                    </h3>
                    <div>{/* <ShowFileProject /> */}</div>
                  </div>
                </div>
              </ModalContent>
            </Modal>
          </div>
        </p>
      ) : contentPostingItem.file_type === "video/mp4" ? (
        <p className="text-black dark:text-white">
          <FontAwesomeIcon icon={faVideo} onClick={() => handleOpen("5xl")} />
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
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                    <h3
                      className="font-medium text-black dark:text-white"
                      style={{ paddingBottom: "20px" }}
                    >
                      Content Posting
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3"></div>
                  <div className="flex-shrink-0 text-center">
                    <video controls width="600">
                      <source src={mediaUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>

                    <h3
                      className="font-medium text-black dark:text-white"
                      style={{ paddingBottom: "20px" }}
                    >
                      {contentPostingItem.file_name}
                    </h3>
                    <div>{/* <ShowFileProject /> */}</div>
                  </div>
                </div>
              </ModalContent>
            </Modal>
          </div>
        </p>
      ) : (
        <p>No file</p>
      )}
    </>
  );
}

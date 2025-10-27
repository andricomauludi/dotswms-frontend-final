import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  useDisclosure,
  Button,
  Spinner,
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
  faSignOutAlt,
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
  const [isLoadingLink, setLoadingLink] = useState(true);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState(""); // To track media type (image or video)
  const [size, setSize] = React.useState("5xl");
  const [error, setError] = useState("");
  const handleOpen = async (size) => {
    setLoading(true); // Set loading to true when modal opens
    onOpen();

    try {
      const payload = {
        file_name: contentPostingItem.file_name,
        file_type: contentPostingItem.file_type,
      };
      const data = await axios.post(
        BACKEND_PORT + "workspaces/show-content-posting-link",
        payload,
        {
          headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` },
        }
      );
      console.log(data.data.fileUrl);
      setData(await data.data.fileUrl);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch file."); // Set error message
    } finally {
      setLoadingLink(false); // Set loading to false after fetching
    }

    try {
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
      console.log("ini url dari setmedia " + url);
      setMediaUrl(url);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch file."); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  return (
    <>
      {contentPostingItem.file_type === "image/jpg" ||
      contentPostingItem.file_type === "image/jpeg" ||
      contentPostingItem.file_type === "image/png" ? (
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
              <ModalContent>
                <div className="w-full max-w-200 rounded-lg bg-white py-12 px-8 dark:bg-boxdark md:py-15 md:px-17.5 text-center">
                  <h3
                    className="font-medium text-black dark:text-white"
                    style={{ paddingBottom: "20px" }}
                  >
                    Content Posting
                  </h3>
                  {isLoading ? (
                    <Spinner
                      label="Fetching file, please wait..."
                      color="success"
                      labelColor="success"
                    />
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <div className="flex-shrink-0 text-center">
                      {contentPostingItem.file_type.includes("image") && (
                        <>
                          <img
                            src={mediaUrl}
                            alt="Fetched content"
                            style={{
                              maxWidth: "600px",
                              maxHeight: "400px",
                              margin: "0 auto",
                            }} // Center the image
                          />
                          <a
                            href={mediaUrl}
                            download={contentPostingItem.file_name_real}
                            className="block mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            <Button
                              color="primary"
                              style={{
                                backgroundImage:
                                  "linear-gradient(to right, blue , pink)",
                                color: "white",
                              }}
                            >
                              <FontAwesomeIcon icon={faDownload} /> Download
                            </Button>
                          </a>
                        </>
                      )}
                      {contentPostingItem.file_type === "video/mp4" && (
                        <video controls width="600">
                          <source src={mediaUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      <h3
                        className="font-medium text-black dark:text-white"
                        style={{ paddingTop: "20px", paddingBottom: "20px" }}
                      >
                        {contentPostingItem.file_name_real}
                      </h3>
                    </div>
                  )}
                  {!isLoadingLink ? (
                    data && (
                      <>
                        <h3
                          className="font-medium text-black dark:text-white"
                          style={{ paddingBottom: "20px", paddingTop: "20px" }}
                        >
                          If loading takes too long, you can access this file
                          via Google Drive
                        </h3>
                        <a
                          href={data}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            color="primary"
                            style={{
                              backgroundImage:
                                "linear-gradient(to right, green , yellow)",
                              color: "black",
                            }}
                          >
                            <FontAwesomeIcon icon={faSignOutAlt} /> Go to Google
                            Drive
                          </Button>
                        </a>
                        <p style={{ paddingTop: "20px" }}>
                          You can download the file in Google Drive too
                        </p>
                      </>
                    )
                  ) : (
                    <Spinner
                      label="Fetching link, please wait..."
                      color="success"
                      labelColor="success"
                    />
                  )}
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
              <ModalContent>
                <div className="w-full max-w-200 rounded-lg bg-white py-12 px-8 dark:bg-boxdark md:py-15 md:px-17.5 text-center">
                  <h3
                    className="font-medium text-black dark:text-white"
                    style={{ paddingBottom: "20px" }}
                  >
                    Content Posting
                  </h3>
                  {isLoading ? (
                    <Spinner
                      label="Fetching file, please wait..."
                      color="success"
                      labelColor="success"
                    />
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <div className="flex-shrink-0 text-center">
                      <video
                        controls
                        width="600"
                        style={{ display: "block", margin: "0 auto" }}
                      >
                        <source src={mediaUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <a
                        href={mediaUrl}
                        download={contentPostingItem.file_name_real}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <Button
                          color="primary"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, blue , pink)",
                            color: "white",
                          }}
                        >
                          <FontAwesomeIcon icon={faDownload} /> Download Video
                        </Button>
                      </a>
                      <h3
                        className="font-medium text-black dark:text-white"
                        style={{ paddingTop: "20px", paddingBottom: "20px" }}
                      >
                        {contentPostingItem.file_name_real}
                      </h3>
                    </div>
                  )}
                  {!isLoadingLink ? (
                    data && (
                      <>
                        <h3
                          className="font-medium text-black dark:text-white"
                          style={{ paddingBottom: "20px", paddingTop: "20px" }}
                        >
                          If loading takes too long, you can access this file
                          via Google Drive
                        </h3>
                        <a
                          href={data}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            color="primary"
                            style={{
                              backgroundImage:
                                "linear-gradient(to right, green , yellow)",
                              color: "black",
                            }}
                          >
                            <FontAwesomeIcon icon={faSignOutAlt} /> Go to Google
                            Drive
                          </Button>
                        </a>
                        <p style={{ paddingTop: "20px" }}>
                          You can download the file in Google Drive too
                        </p>
                      </>
                    )
                  ) : (
                    <Spinner
                      label="Fetching link, please wait..."
                      color="success"
                      labelColor="success"
                    />
                  )}
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

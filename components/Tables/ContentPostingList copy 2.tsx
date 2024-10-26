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
import ShowContentPosting from "./ShowContentPosting";

export default function ContentPostingList({ contentPostingItem }) {
  const cookies = useCookies();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  const [imageloader, setImageLoader] = useState();
  const [isLoading, setLoading] = useState(true);

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [size, setSize] = useState("5xl");

  const handleOpen = (id, type, size) => {
    setSelectedItemId(id);
    setMediaType(type);
    setSize(size);
    onOpen();
  };
  // const router = useRouter();
  // if (!data) return <p>No profile data</p>;

  useEffect(() => {
    const fetchData2 = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          BACKEND_PORT + "workspaces/content-posting/" + contentPostingItem._id,
          { headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` } }
        );

        // const payload = {
        //   id: tableData._id,
        // };
        // const { data: response } = await axios.post(
        //   "/api/workspaces/tableinside",
        //   payload
        // );
        // const { data: response } = await axios.get(
        //   "/api/workspaces/tableproject"
        // );
        setData(await data.contentPosting);
        // setData(await response.data.tableproject);
      } catch (error: any) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchData2();
  }, [contentPostingItem]);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>Error</p>;

  return (
    <>
      {data.map((contentPostingItem) => (
        <div id={contentPostingItem.id} key={contentPostingItem.id}>          
          {["image/jpg", "image/jpeg", "image/png"].includes(
            contentPostingItem.file_type
          ) ? (
            <p className="text-black dark:text-white">
              <FontAwesomeIcon
                icon={faImage}
                onClick={() =>
                  handleOpen(
                    contentPostingItem.id,
                    contentPostingItem.file_type,
                    "5xl"
                  )
                }
              />
              <ShowContentPosting
                contentPostingItem={contentPostingItem}
                isOpen={isOpen && selectedItemId === contentPostingItem.id}
                onClose={onClose}
                size={size}
              />
            </p>
          ) : (
            <p className="text-black dark:text-white">
              <FontAwesomeIcon
                icon={faVideo}
                onClick={() =>
                  handleOpen(
                    contentPostingItem.id,
                    contentPostingItem.file_type,
                    "5xl"
                  )
                }
              />
              <ShowContentPosting
                contentPostingItem={contentPostingItem}
                isOpen={isOpen && selectedItemId === contentPostingItem.id}
                onClose={onClose}
                size={size}
              />
            </p>
          )}
        </div>
      ))}
    </>
  );
}

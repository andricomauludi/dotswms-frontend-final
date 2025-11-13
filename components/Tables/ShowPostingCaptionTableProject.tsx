import React, { useState } from "react";
import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faClosedCaptioning, faHashtag } from "@fortawesome/free-solid-svg-icons";

export default function ShowPostingCaptionTableProject({ tableData }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState();
  const [imageloader, setImageLoader] = useState();
  const [isLoading, setLoading] = useState(true);
  const [size, setSize] = React.useState("5xl");

  const handleOpen = async (size: any) => {
    setSize(size);
    onOpen();
  };

  return (
    <div className="text-black dark:text-white">
      <button
        onClick={() => handleOpen("5xl")}
        className="flex items-center text-xs font-medium duration-300 ease-in-out hover:text-primary lg:text-xs"
      >
        <FontAwesomeIcon icon={faClosedCaptioning} size="lg"/>
        Posting Caption
      </button>

      <Modal
        className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
        size="5xl"
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="outside"
        backdrop="blur"
      >
        <ModalContent>
          <div className="w-full max-w-200 rounded-lg bg-white py-12 px-8 dark:bg-boxdark md:py-15 md:px-17.5">
            <h3 className="font-medium text-black dark:text-white mb-5">
              Posting Caption
            </h3>

            <textarea
              name="postingcaption"
              rows={15}
              disabled
              value={tableData.postingcaption || ""}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}

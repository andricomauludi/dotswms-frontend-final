"use client";
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, Button, Spinner } from "@nextui-org/react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faImage, faVideo, faSignOutAlt, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import { useCookies } from "next-client-cookies";

export default function ShowContentPosting({ contentArray, initialIndex = 0, isOpen, setIsOpen }) {
  const cookies = useCookies();

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [mediaUrl, setMediaUrl] = useState("");
  const [googleDriveUrl, setGoogleDriveUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLink, setIsLoadingLink] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) fetchMedia(contentArray[activeIndex]);
  }, [activeIndex, isOpen]);

  if (!contentArray || contentArray.length === 0) return <p className="text-gray-400 italic">No content posting available</p>;

  const currentItem = contentArray[activeIndex];

  const fetchMedia = async (item) => {
    if (!item) return;

    setIsLoading(true);
    setIsLoadingLink(true);
    setError("");
    setMediaUrl("");
    setGoogleDriveUrl("");

    const payload = { file_name: item.file_name, file_type: item.file_type };

    try {
      const linkRes = await axios.post(
        BACKEND_PORT + "workspaces/show-content-posting-link",
        payload,
        {
          headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` },
        }
      );
      setGoogleDriveUrl(linkRes.data.fileUrl);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch Google Drive link.");
    } finally {
      setIsLoadingLink(false);
    }

    try {
      const blobRes = await axios.post(
        BACKEND_PORT + "workspaces/show-content-posting",
        payload,
        {
          headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([blobRes.data]));
      setMediaUrl(url);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrev = () => setActiveIndex((activeIndex - 1 + contentArray.length) % contentArray.length);
  const handleNext = () => setActiveIndex((activeIndex + 1) % contentArray.length);

  const renderMedia = () => {
    if (isLoading) return <Spinner label="Fetching file, please wait..." color="success" labelColor="success" />;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!currentItem) return <p>No file available</p>;

    if (currentItem.file_type.includes("image")) {
      return (
        <>
          <img
            src={mediaUrl}
            alt={currentItem.file_name_real}
            style={{ maxWidth: "600px", maxHeight: "400px", margin: "0 auto", borderRadius: "12px" }}
          />
          <a href={mediaUrl} download={currentItem.file_name_real}>
            <Button color="primary" className="mt-4" style={{ backgroundImage: "linear-gradient(to right, blue, pink)", color: "white" }}>
              <FontAwesomeIcon icon={faDownload} /> Download
            </Button>
          </a>
        </>
      );
    }

    if (currentItem.file_type === "video/mp4") {
      return (
        <>
          <video controls width="400" style={{ display: "block", margin: "0 auto", borderRadius: "12px" }}>
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <a href={mediaUrl} download={currentItem.file_name_real}>
            <Button color="primary" className="mt-4" style={{ backgroundImage: "linear-gradient(to right, blue, pink)", color: "white" }}>
              <FontAwesomeIcon icon={faDownload} /> Download Video
            </Button>
          </a>
        </>
      );
    }
  };

  return (
    <>
      {/* ICON GRID */}
      <div className="flex flex-wrap gap-4 mb-4">
        {contentArray.map((item, index) => (
          <div
            key={item._id || index}
            className="cursor-pointer text-black dark:text-white hover:scale-110 transition-transform"
            onClick={() => { setActiveIndex(index); setIsOpen(true); }}
            title={item.file_name_real}
          >
            {item.file_type.includes("image") ? (
              <FontAwesomeIcon icon={faImage} size="lg" />
            ) : item.file_type === "video/mp4" ? (
              <FontAwesomeIcon icon={faVideo} size="lg" />
            ) : (
              <p>No file</p>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      <Modal size="5xl" isOpen={isOpen} onClose={() => setIsOpen(false)} scrollBehavior="outside" backdrop="blur">
        <ModalContent>
          <div className="relative bg-white dark:bg-boxdark rounded-lg py-12 px-8 text-center">
            <h3 className="font-medium text-black dark:text-white mb-5">Content Posting</h3>

            {renderMedia()}

            {!isLoading && currentItem && (
              <h3 className="font-medium text-black dark:text-white mt-6 mb-4" style={{ wordBreak: "break-word" }}>
                {currentItem.file_name_real}
              </h3>
            )}

            {/* Google Drive fallback */}
            {!isLoadingLink ? (
              googleDriveUrl && (
                <>
                  <h3 className="font-medium text-black dark:text-white mt-4 mb-4">
                    Please access this file via Google Drive in case the buffer takes too long to load
                  </h3>
                  <a href={googleDriveUrl} target="_blank" rel="noopener noreferrer">
                    <Button color="primary" style={{ backgroundImage: "linear-gradient(to right, green , yellow)", color: "black" }}>
                      <FontAwesomeIcon icon={faSignOutAlt} /> Go to Google Drive
                    </Button>
                  </a>
                  <p style={{ paddingTop: "20px" }}>The file is also available for download via Google Drive.</p>
                </>
              )
            ) : (
              <Spinner label="Fetching link, please wait..." color="success" labelColor="success" />
            )}

            {/* Carousel arrows */}
            {contentArray.length > 1 && !isLoading && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 text-3xl text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 text-3xl text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </>
            )}
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}

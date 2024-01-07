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
import styles from "./ButtonAddSubItem.module.css";
import { Container } from "react-bootstrap";

export default function ButtonAddGroupProject() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  const [imageloader, setImageLoader] = useState();
  const [isLoading, setLoading] = useState(true);
  const [size, setSize] = React.useState("2xl");

  const handleOpen = async (size: any) => {
    setSize(size);
    onOpen();
  };
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    var formData = new FormData();
    event.preventDefault();
    formData.append("group_project", event.currentTarget.groupprojectname.value);
    formData.append("description", event.currentTarget.description.value);
    formData.append("created_by", "admin1");
    formData.append("updated_by", "admin1");

    try {
      const { data } = await axios.post(
        "/api/workspaces/group-project",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "/api/workspaces/dropdownuser"
        );
        setData(await response.data.user);
      } catch (error: any) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <>
      <Button
        key={"2xl"}
        onPress={() => handleOpen("2xl")}
        color="primary"
        variant="flat"
      >
        Add Group Project
      </Button>
      <div>
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
                Add Group Project
              </h3>
              <form onSubmit={handleSubmit}>
                {/* <!-- Contact Form --> */}
                <div className="p-6.5">
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Group Project Name <span className="text-meta-1">*</span>
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
                  className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                  color="primary"
                >
                  Add Group Project
                </Button>
              </form>
            </div>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
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
import styles from "./ButtonAddSubItem.module.css";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Flip, ToastContainer, toast } from "react-toastify";

const ButtonEditGroupProject = forwardRef(
  ({ parentFunction, tableData }, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    // const [data, setData] = useState([]);
    const [imageloader, setImageLoader] = useState();
    const [isLoadingModal, setLoadingModal] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [size, setSize] = React.useState("2xl");
    const [type, setType] = useState("text");

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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      setLoadingModal(true);
      var formData = new FormData();
      event.preventDefault();      

      formData.append("_id", tableData._id);
      formData.append("group_project", event.currentTarget.groupproject.value);
      formData.append("description", event.currentTarget.description.value);

      try {
        const { data } = await axios.post(
          "/api/workspaces/editgroupproject",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setLoadingModal(false);

        onClose();
        onClose();
        handleChildEvent();

        toast.success("Group Project Edited!", {
          autoClose: 3000,
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Flip,
          // onClose: () => handleChildEvent(),
        });
        //redirect the user to dashboard
      } catch (e) {
        setLoadingModal(false);
        const error = e as AxiosError;
        console.log(error);
        alert(error.message);
      }
    };   

    // if (isLoading)
    //   return (
    //     <Button color="default" isLoading>
    //       Loading
    //     </Button>
    //   );
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
        <button className="hover:text-warning">
          <FontAwesomeIcon
            icon={faEdit}
            key={"5xl"}
            size="xs"
            onClick={() => handleOpen("5xl")}
          />
        </button>
        <div>
          <Modal
            className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
            size={"2xl"}
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior={"outside"}
            backdrop="blur"
          >
            <ModalContent className="">
              <div className="w-full max-w-200 rounded-lg bg-white py-12 px-8 dark:bg-boxdark md:py-15 md:px-17.5">
                <h3 className="font-medium text-black dark:text-white">
                  Edit Group Project
                </h3>
                <form onSubmit={handleSubmit}>
                  {/* <!-- Contact Form --> */}
                  <div className="p-6.5">
                    <div className="mb-4.5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Group Project Name
                      </label>
                      <input
                        name="groupproject"
                        id="groupproject"
                        type="text"
                        defaultValue={tableData.group_project}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                    <div className="mb-4.5">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Description
                      </label>
                      <textarea
                        name="description"
                        rows={6}
                        defaultValue={tableData.description}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      ></textarea>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="block w-full rounded p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, green , yellow)",
                    }}
                  >
                    Edit Group Project
                  </Button>
                </form>
              </div>
            </ModalContent>
          </Modal>
          <ToastContainer />

          {/* <div         
          className="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
          style={{zIndex:1000000}}
        >
          <div style={{zIndex:1000001}} className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5">
            <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
              Your Message Sent Successfully
            </h3>
            <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
            <p className="mb-10 font-medium">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since
            </p>
            <div className="-mx-3 flex flex-wrap gap-y-4">
              <div className="w-full px-3 2xsm:w-1/2">
                <button className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1">
                  Cancel
                </button>
              </div>
              <div className="w-full px-3 2xsm:w-1/2">
                <button className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div> */}
        </div>
      </>
    );
  }
);
export default ButtonEditGroupProject;

"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import axios from "axios";

import { Metadata } from "next";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import { Button, Modal, ModalContent, Spinner } from "@nextui-org/react";
// export const metadata: Metadata = {
//   title: "Settings Page | Next.js E-commerce Dashboard Template",
//   description: "This is Settings page for TailAdmin Next.js",
//   // other metadata
// };

const Settings = () => {
  const [datas, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(""); // For success or error messages
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false); // For loading modal

  const cookies = useCookies();

  const handleShowConfirm = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    // Add your delete logic here
    setShowConfirmModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${BACKEND_PORT}users/me`, {
          headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` },
        });
        setData(data.user);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, [cookies]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setLoadingModal(false); // Hide loading modal after response
      setShowConfirmModal(false); // Close confirmation modal

      setMessage("New password and confirmation do not match.");
      return;
    }
    setLoadingModal(true); // Show loading modal

    var formData = new FormData();
    formData.append("email", datas.email);
    formData.append("password", newPassword);
    formData.append("confPassword", confirmPassword);
    formData.append("oldPassword", oldPassword);

    try {
      const response = await axios.post(
        `${BACKEND_PORT}users/change-password`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies.get(COOKIE_NAME)}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 1) {
        setMessage("Password changed successfully!");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("Error changing password, please try again.");
    } finally {
      setLoadingModal(false); // Hide loading modal after response
      setShowConfirmModal(false); // Close confirmation modal
    }
  };

  if (isLoading) return <p>Loading...</p>;
  return (
    <>
      {/* Confirmation Modal */}
      <Modal
        className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
        size={"md"}
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        scrollBehavior={"outside"}
        isDismissable={false}
        backdrop="blur"
      >
        <ModalContent className="">
          <div className="w-full max-w-200 rounded-lg bg-white py-12 px-8 dark:bg-boxdark md:py-15 md:px-17.5">
            <div className="p-6.5">
              <div className="mb-4.5">
                <div>
                  <h1 className="text-large text-center text-black dark:text-white">
                    Are you sure you want to change your password?
                  </h1>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Button
                className="rounded border text-center"
                color="danger"
                variant="flat"
                onClick={handlePasswordChange}
              >
                Confirm
              </Button>
              <Button
                className="rounded border text-center"
                color="primary"
                style={{ marginLeft: 20 }}
                onPress={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
      {/* Loading Modal */}
      <Modal
        className="sticky top-0 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
        size={"2xl"}
        isOpen={loadingModal}
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
            <Spinner
              label="Processing..."
              color="success"
              labelColor="success"
            />
          </div>
        </ModalContent>
      </Modal>

      {console.log(datas.email)}
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" titleName="Settings" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Change Password
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleShowConfirm}>
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Old Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter old password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="mb-5.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Re-type Password
                    </label>
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-95"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                  {message && <p className="mt-4 text-red-500">{message}</p>}
                </form>
              </div>
            </div>
          </div>
          {/* <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Your Photo
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full">
                      <Image
                        src={"/images/user/user-03.png"}
                        width={55}
                        height={55}
                        alt="User"
                      />
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        Edit your photo
                      </span>
                      <span className="flex gap-2.5">
                        <button className="text-sm hover:text-primary">
                          Delete
                        </button>
                        <button className="text-sm hover:text-primary">
                          Update
                        </button>
                      </span>
                    </div>
                  </div>

                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                            fill="#3C50E0"
                          />
                        </svg>
                      </span>
                      <p>
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="submit"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-95"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Settings;

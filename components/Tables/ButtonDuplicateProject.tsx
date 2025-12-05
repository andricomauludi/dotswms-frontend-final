import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Modal,
  ModalContent,
  Button,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCopy } from "@fortawesome/free-solid-svg-icons";
import { Flip, ToastContainer, toast } from "react-toastify";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import { useCookies } from "next-client-cookies";

const ButtonDuplicateProject = forwardRef(
  ({ parentFunction, tableData }, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoadingModal, setLoadingModal] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [datamonth, setDataMonth] = useState([]);
    const cookies = useCookies();
    const router = useRouter();

    const handleChildEvent = () => {
      parentFunction();
    };

    useImperativeHandle(ref, () => ({
      callParentFunction: handleChildEvent,
    }));

    const handleOpen = async (size) => {
      onOpen();
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const { data: response } = await axios.get(
            BACKEND_PORT + "workspaces/all-group-project",
            {
              headers: {
                Authorization: `Bearer ${cookies.get(COOKIE_NAME)}`,
              },
            }
          );
          setDataMonth(response.groupproject);
        } catch (error) {
          console.error("Error fetching group projects:", error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);

    const handleSubmit = async (event) => {
      event.preventDefault();
      setLoadingModal(true); // ⬅️ langsung nyalain modal loading

      const selectElement = event.currentTarget.groupprojectname;
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      const groupProject = selectedOption.getAttribute("data-group");
      const id = selectedOption.value;

      const formData = new FormData();
      formData.append("old_group_project", tableData.group_project_id);
      formData.append("old_project_id", tableData._id);
      formData.append("target_group_project_id", id);
      formData.append("target_group_project", groupProject);

      try {
        await axios.post(
          BACKEND_PORT + "workspaces/duplicate-project",
          formData,
          {
            headers: {
              Authorization: `Bearer ${cookies.get(COOKIE_NAME)}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert("Project duplicated successfully!");
        handleChildEvent();
        onClose();
      } catch (e) {
        const error = e as AxiosError;
        alert("Error duplicating project: " + error.message);

      } finally {
        setLoadingModal(false);
      }
    };

    return (
      <>
        {/* Tombol utama */}
        <button className="hover:text-primary">
          <FontAwesomeIcon
            icon={faCopy}
            size="lg"
            onClick={() => handleOpen("5xl")}
          />
        </button>

        {/* Modal utama */}
        <Modal
          className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
          size={"2xl"}
          isOpen={isOpen}
          onClose={onClose}
          scrollBehavior={"outside"}
          backdrop="blur"
        >
          <ModalContent>
            <div className="w-full max-w-200 rounded-lg bg-white py-12 px-8 dark:bg-boxdark md:py-15 md:px-17.5">
              <h3 className="font-medium text-black dark:text-white">
                Duplicate{" "}
                <b className="text-warning">{tableData.project_name}</b> to
                other month
              </h3>
              <h5 className="mt-2 block text-black dark:text-white">
                Current Month: <b>{tableData.group_project}</b>
              </h5>
              <form onSubmit={handleSubmit}>
                <div className="p-6.5">
                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Month Target
                    </label>
                    <div className="relative z-20 bg-white dark:bg-form-input">
                      <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
                        <FontAwesomeIcon icon={faCalendar} />
                      </span>
                      <select
                        name="groupprojectname"
                        defaultValue=""
                        required
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary"
                      >
                        <option value="" disabled>
                          -- Select target month --
                        </option>
                        {datamonth.map((item, key) => (
                          <option
                            key={key}
                            value={item._id}
                            data-group={item.group_project}
                          >
                            {item.group_project}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <label className="mb-3 block text-danger">
                  <b>WARNING!</b> This action is irreversible! It will duplicate{" "}
                  <b>{tableData.project_name}</b> items to the month you choose.
                  Remember to checkup again the client's name on the target
                  month to avoid <b>double data</b>.
                </label>
                <div className="flex justify-end mt-4">
                  <Button
                    type="submit"
                    disabled={isLoadingModal} // 🔒 disable tombol saat loading
                    className="rounded px-6 py-3 text-center font-medium text-black transition hover:bg-opacity-90"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, green , yellow)",
                    }}
                  >
                    {isLoadingModal ? "Duplicating..." : "Duplicate Now"}
                  </Button>
                </div>
              </form>
            </div>
          </ModalContent>
        </Modal>

        {/* Modal loading terpisah */}
        <Modal
          className="sticky top-0 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
          size="2xl"
          isOpen={isLoadingModal}
          scrollBehavior={"outside"}
          backdrop="blur"
          isDismissable={false}
          style={{ zIndex: 99999 }}
        >
          <ModalContent>
            <div
              className="text-center"
              style={{
                margin: "40px",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Spinner
                label="Duplicating Project..."
                color="success"
                labelColor="success"
              />
            </div>
          </ModalContent>
        </Modal>

        <ToastContainer />
      </>
    );
  }
);

export default ButtonDuplicateProject;

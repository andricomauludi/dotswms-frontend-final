"use client";
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
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import axios from "axios";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import { useCookies } from "next-client-cookies";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
} from "@fortawesome/free-solid-svg-icons";

// 🧩 Komponen baris tabel yang bisa di-drag
const SortableRow = ({ item, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,    
    cursor: "grab",
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
        <p className="text-black dark:text-white text-xs">{index + 1}</p>
      </td>
      <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
        <p className="text-black dark:text-white text-xs">{item.item}</p>
      </td>
      <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
       <p
                        className={`inline-flex rounded-full py-1 px-3 text-xs text-xs ${
                          item.contentcategory === "reels"
                            ? "text-white bg-primary"
                            : item.contentcategory === "tiktok"
                            ? "text-white bg-secondary"
                            : item.contentcategory === "photo"
                            ? "text-black bg-warning"
                            : item.contentcategory === "design"
                            ? "text-white bg-danger"
                            : item.contentcategory === "youtubevideo"
                            ? "text-black bg-success"
                            : "text-black bg-warning"
                        }`}
                      >
                        {item.contentcategory}
                      </p>
      </td>
      <td className="border-b border-[#eee] py-3 px-2 dark:border-strokedark">
        <p className="text-black dark:text-white text-xs">{item.lead_name}</p>
      </td>
    </tr>
  );
};

const ButtonSortTableProject = forwardRef(
  ({ parentFunction, tableData }, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const cookies = useCookies();

    useImperativeHandle(ref, () => ({
      callParentFunction: parentFunction,
    }));

    // Ambil semua table project
    const handleOpen = async () => {
      onOpen();
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${BACKEND_PORT}workspaces/all-table-project/${tableData._id}`,
          {
            headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` },
          }
        );
        setData(data.tableproject || []);
      } catch (err) {
        console.error("Error fetching table projects:", err.message);
      } finally {
        setLoading(false);
      }
    };

    const sensors = useSensors(useSensor(PointerSensor));

    // Handle drag end
    const handleDragEnd = (event) => {
      const { active, over } = event;
      if (active.id !== over?.id) {
        setData((items) => {
          const oldIndex = items.findIndex((i) => i._id === active.id);
          const newIndex = items.findIndex((i) => i._id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    };

    // Submit urutan baru
    const handleSubmit = async () => {
      try {
        const newOrder = data.map((item, index) => ({
          _id: item._id,
          order: index,
        }));

        await axios.patch(
          `${BACKEND_PORT}workspaces/update-table-project-order`,
          { project_id: tableData._id, order: newOrder },
          {
            headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` },
          }
        );

        onClose();
        parentFunction();
      } catch (err) {
        console.error("Error updating order:", err.message);
      }
    };

    return (
      <>
        <button className="hover:text-secondary" onClick={handleOpen}>
          <FontAwesomeIcon icon={faList} size="lg" />
        </button>

        <Modal size="3xl" isOpen={isOpen} onClose={onClose} backdrop="blur">
          <ModalContent>
            <div className="w-full rounded-lg bg-white py-8 px-6 dark:bg-boxdark">
              <h3 className="mb-1 font-semibold text-black dark:text-white">
                Sort Table Project
              </h3>
              <p className="mb-6 font-semibold text-black dark:text-white">
                Drag the row to the target order
              </p>

              {isLoading ? (
                <div className="flex justify-center">
                  <Spinner label="Loading..." color="success" />
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={data.map((item) => item._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <table className="w-full sm:table-auto">
                      <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                          <th className="py-2 px-2 text-xs text-black dark:text-white xl:pl-4">
                            #
                          </th>
                          <th className="py-2 px-2 text-xs text-black dark:text-white xl:pl-4">
                            Item
                          </th>
                          <th className="py-2 px-2 text-xs text-black dark:text-white xl:pl-4">
                            Category
                          </th>
                          <th className="py-2 px-2 text-xs text-black dark:text-white xl:pl-4">
                            Lead
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((item, index) => (
                          <SortableRow
                            key={item._id}
                            item={item}
                            index={index}
                          />
                        ))}
                      </tbody>
                    </table>
                  </SortableContext>
                </DndContext>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <Button color="default" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="success"
                  onPress={handleSubmit}
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, green , yellow)",
                  }}
                >
                  Save Order
                </Button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      </>
    );
  }
);

export default ButtonSortTableProject;

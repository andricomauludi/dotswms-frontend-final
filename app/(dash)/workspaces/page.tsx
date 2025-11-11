"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ButtonAddGroupProject from "@/components/Tables/ButtonAddGroupProject";
import ButtonDeleteGroupProject from "@/components/Tables/ButtonDeleteGroupProject";
import ButtonEditGroupProject from "@/components/Tables/ButtonEditGroupProject";
import TableProject from "@/components/Tables/TableProject";
import { useCookies } from "next-client-cookies";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";

const WorkspacePage = () => {
  const cookies = useCookies();
  const childRef = useRef(null);
  const [datas, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [triggerApiCall, setTriggerApiCall] = useState(true);
  const [selectedOption, setSelectedOption] = useState(new Set([0]));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: response } = await axios.get(
          BACKEND_PORT + "workspaces/all-group-project",
          { headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` } }
        );
        setData(response.groupproject);
      } catch (error: any) {
        console.error(error.message);
      }
      setLoading(false);
    };

    if (triggerApiCall) {
      fetchData();
      setTriggerApiCall(false);
    }
  }, [triggerApiCall]);

  const handleParentFunction = () => setTriggerApiCall(true);

  if (isLoading) return <p>Loading...</p>;
  if (!datas || datas.length === 0)
    return (
      <>
        <h1>Add Group Project</h1>
        <ButtonAddGroupProject
          ref={childRef}
          parentFunction={handleParentFunction}
        />
      </>
    );

  const selectedOptionValue = Array.from(selectedOption)[0];
  const selectedGroup = datas[selectedOptionValue];

  return (
    <>
      <Breadcrumb
        pageName="Workspaces"
        titleName={selectedGroup?.group_project || "No Group Project Selected"}
      />
      <div className="mb-6 flex">
        <ButtonEditGroupProject
          ref={childRef}
          parentFunction={handleParentFunction}
          tableData={selectedGroup}
        />
        <div className="ml-2">
          <ButtonDeleteGroupProject
            ref={childRef}
            parentFunction={handleParentFunction}
            tableData={selectedGroup}
          />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="text-left">
          <ButtonGroup variant="flat">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button>
                  {selectedGroup?.group_project || "No Group Project"}
                  <svg
                    fill="none"
                    height="14"
                    viewBox="0 0 24 24"
                    width="14"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
                      fill="currentColor"
                    />
                  </svg>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Select Group Project"
                selectedKeys={selectedOption}
                selectionMode="single"
                onSelectionChange={setSelectedOption}
                className="max-w-[300px]"
              >
                {datas.map((item, key) => (
                  <DropdownItem key={key} description={item.description}>
                    {item.group_project}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
          <ButtonAddGroupProject
            ref={childRef}
            parentFunction={handleParentFunction}
          />
        </div>

        {/* ✅ Re-render TableProject setiap group project berubah */}
        <TableProject key={selectedGroup._id} tableData={selectedGroup} />
      </div>
    </>
  );
};

export default WorkspacePage;

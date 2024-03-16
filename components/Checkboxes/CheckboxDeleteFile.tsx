"use client";
import { useEffect, useState } from "react";
import React from "react";
import { CheckboxGroup, Checkbox, Button } from "@nextui-org/react";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import { useCookies } from "next-client-cookies";
import axios from "axios";

export default function CheckboxDeleteFile({itemId, sendDataToParent}:any) {
  const cookies = useCookies();

  const [selected, setSelected] = React.useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          BACKEND_PORT + "workspaces/content-posting/" + itemId,
          { headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` } }
        );
        setData(await data.contentPosting);
      } catch (error: any) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, [itemId]);

  sendDataToParent(selected);

  

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;
  

  return (
    <div className="flex flex-col gap-3">
      <CheckboxGroup
        label="Select files want to delete"
        color="danger"
        value={selected}      
        onValueChange={setSelected}
      >
        {data.map((packageItem: any, key) => (
          <>
            <Checkbox value={packageItem._id}>{packageItem.file_name}</Checkbox>                        
          </>
        ))}
      </CheckboxGroup>
      {/* <Button color="danger" onClick={() => {
              sendDataToParent(selected.join(", "));
            }} >
              Delete
            </Button> */}
      <p className="text-default-500 text-small">
        Files want to delete: {selected.join(", ")}
      </p>
    </div>
  );
}

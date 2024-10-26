"use client";
import { useEffect, useState } from "react";
import React from "react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { BACKEND_PORT, COOKIE_NAME } from "@/constants";
import { useCookies } from "next-client-cookies";
import axios from "axios";

export default function CheckboxDeleteFile({ itemId, sendDataToParent }: any) {
  const cookies = useCookies();

  const [selected, setSelected] = React.useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BACKEND_PORT}workspaces/content-posting/${itemId}`,
          { headers: { Authorization: `Bearer ${cookies.get(COOKIE_NAME)}` } }
        );
        setData(response.data.contentPosting);
      } catch (error: any) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, [itemId]);

  // Send the selected IDs to the parent component
  useEffect(() => {
    sendDataToParent(selected);
  }, [selected]);

  if (isLoading) return <p>Loading...</p>;
  if (!data || data.length === 0) return <p>No Image</p>;

  return (
    <div className="flex flex-col gap-3">
      <CheckboxGroup
        label="Select files you want to delete"
        color="danger"
        value={selected}
        onValueChange={setSelected}
      >
        {data.map((packageItem: any) => (
          <Checkbox key={packageItem._id} value={packageItem._id}>
            {packageItem.file_name_real}
          </Checkbox>
        ))}
      </CheckboxGroup>
      <p className="text-default-500 text-small">
        Files you want to delete: {selected.map(id => {
          const item = data.find(pkg => pkg._id === id);
          return item ? item.file_name_real : null;
        }).join(", ")}
      </p>
    </div>
  );
}

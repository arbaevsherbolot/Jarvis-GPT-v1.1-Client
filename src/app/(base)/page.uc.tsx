"use client";

import React, { useEffect, useState } from "react";
import * as API from "@/../api";
import { errorNotification } from "@/lib/utils/notification";

export default function HomeClient() {
  const [me, setMe] = useState<User | null>(null);

  const getMe = async () => {
    try {
      const data: User = await API.auth.getMe();

      if (data) {
        setMe(data);
      }
    } catch (e: any) {
      errorNotification("Something went wrong");
      console.error(e);
    }
  };

  useEffect(() => {
    getMe();
  }, [getMe]);

  return (
    <>
      <div>
        {me ? (
          <p>Hi {me.firstName}, it turns out you're in {me.location[0].city} 😯</p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}
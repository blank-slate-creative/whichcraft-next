"use client";

import UserMenu from "./UserMenu";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function NavbarClient() {
  const [userName, setUserName] = useState("User");
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserName(session.user.email.split("@")[0]);
      }
    };

    getUser();
  }, [supabase]);

  return (
    <div className="flex items-center gap-4">
      <UserMenu userName={userName} />
    </div>
  );
}

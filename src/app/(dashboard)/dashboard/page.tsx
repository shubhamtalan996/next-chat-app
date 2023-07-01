import Button from "@/components/UI/Button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React, { FC } from "react";

interface DashboardProps {}

const Dashboard = async ({}) => {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <Button>Dasboard</Button>
      {/* <pre>{JSON.stringify(session)}</pre> */}
    </div>
  );
};

export default Dashboard;

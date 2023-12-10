"use client";

import React, { useContext, useEffect, useState } from "react";
import { createUser, getActiveRide, getUser } from "./services";
import { generateUUID } from "./utils";
import { Card, Skeleton, Typography, message } from "antd";
import StandardContent from "./components/StantardContent";
import AskRide from "./components/AskRide";
import OnGoingRide from "./components/OnGoingRide";
import { Context } from "./context";
import { Status } from "./constants";

const { Title } = Typography;

const Home = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setActiveRide, setUser, user, getUser, activeRide } = useContext(Context);

  const fetchUser = async (userId: string) => {
    setLoading(true);
    try {
      setUser(await getUser());

      const response = await getActiveRide(userId);
      setActiveRide(response);
    } catch (error) {
      message.error("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const createNewUser = async () => {
    setLoading(true);
    try {
      const newUserId = generateUUID();
      localStorage.setItem("userId", newUserId);

      const newUser = await createUser({
        id: newUserId,
        userType: "rider",
      });

      setUser(newUser);
    } catch (error) {
      message.error("Failed to create new user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const activeId = localStorage.getItem("userId");

    if (!activeId) {
      createNewUser();
    }

    fetchUser(activeId!);
  }, []);

  const hasActiveRide = activeRide && activeRide.status === Status.Pending;

  if (loading || !user) {
    return (
      <StandardContent>
        <div
          style={{
            padding: "0 50px",
            alignContent: "center",
          }}
        >
          <Card style={{ padding: "0 50px", marginTop: 64 }}>
            <div style={{ background: "#fff", padding: 24, minHeight: 380, textAlign: "center" }}>
              <Title level={2} style={{ marginBottom: 100 }} ellipsis>
                Welcome, Rider!
              </Title>
              <Skeleton active />
            </div>
          </Card>
        </div>
      </StandardContent>
    );
  }

  return (
    <StandardContent>
      <div
        style={{
          padding: "0 50px",
          alignContent: "center",
        }}
      >
        <Card style={{ padding: "0 50px", marginTop: 64 }}>
          <div style={{ background: "#fff", padding: 24, minHeight: 380, textAlign: "center" }}>
            <Title level={2} style={{ marginBottom: 100 }} ellipsis>
              Welcome, Rider!
            </Title>
            {hasActiveRide ? <OnGoingRide /> : <AskRide />}
          </div>
        </Card>
      </div>
    </StandardContent>
  );
};

export default Home;

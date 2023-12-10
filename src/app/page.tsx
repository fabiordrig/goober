"use client";

import React, { useEffect, useState } from "react";
import { createUser, getActiveRide, getUser } from "./services";
import { generateUUID } from "./utils";
import { User } from "./types";
import { Card, Skeleton, Typography, message } from "antd";
import StandardContent from "./components/StantardContent";
import AskRide from "./components/AskRide";
import OnGoingRide from "./components/OnGoingRide";

const { Title } = Typography;

const Home = () => {
  const [user, setUser] = useState<User>();
  const [userId, setUserId] = useState<string | null>();
  const [hasActiveRide, setHasActiveRide] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUser = async (userId: string) => {
    setLoading(true);
    try {
      setUser(await getUser(userId));

      const activeRide = await getActiveRide(userId);

      setHasActiveRide(!!activeRide);
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
      setUserId(newUserId);
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

  if (loading) {
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

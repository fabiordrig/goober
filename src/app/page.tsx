"use client";

import React, { useEffect, useState } from "react";
import { createUser, getUser } from "./services";
import { generateUUID } from "./utils";
import { User } from "./types";
import { Button, Card, Form, Typography, message } from "antd";
import RiderDrawer from "./components/RiderDrawer";
import StandardContent from "./components/StantardContent";

const { Title } = Typography;

const Home = () => {
  const [user, setUser] = useState<User>();
  const [userId, setUserId] = useState<string | null>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();

  const [form] = Form.useForm();

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          message.error("Error getting the location");
        },
      );
    } else {
      message.error("Geolocation is not supported by this browser.");
    }
  };

  const fetchUser = async () => {
    if (!userId) {
      return;
    }
    setUser(await getUser(userId));
  };

  const createNewUser = async () => {
    const newUserId = generateUUID();
    localStorage.setItem("userId", newUserId);
    setUserId(newUserId);
    const newUser = await createUser({
      id: newUserId,
      userType: "rider",
    });

    setUser(newUser);
  };

  useEffect(() => {
    const activeId = localStorage.getItem("userId");

    if (!activeId) {
      createNewUser();
    }

    fetchUser();
    getLocation();
  }, []);

  console.log(userLocation);
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
            <Button
              type="primary"
              onClick={() => setDrawerVisible(true)}
              style={{ marginBottom: 20 }}
            >
              Ask for Ride
            </Button>
            <RiderDrawer open={drawerVisible} onClose={() => setDrawerVisible(false)} form={form} />
          </div>
        </Card>
      </div>
    </StandardContent>
  );
};

export default Home;

"use client";

import React, { useContext, useEffect, useState } from "react";
import { createUser, getActiveRide } from "./services";
import { generateUUID } from "./utils";
import { Button, Card, Col, Row, Skeleton, Typography, message } from "antd";
import StandardContent from "./components/StantardContent";
import AskRide from "./components/AskRide";
import OnGoingRide from "./components/OnGoingRide";
import { Context } from "./context";
import { Status } from "./constants";
import ScheduleRideModal from "./components/ScheduleModal";

const { Title } = Typography;

const Home = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { setActiveRide, setUser, user, getUser, activeRide } = useContext(Context);

  const handleGetNextRide = async (userId: string) => {
    try {
      const response = await getActiveRide(user?.id ?? userId);

      if (response.status === Status.Cancelled) {
        setActiveRide();

        message.warning("Ride canceled by the driver");
        return;
      }

      setActiveRide(response);
    } catch (error) {
      message.error("Failed to fetch active ride");
    }
  };

  const fetchUser = async (userId: string) => {
    setLoading(true);
    try {
      setUser(await getUser());

      handleGetNextRide(userId);
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

  useEffect(() => {
    const activeId = localStorage.getItem("userId");
    const intervalId = setInterval(() => {
      handleGetNextRide(activeId ?? user!.id);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const hasActiveRide =
    activeRide?.id &&
    activeRide.status !== Status.Cancelled &&
    activeRide.status !== Status.Completed;

  if (loading || !user) {
    return (
      <StandardContent>
        <Row justify="center">
          <Col xs={20} sm={18} md={16} lg={12} xl={10}>
            <Card style={{ marginTop: 64 }}>
              <div style={{ background: "#fff", padding: 24, minHeight: 380, textAlign: "center" }}>
                <Title level={2} style={{ marginBottom: 100 }} ellipsis>
                  Welcome, Rider!
                </Title>
                <Skeleton active />
              </div>
            </Card>
          </Col>
        </Row>
      </StandardContent>
    );
  }

  return (
    <StandardContent>
      <Row justify="center">
        <Col xs={24} sm={18} md={16} lg={12} xl={10}>
          <Card
            style={{ marginTop: 64 }}
            extra={
              !hasActiveRide && (
                <Button type="primary" onClick={() => setOpen(true)}>
                  Schedule a ride
                </Button>
              )
            }
          >
            <div style={{ background: "#fff", padding: 24, minHeight: 380, textAlign: "center" }}>
              <Title level={2} style={{ marginBottom: 100 }}>
                Welcome, Rider!
              </Title>
              {hasActiveRide ? <OnGoingRide /> : <AskRide />}
              <ScheduleRideModal open={open} onClose={() => setOpen(false)} />
            </div>
          </Card>
        </Col>
      </Row>
    </StandardContent>
  );
};

export default Home;

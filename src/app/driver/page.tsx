"use client";

import { FC, useContext, useEffect, useState } from "react";
import { Avatar, Card, Form, Skeleton, Space, Spin, Typography, message } from "antd";
import StandardContent from "../components/StantardContent";
import DriverDrawer from "../components/DriverDrawer";
import { UserOutlined } from "@ant-design/icons";
import { acceptRide, getDriver, getNextRide } from "../services";
import { DriverRide, NewDriver } from "../types";
import { generateUUID } from "../utils";
import { Context } from "../context";
import NewDriverForm, { NewDriverFormValues } from "../components/NewDriverForm";
import DriverOnGoingRide from "../components/DriverRideOnGoing";
import { Status } from "../constants";

const { Text, Title } = Typography;

const Page: FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [driveRide, setDriverRide] = useState<DriverRide>();
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm<NewDriverFormValues>();

  const { driver, setDriver, createDriver } = useContext(Context);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>();

  const createNewDriver = async (formValues: NewDriverFormValues) => {
    setLoading(true);
    try {
      await form.validateFields();
      const newUserId = generateUUID();
      localStorage.setItem("userId", newUserId);

      const payload: NewDriver = {
        ...formValues,
        id: newUserId,
        userType: "driver",
        year: Number(formValues.year.format("YYYY")),
      };

      await createDriver(payload);
    } catch (error) {
      message.error("Failed to create new driver");
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.error("Error getting the location");
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleGetNextRide = async () => {
    if (userLocation && driver) {
      if (driveRide?.status === Status.Cancelled) {
        message.warning("Ride canceled by the rider");
        return;
      }
      setDriverRide(await getNextRide(userLocation, driver.id));
    }
  };

  const handleGetDriver = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        return;
      }

      setDriver(await getDriver(userId));
    } catch (error) {
      message.error("Failed to fetch driver");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
    handleGetDriver();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleGetNextRide();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [userLocation]);

  useEffect(() => {
    if (driveRide && driveRide.status === "pending") {
      setOpen(true);
    }
  }, [driveRide]);

  const handleAcceptRide = async () => {
    if (!driveRide || !driver) {
      return;
    }
    try {
      await acceptRide(driver.id, driveRide.riderId);
      setOpen(false);
      message.success("Ride accepted");
    } catch (error) {
      message.error("Failed to accept ride");
    }
  };

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
                Welcome, Driver!
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
            <Title level={2} style={{ marginBottom: 50 }} ellipsis>
              Welcome, Driver!
            </Title>
            {driver ? (
              <Space direction="vertical" size="large">
                <Avatar size={64} icon={<UserOutlined />} />
                {driveRide?.id ? (
                  <DriverOnGoingRide driverRide={driveRide} refetch={handleGetNextRide} />
                ) : (
                  <>
                    <Space size="large">
                      <Spin />
                      <Text type="secondary">Waiting for the next ride </Text>
                    </Space>
                  </>
                )}
              </Space>
            ) : (
              <NewDriverForm form={form} onFinish={createNewDriver} />
            )}
            <DriverDrawer
              open={open}
              onClose={() => setOpen(false)}
              driverRide={driveRide}
              onAccept={handleAcceptRide}
            />
          </div>
        </Card>
      </div>
    </StandardContent>
  );
};

export default Page;

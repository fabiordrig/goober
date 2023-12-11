"use client";

import { FC, use, useContext, useEffect, useState } from "react";
import { Avatar, Button, Card, Form, Skeleton, Space, Spin, Typography, message } from "antd";
import StandardContent from "../components/StantardContent";
import DriverDrawer from "../components/DriverDrawer";
import { UserOutlined } from "@ant-design/icons";
import { acceptRide, getDriver, getNextRide } from "../services";
import { DriverRide, NewDriver } from "../types";
import { generateUUID } from "../utils";
import { Context } from "../context";
import NewDriverForm, { NewDriverFormValues } from "../components/NewDriverForm";

const { Text, Title } = Typography;

const Page: FC = () => {
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

  const handleAcceptRide = async () => {
    if (!driveRide || !driver) {
      return;
    }
    try {
      await acceptRide(driver.id, driveRide.riderId);
      setDriverRide(undefined);
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
                <Space>
                  <Text strong>Total rides: </Text>1
                </Space>
                <Space>
                  <Text strong>Total earned: </Text>$1
                </Space>

                <Space size="large">
                  <Spin />
                  <Text type="secondary">Waiting for the next ride </Text>
                </Space>
              </Space>
            ) : (
              <NewDriverForm form={form} onFinish={createNewDriver} />
            )}
            {driveRide?.id && (
              <DriverDrawer
                open={!!driveRide}
                onClose={() => setDriverRide(undefined)}
                driverRide={driveRide}
                onAccept={handleAcceptRide}
              />
            )}
          </div>
        </Card>
      </div>
    </StandardContent>
  );
};

export default Page;

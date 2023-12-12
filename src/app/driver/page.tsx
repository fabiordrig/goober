"use client";

import { FC, useContext, useEffect, useState } from "react";
import { Avatar, Card, Col, Form, Row, Skeleton, Space, Spin, Typography, message } from "antd";
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
      localStorage.setItem("driverId", newUserId);

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
    if (userLocation && driver?.id) {
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
      const userId = localStorage.getItem("driverId");

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
  }, [userLocation, driver]);

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
      handleGetNextRide();
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
      <Row justify="center">
        <Col xs={20} sm={18} md={16} lg={12} xl={10}>
          <Card style={{ marginTop: 64 }}>
            <div style={{ background: "#fff", textAlign: "center" }}>
              <Title level={2} style={{ marginBottom: 50 }}>
                Welcome, Driver!
              </Title>
              {driver ? (
                <Space direction="vertical" size="large">
                  <Avatar size={64} icon={<UserOutlined />} />
                  {driveRide?.acceptedAt ? (
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
        </Col>
      </Row>
    </StandardContent>
  );
};

export default Page;

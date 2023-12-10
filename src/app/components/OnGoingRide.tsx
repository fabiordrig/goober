import { FC, useContext, useEffect, useState } from "react";
import { Button, Avatar, Typography, Space, Spin, message, Popconfirm } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Driver, Ride } from "../types";
import { cancelRide, getActiveRide, getDriver, getETA } from "../services";
import { Status } from "../constants";
import { Context } from "../context";

const { Text } = Typography;

const OnGoingRide: FC = () => {
  const [activeRide, setActiveRide] = useState<Ride>();
  const [driver, setDriver] = useState<Driver>();
  const [driverAccepted, setDriverAccepted] = useState<boolean>(false);
  const [eta, setEta] = useState<number>(1);

  const context = useContext(Context);

  const handleActiveRide = async () => {
    try {
      if (!context.activeRide) {
        const ride = await context.getActiveRide(context.user!.id);
        setActiveRide(ride);
        if (ride.status === Status.Accepted && !driver) {
          setDriver(await getDriver(ride.driverId));
          setDriverAccepted(true);
          setEta(await getETA(ride.id));
        }
      }
    } catch (error) {
      message.error("Failed to fetch active ride");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleActiveRide();
    }, 7000);

    return () => clearInterval(intervalId);
  }, []);

  const handleCancelRide = async () => {
    try {
      await cancelRide(context.activeRide!.id);
      message.success("Ride canceled");
      setDriverAccepted(false);
      await context.setActiveRide();
    } catch (error) {
      message.error("Failed to cancel ride");
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ textAlign: "center" }}>
      {driverAccepted ? (
        <>
          <Avatar size={64} icon={<UserOutlined />} />
          <Text strong>Color: {driver?.color}</Text>
          <Text strong>Plate: {driver?.licensePlate}</Text>
          <Text type="success">ETA: {eta} minutes</Text>
        </>
      ) : (
        <>
          <Spin />
          <Text type="secondary">Waiting for driver to accept the ride...</Text>
        </>
      )}
      <Popconfirm
        title="Are you sure to cancel this ride?"
        onConfirm={handleCancelRide}
        okText="Wait for driver"
        cancelText="No"
      >
        <Button type="primary" danger size="large" block>
          Cancel Ride
        </Button>
      </Popconfirm>
    </Space>
  );
};

export default OnGoingRide;

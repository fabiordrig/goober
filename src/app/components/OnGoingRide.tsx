import { FC, useEffect, useState } from "react";
import { Button, Avatar, Typography, Space, Spin, message, Popconfirm } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Driver, Ride } from "../types";
import { getActiveRide, getDriver, getETA } from "../services";
import { Status } from "../constants";

const { Text } = Typography;

const OnGoingRide: FC<{ driverAccepted?: boolean }> = ({ driverAccepted }) => {
  const [activeRide, setActiveRide] = useState<Ride>();
  const [driver, setDriver] = useState<Driver>();
  const [eta, setEta] = useState<number>();

  const handleActiveRide = async () => {
    try {
      const activeId = localStorage.getItem("userId");
      const ride = await getActiveRide(activeId!);

      if (ride.status === Status.Accepted && !driver) {
        setDriver(await getDriver(ride.driverId));

        setEta(await getETA(ride.id));
      }

      setActiveRide(activeRide);
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

  const cancelRide = () => {};

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
        onConfirm={cancelRide}
        okText="Yes"
        cancelText="No"
      >
        <Button type="primary" danger size="large" block onClick={cancelRide}>
          Cancel Ride
        </Button>
      </Popconfirm>
    </Space>
  );
};

export default OnGoingRide;

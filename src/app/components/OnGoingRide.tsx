import { FC, useContext, useEffect, useState } from "react";
import { Button, Avatar, Typography, Space, Spin, message, Popconfirm } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { cancelRide, getDriver, getETA } from "../services";
import { Status } from "../constants";
import { Context } from "../context";

const { Text } = Typography;

const OnGoingRide: FC = () => {
  const [eta, setEta] = useState<number>(0);
  const { activeRide, setActiveRide, getActiveRide, driver, setDriver, user } = useContext(Context);

  const handleActiveRide = async () => {
    try {
      if (!activeRide) {
        const ride = await getActiveRide(user!.id);
        setActiveRide(ride);
      }
    } catch (error) {
      message.error("Failed to fetch active ride");
    }
  };

  const handleSetEta = async () => {
    setEta(await getETA(activeRide!.id));
    setDriver(await getDriver(activeRide!.driverId));
  };

  useEffect(() => {
    handleSetEta();
  }, [activeRide]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleActiveRide();
    }, 7000);

    return () => clearInterval(intervalId);
  }, []);

  const hasActiveRide = activeRide?.status === Status.Accepted;

  const handleCancelRide = async () => {
    try {
      await cancelRide(activeRide!.id);
      message.success("Ride canceled");
      await setActiveRide();
    } catch (error) {
      message.error("Failed to cancel ride");
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ textAlign: "center" }}>
      {hasActiveRide ? (
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
        okText="Yes"
        okButtonProps={{ danger: true }}
        cancelText="Wait for driver"
      >
        <Button type="primary" danger size="large" block>
          Cancel Ride
        </Button>
      </Popconfirm>
    </Space>
  );
};

export default OnGoingRide;

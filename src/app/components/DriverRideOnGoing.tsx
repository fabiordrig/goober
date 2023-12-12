import { Button, Popconfirm, Space, Typography, message } from "antd";
import { FC, useContext } from "react";
import { DriverRide } from "@/app/types";
import { cancelDriverRide, completeRide, startRide } from "../services";
import { Context } from "../context";

const { Text } = Typography;

const DriverOnGoingRide: FC<{ driverRide: DriverRide; refetch: () => Promise<void> }> = ({
  driverRide,
  refetch,
}) => {
  const { setActiveRide } = useContext(Context);

  const handleCancelRide = async () => {
    try {
      await cancelDriverRide(driverRide.driverId, driverRide.riderId);
      message.success("Ride canceled");
      setActiveRide();
      await refetch();
    } catch (error) {
      message.error("Failed to cancel ride");
    }
  };

  const handleFinishRide = async () => {
    try {
      await completeRide(driverRide.driverId, driverRide.riderId);
      message.success("Ride finished");
      setActiveRide();
      await refetch();
    } catch (error) {
      message.error("Failed to finish ride");
    }
  };

  const handleStartRide = async () => {
    try {
      await startRide(driverRide.driverId, driverRide.riderId);
      message.success("Ride started");
      await refetch();
    } catch (error) {
      message.error("Failed to start ride");
    }
  };

  const isRideAccepted = !!driverRide.acceptedAt && !driverRide.startedAt;

  return (
    <Space direction="vertical" size="large">
      <Text strong>Pickup: {driverRide.pickupLocation}</Text>
      <Text strong>Destination: {driverRide.dropoffLocation}</Text>
      <Text strong>Price: ${driverRide.price.toFixed(2)}</Text>
      {isRideAccepted ? (
        <Popconfirm
          title={`Are you sure to start this ride?`}
          onConfirm={handleStartRide}
          okText="Yes"
          cancelText="No"
          overlayStyle={{ maxWidth: 400 }}
        >
          <Button type="primary" size="large" block>
            Start Ride
          </Button>
        </Popconfirm>
      ) : (
        <Popconfirm
          title={`Are you sure to complete this ride? Don't forget to collect the money! Price: $ ${driverRide.price.toFixed(
            2,
          )}`}
          onConfirm={handleFinishRide}
          okText="Yes"
          cancelText="No"
          overlayStyle={{ maxWidth: 400 }}
        >
          <Button type="primary" size="large" block>
            Finish Ride
          </Button>
        </Popconfirm>
      )}
      <Popconfirm
        title="Are you sure to cancel this ride?"
        onConfirm={handleCancelRide}
        okText="Yes"
        okButtonProps={{ danger: true }}
        cancelText="No"
      >
        <Button type="primary" danger size="large" block>
          Cancel Ride
        </Button>
      </Popconfirm>
    </Space>
  );
};

export default DriverOnGoingRide;

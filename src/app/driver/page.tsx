import { FC } from "react";
import { Button, Typography } from "antd";

const { Text } = Typography;

const RideRequestCard: FC = () => {
  return (
    <>
      <Text strong>Ride Request</Text>
      <p>Pickup Location: teste</p>
      <p>Dropoff Location:bla</p>
      <Button type="primary">Accept Ride</Button>
    </>
  );
};

export default RideRequestCard;

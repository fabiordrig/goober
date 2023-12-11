"use client";

import { Button, Drawer, Space, Typography } from "antd";
import { FC } from "react";
import { DriverRide } from "../types";

const DriverDrawer: FC<{
  open: boolean;
  onClose: () => void;
  driverRide?: DriverRide;
  onAccept: () => void;
}> = ({ open, onClose, driverRide, onAccept }) => {
  return (
    <Drawer
      title="New Ride"
      placement="bottom"
      onClose={onClose}
      closable={false}
      open={open}
      size="large"
    >
      <Space direction="vertical" size="large">
        <Typography.Title level={3}>Do you want to accept this ride?</Typography.Title>

        <Space direction="vertical" style={{ width: "100%" }}>
          <Typography.Title level={4}>Pickup</Typography.Title>
          <Typography.Text>{driverRide?.pickupLocation}</Typography.Text>
        </Space>
        <Space direction="vertical">
          <Typography.Title level={4}>Dropoff</Typography.Title>
          <Typography.Text>{driverRide?.dropoffLocation}</Typography.Text>
        </Space>
        <Space size="large" style={{ width: "100%" }}>
          <Button
            type="primary"
            block
            size="large"
            onClick={() => {
              onAccept();
            }}
          >
            Accept
          </Button>
          <Button type="primary" danger block size="large" onClick={onClose}>
            Decline
          </Button>
        </Space>
      </Space>
    </Drawer>
  );
};

export default DriverDrawer;

"use client";

import {
  Button,
  Drawer,
  Form,
  FormInstance,
  Input,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import { FC, useEffect, useState } from "react";
import { GeofinderLocation } from "../types";
import { calculateFare, getLocations, requestRide } from "../services";
import { useDebouncer } from "../utils";

type FormValuesType = {
  pickupLocation: string;
  dropoffLocation: string;
};

const RiderDrawer: FC<{
  open: boolean;
  onClose: () => void;
  form: FormInstance<FormValuesType>;
}> = ({ open, onClose, form }) => {
  const [pickUpLocations, setPickUpLocations] = useState<GeofinderLocation[]>([]);
  const [dropOffLocations, setDropOffLocations] = useState<GeofinderLocation[]>([]);
  const [estimatedFare, setEstimatedFare] = useState<number>();

  const pickupLocationAddress = Form.useWatch("pickupLocation", form);
  const dropoffLocationAddress = Form.useWatch("dropoffLocation", form);

  const debouncer = useDebouncer();

  const fetchLocations = async (
    value: string,
    setLocation: (locations: GeofinderLocation[]) => void,
  ) => {
    setLocation(await getLocations(value));
  };

  const handleCalculateFare = async () => {
    if (pickupLocationAddress && dropoffLocationAddress) {
      const pickupLocation = pickUpLocations.find(
        (location) => location.address === pickupLocationAddress,
      );
      const dropoffLocation = dropOffLocations.find(
        (location) => location.address === dropoffLocationAddress,
      );

      setEstimatedFare(await calculateFare(pickupLocation!, dropoffLocation!));
    }
  };

  useEffect(() => {
    handleCalculateFare();
  }, [pickupLocationAddress, dropoffLocationAddress]);

  const onFinish = async () => {
    try {
      const riderId = localStorage.getItem("userId")!;

      const pickupLocation = pickUpLocations.find(
        (location) => location.address === pickupLocationAddress,
      )!;
      const dropoffLocation = dropOffLocations.find(
        (location) => location.address === dropoffLocationAddress,
      )!;

      await requestRide(riderId, pickupLocation, dropoffLocation, estimatedFare!);
      message.success("Your ride has been requested. Please wait for a driver to accept.");
      onClose();
    } catch (error) {
      message.error("An error occurred while requesting your ride");
    }
  };

  const disabled = !pickupLocationAddress || !dropoffLocationAddress || !estimatedFare;

  return (
    <Drawer
      title="Request a Ride"
      placement="bottom"
      closable={false}
      onClose={onClose}
      open={open}
    >
      <Form layout="vertical" form={form} requiredMark={false} onFinish={onFinish}>
        <Form.Item
          name="pickupLocation"
          label="Pickup Location"
          rules={[{ required: true, message: "Please enter your pickup location" }]}
        >
          <Select
            placeholder="Enter pickup location"
            onSearch={(value) =>
              debouncer.setCallback(() => fetchLocations(value, setPickUpLocations))
            }
            showSearch
            options={pickUpLocations.map((location) => ({
              label: location.address,
              value: location.address,
            }))}
            notFoundContent={null}
          />
        </Form.Item>
        <Form.Item
          name="dropoffLocation"
          label="Dropoff Location"
          rules={[{ required: true, message: "Please enter your dropoff location" }]}
        >
          <Select
            placeholder="Enter dropoff location"
            onSearch={(value) =>
              debouncer.setCallback(() => fetchLocations(value, setDropOffLocations))
            }
            showSearch
            options={dropOffLocations.map((location) => ({
              label: location.address,
              value: location.address,
            }))}
            notFoundContent={null}
          />
        </Form.Item>
        <Space
          direction="vertical"
          size="large"
          style={{
            width: "100%",
          }}
        >
          {estimatedFare && (
            <Typography.Text
              type="secondary"
              style={{
                marginBottom: 20,
              }}
            >
              Estimated Fare:{" "}
              <Typography.Text type="success">${estimatedFare.toFixed(2)}</Typography.Text>
            </Typography.Text>
          )}
          <Button type="primary" htmlType="submit" block size="large" disabled={disabled}>
            Request Ride
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
};

export default RiderDrawer;

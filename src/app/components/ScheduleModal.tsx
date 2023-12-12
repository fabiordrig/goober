import React, { FC, useState } from "react";
import { Modal, Button, Form, TimePicker, Select, message } from "antd";
import { useDebouncer } from "../utils";
import { GeofinderLocation } from "../types";
import { createSchedule, getLocations } from "../services";
import { Dayjs } from "dayjs";

type FormValues = {
  date: string;
  time: Dayjs;
  pickupLocation: string;
  dropoffLocation: string;
};

const ScheduleRideModal: FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [form] = Form.useForm<FormValues>();
  const [pickUpLocations, setPickUpLocations] = useState<GeofinderLocation[]>([]);
  const [dropOffLocations, setDropOffLocations] = useState<GeofinderLocation[]>([]);

  const handleSubmit = async (values: FormValues) => {
    try {
      const pickupLocation = pickUpLocations.find(
        (location) => location.address === values.pickupLocation,
      );
      const dropoffLocation = dropOffLocations.find(
        (location) => location.address === values.dropoffLocation,
      );

      const time = values.time.format("HH:mm:ss");

      const userId = localStorage.getItem("userId");

      await createSchedule(userId!, time, values.date, pickupLocation!, dropoffLocation!);

      onClose();
      form.resetFields();
      message.success("Ride scheduled successfully");
    } catch (error) {
      message.error("Failed to schedule ride");
    }
  };

  const fetchLocations = async (
    value: string,
    setLocation: (locations: GeofinderLocation[]) => void,
  ) => {
    setLocation(await getLocations(value));
  };

  const debouncer = useDebouncer();

  return (
    <Modal
      title="Schedule a Ride"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Schedule
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="date" label="Date" rules={[{ required: true }]}>
          <Select
            placeholder="Select day"
            showSearch
            size="large"
            style={{ width: "100%" }}
            options={[
              { label: "Sunday", value: "Sunday" },
              { label: "Monday", value: "Monday" },
              { label: "Tuesday", value: "Tuesday" },
              { label: "Wednesday", value: "Wednesday" },
              { label: "Thursday", value: "Thursday" },
              { label: "Friday", value: "Friday" },
              { label: "Saturday", value: "Saturday" },
            ]}
          />
        </Form.Item>
        <Form.Item name="time" label="Time" rules={[{ required: true }]}>
          <TimePicker size="large" style={{ width: "100%" }} />
        </Form.Item>
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
            size="large"
            style={{ width: "100%" }}
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
            size="large"
            style={{ width: "100%" }}
            showSearch
            options={dropOffLocations.map((location) => ({
              label: location.address,
              value: location.address,
            }))}
            notFoundContent={null}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ScheduleRideModal;

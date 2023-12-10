import { Button, Drawer, Form, FormInstance, Input, Select } from "antd";
import { FC, useState } from "react";
import { GeofinderLocation } from "../types";
import { getLocations } from "../services";
import { useDebouncer } from "../utils";

const RiderDrawer: FC<{
  open: boolean;
  onClose: () => void;
  form: FormInstance;
}> = ({ open, onClose, form }) => {
  const [pickUpLocations, setPickUpLocations] = useState<GeofinderLocation[]>([]);
  const [dropOffLocations, setDropOffLocations] = useState<GeofinderLocation[]>([]);

  const debouncer = useDebouncer();

  const fetchLocations = async (
    value: string,
    setLocation: (locations: GeofinderLocation[]) => void,
  ) => {
    setLocation(await getLocations(value));
  };

  return (
    <Drawer
      title="Request a Ride"
      placement="bottom"
      closable={false}
      onClose={onClose}
      open={open}
    >
      <Form layout="vertical" form={form} requiredMark={false}>
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
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          onClick={() => {
            form.submit();
            onClose();
          }}
        >
          Request Ride
        </Button>
      </Form>
    </Drawer>
  );
};

export default RiderDrawer;

import { Button, Drawer, Form, FormInstance, Input } from "antd";
import { FC } from "react";

const RiderDrawer: FC<{
  open: boolean;
  onClose: () => void;
  form: FormInstance;
}> = ({ open, onClose, form }) => (
  <Drawer title="Request a Ride" placement="bottom" closable={false} onClose={onClose} open={open}>
    <Form layout="vertical" form={form}>
      <Form.Item
        name="pickupLocation"
        label="Pickup Location"
        rules={[{ required: true, message: "Please enter your pickup location" }]}
      >
        <Input placeholder="Enter pickup location" />
      </Form.Item>
      <Form.Item
        name="dropoffLocation"
        label="Dropoff Location"
        rules={[{ required: true, message: "Please enter your dropoff location" }]}
      >
        <Input placeholder="Enter dropoff location" />
      </Form.Item>
      <Button
        type="primary"
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

export default RiderDrawer;

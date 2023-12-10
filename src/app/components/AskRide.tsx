import { FC, useState } from "react";
import RiderDrawer from "./RiderDrawer";
import { Button, Form } from "antd";

const AskRide: FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  return (
    <>
      <Button
        type="primary"
        size="large"
        onClick={() => setDrawerVisible(true)}
        style={{ marginBottom: 20 }}
      >
        Ask for Ride
      </Button>
      <RiderDrawer open={drawerVisible} onClose={() => setDrawerVisible(false)} form={form} />
    </>
  );
};

export default AskRide;

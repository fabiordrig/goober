import { Button, DatePicker, Form, FormInstance, Input, Space } from "antd";
import { Dayjs } from "dayjs";
import { FC } from "react";

export type NewDriverFormValues = {
  licenseNumber: string;
  make: string;
  model: string;
  year: Dayjs;
  licensePlate: string;
  color: string;
};

const NewDriverForm: FC<{
  form: FormInstance<NewDriverFormValues>;
  onFinish: (values: NewDriverFormValues) => void;
}> = ({ form, onFinish }) => {
  return (
    <Form layout="vertical" form={form} onFinish={onFinish} style={{ width: 500 }}>
      <Form.Item name="licenseNumber" label="License Number" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>
      <Form.Item name="make" label="Make" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>
      <Form.Item name="model" label="Model" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>
      <Form.Item name="year" label="Year" rules={[{ required: true }]}>
        <DatePicker size="large" style={{ width: "100%" }} picker="year" />
      </Form.Item>
      <Form.Item name="licensePlate" label="License Plate" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>
      <Form.Item name="color" label="Color" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        Submit
      </Button>
    </Form>
  );
};

export default NewDriverForm;

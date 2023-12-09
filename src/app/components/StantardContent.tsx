import { Layout, Typography } from "antd";
import { FC } from "react";

const StandardContent: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header style={{ background: "#f0f2f5", padding: 0 }}>
        <Typography.Title style={{ margin: "40px 20px ", color: "#1890ff" }}>
          Goober
        </Typography.Title>
      </Layout.Header>
      <Layout.Content style={{ padding: "0 50px" }}>{children}</Layout.Content>
    </Layout>
  );
};

export default StandardContent;

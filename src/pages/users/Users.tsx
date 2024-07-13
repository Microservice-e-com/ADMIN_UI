import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Space,
  Table,
  theme,
  Form,
} from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import {
  Query,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createUser, getUsers } from "../../http/api";
import { LoadingOutlined } from "@ant-design/icons";
import { User } from "../../types";
import { ColumnsType } from "antd/es/table";
import { useAuthStore } from "../../store";
import UserFilter from "./UserFilter";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import UserForm from "./forms/UserForm";

const columns: ColumnsType<User> = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text: string, record: User) => {
      return (
        <div>
          {record.firstName} {record.lastName}
        </div>
      );
    },
  },

  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  // {
  //   title: "Action",
  //   dataIndex: "action",
  //   key: "action",
  //   render: () => {
  //     return (
  //       <div>
  //         <Link to="/users/edit">Edit</Link>
  //       </div>
  //     );
  //   },
  // },
];

const Users = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuthStore();

  const { mutate: userMutate } = useMutation({
    mutationKey: ["user"],
    mutationFn: async (data: User) => createUser(data).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return getUsers().then((res) => res.data);
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    await userMutate(form.getFieldsValue());
    form.resetFields();
    setDrawerOpen(false);
  };

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <>
      <Space
        direction="vertical"
        size={"large"}
        style={{
          width: "100%",
        }}
      >
        <Breadcrumb
          items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Users" }]}
          separator=<RightOutlined />
        />
        {isLoading && (
          <Flex
            justify="center"
            align="center"
            style={{
              fontSize: "2rem",
            }}
          >
            <LoadingOutlined />
          </Flex>
        )}
        {isError && (
          <Flex
            justify="center"
            align="center"
            style={{
              color: "red",
            }}
          >
            {error.message}
          </Flex>
        )}
        <UserFilter
          onFilterChange={(filterName: string, filterValue: string) => {
            console.log(filterName, filterValue);
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add User
          </Button>
        </UserFilter>
        <Table columns={columns} dataSource={users} rowKey={"id"} />
        <Drawer
          title="Create user"
          width={720}
          destroyOnClose={true}
          open={drawerOpen}
          styles={{ body: { background: colorBgLayout } }}
          onClose={() => setDrawerOpen(false)}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setDrawerOpen(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={onHandleSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <UserForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Users;

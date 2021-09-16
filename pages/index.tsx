import { memo, useEffect, useState } from "react";
import type { GetServerSideProps } from "next";

import axios from "axios";

import {
  Layout,
  Table,
  Space,
  Button,
  Drawer,
  Form,
  Input,
  notification,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import styles from "../styles/Home.module.css";
import { useForm } from "antd/lib/form/Form";

interface ICreateData {
  label: string;
  value: string;
}

const { Header, Content, Footer } = Layout;

const columns = [
  {
    title: "Nome",
    dataIndex: "label",
    key: "label",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Valor",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "Ações",
    key: "action",
    render: (text, record) => (
      <Space size="middle">
        <a>Copiar</a>
        <a>Editar</a>
      </Space>
    ),
  },
];

const Home = ({ data }) => {
  const [form] = useForm();

  const [visible, setVisible] = useState(false);
  const [memoirs, setMemoirs] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVisible = () => setVisible((e) => !e);

  const onSubmit = async (data: ICreateData) => {
    try {
      setLoading(true);

      const { data: response } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/data`,
        data
      );

      handleVisible();
      form.resetFields();

      setMemoirs((e) => [...e, response]);
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Não foi possível cadastrar a nova memória",
        description: "Ocorreu um erro inesperado",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMemoirs(data);
  }, [data]);

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <div className={styles.siteLayoutContent}>
          <div className={styles.boxButton}>
            <Button
              type="primary"
              size="middle"
              onClick={handleVisible}
              icon={<PlusCircleOutlined />}
            >
              Criar
            </Button>
          </div>
          <Table dataSource={memoirs} columns={columns} />
        </div>
        <Drawer
          title="Crie uma nova memória"
          width={320}
          visible={visible}
          onClose={handleVisible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" form={form} onFinish={onSubmit}>
            <Form.Item
              name="label"
              label="Nome"
              rules={[{ required: true, message: "Por favor insira o nome" }]}
            >
              <Input placeholder="Por favor insira o nome" />
            </Form.Item>
            <Form.Item
              name="value"
              label="Valor"
              rules={[{ required: true, message: "Por favor insira o valor" }]}
            >
              <Input placeholder="Por favor insira o valor" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Salvar
            </Button>
          </Form>
        </Drawer>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/data`);

  return {
    props: {
      data,
    },
  };
};

export default Home;

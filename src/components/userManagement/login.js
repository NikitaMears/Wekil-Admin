import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Layout,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Switch,
  message
} from "antd";
import signinbg from "../../assets/images/mn.png";


const { Title } = Typography;
const { Header, Footer, Content } = Layout;

class Login extends Component {
  onFinish = async (values) => {
    try {
        const apiUrl = process.env.API_URL || 'https://kmsbe.frontieri.com/kmsApi';
        const response = await fetch(`${apiUrl}/login`, {
    
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        // Store token and permissions in local storage
        message.success("Logged In Successfully!");

        localStorage.setItem('token', data.token);
        localStorage.setItem('userData',JSON.stringify( data.userData));

        const permissions = data.userData.Role.Permissions.map(permission => permission.name);
        localStorage.setItem('permissions', JSON.stringify(permissions));
        // Redirect programmatically
        this.props.history.push('/dashboard');
      } else {
        // Handle error response, if any
        message.error("Invalid Credentials!");

        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
    }
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    return (
      <>
        <Layout className="layout-default layout-signin">
          <Header>
            <div className="header-col header-brand">
              <h5>Minnesota Taxi</h5>
            </div>
          </Header>
          <Content className="signin">
            <Row gutter={[24, 0]} justify="space-around">
              <Col
                xs={{ span: 24, offset: 0 }}
                lg={{ span: 6, offset: 2 }}
                md={{ span: 12 }}
              >
                <Title className="mb-15">Sign In</Title>
                <Title className="font-regular text-muted" level={5}>
                  Enter your email and password to sign in
                </Title>
                <Form
                  onFinish={this.onFinish}
                  onFinishFailed={this.onFinishFailed}
                  layout="vertical"
                  className="row-col"
                >
                  <Form.Item
                    className="username"
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your email!",
                      },
                    ]}
                  >
                    <Input placeholder="Email" />
                  </Form.Item>

                  <Form.Item
                    className="username"
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Password" />
                  </Form.Item>

                  <Form.Item
                    name="remember"
                    className="aligin-center"
                    valuePropName="checked"
                  >
                    <Switch />
                    Remember me
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%" }}
                    >
                      SIGN IN
                    </Button>
                  </Form.Item>
                 
                </Form>
              </Col>
              <Col
                style={{ padding: 12 }}
                xs={{ span: 24 }}
                lg={{ span: 12 }}
                md={{ span: 12 }}
              >
                <img src={signinbg} width={1200} height={600} alt="" />
              </Col>
            </Row>
          </Content>
          <Footer>
            <p className="copyright" style={{ marginTop: 200 }}>
              {" "}
              Copyright © 2024 <a href="#frontieri.com">Minnesota Taxi</a>{" "}
            </p>
          </Footer>
        </Layout>
      </>
    );
  }
}

export default withRouter(Login);

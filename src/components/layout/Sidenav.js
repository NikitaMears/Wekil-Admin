import { Menu, Button } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/wekil.jpg";
import { PieChartOutlined, CheckCircleFilled, UsergroupAddOutlined, TeamOutlined } from "@ant-design/icons";

function Sidenav({ color }) {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");

  const dashboard = (
    <PieChartOutlined style={{ color: page === "dashboard" ? color : "" }} />
  );

  const profile = (
    <UsergroupAddOutlined style={{ color: page === "profile" ? color : "" }} />
  );

  return (
    <>
      <div className="brand">
        <img src={logo} width={40} height={40} alt="" />
        <span>Wekil Zewari</span>
      </div>
      <hr />
      <Menu theme="light" mode="inline" defaultOpenKeys={['general-management']}>
        <Menu.Item key="1">
          <NavLink to="/dashboard">
            <span className="icon">{dashboard}</span>
            <span className="label">Dashboard</span>
          </NavLink>
        </Menu.Item>

        <Menu.SubMenu key="general-management" title="General Management">
          <Menu.Item key="drivers">
            <NavLink to="/drivers">
              <span className="icon">
                <CheckCircleFilled style={{ color: "blue" }} />
              </span>
              <span className="label">Drivers</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="activeDrivers">
            <NavLink to="/activeDrivers">
              <span className="icon">
                <CheckCircleFilled style={{ color: "blue" }} />
              </span>
              <span className="label">Active Drivers</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="passengers">
            <NavLink to="/passengers">
              <span className="icon">
                <CheckCircleFilled style={{ color: "blue" }} />
              </span>
              <span className="label">Passengers</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="vehicles">
            <NavLink to="/vehicles">
              <span className="icon">
                <CheckCircleFilled style={{ color: "blue" }} />
              </span>
              <span className="label">Vehicles</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="trips">
            <NavLink to="/trips">
              <span className="icon">
                <CheckCircleFilled style={{ color: "blue" }} />
              </span>
              <span className="label">Trips</span>
            </NavLink>
          </Menu.Item>

          <Menu.Item key="reservations">
            <NavLink to="/reservations">
              <span className="icon">
                <CheckCircleFilled style={{ color: "blue" }} />
              </span>
              <span className="label">Reservations</span>
            </NavLink>
          </Menu.Item>

          <Menu.Item key="transactions">
            <NavLink to="/transactions">
              <span className="icon">
                <CheckCircleFilled style={{ color: "blue" }} />
              </span>
              <span className="label">Transactions</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="companies">
            <NavLink to="/companies">
              <span className="icon">{profile}</span>
              <span className="label">Companies</span>
            </NavLink>
          </Menu.Item>
        </Menu.SubMenu>
     
 

        <Menu.SubMenu key="configuration" title="Configuration">
          <Menu.Item key="vehicleTypes">
            <NavLink to="/vehicleTypes">
              <span className="icon">
                <CheckCircleFilled style={{ color: "blue" }} />
              </span>
              <span className="label">Vehicle Types</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="initialPrices">
            <NavLink to="/initialPrices">
              <span className="icon">
                <CheckCircleFilled style={{ color: "blue" }} />
              </span>
              <span className="label">Initial Prices</span>
            </NavLink>
          </Menu.Item>
          {/* <Menu.Item key="searchRadiuses">
            <NavLink to="/searchRadiuses">
              <span className="icon">
                <CheckCircleFilled style={{ color: "blue" }} />
              </span>
              <span className="label">Search Radius</span>
            </NavLink>
          </Menu.Item> */}
        </Menu.SubMenu>

    
        <Menu.SubMenu key="user-management" title="User Management">
          <Menu.Item key="users">
            <NavLink to="/users">
              <span className="icon">{profile}</span>
              <span className="label">Users</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="roles">
            <NavLink to="/roles">
              <span className="icon">
                <UsergroupAddOutlined style={{ color: "blue" }} />
              </span>
              <span className="label">Roles</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="permissions">
            <NavLink to="/permissions">
              <span className="icon">
                <TeamOutlined style={{ color: "blue" }} />
              </span>
              <span className="label">Permissions</span>
            </NavLink>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
      <div className="aside-footer">
        <div className="footer-box" style={{ background: color }}>
          <span className="icon" style={{ color }}>
            {dashboard}
          </span>
          <h6>Need Help?</h6>
          <p>Please check our docs</p>
          <Button type="primary" className="ant-btn-sm ant-btn-block">
            DOCUMENTATION
          </Button>
        </div>
      </div>
    </>
  );
}

export default Sidenav;

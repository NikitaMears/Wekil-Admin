/*!
=========================================================
* Muse Ant Design Dashboard - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

import Main from "./components/layout/Main";
import Drivers from "./components/drivers/drivers";


import DriversDetail from "./components/drivers/detail";


import User from "./components/userManagement/user";

import Permission from "./components/userManagement/permission";
import Role from "./components/userManagement/role";
import Login from "./components/userManagement/login";

import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import UpdateProfile from "./components/userManagement/updateProfile";



function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact component={Login} />

        <Route path="/login" exact component={Login} />

        <Main>
          <Route exact path="/dashboard" component={Home} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/drivers" component={Drivers} />
          <Route exact path="/driverDetails/:id" component={DriversDetail} />




          <Route exact path="/users" component={User} />


          <Route exact path="/roles" component={Role} />
          <Route exact path="/permissions" component={Permission} />

          <Route exact path="/profile-update" component={UpdateProfile} />


          {/* <Redirect from="*" to="/dashboard" /> */}
        </Main>
      </Switch>
    </div>
  );
}

export default App;

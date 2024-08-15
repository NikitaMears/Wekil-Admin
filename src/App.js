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
import ActiveDrivers from "./components/drivers/activeDrivers";


import Passengers from "./components/passengers/passengers";
import Trips from "./components/trips/trips";
import Companies from "./components/company/companies";

import Reservations from "./components/trips/reservations";

import Vehicles from "./components/vehicles/vehicles";
import VehicleTypes from "./components/vehicleTypes/vehicleTypes";
import InitialPrices from "./components/initialPrices/initialPrices";
import Transactions from "./components/trips/transactions";

import SearchRadiuses from "./components/searchRadiuses/searchRadiuses";






import DriversDetail from "./components/drivers/detail";
import PassengersDetail from "./components/passengers/detail";
import VehiclesDetail from "./components/vehicles/detail";
import CompanyDetails from "./components/company/detail";




import User from "./components/userManagement/user";

import Permission from "./components/userManagement/permission";
import Role from "./components/userManagement/role";
import Login from "./components/userManagement/login";

import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import UpdateProfile from "./components/userManagement/updateProfile";
import TripDetail from "./components/trips/detail";
import ReservationDetail from "./components/trips/reservationDetail";
import Dispatch from "./components/dispatch/dispatch";





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
          <Route exact path="/activeDrivers" component={ActiveDrivers} />

          <Route exact path="/driverDetails/:id" component={DriversDetail} />
          <Route exact path="/passengers" component={Passengers} />
          <Route exact path="/trips" component={Trips} />

          <Route exact path="/companies" component={Companies} />

          <Route exact path="/reservations" component={Reservations} />
          <Route exact path="/vehicleTypes" component={VehicleTypes} />
          <Route exact path="/initialPrices" component={InitialPrices} />
          <Route exact path="/searchRadiuses" component={SearchRadiuses} />
          <Route exact path="/transactions" component={Transactions} />
          <Route exact path="/companyDetails/:id" component={CompanyDetails} />
          <Route exact path="/dispatch" component={Dispatch} />



          <Route exact path="/vehicles" component={Vehicles} />

          <Route exact path="/passengerDetails/:id" component={PassengersDetail} />
          <Route exact path="/tripDetails/:id" component={TripDetail} />
          <Route exact path="/reservationDetails/:id" component={ReservationDetail} />


          <Route exact path="/vehicleDetails/:id" component={VehiclesDetail} />




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

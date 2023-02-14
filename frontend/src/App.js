import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route} from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GetAllSpots from "./components/GetAllSpots";
import GetSpotDetails from './components/SpotDetails';
import CreateSpot from './components/CreateSpot';
import ManageSpots from "./components/ManageSpots";
import UpdateSpot from "./components/UpdateSpot";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <GetAllSpots />
          </Route>
          <Route exact path="/spots/current">
            <ManageSpots />
          </Route>
          <Route exact path="/spots/new">
            <CreateSpot />
          </Route>
          <Route exact path="/spots/:spotId/edit">
            <UpdateSpot />
          </Route>
          <Route exact path="/spots/:spotId">
            <GetSpotDetails />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;

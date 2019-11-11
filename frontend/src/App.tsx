import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "tabler-ui/dist/assets/css/dashboard.css";
import { AuthService } from "./service/authService";
import { CommonPrivateRoute, PrivateRoute } from "./utils/route";
import { PageNotFoundError } from "./pages/errorPage";
import { Login } from "./pages/login";
import { Homepage } from "./pages/homepage";

export const authService = new AuthService();

const App: React.FC = () => {
    // Check the authentication then render the page
    let [checkedAuth, setCheckedAuth] = useState(false);
    useEffect(() => {
        authService.checkAuth().then(() => {
            setCheckedAuth(true);
        });
    });

    if (checkedAuth) {
        return (
            <Router>
                {/* Switch imposes that only the first route to match the url will be rendered.
                It avoids rendering PageNotFoundError on each page */}
                <Switch>
                    {/* A PrivateRoute is a route that requires to be authenticated to be accessible.
                     If the user is a public one, they'll be redirected to the login page. */}
                    <CommonPrivateRoute exact path="/" component={Homepage} />
                    <Route path="/login" component={Login} />
                    <Route component={PageNotFoundError} />
                </Switch>
            </Router>
        );
    } else {
        return <p>Loading...</p>;
    }
};

export default App;

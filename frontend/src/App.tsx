import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "tabler-ui/dist/assets/css/dashboard.css";
import { AuthService } from "./services/authService";
import { CommonPrivateRoute } from "./components/utils/Route";
import { PageNotFoundError } from "./components/utils/ErrorPage";
import { Login } from "./components/Login";
import { routes } from "./routing/global";
import { ToastProvider } from "./components/utils/Toast";
import { Loading } from "./components/utils/Loading";

export const authService = new AuthService();

const privateRoutes = routes.map(({ path, component, exact }) => (
    <CommonPrivateRoute
        exact={exact}
        path={path}
        component={component}
        key={path}
    />
));

const App: React.FC = () => {
    // Check the authentication then render the page
    let [checkedAuth, setCheckedAuth] = useState(false);
    useEffect(() => {
        authService.checkUser().then(() => {
            setCheckedAuth(true);
        });
    });

    if (checkedAuth) {
        return (
            <ToastProvider>
                <Router>
                    {/* Switch imposes that only the first route to match the url will be rendered.
                It avoids rendering PageNotFoundError on each page */}
                    <Switch>
                        {/* A PrivateRoute is a route that requires to be authenticated to be accessible.
                     If the user is a public one, they'll be redirected to the login page. */}
                        {privateRoutes}
                        <Route path="/login" component={Login} />
                        <Route component={PageNotFoundError} />
                    </Switch>
                </Router>
            </ToastProvider>
        );
    } else {
        return <Loading className="mt-9" />;
    }
};

export default App;

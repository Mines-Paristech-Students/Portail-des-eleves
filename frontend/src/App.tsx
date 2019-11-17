import React from 'react';
import axios from 'axios';
import "tabler-ui/dist/assets/css/dashboard.css";
import Navbar from "./components/Navbar";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {PollsSwitch} from "./components/polls/PollsSwitch";

// This is for connecting to the backend.
// In the future, we will have to write a page dedicated to settings this cookie.
// Workflow: (--> means "redirects to")
//   * http://frontend/login/ --> http://sso/login
//   * User enters their credentials.
//   * http://sso/login --> http://frontend/login/some_jwt_token
//   * The frontend makes a request to backend to check if the token is valid. If it is, then it sets it as a cookie.
//   * Afterwards, the frontend will send the jwt_token as a cookie with every request to the backend.
axios.defaults.withCredentials = true;
document.cookie = "jwt_access=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjQ3MjY2MTk4MjEuMzM5MjU5LCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicG9ydGFpbCIsImp0aSI6ImYzMzAxNzg4YWJhMzQxZjVhODI0OWZhYWFjYTBmZjdmIiwidXNlciI6IjE3Ym9jcXVldCJ9.I_iO8hyZXXTPXanrf2tKpUL7gyhwDGT3Hk1NI73tPUHN7LmO_m_RPRvKUtEMlWbkLNOm3JMRCrdAHH8jmQVPrzOxpg81ZafEdmVfOq_QSIycyEj2bmFVLT3YCOx3fCd8nuLWQyXaP8D2lZWJrqsACQOySkks5Sq_iOwqikCbSM3LedVqa8F1h94UCXCwQmCoiuKBmxVu-pIIHxkUbtbvbtb1_y2GSKDRrHel_qJWUtWXyLJVqAOZlk3OGoSIrJEefm8bf5ZC8RF6tgPg-Nl-y0Ti4FfpWDOVXa6oO4o69fyzDvoTyxbcLXGvLMiIWmC8KFaUhwTnyVAirZqqVEpZsw";


const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Navbar/>
                <Switch>
                    <Route path="/sondages">
                        <PollsSwitch/>
                    </Route>
                    <Route path="">
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};

export default App;

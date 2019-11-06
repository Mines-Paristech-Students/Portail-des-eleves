import React from 'react';
import "tabler-ui/dist/assets/css/dashboard.css";
import './App.css';
import Navbar from "./Navbar";
import { BrowserRouter as Router, Route } from 'react-router-dom';

const App: React.FC = () => {
    return (<Router>
        <div className="App">
            <Route path="/">
            <Navbar/>
            </Route>
        </div>
        </Router>
    );
};

export default App;

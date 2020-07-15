import React from "react";
import { Redirect } from "react-router-dom";
// @ts-ignore
import Logo from "../logo-mines.png";
import { authService } from "../App";

/**
 * This page should be modified to be displayed in dev mode, but only redirect to the SSO in prod mode.
 * A nice to have feature would be to redirect the user to where they wanted to go after the authentication.
 */

const authUrlAdmin = process.env.REACT_APP_AUTH_URL_ADMIN;
const authUrlSimple = process.env.REACT_APP_AUTH_URL;

export const Login = () => {
  if (authService.isAuthenticated) {
    return <Redirect to={"/"} />;
  }

  return (
    <div className="page">
      <div className="page-single">
        <div className="container">
          <div className="row">
            <div className="col col-login mx-auto">
              <div className="text-center mb-6 bg-white p-4 border rounded">
                <img src={Logo} alt="" />
              </div>
              <form className="card" action="" method="post">
                <div className="card-body p-6">
                  <div className="card-title">
                    Connexion au portail des élèves
                  </div>
                  <p>
                    Vous devez vous connecter pour continuer : <br />
                    <a href={authUrlAdmin}>17bocquet (admin)</a> <br />
                    <a href={authUrlSimple}>19simple (simple)</a> <br />
                    Lorsque vous aurez cliqué, revenez en arrière pour être
                    définitivement connecté
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

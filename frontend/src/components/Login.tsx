import React from "react";
import { Redirect } from "react-router-dom";
// @ts-ignore
import Logo from "../logo-mines.png";
import { authService } from "../App";

/**
 * A nice to have feature would be to redirect the user to where they wanted to go after the authentication.
 */

const authUrlAdmin =
  "http://localhost:8000/api/v1/auth/login/?access=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjc3MTU2NjE0NDUuMjM4MjU1LCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicG9ydGFpbCIsImp0aSI6IjFhN2Q1MzRkMTcxNTRkODdiMDkwNzAwODUxM2E3NjVjIiwidXNlciI6IjE3Ym9jcXVldCJ9.Mibbcf9UPloG_A8c6kZ4VnPDc87f5D6zoMn0fLAUZqejl28LU29MIcTm70UP_5LtKyWQFa6RJB3xNJ8wtJDBKD0LiVC0ltDWR_GzlvGF-GL7di3twAN8FB6cfcgUfih58hbImyXOUXFM4HuM0NL6TrkIyMi1kz6_fwq7Ueo4a8o";
const authUrlSimple =
  "http://localhost:8000/api/v1/auth/login/?access=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjc3MTU2NjE1NDYuMTkzMTA3LCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicG9ydGFpbCIsImp0aSI6ImE4ODkwYmY4ODQxMDRiMGQ5NDllYTVjOGJkYzVlN2M5IiwidXNlciI6IjE5c2ltcGxlIn0.UNR6H8qY5DzVfs_zjQtyRmur5dtkhJQ0ahJK2DAqosZdiO09y-E3Tz3E9ResQtJsa0aJIxtkB_9HihQ7zl-afi2be_PEcKtCiOQOs8AJT6xWUJy4_1jzmLkuoHeJZ13mmgl1HmnjzpF01ZKV9RxeP1-2izjz24Zg1NPZ5H8Kw8I";

export const Login = () => {
  if (authService.isAuthenticated) {
    return <Redirect to={"/"} />;
  }

  if (process.env.NODE_ENV !== "development") {
    window.location.replace("http://localhost:3001/connexion/portail");
    return null;
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
                  <p>Cet écran s'affiche car vous êtes en mode debug.</p>
                  <p>
                    Vous devez vous connecter pour continuer : <br />
                    <a href={authUrlAdmin}>17bocquet (admin)</a> <br />
                    <a href={authUrlSimple}>19simple (simple)</a> <br />
                  </p>
                  <p>
                    ou{" "}
                    <a href="http://localhost:3001/connexion/portail">
                      connectez-vous via le SSO
                    </a>
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

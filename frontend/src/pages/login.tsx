import React from "react";
import { Redirect } from "react-router-dom";
// @ts-ignore
import Logo from "../logo-mines.png";
import { authService } from "../App";

/**
 * This page should be modified to be displayed in dev mode, but only redirect to the SSO in prod mode.
 * A nice to have feature would be to redirect the user to where they wanted to go after the authentication.
 */

const authUrl =
    "http://localhost:8000/api/v1/auth/login/?access=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjQ3MjY2MTk4MjEuMzM5MjU5LCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicG9ydGFpbCIsImp0aSI6ImYzMzAxNzg4YWJhMzQxZjVhODI0OWZhYWFjYTBmZjdmIiwidXNlciI6IjE3Ym9jcXVldCJ9.I_iO8hyZXXTPXanrf2tKpUL7gyhwDGT3Hk1NI73tPUHN7LmO_m_RPRvKUtEMlWbkLNOm3JMRCrdAHH8jmQVPrzOxpg81ZafEdmVfOq_QSIycyEj2bmFVLT3YCOx3fCd8nuLWQyXaP8D2lZWJrqsACQOySkks5Sq_iOwqikCbSM3LedVqa8F1h94UCXCwQmCoiuKBmxVu-pIIHxkUbtbvbtb1_y2GSKDRrHel_qJWUtWXyLJVqAOZlk3OGoSIrJEefm8bf5ZC8RF6tgPg-Nl-y0Ti4FfpWDOVXa6oO4o69fyzDvoTyxbcLXGvLMiIWmC8KFaUhwTnyVAirZqqVEpZsw";

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
                                        Connection au portail des élèves
                                    </div>
                                    <p>
                                        Vous devez vous connecter pour continuer
                                    </p>
                                    <a href={authUrl}>Cliquez ici</a>
                                    Lorsque vous aurez cliqué, revenez en
                                    arrière pour être définitivement connecté
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

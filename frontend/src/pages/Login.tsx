import React from "react";
import { Redirect } from "react-router-dom";
// @ts-ignore
import Logo from "../logo-mines.png";
import { authService } from "../App";

/**
 * This page should be modified to be displayed in dev mode, but only redirect to the SSO in prod mode.
 * A nice to have feature would be to redirect the user to where they wanted to go after the authentication.
 */

const authUrlAdmin =
    "http://localhost:8000/api/v1/auth/login/?access=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjQ3MjY2MTk4MjEuMzM5MjU5LCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicG9ydGFpbCIsImp0aSI6ImYzMzAxNzg4YWJhMzQxZjVhODI0OWZhYWFjYTBmZjdmIiwidXNlciI6IjE3Ym9jcXVldCJ9.I_iO8hyZXXTPXanrf2tKpUL7gyhwDGT3Hk1NI73tPUHN7LmO_m_RPRvKUtEMlWbkLNOm3JMRCrdAHH8jmQVPrzOxpg81ZafEdmVfOq_QSIycyEj2bmFVLT3YCOx3fCd8nuLWQyXaP8D2lZWJrqsACQOySkks5Sq_iOwqikCbSM3LedVqa8F1h94UCXCwQmCoiuKBmxVu-pIIHxkUbtbvbtb1_y2GSKDRrHel_qJWUtWXyLJVqAOZlk3OGoSIrJEefm8bf5ZC8RF6tgPg-Nl-y0Ti4FfpWDOVXa6oO4o69fyzDvoTyxbcLXGvLMiIWmC8KFaUhwTnyVAirZqqVEpZsw";
const authUrlSimple =
    "http://localhost:8000/api/v1/auth/login/?access=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE1ODg2MjUxMjAuODg3Njk1LCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicG9ydGFpbCIsImp0aSI6IjY4NjNjY2MwZGFiNDRmMGM4MWQ3NTVkYmE4NDY4ZTY1IiwidXNlciI6IjE5c2ltcGxlIn0.gEWNL6m3EI5JJmHxMfwOJCvE7kULj6p6wT9cPgfJBl9ZaAAVbhm95Er_PejzAFRzFdl4LGXeLJPrsX39WvIG2ljoKRG79Wg_ybR-7K9rCHoi92RvlYvf-GppE28JT_0IgcwKpMicAcGQ2F1gysv-jpxxfOq17honZdCm842t53KoOMGq06BXnruKCKHZ3X_vrKUUamCXYE1P5BQx2K56mOqxUjESZcQcQd8VYpjgNnTGQcQpHF5pLmCBZP95RonF3SZKU8gDZnAqk8njLqPo7bC9wBM40lria_BR6Hu1We_t2Yjq-RmE2FLV-T9Bd4HCP1eIhpJ9J6jS3Q6WkB_DMw";

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
                                        Vous devez vous connecter pour continuer : {" "}<br />
                                        <a href={authUrlAdmin}>17bocquet (admin)</a> <br />
                                        <a href={authUrlSimple}>19simple (simple)</a> <br />
                                        Lorsque vous aurez cliqué, revenez en
                                        arrière pour être définitivement
                                        connecté
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

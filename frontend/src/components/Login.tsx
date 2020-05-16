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
    "http://localhost:8000/api/v1/auth/login/?access=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJleHAiOjE2NzQ0MjQ4MjAuMTgzNzI0LCJpc3MiOiJzc29fc2VydmVyIiwiYXVkIjoicG9ydGFpbCIsImp0aSI6IjFkYzg4OGQzYjhlMjRhYzFiOGE0YThmZGE2NTRlODA1IiwidXNlciI6IjE5c2ltcGxlIn0.DNX6smizhwaIhZvkRWYtGSKidltnA1IVCdcWZJZe0m--jeK7NapqMMGmd_NpTh2kC7rSHY60vi4mCJvr740NGaJFHcMU_4j_GkrmIEl2M7RraU52JTDIRdttsfNFQN7pxgJllpzZrCHHE37UZ0fUEu0m9FCUxYkL4AoTIbwxScXZ3NFNK0kXhqQGtzaLNv9g4QUUTTq30eopkh5iWugCkJ8aFBzI1jn821URw8Kpz3CoV_aT1I2iFs6OrE35iP1arpIaD9Vt8QX393LTYISx-Y5N4074gbGlMgdEhH-E1Iqxlm7v-CBbvELD09K1U1YFzk7oEZMID7sS-94ebLElUQ";

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
                                        Vous devez vous connecter pour continuer
                                        : <br />
                                        <a href={authUrlAdmin}>
                                            17bocquet (admin)
                                        </a>{" "}
                                        <br />
                                        <a href={authUrlSimple}>
                                            19simple (simple)
                                        </a>{" "}
                                        <br />
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

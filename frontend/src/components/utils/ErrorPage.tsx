import React from "react";

export const ErrorMessage = (props) => {
  return (
    <p className="h4 text-muted font-weight-normal mb-7">{props.children}</p>
  );
};

/* Generic template for error pages */
export const ErrorPage = ({
  errorCode = 500,
  title = "",
  children = null,
}: {
  errorCode?: number;
  title?: string;
  children?: JSX.Element | string | Error | null;
}) => {
  return (
    <div className="page">
      <div className="page-content">
        <div className="container text-center">
          <div className="display-1 text-muted mb-5">
            <i className="si si-exclamation" /> {errorCode}
          </div>
          <h1 className="h2 mb-3">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export const PageNotFoundError = (props) => {
  return <ErrorPage {...props} errorCode={404} title={"Page non trouvée"} />;
};

export const ForbiddenError = (props) => {
  return (
    <ErrorPage {...props} errorCode={403} title={"Page interdite"}>
      Vous n’avez pas le droit d’accéder à cette page. Si vous pensez que c’est
      une erreur, merci de contacter les administrateurs.
    </ErrorPage>
  );
};

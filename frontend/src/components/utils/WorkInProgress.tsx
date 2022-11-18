import React from "react";
import { Instructions } from "./Instructions";

export const WorkInProgress = () => (
  <Instructions
    title="C'est pour bientôt !"
    emoji="🚀"
    emojiAriaLabel="Une fusée"
  >
    Cette fonctionnalité est en cours de développement.
    <br />
    Tu peux suivre l'avancée{" "}
    <a href="https://github.com/Mines-Paristech-Students/Portail-des-eleves/wiki/Fonctionnalit%C3%A9s-et-avancement">
      ici
    </a>{" "}
    !
  </Instructions>
);

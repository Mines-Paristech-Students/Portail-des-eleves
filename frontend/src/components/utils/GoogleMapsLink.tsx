import React from "react";

const GOOGLE_MAPS_BASE_URL = "https://www.google.com/maps/search/";

export const GoogleMapsLink = ({ address }: { address: string }) => (
  <a href={GOOGLE_MAPS_BASE_URL + address.replace(/ /g, "+")}>{address}</a>
);

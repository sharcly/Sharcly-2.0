/**
 * Maps Google Maps Address Components to a flat address structure
 * @param place - Google Place object
 * @returns Object with mapped address components
 */
export const mapGooglePlaceToAddress = (place: any) => {
  const components = place.addressComponents || place.address_components;
  if (!components) return null;

  let streetNumber = "";
  let route = "";
  let city = "";
  let state = "";
  let zip = "";
  let country = "";

  components.forEach((component: any) => {
    const types = Array.isArray(component.types) ? component.types : Array.from(component.types || []);
    const longName = component.longText || component.long_name || "";
    const shortName = component.shortText || component.short_name || "";

    if (types.includes("street_number")) {
      streetNumber = longName;
    }
    if (types.includes("route")) {
      route = longName;
    }
    if (types.includes("locality")) {
      city = longName;
    }
    if (types.includes("administrative_area_level_1")) {
      state = shortName;
    }
    if (types.includes("postal_code")) {
      zip = longName;
    }
    if (types.includes("country")) {
      country = longName;
    }
  });

  let fullStreetAddress = place.formattedAddress || [streetNumber, route].filter(Boolean).join(" ");

  // Clean up formatted address (optional)
  if (fullStreetAddress && fullStreetAddress.includes(",")) {
    // If it's a full address, we usually just want the street part for address_1
    // But in the original implementation we kept the formatted one.
    // Let's try to be smart: if we have streetNumber and route, use that for address_1
    if (streetNumber && route) {
      fullStreetAddress = `${streetNumber} ${route}`;
    } else {
      fullStreetAddress = fullStreetAddress.split(',')[0];
    }
  }

  return {
    address: fullStreetAddress,
    city,
    state,
    zipCode: zip,
    country: country || "United States",
  };
};

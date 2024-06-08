const loadGoogleMapsScript = (callback) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = `https://maps.googleapis.com/maps/api/js?key=${
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  }&libraries=places`;
  script.defer = true;
  script.async = true;
  script.onload = () => callback();
  document.head.appendChild(script);
};

export default loadGoogleMapsScript;

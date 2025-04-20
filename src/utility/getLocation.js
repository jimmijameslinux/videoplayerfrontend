

exports.getUserLocation = async () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            console.log("Geolocation is not supported by this browser.");
            resolve("Unknown City");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;
            const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

            try {
                const response = await fetch(apiUrl);
                console.log("API Response:", response);
                const data = await response.json();
                console.log("Location data:", data);
                const components = data.results[0]?.components;
                const city = components?.city || components?.town || components?.village || components?.state || "Unknown City";
                console.log("City found:", city);
                const state = components?.state || "Unknown State";
                console.log("State found:", state);
                resolve(state);
            }
            catch (error) {
                console.log("Error fetching location:", error.message);
                resolve("Unknown City");
            }
        });
    });
};
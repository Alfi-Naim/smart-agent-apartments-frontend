class MainApi {

    constructor(options) {
        this._baseUrl = options.baseUrl;
    }

    _handleResponse = res => {
        return (res.ok) ? res.json() : Promise.reject(
            {
                errorCode: res.status,
                errorText: res.statusText
            });
    }

    startSearch = async (realEstate, city,minPrice, maxPrice) => {
        const res = await fetch(`http://localhost:8080/yad2`, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                city: city,
                maximumPrice: maxPrice,
                minimumPrice: minPrice,
                type: realEstate
            }),
        });
        return this._handleResponse(res);
    }

    loadResults = async (searchId) => {
        const res = await fetch(`http://localhost:8080/yad2/` + searchId, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        });
        return this._handleResponse(res);
    }
}


const api = new MainApi({
    baseUrl: "http://localhost:8080"
});

export default api;
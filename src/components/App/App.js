import { useEffect, useState } from 'react';
import './App.css';
import mainApi from '../../utils/MainApi';
import toast, { Toaster } from 'react-hot-toast';
import Post from '../Post/Post';

function App() {

  const [realEstate, setRealEstate] = useState(localStorage.getItem("realEstate") || 'forsale');
  const [city, setCity] = useState(localStorage.getItem("city") || "");
  const [maxPrice, setMaxPrice] = useState(localStorage.getItem("maxPrice") || "");
  const [minPrice, setMinPrice] = useState(localStorage.getItem("minPrice") || "");
  const [searchId, setSearchId] = useState(localStorage.getItem("searchId"));
  const [results, setResults] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (searchId) {
        mainApi.loadResults(searchId).then((res) => {
          setResults(res);
        }).catch((err) => console.log(err));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [searchId])

  const handleRealEstateChange = (event) => {
    setRealEstate(event.target.value);
  }

  const handleCityChange = (event) => {
    setCity(event.target.value);
  }

  const handleMaxPriceChange = (event) => {
    let withoutCommas = event.target.value.replaceAll(",", "");
    if (event.target.value !== "" && !isNaN(withoutCommas)) setMaxPrice(parseInt(withoutCommas).toLocaleString("en-US"));
    else setMaxPrice(event.target.value);
  }

  const handleMinPriceChange = (event) => {
    let withoutCommas = event.target.value.replaceAll(",", "");
    if (event.target.value !== "" && !isNaN(withoutCommas)) setMinPrice(parseInt(withoutCommas).toLocaleString("en-US"));
    else setMinPrice(event.target.value);
  }

  const removeSmartAgent = () => {
    localStorage.removeItem("realEstate");
    localStorage.removeItem("searchId");
    localStorage.removeItem("city");
    localStorage.removeItem("minPrice");
    localStorage.removeItem("maxPrice");
    setRealEstate("forsale");
    setSearchId(null);
    setCity("");
    setMinPrice("");
    setMaxPrice("");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchId) removeSmartAgent();
    else {
      toast.promise(
        mainApi.startSearch(realEstate, city, minPrice.replaceAll(",", ""), maxPrice.replaceAll(",", "")),
        {
          loading: "מפעיל סוכן",
          success: (res) => {
            setResults([]);
            setSearchId(res.searchId);
            localStorage.setItem("searchId", res.searchId);
            localStorage.setItem("realEstate", realEstate);
            localStorage.setItem("city", city);
            localStorage.setItem("minPrice", minPrice);
            localStorage.setItem("maxPrice", maxPrice);
            return "סוכן חכם הופעל";
          },
          error: (err) => {
            console.log(err);
            return "שגיאה";
          },
        }
      );
    }
  }

  return (
    <div className="app">
      <main className='main'>
        <h1 className='title'>סוכן דירות חכם</h1>
        <form className='form' onSubmit={handleSubmit}>
          <select className='form__select' value={realEstate} onChange={handleRealEstateChange} disabled={searchId}>
            <option className='form__option' value="forsale">מכירה</option>
            <option className='form__option' value="rent">השכרה</option>
          </select>
          <input className='form__input' placeholder='עיר' value={city} onChange={handleCityChange} required disabled={searchId} />
          <input className='form__input' placeholder='מחיר מינימלי' value={minPrice} onChange={handleMinPriceChange} required disabled={searchId} />
          <input className='form__input' placeholder='מחיר מקסימלי' value={maxPrice} onChange={handleMaxPriceChange} required disabled={searchId} />
          <button className='form__button'>{searchId ? 'בטל' : 'הפעל'}</button>
        </form>
        <ul className='posts'>
          {
            results.map((item, index) => (
              <li className='post' key={index}>
                <Post item={item} />
              </li>
            ))
          }
        </ul>
      </main>
      <Toaster />
    </div>
  );
}

export default App;

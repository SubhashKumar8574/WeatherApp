import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';
import loading_icon from '../assets/loading.gif';

const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": drizzle_icon,
        "03n": drizzle_icon,
        "04d": rain_icon,
        "04n": rain_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": clear_icon,
        "10n": clear_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    const fetchWeather = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) {
                alert(data.message);
                return;
            };
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: allIcons[data.weather[0].icon] || clear_icon,
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchWeatherByLocation = (lat, lon) =>
            fetchWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_APP_ID}`);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => fetchWeatherByLocation(position.coords.latitude, position.coords.longitude),
                () => setError('Unable to retrieve your location'),
            );
        } else {
            setError('Geolocation is not supported by this browser');
        }
    }, []);

    return (
        <>
            <div className='weather'>
                <div className='search-bar'>
                    <input ref={inputRef} type="text" placeholder='Search' />
                    <img
                        src={search_icon}
                        alt=""
                        onClick={() => {
                            const city = inputRef.current.value;
                            if (city) fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`);
                            else alert('Enter City Name');
                        }}
                    />
                </div>
                {loading && <img className='loading' src={loading_icon} />}
                {weatherData && (
                    <>
                        <img src={weatherData.icon} alt="" className='weather-icon' />
                        <p className='temperature'>{weatherData.temperature}° C</p>
                        <p className='location'>{weatherData.location}</p>
                        <div className="weather-data">
                            <div className="col">
                                <img src={humidity_icon} alt=" " />
                                <div>
                                    <p>{weatherData.humidity}%</p>
                                    <span>Humidity</span>
                                </div>
                            </div>
                            <div className="col">
                                <img src={wind_icon} alt=" " />
                                <div>
                                    <p>{weatherData.windSpeed} km/h</p>
                                    <span>Wind Speed</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Weather;

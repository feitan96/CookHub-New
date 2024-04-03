import React, { useState, useEffect } from 'react';
import './HeroPage.css';
// Update these paths based on your project structure
import heroBg from '/assets/images/herobg.jpg';
import heroBg2 from '/assets/images/herobg2.jpg';
import heroBg3 from '/assets/images/herobg3.jpg';
import heroBg4 from '/assets/images/herobg4.jpg';
import cookhubLogo from '/assets/images/cookhub.png';
import chevronright from '/assets/images/chevronright.png';
import searchbar from '/assets/images/search-icon.png';
import { Link, useNavigate } from "react-router-dom";

function HeroPage() {
    const [currentBg, setCurrentBg] = useState(heroBg);
    const backgrounds = [heroBg, heroBg2, heroBg3, heroBg4]; // Array of background images

    useEffect(() => {
    const intervalId = setInterval(() => {
        setCurrentBg((current) => {
        const index = backgrounds.indexOf(current);
        return backgrounds[(index + 1) % backgrounds.length]; // Move to the next image or loop back to the first
        });
    }, 5000); // Change image every 5000 milliseconds (5 seconds)

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []); // Empty dependency array means this effect runs once on mount

    const appStyle = {
        height: '100vh',
        backgroundImage: `url(${currentBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',
        transition: 'background-image 1s ease-in-out', // Smooth transition between images
    };

    return (
        <div className="App" style={appStyle}>
        <img src={cookhubLogo} alt="CookHub Logo" style={{ position: 'absolute', top: '30px', left: '30px', width: 'auto', height: '51px', margin: '10px' }} />
        <div className="nextBtn" style={{ position: 'absolute', top: '30px', right: '30px', margin: '10px' }}>
            <div className="nextIcon">
            <button className="next">
                <Link  
                    to="/sign-in"
                    className="login">login
                </Link>
            </button>
            <div className="icon">
                <img
                className="chevronRightIcon"
                loading="lazy"
                alt="Chevron Right"
                src={chevronright}
                />
            </div>
            </div>
        </div>
        <div className="searchBar" style={{position: 'absolute', top: '250px', left: '50px', width: '700px', height: '51px', margin: '10px' }}>
            <div className="nextIcons">
            <div className="searchBarText">Discover Culinary Delights Instantly</div>
            <div className="searchBarIcon">
                <img
                className="searchBarImage"
                loading="lazy"
                alt="Search Bar"
                src={searchbar}
                />
            </div>
            </div>
        </div>
        <div className="aboutUsParent">
            <div className="aboutUs">About Us</div>
            <div className="developers">Developers</div>
            <div className="blog">Blog</div>
        </div>
        <div className="unlockText">
            <div className="unlockYourInnerContainer">
            <span>
                <p className="unlockYourInner">
                Unlock your inner chef potential with CookHub, a dynamic social
                </p>
                <p className="mediaPlatformDesigned">
                media platform designed for food lovers to explore recipes, share
                </p>
                <p className="theirCulinaryAchievements">
                their culinary achievements, and connect with a community
                </p>
                <p className="theirCooking">
                passionate about cooking.
                </p>
            </span>
            </div>
        </div>
        </div>
    );
    }

export default HeroPage;

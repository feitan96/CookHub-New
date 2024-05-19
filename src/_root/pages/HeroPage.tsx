import { useState, useEffect } from 'react';
import './HeroPage.css';
import heroBg from '/assets/images/herobg.jpg';
import heroBg2 from '/assets/images/herobg2.jpg';
import heroBg3 from '/assets/images/herobg3.jpg';
import heroBg4 from '/assets/images/herobg4.jpg';
import cookhubLogo from '/assets/images/cookhub.png';
import chevronright from '/assets/images/chevronright.png';
import searchbar from '/assets/images/search-icon.png';
import about from '/assets/images/about.jpg'; 
import developers from '/assets/images/developers.png'; 
import { Link } from "react-router-dom";

type Content = 'about' | 'developers' | 'blog' | null;

function HeroPage() {
    const [currentBg, setCurrentBg] = useState<string>(heroBg);
    const backgrounds = [heroBg, heroBg2, heroBg3, heroBg4];
    const [displayContent, setDisplayContent] = useState<Content>(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentBg((current) => {
                const index = backgrounds.indexOf(current);
                return backgrounds[(index + 1) % backgrounds.length];
            });
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const appStyle = {
        height: '100vh',
        backgroundImage: `url(${currentBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',
        transition: 'background-image 1s ease-in-out',
    };

    const handleClick = (content: Content) => {
        setDisplayContent(content);
    };

    return (
        <div className="App" style={appStyle}>
            <button onClick={() => setDisplayContent(null)} style={{ background: 'none', border: 'none' }}>
                <img src={cookhubLogo} alt="CookHub Logo" style={{ cursor: 'pointer', position: 'absolute', top: '30px', left: '30px', width: 'auto', height: '51px', margin: '10px' }} />
            </button>
            <div className="nextBtn" style={{ position: 'absolute', top: '30px', right: '30px', margin: '10px' }}>
                <div className="nextIcon">
                    <button className="next">
                        <Link to="/sign-in" className="login">login</Link>
                    </button>
                    <div className="icon">
                        <img className="chevronRightIcon" alt="Chevron Right" src={chevronright} />
                    </div>
                </div>
            </div>
            {displayContent === null && (
                <>
                    <div className="searchBar" style={{ position: 'absolute', top: '250px', left: '50px', width: '700px', height: '51px', margin: '10px' }}>
                        <div className="nextIcons">
                            <div className="searchBarText">Discover Culinary Delights Instantly</div>
                            <div className="searchBarIcon">
                                <img className="searchBarImage" alt="Search Bar" src={searchbar} />
                            </div>
                        </div>
                    </div>
                    <div className="unlockText">
                        <div className="unlockYourInnerContainer">
                            <span>
                                <p className="unlockYourInner">Unlock your inner chef potential with CookHub, a dynamic social</p>
                                <p className="mediaPlatformDesigned">media platform designed for food lovers to explore recipes, share</p>
                                <p className="theirCulinaryAchievements">their culinary achievements, and connect with a community</p>
                                <p className="theirCooking">passionate about cooking.</p>
                            </span>
                        </div>
                    </div>
                </>
            )}
            <div className="aboutUsParent">
                <button onClick={() => handleClick('about')} className="aboutUs">About Us</button>
                <button onClick={() => handleClick('developers')} className="developers">Developers</button>
                <button onClick={() => handleClick('blog')} className="blog">Contact Us</button>
            </div>
            {displayContent === 'about' && <img src={about} alt="About Us" />}
            {displayContent === 'developers' && <img src={developers} alt="Developers"/>}
            {displayContent === 'blog' && <div></div>}
        </div>
    );
}

export default HeroPage;

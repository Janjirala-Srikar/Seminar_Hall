import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const images = [
  "https://i.postimg.cc/4dHQYDX4/DSC0009.jpg",
  "https://i.postimg.cc/G2K9C17g/Whats-App-Image-2025-03-23-at-22-23-38-a05f9c83.jpg",
  "https://i.postimg.cc/02gL7H8r/DSC00804.jpg",
"https://i.postimg.cc/L6LF7Fyz/DSC00821.jpg",
  "https://i.postimg.cc/d1FVCdY7/DSC0026.jpg",
  "https://i.postimg.cc/hvyDN57x/DSC0059.jpg",
  "https://i.postimg.cc/7YRPVj4r/DSC0104.jpg",
  "https://i.postimg.cc/rpXV6Wzh/DSC0220-1.jpg",
];


function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const sliderRef = useRef(null);

  const settings = {
    infinite: true,
    speed: 8000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    dots: false,
    pauseOnHover: false, // We handle hover manually
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  // ✅ Pauses autoplay when hovering over an image
  const handleImageHover = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPause();
    }
  };

  // ✅ Resumes autoplay from the same position when cursor leaves
  const handleImageLeave = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPlay();
    }
  };
  const naviagte=useNavigate();

  return (
    

    <div className="">
  
      <div className="booking-container d-flex justify-content-center flex-column h">
            <h1 className="bc">Looking for a venue? 
            <br />Reserve a seminar hall now through our booking portal</h1>
            <p className="">Easy, quick, and hassle-free booking.</p>
            <div class="booking-actions">
              <button class="book-btn" onClick={()=>{naviagte('/signin')}}>Book Here</button>
            </div>
      </div>


    <div className="slider-wrapper">
      <Slider ref={sliderRef} {...settings} className="slider-container">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className="slider-item p-2"
            onMouseEnter={handleImageHover}
            onMouseLeave={handleImageLeave}
          >
            <img 
              src={img} 
              alt={`Slide ${idx + 1}`} 
              className="slider-image"
              loading={idx === 0 ? "eager" : "lazy"}
              onClick={() => setSelectedImage(img)}
            />
          </div>
        ))}
      </Slider>

      

      {/* Landing Section */}
      <section className="landing-sec justify-content-center">
        <div className="container">
            
          {/* Landing Content */}
          <div className="landing-content container ">
            <div className="landing-left">
              <div className="landing">
              <h4>Welcome to</h4>
              <h1 style={{color: "#82001A"}}>VNRVJIET</h1>
              <p>
                The Philosophy of Vignana Jyothi unravels education as a process of
                "Presencing" that provides, both individually and collectively, to
                one's deepest capacity to sense and experience the knowledge and
                activities to shape the future.
              </p>
              <p>
                Today, with this philosophy, Vignana Jyothi has created an edifice
                that is strong in its foundations, which can only rise higher and
                higher. Quality and integrity is the essence for achieving excellence.
              </p>
              <div className="discover-btn">
                <a href="https://vnrvjiet.ac.in/" className="gradient-btn">Discover More</a>
              </div>
              </div>
              
            </div>
            <div className="landing-right">
              <img 
                src="https://vnrvjiet.ac.in/assets/images/homepage-image.jpg" 
                alt="VNRVJIET" 
                className="landing-image"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}

export default Home;
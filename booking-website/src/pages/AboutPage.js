import React from "react";
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-heading">About Us</h1>
        <p className="about-text">
          Welcome to Booking Services, your one-stop destination for hassle-free
          booking solutions. We're dedicated to simplifying your life by
          connecting you with trusted service providers for all your needs.
        </p>
        <p className="about-text">
          Our platform is designed with you in mind, offering a seamless booking
          experience from start to finish. Whether you're scheduling a haircut,
          car maintenance, or home repairs, we've got you covered.
        </p>
        <p className="about-text">
          At Booking Services, we prioritize convenience, reliability, and
          customer satisfaction. With our intuitive interface, you can easily
          browse services, read reviews, and book appointments with just a few
          clicks.
        </p>
        <p className="about-text">
          Say goodbye to the hassle of traditional booking methods and hello to
          a new era of simplicity and efficiency. Join us and experience the
          future of booking services today!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;

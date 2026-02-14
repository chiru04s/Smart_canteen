/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import "./landingPage.css";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      <>
        <header className="header">
          <nav>
            <div className="nav__header">
              <div className="nav__logo">
                <a href="#">
                  <img
                    src="assets/logo sac-Photoroom.png"
                    alt="logo"
                    className="nav__logo-dark"
                  />
                  <img
                    src="assets/logo sac-Photoroom.png"
                    alt="logo"
                    className="nav__logo-white"
                  />
                </a>
              </div>
            </div>
            <ul className="nav__links" id="nav-links">
              <li>
                <a href="#home">HOME</a>
              </li>
              <li>
                <a href="#footer">CONTACT US</a>
              </li>
              <li>
                <Link to="/auth">
                  <button className="btn">ORDER NOW</button>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="section__container header__container" id="home">
            <div className="header__image">
              <img src="assets/samosa.jpg" alt="header" />
            </div>
            <div className="header__content">
              <h2>
                Welcome to SAC Snack Vault - Your Ultimate Canteen Companion!
              </h2>
              <h1>
                A Vault Full of Delicious <br />
                <span>Surprises!</span>
              </h1>
            </div>
          </div>
        </header>
        <section className="section__container banner__container" id="special">
          <div className="banner__card">
            <p>TRY IT OUT TODAY</p>
            <h4>Biriyani</h4>
          </div>
          <div className="banner__card">
            <p>TRY IT OUT TODAY</p>
            <h4>Idly</h4>
          </div>
          <div className="banner__card">
            <p>TRY IT OUT TODAY</p>
            <h4>Dosa</h4>
          </div>
        </section>
        <section className="section__container order__container" id="menu">
          <h3>SNACK TIME, ANYTIME</h3>
          <h2 className="section__header">CHOOSE &amp; ENJOY</h2>
          <p className="section__description">
            From crispy bites to comforting sips, your snack journey starts
            here! Explore a world of flavors and satisfy your cravings with
            every delicious choice at SAC Snack Vault
          </p>
          <div className="order__grid">
            <div className="order__card">
              <img src="assets/puff sac.jpg" alt="order" />
              <h4>Crispy Puff</h4>
              <p>"Flaky, buttery, and simply irresistible!"</p>
              <Link to="/auth">
                <button className="btn">ORDER NOW</button>
              </Link>{" "}
            </div>
            <div className="order__card">
              <img src="assets/roll sac.jpg" alt="order" />
              <h4>Veg Roll</h4>
              <p>"Wrapped in flavor, rolled with love!"</p>
              <Link to="/auth">
                <button className="btn">ORDER NOW</button>
              </Link>{" "}
            </div>
            <div className="order__card">
              <img src="assets/bicuit12 sac.jpg" alt="order" />
              <h4>Cookies</h4>
              <p>"Crispy, chewy, and baked to perfection!"</p>
              <Link to="/auth">
                <button className="btn">ORDER NOW</button>
              </Link>{" "}
            </div>
          </div>
        </section>
        <section className="section__container event__container" id="event">
          <div className="event__content">
            <div className="event__image">
              <img src="assets/sac tea.jpg" alt="event" />
            </div>
            <div className="event__details">
              <h2 className="section__header" style={{ textAlign: "center" }}>
                When its Tea time
              </h2>
              <p
                className="section__description"
                style={{ padding: "5%", lineHeight: 3 }}
              >
                "Step into SAC Snacks Vault and indulge in the perfect tea
                break! ☕✨ Let every sip of our freshly brewed tea refresh your
                mind and energize your day. Whether you're catching up with
                friends, taking a study break, or simply enjoying a moment of
                relaxation, our warm and comforting tea is here to rejuvenate
                your senses. Come, sip, relax, and recharge!"
              </p>
            </div>
          </div>
        </section>
        <section id="footer">
          <footer className="footer">
            <div className="section__container footer__container">
              <div className="footer__logo">
                <img src="assets/logo sac.jpg" alt="logo" />
              </div>
              <div className="footer__content">
                <p>
                  "SAC Snacks Vault – Savor the Taste, Relish the Moments! From
                  crispy bites to refreshing drinks, we bring you the finest
                  flavors with quality and care. Thank you for choosing us—your
                  go-to spot for delicious treats!"
                </p>
                <div>
                  <ul className="footer__links">
                    <li>
                      <span>
                        <i className="ri-map-pin-2-fill" />
                      </span>
                      📍 Sadakathullah Appa College, Rahmath Nagar, Tirunelveli
                      -627011, Tamil Nadu, India,
                    </li>
                    <li>
                      <span>
                        <i className="ri-mail-fill" />
                      </span>
                      <a
                        href="mailto:sacsnacksvault@gmail.com"
                        style={{ textDecoration: "none", color: "whitesmoke" }}
                      >
                        ✉️ sacsnacksvault@gmail.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="footer__bar">
              <p>Copyright © 2025 SAC Snacks Vault. All rights reserved.</p>
            </div>
          </footer>
        </section>
      </>
    </div>
  );
}

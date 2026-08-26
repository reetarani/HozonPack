import "./footer.css";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-top">
          {/* Company */}
          <div className="footer-column">
            <Link to="/">
                <img 
                src="images/logo.png" 
                alt="Hozone" 
                className="footerLogo" 
                />
            </Link>
            <p>
              Premium corrugated packaging solutions that protect and perform.
            </p>
          </div>
          {/* Quick Links */}
          <div className="footer-column">
            <h4>Quick Links</h4>

            <ul>
              <li><a href="/">About Us</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#industries">Industries</a></li>
              <li><a href="#sustainability">Sustainability</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          {/* Contact */}
          <div className="footer-column">
            <h4>Contact Us</h4>
            <div className="footer-contact">
              <div className="contact-item">
                <FiMail />
                <Link to="mailto:info.hozon@gmail.com"><span>info.hozon@gmail.com</span></Link>
              </div>
              <div className="contact-item">
                <FiPhone />
                <Link to="tel:+91 7483058831"><span>+91 7483058831</span></Link>
              </div>
              <div className="contact-item address">
                <FiMapPin />
                <span>
                  68/1, Hirandahalli Main Road,
                  Virgo Nagar Post,
                  Bengaluru,
                  Karnataka - 560049
                </span>
              </div>
            </div>
          </div>
          {/* Social */}
          <div className="footer-column">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#">
                <FaFacebookF />
              </a>
              <a href="#">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Hozon Packaging. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-conditions">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
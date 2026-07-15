import "./topbar.css";
import { HiOutlineClipboardDocument, HiCheck } from "react-icons/hi2";
import { useState } from "react";

function TopBar() {
    
  const couponCode = "SPRINGBOX";
  const [copied, setCopied] = useState(false);

  const copyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (err) {
      console.log(err);
    }
  };
const offer = (
    <>
        <span>Save 21% on custom packaging</span>
        <span>|</span>
        <span>
        Code: <strong>{couponCode}</strong>
        </span>
        <button
        className="copy-btn"
        onClick={copyCoupon}
        aria-label="Copy coupon code"
        >
        {copied ? <HiCheck /> : <HiOutlineClipboardDocument />}
        </button>
        <span>|</span>
        <span>Ends in 2d 17h 25m</span>
        <span>|</span>
        <a href="/">Shop now</a>
    </>
    );
  return (
    <div className="topbar">

      <div className="marquee">
        <div className="marquee-track">

            <div className="marquee-content">
            {offer}
            </div>

            <div className="marquee-content">
                {offer}
            </div>
        </div>
      </div>

    </div>
  );
}

export default TopBar;
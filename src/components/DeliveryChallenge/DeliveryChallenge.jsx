import "./DeliveryChallenge.css";

function DeliveryChallenge() {
    return (
        <section className="delivery-challenge">

            <div className="delivery-video-wrapper">

                {/* Background Video */}
                <video
                    className="delivery-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                >
                    <source
                        src="/videos/24-hour-delivery.mp4"
                        type="video/mp4"
                    />
                </video>

                {/* Overlay */}
                <div className="delivery-overlay"></div>

                {/* Content */}
                <div className="delivery-content">

                    <h2>
                        The 24 hour Delivery Challenge
                    </h2>

                    <p>
                        Production downtime costs more than packaging ever
                        will. Order stocked sizes before 2 PM and they leave
                        our floor inside 24 hours—or we pay your freight.
                    </p>

                    <div className="delivery-stats">

                        <div className="delivery-stat">
                            <strong>4 - 8 HRS</strong>
                            <span>dispatch guarantee</span>
                        </div>

                        <div className="delivery-stat">
                            <strong>99.2%</strong>
                            <span>on-time record</span>
                        </div>

                        <div className="delivery-stat">
                            <strong>0</strong>
                            <span>minimum order quantity</span>
                        </div>

                    </div>

                    <a
                        href="/products?delivery=fast"
                        className="delivery-button"
                    >
                        <span>ONLY ON SELECTED ITEMS.</span>
                        <span className="delivery-button-arrow">→</span>
                    </a>

                </div>

            </div>

        </section>
    );
}

export default DeliveryChallenge;
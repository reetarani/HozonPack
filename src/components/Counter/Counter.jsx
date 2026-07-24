import "./Counter.css";
import counterData from "./CounterData";
import { useState, useEffect, useRef } from "react";

function AnimatedNumber({ end, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  // Start animation when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Counter animation
  useEffect(() => {
    if (!started) return;

    let startTime = null;
    const duration = 2000;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;

      const progress = Math.min((currentTime - startTime) / duration, 1);

      const value = progress * end;

      setCount(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [started, end]);

  return (
    <span ref={ref}>
      {Number.isInteger(end) ? Math.floor(count) : count.toFixed(1)}
      {suffix}
    </span>
  );
}

function Counter() {
  return (
    <section className="counter-section">
      <div className="container">
        <div className="counter-grid">
          {counterData.map((item) => (
            <div className="counter-item" key={item.id}>
              <h2>
                <AnimatedNumber
                  end={item.number}
                  suffix={item.suffix}
                />
              </h2>

              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Counter;
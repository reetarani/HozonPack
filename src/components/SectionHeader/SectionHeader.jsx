import "./SectionHeader.css";

function SectionHeader({ title, highlight, subtitle, align = "center" }) {
  return (
    <div className={`section-header ${align}`}>
      <h2>
        {title} <span className="highlight">{highlight}</span>
      </h2>

      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export default SectionHeader;
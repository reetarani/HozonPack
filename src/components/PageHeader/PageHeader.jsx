import "./PageHeader.css";

function PageHeader({ title, highlight, subtitle, align = "left" }) {
  return (
    <div className={`title-bar ${align}`}>
      <h1>
        {title} <span className="highlight">{highlight}</span>
      </h1>

      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export default PageHeader;
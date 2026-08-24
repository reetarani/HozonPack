import Button from "./Button";
import { FaPlus } from "react-icons/fa";

function PageHeader({
    title,
    subtitle,
    buttonText,
    onAdd,
    showButton = true,
    children,
}) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1 className="page-title">{title}</h1>

                {subtitle && (
                    <p className="text-muted mb-0">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="d-flex gap-2">
                {children}

                {showButton && (
                    <Button
                        text={buttonText}
                        icon={<FaPlus />}
                        variant="primary"
                        onClick={onAdd}
                    />
                )}
            </div>
        </div>
    );
}

export default PageHeader;
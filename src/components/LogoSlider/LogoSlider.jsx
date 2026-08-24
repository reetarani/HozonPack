import { useEffect, useState } from "react";
import "./LogoSlider.css";
import { getPublicClients } from "../../services/clientService";

function LogoSlider() {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response =
                    await getPublicClients();

                if (response.success) {
                    setClients(
                        response.clients || []
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load clients:",
                    error
                );
            }
        };

        fetchClients();
    }, []);

    return (
        <div
            className="logo-slider"
            id="clients"
        >
            <div className="logo-track">

                {clients.map((client) => (
                    <div
                        className="logo-item"
                        key={client._id}
                    >
                        {client.name}
                    </div>
                ))}

            </div>
        </div>
    );
}

export default LogoSlider;
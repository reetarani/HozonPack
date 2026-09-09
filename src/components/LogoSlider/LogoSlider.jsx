import { useEffect, useState } from "react";
import "./LogoSlider.css";

import { getPublicClients } from "../../services/clientService";
import { SERVER_URL } from "../../config/env";

import SectionHeader from "../SectionHeader/SectionHeader";

function LogoSlider() {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await getPublicClients();

                if (response.success) {
                    setClients(response.clients || []);
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
        <section className="clients-section" id="clients">

            <div className="container">

                <SectionHeader
                    title="Our"
                    highlight="Partners"
                />

                <div className="logo-slider">

                    <div className="logo-track">

                        {clients.map((client) => (
                            <div
                                className="logo-item"
                                key={client._id}
                            >
                                {client.logo && (
                                    <img
                                        src={`${SERVER_URL}${client.logo}`}
                                        alt={client.name || "Hozon Pack partner"}
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        ))}

                    </div>

                </div>

            </div>

        </section>
    );
}

export default LogoSlider;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SectionHeader from "../SectionHeader/SectionHeader";
import { getPublicIndustries } from "../../services/industryService";

import "./Industry.css";


/*
|--------------------------------------------------------------------------
| INDUSTRY THEMES
|--------------------------------------------------------------------------
|
| First theme:
| Uses your existing Hozon Pack gradient.
|
| Other themes:
| Follow the dark / warm visual treatment from the reference video.
|
|--------------------------------------------------------------------------
*/

const INDUSTRY_THEMES = [
    {
        background:
            "linear-gradient(110deg, #cdd6ff 0%, #999af5 45%, #4545e9 100%)",

        card: "#1d1c23",
    },

    {
        background:
            "linear-gradient(110deg, #303942 0%, #263039 50%, #1e272e 100%)",

        card: "#202329",
    },

    {
        background:
            "linear-gradient(110deg, #8b693e 0%, #9e7541 50%, #67451f 100%)",

        card: "#1d1c23",
    },

    {
        background:
            "linear-gradient(110deg, #4a465d 0%, #363747 50%, #272934 100%)",

        card: "#1d1c23",
    },
];


function Industries({
    initialIndustries = [],
}) {

    const navigate = useNavigate();


    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [industries, setIndustries] =
        useState(initialIndustries);

    const [activeIndustry, setActiveIndustry] =
        useState(0);


    /*
    |--------------------------------------------------------------------------
    | Fetch Industries
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (initialIndustries.length > 0) {
            return;
        }

        const fetchIndustries = async () => {

            try {

                const response =
                    await getPublicIndustries();

                if (response.success) {

                    setIndustries(
                        response.industries || []
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to load industries:",
                    error
                );

            }

        };

        fetchIndustries();

    }, [initialIndustries]);


    /*
    |--------------------------------------------------------------------------
    | No industries
    |--------------------------------------------------------------------------
    */

    if (!industries.length) {
        return null;
    }


    /*
    |--------------------------------------------------------------------------
    | Only show first 4
    |--------------------------------------------------------------------------
    */

    const visibleIndustries =
        industries.slice(0, 4);


    /*
    |--------------------------------------------------------------------------
    | Keep active index valid
    |--------------------------------------------------------------------------
    */

    const safeActiveIndex =
        activeIndustry >= visibleIndustries.length
            ? 0
            : activeIndustry;


    /*
    |--------------------------------------------------------------------------
    | Current theme
    |--------------------------------------------------------------------------
    */

    const activeTheme =
        INDUSTRY_THEMES[
            safeActiveIndex %
            INDUSTRY_THEMES.length
        ];


    /*
    |--------------------------------------------------------------------------
    | Change Industry
    |--------------------------------------------------------------------------
    */

    const handleIndustryClick = (industry) => {

        const index =
            visibleIndustries.findIndex(
                (item) =>
                    item._id === industry._id
            );

        if (index === -1) {
            return;
        }

        if (index === safeActiveIndex) {
            return;
        }

        setActiveIndustry(index);

    };


    /*
    |--------------------------------------------------------------------------
    | View Industry
    |--------------------------------------------------------------------------
    */

   const handleViewIndustry = (industry) => {

    if (!industry?.slug) {
        console.error(
            "Industry slug missing:",
            industry
        );

        return;
    }

    navigate(
        `/products?industry=${encodeURIComponent(
            industry.slug
        )}`
    );

};

    /*
    |--------------------------------------------------------------------------
    | Description List
    |--------------------------------------------------------------------------
    */

    const DescriptionList = ({
        industry,
    }) => {

        if (
            !Array.isArray(
                industry?.descriptionList
            )
        ) {
            return null;
        }

        const items =
            industry.descriptionList.filter(
                (item) =>
                    item?.label ||
                    item?.value
            );

        if (!items.length) {
            return null;
        }

        return (

            <div className="industry-description-list">

                {items.map(
                    (item, index) => (

                        <div
                            className="industry-description-item"
                            key={
                                `${item.label || "item"}-${index}`
                            }
                        >

                            <div className="industry-description-label">
                                {item.label}
                            </div>

                            <div className="industry-description-value">
                                {item.value}
                            </div>

                        </div>

                    )
                )}

            </div>

        );

    };


    /*
    |--------------------------------------------------------------------------
    | Active Card
    |--------------------------------------------------------------------------
    */

    const ActiveCard = ({
        industry,
    }) => {

        return (

            <div
                className="industry-active-card"
                style={{
                    "--industry-card-color":
                        activeTheme.card,
                }}
            >

                <div className="industry-active-content">

                    {industry.subtitle && (

                        <div className="industry-eyebrow">
                            {industry.subtitle}
                        </div>

                    )}


                    <h2>
                        {industry.name}
                    </h2>


                    {industry.description && (

                        <p className="industry-active-description">
                            {industry.description}
                        </p>

                    )}


                    <DescriptionList
                        industry={industry}
                    />


                    <div className="industry-active-footer">

                        <button
                            type="button"
                            className="industry-view-link"
                            onClick={() =>
                                handleViewIndustry(
                                    industry
                                )
                            }
                        >

                            <span>
                                View {industry.name} packaging
                            </span>

                            <span className="industry-view-arrow">
                                →
                            </span>

                        </button>


                        {industry.productCount !==
                            undefined && (

                            <span className="industry-product-count">
                                {industry.productCount} products
                            </span>

                        )}

                    </div>

                </div>

            </div>

        );

    };


    /*
    |--------------------------------------------------------------------------
    | Small Card
    |--------------------------------------------------------------------------
    */

    const SmallCard = ({
        industry,
    }) => {

        return (

            <button
                type="button"
                className="industry-small-card"
                onClick={() =>
                    handleIndustryClick(
                        industry
                    )
                }
            >

                <span className="industry-small-name">
                    {industry.name}
                </span>

                <span className="industry-small-view">
                    Tap to view
                </span>

            </button>

        );

    };


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <section
            className="industries"
            id="industries"
        >

            <div className="container">


                {/* =====================================================
                    SECTION HEADER
                ===================================================== */}

                <SectionHeader
                    title="Industry"
                    highlight="Expertise"
                    subtitle="Tailored packaging solutions for every sector"
                />


                {/* =====================================================
                    INDUSTRY SHOWCASE
                ===================================================== */}

                <div
                    className="industry-showcase"
                    style={{
                        "--industry-background":
                            activeTheme.background,
                    }}
                >

                    <div className="industry-track">

                        {visibleIndustries.map(
                            (industry, index) => {

                                const isActive =
                                    index ===
                                    safeActiveIndex;

                                return (

                                    <div
                                        key={
                                            industry._id ||
                                            `${industry.name}-${index}`
                                        }
                                        className={`
                                            industry-card
                                            ${
                                                isActive
                                                    ? "is-active"
                                                    : "is-small"
                                            }
                                        `}
                                    >

                                        {isActive ? (

                                            <ActiveCard
                                                industry={
                                                    industry
                                                }
                                            />

                                        ) : (

                                            <SmallCard
                                                industry={
                                                    industry
                                                }
                                            />

                                        )}

                                    </div>

                                );

                            }
                        )}

                    </div>

                </div>


            </div>

        </section>

    );

}


export default Industries;
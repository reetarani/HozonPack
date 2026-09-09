import "./topbar.css";
import {
    HiOutlineClipboardDocument,
    HiCheck,
} from "react-icons/hi2";
import { useEffect, useState } from "react";

import { getPublicTopBar } from "../../services/topbarService";

function getRemainingTime(endDate) {
    const difference =
        new Date(endDate).getTime() - Date.now();

    if (difference <= 0) {
        return "Expired";
    }

    const totalSeconds = Math.floor(
        difference / 1000
    );

    const days = Math.floor(
        totalSeconds / 86400
    );

    const hours = Math.floor(
        (totalSeconds % 86400) / 3600
    );

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );

    return `${days}d ${hours}h ${minutes}m`;
}

function TopBar({ initialTopBar = null }) {
    const [topBar, setTopBar] =
        useState(initialTopBar);

    const [copied, setCopied] =
        useState(false);

    const [remainingTime, setRemainingTime] =
        useState("");

    // Load Top Bar if SSR data is not available
    useEffect(() => {
        if (initialTopBar) {
            return;
        }

        const fetchTopBar = async () => {
            try {
                const response =
                    await getPublicTopBar();

                if (response.success) {
                    setTopBar(
                        response.topBar || null
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load top bar:",
                    error
                );
            }
        };

        fetchTopBar();
    }, [initialTopBar]);

    // Countdown
    useEffect(() => {
        if (!topBar?.endDate) {
            return;
        }

        const updateCountdown = () => {
            setRemainingTime(
                getRemainingTime(
                    topBar.endDate
                )
            );
        };

        updateCountdown();

        const interval = setInterval(
            updateCountdown,
            1000
        );

        return () => {
            clearInterval(interval);
        };
    }, [topBar?.endDate]);

    const copyCoupon = async () => {
        if (!topBar?.couponCode) {
            return;
        }

        try {
            await navigator.clipboard.writeText(
                topBar.couponCode
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error(
                "Failed to copy coupon:",
                error
            );
        }
    };

    if (!topBar || !topBar.isActive) {
        return null;
    }

    const offer = (
        <>
            <span>
                {topBar.title}
            </span>

            <span>|</span>

            {topBar.couponCode && (
                <>
                    <span>
                        Code:{" "}
                        <strong>
                            {topBar.couponCode}
                        </strong>
                    </span>

                    <button
                        type="button"
                        className="copy-btn"
                        onClick={copyCoupon}
                        aria-label="Copy coupon code"
                    >
                        {copied ? (
                            <HiCheck />
                        ) : (
                            <HiOutlineClipboardDocument />
                        )}
                    </button>

                    <span>|</span>
                </>
            )}

            <span>
                Ends in{" "}
                {remainingTime || "..."}
            </span>

            <span>|</span>

            <a
                href={
                    topBar.linkUrl || "/"
                }
            >
                {topBar.linkText ||
                    "Shop now"}
            </a>
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
export const scrollToError = (errors) => {
    const firstErrorField = Object.keys(errors)[0];

    if (!firstErrorField) return;

    setTimeout(() => {
        const element = document.querySelector(
            `[name="${firstErrorField}"]`
        );

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            element.focus();
        }
    }, 0);
};
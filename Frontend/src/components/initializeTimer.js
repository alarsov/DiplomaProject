const initializeTimer = (durationInSeconds) => {
    const countToDate = new Date().getTime() + durationInSeconds * 1000;

    const flipAllCards = (time) => {
        const seconds = time % 60;
        const minutes = Math.floor(time / 60) % 60;

        flip(document.querySelector("[data-minutes]"), minutes);
        flip(document.querySelector("[data-seconds]"), seconds);
    };

    const flip = (flipCard, newNumber) => {
        const cardTop = flipCard.querySelector("[data-card-top]");
        const startNumber = cardTop ? parseInt(cardTop.textContent, 10) : 0;

        const cardBot = flipCard.querySelector("[data-card-bot]"),
            topFlip = flipCard.querySelector("[data-flip-top]"),
            botFlip = flipCard.querySelector("[data-flip-bot]"),
            topFlipNum = flipCard.querySelector("[data-flip-top-num]"),
            botFlipNum = flipCard.querySelector("[data-flip-bot-num]");

        if (newNumber === startNumber) return;

        const displayStartNum = String(startNumber).padStart(2, "0");
        const displayNewNum = String(newNumber).padStart(2, "0");

        cardTop.textContent = displayStartNum;
        cardBot.textContent = displayStartNum;
        topFlipNum.textContent = displayStartNum;
        botFlipNum.textContent = displayNewNum;

        topFlip.classList.add("flip-card-top");
        botFlip.classList.add("flip-card-bottom");

        const anim = (el, event, callback) => {
            const handler = () => {
                el.removeEventListener(event, handler);
                callback();
            };
            el.addEventListener(event, handler);
        };

        anim(topFlip, "animationstart", () => {
            cardTop.textContent = displayNewNum;
        });

        anim(topFlip, "animationend", () => {
            topFlipNum.innerText = displayNewNum;
            topFlip.classList.remove("flip-card-top");
        });

        anim(botFlip, "animationend", () => {
            cardBot.textContent = displayNewNum;
            botFlip.classList.remove("flip-card-bottom");
        });
    };

    const updateTimer = () => {
        const currentDate = new Date().getTime();
        const timeBetweenDates = Math.ceil((countToDate - currentDate) / 1000);
        if (timeBetweenDates <= 0) {
            clearInterval(timerInterval);
            flipAllCards(0);
            return;
        }
        flipAllCards(timeBetweenDates);
    };

    const timerInterval = setInterval(updateTimer, 250);
};

export { initializeTimer };

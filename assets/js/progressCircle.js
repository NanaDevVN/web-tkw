function initProgressCircle() {
    function updateProgressCircle() {
        const progressCircle = document.querySelector('#progressCircle .circle-progress');
        const percentageText = document.querySelector('#progressCircle .percentage');
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        const roundedPercent = Math.round(scrollPercent);

        percentageText.textContent = `${roundedPercent}%`;
        const circumference = 175.84;
        const offset = circumference * (1 - roundedPercent / 100);
        progressCircle.style.strokeDashoffset = offset;
    }

    document.getElementById('progressCircle').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', updateProgressCircle);
}

export { initProgressCircle };
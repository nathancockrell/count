document.addEventListener('DOMContentLoaded', () => {
    const numberDisplay = document.getElementById('number-display');
    const incrementButton = document.getElementById('increment-button');
    const incrementValueInput = document.getElementById('increment-value');
    const container = document.querySelector('.container');
    const alertBox = document.getElementById('alert');
    let isAnimating = false;

    incrementButton.addEventListener('click', () => {
        const incrementValue = parseInt(incrementValueInput.value);

        if (isAnimating) return; // Prevent multiple animations at the same time

        if (incrementValue > 100) {
            showAlert("Maximum increment is 100!");
            incrementValueInput.value = "";
            return;
        }

        if (incrementValue) {
            const currentNumber = parseInt(numberDisplay.textContent);
            const targetNumber = currentNumber + incrementValue;
            incrementValueInput.value = ''; // Clear the input field
            hideAlert(); // Hide the alert if visible
            animateNumber(currentNumber, targetNumber, numberDisplay);
            animateBackground(incrementValue);
        } else {
            const currentNumber = parseInt(numberDisplay.textContent);
            numberDisplay.textContent = currentNumber + 1;
            animateBackground(1);
        }
    });

    function showAlert(message) {
        alertBox.textContent = message;
        alertBox.classList.add('visible');
        setTimeout(() => hideAlert(), 3000); // Hide alert after 3 seconds
    }

    function hideAlert() {
        alertBox.classList.remove('visible');
    }

    function animateNumber(start, end, element) {
        const duration = 2000; // Total animation time in milliseconds
        const startTime = performance.now();
        isAnimating = true;

        function updateAnimation(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Ensure progress is capped at 1

            // Apply an ease-in-out cubic function for the animation
            const easedProgress = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const currentNumber = Math.round(start + (end - start) * easedProgress);

            element.textContent = currentNumber;

            if (elapsedTime < duration) {
                requestAnimationFrame(updateAnimation);
            } else {
                element.textContent = end; // Ensure it ends exactly at the target number
                isAnimating = false;
            }
        }

        requestAnimationFrame(updateAnimation);
    }

    function animateBackground(incrementValue) {
        const animationDuration = calculateAnimationDuration(incrementValue);
        const colorCycleCount = Math.ceil(incrementValue / 5);
        const colors = generateColors(colorCycleCount);

        let startTime = performance.now();

        function updateBackground(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1); // Ensure progress is capped at 1

            const currentColorIndex = Math.floor(progress * colorCycleCount);
            const currentColor = colors[Math.min(currentColorIndex, colors.length - 1)];
            const opacityProgress = Math.sin(progress * Math.PI);

            // Ensure currentColor is defined before applying opacity
            if (currentColor) {
                const colorWithOpacity = addOpacityToColor(currentColor, opacityProgress);
                container.style.backgroundColor = colorWithOpacity;
            } else {
                console.error('Current color is undefined at index:', currentColorIndex);
            }

            if (elapsedTime < animationDuration) {
                requestAnimationFrame(updateBackground);
            } else {
                container.style.backgroundColor = ''; // Reset background color
            }
        }

        requestAnimationFrame(updateBackground);
    }

    function calculateAnimationDuration(incrementValue) {
        const baseDuration = 1000; // 1 second for an increment of 30
        const maxDuration = 5000;  // Max duration capped at 5 seconds
        const scale = (incrementValue <= 30) ? incrementValue / 30 : Math.log10(incrementValue) + 1;

        return Math.min(maxDuration, baseDuration * scale);
    }

    function generateColors(count) {
        const colors = ['rgba(137, 207, 240, .2)', 'rgba(255, 255, 0, 1)', 'rgba(0, 128, 0, 1)'];
        for (let i = 3; i < count; i++) {
            const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`;
            colors.push(randomColor);
        }
        return colors;
    }

    function addOpacityToColor(color, opacity) {
        if (typeof color !== 'string') {
            console.error('Invalid color:', color);
            return color;
        }

        if (color.startsWith('rgba')) {
            return color.replace(/, ?[0-9.]+\)$/, `, ${opacity})`);
        } else if (color.startsWith('rgb')) {
            return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
        } else {
            console.error('Color format not recognized:', color);
            return color;
        }
    }
});

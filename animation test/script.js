document.addEventListener('DOMContentLoaded', () => {
    const numberDisplay = document.getElementById('number-display');
    const incrementButton = document.getElementById('increment-button');
    const incrementValueInput = document.getElementById('increment-value');
    const body = document.body; // Target the body instead of the container
    const alertBox = document.getElementById('alert');
    let isAnimating = false;

    incrementButton.addEventListener('click', () => {
        const incrementValue = parseInt(incrementValueInput.value);

        if (isAnimating) return; // Prevent multiple animations at the same time

        if (incrementValue > 100) {
            showAlert("Maximum increment is 100!");
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
                body.style.backgroundColor = colorWithOpacity;
            } else {
                console.error('Current color is undefined at index:', currentColorIndex);
            }

            if (elapsedTime < animationDuration) {
                requestAnimationFrame(updateBackground);
            } else {
                body.style.backgroundColor = ''; // Reset background color
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
        const colors = [];
    
        // Predefined close-to-white colors
        const baseColors = [
            'rgba(255, 255, 240, 1)', // Light yellowish
            'rgba(240, 255, 255, 1)', // Light cyan
            'rgba(255, 240, 245, 1)', // Light pink
            'rgba(245, 255, 250, 1)', // Light greenish
            'rgba(250, 250, 255, 1)'  // Light bluish
        ];
    
        for (let i = 0; i < count; i++) {
            const randomColor = `rgba(${200 + Math.floor(Math.random() * 56)}, ${200 + Math.floor(Math.random() * 56)}, ${200 + Math.floor(Math.random() * 56)}, 1)`;
            colors.push(randomColor);
        }
    
        return colors.concat(baseColors.slice(0, count - colors.length));
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

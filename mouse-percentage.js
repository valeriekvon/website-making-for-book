// Mouse position tracking and percentage calculation
document.addEventListener('DOMContentLoaded', () => {
    // Get the text element and display area
    const textElement = document.getElementById('text');
    const displayArea = document.querySelector('main.display');

    // Function to calculate and update percentages based on mouse position
    function updatePercentages(event) {
        // Only process if we're inside the display area
        if (!displayArea.contains(event.target)) return;

        // Get the display area dimensions and position
        const displayRect = displayArea.getBoundingClientRect();
        
        // Calculate relative mouse position within the display area
        const relativeX = event.clientX - displayRect.left;
        const relativeY = event.clientY - displayRect.top;

        // Calculate percentages based on position within display area
        // For vertical position (Y-axis) - controls size (opsz)
        const topPercentage = Math.round((relativeY / displayRect.height) * 100);
        const bottomPercentage = 100 - topPercentage;

        // For horizontal position (X-axis) - controls width (wdth)
        const leftPercentage = Math.round((relativeX / displayRect.width) * 100);
        const rightPercentage = 100 - leftPercentage;

        // Clamp values between 0 and 100
        const clampedTopPercentage = Math.max(0, Math.min(100, topPercentage));
        const clampedBottomPercentage = Math.max(0, Math.min(100, bottomPercentage));
        const clampedLeftPercentage = Math.max(0, Math.min(100, leftPercentage));
        const clampedRightPercentage = Math.max(0, Math.min(100, rightPercentage));

        // Update the percentages in the edge labels
        const percentElements = document.querySelectorAll('.percent');
        percentElements.forEach(element => {
            const parentClass = element.parentElement.classList;
            if (parentClass.contains('bottom')) {
                element.textContent = `${clampedTopPercentage}%`;
            } else if (parentClass.contains('top')) {
                element.textContent = `${clampedBottomPercentage}%`;
            } else if (parentClass.contains('right')) {
                element.textContent = `${clampedLeftPercentage}%`;
            } else if (parentClass.contains('left')) {
                element.textContent = `${clampedRightPercentage}%`;
            }
        });

        // Update CSS variables
        document.documentElement.style.setProperty('--top-percentage', `${clampedTopPercentage}%`);
        document.documentElement.style.setProperty('--bottom-percentage', `${clampedBottomPercentage}%`);
        document.documentElement.style.setProperty('--left-percentage', `${clampedLeftPercentage}%`);
        document.documentElement.style.setProperty('--right-percentage', `${clampedRightPercentage}%`);

        // Calculate font variation settings
        // Map vertical mouse position (topPercentage) to opsz (50.1 to 100)
        const opsz = 50.1 + ((100 - 50.1) * (clampedBottomPercentage / 100));
        
        // Use left percentage directly for width (0 to 100)
        const wdth = clampedLeftPercentage;
        
        // Keep the weight value from the slider
        const wghtSlider = document.getElementById('wght');
        const wght = wghtSlider ? wghtSlider.value : 0;

        // Apply font variation settings
        if (textElement) {
            textElement.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'opsz' ${opsz}`;
        }
    }

    // Add mousemove event listener to the display area only
    displayArea.addEventListener('mousemove', updatePercentages);
    
    // Add mouseleave event to reset or maintain last values when leaving the area
    displayArea.addEventListener('mouseleave', () => {
        // Optional: You can choose to reset values here or keep the last values
        // For now, we'll keep the last values
    });




    
}); 


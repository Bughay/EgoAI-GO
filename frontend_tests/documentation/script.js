document.addEventListener('DOMContentLoaded', function() {
    const contentParagraph = document.querySelector('.content p');

    // Event listeners for main sidebar items
    const mainItems = document.querySelectorAll('.main-sidebar-item');
    mainItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            const subList = this.nextElementSibling; // The ul element
            if (subList) {
                subList.classList.toggle('active');
                this.classList.toggle('active'); // Also toggle on the anchor for visual feedback
            }
        });
    });

    // Event listeners for sub sidebar items
    const subItems = document.querySelectorAll('.sub-sidebar-item');
    subItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            const subText = this.textContent;
            console.log('Selected sub-item:', subText);

            // Toggle 'active' class on the clicked sub item
            this.classList.toggle('active');

            if (contentParagraph) {
                contentParagraph.textContent = 'Content for ' + subText;
            }
        });
    });
});
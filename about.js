
const openMenu = document.getElementById("openMenu");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");

// When the user clicks the open menu button, open the menu
openMenu.addEventListener("click", function() {
    sideMenu.style.width = "250px";  // Show the menu
    document.body.style.marginLeft = "250px"; // Move content to the right
});

// When the user clicks the close button inside the menu, close the menu
closeMenu.addEventListener("click", function() {
    sideMenu.style.width = "0";  // Hide the menu
    document.body.style.marginLeft = "0"; // Move content back to the original position
});
document.addEventListener('contextmenu', function(event) {
    event.preventDefault(); // Disable right-click
    alert('Right-click is disabled on this page!'); // Optional alert for user feedback
});
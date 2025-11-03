// *** IMPORTANT ***
// If you test locally, use: 'http://localhost:3000'
// After deploying, change this to your live server URL!
const API_URL = 'https://mpmc-project.onrender.com'; 

const parkingLot = document.getElementById('parking-lot');
const bookButton = document.getElementById('bookButton');
const messageEl = document.getElementById('message');

// Function to fetch and display the parking slots
async function fetchSlots() {
    try {
        const response = await fetch(`${API_URL}/status`);
        const slots = await response.json();

        parkingLot.innerHTML = ''; // Clear existing slots
        let allBooked = true;

        slots.forEach((isBooked, index) => {
            const slotDiv = document.createElement('div');
            const slotNumber = index + 1;
            slotDiv.classList.add('slot');
            
            if (isBooked) {
                slotDiv.classList.add('booked');
                slotDiv.textContent = `Slot ${slotNumber} (Booked)`;
                slotDiv.title = 'Click to release this slot';
                // Add click event to release the slot
                slotDiv.addEventListener('click', () => releaseSlot(slotNumber));
            } else {
                slotDiv.classList.add('available');
                slotDiv.textContent = `Slot ${slotNumber} (Free)`;
                slotDiv.title = 'This slot is available';
                allBooked = false; // We found at least one free slot
            }
            parkingLot.appendChild(slotDiv);
        });

        // Disable book button if all slots are booked
        bookButton.disabled = allBooked;
        if (allBooked) {
            messageEl.textContent = 'Parking is full!';
            messageEl.style.color = 'red';
        }

    } catch (error) {
        console.error('Error fetching slots:', error);
        messageEl.textContent = 'Error connecting to server.';
        messageEl.style.color = 'red';
    }
}

// Function to book a slot
async function bookSlot() {
    try {
        const response = await fetch(`${API_URL}/book`, {
            method: 'POST'
        });
        const result = await response.json();

        if (result.success) {
            messageEl.textContent = result.message;
            messageEl.style.color = 'green';
        } else {
            messageEl.textContent = result.message;
            messageEl.style.color = 'red';
        }
        
        fetchSlots(); // Refresh the parking lot view
    } catch (error) {
        console.error('Error booking slot:', error);
    }
}

// Function to release a slot
async function releaseSlot(slotNumber) {
    if (!confirm(`Are you sure you want to release Slot ${slotNumber}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/release/${slotNumber}`, {
            method: 'POST'
        });
        const result = await response.json();

        if (result.success) {
            messageEl.textContent = result.message;
            messageEl.style.color = 'blue';
        } else {
            messageEl.textContent = result.message;
            messageEl.style.color = 'red';
        }

        fetchSlots(); // Refresh the parking lot view
    } catch (error) {
        console.error('Error releasing slot:', error);
    }
}

// Add event listener to the book button
bookButton.addEventListener('click', bookSlot);

// Initial load
fetchSlots();
const express = require('express');
const cors = require('cors');
const path = require('path'); // <-- 1. ADD THIS LINE
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allows your website to talk to this server
app.use(express.json()); // Allows server to read JSON
app.use(express.static(__dirname)); // <-- ADD THIS LINE
// This line lets your server find style.css and script.js
app.use(express.static(__dirname)); 

// 2. ADD THIS BLOCK
// This new line specifically sends index.html when someone visits the main URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize our 20 parking slots. 'false' means available.
let parkingSlots = new Array(20).fill(false);

// ENDPOINT 1: Get the status of all slots
app.get('/status', (req, res) => {
  res.json(parkingSlots);
});

// ENDPOINT 2: Book the next available slot
app.post('/book', (req, res) => {
  const availableSlot = parkingSlots.findIndex(slot => slot === false);

  if (availableSlot !== -1) {
    // Slot is available
    parkingSlots[availableSlot] = true; // Mark as booked
    console.log(`Slot ${availableSlot + 1} booked`);
    res.json({ success: true, slot: availableSlot + 1, message: `Slot ${availableSlot + 1} booked!` });
  } else {
    // No slots available
    console.log('Booking failed: No slots available');
    res.json({ success: false, message: 'No slots available' });
  }
});

// ENDPOINT 3: Release a specific slot
app.post('/release/:id', (req, res) => {
  const slotId = parseInt(req.params.id, 10) - 1; // Convert from 1-based to 0-based index

  if (slotId >= 0 && slotId < parkingSlots.length && parkingSlots[slotId]) {
    parkingSlots[slotId] = false; // Mark as available
    console.log(`Slot ${slotId + 1} released`);
    res.json({ success: true, message: `Slot ${slotId + 1} released` });
  } else {
    res.status(400).json({ success: false, message: 'Invalid or already available slot' });
  }
});

app.listen(PORT, () => {
  console.log(`Parking server running on http://localhost:${PORT}`);
});
// --- Pricing Constants (From RFP) ---
const RATES = {
    base: 50, // per hour
    minFee: 75, // if < 2 hours
    projFee: 150, // per hour
    spkrFee: 150  // per hour
};

// --- Booking Logic ---
function calculateTotal() {
    const hours = parseFloat(document.getElementById('duration').value) || 0;
    const hasProjector = document.getElementById('projector').checked;
    const hasSpeaker = document.getElementById('speaker').checked;
    
    let roomCost = 0;
    let equipCost = 0;

    // Logic: Minimum fee of 75 if less than 2 hours
    if (hours < 2) {
        roomCost = RATES.minFee;
    } else {
        roomCost = hours * RATES.base;
    }

    // Logic: Equipment is per hour
    if (hasProjector) equipCost += (RATES.projFee * hours);
    if (hasSpeaker) equipCost += (RATES.spkrFee * hours);

    const total = roomCost + equipCost;

    return { roomCost, equipCost, total };
}

function updateEstimate() {
    const costs = calculateTotal();
    document.getElementById('live-total').innerText = `PHP ${costs.total.toFixed(2)}`;
}

function submitBooking(event) {
    event.preventDefault();
    
    // Validation
    const name = document.getElementById('name').value;
    const studentId = document.getElementById('studentId').value;
    const date = document.getElementById('date').value;
    
    if(!name || !studentId || !date) {
        alert("Please fill in all required fields.");
        return;
    }

    const costs = calculateTotal();
    
    // Create Booking Object
    const booking = {
        id: Date.now(), // Simple unique ID
        name,
        studentId,
        date,
        time: document.getElementById('time').value,
        hours: document.getElementById('duration').value,
        total: costs.total
    };

    // Save to LocalStorage (Simulating Database)
    let bookings = JSON.parse(localStorage.getItem('batCaveBookings')) || [];
    bookings.push(booking);
    localStorage.setItem('batCaveBookings', JSON.stringify(bookings));

    // Show Confirmation
    const resultDiv = document.getElementById('quote-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3>✅ Reservation Confirmed!</h3>
        <p>Thank you, <strong>${name}</strong>.</p>
        <p>Total Estimated Cost: <strong style="color: var(--accent-gold); font-size: 1.2em;">PHP ${costs.total.toFixed(2)}</strong></p>
        <p><small>Please present your Student ID (${studentId}) upon arrival at Malvar.</small></p>
    `;
    
    document.getElementById('booking-form').reset();
}

// --- Admin Logic ---
function loadAdminData() {
    const tableBody = document.getElementById('admin-table-body');
    const bookings = JSON.parse(localStorage.getItem('batCaveBookings')) || [];

    if (bookings.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='6'>No bookings found.</td></tr>";
        return;
    }

    tableBody.innerHTML = "";
    bookings.forEach(b => {
        const row = `
            <tr>
                <td>${b.date}</td>
                <td>${b.time}</td>
                <td>${b.name}</td>
                <td>${b.studentId}</td>
                <td>${b.hours} hrs</td>
                <td class="price">₱${b.total}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function adminLogin() {
    const pass = document.getElementById('admin-pass').value;
    if(pass === "admin123") {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadAdminData();
    } else {
        alert("Access Denied: Incorrect Password");
    }
}
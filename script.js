/* ==========================================================================
   Silent SOS Emergency Web App - Complete JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        isArmed: false,
        holdTimer: null,
        holdProgress: 0,
        holdDuration: 2000, // 2 seconds hold requirement
        location: {
            lat: 26.8467,
            lng: 80.9462,
            accuracy: 12,
            timestamp: null
        },
        contacts: [
            { id: 1, name: 'Ananya Sharma (Sister)', phone: '+91 98765 43210', status: 'Pending' },
            { id: 2, name: 'Local Police Control', phone: '112', status: 'Pending' },
            { id: 3, name: 'Rahul Verma (Colleague)', phone: '+91 91234 56789', status: 'Pending' }
        ],
        logs: []
    };

    // --- DOM Elements ---
    const sosButton = document.getElementById('sosButton');
    const sosProgressCircle = document.getElementById('sosProgressCircle');
    const latValue = document.getElementById('latValue');
    const lngValue = document.getElementById('lngValue');
    const accuracyValue = document.getElementById('accuracyValue');
    const lastUpdatedValue = document.getElementById('lastUpdatedValue');
    const contactListEl = document.getElementById('contactList');
    const activityLogEl = document.getElementById('activityLog');
    const decoyToggleBtn = document.getElementById('decoyToggleBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const addContactBtn = document.getElementById('addContactBtn');
    const contactNameInput = document.getElementById('contactNameInput');
    const contactPhoneInput = document.getElementById('contactPhoneInput');

    // --- Initialization ---
    initApp();

    function initApp() {
        renderContacts();
        addLog('System initialized. Ready for silent activation.');
        startLocationTracking();
        setupEventListeners();
    }

    // --- Event Listeners Setup ---
    function setupEventListeners() {
        // Touch & Mouse events for Long-Press SOS Trigger
        ['mousedown', 'touchstart'].forEach(eventType => {
            sosButton.addEventListener(eventType, startSosHold);
        });

        ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(eventType => {
            sosButton.addEventListener(eventType, cancelSosHold);
        });

        // Decoy Mode Toggle
        if (decoyToggleBtn) {
            decoyToggleBtn.addEventListener('click', toggleDecoyMode);
        }

        // Theme Toggle
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', toggleTheme);
        }

        // Add Contact
        if (addContactBtn) {
            addContactBtn.addEventListener('click', handleAddContact);
        }
    }

    // --- Long-Press SOS Mechanics ---
    function startSosHold(e) {
        e.preventDefault();
        if (state.isArmed) return; // If already active, don't trigger hold again

        const startTime = Date.now();
        const circumference = 628; // 2 * pi * r (r=100)

        state.holdTimer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / state.holdDuration, 1);

            // Update SVG Circle stroke-dashoffset
            const offset = circumference - (progress * circumference);
            if (sosProgressCircle) {
                sosProgressCircle.style.strokeDashoffset = offset;
            }

            if (progress >= 1) {
                clearInterval(state.holdTimer);
                triggerEmergencySOS();
            }
        }, 20);
    }

    function cancelSosHold() {
        if (state.isArmed) return;
        if (state.holdTimer) {
            clearInterval(state.holdTimer);
            state.holdTimer = null;
        }
        if (sosProgressCircle) {
            sosProgressCircle.style.strokeDashoffset = 628;
        }
    }

    // --- Trigger Emergency State ---
    function triggerEmergencySOS() {
        state.isArmed = true;

        // Update UI silently (no sound or disruptive flashes)
        sosButton.classList.add('active-alert');
        sosButton.innerHTML = 'SOS<br><span class="sos-button-subtext">ACTIVE</span>';

        addLog('CRITICAL: Silent SOS triggered successfully.');

        // Update contact statuses progressively
        state.contacts.forEach((contact, index) => {
            setTimeout(() => {
                contact.status = 'Sent';
                renderContacts();
                addLog(`Alert dispatched to ${contact.name} (${contact.phone})`);

                // Simulate acknowledgement after 3 seconds
                setTimeout(() => {
                    contact.status = 'Acknowledged';
                    renderContacts();
                    addLog(`${contact.name} acknowledged receipt of emergency alert.`);
                }, 3000 + (index * 1500));
            }, 1000 + (index * 1000));
        });
    }

    // --- Location Tracking Simulation ---
    function startLocationTracking() {
        updateLocationDisplay();

        // Periodic refresh simulation
        setInterval(() => {
            // Minor coordinate jitter to simulate live tracking
            state.location.lat += (Math.random() - 0.5) * 0.0002;
            state.location.lng += (Math.random() - 0.5) * 0.0002;
            state.location.timestamp = new Date().toLocaleTimeString();
            updateLocationDisplay();
        }, 5000);
    }

    function updateLocationDisplay() {
        if (latValue) latValue.textContent = state.location.lat.toFixed(6);
        if (lngValue) lngValue.textContent = state.location.lng.toFixed(6);
        if (accuracyValue) accuracyValue.textContent = `${state.location.accuracy}m`;
        if (lastUpdatedValue) lastUpdatedValue.textContent = state.location.timestamp || new Date().toLocaleTimeString();
    }

    // --- Render Contacts ---
    function renderContacts() {
        if (!contactListEl) return;
        contactListEl.innerHTML = '';

        state.contacts.forEach(contact => {
            const li = document.createElement('li');
            li.className = 'contact-item';

            let badgeClass = 'badge-pending';
            if (contact.status === 'Sent') badgeClass = 'badge-sent';
            if (contact.status === 'Acknowledged') badgeClass = 'badge-ack';

            li.innerHTML = `
        <div class="contact-info">
          <span class="contact-name">${contact.name}</span>
          <span class="contact-detail">${contact.phone}</span>
        </div>
        <span class="status-badge ${badgeClass}">${contact.status}</span>
      `;
            contactListEl.appendChild(li);
        });
    }

    // --- Add New Contact Handler ---
    function handleAddContact() {
        const name = contactNameInput.value.trim();
        const phone = contactPhoneInput.value.trim();

        if (!name || !phone) {
            alert('Please fill in both contact name and phone number.');
            return;
        }

        const newContact = {
            id: Date.now(),
            name,
            phone,
            status: 'Pending'
        };

        state.contacts.push(newContact);
        renderContacts();
        addLog(`Trusted contact added: ${name}`);

        contactNameInput.value = '';
        contactPhoneInput.value = '';
    }

    // --- Activity Logging System ---
    function addLog(message) {
        const timeStr = new Date().toLocaleTimeString();
        state.logs.unshift({ time: timeStr, message });

        if (!activityLogEl) return;
        activityLogEl.innerHTML = '';

        state.logs.forEach(log => {
            const div = document.createElement('div');
            div.className = 'log-entry';
            div.innerHTML = `
        <span class="log-time">[${log.time}]</span>
        <span class="log-msg">${log.message}</span>
      `;
            activityLogEl.appendChild(div);
        });
    }

    // --- Decoy Mode (Disguise View) ---
    function toggleDecoyMode() {
        document.body.classList.toggle('decoy-active');
    }

    // --- Theme Toggle ---
    function toggleTheme() {
        document.body.classList.toggle('light-theme');
    }
});
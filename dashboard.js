let allHotels = [];

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('user-name-side').textContent = user.name;
        document.getElementById('user-initials').textContent = user.name.charAt(0);
    } else {
        window.location.href = 'index.html';
    }

    // Récupérer la dernière section visitée ou Dashboard par défaut
    const lastSection = localStorage.getItem('lastSection') || 'dashboard';
    showSection(lastSection);
    updateStats();

    // Barre de recherche
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            filterHotels(term);
        });
    }

    document.getElementById('open-modal-btn').onclick = toggleModal;
});

// --- NAVIGATION ---
function showSection(name) {
    const dash = document.getElementById('section-dashboard');
    const hotels = document.getElementById('section-hotels');
    const navDash = document.getElementById('nav-dashboard');
    const navHotels = document.getElementById('nav-hotels');
    const pageTitle = document.getElementById('page-title');

    // Sauvegarder l'onglet actif
    localStorage.setItem('lastSection', name);

    if (name === 'dashboard') {
        dash.classList.remove('hidden');
        hotels.classList.add('hidden');
        pageTitle.innerText = "Dashboard";
        navDash.className = "flex items-center px-6 py-3 bg-white text-black font-bold rounded-l-lg ml-2";
        navHotels.className = "flex items-center px-6 py-3 text-gray-300 hover:text-white transition-colors";
        updateStats();
    } else {
        dash.classList.add('hidden');
        hotels.classList.remove('hidden');
        pageTitle.innerText = "Liste des hôtels";
        navHotels.className = "flex items-center px-6 py-3 bg-white text-black font-bold rounded-l-lg ml-2";
        navDash.className = "flex items-center px-6 py-3 text-gray-300 hover:text-white transition-colors";
        loadHotels();
    }
}

// --- STATS ---
async function updateStats() {
    try {
        const res = await fetch(`${API_URL}/hotels/count/stats`);
        const stats = await res.json();
        document.getElementById('stat-users').innerText = stats.users;
        document.getElementById('stat-hotels-dash').innerText = stats.hotels;
        document.getElementById('hotel-count').innerText = stats.hotels;
        document.getElementById('stat-messages').innerText = stats.messages;
        document.getElementById('stat-forms').innerText = stats.forms;
    } catch (err) { console.error(err); }
}

// --- HOTELS ---
async function loadHotels() {
    const container = document.getElementById('hotels-container');
    container.innerHTML = '<div class="col-span-full flex justify-center py-10"><i class="fas fa-circle-notch fa-spin text-3xl text-gray-300"></i></div>';

    try {
        const response = await fetch(`${API_URL}/hotels`);
        allHotels = await response.json();
        renderHotels(allHotels);
    } catch (err) { container.innerHTML = '<p class="text-red-500 text-center col-span-full">Erreur serveur</p>'; }
}

function renderHotels(list) {
    const container = document.getElementById('hotels-container');
    document.getElementById('hotel-count').innerText = list.length;
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = '<p class="text-gray-400 col-span-full text-center py-10 italic font-light">Aucun hôtel trouvé.</p>';
        return;
    }

    list.forEach(hotel => {
        container.innerHTML += `
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 group relative hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <button onclick="deleteHotel(${hotel.id})" class="absolute top-2 right-2 bg-red-500/90 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 hover:bg-red-600 shadow-lg">
                    <i class="fas fa-trash-alt text-xs"></i>
                </button>
                <div class="h-44 overflow-hidden">
                    <img src="${hotel.image_url || 'https://via.placeholder.com/300x200?text=RED+Product'}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                </div>
                <div class="p-4 space-y-1">
                    <p class="text-[11px] text-orange-600 font-medium tracking-tight uppercase">${hotel.address}</p>
                    <h3 class="font-bold text-gray-800 text-lg leading-tight truncate">${hotel.name}</h3>
                    <p class="text-sm text-gray-500 font-medium">${hotel.price} ${hotel.currency || 'XOF'} / nuit</p>
                </div>
            </div>`;
    });
}

function filterHotels(term) {
    if (document.getElementById('section-hotels').classList.contains('hidden')) showSection('hotels');
    const filtered = allHotels.filter(h => h.name.toLowerCase().includes(term) || h.address.toLowerCase().includes(term));
    renderHotels(filtered);
}

// --- ACTIONS ---
async function deleteHotel(id) {
    if (confirm("Supprimer cet hôtel définitivement ?")) {
        try {
            const res = await fetch(`${API_URL}/hotels/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) { loadHotels(); updateStats(); }
        } catch (err) { alert("Erreur lors de la suppression"); }
    }
}

function toggleModal() {
    document.getElementById('hotel-modal').classList.toggle('hidden');
}

document.getElementById('hotel-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const hotelData = {
        name: document.getElementById('h-name').value,
        address: document.getElementById('h-address').value,
        email: document.getElementById('h-email').value,
        phone: document.getElementById('h-phone').value,
        price: document.getElementById('h-price').value,
        currency: document.getElementById('h-currency').value,
        image_url: document.getElementById('h-image').value
    };

    try {
        const res = await fetch(`${API_URL}/hotels`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(hotelData)
        });

        if (res.ok) {
            toggleModal();
            updateStats();
            loadHotels();
            document.getElementById('hotel-form').reset();
        }
    } catch (err) { alert("Erreur serveur"); }
});

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}
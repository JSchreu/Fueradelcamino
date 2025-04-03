// Aroma bibliotheek
const aromaLibrary = {
    fruit: [
        'Appel', 'Peer', 'Citrus', 'Perzik', 'Abrikoos', 'Banaan', 'Mango', 'Ananas',
        'Framboos', 'Aardbei', 'Bosbes', 'Kers', 'Pruim', 'Druif', 'Vijg', 'Granaat'
    ],
    floral: [
        'Roos', 'Jasmijn', 'Lavendel', 'Violet', 'Geranium', 'Oranjebloesem',
        'Acacia', 'Linde', 'Kamille', 'Hibiscus', 'Magnolia', 'Narcis'
    ],
    spice: [
        'Kaneel', 'Kruidnagel', 'Peper', 'Vanille', 'Kardemom', 'Gember',
        'Nootmuskaat', 'Anijs', 'Saffraan', 'Koriander', 'Komijn', 'Kurkuma'
    ],
    herb: [
        'Tijm', 'Rozemarijn', 'Salie', 'Munt', 'Basilicum', 'Laurier',
        'Dille', 'Peterselie', 'Oregano', 'Majoraan', 'Venkel', 'Citroengras'
    ],
    earth: [
        'Aarde', 'Paddenstoel', 'Truffel', 'Minerale', 'Leer', 'Tabak',
        'Hooi', 'Stro', 'Bosgrond', 'Kalk', 'Klei', 'Graniet'
    ],
    oak: [
        'Vanille', 'Kokos', 'Koffie', 'Chocolade', 'Toast', 'Rook',
        'Karamel', 'Koffiebonen', 'Ceder', 'Eikenhout', 'Houtskool', 'Hars'
    ],
    other: [
        'Boter', 'Yoghurt', 'Kaas', 'Bread', 'Gist', 'Honing',
        'Noten', 'Zout', 'Petroleum', 'Rubber', 'Medicinaal', 'Chemisch'
    ]
};

// Functie om aroma selector te maken
function createAromaSelector() {
    const container = document.getElementById('aromaSelector');
    container.innerHTML = '';

    Object.entries(aromaLibrary).forEach(([category, aromas]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'aroma-category';
        
        const categoryTitle = document.createElement('h4');
        categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryDiv.appendChild(categoryTitle);

        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'checkbox-container';

        aromas.forEach(aroma => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'aroma';
            checkbox.value = aroma;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(aroma));
            checkboxContainer.appendChild(label);
        });

        categoryDiv.appendChild(checkboxContainer);
        container.appendChild(categoryDiv);
    });
}

// Functie om custom aroma toe te voegen
function addCustomAroma() {
    const customAromaInput = document.getElementById('customAroma');
    const customAroma = customAromaInput.value.trim();
    
    if (customAroma) {
        // Maak een nieuwe checkbox voor het custom aroma
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'aroma';
        checkbox.value = customAroma;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(customAroma));
        
        // Voeg toe aan de 'other' categorie of maak een nieuwe categorie
        const otherCategory = document.querySelector('.aroma-category:last-child .checkbox-container');
        if (otherCategory) {
            otherCategory.appendChild(label);
        }
        
        // Reset het input veld
        customAromaInput.value = '';
    }
}

// Functie om formulier te verwerken
function handleSubmit(event) {
    event.preventDefault();
    
    // Verzamel alle formuliergegevens
    const formData = new FormData(event.target);
    const data = {
        wineInfo: {
            type: formData.get('wineType'),
            vintage: formData.get('vintage'),
            winemaker: formData.get('winemaker'),
            region: formData.get('region'),
            price: formData.get('price'),
            grape: formData.get('grape')
        },
        appearance: {
            clarity: formData.get('clarity'),
            intensity: formData.get('intensity'),
            color: formData.get('color')
        },
        nose: {
            intensity: formData.get('noseIntensity'),
            condition: formData.get('noseCondition'),
            development: formData.get('noseDevelopment'),
            aromas: Array.from(document.querySelectorAll('input[name="aroma"]:checked')).map(cb => cb.value)
        },
        palate: {
            sweetness: formData.get('sweetness'),
            acidity: formData.get('acidity'),
            tannin: formData.get('tannin'),
            alcohol: formData.get('alcohol'),
            body: formData.get('body'),
            finish: formData.get('finish')
        },
        conclusion: {
            quality: formData.get('quality'),
            readiness: formData.get('readiness'),
            notes: formData.get('notes')
        },
        date: new Date().toISOString()
    };

    // Sla de proefnotitie op in localStorage
    let tastingNotes = JSON.parse(localStorage.getItem('tastingNotes') || '[]');
    tastingNotes.push(data);
    localStorage.setItem('tastingNotes', JSON.stringify(tastingNotes));

    // Toon bevestiging
    alert('Proefnotitie succesvol opgeslagen!');
    event.target.reset();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialiseer de aroma selector
    createAromaSelector();

    // Voeg custom aroma handler toe
    const addAromaBtn = document.getElementById('addCustomAroma');
    addAromaBtn.addEventListener('click', addCustomAroma);

    // Voeg formulier submit handler toe
    const form = document.getElementById('wineTastingForm');
    form.addEventListener('submit', handleSubmit);

    // Tab switching functionaliteit
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Verwijder active class van alle tabs
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Voeg active class toe aan geklikte tab
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            const targetContent = document.querySelector(`[data-content="${tabId}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Als we naar het zoektabblad gaan, ververs de zoekresultaten
                if (tabId === 'search') {
                    displaySearchResults();
                }
                
                // Als we naar het statistiek tabblad gaan, ververs de statistieken
                if (tabId === 'stats') {
                    displayStats();
                }
                
                // Als we naar het invoer tabblad gaan, reset het formulier
                if (tabId === 'input') {
                    const form = document.getElementById('wineTastingForm');
                    if (form) {
                        form.reset();
                    }
                }
            }
        });
    });

    // Export/Import functionaliteit
    document.getElementById('exportBtn').addEventListener('click', () => {
        const tastingNotes = JSON.parse(localStorage.getItem('tastingNotes') || '[]');
        const dataStr = JSON.stringify(tastingNotes, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'wijn-proefnotities.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });

    document.getElementById('importBtn').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (Array.isArray(importedData)) {
                        localStorage.setItem('tastingNotes', JSON.stringify(importedData));
                        alert('Proefnotities succesvol geïmporteerd!');
                        // Ververs de zoekresultaten als we op het zoektabblad zijn
                        if (document.querySelector('[data-tab="search"]').classList.contains('active')) {
                            displaySearchResults();
                        }
                    } else {
                        alert('Ongeldig bestandsformaat. Het bestand moet een JSON-array bevatten.');
                    }
                } catch (error) {
                    alert('Er is een fout opgetreden bij het importeren van het bestand.');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    });

    // Gebruikersnaam functionaliteit
    const userNameInput = document.getElementById('userName');

    // Laad opgeslagen naam
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        userNameInput.value = savedName;
    }

    // Sla naam op bij wijziging
    userNameInput.addEventListener('change', () => {
        localStorage.setItem('userName', userNameInput.value);
    });

    // Update de form submit handler
    document.getElementById('wineForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userName = userNameInput.value.trim();
        if (!userName) {
            alert('Vul eerst je naam in voordat je een proefnotitie opslaat.');
            return;
        }
        
        const formData = new FormData(this);
        const tastingNote = {
            id: Date.now(),
            date: new Date().toISOString(),
            userName: userName,
            wineName: formData.get('wineName'),
            // ... rest van de bestaande form data ...
        };
        
        // ... rest van de bestaande submit handler code ...
    });

    // Update de zoekfunctie om ook op naam te zoeken
    function displaySearchResults() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filterQuality = document.getElementById('filterQuality').value;
        const filterYear = document.getElementById('filterYear').value;
        const filterCountry = document.getElementById('filterCountry').value;
        const filterRegion = document.getElementById('filterRegion').value;
        const filterGrape = document.getElementById('filterGrape').value;
        const filterPrice = document.getElementById('filterPrice').value;
        const filterUser = document.getElementById('userName').value.toLowerCase();
        
        const tastingNotes = JSON.parse(localStorage.getItem('tastingNotes') || '[]');
        const filteredNotes = tastingNotes.filter(note => {
            const matchesSearch = note.wineName.toLowerCase().includes(searchTerm) ||
                                note.tastingNotes.toLowerCase().includes(searchTerm) ||
                                note.userName.toLowerCase().includes(searchTerm);
            const matchesQuality = !filterQuality || note.quality === filterQuality;
            const matchesYear = !filterYear || note.year === filterYear;
            const matchesCountry = !filterCountry || note.country === filterCountry;
            const matchesRegion = !filterRegion || note.region === filterRegion;
            const matchesGrape = !filterGrape || note.grapeVariety === filterGrape;
            const matchesPrice = !filterPrice || note.priceRange === filterPrice;
            const matchesUser = !filterUser || note.userName.toLowerCase().includes(filterUser);
            
            return matchesSearch && matchesQuality && matchesYear && matchesCountry && 
                   matchesRegion && matchesGrape && matchesPrice && matchesUser;
        });
        
        // ... rest van de bestaande zoekfunctie code ...
    }
}); 
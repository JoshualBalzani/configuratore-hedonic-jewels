// Array per tenere traccia dei gioielli selezionati
let selectedItems = [];

// Funzione per aggiungere un gioiello al carrello
function addToCart(itemName, itemPrice) {
    // Controlla se il gioiello è già stato selezionato
    if (selectedItems.some(item => item.name === itemName)) {
        alert("Hai già selezionato questo gioiello.");
        return;
    }

    // Aggiungi il gioiello selezionato all'array
    selectedItems.push({ name: itemName, price: itemPrice });

    // Aggiorna il riepilogo del carrello
    updateCartSummary();
}

// Funzione per aggiornare il riepilogo del carrello
function updateCartSummary() {
    const itemList = document.getElementById('selected-items');
    const totalPriceElement = document.getElementById('total-price');
    const whatsappLink = document.getElementById('whatsapp-link');

    itemList.innerHTML = '';

    // Calcola il prezzo totale
    let totalPrice = 0;
    selectedItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - ${item.price.toFixed(2)}€`;
        itemList.appendChild(listItem);
        totalPrice += item.price;
    });

    // Applica lo sconto
    if (selectedItems.length >= 3) {
        totalPrice *= 0.85; // Sconto 15% per 3 o più gioielli
    } else if (selectedItems.length === 2) {
        totalPrice *= 0.90; // Sconto 10% per 2 gioielli
    }

    totalPriceElement.textContent = `Totale: ${totalPrice.toFixed(2)}€`;

    // Abilita o disabilita il pulsante WhatsApp
    if (selectedItems.length >= 2) {
        whatsappLink.disabled = false;
        whatsappLink.classList.remove('disabled');
    } else {
        whatsappLink.disabled = true;
        whatsappLink.classList.add('disabled');
    }

    // Aggiorna il link di WhatsApp
    const itemsList = selectedItems.map(item => `${item.name} (${item.price.toFixed(2)}€)`).join(', ');
    const message = `Ho selezionato i seguenti gioielli: ${itemsList}. Prezzo totale: ${totalPrice.toFixed(2)}€.`;
    whatsappLink.setAttribute('href', `https://wa.me/393924231439?text=${encodeURIComponent(message)}`);
}

// Funzione per resettare la selezione
function resetSelection() {
    selectedItems = [];
    updateCartSummary();
}

// Funzione per gestire il click sul pulsante WhatsApp
function handleWhatsAppClick(event) {
    if (selectedItems.length < 2) {
        event.preventDefault();
        alert("Devi selezionare almeno 2 gioielli per effettuare un ordine.");
    }
}

document.getElementById('whatsapp-link').addEventListener('click', handleWhatsAppClick);

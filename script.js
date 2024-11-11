let cart = [];
let total = 0;
let discount = 0; // Variabile per lo sconto

// Funzione per aggiungere un gioiello al carrello
function addToCart(name, price) {
    // Controllo che il gioiello non sia già presente nel carrello
    if (cart.some(item => item.name === name)) {
        alert("Questo gioiello è già stato aggiunto!");
        return;
    }

    cart.push({ name, price });
    total += price;

    // Controllo se applicare uno sconto
    if (cart.length >= 2) {
        discount = total * 0.1; // 10% di sconto
    } else {
        discount = 0; // Nessuno sconto
    }

    updateCartSummary();
}

// Funzione per aggiornare il riepilogo del carrello
function updateCartSummary() {
    let itemsList = document.getElementById("selected-items");
    itemsList.innerHTML = ''; // Svuoto la lista
    cart.forEach(item => {
        let li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price.toFixed(2)}€`;
        itemsList.appendChild(li);
    });

    // Calcolo il totale con lo sconto
    let finalTotal = total - discount;

    // Aggiorno la visualizzazione del totale e dello sconto
    document.getElementById("total-price").textContent = `Totale: ${finalTotal.toFixed(2)}€`;
    if (discount > 0) {
        document.getElementById("discount-info").textContent = `Sconto applicato: -${discount.toFixed(2)}€`;
    } else {
        document.getElementById("discount-info").textContent = '';
    }

    // Attivare/disattivare il pulsante WhatsApp in base al numero di gioielli
    let whatsappButton = document.getElementById("whatsapp-link");
    if (cart.length < 2) {
        whatsappButton.disabled = true;
        document.getElementById("error-message").style.display = "block";
    } else {
        whatsappButton.disabled = false;
        document.getElementById("error-message").style.display = "none";
    }
}

// Funzione per resettare il carrello
function resetSelection() {
    cart = [];
    total = 0;
    discount = 0;
    updateCartSummary();
}

// Funzione per verificare l'ordine su WhatsApp
function checkWhatsApp() {
    if (cart.length < 2) {
        alert("Per ordinare su WhatsApp, devi aggiungere almeno 2 gioielli.");
    } else {
        window.open("https://wa.me/393924231439?text=" + encodeURIComponent(generateOrderMessage()));
    }
}

// Funzione per generare il messaggio da inviare su WhatsApp
function generateOrderMessage() {
    let message = "Ho selezionato i seguenti gioielli:\n";
    cart.forEach(item => {
        message += `${item.name} - ${item.price.toFixed(2)}€\n`;
    });
    let finalTotal = total - discount;
    message += `Totale: ${finalTotal.toFixed(2)}€`;
    return message;
}


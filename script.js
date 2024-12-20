class ShoppingCart {
    constructor() {
        this.cart = [];
        this.total = 0;
        this.discount = 0;
        this.processing = false;
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    async addItem(name, price, button) {
        if (this.processing) return;
        
        button.classList.add('loading');
        this.processing = true;

        try {
            const itemElement = button.closest('.item');
            
            if (this.cart.some(item => item.name === name)) {
                // Remove item if already in cart
                this.cart = this.cart.filter(item => item.name !== name);
                itemElement.classList.remove('selected');
                button.textContent = 'Aggiungi';
                this.showToast('Articolo rimosso dal carrello');
            } else {
                // Add item to cart
                await new Promise(resolve => setTimeout(resolve, 300));
                this.cart.push({ name, price });
                itemElement.classList.add('selected');
                button.textContent = 'Rimuovi';
                this.showToast('Articolo aggiunto al carrello');
            }

            this.calculateTotal();
        } catch (error) {
            this.showToast(error.message);
        } finally {
            button.classList.remove('loading');
            this.processing = false;
            this.updateUI();
            this.updateButtonStates();
        }
    }

    calculateTotal() {
        this.total = this.cart.reduce((sum, item) => sum + item.price, 0);
        this.discount = this.cart.length >= 3 ? this.total * 0.15 : 
                       this.cart.length === 2 ? this.total * 0.10 : 0;
    }

    updateUI() {
        // Update category counters
        document.querySelectorAll('.category').forEach(category => {
            const count = this.cart.filter(item => 
                category.textContent.includes(item.name.split(' ')[0])
            ).length;
            
            const counter = category.querySelector('.item-count') || 
                           document.createElement('span');
            counter.className = 'item-count';
            counter.textContent = count || '';
            
            if (!category.querySelector('.item-count')) {
                category.querySelector('h2').appendChild(counter);
            }
        });

        // Update summary
        this.updateSummary();
    }

    updateSummary() {
        const itemsList = document.getElementById('selected-items');
        const finalTotal = this.total - this.discount;

        itemsList.innerHTML = this.cart.map(item => 
            `<li>${item.name} - ${item.price.toFixed(2)}€</li>`
        ).join('');

        document.getElementById('total-price').textContent = 
            `Totale: ${finalTotal.toFixed(2)}€`;
        document.getElementById('discount-info').textContent = 
            this.discount > 0 ? `Sconto applicato: -${this.discount.toFixed(2)}€` : '';
        
        const whatsappButton = document.getElementById('whatsapp-link');
        whatsappButton.disabled = this.cart.length < 2;
        document.getElementById('error-message').style.display = 
            this.cart.length < 2 ? 'block' : 'none';
    }

    updateButtonStates() {
        document.querySelectorAll('.add-button').forEach(button => {
            const itemName = button.closest('.item').querySelector('h3').textContent;
            const isSelected = this.cart.some(item => item.name === itemName);
            
            button.textContent = isSelected ? 'Rimuovi' : 'Aggiungi';
            button.classList.toggle('selected', isSelected);
            
            // Add tooltip
            button.setAttribute('data-tooltip', 
                isSelected ? 'Clicca per rimuovere' : 'Clicca per aggiungere al set'
            );
            button.classList.add('tooltip');
        });
    }

    reset() {
        this.cart = [];
        this.total = 0;
        this.discount = 0;
        document.querySelectorAll('.item').forEach(item => {
            item.classList.remove('selected');
        });
        this.updateUI();
        this.updateButtonStates();
        this.showToast('Carrello svuotato');
    }

    checkWhatsApp() {
        if (this.cart.length < 2) {
            this.showToast('Seleziona almeno 2 gioielli');
            return;
        }

        const message = this.generateWhatsAppMessage();
        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = '+393924231439'; 
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    generateWhatsAppMessage() {
        const items = this.cart.map(item => 
            `• ${item.name} - ${item.price.toFixed(2)}€`
        ).join('\n');

        const finalTotal = this.total - this.discount;
        
        return `Ciao! Vorrei ordinare questo set:\n\n${items}\n\n` + 
               `${this.discount > 0 ? `Sconto applicato: -${this.discount.toFixed(2)}€\n` : ''}` +
               `Totale: ${finalTotal.toFixed(2)}€`;
    }
}

const shop = new ShoppingCart();

// Update event listeners
document.querySelectorAll('.add-button').forEach(button => {
    const name = button.parentElement.querySelector('h3').textContent;
    const price = parseFloat(button.parentElement.querySelector('.price').textContent);
    button.onclick = () => shop.addItem(name, price, button);
});

document.getElementById('reset-button').onclick = () => shop.reset();

document.getElementById('whatsapp-link').onclick = () => shop.checkWhatsApp();

// Initialize tooltips
document.querySelectorAll('.add-button').forEach(button => {
    button.classList.add('tooltip');
    button.setAttribute('data-tooltip', 'Clicca per aggiungere al set');
});

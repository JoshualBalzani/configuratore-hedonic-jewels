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
            if (this.cart.some(item => item.name === name)) {
                throw new Error("Articolo già nel carrello");
            }

            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            this.cart.push({ name, price });
            this.calculateTotal();
            this.showToast('Articolo aggiunto al carrello');
        } catch (error) {
            this.showToast(error.message);
        } finally {
            button.classList.remove('loading');
            this.processing = false;
            this.updateUI();
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

    reset() {
        this.cart = [];
        this.total = 0;
        this.discount = 0;
        this.updateUI();
        this.showToast('Carrello svuotato');
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

// Menú compartido (podría importarse, pero para simplicidad se replica aquí)
const menuItems = [
    { id: 1, name: "La Caballo Loco", price: 6500 },
    { id: 2, name: "Clásica de Campo", price: 5500 },
    { id: 3, name: "Bondiola Braseada", price: 7000 },
    { id: 4, name: "Lomo Completo", price: 8500 },
    { id: 5, name: "Milanesa Napolitana", price: 7500 },
    { id: 6, name: "Milanesa a Caballo", price: 7000 },
    { id: 7, name: "Porción de Papas Rústicas", price: 3000 },
    { id: 8, name: "Gaseosa Línea Cola 1.5L", price: 2500 },
    { id: 9, name: "Cerveza Artesanal IPA", price: 3500 },
    { id: 10, name: "Agua Mineral", price: 1500 }
];

// Estado de las 20 mesas (en una app real iría a base de datos / localStorage)
let mesas = [];
for(let i=1; i<=20; i++) {
    mesas.push({
        id: i,
        status: 'libre',
        items: [],
        total: 0
    });
}

// Variables UI
const mesasGrid = document.getElementById('mesas-grid');
const modal = document.getElementById('mesa-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const productSelect = document.getElementById('product-select');
const addProductBtn = document.getElementById('add-product-btn');
const orderItemsContainer = document.getElementById('order-items');
const totalPriceEl = document.getElementById('total-price');
const cobrarBtn = document.getElementById('cobrar-btn');

let currentMesaId = null;

// Inicializar Select de Productos
menuItems.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = `${item.name} - $${item.price}`;
    productSelect.appendChild(opt);
});

// Renderizar la Grilla de Mesas
function renderMesas() {
    mesasGrid.innerHTML = '';
    mesas.forEach(mesa => {
        const div = document.createElement('div');
        div.className = `mesa-card ${mesa.status === 'libre' ? 'mesa-libre' : 'mesa-ocupada'}`;
        div.innerHTML = `
            <h3>Mesa ${mesa.id}</h3>
            <div class="mesa-status">${mesa.status === 'libre' ? 'Libre' : 'Ocupada'}</div>
            <div class="mesa-total">$${mesa.total.toLocaleString('es-AR')}</div>
        `;
        div.onclick = () => openMesa(mesa.id);
        mesasGrid.appendChild(div);
    });
}

// Abrir Modal de una Mesa Específica
function openMesa(id) {
    currentMesaId = id;
    const mesa = mesas.find(m => m.id === id);
    modalTitle.textContent = `Mesa ${id}`;
    
    // Resetear el select
    productSelect.value = '';
    
    updateOrderView(mesa);
    modal.classList.remove('hidden');
}

// Cerrar Modal
closeModalBtn.onclick = () => modal.classList.add('hidden');
// Cerrar modal clickeando fuera
modal.addEventListener('click', (e) => {
    if(e.target === modal) modal.classList.add('hidden');
});

// Actualizar vista del pedido dentro del Modal
function updateOrderView(mesa) {
    orderItemsContainer.innerHTML = '';
    
    if (mesa.items.length === 0) {
        orderItemsContainer.innerHTML = '<li style="justify-content:center; color:#777;">La mesa está vacía.</li>';
    } else {
        mesa.items.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${item.name}</span> <span>$${item.price.toLocaleString('es-AR')}</span>`;
            orderItemsContainer.appendChild(li);
        });
    }
    
    totalPriceEl.textContent = mesa.total.toLocaleString('es-AR');
    cobrarBtn.style.display = mesa.total > 0 ? 'block' : 'none';
}

// Añadir Producto a la Mesa
addProductBtn.onclick = () => {
    const selectedId = parseInt(productSelect.value);
    if(isNaN(selectedId)) {
        alert("Por favor seleccione un producto");
        return;
    }
    
    const product = menuItems.find(p => p.id === selectedId);
    const mesa = mesas.find(m => m.id === currentMesaId);
    
    mesa.items.push(product);
    mesa.total += product.price;
    mesa.status = 'ocupada';
    
    updateOrderView(mesa);
    renderMesas();
    
    // Reset select for next item
    productSelect.value = '';
};

// Cobrar y Liberar Mesa
cobrarBtn.onclick = () => {
    const mesa = mesas.find(m => m.id === currentMesaId);
    mesa.items = [];
    mesa.total = 0;
    mesa.status = 'libre';
    
    updateOrderView(mesa);
    renderMesas();
    modal.classList.add('hidden');
};

// Start application
renderMesas();

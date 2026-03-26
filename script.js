// Data del Menú
const menuItems = [
    { id: 1, name: "La Caballo Loco", category: "hamburguesas", price: 6500, desc: "Doble carne, cheddar, panceta crocante, cebolla caramelizada y salsa especial." },
    { id: 2, name: "Clásica de Campo", category: "hamburguesas", price: 5500, desc: "Medallón de asado, lechuga, tomate, queso y huevo frito." },
    { id: 3, name: "Bondiola Braseada", category: "bondiolas", price: 7000, desc: "Bondiola tiernizada con barbacoa, provoleta y rúcula." },
    { id: 4, name: "Lomo Completo", category: "lomos", price: 8500, desc: "Bife de lomo, jamón, queso, huevo, morrón, lechuga y tomate." },
    { id: 5, name: "Milanesa Napolitana", category: "milanesas", price: 7500, desc: "Súper milanesa de ternera con salsa, jamón, muzzarella y tomates cherry." },
    { id: 6, name: "Milanesa a Caballo", category: "milanesas", price: 7000, desc: "Milanesa de ternera con doble huevo frito." }
];

// Renderizar Menú
const menuContainer = document.getElementById('menu-container');

function renderMenu(items) {
    menuContainer.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <div class="card-img-container">
                <img src="img/menu.png" alt="${item.name}">
            </div>
            <div class="card-content">
                <div class="card-title">
                    <span>${item.name}</span>
                    <span class="card-price">$${item.price}</span>
                </div>
                <p class="card-desc">${item.desc}</p>
                <button class="btn" style="padding: 8px 15px; font-size: 0.9rem; width: 100%;" onclick="orderItem('${item.name}')">Pedir al Asistente</button>
            </div>
        `;
        menuContainer.appendChild(card);
    });
}

renderMenu(menuItems);

// Filtros del menú
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        if(filter === 'all') {
            renderMenu(menuItems);
        } else {
            const filtered = menuItems.filter(item => item.category === filter);
            renderMenu(filtered);
        }
    });
});

// Chat IA Logic
const chatToggle = document.getElementById('chat-toggle');
const chatPanel = document.getElementById('chat-panel');
const chatClose = document.getElementById('chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

let chatContext = 'greeting'; // states: greeting, ordering, confirm

function toggleChat() {
    chatPanel.classList.toggle('hidden');
    if (!chatPanel.classList.contains('hidden') && chatMessages.children.length === 0) {
        setTimeout(() => {
            addAiMessage("¡Buenas! Qué lindo verte por acá en X1 Cabeza 🐴🔥. Soy tu asistente virtual. ¿De qué tenés antojo hoy? (Podés pedir hamburguesas, lomos, bondiolas o milanesas).");
        }, 500);
    }
}

chatToggle.addEventListener('click', toggleChat);
chatClose.addEventListener('click', () => chatPanel.classList.add('hidden'));

function addUserMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bubble-user';
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addAiMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bubble-ai';
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleInput() {
    const text = chatInput.value.trim();
    if (!text) return;

    addUserMessage(text);
    chatInput.value = '';

    setTimeout(() => {
        processAiResponse(text.toLowerCase());
    }, 800);
}

function orderItem(itemName) {
    if(chatPanel.classList.contains('hidden')) {
        toggleChat();
    }
    setTimeout(() => {
        addUserMessage(`Quiero pedir: ${itemName}`);
        setTimeout(() => {
            addAiMessage(`¡Excelente elección! Agregué ${itemName} a tu pedido. ¿Querés agregarle unas papas fritas rústicas o algo más, o cerramos el pedido acá?`);
            chatContext = 'confirm';
        }, 800);
    }, 500);
}

function processAiResponse(text) {
    if (chatContext === 'greeting') {
        if(text.includes('hamburguesa') || text.includes('burger')) {
            addAiMessage("¡Uff, unas buenas burgers! Te recomiendo 'La Caballo Loco' (Doble carne, cheddar, panceta) o la 'Clásica de Campo'. ¿Cuál te anoto?");
            chatContext = 'ordering';
        } else if (text.includes('bondiola') || text.includes('cerdo')) {
            addAiMessage("Nuestra Bondiola Braseada es una locura, se deshace en la boca. ¿Te preparo una?");
            chatContext = 'ordering';
        } else if (text.includes('lomo')) {
            addAiMessage("El Lomo Completo no falla nunca. Sale con fritas. ¿Querés que vaya marchando uno?");
            chatContext = 'ordering';
        } else if (text.includes('milanesa') || text.includes('mila')) {
            addAiMessage("Tenemos Napolitana o A Caballo (con dos huevos fritos arriba). ¿De qué bando sos?");
             chatContext = 'ordering';
        } else {
            addAiMessage("Joya, mirá nuestro menú en la página para ver las opciones, o decime si querés Carne, Cerdo o Pollo así te recomiendo.");
        }
    } else if (chatContext === 'ordering') {
        addAiMessage("¡Dale, marchando eso! 🤤 ¿Querés sumarle unas papas con cheddar, unas empanadas fritas de entrada, o ya lo cerramos?");
        chatContext = 'confirm';
    } else if (chatContext === 'confirm') {
        if(text.includes('si') || text.includes('papas') || text.includes('dale') || text.includes('agrega')) {
            addAiMessage("¡Perfecto! Sumado al pedido. En 20-30 minutitos pasá a retirarlo por nuestro local acá en Capitán Sarmiento, o avisanos si es para envío. ¡Gracias por elegir X1 Cabeza! 🐴🔥");
        } else {
             addAiMessage("¡Listo el pollo y pelada la gallina! Tu pedido está en marcha. En 20 minutitos está listo para retirar. ¡Abrazo grande!");
        }
        chatContext = 'greeting'; // Reset
    }
}

chatSend.addEventListener('click', handleInput);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleInput();
});

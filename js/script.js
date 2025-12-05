// Funções do sistema de cadastro/login existente
function verificarSenha(senha, confirmarSenha) {
    if (senha != confirmarSenha){
        alert("As senhas não coincidem.");
        return false;
    }
    return true;
}

class Pessoa {
    constructor(nome, Data, email, senha) {
        this.nome = nome;
        this.Data = Data;
        this.email = email;
        this.senha = senha;
    }
}

function botaoCadastro() {
    const nome = document.getElementById("nome_completo").value;
    const Data = document.getElementById("data_nascimento").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("senha_confirmar").value;
    verificarSenha(senha, confirmarSenha)

    if (!verificarSenha(senha, confirmarSenha)) {
        return;
    }

    const novaPessoa = new Pessoa(nome, Data, email, senha);
    localStorage.setItem("pessoa", JSON.stringify(novaPessoa));
}

// Chave única para armazenar dados no Local Storage
const ADMIN_STORAGE_KEY = 'adminUsers';

// Função para carregar usuários do Local Storage
function loadAdminUsers() {
    const data = localStorage.getItem(ADMIN_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Função para salvar usuários no Local Storage
function saveAdminUsers(users) {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(users));
}

// Função para renderizar a lista de usuários
function renderAdminList(searchTerm = '') {
    const listElement = document.getElementById('admin_list');
    if (!listElement) return;
    
    listElement.innerHTML = '';
    const users = loadAdminUsers();
    
    users.forEach((user, index) => {
        // Filtro de pesquisa
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const matchName = user.nome.toLowerCase().includes(term);
            const matchEmail = user.email.toLowerCase().includes(term);
            if (!matchName && !matchEmail) return;
        }
        
        const listItem = document.createElement('li');
        const date = new Date(user.createdAt).toLocaleString('pt-BR');
        
        listItem.innerHTML = `
            <span>${date} - <strong>${escapeHtml(user.nome)}</strong> (${escapeHtml(user.email)})</span>
            <button type="button" class="delete-item btn-danger btn-small" data-index="${index}">Excluir</button>
        `;
        
        listElement.appendChild(listItem);
    });
}

// Função para adicionar usuário do formulário
function addAdminFromForm() {
    const nomeInput = document.getElementById('admin_nome');
    const emailInput = document.getElementById('admin_email');
    
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    
    if (!nome || !email) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    const users = loadAdminUsers();
    const newUser = {
        nome: nome,
        email: email,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveAdminUsers(users);
    
    clearAdminForm();
    renderAdminList(document.getElementById('admin_search').value);
}

// Função para limpar campos do formulário
function clearAdminForm() {
    document.getElementById('admin_nome').value = '';
    document.getElementById('admin_email').value = '';
    document.getElementById('admin_nome').focus();
}

// Função para excluir um usuário específico
function deleteAdminUser(index) {
    const users = loadAdminUsers();
    if (index >= 0 && index < users.length) {
        users.splice(index, 1);
        saveAdminUsers(users);
        renderAdminList(document.getElementById('admin_search').value);
    }
}

// Função para excluir todos os usuários
function deleteAllAdminUsers() {
    if (confirm('Tem certeza que deseja excluir todos os usuários?')) {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        renderAdminList();
    }
}

// Função para pesquisar usuários
function searchAdmin() {
    const searchTerm = document.getElementById('admin_search').value;
    renderAdminList(searchTerm);
}

// Função para escapar HTML e prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se estamos na página admin
    if (document.getElementById('admin_list')) {
        // Renderiza a lista inicial
        renderAdminList();
        
        // Event listeners para os botões
        document.getElementById('cadastrar_admin').addEventListener('click', addAdminFromForm);
        document.getElementById('limpar_admin').addEventListener('click', clearAdminForm);
        document.getElementById('excluir_todos').addEventListener('click', deleteAllAdminUsers);
        document.getElementById('admin_search').addEventListener('input', searchAdmin);
        
        // Event delegation para botões de excluir
        document.getElementById('admin_list').addEventListener('click', function(event) {
            if (event.target.classList.contains('delete-item')) {
                const index = parseInt(event.target.dataset.index);
                deleteAdminUser(index);
            }
        });
        
        // Previne submit do formulário
        document.getElementById('admin_form').addEventListener('submit', function(event) {
            event.preventDefault();
            addAdminFromForm();
        });
    }
});
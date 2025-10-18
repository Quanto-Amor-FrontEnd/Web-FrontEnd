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

function botaoCadastro(nome, Data, email, senha, confirmarSenha) {
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

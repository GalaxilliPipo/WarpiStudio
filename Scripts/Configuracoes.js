window.addEventListener("DOMContentLoaded", () => {
    console.log("Sistema carregado");
});

if (typeof AlteracaoPendente === "undefined") {
    var AlteracaoPendente = false;
}

function AbrirConfiguracoes() {
    const Sobreposicao = document.createElement('div');
    Sobreposicao.className = 'ModalSobreposicao';
    Sobreposicao.id = 'ModalConfiguracoes';

    const TemaAtual = localStorage.getItem('TemaPreferido') || 'Padrao';

    Sobreposicao.innerHTML = `
        <div class="ModalJanela">
            <h2>Configurações</h2>

            <div class="ConfiguracaoItem">
                <label>Tema Favorito</label>
                <select id="ConfigTema" onchange="MarcarAlteracao()">
                    <option value="Padrao" ${TemaAtual === 'Padrao' ? 'selected' : ''}>Padrão (Sistema)</option>
                    <option value="Claro" ${TemaAtual === 'Claro' ? 'selected' : ''}>Claro</option>
                    <option value="Escuro" ${TemaAtual === 'Escuro' ? 'selected' : ''}>Escuro</option>
                </select>
            </div>

            <div class="ConfiguracaoItem">
                <label>Horário do Sistema</label>
                <input type="time" id="ConfigHora" onchange="MarcarAlteracao()">
            </div>

            <div class="ConfiguracaoItem">
                <label>Dados</label>
                <button onclick="ExecutarReinicializacaoBackup()">Limpar Backup (Reset Total)</button>
            </div>

            <div class="ModalBotoes">
                <button onclick="FecharConfiguracoes()">Voltar</button>
                <button onclick="RedefinirConfiguracoes()">Redefinir</button>
                <button onclick="SalvarConfiguracoes()">Salvar</button>
            </div>
        </div>
    `;

    document.body.appendChild(Sobreposicao);
    AlteracaoPendente = false;
}

function MarcarAlteracao() {
    AlteracaoPendente = true;
}

function SalvarConfiguracoes() {
    const NovoTema = document.getElementById('ConfigTema').value;
    
    if (NovoTema === 'Padrao') {
        localStorage.removeItem('TemaPreferido');
    } else {
        localStorage.setItem('TemaPreferido', NovoTema);
    }

    if (typeof ExecutarCarregamentoTema === 'function') {
        location.reload(); 
    }

    AlteracaoPendente = false;
    FecharConfiguracoes();
}

function RedefinirConfiguracoes() {
    if (confirm("Deseja redefinir as configurações para o padrão?")) {
        document.getElementById('ConfigTema').value = 'Padrao';
        MarcarAlteracao();
    }
}

function FecharConfiguracoes() {
    if (AlteracaoPendente) {
        if (confirm("Se você não salvar, dados podem ser perdidos! Deseja salvar antes de sair?")) {
            SalvarConfiguracoes();
            return;
        }
    }
    const Modal = document.getElementById('ModalConfiguracoes');
    if (Modal) Modal.remove();
}
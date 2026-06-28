if (typeof AlteracaoPendente === "undefined") {
    var AlteracaoPendente = false;
}

let idiomaAtual = "ENUS";
let traducoes = {};

// 🔥 FUNÇÃO QUE FALTAVA (ESSENCIAL)
async function carregarIdioma(lang) {
    const res = await fetch(`Idiomas/${lang}.po`);
    const text = await res.text();

    const map = {};

    const regex = /msgid\s+"([^"]*)"\s+msgstr\s+"([^"]*)"/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
        map[match[1]] = match[2];
    }

    return map;
}

// 🔁 TROCA DE IDIOMA (CORRIGIDO)
async function TrocarIdioma(lang) {
    idiomaAtual = lang;

    localStorage.setItem("Idioma", lang);

    traducoes = await carregarIdioma(lang);

    traduzirDOM();
}

// 🌍 TRADUÇÃO DO DOM
function traduzirDOM() {
    document.querySelectorAll("body *").forEach(el => {

        if (["SCRIPT", "STYLE"].includes(el.tagName)) return;
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") return;

        const texto = el.childNodes.length === 1 ? el.textContent.trim() : null;

        if (!texto) return;

        const traducao = traducoes[texto];

        if (traducao) {
            el.textContent = traducao;
        }
    });
}

// 🪟 MENU IDIOMA
async function AbrirMenuIdioma() {
    // 1. Cria a div de sobreposição normalmente
    const Sobreposicao = document.createElement('div');
    Sobreposicao.className = 'ModalSobreposicao';
    Sobreposicao.id = 'ModalIdioma';

    try {
        // 2. Busca o conteúdo do arquivo HTML externo
        const Resposta = await fetch('MenuIdioma.html');
        
        // 3. Converte a resposta em texto (HTML)
        const htmlConteudo = await Resposta.text();
        
        // 4. Insere o conteúdo dentro da sobreposição
        Sobreposicao.innerHTML = htmlConteudo;
        
        // 5. Adiciona o modal na tela (ex: no final do body)
        document.body.appendChild(Sobreposicao);

        AlteracaoPendente = false;

        setTimeout(() => {
            const sel = document.getElementById("ConfigIdioma");
            if (sel) sel.value = idiomaAtual;
        }, 0);

    } catch (erro) {
        console.error("Erro ao carregar o menu de idioma:", erro);
    }
}

// 💾 SALVAR
function SalvarIdioma() {
    const lang = document.getElementById("ConfigIdioma").value;

    localStorage.setItem("Idioma", lang);

    TrocarIdioma(lang);

    FecharMenuIdioma();

    AlteracaoPendente = false;

    location.reload();
}

// 🔄 RESET
function RedefinirIdioma() {
    const sel = document.getElementById("ConfigIdioma");
    if (sel) sel.value = "ENUS";

    MarcarAlteracao();
}

// ❌ FECHAR
function FecharMenuIdioma() {
    const modal = document.getElementById("ModalIdioma");
    if (modal) modal.remove();
}

// ⚠️ ALTERAÇÃO
function MarcarAlteracao() {
    AlteracaoPendente = true;
}

// 🚀 INICIALIZAÇÃO
window.addEventListener("DOMContentLoaded", async () => {
    const saved = localStorage.getItem("Idioma") || "ENUS";

    idiomaAtual = saved;

    traducoes = await carregarIdioma(saved);

    traduzirDOM();
});

// 🌐 EXPORT GLOBAL
window.carregarIdioma = carregarIdioma;
window.TrocarIdioma = TrocarIdioma;
window.traduzirDOM = traduzirDOM;
// Pega todos os links do nav
const links = document.querySelectorAll('header nav a');

// Pega todas as seções dentro do main
const sections = document.querySelectorAll('main > section');

links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault(); // impede o link de mudar a URL

    const targetId = link.getAttribute('href').replace('#',''); // pega o id
    sections.forEach(section => {
      if(section.id === targetId){
        section.style.display = 'block'; // mostra a seção clicada
      } else {
        section.style.display = 'none';  // esconde as outras
      }
    });
  });
});

// Ao carregar a página, mostra só a primeira seção
window.addEventListener('load', () => {
  sections.forEach((section, index) => {
    section.style.display = index === 0 ? 'block' : 'none';
  });
});

// --- LÓGICA DO QUIZ --- //

const perguntas = [
  "O que é um navegador de internet?",
  "Por que é importante usar senhas fortes?",
  "O que significa inclusão digital?",
  "Como podemos evitar golpes online?",
  "O que é um sistema operacional?"
];

let indice = 0;

const perguntaEl = document.getElementById("pergunta");
const respostaEl = document.getElementById("resposta");
const feedbackEl = document.getElementById("feedback");
const btnAvaliar = document.getElementById("avaliar");
const btnProxima = document.getElementById("proxima");

// Enviar a resposta para o backend em Python (avaliar com IA)
btnAvaliar.addEventListener("click", async () => {
  const resposta = respostaEl.value.trim();

  if (!resposta) {
    feedbackEl.textContent = "Por favor, digite uma resposta antes de avaliar.";
    return;
  }

  feedbackEl.textContent = "⏳ Avaliando sua resposta...";

  try {
    const respostaServidor = await fetch("http://127.0.0.1:5000/avaliar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pergunta: perguntas[indice],
        resposta: resposta
      })
    });

    const dados = await respostaServidor.json();
    feedbackEl.innerHTML = `<b>Nota:</b> ${dados.nota}/100<br><b>Comentário:</b> ${dados.feedback}`;
  } catch (error) {
    feedbackEl.textContent = "❌ Erro ao conectar com o servidor.";
    console.error(error);
  }
});

// Passar para a próxima pergunta
btnProxima.addEventListener("click", () => {
  indice++;
  if (indice < perguntas.length) {
    perguntaEl.textContent = `Pergunta ${indice + 1}: ${perguntas[indice]}`;
    respostaEl.value = "";
    feedbackEl.textContent = "";
  } else {
    perguntaEl.textContent = "🎉 Você completou o quiz!";
    respostaEl.style.display = "none";
    btnAvaliar.style.display = "none";
    btnProxima.style.display = "none";
    feedbackEl.textContent = "";
  }
});

const sendChatBtn = document.querySelector('.chat-input span');
const chatInput = document.querySelector('.chat-input textarea');
const chatBox = document.querySelector('.chatbox');
const chatbotToggler = document.querySelector('.chatbot-toggler');
const chatbotCloseBtn = document.querySelector('.close-btn');
const fileInput = document.getElementById('fileInput');
const formHour = document.getElementById('formHour');

const options = {
    1: "Justificativa de faltas",
    2: "Solicitação de horas extras",
    3: "Solicitação de férias",
    4: "Solicitação de desligamento",
    5: "Solicitação de benefícios",
};

const choiceUser = {
    1: "Sim",
    2: 'Não'
};

const optionsHours = {
    1: "Solicitar 1 hora",
    2: "Solicitar 2 horas",
    3: "Solicitar 3 horas",
    4: "Solicitar 4 horas",
    5: "Outra opção"
}

const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add('chat', className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};


function handleMessageFirst(options) {
    const values = Object.keys(options);
    values.forEach(key => {
        chatBox.appendChild(createChatLi(`${key}. ${options[key]}`, "incoming"));   
    });
}

function handleMsgChoiceUser(options) {
    const values = Object.keys(options);
    values.forEach(key => {
        chatBox.appendChild(createChatLi(`${key}. ${options[key]}`, "incoming"));
    });
}

function handleHours(options) {
    const values = Object.keys(options);
    values.forEach(key => {
        chatBox.appendChild(createChatLi(`${key}. ${options[key]}`, "incoming"));
    });
}

function handleChangeInputFile() {
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files;
        if(file.length > 0) {
            chatBox.appendChild(createChatLi("Sua justificativa foi registrada com sucesso!", "incoming"));
        } else {
            return;
        }
    });
}

handleMessageFirst(options);

function MsgError() {
    const errorMessage = "Mensagem inválida. Por favor, tente novamente.";
    chatBox.appendChild(createChatLi(errorMessage, "incoming"));
}

let selectedOption = "";
let selectedChoice = "";
let userName = ""; // Inicialização da variável userName
let userRegistration = ""; // Inicialização da variável userRegistration
let absenceDate = ""; // Variável para armazenar a data da falta
let absenceReason = ""; // Variável para armazenar o motivo da falta
let hasMedicalCertificate = ""; // Variável para armazenar a resposta sobre o atestado
let MedicalCertificate = false;

const resetForm = () => {
    selectedOption = "";
    userName = "";
    userRegistration = "";
    absenceDate = "";
    absenceReason = "";
    hourRequested = "";
};

let awaitingMedicalCertificateChoice = false;
let awaitRequestedHour = false;
let hourRequested = "";

const handleChat = () => {
    const userMessage = chatInput.value.trim();

    // Verificação da seleção de opção principal
    if (!isNaN(parseInt(userMessage, 10)) && options[userMessage] && !awaitingMedicalCertificateChoice && !awaitRequestedHour) {
        chatBox.appendChild(createChatLi(userMessage, "outgoing"));
        chatInput.value = '';
        chatBox.scrollTo(0, chatBox.scrollHeight);

        selectedOption = userMessage;

        switch (selectedOption) {
            case '1':
                chatBox.appendChild(createChatLi("Para justificar sua falta, por favor, informe seu nome completo.", "incoming"));
                break;
            case '2':
                chatBox.appendChild(createChatLi("Para solicitar horas extras, informe seu nome completo.", "incoming"));
                awaitRequestedHour = true;
                break;
            case '3':
                console.log("Ação específica para a chave 3.");
                break;
            default:
                console.log("Ação padrão para chaves não específicas.");
        }
    
    }

    else if (awaitRequestedHour) {
        if (userName === "" && userMessage.length > 0) {
            chatBox.appendChild(createChatLi(userMessage, "outgoing"));
            userName = userMessage;
            const firstName = userName.split(" ")[0];
            chatBox.appendChild(createChatLi(`Obrigado, ${firstName}! Agora, por favor, informe sua matrícula.`, "incoming"));
            chatInput.value = '';
            chatBox.scrollTo(0, chatBox.scrollHeight);
        }
        
        else if (userName !== "" && userRegistration === "" && userMessage.length > 0) {
            userRegistration = userMessage;
            const firstName = userName.split(" ")[0];
            chatBox.appendChild(createChatLi(userMessage, "outgoing"));
            chatBox.appendChild(createChatLi(`Obrigado, ${firstName}! Sua matrícula é ${userRegistration}. Quantas horas extras você deseja solicitar?`, "incoming"));
            handleHours(optionsHours); // Exibe as opções de horas extras
            chatInput.value = '';
            chatBox.scrollTo(0, chatBox.scrollHeight);
        }
        
        
        else if (userRegistration !== "" && hourRequested === "" && userMessage === '5') {
            hourRequested = optionsHours[userMessage];
            chatInput.value = "";
            chatBox.appendChild(createChatLi(`${hourRequested}`, "outgoing")); 
            chatBox.appendChild(createChatLi("Por favor, insira a quantidade de horas extras que deseja solicitar.", "incoming"));
            formHour.style.display = 'block';
            chatBox.appendChild(formHour);
        }
        
        else if (userRegistration !== "" && hourRequested === "" && optionsHours[userMessage]) {
            hourRequested = optionsHours[userMessage];
            chatBox.appendChild(createChatLi(`${hourRequested}`, "outgoing"));
            chatInput.value = '';
            chatBox.scrollTo(0, chatBox.scrollHeight);
            awaitRequestedHour = false;
            resetForm();
        }
    }

    // Verificação do nome
    else if (userName === "" && userMessage.length > 0) {
        chatBox.appendChild(createChatLi(userMessage, "outgoing"));
        userName = userMessage;
        const firstName = userName.split(" ")[0];
        chatBox.appendChild(createChatLi(`Obrigado, ${firstName}! Agora, por favor, informe sua matrícula.`, "incoming"));
        chatInput.value = '';
        chatBox.scrollTo(0, chatBox.scrollHeight);
    }

    // Verificação da matrícula
    else if (userName !== "" && userRegistration === "" && userMessage.length > 0) {
        userRegistration = userMessage;
        const firstName = userName.split(" ")[0];
        chatBox.appendChild(createChatLi(userMessage, "outgoing"));
        chatBox.appendChild(createChatLi(`Obrigado, ${firstName}! Sua matrícula é ${userRegistration}.`, "incoming"));
        chatInput.value = '';
        chatBox.scrollTo(0, chatBox.scrollHeight);

        if (selectedOption === '1') {
            chatBox.appendChild(createChatLi(`Agora, por favor, informe a data da falta (formato: MM-DD-YYYY).`, "incoming"));
        } else if (selectedOption === '2' && userRegistration !== "") {
            if (hourRequested === "") {
                // Exibe as opções de horas
                chatBox.appendChild(createChatLi("Quantas horas extras você deseja solicitar?", "incoming"));
                handleHours(optionsHours);
            } else if (optionsHours[userMessage]) {
                // Armazena a quantidade de horas extras solicitada
                hourRequested = optionsHours[userMessage];
                chatBox.appendChild(createChatLi(`Você solicitou ${hourRequested}.`, "incoming"));
                chatInput.value = '';
                chatBox.scrollTo(0, chatBox.scrollHeight);
            } else if (userMessage === '5') {
                // Caso o usuário escolha "Outra opção", pergunte o número específico de horas
                chatBox.appendChild(createChatLi("Por favor, insira a quantidade de horas extras que deseja solicitar.", "incoming"));
                formHour.style.display = 'block';
                chatBox.appendChild(formHour);
            }
        }
    }

    // Verificação para a data da falta
    else if (selectedOption === '1' && userRegistration !== "" && absenceDate === "" && userMessage.length > 0) {
        const datePattern = /^\d{2}-\d{2}-\d{4}$/;
        if (datePattern.test(userMessage)) {
            absenceDate = userMessage; // Armazena a data da falta
            chatBox.appendChild(createChatLi(userMessage, "outgoing"));
            chatBox.appendChild(createChatLi(`Sua falta no dia ${absenceDate} foi registrada com sucesso. Por favor, agora nos informe o motivo da sua ausência em ${absenceDate}.`, "incoming"));
        } else {
            chatBox.appendChild(createChatLi("Por favor, informe a data corretamente no formato DD-MM-YYYY.", "incoming"));
        }
        chatInput.value = '';
        chatBox.scrollTo(0, chatBox.scrollHeight);
    }

    // Verificação para o motivo da falta
    else if (selectedOption === '1' && absenceDate !== "" && absenceReason === "" && userMessage.length > 0) {
        absenceReason = userMessage; // Armazena o motivo da falta
        chatBox.appendChild(createChatLi(userMessage, "outgoing"));

        chatInput.value = '';
        chatBox.scrollTo(0, chatBox.scrollHeight);

        // Pergunta se o usuário possui atestado
        chatBox.appendChild(createChatLi("Você possui um atestado médico?", "incoming"));
        handleMsgChoiceUser(choiceUser);
        awaitingMedicalCertificateChoice = true; // Aguarda a escolha sobre o atestado
    }

    // Verificação para a escolha do atestado médico
    else if (awaitingMedicalCertificateChoice && (userMessage === '1' || userMessage === '2')) {
        chatBox.appendChild(createChatLi(userMessage === '1' ? "Sim" : "Não", "outgoing"));
        if (userMessage === '1') { // Sim - Anexar atestado
            chatBox.appendChild(createChatLi("Por favor, anexe o atestado.", "incoming"));
            fileInput.style.display = 'block';
            chatBox.appendChild(fileInput);
            handleChangeInputFile();
        } else {
            chatBox.appendChild(createChatLi("Sua justificativa foi registrada com sucesso!", "incoming"));
        }

        awaitingMedicalCertificateChoice = false; // Resetar o estado
        chatInput.value = '';
        chatBox.scrollTo(0, chatBox.scrollHeight);
        // chatBox.appendChild(createChatLi("Precisa de mais alguma coisa?", "incoming"));
    }
};



const handleEnter = () => {
    document.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleChat();
        }
    });
};

sendChatBtn.addEventListener('click', handleChat);
chatbotToggler.addEventListener('click', () => document.body.classList.toggle('show-chatbot'));
chatbotCloseBtn.addEventListener('click', () => document.body.classList.remove('show-chatbot'));
handleEnter();

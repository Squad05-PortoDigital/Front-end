const sendChatBtn = document.querySelector('.chat-input span');
const chatInput = document.querySelector('.chat-input textarea');
const chatBox = document.querySelector('.chatbox');
const chatbotToggler = document.querySelector('.chatbot-toggler');
const chatbotCloseBtn = document.querySelector('.close-btn');
const fileInput = document.getElementById('fileInput');
const formHour = document.getElementById('formHour');
const formDate = document.getElementById('formDate');
const formProfission = document.getElementById('formProfission');
const btnHourRequested = document.querySelector('#btn-send-hourRequested');
const btnDateInsert = document.querySelector('#btn-send-dateInsert');
const btnSendProfission = document.querySelector('#btn-send-profission');

const btnGroupUrgency = document.querySelector('#btns-groupUrgency');
const buttonsNivelUrgency = document.querySelectorAll('#btnUrgency');

const buttonGroupStatus = document.querySelector('#btns-groupStatus');
const buttonNivelStatus = document.querySelectorAll('#btnStatus');

let userEmail = ""; // Variável global para armazenar o email
let profissionSelected = ""; // Variável global para armazenar o cargo
let detailsRequest = ""; // Armazena o detalhes da solicitação
let selectedInitialOption = "";
let userDate = "";
let nivelUrgencyRequest = "";
let nivelStatusRequested = "";
let funcionarioId = "";

async function dataFuncionarios() {
    const response = await fetch('http://localhost:8080/funcionarios');
    const dataJson = await response.json();
    console.log(dataJson);
}

async function dataProcessos() {
    const response = await fetch('http://localhost:8080/processos');
    const dataJson = await response.json();
    console.log(dataJson);
}

async function getFuncionarioPerId() {
    const response = await fetch('http://localhost:8080/funcionarios/35');
    const dataJson = await response.json();
    console.log(dataJson);
}

// getFuncionarioPerId();
dataFuncionarios();
dataProcessos();

function handleRequest() {
    const data = {
        name: userName,
        cpf: userCpf,
        cargo: profissionSelected,
        email: userEmail,
        request: detailsRequest,
        tipo_processo: selectedInitialOption,
        data_solicitacao: userDate,
        urgencia: nivelUrgencyRequest,
        status: nivelStatusRequested,
    };

    console.log(`nome: ${data.name}`);
    console.log(`cpf: ${data.cpf}`);
    console.log(`cargo: ${profissionSelected}`);
    console.log(`email: ${data.email}`);
    console.log(`detalhes da solicitação: ${data.request}`);
    console.log(`Tipo de processo: ${selectedInitialOption}`);
    console.log(`Data de processo: ${userDate}`);
    console.log(`Urgência: ${nivelUrgencyRequest}`);
    console.log(`Nível: ${nivelStatusRequested}`);
}

function handleGroupBtnsUrgency() {
    buttonsNivelUrgency.forEach((button, index) => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent;
            nivelUrgencyRequest = buttonText;
            chatBox.appendChild(createChatLi(buttonText, "outgoing"));

            buttonsNivelUrgency.forEach((btn) => {
                btn.disabled = true;
            });

            chatBox.appendChild(createChatLi("Obrigado. Qual é o status da solicitação?", "incoming"));
            buttonGroupStatus.style.display = 'block';
            chatBox.appendChild(buttonGroupStatus);
        })
    });
}

function handleGroupBtnsStatus() {
    buttonNivelStatus.forEach((button, index) => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent;
            nivelStatusRequested = buttonText;
            chatBox.appendChild(createChatLi(buttonText, "outgoing"));

            buttonNivelStatus.forEach((btn) => {
                btn.disabled = true;
            });

            handleRequest();
            cadastrarFuncionario();
            sendUserDataProcessos();
        })
    });
}

handleGroupBtnsUrgency();
handleGroupBtnsStatus();

function handleBtnHour() {
    btnHourRequested.addEventListener('click', (e) => {
        e.preventDefault();
        const hourRequested = document.querySelector('#hour').value.trim();
        const [hour, minute] = hourRequested.split(":");
        chatBox.appendChild(createChatLi(`${hour} hora e ${minute} minuto.`, "outgoing"));
        btnHourRequested.disabled = true;
    });
}

function handleBtnDate() {
    btnDateInsert.addEventListener('click', (e) => {
        e.preventDefault();
        const DateInsert = document.querySelector('#date').value.trim();
        userDate = DateInsert;
        chatBox.appendChild(createChatLi(DateInsert, "outgoing"));
        btnDateInsert.disabled = true;
        chatBox.appendChild(createChatLi("Obrigado. Qual é o nível de urgência da sua solicitação?", "incoming"));
        
        btnGroupUrgency.style.display = 'block';
        chatBox.appendChild(btnGroupUrgency);
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleBtnProfission() {
    btnSendProfission.addEventListener('click', (e) => {
        e.preventDefault();
        btnSendProfission.disabled = true;
        const select = document.querySelector('#profission');
        profissionSelected = select.options[select.selectedIndex].text;

        chatBox.appendChild(createChatLi(profissionSelected, "outgoing"));

        chatBox.appendChild(createChatLi("Obrigado. Para prosseguirmos, precisamos que você informe o seu e-mail.", "incoming"));
        awaitingEmail = true;
    });
}

handleBtnHour();
handleBtnDate();
handleBtnProfission();
let awaitingEmail = false;
let awaitingDetailsRequest = false;

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

const createChatLi = (message, className, isError = false) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add('chat', className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;

    const messageElement = chatLi.querySelector("p");
    messageElement.textContent = message;

    if(isError) {
        messageElement.classList.add('text-danger');
    }
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

function handleBtnRequestedHour() {
    btnHourRequested.addEventListener('submit', (e) => {
        e.preventDefault();
    });
}

async function cadastrarFuncionario() {

    const removeFormatCpf = userCpf.replace(/\./g, '').replace(/-/g, '');

    const userData = {
        nome: userName,
        cpf: removeFormatCpf,
        email: userEmail,
        cargo: profissionSelected,
    };

    try {
        const response = await fetch('http://localhost:8080/funcionarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (response.ok) {
        const funcionario = await response.json();
        funcionarioId = funcionario.id_funcionario;  // Armazena o ID retornado
        console.log(`Funcionário cadastrado com sucesso. ID: ${funcionarioId}`);
        
        // Agora que o funcionário está cadastrado, pode prosseguir com o processo
        sendUserDataProcessos();
    } else {
        console.error('Erro ao cadastrar funcionário');
    }

    } catch(e) {
        console.log('Erro ao enviar os dados', e);
    }
}

async function sendUserDataProcessos() {
    const userData = {
        descricao: detailsRequest,
        tipo_processo: selectedInitialOption,
        data_solicitacao: userDate,
        urgencia: nivelUrgencyRequest,
        status: nivelStatusRequested,
        id_funcionario: funcionarioId,
    };

    try {
        const response = await fetch('http://localhost:8080/processos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    } catch(e) {
        console.log('Erro ao enviar os dados', e);
    }
}

handleMessageFirst(options);


function formatCpf(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Insere o primeiro ponto
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Insere o segundo ponto
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Insere o hífen
    return cpf;
}


let selectedOption = "";
let selectedChoice = "";
let userName = ""; // Inicialização da variável userName
let userCpf = ""; // Inicialização da variável userCpf
let absenceDate = ""; // Variável para armazenar a data da falta
let absenceReason = ""; // Variável para armazenar o motivo da falta
let hasMedicalCertificate = ""; // Variável para armazenar a resposta sobre o atestado
let MedicalCertificate = false;

const resetForm = () => {
    selectedOption = "";
    userName = "";
    userCpf = "";
    absenceDate = "";
    absenceReason = "";
    hourRequested = "";
};

let awaitingMedicalCertificateChoice = false;
let awaitRequestedHour = false;
let hourRequested = "";

const handleChat = () => {
    let userMessage = chatInput.value.trim();

    if (awaitingEmail) {
        if (isValidEmail(userMessage)) {
            chatBox.appendChild(createChatLi(userMessage, "outgoing")); // Mostra o e-mail do usuário
            awaitingEmail = false; // Finaliza a espera pelo e-mail
            userEmail = userMessage; // Armazena o e-mail
            chatInput.value = ''; // Limpa o campo de texto
            chatBox.scrollTo(0, chatBox.scrollHeight);

            // Agora solicita os detalhes da solicitação
            chatBox.appendChild(createChatLi("Por favor, descreva sua solicitação em detalhes.", "incoming"));
            awaitingDetailsRequest = true; // Inicia a espera pelos detalhes
        } else {
            chatBox.appendChild(createChatLi("Por favor, insira um e-mail válido.", "incoming", true)); // Mensagem de erro
            chatInput.value = ''; // Limpa o campo de texto para tentar de novo
            chatBox.scrollTo(0, chatBox.scrollHeight);
        }
    }

    else if (awaitingDetailsRequest) {
        detailsRequest = userMessage; // Captura os detalhes da solicitação
        chatBox.appendChild(createChatLi(detailsRequest, "outgoing")); // Exibe a solicitação
        chatInput.value = ''; // Limpa o campo de texto
        chatBox.scrollTo(0, chatBox.scrollHeight);

        // Agora que os detalhes foram capturados, finaliza o processo e chama handleRequest()
        awaitingDetailsRequest = false; // Finaliza a espera pelos detalhes
        chatBox.appendChild(createChatLi("Obrigado. Por favor, insira a data da solicitação.", "incoming"));
        formDate.style.display = 'block';
        chatBox.appendChild(formDate);
    }

    // Verificação da seleção de opção principal
    if (!isNaN(parseInt(userMessage, 10)) && options[userMessage] && !awaitingMedicalCertificateChoice && !awaitRequestedHour) {
        chatBox.appendChild(createChatLi(userMessage, "outgoing"));
        chatInput.value = '';
        selectedInitialOption = options[userMessage]; 
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
            chatBox.appendChild(createChatLi(`Obrigado, ${firstName}! Para prosseguirmos com sua solicitação, precisamos que você informe seu CPF.`, "incoming"));
            chatInput.value = '';
            chatBox.scrollTo(0, chatBox.scrollHeight);
        }
        
        else if (userName !== "" && userCpf === "" && userMessage.length > 0) {
            userRegistration = userMessage;
            const firstName = userName.split(" ")[0];
            chatBox.appendChild(createChatLi(userMessage, "outgoing"));
            chatBox.appendChild(createChatLi(`Obrigado, ${firstName}. Quantas horas extras você deseja solicitar?`, "incoming"));
            handleHours(optionsHours);
            chatInput.value = '';
            chatBox.scrollTo(0, chatBox.scrollHeight);
        }
        
        
        else if (userCpf !== "" && hourRequested === "" && userMessage === '5') {
            hourRequested = optionsHours[userMessage];
            chatInput.value = "";
            chatBox.appendChild(createChatLi(`${hourRequested}`, "outgoing")); 
            chatBox.appendChild(createChatLi("Por favor, insira a quantidade de horas extras que deseja solicitar.", "incoming"));
            formHour.style.display = 'block';
            chatBox.appendChild(formHour);
        }
        
        else if (userCpf !== "" && hourRequested === "" && optionsHours[userMessage]) {
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
        chatBox.appendChild(createChatLi(`Obrigado, ${firstName}! Agora, por favor, informe seu CPF.`, "incoming"));
        chatInput.value = '';
        chatBox.scrollTo(0, chatBox.scrollHeight);
    }

    // Verificação do cpf
    else if (userName !== "" && userCpf === "" && userMessage.length > 0) {
        userMessage = formatCpf(userMessage);
        const validCpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        chatInput.value = '';
        chatBox.scrollTo(0, chatBox.scrollHeight);
    
        if (validCpf.test(userMessage)) {
            userCpf = userMessage; // Salva o CPF apenas se for válido
            chatBox.appendChild(createChatLi(userMessage, "outgoing"));
            chatBox.appendChild(createChatLi(`Obrigado. Por favor, informe o seu cargo.`, "incoming"));
            formProfission.style.display = 'block';
            chatBox.appendChild(formProfission);
        } else {
            // Se o CPF não for válido, pedimos ao usuário para tentar novamente
            chatBox.appendChild(createChatLi("Por favor, informe um CPF válido.", "incoming", true));
    
            // Aqui, você deve ter um evento que atualiza userMessage a partir da entrada do usuário
            chatInput.addEventListener('keypress', function (event) {
                if (event.key === 'Enter') {
                    userMessage = formatCpf(chatInput.value);
                    chatInput.value = ''; // Limpa a entrada
    
                    // Verifique novamente a validade do CPF
                    if (validCpf.test(userMessage)) {
                        userCpf = userMessage; // Salva o CPF
                    } else {
                        chatBox.appendChild(createChatLi("Por favor, informe um CPF válido.", "incoming", true));
                    }
                    chatBox.scrollTo(0, chatBox.scrollHeight);
                }
            });
        }
    }

    // else if (userName !== "" && userCpf === "" && userMessage.length > 0) {
    //     userMessage = formatCpf(userMessage);
    //     userCpf = userMessage;
    //     const firstName = userName.split(" ")[0];
    //     const validCpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    //     chatInput.value = '';
    //     chatBox.scrollTo(0, chatBox.scrollHeight);

    //     if(validCpf.test(userMessage)) {
    //         chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    //         chatBox.appendChild(createChatLi(`Obrigado.`, "incoming"));
    //     } else {
    //         chatBox.appendChild(createChatLi("Por favor, informe um cpf válido.", "incoming", true));
    //     }

    //     if (selectedOption === '1') {
    //         chatBox.appendChild(createChatLi(`Agora, por favor, informe a data da falta.`, "incoming"));
    //         formDate.style.display = 'block';
    //         chatBox.appendChild(formDate);
    //     } else if (selectedOption === '2' && userCpf !== "") {
    //         if (hourRequested === "") {
    //             // Exibe as opções de horas
    //             chatBox.appendChild(createChatLi("Quantas horas extras você deseja solicitar?", "incoming"));
    //             handleHours(optionsHours);
    //         } else if (optionsHours[userMessage]) {
    //             // Armazena a quantidade de horas extras solicitada
    //             hourRequested = optionsHours[userMessage];
    //             chatBox.appendChild(createChatLi(`Você solicitou ${hourRequested}.`, "incoming"));
    //             chatInput.value = '';
    //             chatBox.scrollTo(0, chatBox.scrollHeight);
    //         } else if (userMessage === '5') {
    //             // Caso o usuário escolha "Outra opção", pergunte o número específico de horas
    //             chatBox.appendChild(createChatLi("Por favor, insira a quantidade de horas extras que deseja solicitar.", "incoming"));
    //             formHour.style.display = 'block';
    //             chatBox.appendChild(formHour);
    //         }
    //     }
    // }

    // Verificação para a data
    // else if (selectedOption === '1' && userCpf !== "" && absenceDate === "" && userMessage.length > 0) {
    //     const datePattern = /^\d{2}-\d{2}-\d{4}$/;
    //     if (datePattern.test(userMessage)) {
    //         absenceDate = userMessage; // Armazena a data
    //         chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    //         // chatBox.appendChild(createChatLi(`Sua falta no dia ${absenceDate} foi registrada com sucesso. Por favor, agora nos informe o motivo da sua ausência em ${absenceDate}.`, "incoming"));
    //     } else {
    //         // chatBox.appendChild(createChatLi("Por favor, informe a data corretamente no formato DD-MM-YYYY.", "incoming"));
    //     }
    //     chatInput.value = '';
    //     chatBox.scrollTo(0, chatBox.scrollHeight);
    // }

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

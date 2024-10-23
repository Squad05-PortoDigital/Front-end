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

const buttonGroupCertificationMedicate = document.getElementById('btns-groupCertificate');
const buttonCertificationMedicate = document.querySelectorAll('#btnCertificate');

const formUpload = document.getElementById('uploadForm');

let userEmail = ""; // Variável global para armazenar o email
let profissionSelected = ""; // Variável global para armazenar o cargo
let detailsRequest = ""; // Armazena o detalhes da solicitação
let selectedInitialOption = "";
let userDate = "";
let nivelUrgencyRequest = "";
let nivelStatusRequested = "";
let funcionarioId = "";
let awaitingMedicalCertificateChoice = false;
let selectedFile;

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

// async function getUpload() {
//     const response = await fetch('http://localhost:8080/processos/upload');
//     const dataJson = await response.json();
//     console.log(dataJson);
// }

// getUpload();
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
        nome_arquivo: selectedFile,
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
            chatBox.appendChild(createChatLi("Você possui atestado médico?", "incoming"));
            buttonGroupCertificationMedicate.style.display = 'block';
            chatBox.appendChild(buttonGroupCertificationMedicate);
            handleBtnCertificateMedicial();

            // if(awaitingMedicalCertificateChoice && (userMessage === '1' || userMessage === '2')) {
            //     if (userMessage === '1') { // Sim - Anexar atestado
            //         chatBox.appendChild(createChatLi("Por favor, anexe o atestado.", "incoming"));
            //         fileInput.style.display = 'block';
            //         chatBox.appendChild(fileInput);
            //         awaitingMedicalCertificateChoice = false;
            //         handleChangeInputFile();
            //     } else {
            //         chatBox.appendChild(createChatLi("Sua justificativa foi registrada com sucesso!", "incoming"));
            //     }
            // }
            // cadastrarFuncionario();
            // sendUserDataProcessos();
        })
    });
}

function handleBtnCertificateMedicial() {
    buttonCertificationMedicate.forEach((button) => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent;
            chatBox.appendChild(createChatLi(buttonText, "outgoing"));

            if (buttonText === 'Sim') {
                chatBox.appendChild(createChatLi("Por favor, anexe o atestado.", "incoming"));
                formUpload.style.display = 'block';
                chatBox.appendChild(formUpload);

                // fileInput.addEventListener('change', () => {
                //     const file = fileInput.files[0];
                //     selectedFile = file;

                //     if (file) {
                //         const validExtensions = ['image/png', 'image/jpeg', 'application/pdf'];
                //         if (!validExtensions.includes(file.type)) {
                //             chatBox.appendChild(createChatLi("Erro: O arquivo deve ser PNG, JPG ou PDF.", "incoming", true));
                //             fileInput.value = "";
                //         } else {
                //             // O arquivo é válido, agora você pode enviar os dados
                //             cadastrarFuncionario();
                //             sendUserDataProcessos();
                //         }
                //     }
                // });
            } else {
                chatBox.appendChild(createChatLi("Sua justificativa foi registrada com sucesso!", "incoming"));
                cadastrarFuncionario();
                sendUserDataProcessos();
            }

            buttonCertificationMedicate.forEach((btn) => {
                btn.disabled = true;
            });
        });
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
        id_funcionario: funcionarioId, // ID do funcionário que já foi capturado
    };

    try {
        const response = await fetch('http://localhost:8080/processos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            const processo = await response.json();
            console.log(processo);
            ocorrenciaId = processo.id_ocorrencia; // Captura o ID da ocorrência e armazena na variável global
            insertFile(ocorrenciaId);  // Passa o ID da ocorrência para o upload do arquivo
        } else {
            console.error('Erro ao registrar o processo');
        }
    } catch (e) {
        console.log('Erro ao enviar os dados', e);
    }
}

document.getElementById('fileInput').addEventListener('change', function() {
    selectedFile = this.files[0];
});

// Adiciona o listener ao formulário
document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário
    const formData = new FormData();

    // Adicionando o arquivo e o ID da ocorrência ao FormData
    formData.append('file', selectedFile);
    formData.append('ocorrenciaId', 28); // Usando a variável global

    fetch('http://localhost:8080/processos/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Para enviar cookies, se necessário
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao fazer upload: ' + response.statusText);
        }
        return response.text(); // Lida com a resposta como texto
    })
    .then(data => {
        console.log('Upload realizado com sucesso:', data); // Aqui você pode ver a resposta do servidor
    })
    .catch(error => {
        console.error('Erro ao fazer upload:', error);
    });
    console.log('Ok');
});

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
            chatBox.appendChild(createChatLi("Por favor, informe o motivo da falta.", "incoming"));
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
        chatBox.appendChild(createChatLi("Obrigado. Por favor, insira a data da falta.", "incoming"));
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

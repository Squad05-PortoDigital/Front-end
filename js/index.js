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

function preventButton() {
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('uploadForm');
        const submitButton = document.getElementById('btn-send-file');
        const fileInput = document.getElementById('fileInput');
        const errorMessage = document.createElement('p');
        
        
        errorMessage.id = 'fileError';
        errorMessage.style.color = 'red';
        errorMessage.style.display = 'none';
        fileInput.parentElement.appendChild(errorMessage);

      
        submitButton.disabled = true;

        
        fileInput.addEventListener('change', function() {
            const allowedExtensions = ['png', 'pdf', 'jpg'];
            const file = fileInput.files[0];
            const fileExtension = file ? file.name.split('.').pop().toLowerCase() : '';
            
            if (file && !allowedExtensions.includes(fileExtension)) {
                errorMessage.textContent = 'Formato de arquivo inválido. Apenas PNG, PDF ou JPG são permitidos.';
                errorMessage.style.display = 'block';
                submitButton.disabled = true;
            } else {
                errorMessage.style.display = 'none';
                submitButton.disabled = !fileInput.files.length;
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Previne o envio do formulário
            chatBox.appendChild(createChatLi("Sua solicitação foi recebida. Acompanhe seu e-mail para mais detalhes.", "incoming"));
            submitButton.disabled = true;
            document.getElementById('buttonGenerate').style.display = 'block';
            chatBox.appendChild(document.getElementById('buttonGenerate'));
        });
    });
}


preventButton();


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

dataFuncionarios();
dataProcessos();

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

            
            chatBox.appendChild(createChatLi("Você possui atestado médico?", "incoming"));
            buttonGroupCertificationMedicate.style.display = 'block';
            chatBox.appendChild(buttonGroupCertificationMedicate);
            handleBtnCertificateMedicial();
        })
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
        const funcionario_id = funcionario.id_funcionario;
        await sendUserDataProcessos(funcionario_id);
    } else {
        console.error('Erro ao cadastrar funcionário');
    }

    } catch(e) {
        console.log('Erro ao enviar os dados', e);
    }
}

async function sendUserDataProcessos(funcionarioId) {
    const button = document.getElementById('buttonGenerate');
    button.textContent = 'Aguarde...';
    button.disabled = true;

    const userData = {
        descricao: detailsRequest || '',
        tipo_processo: selectedInitialOption || '',
        data_solicitacao: userDate || '',
        urgencia: nivelUrgencyRequest || '',
        status: nivelStatusRequested || '',
        id_destinatario: funcionarioId || null,
        id_funcionario: funcionarioId || null,
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
            const processo_ocorrencia = processo.id_ocorrencia;
            await sendFile(processo_ocorrencia);
            
            button.textContent = 'Gerar Comprovante';
            button.disabled = false;

            button.addEventListener('click', async function() {
                await generatePdf(processo_ocorrencia);
                button.disabled = true;
            });
        } else {
            console.error('Erro ao registrar o processo');
            button.textContent = 'Erro! Tente novamente';
        }
    } catch (e) {
        console.log('Erro ao enviar os dados', e);
        button.textContent = 'Erro! Tente novamente';
    }
}

async function generatePdf(id_ocorrencia) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvhb90jzjlDd14xopEpRw-IYoTgIdk-s3vvQ&s";
    const imageX = 10;
    const imageY = 20;
    const imageWidth = 50;
    const imageHeight = 50;

    doc.addImage(imageUrl, "JPG", imageX, imageY, imageWidth, imageHeight);

    const textX = imageX + imageWidth + 10;
    let textY = imageY;

    doc.setFontSize(18);
    doc.text("Comprovante de Solicitação", textX, textY);

    textY += 20;

    // Número da Solicitação
    doc.setFontSize(12);
    doc.text("Número da Solicitação:", textX, textY);
    doc.text(String(id_ocorrencia), textX + 50, textY);

    textY += 10;
    doc.text("Data:", textX, textY);
    doc.text(new Date().toLocaleDateString(), textX + 50, textY);

    textY += 10;
    doc.text("Solicitante:", textX, textY);
    doc.text(userName, textX + 50, textY); // Verifique se 'userName' está definido corretamente

    textY += 10;
    doc.text("Descrição:", textX, textY);
    doc.text(selectedInitialOption, textX + 50, textY);

    textY += 30;
    doc.setFontSize(10);
    doc.text("Este é um comprovante gerado automaticamente. Guarde-o para referência.", 10, textY);

    textY += 20;
    doc.line(10, textY, 190, textY);
    textY += 10;
    doc.text("Assinatura do Solicitante", 10, textY);

    doc.save('comprovante.pdf');
}

async function sendFile(idOcorrencia) {

    document.getElementById('uploadForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Previne o envio padrão do formulário
        const formData = new FormData();
        const fileInput = document.getElementById('fileInput');
    
        selectedFile = fileInput.files[0];
    
        // Adicionando o arquivo e o ID da ocorrência ao FormData
        formData.append('file', selectedFile);
        formData.append('ocorrenciaId', idOcorrencia);
    
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
            document.getElementById('btn-send-file').disabled = true;
            chatBox.appendChild(createChatLi("Sua justificativa foi registrada com sucesso!", "incoming"));
        })
        .catch(error => {
            console.error('Erro ao fazer upload:', error);
        });
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
            } else {
                chatBox.appendChild(createChatLi("Sua solicitação foi recebida. Acompanhe seu e-mail para mais detalhes.", "incoming"));
                cadastrarFuncionario();
                sendUserDataProcessos();
                document.getElementById('buttonGenerate').style.display = 'block';
                chatBox.appendChild(document.getElementById('buttonGenerate'));
            }

            cadastrarFuncionario();
            sendUserDataProcessos();

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
    const dateInput = document.querySelector('#date');
    const btnDateInsert = document.querySelector('#btn-send-dateInsert');

    // Desabilita o botão inicialmente
    btnDateInsert.disabled = true;

    // Habilita o botão se o campo de data tiver algum valor
    dateInput.addEventListener('input', () => {
        btnDateInsert.disabled = dateInput.value.trim() === '';
    });

    btnDateInsert.addEventListener('click', (e) => {
        e.preventDefault();
        const DateInsert = dateInput.value.trim();
        userDate = DateInsert;
        
        chatBox.appendChild(createChatLi(DateInsert, "outgoing"));
        btnDateInsert.disabled = true;
        chatBox.appendChild(createChatLi("Obrigado. Qual é o nível de urgência da sua solicitação?", "incoming"));
        
        btnGroupUrgency.style.display = 'block';
        chatBox.appendChild(btnGroupUrgency);
    });
}

function handleBtnProfission() {
    btnSendProfission.addEventListener('click', (e) => {
        e.preventDefault();
        btnSendProfission.disabled = true;
       
        const select = document.querySelector('#profission');
        profissionSelected = select.options[select.selectedIndex].text;

        chatBox.appendChild(createChatLi(profissionSelected, "outgoing"));
        chatBox.appendChild(createChatLi("Obrigado. Por favor, informe o motivo da falta.", "incoming"));

        handleBtnProfission();
        awaitingProfission = true;
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
    6: "Solicitação de documento",
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

// vaiaveis de controle
let awaitingNameUser = false;
let awaitingCpfUser = false;
let awaitingEmailUser = false;
let awaitingProfission = false;

let awaitRequestedHour = false;
let hourRequested = "";

let awaitingInput = false;

const handleChat = () => {
    let userMessage = chatInput.value.trim();

    // Verificação da seleção de opção principal
    if (!isNaN(parseInt(userMessage, 10)) && options[userMessage] && !awaitingInput) {
        // Tratamento para uma opção válida somente quando não está aguardando um dado específico
        chatBox.appendChild(createChatLi(userMessage, "outgoing"));
        chatInput.value = '';
        selectedOption = userMessage;
    
        switch (selectedOption) {
            case '1':
                awaitingNameUser = true; // Ativa a flag para esperar o nome
                awaitingInput = true; // Indica que o chatbot está aguardando uma entrada específica
                chatBox.appendChild(createChatLi("Para justificar sua falta, por favor, informe seu nome completo.", "incoming"));
                break;
            case '2':
                awaitingNameUser = true;
                awaitingInput = true;
                chatBox.appendChild(createChatLi("Para solicitar horas extras, informe seu nome completo.", "incoming"));
                break;

            case '3':
                awaitingNameUser = true;
                awaitingInput = true;
                chatBox.appendChild(createChatLi("Para solicitar férias, informe seu nome completo.", "incoming"));
                break;

            case '4':
                awaitingNameUser = true;
                awaitingInput = true;
                chatBox.appendChild(createChatLi("Para solicitar desligamento, informe seu nome completo.", "incoming"));
                break;

            case '5':
                awaitingNameUser = true;
                awaitingInput = true;
                chatBox.appendChild(createChatLi("Para solicitar benefícios, informe seu nome completo.", "incoming"));
                break;

            case '6':
                awaitingNameUser = true;
                awaitingInput = true;
                chatBox.appendChild(createChatLi("Para realizar a solicitação de documento, informe seu nome completo.", "incoming"));
                break;
            // Continue para as demais opções
        }
    } else if (awaitingNameUser) {
        const userName = userMessage.trim();
        const firstName = userName.split(" ")[0];
        
        if (userName === "") {
            chatBox.appendChild(createChatLi("O nome não pode estar vazio. Por favor, informe seu nome completo.", "incoming", true));
        } else {
            chatBox.appendChild(createChatLi(userName, "outgoing"));
            chatBox.appendChild(createChatLi(`Olá, ${firstName}! Por favor, informe seu CPF.`, "incoming"));
            chatInput.value = '';

            awaitingNameUser = false; // Reseta a flag de nome
            awaitingCpfUser = true; // Ativa a flag de CPF
            awaitingInput = true; // Mantém a flag ativa até que o CPF seja preenchido
        }
    } else if (awaitingCpfUser) {
        const cpfFormat = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
        const userCpf = userMessage;

        if(userCpf === '') {
            chatBox.appendChild(createChatLi("O CPF não pode ficar em branco. Por favor, informe seu CPF para continuarmos", "incoming", true));
        } else {
            if (cpfFormat.test(userMessage)) {
                chatBox.appendChild(createChatLi(formatCpf(userCpf), "outgoing"));
                chatBox.appendChild(createChatLi(`Obrigado! Agora, por favor, informe seu e-mail.`, "incoming"));
                chatInput.value = '';
                awaitingCpfUser = false; // Reseta a flag de CPF
                awaitingEmailUser = true; // Ativa a flag de e-mail
            } else {
                chatBox.appendChild(createChatLi(formatCpf(userCpf), "outgoing"));
                chatBox.appendChild(createChatLi("CPF inválido. Por favor, insira um CPF válido.", "incoming", true));
                chatInput.value = '';
            }
        }

    } else if (awaitingEmailUser) {
        const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const userEmail = userMessage;

        if (userMessage.trim() === '') {
            chatBox.appendChild(createChatLi("O e-mail não pode estar vazio. Por favor, informe seu e-mail", "incoming", true));
        } else {
            if (emailFormat.test(userMessage)) {
                chatBox.appendChild(createChatLi(userEmail, "outgoing"));
                chatInput.value = '';
                awaitingEmailUser = false; // Reseta a flag de e-mail
                awaitingInput = false; // Libera a entrada de novas opções de menu

                chatBox.appendChild(createChatLi(`Obrigado. Por favor, Informe o seu cargo.`, "incoming"));

                formProfission.style.display = 'block';
                chatBox.appendChild(formProfission);
            } else {
                chatBox.appendChild(createChatLi(userEmail, "outgoing"));
                chatBox.appendChild(createChatLi("E-mail inválido. Por favor, insira um e-mail válido.", "incoming", true));
                chatInput.value = '';
            }
        }
        
    } else if (awaitingProfission) {
        const reason = userMessage.trim();

        if(reason === '') {
            chatBox.appendChild(createChatLi("O motivo não pode estar vazio. Por favor, informe o motivo da falta.", "incoming", true));
        } else {
            chatBox.appendChild(createChatLi(reason, "outgoing"));
            chatBox.appendChild(createChatLi(`Obrigado. Por favor, insira a data da falta.`, "incoming"));
            chatInput.value = '';
            formDate.style.display = 'block';
            chatBox.appendChild(formDate);
        }
        
    }

     else {
        chatBox.appendChild(createChatLi(userMessage, "outgoing"));
        chatBox.appendChild(createChatLi("Opção inválida. Por favor, escolha uma opção válida entre 1 e 5.", "incoming", true));
        chatInput.value = '';
        handleMessageInit(options);
    }
};


function handleMessageInit(options) {
    const values = Object.keys(options);
    values.forEach(key => {
        chatBox.appendChild(createChatLi(`${key}. ${options[key]}`, "incoming"));   
    });
}

setTimeout(() => {
    handleMessageInit(options);
  }, 2000);

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
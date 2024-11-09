const sendChatBtn = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatBox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");
const fileInput = document.getElementById("fileInput");
const formHour = document.getElementById("formHour");
const formDate = document.getElementById("formDate");

const formDateInit = document.getElementById("FieldDate");
const formDateEnd = document.getElementById("FieldDate");

const formProfission = document.getElementById("formProfission");
const btnSendProfission = document.querySelector("#btn-send-profission");

const formBeneficios = document.getElementById("formBeneficios");
const btnSendBeneficios = document.querySelector("#btn-send-beneficios");

const btnHourRequested = document.querySelector("#btn-send-hourRequested");
const btnDateInsert = document.querySelector("#btn-send-dateInsert");

const btnGroupUrgency = document.querySelector("#btns-groupUrgency");
const buttonsNivelUrgency = document.querySelectorAll("#btnUrgency");

const buttonGroupStatus = document.querySelector("#btns-groupStatus");
const buttonNivelStatus = document.querySelectorAll("#btnStatus");

const buttonGroupArchive = document.getElementById("btns-groupArchive");
const buttonArchive = document.querySelectorAll("#btnArchive");

const formUpload = document.getElementById("uploadForm");

let userName = "";
let userCpf = "";
let userEmail = "";
let profissionSelected = "";
let beneficioSelected = "";
let detailsRequest = "";
let selectedInitialOption = "";
let userDate = "";
let nivelUrgencyRequest = "";
let nivelStatusRequested = "";
let hoursRequested = "";
let funcionarioId = "";
let selectedFile;

let dateRequestedHolidayFirst = "";
let dateRequestedHolidayEnd = "";

let selectedOption = "";
let selectedChoice = "";

const getDateCurrentWithFormatting = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function formatarDataParaBR(dataAmericana) {
  const [ano, mes, dia] = dataAmericana.split("-");
  return `${dia}-${mes}-${ano}`;
}

function UserDatas() {
  const userData = {
    name: userName,
    cpf: userCpf,
    email: userEmail,
    descricao: detailsRequest,
    tipo_processo: selectedInitialOption || "",
    data_solicitacao: getDateCurrentWithFormatting(),
    data_ocorrido: formatarDataParaBR(userDate) || null,
    urgencia: nivelStatusRequested || "",
    id_destinatario: funcionarioId || null,
    id_funcionario: funcionarioId || null,
    hour: hourRequested,
    dateHolidayFirst: formatarDataParaBR(dateRequestedHolidayFirst),
    dateHolidayEnd: formatarDataParaBR(dateRequestedHolidayEnd),
    hourExtra: dateRequestedHolidayEnd,
    beneficio: selectedOption === "5" ? beneficioSelected : null,
  };

  console.log(`Nome: ${userData.name}`);
  console.log(`Data da solicitação: ${userData.data_solicitacao}`);
  console.log(`Data para Ocorrência: ${userData.data_solicitacao}`);
  console.log(`CPF: ${userData.cpf}`);
  console.log(`Descrição: ${userData.descricao}`);
  console.log(`Tipo de processo: ${userData.tipo_processo}`);
  console.log(`Urgência: ${userData.urgencia}`);
  console.log(`Data de férias inicio: ${userData.dateHolidayFirst}`);
  console.log(`Data de férias fim: ${userData.dateHolidayEnd}`);
  console.log(`Horas Requisitadas: ${userData.hour}`);
  console.log(`Beneficio: ${userData.beneficio}`);
}

function preventButton() {
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("uploadForm");
    const submitButton = document.getElementById("btn-send-file");
    const fileInput = document.getElementById("fileInput");
    const errorMessage = document.createElement("p");

    errorMessage.id = "fileError";
    errorMessage.style.color = "red";
    errorMessage.style.display = "none";
    fileInput.parentElement.appendChild(errorMessage);

    submitButton.disabled = true;

    fileInput.addEventListener("change", function () {
      const allowedExtensions = ["png", "pdf", "jpg"];
      const file = fileInput.files[0];
      const fileExtension = file
        ? file.name.split(".").pop().toLowerCase()
        : "";

      if (file && !allowedExtensions.includes(fileExtension)) {
        errorMessage.textContent =
          "Formato de arquivo inválido. Apenas PNG, PDF ou JPG são permitidos.";
        errorMessage.style.display = "block";
        submitButton.disabled = true;
      } else {
        errorMessage.style.display = "none";
        submitButton.disabled = !fileInput.files.length;
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      chatBox.appendChild(
        createChatLi(
          "Sua solicitação foi recebida. Acompanhe seu e-mail para mais detalhes.",
          "incoming"
        )
      );
      submitButton.disabled = true;
      document.getElementById("buttonGenerate").style.display = "block";
      chatBox.appendChild(document.getElementById("buttonGenerate"));
    });
  });
}

preventButton();

async function dataFuncionarios() {
  const response = await fetch("http://localhost:8080/funcionarios");
  const dataJson = await response.json();
  console.log(dataJson);
}

async function dataProcessos() {
  const response = await fetch("http://localhost:8080/processos");
  const dataJson = await response.json();
  console.log(dataJson);
}

dataFuncionarios();
dataProcessos();

function handleGroupBtnsStatus() {
  buttonsNivelUrgency.forEach((button, index) => {
    button.addEventListener("click", () => {
      const buttonText = button.textContent;
      nivelStatusRequested = buttonText;
      chatBox.appendChild(createChatLi(buttonText, "outgoing"));

      buttonsNivelUrgency.forEach((btn) => {
        btn.disabled = true;
      });

      if (selectedOption === "1") {
        chatBox.appendChild(
          createChatLi(
            "Há algum documento que você gostaria de anexar?",
            "incoming"
          )
        );
      }

      if (selectedOption === "2") {
        chatBox.appendChild(
          createChatLi(
            "Você gostaria de anexar algum documento para justificar sua solicitação?",
            "incoming"
          )
        );
      }

      if (selectedOption === "3") {
        chatBox.appendChild(
          createChatLi(
            "Para prosseguir, você quer incluir algum arquivo com essa solicitação?",
            "incoming"
          )
        );
      }

      if (selectedOption === "4") {
        chatBox.appendChild(
          createChatLi(
            "Há algum documento que você gostaria de anexar?",
            "incoming"
          )
        );
      }

      if (selectedOption === "5") {
        chatBox.appendChild(
          createChatLi(
            "Deseja enviar um documento adicional para complementar sua solicitação?",
            "incoming"
          )
        );
      }

      buttonGroupArchive.style.display = "block";
      chatBox.appendChild(buttonGroupArchive);
      handleArchive();
    });
  });
}

async function cadastrarFuncionario() {
  const removeFormatCpf = userCpf.replace(/\./g, "").replace(/-/g, "");

  const userData = {
    nome: userName,
    cpf: removeFormatCpf,
    email: userEmail,
    cargo: profissionSelected,
  };

  try {
    const response = await fetch("http://localhost:8080/funcionarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const funcionario = await response.json();
      const funcionario_id = funcionario.id_funcionario;
      await sendUserDataProcessos(funcionario_id);
    } else {
      console.error("Erro ao cadastrar funcionário");
    }
  } catch (e) {
    console.log("Erro ao enviar os dados", e);
  }
}

async function sendUserDataProcessos(funcionarioId) {
  const button = document.getElementById("buttonGenerate");
  button.textContent = "Aguarde...";
  button.disabled = true;

  const userData = {
    descricao: detailsRequest,
    tipo_processo: selectedInitialOption,
    data_solicitacao: getDateCurrentWithFormatting(),
    data_ocorrencia: selectedOption === "2" ? null : userDate,
    hora_extra: hourRequested || null,
    inicio_ferias: selectedOption === "3" ? dateRequestedHolidayFirst: null,
    fim_ferias: selectedOption === "3" ? dateRequestedHolidayEnd: null,
    urgencia: nivelStatusRequested,
    id_destinatario: funcionarioId || null,
    id_funcionario: funcionarioId || null,
    beneficio: selectedOption === "5" ? beneficioSelected : null,
  };

  try {
    const response = await fetch("http://localhost:8080/processos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const processo = await response.json();
      const processo_ocorrencia = processo.id_ocorrencia;
      await sendFile(processo_ocorrencia);

      button.textContent = "Gerar Comprovante";
      button.disabled = false;

      button.addEventListener("click", async function () {
        await generatePdf(processo_ocorrencia);
        button.disabled = true;
      });
    } else {
      console.error("Erro ao registrar o processo");
      button.textContent = "Erro! Tente novamente";
    }
  } catch (e) {
    console.log("Erro ao enviar os dados", e);
    button.textContent = "Erro! Tente novamente";
  }
}

async function generatePdf(id_ocorrencia) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const imageUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvhb90jzjlDd14xopEpRw-IYoTgIdk-s3vvQ&s";
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

  doc.setFontSize(12);
  doc.text("Número da Solicitação:", textX, textY);
  doc.text(String(id_ocorrencia), textX + 50, textY);

  textY += 10;
  doc.text("Data:", textX, textY);
  doc.text(new Date().toLocaleDateString(), textX + 50, textY);

  textY += 10;
  doc.text("Solicitante:", textX, textY);
  doc.text(userName, textX + 50, textY);

  textY += 10;
  doc.text("Descrição:", textX, textY);
  doc.text(selectedInitialOption, textX + 50, textY);

  textY += 30;
  doc.setFontSize(10);
  doc.text(
    "Este é um comprovante gerado automaticamente. Guarde-o para referência.",
    10,
    textY
  );

  textY += 20;
  doc.line(10, textY, 190, textY);
  textY += 10;
  doc.text("Assinatura do Solicitante", 10, textY);

  doc.save("comprovante.pdf");
}

async function sendFile(idOcorrencia) {
  document
    .getElementById("uploadForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData();
      const fileInput = document.getElementById("fileInput");

      selectedFile = fileInput.files[0];

      formData.append("file", selectedFile);
      formData.append("ocorrenciaId", idOcorrencia);

      fetch("http://localhost:8080/processos/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao fazer upload: " + response.statusText);
          }
          return response.text();
        })
        .then((data) => {
          document.getElementById("btn-send-file").disabled = true;
        })
        .catch((error) => {
          console.error("Erro ao fazer upload:", error);
        });
    });
}

function handleArchive() {
  buttonArchive.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonText = button.textContent;
      chatBox.appendChild(createChatLi(buttonText, "outgoing"));

      if (buttonText === "Sim" && selectedOption === "1") {
        chatBox.appendChild(
          createChatLi("Por favor, anexe o atestado.", "incoming")
        );
        formUpload.style.display = "block";
        chatBox.appendChild(formUpload);
      } else if (buttonText === "Sim" && selectedOption === "2") {
        chatBox.appendChild(
          createChatLi("Por favor, anexe o arquivo desejado.", "incoming")
        );
        formUpload.style.display = "block";
        chatBox.appendChild(formUpload);
      } else if (buttonText === "Sim" && selectedOption === "3") {
        chatBox.appendChild(
          createChatLi(
            "Por favor, selecione o arquivo que deseja anexar à sua solicitação.",
            "incoming"
          )
        );
        formUpload.style.display = "block";
        chatBox.appendChild(formUpload);
      } else if (buttonText === "Sim" && selectedOption === "4") {
        chatBox.appendChild(
          createChatLi(
            "Por favor, selecione o arquivo que deseja anexar à sua solicitação.",
            "incoming"
          )
        );
        formUpload.style.display = "block";
        chatBox.appendChild(formUpload);
      } else if (buttonText === "Sim" && selectedOption === "5") {
        chatBox.appendChild(
          createChatLi(
            "Por favor, selecione o arquivo que deseja anexar à sua solicitação.",
            "incoming"
          )
        );
        formUpload.style.display = "block";
        chatBox.appendChild(formUpload);
      } else {
        chatBox.appendChild(
          createChatLi(
            "Sua solicitação foi recebida. Acompanhe seu e-mail para mais detalhes.",
            "incoming"
          )
        );

        document.getElementById("buttonGenerate").style.display = "block";
        chatBox.appendChild(document.getElementById("buttonGenerate"));
      }

      buttonArchive.forEach((btn) => {
        btn.disabled = true;
      });

      UserDatas();
      cadastrarFuncionario();
      sendUserDataProcessos();
    });
  });
}

handleGroupBtnsStatus();

function handleBtnHour() {
  const hourInput = document.querySelector("#hour");
  const btnHourRequested = document.querySelector("#btn-send-hourRequested");

  btnHourRequested.disabled = true;

  hourInput.addEventListener("input", () => {
    btnHourRequested.disabled = hourInput.value.trim() === "";
  });

  btnHourRequested.addEventListener("click", (e) => {
    e.preventDefault();
    const hourInputValue = hourInput.value.trim();
    const [hour, minute] = hourInputValue.split(":");

    if (hour && minute) {
      hourRequested = `${hour} hora(s) e ${minute} minuto(s)`;
      chatBox.appendChild(createChatLi(hourRequested, "outgoing"));

      btnHourRequested.disabled = true;

      chatBox.appendChild(
        createChatLi(
          "Obrigado. Qual é o nível de urgência da sua solicitação?",
          "incoming"
        )
      );
      btnGroupUrgency.style.display = "block";
      chatBox.appendChild(btnGroupUrgency);
    } else {
      chatBox.appendChild(
        createChatLi("Por favor, insira um horário válido.", "incoming", true)
      );
    }
  });
}

function handleBtnDate() {
  const dateInput = document.querySelector("#date");
  const btnDateInsert = document.querySelector("#btn-send-dateInsert");

  btnDateInsert.disabled = true;

  dateInput.addEventListener("input", () => {
    btnDateInsert.disabled = dateInput.value.trim() === "";
  });

  btnDateInsert.addEventListener("click", (e) => {
    e.preventDefault();
    const DateInsert = dateInput.value.trim();
    userDate = DateInsert;

    chatBox.appendChild(createChatLi(DateInsert, "outgoing"));
    btnDateInsert.disabled = true;

    chatBox.appendChild(
      createChatLi(
        "Obrigado. Qual é o nível de urgência da sua solicitação?",
        "incoming"
      )
    );
    btnGroupUrgency.style.display = "block";
    chatBox.appendChild(btnGroupUrgency);
  });
}

function handleBtnProfission() {
  btnSendProfission.addEventListener("click", (e) => {
    e.preventDefault();
    btnSendProfission.disabled = true;

    const select = document.querySelector("#profission");
    profissionSelected = select.options[select.selectedIndex].text;

    chatBox.appendChild(createChatLi(profissionSelected, "outgoing"));

    if (selectedOption === "1") {
      chatBox.appendChild(
        createChatLi(
          "Obrigado. Por favor, informe o motivo da falta.",
          "incoming"
        )
      );
    } else if (selectedOption === "2") {
      chatBox.appendChild(
        createChatLi(
          "Obrigado. Por favor, descreva o motivo da sua solicitação.",
          "incoming"
        )
      );
    } else if (selectedOption === "3") {
      chatBox.appendChild(
        createChatLi(
          "Obrigado. Por favor, descreva o motivo da sua solicitação.",
          "incoming"
        )
      );
    } else if (selectedOption === "4") {
      chatBox.appendChild(
        createChatLi(
          "Obrigado. Por favor, nos informe o motivo do seu desligamento.",
          "incoming"
        )
      );
    } else if (selectedOption === "5") {
      chatBox.appendChild(
        createChatLi(
          "Obrigado. Por favor, nos informe o motivo da solicitação de benefício.",
          "incoming"
        )
      );
    }

    awaitingProfission = true;
  });
}

btnSendBeneficios.disabled = true;

const selectBeneficios = document.querySelector("#beneficios");

selectBeneficios.addEventListener("change", () => {
  if (selectBeneficios.selectedIndex > 0) {
    btnSendBeneficios.disabled = false;
    beneficioSelected =
      selectBeneficios.options[selectBeneficios.selectedIndex].text;
  } else {
    btnSendBeneficios.disabled = true;
  }
});

function handleBeneficios() {
  btnSendBeneficios.addEventListener("click", (e) => {
    e.preventDefault();

    btnSendBeneficios.disabled = true;

    const beneficioSelected =
      selectBeneficios.options[selectBeneficios.selectedIndex].text;

    chatBox.appendChild(createChatLi(beneficioSelected, "outgoing"));

    chatBox.appendChild(
      createChatLi(
        "Obrigado. Qual é o nível de urgência da sua solicitação?",
        "incoming"
      )
    );
    btnGroupUrgency.style.display = "block";
    chatBox.appendChild(btnGroupUrgency);
  });
}

handleBtnHour();
handleBtnDate();
handleBtnProfission();
handleBeneficios();

let awaitingEmail = false;
let awaitingDetailsRequest = false;

const options = {
  1: "Justificativa de faltas",
  2: "Solicitação de horas extras",
  3: "Solicitação de férias",
  4: "Solicitação de desligamento",
  5: "Solicitação de benefícios",
  6: "Solicitação de documentos",
};

const createChatLi = (message, className, isError = false) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;

  const messageElement = chatLi.querySelector("p");
  messageElement.textContent = message;

  if (isError) {
    messageElement.classList.add("text-danger");
  }
  return chatLi;
};

function handleMsgChoiceUser(options) {
  const values = Object.keys(options);
  values.forEach((key) => {
    chatBox.appendChild(createChatLi(`${key}. ${options[key]}`, "incoming"));
  });
}

function handleBtnRequestedHour() {
  btnHourRequested.addEventListener("submit", (e) => {
    e.preventDefault();
  });
}

function formatCpf(cpf) {
  cpf = cpf.replace(/\D/g, "");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return cpf;
}

const resetForm = () => {
  selectedOption = "";
  userName = "";
  userCpf = "";
  absenceDate = "";
  absenceReason = "";
  hourRequested = "";
};

let awaitingNameUser = false;
let awaitingCpfUser = false;
let awaitingEmailUser = false;
let awaitingProfission = false;
let awaitingInput = false;
let awaitRequestedHour = false;
let hourRequested = "";

const handleChat = () => {
  let userMessage = chatInput.value.trim();

  if (
    !isNaN(parseInt(userMessage, 10)) &&
    options[userMessage] &&
    !awaitingInput
  ) {
    chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatInput.value = "";
    selectedOption = userMessage;

    switch (selectedOption) {
      case "1":
        startJustificationFlow();
        break;
      case "2":
        startExtraHoursFlow();
        break;
      case "3":
        startVacationRequestFlow();
        break;
      case "4":
        startTerminationFlow();
        break;
      case "5":
        startBenefitsFlow();
        break;
      case "6":
        startDocumentRequestFlow();
        break;
    }
  } else if (awaitingNameUser) {
    handleNameInput(userMessage);
  } else if (awaitingCpfUser) {
    handleCpfInput(userMessage);
  } else if (awaitingEmailUser) {
    handleEmailInput(userMessage);
  } else if (awaitingProfission) {
    handleProfessionInput(userMessage);
  } else {
    chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatBox.appendChild(
      createChatLi(
        "Opção inválida. Por favor, escolha uma opção válida entre 1 e 5.",
        "incoming",
        true
      )
    );
    chatInput.value = "";
    handleMessageInit(options);
  }
};

const startJustificationFlow = () => {
  awaitingNameUser = true;
  awaitingInput = true;
  chatBox.appendChild(
    createChatLi(
      "Para justificar sua falta, por favor, informe seu nome completo.",
      "incoming"
    )
  );
  selectedInitialOption = options[selectedOption];
};

const startExtraHoursFlow = () => {
  awaitingNameUser = true;
  awaitingInput = true;
  chatBox.appendChild(
    createChatLi(
      "Para solicitar horas extras, por favor, informe seu nome completo.",
      "incoming"
    )
  );
  selectedInitialOption = options[selectedOption];
};

const startVacationRequestFlow = () => {
  awaitingNameUser = true;
  awaitingInput = true;
  chatBox.appendChild(
    createChatLi(
      "Para solicitar férias, por favor, informe seu nome completo.",
      "incoming"
    )
  );
  selectedInitialOption = options[selectedOption];
};

const startTerminationFlow = () => {
  awaitingNameUser = true;
  awaitingInput = true;
  chatBox.appendChild(
    createChatLi(
      "Para solicitar seu desligamento, por favor, informe seu nome completo.",
      "incoming"
    )
  );
  selectedInitialOption = options[selectedOption];
};

const startBenefitsFlow = () => {
  awaitingNameUser = true;
  awaitingInput = true;
  chatBox.appendChild(
    createChatLi(
      "Para solicitar benefícios, por favor, informe seu nome completo.",
      "incoming"
    )
  );
  selectedInitialOption = options[selectedOption];
};

// Continue com as funções `startVacationRequestFlow`, `startTerminationFlow`, `startBenefitsFlow`, `startDocumentRequestFlow` e outras opções se necessário

const handleNameInput = (userMessage) => {
  const userNameData = userMessage.trim();
  const firstName = userNameData.split(" ")[0];

  if (userNameData === "") {
    chatBox.appendChild(
      createChatLi(
        "O nome não pode estar vazio. Por favor, informe seu nome completo.",
        "incoming",
        true
      )
    );
  } else {
    chatBox.appendChild(createChatLi(userNameData, "outgoing"));
    userName = userMessage.trim();
    chatBox.appendChild(
      createChatLi(`Olá, ${firstName}! Por favor, informe seu CPF.`, "incoming")
    );
    chatInput.value = "";
    awaitingNameUser = false;
    awaitingCpfUser = true;
  }
};

const handleCpfInput = (userMessage) => {
  const cpfFormat = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
  const userCpfData = userMessage.trim();

  if (userCpfData === "") {
    chatBox.appendChild(
      createChatLi(
        "O CPF não pode ficar em branco. Por favor, informe seu CPF para continuarmos",
        "incoming",
        true
      )
    );
  } else {
    if (cpfFormat.test(userMessage)) {
      chatBox.appendChild(createChatLi(formatCpf(userCpfData), "outgoing"));
      userCpf = userCpfData;
      chatBox.appendChild(
        createChatLi(
          `Obrigado! Agora, por favor, informe seu e-mail.`,
          "incoming"
        )
      );
      chatInput.value = "";
      awaitingCpfUser = false;
      awaitingEmailUser = true;
    } else {
      chatBox.appendChild(createChatLi(formatCpf(userCpfData), "outgoing"));
      chatBox.appendChild(
        createChatLi(
          "CPF inválido. Por favor, insira um CPF válido.",
          "incoming",
          true
        )
      );
      chatInput.value = "";
    }
  }
};

const handleEmailInput = (userMessage) => {
  const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const userEmailData = userMessage.trim();

  if (userMessage.trim() === "") {
    chatBox.appendChild(
      createChatLi(
        "O e-mail não pode estar vazio. Por favor, informe seu e-mail",
        "incoming",
        true
      )
    );
  } else {
    if (emailFormat.test(userMessage)) {
      chatBox.appendChild(createChatLi(userEmailData, "outgoing"));
      userEmail = userMessage.trim();
      chatInput.value = "";
      awaitingEmailUser = false;
      awaitingInput = false;

      chatBox.appendChild(
        createChatLi(`Obrigado. Por favor, Informe o seu cargo.`, "incoming")
      );
      formProfission.style.display = "block";
      chatBox.appendChild(formProfission);
    } else {
      chatBox.appendChild(createChatLi(userEmailData, "outgoing"));
      chatBox.appendChild(
        createChatLi(
          "E-mail inválido. Por favor, insira um e-mail válido.",
          "incoming",
          true
        )
      );
      chatInput.value = "";
    }
  }
};

const handleProfessionInput = (userMessage) => {
  const reason = userMessage.trim();

  if (selectedOption === "1") {
    if (reason === "") {
      chatBox.appendChild(
        createChatLi(
          "O motivo não pode estar vazio. Por favor, informe o motivo da falta.",
          "incoming",
          true
        )
      );
    } else {
      chatBox.appendChild(createChatLi(reason, "outgoing"));
      detailsRequest = userMessage.trim();
      chatBox.appendChild(
        createChatLi(`Obrigado. Por favor, insira a data da falta.`, "incoming")
      );
      chatInput.value = "";
      formDate.style.display = "block";
      chatBox.appendChild(formDate);
    }
  }

  if (selectedOption === "2") {
    if (reason === "") {
      chatBox.appendChild(
        createChatLi(
          "O motivo não pode estar vazio. Por favor, informe o motivo da sua solicitação.",
          "incoming",
          true
        )
      );
    } else {
      chatBox.appendChild(createChatLi(reason, "outgoing"));
      detailsRequest = userMessage.trim();
      chatBox.appendChild(
        createChatLi(`Quantas horas extras você deseja solicitar?`, "incoming")
      );
      chatInput.value = "";
      formHour.style.display = "block";
      chatBox.appendChild(formHour);
    }
  }

  if (selectedOption === "3") {
    if (reason === "") {
      chatBox.appendChild(
        createChatLi(
          "O motivo não pode estar vazio. Por favor, informe o motivo da sua solicitação.",
          "incoming",
          true
        )
      );
    } else {
      chatBox.appendChild(createChatLi(reason, "outgoing"));
      detailsRequest = reason;

      chatBox.appendChild(
        createChatLi(
          "Por favor, informe a data de início das férias.",
          "incoming"
        )
      );
      chatInput.value = "";

      formDateInit.style.display = "block";
      chatBox.appendChild(formDateInit);

      formDateInit.addEventListener(
        "change",
        (event) => {
          const startDate = event.target.value;
          if (startDate) {
            chatBox.appendChild(
              createChatLi(
                `Data de início registrada: ${formatarDataParaBR(startDate)}.`,
                "outgoing"
              )
            );
            dateRequestedHolidayFirst = startDate.trim();

            // Solicita a data de término das férias
            chatBox.appendChild(
              createChatLi(
                "Agora, informe a data final das férias.",
                "incoming"
              )
            );
            formDateInit.style.display = "none";


            formDateEnd.style.display = "block";
            chatBox.appendChild(formDateEnd);

            formDateEnd.addEventListener(
              "change",
              (event) => {
                const endDate = event.target.value; 
                if (endDate) {
                  chatBox.appendChild(
                    createChatLi(
                      `Data de término registrada: ${formatarDataParaBR(
                        endDate
                      )}.`,
                      "outgoing"
                    )
                  );
                  dateRequestedHolidayEnd = endDate.trim();
                  formDateEnd.style.display = "none"; //
                  chatInput.value = "";
                  chatBox.appendChild(
                    createChatLi(
                      "Obrigado. Qual é o nível de urgência da sua solicitação?",
                      "incoming"
                    )
                  );
                  btnGroupUrgency.style.display = "block";
                  chatBox.appendChild(btnGroupUrgency);
                }
              },
              { once: true }
            );
          }
        },
        { once: true }
      );
    }
  }

  if (selectedOption === "4") {
    if (reason === "") {
      chatBox.appendChild(
        createChatLi(
          "O motivo não pode estar vazio. Por favor, informe o motivo da sua solicitação.",
          "incoming",
          true
        )
      );
    } else {
      chatBox.appendChild(createChatLi(reason, "outgoing"));
      detailsRequest = userMessage.trim();
      chatBox.appendChild(
        createChatLi(
          `Por favor, informe a data em que gostaria que seu desligamento fosse efetivado.`,
          "incoming"
        )
      );
      chatInput.value = "";
      formDate.style.display = "block";
      chatBox.appendChild(formDate);
    }
  }

  if (selectedOption === "5") {
    if (reason === "") {
      chatBox.appendChild(
        createChatLi(
          "O motivo não pode estar vazio. Por favor, informe o motivo da sua solicitação.",
          "incoming",
          true
        )
      );
    } else {
      chatBox.appendChild(createChatLi(reason, "outgoing"));
      detailsRequest = userMessage.trim();

      chatBox.appendChild(
        createChatLi(
          `Por favor, Informe o benefício que você deseja.`,
          "incoming"
        )
      );
      formBeneficios.style.display = "block";
      chatBox.appendChild(formBeneficios);
      chatInput.value = "";
    }
  }
};

function handleMessageInit(options) {
  const values = Object.keys(options);
  values.forEach((key) => {
    chatBox.appendChild(createChatLi(`${key}. ${options[key]}`, "incoming"));
  });
}

setTimeout(() => {
  handleMessageInit(options);
}, 2000);

const handleEnter = () => {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleChat();
    }
  });
};

sendChatBtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
chatbotCloseBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);
handleEnter();

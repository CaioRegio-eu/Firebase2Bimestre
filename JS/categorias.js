const ref = db.ref("categorias");

let idcapturado = null;
$("#cancelar").hide();

$("#salvar").click(function () {
    let nome = $("#nome").val().toUpperCase();
    let informacoes = $("#informacoes").val().toLowerCase();

    if (nome === "" || informacoes === "") {
        alert('Preencha todos os campos');
        return;
    }

    if (idcapturado) {//editar
        ref.child(idcapturado).update({ nome, informacoes });
        cancelar();
    } else {//salvar
        ref.push({ nome, informacoes });
    }

    limpar();
});

ref.on("value", dados_tabela => {
    $("#lista").empty();

    $("#lista").append(`
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Informações</th>
            <th colspan="2">Opções</th>
        </tr>
        `);

    dados_tabela.forEach(registro => {
        let reg = registro.val();
        let id = registro.key;

        $("#lista").append(`
            <tr>
                <td>${id}</td>
                <td>${reg.nome}</td>
                <td>${reg.informacoes}</td>
                <td>
                    <button class="btn btn-outline-danger btn-sm" onclick="excluir('${id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-outline-warning btn-sm" onclick="editar('${id}','${reg.nome}','${reg.informacoes}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            </tr>
            `);
    });
});

function limpar() {
    $("#nome").val("");
    $("#informacoes").val("");
    $("#nome").focus();
}

function editar(id, nome, informacoes) {
    $("#nome").val(nome);
    $("#informacoes").val(informacoes);

    idcapturado = id;

    $("#cancelar").show();

    $("#salvar")
        .text("Atualizar")
        .removeClass("btn-primary")
        .addClass("btn-success");

    $("#status"). text("Editando registro...");
}

function resetar() {
    idcapturado = null;
    limpar();
    $("#status").text("");
    $("#salvar")
        .text("Salvar")
        .removeClass("btn-success")
        .addClass("btn-primary");
    $("#cancelar").hide();
}

$("#cancelar").click(function () {
    resetar();
});

function excluir(id) {
    if (confirm("Tem certeza que deseja exluir?")) {
        db.ref("categorias/" + id).remove();
    }
}
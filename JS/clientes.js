const ref = db.ref("clientes");

/* 
20/05 -> EDITAR
03/06 -> EXCLUIR
17/06 -> FINALIZAÇÃO COM LOGIN (3o BIM NODEJS)
*/

let idcapturado = null;
$("#cancelar").hide();

$("#salvar").click(function () {
    let nome = $("#nome").val().toUpperCase();
    let email = $("#email").val().toLowerCase();

    if (nome === "" || email === "") {
        alert('Preencha todos os campos');
        return;
    }

    if (idcapturado) {//editar
        ref.child(idcapturado).update({ nome, email });
        cancelar();
    } else {//salvar
        ref.push({ nome, email });
    }

    limpar();
});

ref.on("value", dados_tabela => {
    $("#lista").empty();

    $("#lista").append(`
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
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
                <td>${reg.email}</td>
                <td>
                    <button class="btn btn-outline-danger btn-sm" onclick="excluir('${id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-outline-warning btn-sm" onclick="editar('${id}','${reg.nome}','${reg.email}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            </tr>
            `);
    });
});

function limpar() {
    $("#nome").val("");
    $("#email").val("");
    $("#nome").focus();
}

function editar(id, nome, email) {
    $("#nome").val(nome);
    $("#email").val(email);

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
        db.ref("clientes/" + id).remove();
    }
}
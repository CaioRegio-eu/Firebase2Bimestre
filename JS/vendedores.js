const ref = db.ref("vendedores");

/* 
20/05 -> EDITAR
03/06 -> EXCLUIR
17/06 -> FINALIZAÇÃO COM LOGIN (3o BIM NODEJS)
*/

let idcapturado = null;
$("#cancelar").hide();

$("#salvar").click(function () {
    let nome = $("#nome").val().toUpperCase();
    let salario = $("#salario").val();
    let cargo = $("#cargo").val().toUpperCase();

    if (nome === "" || salario === "" || cargo === "") {
        alert('Preencha todos os campos');
        return;
    }

    if (idcapturado) {//editar
        ref.child(idcapturado).update({ nome, salario, cargo });
        resetar();
    } else {//salvar
        ref.push({ nome, salario, cargo });
    }

    limpar();
});

ref.on("value", dados_tabela => {
    $("#lista").empty();

    // Cabeçalho com a coluna ID
    $("#lista").append(`
        <tr>
            <th style="width: 15%;">ID</th>
            <th>Nome</th>
            <th>Salário</th>
            <th>Cargo</th>
            <th colspan="2" style="width: 10%;">Opções</th>
        </tr>
        `);

    dados_tabela.forEach(registro => {
        let reg = registro.val();
        let id = registro.key;

        // Exibindo o ID com uma classe inline para não quebrar o layout
        $("#lista").append(`
            <tr>
                <td>${id}</td>
                <td>${reg.nome}</td>
                <td>${reg.salario}</td>
                <td>${reg.cargo}</td>
                <td>
                    <button class="btn btn-outline-danger btn-sm" onclick="excluir('${id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-outline-warning btn-sm" onclick="editar('${id}','${reg.nome}','${reg.salario}','${reg.cargo}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            </tr>
            `);
    });
});

function limpar() {
    $("#nome").val("");
    $("#salario").val("");
    $("#cargo").val("");
    $("#nome").focus();
}

function editar(id, nome, salario, cargo) {
    $("#nome").val(nome);
    $("#salario").val(salario);
    $("#cargo").val(cargo);

    idcapturado = id;

    $("#cancelar").show();

    $("#salvar")
        .text("Atualizar")
        .removeClass("btn-primary")
        .addClass("btn-success");

    $("#status").text("Editando registro...");
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
        db.ref("vendedores/" + id).remove();
    }
}
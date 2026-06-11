const ref = db.ref("fornecedores");

/* 
20/05 -> EDITAR
03/06 -> EXCLUIR
17/06 -> FINALIZAÇÃO COM LOGIN (3o BIM NODEJS)
*/

let idcapturado = null;
$("#cancelar").hide();

$("#salvar").click(function () {
    let nome = $("#nome").val().toUpperCase();
    let cnpj = $("#cnpj").val().toLowerCase();
    let email = $("#email").val().toLowerCase();
    // lê o radio selecionado corretamente
    let estado = $("input[name='estado']:checked").val() || "";

    if (nome === "" || cnpj === "" || email === "" || estado === "") {
        alert('Preencha todos os campos');
        return;
    }

    if (idcapturado) { // editar: atualiza todos os campos
        ref.child(idcapturado).update({ nome, cnpj, email, estado });
        cancelar();
    } else { // salvar
        ref.push({ nome, cnpj, email, estado });
    }

    limpar();
});

ref.on("value", dados_tabela => {
    $("#lista").empty();

    $("#lista").append(`
        <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>E-mail</th>
            <th>Estado</th>
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
                <td>${reg.cnpj}</td>
                <td>${reg.email}</td>
                <td>${reg.estado}</td>
                <td>
                    <button class="btn btn-outline-danger btn-sm" onclick="excluir('${id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-outline-warning btn-sm" onclick="editar('${id}','${reg.nome}','${reg.cnpj}','${reg.email}',
                    '${reg.estado}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            </tr>
            `);
    });
});

function limpar() {
    $("#nome").val("");
    $("#cnpj").val("");
    $("#email").val("");
    $("input[name='estado']").prop("checked", false);
    $("#status").text("");
    $("#nome").focus();
}

function editar(id, nome, cnpj, email, estado) {
    $("#nome").val(nome);
    $("#cnpj").val(cnpj);
    $("#email").val(email);
    // marca o radio correspondente ao estado (ids: sp, rj, mg)
    $("input[name='estado']").prop("checked", false);
    if (estado) {
        try {
            $("#" + estado.toLowerCase()).prop("checked", true);
        } catch (e) {
            // caso o valor venha diferente, ignora
        }
    }

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
    limpar();
    idcapturado = null;
    $("#salvar").text("Salvar").removeClass("btn-success").addClass("btn-primary");
    $("#cancelar").hide();
});

function excluir(id) {
    if (confirm("Tem certeza que deseja exluir?")) {
        db.ref("fornecedores/" + id).remove();
    }
}
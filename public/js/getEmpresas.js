reloadAll = () => {
    $('.router').remove()
    $('.gerenciar').append('<div class="router"></div>');
    $('.router')
    $('.router').load('./html/empresas-cadastradas.html')
}


var changeStatus = function(id, nome, status) {
    var nomeEmpresa = nome
    var id = id
    var status = status
    var msg
    status == 1 ? msg = 'Ativar' : msg = 'Desativar'
    Swal.fire({
        title: `${msg} a empresa ${nomeEmpresa} ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Sim, ${msg} empresa!`,
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.post('./api/updateStatus', {
                id,
                status
            }).then(res => {
                reloadAll()
            })

        }
    })
}


editarEmpresa = (id) => {
    var id = id
    axios.get(`./api/getEmpresaById/${id}`)
        .then(res => {

            dados = res.data[0]
            console.log();
            $('.logo-empresa > div').css({
                'background-image': `url('https://zappata.s3-sa-east-1.amazonaws.com/${dados.logo}')`
            })

            $('.nome').val(dados.nome)
            $('.categorias').val(dados.categorias)
            $('.sobre').val(dados.descricao)
            $('.telefone').val(dados.contato)
            $('.whatsapp').val(dados.whatsapp)
            $('.cidade-input').val(dados.cidade)
            $('.estado').val(dados.estado)
            $('.cep').val(dados.cep)
            $('.rua').val(dados.rua)
            $('.complemento').val(dados.complemento)
            $('.bairro').val(dados.bairro)
            $('.numero').val(dados.numero)
            $('.instagram').val(dados.instagram)
            $('.facebook').val(dados.facebook)
            $('.email').val(dados.email)
        })
}

axios.get(`./api/getEmpresas`)
    .then(res => {
        $('.result-getEmpresas').html('')
        $('.result-getEmpresas').empty()
        var status
        for (i in res.data) {
            status = res.data[i].status

            if (status == 1) {
                status = `Online <span onclick="changeStatus(${res.data[i].id}, '${res.data[i].nome}', 0 )"  style="background: red; user-select: none; cursor: pointer" class="badge desativar-empresa" id=${res.data[i].id}>Desativar</span>`
            } else {
                status = `Offline <span onclick="changeStatus(${res.data[i].id}, '${res.data[i].nome}', 1 )" data-empresa="${res.data[i].nome}" style="user-select: none; background: darkgreen; cursor: pointer" id=${res.data[i].id} class="badge text-white ativar-empresa">Ativar</span> `
            }

            $('.result-getEmpresas').append(` <tr>
                            <th scope="row">${res.data[i].id}</th>
                            <td>${res.data[i].nome}</td>
                            <td>${status} </td>
                            <td><i class="fas fa-pen" onclick="editarEmpresa(${res.data[i].id})" data-toggle="modal" data-target=".modal-editar"></i>&nbsp;-&nbsp;<i class="fas fa-trash"></i></td>
                        </tr>`)
        }


        $('.tabela-getEmpresas').DataTable({
            "language": {
                "lengthMenu": "Mostrando _MENU_ resultados por página",
                "zeroRecords": "Nenhum resultado retornado",
                "info": "Mostrando página _PAGE_ de _PAGES_",
                "infoEmpty": "Nenhum informação disponível",
                "infoFiltered": "(filtrado de _MAX_ do total de resultados)",
                "search": "Pesquisar _INPUT_"
            },
            "order": [0, 'desc'],
            "pagingType": "numbers"

        });


    })
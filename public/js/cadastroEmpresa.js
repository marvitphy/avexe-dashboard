var bangaloreBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-7.580746, -46.090985),
    new google.maps.LatLng(-7.4766397, -46.0013274));



var autocomplete;
autocomplete = new google.maps.places.Autocomplete((document.getElementById('searchTextField')), {
    bounds: bangaloreBounds,
    strictBounds: true,
});

google.maps.event.addListener(autocomplete, 'place_changed', function() {
    var near_place = autocomplete.getPlace();
    console.log()
    $('#searchTextField').val(near_place.address_components[0].long_name)
});


google.maps.event.addDomListener(window, 'load', autocomplete);
var horarios

$('.salvar-horarios').on('click', function() {

    horarios = `[{
           "segunda-feira" : {"inicio": "${$('.segunda-inicio').val()}", "termino": "${$('.segunda-termino').val()}"},
           "terça-feira" : {"inicio": "${$('.terca-inicio').val()}", "termino": "${$('.terca-termino').val()}"},
           "quarta-feira" : {"inicio": "${$('.quarta-inicio').val()}", "termino": "${$('.quarta-termino').val()}"},
           "quinta-feira" : {"inicio": "${$('.quinta-inicio').val()}", "termino": "${$('.quinta-termino').val()}"},
           "sexta-feira" : {"inicio": "${$('.sexta-inicio').val()}", "termino": "${$('.sexta-termino').val()}"},
           "sábado" : {"inicio": "${$('.sabado-inicio').val()}", "termino": "${$('.sabado-termino').val()}"},
           "domingo" : {"inicio": "${$('.domingo-inicio').val()}", "termino": "${$('.domingo-termino').val()}"}
           }]`;

    console.log(JSON.parse(horarios))
})

var cidadeInputWidth = $('.cidade-input').width()
$('.cidades-lista').width(cidadeInputWidth)

var cidadeSearch
$('.cidade-input').on('input', function() {
    cidadeSearch = $(this).val();
    if (cidadeSearch != '') {
        axios.get(`./getCidades/${cidadeSearch}`)
            .then(response => {
                for (i in response.data) {
                    $('.cidades-lista').html('')
                    $('.cidades-lista').append(` <a data-cidade="${response.data[i].nome}" id="${response.data[i].id}" class="list-group-item list-group-item-action">${response.data[i].nome} <small class="text-muted">${response.data[i].estado}</small> </a>`)
                }

                $('.list-group-item').on('click', function() {
                    var cidadeId = $(this).attr('id')
                    $('.cidade-input').val($(this).attr('data-cidade'))
                    $(this).fadeOut('fast', function() {
                        $(this).remove();
                    })

                    axios.get(`./getCidadesById/${cidadeId}`).then(result => $('.estado').val(result.data[0].estado))
                })
            })
            .catch(err => console.log(err))
    }

})


$('.logo-empresa').on('click', function() {
    $('.arquivo-logo').click()

})
$('.mudar-capa').on('click', function() {
    $('.capa').click()
})

var fileSelector = $('.arquivo-logo')
var fileList
var fileSelectorCapa = $('.capa')
var fileListCapa

fileSelector.on('change', (event) => {
    fileList = event.target.files;
    $('.logo-empresa > img').attr('src', URL.createObjectURL(event.target.files[0]))
});

fileSelectorCapa.on('change', (event) => {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0])
    fileListCapa = event.target.files;
    reader.onload = () => {
        $('.imagens').css({
            'background-image': `url(${reader.result})`
        })
        console.log(reader.result)
    };
    reader.onerror = error => reject(error);
});

$('.inputholder').click(function() {
    $('.categorias').focus();
})


var categoriasArrayPreFinal
var categoriasArrayFinal

$('.categorias').on('input', function(e) {
    var categoriasInput = $('.categorias').val()
    if (categoriasInput.includes(',')) {
        var categoriasArray = categoriasInput.split(',')
        var categoriasFiltro = categoriasArray.filter(function(el) {
            return el != '';
        });

        for (i in categoriasFiltro) {
            $('.categorias').before(`<span style="cursor: pointer; user-select: none" class="badge mr-1 badge-pill badge-dark cat">${categoriasFiltro[i]}</span>`)
            $('.categorias').val('')
        }

        $('.cat').on('click', function() {
            $(this).remove();
        })
    }
})
$('.salvar-empresa').on('click', function() {
    let salvar = $(this);
    salvar.hide();
    $('.salvando').show();
    categoriasArrayPreFinal = document.querySelectorAll(".cat")
    categoriasArrayFinal = Array.prototype.map.call(categoriasArrayPreFinal, function(element) {
        return element.innerText;
    });

    var nome = $('.nome').val()
    var categorias = JSON.stringify(categoriasArrayFinal).replace(/[\[\]']+/g, '').replace(/"/g, '').replace(/,/g, ', ')
    var descricao = $('.sobre').val()
    var contato = $('.telefone').val()
    var whatsapp = $('.whatsapp').val()
    var cidade = $('.cidade-input').val()
    var estado = $('.estado').val()
    var cep = $('.cep').val()
    var rua = $('.rua').val()
    var bairro = $('.bairro').val()
    var complemento = $('.complemento').val()
    var instagram = $('.instagram').val()
    var facebook = $('.facebook').val()
    var email = $('.email').val()
    var formData = new FormData()
    formData.append('image', fileList[0])
    formData.append('capa', fileListCapa[0])
    formData.append('nome', nome)
    formData.append('categorias', categorias)
    formData.append('descricao', descricao)
    formData.append('contato', contato)
    formData.append('whatsapp', whatsapp)
    formData.append('cidade', cidade)
    formData.append('estado', estado)
    formData.append('cep', cep)
    formData.append('rua', rua)
    formData.append('bairro', bairro)
    formData.append('complemento', complemento)
    formData.append('instagram', instagram)
    formData.append('facebook', facebook)
    formData.append('email', email)
    formData.append('horarios', horarios)
        //console.log(formData)
    axios.post('./api/uploadImgEmpresa', formData, {
        headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        }
    }).then(response => {
        if (response.data.status == 1) {
            Swal.fire({
                icon: 'success',
                title: 'Empresa cadastrada com sucesso!'
            })

            salvar.show()
            $('.salvando').hide()
        }
    });

})
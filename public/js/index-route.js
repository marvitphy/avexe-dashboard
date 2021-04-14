let main = $('.main-body')
$('.dashboard').on('click', function() {
    main.load('./html/dashboard.html')
    $("html, body").animate({ scrollTop: 0 }, "slow");
})

function locationHashChanged() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    if (location.hash === '#/gerenciar-empresas') {
        main.load('./html/gerenciar-empresas.html')

    }
    if (location.hash == '' || location.hash == null) {
        main.load('./html/dashboard.html')

    } else {
        console.log(location.hash)
    }

}

$('.pcoded-item > li').on('click', function() {
    $('.pcoded-item > li').removeClass('active')
    $(this).addClass('active')
})

locationHashChanged();

window.onhashchange = locationHashChanged;
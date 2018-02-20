//empty object
const travelSearch = {}

travelSearch.events = () => {
    $('form').on('submit', function (event) {
        event.preventDefault();
        travelSearch.filterCountry();
        console.log($('.results'))
        $('.results').removeClass('hidden')
        console.log($('.results'))
        scroll($('.results'))
    })
}

//first get user value and then make the ajax request

travelSearch.filterCountry = () => {

    userHappiness = $('input[name=happinessValue]').val();
    console.log(userHappiness);

    userForest = $('input[name=forestValue]').val();
    console.log(userForest);

    userInternet = $('input[name=internetValue]').val();
    console.log(userInternet);


    travelSearch.getCountry(userHappiness, userForest, userInternet);
}

//function to get the location data from the api 

travelSearch.getCountry = (userHappiness, userForest, userInternet) => {
    $.ajax({
        url: 'https://proxy.hackeryou.com',
        method: 'GET',
        dataType: 'json',
        method: 'GET',
        data: {
            reqUrl: 'http://inqstatsapi.inqubu.com',
            params: {
                api_key: 'e2edb06faefe2dc6',
                format: 'json',
                cmd: 'getWorldData',
                data: 'happiness_index,forest_area_percent,density,size,bigmac_index,internetusers_percent,corruption_index,tourist_arrivals,size,population'
            }
        }
    }).then(function (res) {
        console.log('res',res);

        const filterdCountries = res.filter(function(item){
            return item.internetusers_percent < (userInternet + 25) && item.internetusers_percent > (userInternet - 25);
        }).filter(function (item) {
            return item.forest_area_percent < (userForest + 15) && item.forest_area_percent > (userForest - 15);
        }).filter(function (item) {
            return item.happiness_index < (userHappiness + 500) && item.happiness_index > (userHappiness - 500);
        });

        travelSearch.displayCountry(filterdCountries);
        console.log(filterdCountries);
        $('.loading').hide();
    });
}

function scroll(selectDiv, selectButton) {
    const viewportHeight = Math.max(window.innerHeight || 0);
    const marginTop = viewportHeight * 5 / 100;
    const scrollTopTarget = selectDiv.offset().top;
    const scrollTopValue = scrollTopTarget - marginTop;
    $('html').animate({
        scrollTop: scrollTopValue,
    }, 2000);
    
    if (selectButton !== undefined){
        selectButton.addClass("rotate");
    }
};


$('#firstButton').on('click', function(e){
    e.preventDefault();
    scroll($('.firstDiv'), $('#firstButton'))
});

$('#secButton').on('click', function (e) {
    e.preventDefault();

    scroll($('.secDiv'), $('#secButton'))
});
$('#thirdButton').on('click', function (e) {
    e.preventDefault();

    scroll($('.thirdDiv'), $('#thirdButton'))
})

// $('#fourthButton').on('click', function() {
//     scroll($('.fourthDiv'))
// })


// $('#fourthButton').on('click', function () {
//     console.log($('.results'))
//     $('.results').removeClass('hidden')
//     console.log($('.results'))
//     scroll($('.results') )
// })


travelSearch.displayCountry = (filterdCountries) => {
    if (filterdCountries.length === 0) {
        $('.flag').append('<div class= "unknown"><h3>Sorry there are no countries with those requirements. Sort Again!</h3> <button class="reset" onclick="window.location.href = location.href">Sort!</button></div>');

        // $('.reset').on('click', function () {
        //     $('html').animate({
        //         scrollTop: $('#countryParams').offset().top
        //     }, 1000);
        //     $('.flag').empty();
        // });
    } else {
        filterdCountries.forEach(function (item) {
            console.log(item);

            $('.flag').append(`<div class=${item.countryCode}><img  src="images/flags/${item.countryCode}.png"></div> <button class='reset' onclick="window.location.href = location.href">Sort again!</button></div>`); 

            $(`.${item.countryCode}`).on('click', function () {
                $('.pop-up').toggleClass('hidden');
                $('.overlay').toggleClass('greyed');

                const title = $('<h2>').text(`Your next destination will be ${item.countryName}!`)

                const population_n = parseInt(item.population).toLocaleString();
                const population = $('<p>').text(`This country is worth checking out and ${population_n} locals will give you a warm welcome!`)

                const bigmac = parseInt(item.bigmac_index);

                const bigmacInfo = $('<p>').text(`On a two week vacation, you will spend approximately $${bigmac * 4} if you only eat Big Macs!`)

                const density = $('<p>').text(`Per square kilometer there are approximateld ${item.density} other persons. Time to get nice and cozy with the locals!`)

                const tourist = $('<p>').text(`Last year ${item.tourist_arrivals} other people had the same brilliant idea to visit this wonderfull country, so you will not regret this choice!`)

                const size = $('<p>').text(`There are ${item.size} square kilometers for you to discover, wait no longer!`)

            
                if (`${item.countryCode}` === item.countryCode) {
                    ($('.pop-up').append(title, population, size, density, bigmacInfo, tourist)).show();
                } else {
                }
            });
            $('.pop-up').on('click', function () {
                $(this).toggleClass('hidden').empty();
                $('.overlay').toggleClass('greyed');
            })
        });
    };
};



// $('button').on('click', function () {
//     $('html').animate({
//         scrollTop: $('#scrollStop').offset().top
//     }, 1000);
// });

//creates function to launch our app on page load
travelSearch.init = () => {
    travelSearch.events();
}


//document ready
$(function () {
    console.log('I am ready')
    travelSearch.init();
});
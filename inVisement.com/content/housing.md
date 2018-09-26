---
title: "US Housing Valuation"
date: 2018-09-25
tags: ["Housing", "Valuation", "Chart", "yap-map", "House Value"]
card: 'Example file: 
    <input style="color: blue" type="text" value="q/AAPL.csv" onchange="change_tag(this)"> (you can change it) <br>
    `base`    = https://data.invisement.com <br>  
    `file`    = q/AAPL.csv <br>
    `url`     = `base`/`file` <br>  
    `viewer`  = `base`?`file`'

---

Are you undecided to buy a new home or keep renting? Are homes in your area over-priced? Are mortgage rates too high for buying a new home? Is it a good investment to buy a home and rent it out? We have the answer. <button class="reamore">Read more</button>

Buying home means commiting to a long term investment, putting a good chunck of your saving for down payment, borrowing a huge amount of mortgage, and often paying twice as you pay for rent for mortgage and real estate tax and maintainance costs.

More importantly, maybe house prices are just too hight, maybe mortgage rates have gone up too much, maybe you should wait: rent it and put your money in another saving like stock market.

Or you are just an investor or retiree and would like to know if it is a wise investment to buy a home and rent it out. 

We would like to help you on your real estate investment. There are many factors affecting the future of home prices and rent: mortgage rates, local real estate tax, private mortgage insurance rate, housing price inflation, housing depreciation and maintainace, economic growth, local economy and population and immigration, ... and it varies from town to town or from neighborhood to neighborhood.

We would like to help you. We stick to **economics of housing valuation** (financial theory) and we use market rates to put price tag on upcomming risks and hedge all "hedgeable risks" (attention: rent increase is not hedgeable!), and fetching the most relaible data from Federal Reserve, Bureau of Economic Analysis, and Zillow Research Public Data on weekly updates. Our calculations are based on Economic Theory (for driving valuration formula), Market Rates (for hedging risks and costs), and Machine Learning (for training models). We do our best but use our tool and map on your own risk and never forget there is no certain prediction in financial markets. We update our graphs and data on weekly basis, every Friday evening.

</span>

<div id="yap-map">
    <p class="yap-text"> 
        This is a title<br> with subtitle
    <p>
    <div id="yap-legend">
        % of expected 
    <div>
<div>

<script>
    yapper = yap.initiate() 
    yapper.data(file="this file.csv") //append data in form of Map
    yapper.html(div, 'html') //append html to div
    yapper.css() //append css
    yapper.plot('map')
    //yapper.mutate()
    //yapper.filter(id => .state(id) in ['WA', 'CA'])
    //yapper.subset()
    //yapper.reduce()

    //yapper.legend()
    //yapper.text(html, css)
    //yapper.tooltip(id => .state(id) + .county(id) + '<br>' + .value(id)*100 + , options)


    $('#state').onclick(function(){
        yapper = yapper.copy()
        yapper.div(div, '<div> </div>)
        yapper.html(append html)
        yapper.css(append css)
        yapper.filter(id => .state(id) in 'state')
        yapper.plot(options=)
    })

    yap.map()

</script>


<script>
    const moreText = "Read more";
    const lessText = "Read less";
    const moreButton = $("button.readmorebtn");
    moreButton.click(function() {
        const $this = $(this);
        $this.text($this.text() == moreText ? lessText : moreText).next(".more").slideToggle("fast");
    });
</script>


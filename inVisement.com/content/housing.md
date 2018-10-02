
---
title: "US Housing Valuation"
date: 2018-09-25
tags: ["Housing", "Valuation", "Chart", "yap", "yap-map", "House Value"]
card: 'Example file: 
    <input id="state-input" style="color: blue" type="text" value="q/AAPL.csv" onchange="change_tag(this)"> (you can change it) <br>
    `base`    = https://data.invisement.com <br>  
    `file`    = q/AAPL.csv <br>
    `url`     = `base`/`file` <br>  
    `viewer`  = `base`?`file`'

---

Are you undecided to buy a new home or keep renting one? Do you know if homes in your area are over-priced? Are mortgage rates too high to justify buying a new home? Is it a good investment to buy a home and rent it out? What is the expected rate of return for real estate investment in your zipcode? We have the answer. <button class="reamore">Read more</button>
<div>
Buying home means commiting to a long term investment, putting a good chunck of your saving for down payment, borrowing a huge amount of mortgage, and often paying twice in mortgage and tax and costs as you pay to rent a similar apartment.

More importantly, maybe house prices are just too high, maybe mortgage rates have gone up too much, maybe you should wait: rent it and put your money in another saving like stock market.

Or you are just an investor or retiree and would like to know if it is a wise investment to buy a home and rent it out. 

We would like to help you on your real estate investment. There are many factors affecting the future of home prices and rent: mortgage rates, local real estate tax, private mortgage insurance rate, housing price inflation, housing depreciation and maintainace, economic growth, local economy and population and immigration, ... and it varies from town to town or from neighborhood to neighborhood.

We would like to help you. We stick to **economics of housing valuation** (asset pricing theory) to derive housing valuation formula, and we use finanical market rates to put price tag on "hedgeable" risks (attention: rent increase is not hedgeable!). Then, we feed our model with most relaible data from Federal Reserve, Bureau of Economic Analysis, and Zillow Research Public Data. Atlast, we use machine learning to train and test our model. We do our best but use our tool on your own risk and never forget there is no certain prediction in financial markets. We update our graphs and data on weekly basis, every Friday evening.

</div>

<div id="yap-map">
    <p class="yap-text"> 
        This is a title<br> with subtitle
    </p>
    <div id="yap-legend">
        label for legend 
    </div>
</div>

<div id="state-map">
    <input id="select-state" type="select" style="top: 0;" value="['CA']">
    
</div>



<script>
    read data
    plot main
    filter data
    plot state

    $('#select-state').on('change', function(state){
        filter data([state])
            .then(plot('state-map'))
    })

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


---
title: "Housing Valuation"
date: 2018-08-01
tags: ["Blog", "Housing", "Valuation", "Pricing", "Investment", "Real Estate", "Chart"]
card:   'State: <input style="color: blue" type="text" value="WA" onchange="change_tag(this)"><br>
        County: <input style="color: blue" type="text" value="King County" onchange="change_tag(this)">
        '

---

 
<div id ="thatCard"> </div>




<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

<script> 
    $(function(){
        $("#thatCard").load("/htmls/usa-housing-annual-return.html"); 
    });
</script> 

<script src="http://127.0.0.1:8887/plotly-latest.min.js"></script>


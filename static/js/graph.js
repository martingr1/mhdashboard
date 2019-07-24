queue()
    .defer(d3.csv, "data/mhsurvey.csv")
    .await(makeGraphs);

function makeGraphs(error, healthData) {

    var ndx = crossfilter(healthData);

    healthData.forEach(function(d) {
        d.age = parseInt(d.age);
    })
    
    show_select_company(ndx);
    show_gender_breakdown(ndx);
    show_country_breakdown(ndx);
    show_treatment_levels(ndx);
   // show_average_age(ndx);

    dc.renderAll();
}

function show_select_company(ndx) {
    var dim = ndx.dimension(dc.pluck("techcompany"));
    var group = dim.group();

    dc.selectMenu("#select-company")
        .dimension(dim)
        .group(group);
}

function show_gender_breakdown(ndx) {

    var dim = ndx.dimension(dc.pluck("gender"));
    var group = dim.group();

    dc.pieChart('#gender_breakdown')
        .height(200)
        .radius(480)
        .transitionDuration(500)
        .dimension(dim)
        .group(group);
}

function show_country_breakdown(ndx) {

    var dim = ndx.dimension(dc.pluck("country"));
    var group = dim.group();

    dc.pieChart('#country_breakdown')
        .height(200)
        .radius(480)
        .transitionDuration(500)
        .dimension(dim)
        .group(group);
}

function show_treatment_levels(ndx) {

    var dim = ndx.dimension(dc.pluck("treatment"));
    var group = dim.group();

    dc.barChart('#treatment_chart')
        .width(300)
        .height(200)
        .margins({ top: 10, right: 50, bottom: 30, left: 25 })
        .dimension(dim)
        .group(group)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
}

/* function show_average_age(ndx) {

    var gender_dim = ndx.dimension(dc.pluck("gender"));

    var average_age = gender_dim.group().reduce(

        function(p, v) {
            p.count++;
            p.total += v.age;
            p.average = p.total / p.count;
            return p;
        },

        function(p, v) {
            p.count--;
            if (p.count == 0) {
                p.total = 0;
                p.average = 0;
            }
            else {
                p.total -= v.age;
                p.average = p.total / p.count;
            }
            return p;
        },

        function() {
            return { count: 0, total: 0, average: 0 };
        }
    );

    dc.barChart('#average_age')
        .width(500)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 25 })
        .dimension(gender_dim)
        .group(average_age)
        .valueAccessor(function(d) {
            return d.value.average;
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Gender")
} */


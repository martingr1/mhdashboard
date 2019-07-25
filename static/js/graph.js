queue()
    .defer(d3.csv, "data/mhsurvey.csv")
    .await(makeGraphs);

function makeGraphs(error, healthData) {

    var ndx = crossfilter(healthData);

    healthData.forEach(function(d) {
        d.date = parseInt(d.date);
        d.age = parseInt(d.age);
    })

    // show_average_age(ndx);
    show_average_age_gender(ndx, "Female", "#average_age_gender");

    show_select_company(ndx);
    show_gender_breakdown(ndx);
    show_country_breakdown(ndx);
    show_treatment_levels(ndx);


    dc.renderAll();
}

function show_select_company(ndx) {
    var dim = ndx.dimension(dc.pluck("techcompany"));
    var group = dim.group();

    dc.selectMenu("#select_company")
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
    var dim = ndx.dimension(dc.pluck('gender'));

    function add_item(p, v) {
        p.count++;
        p.total += v.age;
        p.average = p.total / p.count;
        return p;
    }

    function remove_item(p, v) {
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
    }

    function initialise() {
        return { count: 0, total: 0, average: 0 };
    }

    var averageAgeByGender = dim.group().reduce(add_item, remove_item, initialise);
    dc.barChart("#average_age")
        .width(400)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(averageAgeByGender)
        .valueAccessor(function(d) {
            return d.value.average.toFixed(2);
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Gender")
        .yAxis().ticks(4);
} */

function show_average_age_gender(ndx, gender, element) {
    var averageAgeByGender = ndx.groupAll().reduce(
        function(p, v) {
            if (v.gender === "Female") {
                p.count++;
                if (v.age === true) {
                    p.count++;
                    p.total += v.age;
                    p.average = p.total / p.count;
                }
            }
            return p;
        },
        function(p, v) {
            if (v.gender === "Female") {
                p.count--;
                if (v.age === true) {
                    p.count--;
                    p.total += v.age;
                    p.average = p.total / p.count;
                }
                else {
                    p.total -= v.age;
                    p.average = p.total / p.count;
                }
            }
            return p;
        },
        function() {
            return { count: 0, total: 0, average: 0 };
        },
    );
    
    dc.numberDisplay(element)
        .formatNumber(d3.format(".0"))
        .valueAccessor(function (d) {
            if (d.count == 0) {
                return 0;
            } else {
                return (d.total / d.count);
            }
        })
        .group(averageAgeByGender);

}
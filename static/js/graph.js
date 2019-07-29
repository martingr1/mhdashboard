queue()
    .defer(d3.csv, "data/mhsurvey2.csv")
    .await(makeGraphs);

function makeGraphs(error, healthData) {

    var ndx = crossfilter(healthData);

    var parseDate = d3.time.format("%d/%m/%Y").parse;


    healthData.forEach(function(d) {
        d.age = parseInt(d.age);
        d.date = parseDate(d.date);

    })

    show_average_age_gender(ndx, "Female", "#average_age_gender");
    show_average_age_gender(ndx, "Male", "#average_age_male");

    show_select_company(ndx);
    show_gender_breakdown(ndx);
    show_country_breakdown(ndx);
    show_treatment_levels(ndx);

    show_treatment_timeline(ndx);


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
        .radius(400)
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
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
}

function show_average_age_gender(ndx, gender, element) {
    var averageAgeByGender = ndx.groupAll().reduce(
        function(p, v) {
            if (v.gender === gender) {
                p.count++;
                p.total += v.age;
                p.average = p.total / p.count;
            }
            return p;
        },

        function(p, v) {
            if (v.gender === gender) {

                p.count--;
                p.total += v.age;
                p.average = p.total / p.count;
            }
            else {
                p.total -= v.age;
                p.average = p.total / p.count;
            }
            return p;
        },

        function() {
            return { count: 0, total: 0, average: 0 };
        },
    );

    dc.numberDisplay(element)
        .formatNumber(d3.format(".0f"))
        .valueAccessor(function(d) {
            if (d.count == 0) {
                return 0;
            }
            else {
                return (d.total / d.count);
            }
        })
        .group(averageAgeByGender);
}

function show_treatment_timeline(ndx) {
    var date_dim = ndx.dimension(dc.pluck('date'));
    var treatment = date_dim.group().reduce(
        function(p, v) {
            if (v.treatment === 'yes') {
                p.count++;
                p.total += v.treatment;
            }
            return p;
        },
        function(p, v) {
            if (v.treatment === 'yes') {
                p.count--;
                p.total += v.treatment;
            }
            return p;
        },
        function() {
            return { count: 0, total: 0 };
        },
    )

    var minDate = date_dim.bottom(1)[0].date;
    var maxDate = date_dim.top(1)[0].date;

    dc.lineChart("#treatment_timeline")
        .width(1000)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(date_dim)
        .group(treatment)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .xAxisLabel("Year")
        .yAxis().ticks(4);
}

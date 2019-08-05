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

    show_respondents(ndx);
    show_tech_companies(ndx);

    show_average_age_gender(ndx, "Female", "#average_age_gender");
    show_average_age_gender(ndx, "Male", "#average_age_male");

    show_select_company(ndx);
    show_gender_breakdown(ndx);
    show_country_breakdown(ndx);
    show_treatment_levels(ndx);

    show_treatment_timeline(ndx);

    show_physical_impact(ndx);
    show_mental_impact(ndx);
    show_family_history(ndx);


    dc.renderAll();
}

function show_respondents(ndx) {

    var totalRecords = ndx.groupAll();

    dc.numberDisplay('#respondents_display')
        .formatNumber(d3.format(".0f"))
        .valueAccessor(function(d) { return d++ })
        .group(totalRecords);
}

function show_tech_companies(ndx) {

    var totalRecords = ndx.groupAll().reduce(
        
        function (p,v) {
            if (v.techcompany === 'Yes') {
                p.count++;
            }
            return p;
        },
        function (p,v) {
            if (v.techcompany === 'Yes') {
                p.count--;
            }
            return p;
        },
        
        function() {
            return { count: 0 };
        })

    dc.numberDisplay('#tech_display')
        .formatNumber(d3.format(".0f"))
        .valueAccessor(function(d) { return d.count;})
        .group(totalRecords);
}

function show_average_age_gender(ndx, gender, element) {
    
    var averageAgeByGender = ndx.groupAll().reduce(
        function(p, v) {
            p.count++;
            p.total += v.age;
            p.average = p.total / p.count;
            return p;
        },

        function(p, v) {
            p.count--;
            p.total -= v.age;
            p.average = p.total / p.count;
            return p;
        },

        function() {
            return { count: 0, total: 0, average: 0 };
        },
    );

    dc.numberDisplay(element)
        .formatNumber(d3.format(".0f"))
        .valueAccessor(function(d) {
            if (d.value == 0) {
                return 0;
            }
            else {
                return (d.total / d.count);
            }
        })
        .group(averageAgeByGender);
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
        .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5))
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

function show_treatment_timeline(ndx) {
    
    var date_dim = ndx.dimension(dc.pluck('date'));
    var treatment_per_year = date_dim.group().reduce(
        
        function (p,v) {
            if (v.techcompany === 'Yes') {
                p.count++;
            }
            return p;
        },
        function (p,v) {
            if (v.techcompany === 'Yes') {
                p.count--;
            }
            return p;
        },
        
        function() {
            return { count: 0 };
        });
    
    var minDate = date_dim.bottom(1)[0].date;
    var maxDate = date_dim.top(1)[0].date;
    
    dc.lineChart ('#treatment_timeline')
    .width(1200)
    .height(400)
    .margins({top: 50, right: 10, bottom: 50, left: 10})
    .dimension(date_dim)
    .group(treatment_per_year)
    .valueAccessor(function(d) { return d.count;})
    .transitionDuration(250)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .xAxisLabel("Year")
    .yAxis().ticks(100);
} 

function show_physical_impact(ndx) {

    function physicalImpactByGender(dimension, physhealthconsequence) {

        return dimension.group().reduce(

            function(p, v) {
                p.total++;
                if (v.physhealthconsequence == physhealthconsequence) {
                    p.match++;
                }
                return p;
            },
            function(p, v) {
                p.total--;
                if (v.physhealthconsequence == physhealthconsequence) {
                    p.match--;
                }
                return p;
            },
            function() {
                return { total: 0, match: 0 };
            }
        );
    }

    var dim = ndx.dimension(dc.pluck("gender"));
    var physYes = physicalImpactByGender(dim, "Yes");
    var physNo = physicalImpactByGender(dim, "No");
    var physMaybe = physicalImpactByGender(dim, "Maybe");

    dc.barChart("#physical_impact")
        .width(400)
        .height(300)
        .dimension(dim)
        .group(physYes, "Yes")
        .stack(physNo, "No")
        .stack(physMaybe, "Maybe")
        .valueAccessor(function(d) {
            if (d.value.total > 0) {
                return (d.value.match / d.value.total) * 100;
            }
            else {
                return 0;
            }
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5))
        .margins({ top: 10, right: 100, bottom: 30, left: 30 });
}

function show_mental_impact(ndx) {

    function mentalImpactByGender(dimension, mentalhealthconsequence) {

        return dimension.group().reduce(

            function(p, v) {
                p.total++;
                if (v.mentalhealthconsequence == mentalhealthconsequence) {
                    p.match++;
                }
                return p;
            },
            function(p, v) {
                p.total--;
                if (v.mentalhealthconsequence == mentalhealthconsequence) {
                    p.match--;
                }
                return p;
            },
            function() {
                return { total: 0, match: 0 };
            }
        );
    }

    var dim = ndx.dimension(dc.pluck("gender"));
    var mentYes = mentalImpactByGender(dim, "Yes");
    var mentNo = mentalImpactByGender(dim, "No");
    var mentMaybe = mentalImpactByGender(dim, "Maybe");

    dc.barChart("#mental_impact")
        .width(400)
        .height(300)
        .dimension(dim)
        .group(mentYes, "Yes")
        .stack(mentNo, "No")
        .stack(mentMaybe, "Maybe")
        .valueAccessor(function(d) {
            if (d.value.total > 0) {
                return (d.value.match / d.value.total) * 100;
            }
            else {
                return 0;
            }
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5))
        .margins({ top: 10, right: 100, bottom: 30, left: 30 });
}

function show_family_history(ndx) {

    var dim = ndx.dimension(dc.pluck("familyhistory"));
    var group = dim.group();

    dc.pieChart('#family_history')
        .height(200)
        .radius(480)
        .transitionDuration(500)
        .dimension(dim)
        .group(group);
}

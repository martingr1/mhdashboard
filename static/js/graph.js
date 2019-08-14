queue()
    .defer(d3.csv, "data/mhsurvey2.csv")
    .await(makeGraphs);

function makeGraphs(error, healthData) {

    var ndx = crossfilter(healthData);

    healthData.forEach(function(d) {
        d.age = parseInt(d.age);
    })
    
    show_select_company(ndx);
    show_select_gender(ndx);
    show_select_date(ndx);
    show_select_worktype(ndx);
    
    
    show_respondents(ndx);
    show_tech_companies(ndx);

    show_average_age_gender(ndx, "Female", "#average_age_gender");
    show_average_age_gender(ndx, "Male", "#average_age_male");

    
    show_gender_breakdown(ndx);
    show_country_breakdown(ndx);
    show_treatment_levels(ndx);
    show_age_breakdown(ndx);

    show_treatment_by_gender(ndx);
    show_family_history(ndx);

    show_physical_impact(ndx);
    show_mental_impact(ndx);
    show_wellness_program(ndx);

    dc.renderAll();
}

function show_select_company(ndx) {
    var dim = ndx.dimension(dc.pluck("techcompany"));
    var group = dim.group();

    dc.selectMenu("#select_company")
        .dimension(dim)
        .group(group);
}

function show_select_gender(ndx) {
    var dim = ndx.dimension(dc.pluck("gender"));
    var group = dim.group();

    dc.selectMenu("#select_gender")
        .dimension(dim)
        .group(group);
}

function show_select_date(ndx) {
    var dim = ndx.dimension(dc.pluck("date"));
    var group = dim.group();

    dc.selectMenu("#select_date")
        .dimension(dim)
        .group(group);
}

function show_select_worktype(ndx) {
    var dim = ndx.dimension(dc.pluck("selfemployed"));
    var group = dim.group();

    dc.selectMenu("#select_worktype")
        .dimension(dim)
        .group(group);
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

        function(p, v) {
            if (v.techcompany === 'Yes') {
                p.count++;
            }
            return p;
        },
        function(p, v) {
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
        .valueAccessor(function(d) { return d.count; })
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
                return (d.average);
            }
        })
        .group(averageAgeByGender);
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
        .legend(dc.legend().x(-5).y(20).itemHeight(10).gap(10))
        .dimension(dim)
        .group(group);
}

function show_age_breakdown(ndx) {

    var age_dimension = ndx.dimension(function(d) {

        if (d.age >= 18 && d.age <= 24) {

            return "18-24";
        }

        else if (d.age > 24 && d.age <= 39) {

            return "25-39";
        }

        else if (d.age >= 40 && d.age <= 49) {

            return "40-49";
        }

        else if (d.age > 50) {

            return "50+";
        }
    });

    var age_group = age_dimension.group();
    dc.barChart('#age_breakdown')
        .width(300)
        .height(200)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(age_dimension)
        .group(age_group)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
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

function show_treatment_by_gender(ndx) {

    function genderTreatment(dimension, treatment) {

        return dimension.group().reduce(

            function(p, v) {
                p.total++;
                if (v.treatment == treatment) {
                    p.match++;
                }
                return p;
            },
            function(p, v) {
                p.total--;
                if (v.treatment == treatment) {
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
    var treatYes = genderTreatment(dim, "Yes");
    var treatNo = genderTreatment(dim, "No");

    dc.barChart("#treatment_by_gender")
        .width(300)
        .height(300)
        .dimension(dim)
        .group(treatYes, "Yes")
        .stack(treatNo, "No")
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
        .legend(dc.legend().x(260).y(20).itemHeight(15).gap(5))
        .margins({ top: 10, right: 100, bottom: 30, left: 30 });
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

function show_wellness_program(ndx) {
    
    var wellnessprogram_dim = ndx.dimension(dc.pluck("wellnessprogram"));
    
    var wh_group = wellnessprogram_dim.group();
    
    dc.pieChart('#wellness_chart')
        .height(200)
        .radius(480)
        .transitionDuration(500)
        .dimension(wellnessprogram_dim)
        .group(wh_group);
}

'use strict';

var source = $('#project-template').html();
var template = Handlebars.compile(source);

var pivotal = new Pivotal();

pivotal.get_projects()
    .done(function(projects) {
        var project = projects['HSNet'];

        $('body').html(template(project));

        project.get_current_iteration()
            .done(function(iteration) {
                var progress = iteration.get_progress();

                $('#burnup-graph').highcharts({
                    title: { text: "Iteration Burnup" },
                    xAxis: {
                        type: 'datetime',
                        title: { text: "Date" }
                    },
                    yAxis: {
                        title: { text: "Points" }
                    },
                    series: [
                        {
                            name: "Committed",
                            data: [
                                [fix_date(iteration.start), 0],
                                [fix_date(iteration.finish), iteration.total_points]
                            ]
                        },
                        {
                            name: "Target",
                            data: [
                                [fix_date(iteration.start), 0],
                                [fix_date(iteration.finish), project.velocity]
                            ]
                        },
                        {
                            name: "Progress",
                            type: 'area',
                            data: progress.map(function(e) {
                                return [fix_date(e.date), e.accepted];
                            })
                        },
                    ]
                });
            });

        project.get_next_release()
            .done(function(release) {
                $('#release-name').text(release.name);
                $('#release-scheduled').text(release.scheduled.toDateString());
            });
    });

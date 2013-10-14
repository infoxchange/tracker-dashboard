'use strict';

function Pivotal() {
    $.ajaxPrefilter(function(opts, old, xhr) {
        /* URL endpoint */
        opts.url = 'https://www.pivotaltracker.com/services/v5/' + opts.url;

        /* headers */
        opts.headers = opts.headers || {};
        opts.headers['X-TrackerToken'] = API_KEY;
    });
}

Pivotal.prototype = {
    get_projects: function(template, target) {

        $.getJSON('/projects',
                  { fields: 'name,current_velocity' })
            .done(function(d) {
                $.each(d, function() {
                    var project = $(this);

                    var context = {};
                    context['project_name'] = this.name
                    context['project_velocity'] = this.current_velocity;

                    $.when(
                        /* retrieve the current iteration for this project */
                        $.getJSON('/projects/' + this.id + '/iterations',
                                  {
                                      limit: 1,
                                      fields: 'stories,start,finish'
                                  })
                            .done(function(d) {
                                // pass
                            }),

                        /* retrieve the next release for this project */
                        $.getJSON('/projects/' + this.id + '/stories',
                                  {
                                      limit: 1,
                                      filter: 'type:release state:unstarted'
                                  })
                            .done(function(d) {
                                var d = d[0];

                                console.log("Done");
                                console.log(d);
                                context['release_name'] = d.name || d.description;
                                context['release_date_sched'] = d.deadline;
                                console.log(context);
                            }))

                        .done(function() {
                            console.log(context);
                            target.append(template(context))
                        })
                        .fail(function() {
                            // FIXME: report
                            console.log("Failed to retrieve project",
                                        project.name);
                        });
                });
            })
            .fail(function() {
                // FIXME: report
                console.log("Failed to retrieve project list");
            });
    }
}

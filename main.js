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
            });

        project.get_next_release()
            .done(function(release) {
                $('#release-name').text(release.name);
                $('#release-scheduled').text(release.scheduled.toDateString());
            });
    });

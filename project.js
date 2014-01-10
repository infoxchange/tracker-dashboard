'use strict';

/**
 * new PivotalProject:
 *
 * A project in Pivotal Tracker.
 */
function PivotalProject(d) {
    this.id = d.id;
    this.name = d.name;
    this.velocity = d.current_velocity;
}

PivotalProject.prototype = {
    /**
     * get_current_iteration:
     *
     * Request the current iteration.
     */
    get_current_iteration: function() {
        var self = this;
        var defer = $.Deferred();

        $.getJSON(build_url('/projects/{id}/iterations', self),
                  {
                      scope: 'current',
                      fields: 'start,finish,stories'
                  })
            .done(function(d) {
                defer.resolve(new PivotalIteration(d[0]));
            });

        return defer;
    },

    get_next_release: function() {
        var self = this;
        var defer = $.Deferred();

        $.getJSON(build_url('/projects/{id}/stories', self),
                  {
                      filter: 'type:release',
                      limit: 1
                  })
            .done(function(d) {
                d = d[0];

                var release = {
                    name: d.name,
                    scheduled: new Date(d.deadline)
                };

                defer.resolve(release);
            });

        return defer;
    },

    toString: function() {
        return this.name;
    },
}


/**
 * new PivotalIteration:
 *
 * An iteration in Pivotal Tracker.
 */
function PivotalIteration(d) {
    this.start = new Date(d.start);
    this.finish = new Date(d.finish);
    this.stories = d.stories;

    /* fix the start date */
    this.start.setDate(this.start.getDate() + 1);

    this.total_points = this.stories.sum(function(e) {
        return e.estimate || 0;
    });
}

PivotalIteration.prototype = {
    /**
     * get_progress:
     *
     * get the current points completed of the iteration sorted by date
     */
    get_progress: function() {
        var self = this;
        var points = {};

        /* filter the objects to only consider accepted objects.
         * Count the points by accepted date */
        self.stories
            .filter(function(e) {
                return e.current_state === 'accepted' &&
                       e.estimate !== undefined;
            }).forEach(function(e) {
                var date = new Date(e.accepted_at).toDateString();

                points[date] = points[date] || { accepted: 0 };
                points[date].accepted += e.estimate;
            });

        /* filter to consider delivered objects */
        // self.stories
        //     .filter(function(e) {
        //         return e.current_state === 'delivered' &&
        //                e.estimate !== undefined;
        //     }).forEach(function(e) {
        //         console.log(e);
        //     });

        /* add today if it's not present */
        var today = new Date().toDateString();
        points[today] = points[today] || { accepted: 0 };

        /* rearrange to be sorted by date */
        var accepted = 0;
        var progress = Object.keys(points).map(function(k) {
            accepted += points[k].accepted;

            return {
                date: new Date(k),
                accepted: accepted
            };
        });


        return progress;
    },
}

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

        $.getJSON('/projects/' + self.id + '/iterations',
                  {
                      scope: 'current',
                      fields: 'start,finish,stories'
                  })
            .done(function(d) {
                defer.resolve(new PivotalIteration(d[0]));
            })

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
    this.stories = d.stories;
}

PivotalIteration.prototype = {
    /**
     * get_progress:
     *
     * get the current points completed of the iteration.
     */
    get_progress: function() {
        var points = {};

        /* filter the objects to only consider accepted objects.
         * Count the points by accepted date */
        this.stories
            .filter(function(e) {
                return e.current_state === 'accepted' &&
                       e.estimate !== undefined;
            }).forEach(function(e) {
                var date = new Date(e.accepted_at).toDateString();

                points[date] = points[date] || { accepted: 0 };
                points[date].accepted += e.estimate;
            });

        /* filter to consider delivered objects */
        // this.stories
        //     .filter(function(e) {
        //         return e.current_state === 'delivered' &&
        //                e.estimate !== undefined;
        //     }).forEach(function(e) {
        //         console.log(e);
        //     });

        return points;
    },
}

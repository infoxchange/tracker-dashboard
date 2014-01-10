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
     * get the current projects of the iteration.
     */
    get_progress: function() {
    },
}

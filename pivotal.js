'use strict';

/**
 * new Pivotal:
 *
 * Control class for talking to Pivotal Tracker.
 */
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
    /**
     * get_projects:
     *
     * Retrieve the list of projects from Pivotal Tracker.
     *
     * Returns: a dictionary of project names to PivotalProject objects
     */
    get_projects: function() {
        var self = this;

        var defer = $.Deferred();

        $.getJSON('/projects',
                  { fields: 'name,current_velocity' })
            .done(function(d) {
                var projects = {};

                d.forEach(function(e) {
                    var p = new PivotalProject(e);

                    projects[p.name] = p;
                });

                defer.resolve(projects);
            })
            .fail(function() {
                // FIXME: report
                defer.reject();
            });

        return defer;
    }
}


function by_key(key) {
    return function(a, b) {
        if (a[key] < b[key])
            return -1;
        else if (b[key] < a[key])
            return 1;
        else
            return 0;
    }
}


// Array.prototype.sum = function(key) {
//     return this.reduce(function(total, e) {
//         return total + key(e);
//     }, 0);
// };

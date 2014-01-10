'use strict';

function PivotalProject(d) {
    this.id = d.id;
    this.name = d.name;
    this.velocity = d.current_velocity;
}

PivotalProject.prototype = {
    /**
     * get_current_iteration:
     */
    get_current_iteration: function() {
        var self = this;
        var defer = $.Deferred();

        $.getJSON('/projects/' + self.id + '/iterations',
                  {
                      limit: 1,
                      fields: 'start,finish,stories'
                  })
            .done(function(d) {
                console.log(d);

                defer.resolve();
            })

        return defer;
    },

    toString: function() {
        return this.name;
    },
}

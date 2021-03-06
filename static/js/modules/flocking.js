define([], function () {

    var backgroundTimer,universe;
    var btnStart, btnStop, btnClear, btnSingle, btnSet, btnBigBang;
    var txtSeparation,txtAlignment,txtCohesion;
    var constSeparation,constAlignment,constCohesion;
    var repelSpot = new Array(0,0);
    var shouldRepel = false;
    var btnShowAff;
    var COUNT = 50;
    var PARTICLE_SIZE = 10;
    var PARTICLE_SPEED = 5;
    var flock;

    function init () {
        'use strict';
        // Find the canvas element.
        universe = ENCOG.GUI.Agents2D.create('drawing-area',500,500);
        console.log(universe);
        universe.reset(COUNT);

        // repel
        universe.pointerDown = function(x,y) {
            'use strict';
            var repelSpot = [x,y];
            var repulse = ENCOG.MathUtil.kNearest(repelSpot,universe.agents,COUNT,100,0,2);
            for(var i=0;i<repulse.length;i++)
            {
                var dx = repelSpot[0] - repulse[i][0];
                var dy = repelSpot[1] - repulse[i][1];
                var repulseAngle = ((Math.atan2(dx, dy) * 180 / Math.PI))+180;
                repulse[i][2]=repulseAngle;
            }
        };

        flock = ENCOG.Swarm.create(universe.agents);
        flock.callbackNeighbors = function(i,neighbors) {
            if( btnShowAff.checked ) {
                universe.plotGroup(i,neighbors);
            }
        };

        // Attach the mousedown, mousemove and mouseup event listeners.
        btnStart = document.getElementById('btnStart');
        btnStop = document.getElementById('btnStop');
        btnClear = document.getElementById('btnClear');
        btnSingle = document.getElementById('btnSingle');
        btnBigBang = document.getElementById('btnBigBang');
        btnShowAff = document.getElementById('btnShowAff');
        btnSet = document.getElementById('btnSet');

        txtSeparation = document.getElementById('txtSeparation');
        txtAlignment = document.getElementById('txtAlignment');
        txtCohesion = document.getElementById('txtCohesion');

        btnStart.addEventListener('click', ev_start, false);
        btnStop.addEventListener('click', ev_stop, false);
        btnClear.addEventListener('click', ev_clear, false);
        btnSingle.addEventListener('click', ev_single, false);
        btnSet.addEventListener('click', ev_set, false);
        btnBigBang.addEventListener('click', ev_bigBang, false);

        ev_set();
        ev_clear();
        ev_start();
    }

    /////////////////////////////////////////////////////////////////////////////
    // Event functions
    /////////////////////////////////////////////////////////////////////////////

    // The user has started dragging (or touching), this will begin to repel
    // particles that are too close to the event location.
    function ev_start(ev)
    {
        'use strict';
        backgroundTimer = self.setInterval(ev_animate,50);
        btnStart.disabled = true;
        btnStop.disabled = false;
        btnSingle.disabled = true;
    }

    // The user has stopped dragging (or touching), this will stop repeling particles.
    function ev_stop(ev)
    {
        'use strict';
        self.clearInterval(backgroundTimer);
        btnStart.disabled = false;
        btnStop.disabled = true;
        btnSingle.disabled = false;
    }

    // Set the three flocking constants.
    function ev_set(ev)
    {
        'use strict';
        constSeparation = parseFloat(txtSeparation.value);
        constAlignment = parseFloat(txtAlignment.value);
        constCohesion = parseFloat(txtCohesion.value);
    }

    // Clear the universe to a "random" state.
    function ev_clear(ev)
    {
        'use strict';
        universe.reset(COUNT);
        flock.agents = universe.agents;
    }

    // Clear the universe by moving every particle to the center, with common
    // angles.  This creates a 100% deterministic (the same result each time),
    // yet seemingly random universe.
    function ev_bigBang(ev)
    {
        'use strict';
        universe.agents = [];
        flock.agents = universe.agents;
        for(var i=0; i < count;i++) {
            universe.agents[i] = [ universe.canvas.width/2,universe.canvas.height/2,0];
        }

        ev_animate();
    }

    // Move forward by a single time slice.
    function ev_single(ev)
    {
        'use strict';
        ev_animate();
    }

    // If we are repeling, find everything that is within a 100 unit radius of the
    // repel spot, repel it.  The repel occurs by calculating the ideal angle
    // to take us to the repel spot, and then use the 180deg opposit of that angle.
    function performRepel()
    {


    }

    // This is the main loop of the program.  It is called by a timer and drives
    // the animation.  This method loops over all of the particles and performs
    // the following.
    function ev_animate()
    {
        'use strict';
        universe.advance();
        universe.render();
        flock.iteration();
    }

    /////////////////////////////////////////////////////////////////////////////
    // Downsampling functions
    /////////////////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////////////////////////////////
    // Drawing functions
    /////////////////////////////////////////////////////////////////////////////

    return init
});

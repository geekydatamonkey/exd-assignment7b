/* jshint newcap: false */

'use strict';

import $ from 'jquery';
//import _ from 'lodash';
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import ParticleSystem from './ParticleSystem';
//import { getRandomInt } from './util';

const Vector = p5.Vector;
const π = Math.PI;

function sketch(s) {

  let config = { 
    parent: '.canvas-wrapper',
    particleSys: {
      sketch: s,
      isPaused: true,
      gravitationalConstant: 1,
      maxAccel: 1,
      maxVelocity: 10,
      edgeWrapMode: true,
    },
    mouseParticle: {
        position: new Vector(s.width/2, s.height/2),
        mass: Math.pow(10,10),
        isPinned: true,
    },
    sliders: [
      'gravity',
      'mouseMass'
    ]
  };

  let $canvasWrapper = $(config.parent);
  let particleSys;
  let gravityEl = document.getElementById('gravity');
  let mouseMassEl = document.getElementById('mouseMass');

  function _updateGravity() {
    // gravity update
    particleSys.setGravity(gravityEl.value);
    document.getElementById('gravity-value').innerHTML = gravityEl.value;
  }

  function _updateMouseMass() {
    particleSys.particles[0].setMass(mouseMassEl.value);
    document.getElementById('mousemass-value').innerHTML = mouseMassEl.value;
  }

  function _togglePause() {
    particleSys.togglePause();
    $(this).toggleClass('is-active');
  }

  s.setup = function() {

    s.createCanvas(
      $canvasWrapper.innerWidth(),
      $canvasWrapper.innerHeight()
    ).parent($canvasWrapper[0]);

    s.background(0);
    s.noStroke();

    particleSys = new ParticleSystem(config.particleSys);

    window.particleSys = particleSys;

    // mouse Particle
    particleSys.add(config.mouseParticle);

    for (let r = 50; r < s.height/2 - 200; r += 50) {
      for (let theta = 0; theta < 2*π; theta += 2*π/20) {
        let x = s.width/2 + r * Math.cos(theta);
        let y = s.height/2 + r * Math.sin(theta);

        particleSys.add( {
          position: new Vector(x, y),
          mass: 1000 * Math.sin(2*theta) + 1,
        });
      }
    }

    // initialize gravity and mouse mass
    _updateGravity();
    _updateMouseMass();

    // setup click handlers
    $('.js-pause').on('click', _togglePause);

    $('.js-reset').on('click', function() {
      gravityEl.value = 1;
      mouseMassEl.value = 10;
      particleSys.removeAll();
      particleSys.add(config.mouseParticle);
      _updateGravity();
      _updateMouseMass();
    });

    $('#gravity').on('change', _updateGravity);
    $('#mouseMass').on('change', _updateMouseMass);

  };


  s.draw = function() {
    s.background(0);

    // update mouse particle position
    particleSys.particles[0].position.set(s.mouseX, s.mouseY);

    particleSys.update().render();

  };

  s.mousePressed = function() {
    particleSys.add({
      position: new Vector(s.mouseX, s.mouseY),
      mass: Math.max(mouseMassEl.value,1),
    });

    // prevent default
    // return false;
  };

  s.keyPressed = function() {
    if (s.key === ' ') {
      _togglePause();
    }
  };

  s.windowResized = function() {
    s.resizeCanvas( $canvasWrapper.innerWidth(), $canvasWrapper.innerHeight() );
    s.setup();
  };

}

function init() {
  return new p5(sketch);
}

export default { init };
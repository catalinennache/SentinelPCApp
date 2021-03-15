'use strict';

const ioHook = require('iohook');

ioHook.on('mousemove', event => {
  console.log(event); // { type: 'mousemove', x: 700, y: 400 }
});

// Register and start hook
ioHook.start();

sentinel = require('./sentinel');
gui = require('./GUI');



(async ()=>{

// loginWindow = gui.presentLoginForm()

// loginWindow.on("")
sentinel.init(process.argv[2]);
sentinel.fetchConfig();
sentinel.start();




   

})()


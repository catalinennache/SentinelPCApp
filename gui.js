
class Gui{
    constructor(){}

    presentLoginForm(){ return new Promise()}

    showControlPannel(action_callback){}

    hideControlPannel(){}


}
let instance;
let getInstance = ()=>{instance?instance:new Gui()}

module.exports = getInstance
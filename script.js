var common_info = document.getElementsByClassName('info-link');

var contents = document.getElementsByClassName('common');

function show(name,event){

    for (let common of common_info){
        common.classList.remove('info-activated');
    }

    for (let elem of contents){
        elem.classList.remove('content-activated');
    }

    event.currentTarget.classList.add('info-activated');
    document.getElementById(name).classList.add('content-activated');


}

function showadd(){
    alert("Address : Parc Grandmont, 37000 Tours, France")
}
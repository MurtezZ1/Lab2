function scrollToSection(section){
    const section1 = document.getElementById('foot');
    if(section==='foot'){
        section1.scrollIntoView({behavior:'smooth'});
    }
    else{
        console.log('Invalid section!');
    }
}

window.onscroll=function(){
    showBackToTopButton();
}

function showBackToTopButton(){
    const button = document.getElementById('back-to-top');
    if(document.documentElement.scrollTop>20){
        button.style.display = 'block';
    } else{
        button.style.display = 'none';
    }
}

function scrollToTop(){
    window.scrollTo({
        top:0,
        behavior: 'smooth'
    });
}
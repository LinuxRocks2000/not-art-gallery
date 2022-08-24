var carouselIsHovered = false;
function carouselHovered(){
    carouselIsHovered = true;
}

function carouselUnhovered(){
    carouselIsHovered = false;
}

window.addEventListener("wheel", (evt) => {
    if (carouselIsHovered){
        var carouselEl = document.getElementById("carousel");
        if (carouselEl.scrollLeft <= 30 && evt.deltaY < 0){
            //document.body.scrollTo(0, carouselEl.getBoundingClientRect().top);
            //alert("tuba");
        }
        else{
            if (Math.abs(carouselEl.getBoundingClientRect().top) < 5){
                console.log(Math.abs(carouselEl.getBoundingClientRect().top));
                evt.preventDefault();
                carouselEl.scrollBy(evt.deltaX + evt.deltaY, 0);
            }
            /*document.documentElement.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior : "smooth"
            });*/
        }
    }
}, {passive: false});

function openShadowbox(el){
    document.getElementById("shadowbox").children[0].src = el.src;
    document.getElementById("shadowbox").classList.remove("hidden");
    var rect = el.getBoundingClientRect();
    document.getElementById("carousel").scrollBy({
        left: rect.left + rect.width/2 - window.innerWidth/2,
        behavior: "smooth"
    });
}

Array.from(document.getElementsByClassName("image")).forEach((el, i) => {
    el.addEventListener("click", () => {openShadowbox(el.children[0])});
});

document.getElementById("shadowbox").onclick = () => {
    document.getElementById("shadowbox").classList.add("hidden");
};

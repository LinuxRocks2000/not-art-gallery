var carouselIsHovered = false;
function carouselHovered(){
    carouselIsHovered = true;
}

function carouselUnhovered(){
    carouselIsHovered = false;
}

var scrollies = [];
Array.from(document.getElementsByClassName("gradient-scrolly")).forEach((item, i) => {
    scrollies.push({
        el: item,
        position: 0
    });
});

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
    scrollies.forEach((item, i) => {
        if (Math.abs(item.el.getBoundingClientRect().top) <= Math.abs(evt.deltaY) * 2 && (item.position > 0 || evt.deltaY > 0) && (item.position < 3000 || evt.deltaY < 0)){
            evt.preventDefault();
            document.getElementById("main").scrollBy(0, item.el.getBoundingClientRect().top);
            if (!item.el.classList.contains("gradient-scrolly-fixed")){
                item.el.classList.add("gradient-scrolly-fixed");
                document.getElementById("main").style.overflow = "hidden";
            }
            item.position += evt.deltaY;
            item.el.style.opacity = (100 - item.position/30) + "%";
        }
        else{
            if (item.el.classList.contains("gradient-scrolly-fixed")){
                item.el.classList.remove("gradient-scrolly-fixed");
                document.getElementById("main").style.overflow = "";
            }
        }
    });
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

window.addEventListener("load", () => {
    document.getElementById("main").scrollTo(0, 0); // Scroll up, because we don't want people to be in the art immediately at the start
});

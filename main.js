var carouselIsHovered = false;
function carouselHovered(){
    carouselIsHovered = true;
}

function carouselUnhovered(){
    carouselIsHovered = false;
}

var scrollies = [];

var carouselElAnchor = 0;

window.addEventListener("wheel", (evt) => {
    if (carouselIsHovered){
        var carouselEl = document.getElementById("carousel");
        if (carouselEl.scrollLeft <= 30 && evt.deltaY < 0){
        }
        else{
            if (Math.abs(carouselEl.getBoundingClientRect().top) < 5){
                evt.preventDefault();
                carouselEl.scrollBy(evt.deltaX + evt.deltaY, 0);
            }
        }
    }
    scrollies.forEach((item, i) => {
        if (Math.abs(item.el.getBoundingClientRect().top) <= Math.abs(evt.deltaY) * 2 && (item.position > 0 || evt.deltaY > 0) && (item.position < 3000 || evt.deltaY < 0)){
            document.getElementById("main").scrollTo(0, item.lockPos);
            evt.preventDefault();
            if (!item.el.classList.contains("gradient-scrolly-fixed")){
                item.el.classList.add("gradient-scrolly-fixed");
            }
            item.position += evt.deltaY;
            var greyPercent = (100 - item.position/30)/100;
            var greyVal = greyPercent * 255;
            console.log(greyPercent);
            item.el.style.backgroundColor = "rgb(" + greyVal + ", " + greyVal + ", " + greyVal + ")";
        }
        else{
            if (item.el.classList.contains("gradient-scrolly-fixed")){
                item.el.classList.remove("gradient-scrolly-fixed");
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
    Array.from(document.getElementsByClassName("gradient-scrolly")).forEach((item, i) => {
        scrollies.push({
            el: item,
            position: 0,
            lockPos: item.getBoundingClientRect().top
        });
    });
    carouselElAnchor = document.getElementById("carousel").getBoundingClientRect().top;
});

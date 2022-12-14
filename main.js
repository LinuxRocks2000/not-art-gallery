var carouselIsHovered = false;
function carouselHovered(){
    carouselIsHovered = true;
}

function carouselUnhovered(){
    carouselIsHovered = false;
}

var scrollies = [];

var carouselElAnchor = 0;

var creditPos = 0;

function getAnchor(el){
    var node = el;
    var pos = 0;
    while (node){
        if (node.offsetTop){
            pos += node.offsetTop;
        }
        node = node.parentNode;
    }
    console.log(pos);
    return pos;
}

function handleWheel(evt){
    evt.preventDefault();
    var carouselEl = document.getElementById("carousel");
    var mainEl = document.getElementById("main");
    var onSideLeft = carouselEl.scrollLeft < 10;
    var onSideRight = carouselEl.scrollLeft > carouselEl.scrollWidth - window.innerWidth - 30;
    var inPipeLeft = onSideLeft && (carouselEl.getBoundingClientRect().top > 0);
    var inPipeRight = onSideRight && (carouselEl.getBoundingClientRect().top < 0);
    var isOnCarousel = Math.abs(carouselEl.getBoundingClientRect().top) < 1; // allowance of 0 for now, might change this later (assuming it doesn't break anything)
    var doAllowScrollUp = (isOnCarousel && onSideLeft && evt.deltaY < 0) || inPipeLeft || inPipeRight;
    var doAllowScrollDown = (isOnCarousel && onSideRight && evt.deltaY > 0) || inPipeRight || inPipeLeft;
    var doAllowScroll = doAllowScrollUp || doAllowScrollDown;
    if (doAllowScroll){
        mainEl.scrollBy(0, evt.deltaY);
    }
    if (isOnCarousel){
        carouselEl.scrollBy(evt.deltaX + evt.deltaY, 0);
    }
    if (!isOnCarousel && !inPipeLeft && !inPipeRight){
        mainEl.scrollBy(0, carouselEl.getBoundingClientRect().top, {
            behavior: "instant"
        });
    }
}

var onWheel = (evt) => {
    var wasInScrolly = false;
    scrollies.forEach((item, i) => {
        if (Math.abs(item.el.getBoundingClientRect().top) <= Math.abs(evt.deltaY) * 2 && (item.position > 0 || evt.deltaY > 0) && (item.position < 1000 || evt.deltaY < 0)){
            document.getElementById("main").scrollTo(0, getAnchor(item.el));
            evt.preventDefault();
            if (!item.el.classList.contains("gradient-scrolly-fixed")){
                item.el.classList.add("gradient-scrolly-fixed");
            }
            item.position += evt.deltaY;
            var greyPercent = (100 - item.position/10)/100;
            var greyVal = greyPercent * 255;
            item.el.style.backgroundColor = "rgb(" + greyVal + ", " + greyVal + ", " + greyVal + ")";
            wasInScrolly = true;
        }
        else{
            if (item.el.classList.contains("gradient-scrolly-fixed")){
                item.el.classList.remove("gradient-scrolly-fixed");
            }
        }
    });
    if (!wasInScrolly){
        handleWheel(evt);
    }
};

var lastTouchScrollPos = {x: 0, y: 0};

window.addEventListener("wheel", onWheel, {passive: false});

window.addEventListener("touchstart", (evt) => {
    lastTouchScrollPos.x = evt.touches[0].pageX;
    lastTouchScrollPos.y = evt.touches[0].pageY;
});

window.addEventListener("touchmove", (evt) => {
    evt.preventDefault();
    onWheel({
        preventDefault: () => {},
        deltaX: lastTouchScrollPos.x - evt.touches[0].pageX,
        deltaY: lastTouchScrollPos.y - evt.touches[0].pageY
    });
    lastTouchScrollPos.x = evt.touches[0].pageX;
    lastTouchScrollPos.y = evt.touches[0].pageY;
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
    document.getElementById("carousel").scrollTo(0, 0);
    Array.from(document.getElementsByClassName("gradient-scrolly")).forEach((item, i) => {
        scrollies.push({
            el: item,
            position: 0
        });
    });
    carouselElAnchor = document.getElementById("carousel").getBoundingClientRect().top;
});

var lastScrollpos = 0;

document.getElementById("main").addEventListener("scroll", (event) => {
    var newEvent = new Event("MouseEvents");
    newEvent.initEvent("wheel", true, true);
    newEvent.deltaY = document.getElementById("main").scrollTop - lastScrollpos;
    window.dispatchEvent(newEvent);
    lastScrollpos = document.getElementById("main").scrollTop;
});

window.addEventListener("keydown", (event) => {
    if (event.key.startsWith("Arrow")){
        event.preventDefault();
    }
});

var doesHaveImage = false;
var doesHaveName = false;

function checkCanSubmit(){
    if (doesHaveName && doesHaveImage){
        document.getElementById("submitbutton").style.display = "";
    }
    else{
        document.getElementById("submitbutton").style.display = "none";
    }
}

document.getElementById("submitFileInput").onchange = (evt) => {
    if (evt.target.files[0].size > 1048576){
        evt.target.value = null;
        alert("Your image is too large! The cap is 3 megabytes.");
        doesHaveImage = false;
    }
    else if (["image/jpeg", "image/png"].indexOf(evt.target.files[0].type) == -1){
        evt.target.value = null;
        alert("Incorrect format!");
        doesHaveImage = false;
    }
    else{
        doesHaveImage = true;
        document.getElementById("filepreview").src = URL.createObjectURL(evt.target.files[0]);
    }
    checkCanSubmit();
};

document.getElementById("urname").onchange = (evt) => {
    if (evt.target.value.length > 0){
        doesHaveName = true;
    }
    else{
        doesHaveName = false;
    }
    checkCanSubmit();
};

Parse.initialize("ZOsvnQA26eDV24ffFUH3amlzikcGei0Dt8YP4bc7", "P8dypv1JzgajN8acXO242ojScHALbAik0dOw7Q12");
Parse.serverURL = "https://parseapi.back4app.com/";

function sendimage(){
    const Upload = Parse.Object.extend("Upload");
    var upload = new Upload();
    upload.set("Human", document.getElementById("urname").value);
    var image = document.getElementById("submitFileInput").files[0];
    var file = new Parse.File(image.name, image);
    upload.set("Image", file);
    upload.save();
    document.getElementById("submittedDongle").style.display = "";
    document.querySelector('input[type="file"]').value = null;
    document.getElementById("filepreview").src = "";
    document.getElementById("urname").value = "";
    setTimeout(() => {
        document.getElementById("submittedDongle").style.display = "none";
    }, 5000);
}

import gsap from 'gsap';

const scrollArea = document.querySelector('.container');
let  current = 0.0;
let  target = 0.0;
const ease = .035;

const lerp = (p1, p2, t) => {
    return (1-t) * p1 + t * p2;
}

export function smoothScroll(){
    
    target = window.scrollY;
    current = lerp(current, target, ease);
    scrollArea.style.transform = `translateY(${-current}px)`;
}
export function animations(){
    const socials = document.querySelector(".socials");
    const closeButton = document.querySelector(".close-button");
    const hamburger = document.querySelector(".Hamburger");

    socials.style.transform = "translateX(1000px)";
    closeButton.addEventListener("click", () => {
        gsap.to(".Nav-Bar", { width: '0%', duration: .45, delay: 0.25, ease: "power2.inOut" });
        gsap.to(".socials", { x: 1200, duration: .55 });
    });
    hamburger.addEventListener("click", () => {
        gsap.to(".Nav-Bar", { width: '100%', duration: .75, ease: "power2.inOut" });
        gsap.to(".socials", { x: 0, duration: 1, delay: .35, ease: "back.out(1.7)" });
    });
}
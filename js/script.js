(function(){
    const c = document.getElementById('particles');
    for(let i=0; i<30; i++){
        const p = document.createElement('div');
        p.classList.add('particle');
        const s = Math.random()*6+3;
        p.style.cssText = 'width:'+s+'px;height:'+s+'px;left:'+Math.random()*100+'%;animation-duration:'+(Math.random()*6+6)+'s;animation-delay:'+(Math.random()*6)+'s;';
        c.appendChild(p);
    }
})();

const obs = new IntersectionObserver(e => {
    e.forEach(el => {
        if(el.isIntersecting){
            el.target.classList.add('active');
            obs.unobserve(el.target);
        }
    });
}, {threshold:.15});

document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => obs.observe(el));

const barObs = new IntersectionObserver(e => {
    e.forEach(el => {
        if(el.isIntersecting){
            el.target.querySelectorAll('.skill-bar').forEach(b => b.style.width = b.dataset.width);
            barObs.unobserve(el.target);
        }
    });
}, {threshold:.3});

const skillsSection = document.getElementById('skills');
if (skillsSection) barObs.observe(skillsSection);

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const scrollTop = document.getElementById('scrollTop');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (scrollTop) scrollTop.classList.toggle('show', window.scrollY > 500);
});

function sendMail(){
    var n = document.getElementById('cName').value.trim();
    var e = document.getElementById('cEmail').value.trim();
    var s = document.getElementById('cSubject').value.trim();
    var m = document.getElementById('cMessage').value.trim();
    if(!n || !e || !s || !m){
        alert('Please fill in all fields.');
        return;
    }
    window.location.href = 'mailto:giordanotubeo@gmail.com?subject=' + encodeURIComponent(s) + '&body=' + encodeURIComponent('Name: ' + n + '\nEmail: ' + e + '\n\n' + m);
}

// AI Notice Banner Logic
function closeAiNotice() {
    const notice = document.getElementById('ai-status-notice');
    if (notice) notice.style.display = 'none';
    localStorage.setItem('aiNoticeDismissed', 'true');
}

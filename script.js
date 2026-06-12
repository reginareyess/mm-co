const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];const cursor=$("#star-cursor");if(cursor){document.addEventListener("mousemove",e=>{cursor.style.left=e.clientX+"px";cursor.style.top=e.clientY+"px"})}$("#hamburger")?.addEventListener("click",()=>$("#mobileMenu").classList.toggle("open"));$$(".mobile-menu a").forEach(a=>a.addEventListener("click",()=>$("#mobileMenu").classList.remove("open")));window.addEventListener("scroll",()=>{$("#navbar").style.boxShadow=scrollY>30?"0 4px 20px rgba(0,0,0,.07)":"none"});const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target)}}),{threshold:.12});$$(".reveal").forEach(el=>obs.observe(el));
const slides=$$(".slide"),dots=$("#heroDots");let slideIndex=0,timer;function renderCarousel(){slides.forEach((s,i)=>s.classList.toggle("active",i===slideIndex));if(dots){dots.innerHTML=slides.map((_,i)=>`<button class="${i===slideIndex?"active":""}" aria-label="Ir a imagen ${i+1}"></button>`).join("");$$("button",dots).forEach((b,i)=>b.onclick=()=>goSlide(i))}}function goSlide(i){slideIndex=(i+slides.length)%slides.length;renderCarousel();resetCarousel()}function resetCarousel(){clearInterval(timer);timer=setInterval(()=>goSlide(slideIndex+1),5000)}$("#heroPrev")?.addEventListener("click",()=>goSlide(slideIndex-1));$("#heroNext")?.addEventListener("click",()=>goSlide(slideIndex+1));if(slides.length){renderCarousel();resetCarousel()}
const serviceText={contenido:["Creación de contenido","Diseñamos ideas, copies, calendarios y piezas visuales para que tu marca comunique con claridad, constancia y estilo propio."],marca:["Marca personal","Construimos una identidad digital clara: tono de voz, pilares de contenido, presentación visual y estrategia para posicionarte mejor."],redes:["Gestión de redes","Organizamos publicaciones, seguimiento, métricas y optimización para que tus redes trabajen con intención y no por improvisación."],datos:["Análisis de datos","Convertimos métricas en decisiones: revisamos alcance, interacción, crecimiento y oportunidades para mejorar tus resultados."]};$$(".service-tab").forEach(btn=>btn.onclick=()=>{$$(".service-tab").forEach(b=>b.classList.remove("active"));btn.classList.add("active");const s=serviceText[btn.dataset.service];$("#serviceTitle").textContent=s[0];$("#serviceText").textContent=s[1]});
function toast(icon,msg){$("#toast-icon").textContent=icon;$("#toast-msg").textContent=msg;$("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),3600)}const seed=[{name:"Ana Torres",plan:"THE C* NETWORK",estado:"activo"},{name:"Regina Reyes",plan:"BUILDING",estado:"activo"},{name:"Carlos Vega",plan:"BUSINESS BOOSTER",estado:"completado"},{name:"Lucia Reyes",plan:"Creación de contenido",estado:"pendiente"}];const getLeads=()=>JSON.parse(localStorage.getItem("mm_leads")||"null")||seed,setLeads=x=>localStorage.setItem("mm_leads",JSON.stringify(x));function renderLeads(){const leads=getLeads();$("#db-body").innerHTML=leads.map(l=>`<tr><td>${l.name}</td><td>${l.plan||"Sin seleccionar"}</td><td><span class="status">${l.estado}</span></td></tr>`).join("");$("#lead-count").textContent=leads.length+" registros";const pagos=JSON.parse(localStorage.getItem("mm_pagos")||"[]");$("#payments-body").innerHTML=pagos.length?pagos.map(p=>`<tr><td>${p.name}</td><td>${p.plan}</td><td>${p.price}</td></tr>`).join(""):'<tr><td colspan="3">Sin pagos simulados todavía.</td></tr>'}$("#leadForm")?.addEventListener("submit",e=>{e.preventDefault();const name=$("#lead-name").value.trim(),email=$("#lead-email").value.trim(),phone=$("#lead-phone").value.trim(),plan=$("#lead-plan").value;if(!name||!email){toast("!","Completa nombre y correo.");return}const leads=getLeads();leads.unshift({name,email,phone,plan,estado:"nuevo"});const formData = new FormData();

formData.append("nombre", name);
formData.append("email", email);
formData.append("telefono", phone);
formData.append("plan", plan);

fetch("guardar_lead.php",{
    method:"POST",
    body:formData
})
.then(response => response.text())
.then(data => {

    if(data === "ok"){

        toast("✓","Lead guardado correctamente");

        e.target.reset();

    }else{

        toast("!","Error al guardar");

    }

}); 
;e.target.reset();renderLeads();toast("✓","Registro guardado. Te contactamos pronto.")});$$(".db-tab").forEach(btn=>btn.onclick=()=>{$$(".db-tab").forEach(b=>b.classList.remove("active"));$$(".db-panel").forEach(p=>p.classList.remove("active"));btn.classList.add("active");$("#tab-"+btn.dataset.tab).classList.add("active");renderLeads()});renderLeads();
const users=()=>JSON.parse(localStorage.getItem("mm_users")||"[]"),setUsers=u=>localStorage.setItem("mm_users",JSON.stringify(u));$("#registerForm")?.addEventListener("submit",e=>{e.preventDefault();const user={name:$("#reg-name").value.trim(),email:$("#reg-email").value.trim().toLowerCase(),password:$("#reg-password").value,service:$("#reg-service").value};if(users().some(u=>u.email===user.email)){toast("!","Ese correo ya está registrado.");return}setUsers([...users(),user]);e.target.reset();toast("✓","Cuenta creada. Ya puedes iniciar sesión.")});$("#loginForm")?.addEventListener("submit",e=>{e.preventDefault();const email=$("#login-email").value.trim().toLowerCase(),password=$("#login-password").value,user=users().find(u=>u.email===email&&u.password===password);if(!user){$("#loginStatus").textContent="Correo o contraseña incorrectos.";toast("!","No pudimos iniciar sesión.");return}localStorage.setItem("mm_session",JSON.stringify({email:user.email,name:user.name,date:new Date().toISOString()}));$("#loginStatus").textContent="Sesión iniciada como "+user.name+".";toast("✓","Bienvenid@, "+user.name)});
const modal=$("#payModal");function openModal(plan,price){$("#modal-plan-name").textContent=plan;$("#modal-plan-price").textContent=price;["card-name","card-num","card-exp","card-cvv","pay-email"].forEach(id=>$("#"+id).value="");$("#card-num-preview").textContent="•••• •••• •••• ••••";$("#card-name-preview").textContent="NOMBRE TITULAR";$("#card-exp-preview").textContent="MM/AA";modal.classList.add("open");document.body.style.overflow="hidden"}function closeModal(){modal.classList.remove("open");document.body.style.overflow=""}$$("[data-plan]").forEach(btn=>btn.onclick=()=>openModal(btn.dataset.plan,btn.dataset.price));$("#closeModal")?.addEventListener("click",closeModal);modal?.addEventListener("click",e=>{if(e.target===modal)closeModal()});$("#card-name")?.addEventListener("input",e=>$("#card-name-preview").textContent=e.target.value.toUpperCase()||"NOMBRE TITULAR");$("#card-num")?.addEventListener("input",e=>{let v=e.target.value.replace(/\D/g,"").slice(0,16);e.target.value=v.replace(/(.{4})/g,"$1 ").trim();$("#card-num-preview").textContent=v.padEnd(16,"•").replace(/(.{4})/g,"$1 ").trim()});$("#card-exp")?.addEventListener("input",e=>{let v=e.target.value.replace(/\D/g,"").slice(0,4);if(v.length>=2)v=v.slice(0,2)+"/"+v.slice(2);e.target.value=v;$("#card-exp-preview").textContent=v||"MM/AA"});$("#payNow")?.addEventListener("click",()=>{const name=$("#card-name").value.trim(),num=$("#card-num").value.replace(/\s/g,""),exp=$("#card-exp").value,cvv=$("#card-cvv").value.trim(),email=$("#pay-email").value.trim();if(!name||num.length<16||exp.length<5||cvv.length<3||!email){toast("!","Completa todos los campos de pago.");return}const pagos=JSON.parse(localStorage.getItem("mm_pagos")||"[]");pagos.push({name,email,plan:$("#modal-plan-name").textContent,price:$("#modal-plan-price").textContent,date:new Date().toLocaleDateString("es-MX")});localStorage.setItem("mm_pagos",JSON.stringify(pagos));closeModal();renderLeads();toast("✓","Pago simulado exitoso.")});

// Dashboard de ingreso / panel según plan
const campaignsKey = "mm_campaigns";
const getCampaigns = () => JSON.parse(localStorage.getItem(campaignsKey) || "[]");
const setCampaigns = data => localStorage.setItem(campaignsKey, JSON.stringify(data));

function renderDashboard(){
  const session = JSON.parse(localStorage.getItem("mm_session") || "null");
  const savedUsers = users ? users() : [];
  const currentUser = session ? savedUsers.find(u => u.email === session.email) : null;
  if($("#panelUserName")) $("#panelUserName").textContent = currentUser?.name || session?.name || "Regina Reyes";
  if($("#panelUserType")) $("#panelUserType").textContent = currentUser?.service ? currentUser.service.toLowerCase() : "mind [social]";
  const plan = localStorage.getItem("mm_current_plan") || "Plan Gratuito";
  if($("#panelPlanName")) $("#panelPlanName").textContent = plan;

  const campaigns = getCampaigns();
  if($("#campaignCount")) $("#campaignCount").textContent = campaigns.length || 3;
  const reach = Math.min(95, 12 + campaigns.length * 7);
  if($("#reachMetric")) $("#reachMetric").textContent = reach + "%";
  if($("#campaignHint")) $("#campaignHint").textContent = campaigns.length ? "Campañas guardadas localmente. Lista para conectar con MySQL." : "Agrega tu primera campaña para comenzar a medir impacto.";

  if($("#reachBars")){
    $("#reachBars").innerHTML = campaigns.length ? campaigns.map((c,i)=>{
      const value = Math.min(90, 22 + i * 13 + c.networks.length * 5);
      return `<div class="bar-row"><span>${c.name}</span><div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div><b>${value}%</b></div>`;
    }).join("") : "No hay campañas para mostrar. Crea una campaña para generar datos de impacto.";
  }

  if($("#networkStats")){
    const nets = [...new Set(campaigns.flatMap(c => c.networks || []))];
    $("#networkStats").innerHTML = nets.length ? `<div class="network-pills">${nets.map(n=>`<span>${n}</span>`).join("")}</div>` : "Las métricas de redes sociales aparecen cuando creas campañas.";
  }
}

$("#campaignForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const networks = $$("input[type=checkbox]:checked", e.target).map(x => x.value);
  const item = {
    name: $("#campaign-name").value.trim(),
    goals: $("#campaign-goals").value.trim(),
    target: $("#campaign-target").value.trim(),
    networks,
    url: $("#network-url").value.trim(),
    createdAt: new Date().toISOString()
  };
  if(!item.name || !item.goals || !item.target){ toast("!", "Completa la campaña antes de guardarla."); return; }
  setCampaigns([item, ...getCampaigns()]);
  e.target.reset();
  $$("input[type=checkbox]", e.target).forEach((box, i) => box.checked = i < 4);
  renderDashboard();
  toast("✓", "Campaña creada en el panel.");
});

$("#newCampaign")?.addEventListener("click", () => $("#campaign-name")?.focus());
$("#cancelPlan")?.addEventListener("click", () => {
  localStorage.setItem("mm_current_plan", "Plan Gratuito");
  renderDashboard();
  toast("✓", "Suscripción cancelada en modo demo.");
});

$$("[data-plan]").forEach(btn => btn.addEventListener("click", () => localStorage.setItem("mm_current_plan", btn.dataset.plan)));
renderDashboard();

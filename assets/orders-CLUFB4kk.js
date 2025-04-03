import"./modulepreload-polyfill-B5Qt9EMX.js";import"./subscriptions-NKwU-qAb.js";const a=localStorage.getItem("vendorId");a||v("Vendor ID not found. Please log in again.");const c="https://sosika-backend.onrender.com/api";document.addEventListener("DOMContentLoaded",function(){b(),l();const t=document.querySelectorAll(".filter-btn");t.forEach(e=>{e.addEventListener("click",function(){t.forEach(o=>o.classList.remove("active")),this.classList.add("active"),m=this.dataset.status!=="all"?this.dataset.status:null,l(m)})}),document.querySelector(".close").addEventListener("click",p),window.addEventListener("click",function(e){const o=document.getElementById("orderModal");e.target===o&&p()}),document.getElementById("progress-order-btn").addEventListener("click",function(){i(d,"in_progress")}),document.getElementById("complete-order-btn").addEventListener("click",function(){i(d,"completed")}),document.getElementById("cancel-order-btn").addEventListener("click",function(){i(d,"cancelled")})});let d=null,m=null;function b(){fetch(`${c}/vendor/${a}`).then(t=>{if(!t.ok)throw new Error(`Failed to fetch vendor info: ${t.status}`);return t.json()}).then(t=>{document.getElementById("vendor-name").textContent=t.name||`Vendor #${a}`}).catch(t=>{console.error("Error fetching vendor info:",t),document.getElementById("vendor-name").textContent=`Vendor #${a}`})}function l(t=null){S(),_();let n=`${c}/orders/vendor/${a}`;t&&(n+=`?status=${t}`),fetch(n).then(e=>{if(!e.ok)throw new Error(`Failed to fetch orders: ${e.status}`);return e.json()}).then(e=>{const o=e.sort((s,r)=>new Date(r.order_datetime)-new Date(s.order_datetime));w(o)}).catch(e=>{console.error("Error fetching orders:",e),h(),v(`Failed to load orders: ${e.message}`),g("Could not load orders. Please try again.")})}setInterval(()=>{l(m)},2e4);const u={};async function I(t){if(u[t])return u[t];try{const e=await(await fetch(`${c}/menuItems/item/${t}`)).json();return u[t]=e.name,e.name}catch(n){return console.error("Error fetching item name:",n),`Item #${t}`}}function w(t){h();const n=document.getElementById("orders-container");if(n.innerHTML="",!t||t.length===0){g();return}E(),t.forEach(e=>{const o=B(e);n.appendChild(o)})}function B(t){const n=document.createElement("div");n.className="order-card";const e=C(new Date(t.order_datetime));return M(t.items),n.innerHTML=`
            <div class="order-header">
                <span class="order-id">Order #${t.id}</span>
                <span class="order-status status-${t.order_status}">${y(t.order_status)}</span>
            </div>
            <div class="order-info">
                <p>Ordered: <span>${e}</span></p>
                <p>Total: <span>$${t.total_amount}</span></p>
            </div>
            <div class="order-actions">
                <button class="btn btn-primary view-details-btn" data-id="${t.id}">View Details</button>
                ${t.order_status==="pending"?`<button class="btn btn-success accept-btn" data-id="${t.id}">Accept Order</button>`:""}
            </div>
        `,setTimeout(()=>{n.querySelector(".view-details-btn").addEventListener("click",function(){L(t.id)});const s=n.querySelector(".accept-btn");s&&s.addEventListener("click",function(r){r.stopPropagation(),i(t.id,"in_progress")})},0),n}function L(t){d=t,document.getElementById("modal-body").innerHTML='<div class="spinner"></div><p>Loading order details...</p>',document.getElementById("orderModal").style.display="block",fetch(`${c}/orders/${t}`).then(n=>{if(!n.ok)throw new Error(`Failed to fetch order details: ${n.status}`);return n.json()}).then(n=>{k(n)}).catch(n=>{console.error("Error fetching order details:",n),document.getElementById("modal-body").innerHTML=`
                    <div class="error-message">
                        Failed to load order details: ${n.message}
                    </div>
                `})}async function k(t){const n=await Promise.all(t.items.map(async r=>{const $=r.name||await I(r.menu_item_id);return{...r,name:$}}));document.getElementById("modal-body").innerHTML=`
            <h3>Order #${t.id}</h3>
            <div class="order-info">
                <p>Status: <span class="order-status status-${t.order_status}">${y(t.order_status)}</span></p>
                <p>Ordered on: <span>${new Date(t.order_datetime).toLocaleString()}</span></p>
                <p>${t.requested_asap?"Requested ASAP":`Requested for: <span>${new Date(t.requested_datetime).toLocaleString()}</span>`}</p>
            </div>
            <h4>Items:</h4>
            <div class="order-items">
                ${n.map(r=>`
                    <div class="item">
                        <span>${r.quantity}x ${r.name}</span>
                        <span>$${r.total_amount}</span>
                    </div>
                `).join("")}
                <div class="order-total">
                    <p>Delivery Fee: $${t.delivery_fee}</p>
                    <p>Total: $${t.total_amount}</p>
                </div>
            </div>
        `;const e=document.getElementById("progress-order-btn"),o=document.getElementById("complete-order-btn"),s=document.getElementById("cancel-order-btn");e.style.display="block",o.style.display="block",s.style.display="block",(t.order_status==="in_progress"||t.order_status==="completed")&&(e.style.display="none"),(t.order_status==="completed"||t.order_status==="cancelled")&&(e.style.display="none",o.style.display="none",s.style.display="none")}function p(){document.getElementById("orderModal").style.display="none",d=null}function i(t,n){fetch(`${c}/orders/${t}/status`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_status:n})}).then(e=>{if(!e.ok)throw new Error(`Failed to update order status: ${e.status}`);return e.json()}).then(e=>{f(`Order #${t} status updated to ${y(n)}`),p(),l()}).catch(e=>{console.error("Error updating order status:",e),f(`Failed to update order status: ${e.message}`,"error")})}function f(t,n="success"){const e=document.getElementById("notification");e.textContent=t,e.style.borderLeftColor=n==="success"?"#2ecc71":"#e74c3c",e.classList.add("show"),setTimeout(()=>{e.classList.remove("show")},3e3)}function S(){document.querySelector(".loader").style.display="block",document.getElementById("orders-container").style.display="none",E()}function h(){document.querySelector(".loader").style.display="none",document.getElementById("orders-container").style.display="grid"}function g(t){const n=document.querySelector(".empty-state");t&&(n.querySelector("p").textContent=t),n.style.display="block"}function E(){document.querySelector(".empty-state").style.display="none"}function v(t){const n=document.getElementById("error-container");n.textContent=t,n.style.display="block"}function _(){document.getElementById("error-container").style.display="none"}function y(t){return t.split("_").map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join(" ")}function M(t){return!t||!Array.isArray(t)?0:t.reduce((n,e)=>n+(e.quantity||0),0)}function C(t){const n=Math.floor((new Date-t)/1e3);let e=Math.floor(n/31536e3);return e>1?e+" years ago":(e=Math.floor(n/2592e3),e>1?e+" months ago":(e=Math.floor(n/86400),e>1?e+" days ago":(e=Math.floor(n/3600),e>1?e+" hours ago":(e=Math.floor(n/60),e>1?e+" minutes ago":"just now"))))}

import"./modulepreload-polyfill-B5Qt9EMX.js";const s=localStorage.getItem("vendorId");s||g("Vendor ID not found. Please log in again.");const i="http://localhost:3000/api";document.addEventListener("DOMContentLoaded",function(){E(),c();const t=document.querySelectorAll(".filter-btn");t.forEach(e=>{e.addEventListener("click",function(){t.forEach(o=>o.classList.remove("active")),this.classList.add("active"),c(this.dataset.status!=="all"?this.dataset.status:null)})}),document.querySelector(".close").addEventListener("click",l),window.addEventListener("click",function(e){const o=document.getElementById("orderModal");e.target===o&&l()}),document.getElementById("progress-order-btn").addEventListener("click",function(){d(a,"in_progress")}),document.getElementById("complete-order-btn").addEventListener("click",function(){d(a,"completed")}),document.getElementById("cancel-order-btn").addEventListener("click",function(){d(a,"cancelled")})});let a=null;function E(){fetch(`${i}/vendor/${s}`).then(t=>{if(!t.ok)throw new Error(`Failed to fetch vendor info: ${t.status}`);return t.json()}).then(t=>{document.getElementById("vendor-name").textContent=t.name||`Vendor #${s}`}).catch(t=>{console.error("Error fetching vendor info:",t),document.getElementById("vendor-name").textContent=`Vendor #${s}`})}function c(t=null){_(),L();let n=`${i}/orders/vendor/${s}`;t&&(n+=`&status=${t}`),fetch(n).then(e=>{if(!e.ok)throw new Error(`Failed to fetch orders: ${e.status}`);return e.json()}).then(e=>{$(e)}).catch(e=>{console.error("Error fetching orders:",e),y(),g(`Failed to load orders: ${e.message}`),f("Could not load orders. Please try again.")})}setInterval(()=>{c()},2e4);function $(t){y();const n=document.getElementById("orders-container");if(n.innerHTML="",!t||t.length===0){f();return}h(),t.forEach(e=>{const o=b(e);n.appendChild(o)})}function b(t){const n=document.createElement("div");n.className="order-card";const e=S(new Date(t.order_datetime)),o=w(t.items);return n.innerHTML=`
            <div class="order-header">
                <span class="order-id">Order #${t.id}</span>
                <span class="order-status status-${t.order_status}">${u(t.order_status)}</span>
            </div>
            <div class="order-info">
                <p>Ordered: <span>${e}</span></p>
                <p>Items: <span>${o}</span></p>
                <p>Total: <span>$${t.total_amount}</span></p>
            </div>
            <div class="order-actions">
                <button class="btn btn-primary view-details-btn" data-id="${t.id}">View Details</button>
                ${t.order_status==="pending"?`<button class="btn btn-success accept-btn" data-id="${t.id}">Accept Order</button>`:""}
            </div>
        `,setTimeout(()=>{n.querySelector(".view-details-btn").addEventListener("click",function(){B(t.id)});const m=n.querySelector(".accept-btn");m&&m.addEventListener("click",function(v){v.stopPropagation(),d(t.id,"in_progress")})},0),n}function B(t){a=t,document.getElementById("modal-body").innerHTML='<div class="spinner"></div><p>Loading order details...</p>',document.getElementById("orderModal").style.display="block",fetch(`${i}/orders/${t}`).then(n=>{if(!n.ok)throw new Error(`Failed to fetch order details: ${n.status}`);return n.json()}).then(n=>{I(n)}).catch(n=>{console.error("Error fetching order details:",n),document.getElementById("modal-body").innerHTML=`
                    <div class="error-message">
                        Failed to load order details: ${n.message}
                    </div>
                `})}function I(t){document.getElementById("modal-body").innerHTML=`
            <h3>Order #${t.id}</h3>
            <div class="order-info">
                <p>Status: <span class="order-status status-${t.order_status}">${u(t.order_status)}</span></p>
                <p>Ordered on: <span>${new Date(t.order_datetime).toLocaleString()}</span></p>
                <p>${t.requested_asap?"Requested ASAP":`Requested for: <span>${new Date(t.requested_datetime).toLocaleString()}</span>`}</p>
            </div>
            <h4>Items:</h4>
            <div class="order-items">
                ${t.items.map(r=>`
                    <div class="item">
                        <span>${r.quantity}x ${r.name||`Item #${r.menu_item_id}`}</span>
                        <span>$${r.total_amount}</span>
                    </div>
                `).join("")}
                <div class="order-total">
                    <p>Delivery Fee: $${t.delivery_fee}</p>
                    <p>Total: $${t.total_amount}</p>
                </div>
            </div>
        `;const n=document.getElementById("progress-order-btn"),e=document.getElementById("complete-order-btn"),o=document.getElementById("cancel-order-btn");n.style.display="block",e.style.display="block",o.style.display="block",(t.order_status==="in_progress"||t.order_status==="completed")&&(n.style.display="none"),(t.order_status==="completed"||t.order_status==="cancelled")&&(n.style.display="none",e.style.display="none",o.style.display="none")}function l(){document.getElementById("orderModal").style.display="none",a=null}function d(t,n){fetch(`${i}/orders/${t}/status`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({order_status:n})}).then(e=>{if(!e.ok)throw new Error(`Failed to update order status: ${e.status}`);return e.json()}).then(e=>{p(`Order #${t} status updated to ${u(n)}`),l(),c()}).catch(e=>{console.error("Error updating order status:",e),p(`Failed to update order status: ${e.message}`,"error")})}function p(t,n="success"){const e=document.getElementById("notification");e.textContent=t,e.style.borderLeftColor=n==="success"?"#2ecc71":"#e74c3c",e.classList.add("show"),setTimeout(()=>{e.classList.remove("show")},3e3)}function _(){document.querySelector(".loader").style.display="block",document.getElementById("orders-container").style.display="none",h()}function y(){document.querySelector(".loader").style.display="none",document.getElementById("orders-container").style.display="grid"}function f(t){const n=document.querySelector(".empty-state");t&&(n.querySelector("p").textContent=t),n.style.display="block"}function h(){document.querySelector(".empty-state").style.display="none"}function g(t){const n=document.getElementById("error-container");n.textContent=t,n.style.display="block"}function L(){document.getElementById("error-container").style.display="none"}function u(t){return t.split("_").map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join(" ")}function w(t){return!t||!Array.isArray(t)?0:t.reduce((n,e)=>n+(e.quantity||0),0)}function S(t){const n=Math.floor((new Date-t)/1e3);let e=Math.floor(n/31536e3);return e>1?e+" years ago":(e=Math.floor(n/2592e3),e>1?e+" months ago":(e=Math.floor(n/86400),e>1?e+" days ago":(e=Math.floor(n/3600),e>1?e+" hours ago":(e=Math.floor(n/60),e>1?e+" minutes ago":"just now"))))}

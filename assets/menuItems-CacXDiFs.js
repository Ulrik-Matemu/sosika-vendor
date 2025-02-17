import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css               */document.addEventListener("DOMContentLoaded",function(){const i=localStorage.getItem("vendorId"),o=document.getElementById("menu-items-container");if(!i){alert("Vendor ID not found. Please log in again."),window.location.href="/login.html";return}const u=parseInt(i,10);fetch(`http://localhost:3000/api/menuItems/${u}`).then(r=>r.json()).then(r=>{r.success?l(r.menuItems):alert("Failed to fetch menu items: "+r.message)}).catch(r=>{console.error("Error:",r),alert("An error occurred while fetching the menu items.")});function l(r){o.innerHTML="",r.forEach(e=>{const n=document.createElement("div");n.classList.add("menu-item");const s=e.is_available?"status available":"status unavailable",t=e.is_available?"Available":"Unavailable";n.innerHTML=`
    <img src="${e.image_url}" alt="${e.name}" />
    <h3>${e.name}</h3>
    <p>${e.description}</p>
    <p>Price: $<span class="item-price" data-id="${e.id}">${e.price}</span></p>
    <input type="number" class="price-input" data-id="${e.id}" placeholder="New Price" min="0" step="0.01">
    <button class="update-price-button" data-id="${e.id}">Update Price</button>
    <p class="${s}">Status: ${t}</p>
    <button class="update-status-button" data-id="${e.id}" data-available="${e.is_available}">Toggle Status</button>
    <button class="delete-button" data-id="${e.id}">Delete</button>
`,o.appendChild(n)}),document.querySelectorAll(".update-status-button").forEach(e=>{e.addEventListener("click",function(){const n=this.getAttribute("data-id"),t=!(this.getAttribute("data-available")==="true");fetch(`http://localhost:3000/api/menuItems/${n}/status`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:t})}).then(a=>a.json()).then(a=>{if(a.success){this.setAttribute("data-available",t);const c=this.previousElementSibling;c.textContent=t?"Status: Available":"Status: Unavailable",c.className=t?"status available":"status unavailable"}else alert("Failed to update status: "+a.message)}).catch(a=>{console.error("Error:",a),alert("An error occurred while updating the status.")})})}),document.querySelectorAll(".update-price-button").forEach(e=>{e.addEventListener("click",function(){const n=this.getAttribute("data-id"),s=document.querySelector(`.price-input[data-id="${n}"]`),t=parseFloat(s.value);if(isNaN(t)||t<=0){alert("Please enter a valid price");return}fetch(`http://localhost:3000/api/menuItems/${n}/price`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({price:t})}).then(a=>a.json()).then(a=>{a.success?(alert("Price updated successfully!"),document.querySelector(`.item-price[data-id="${n}"]`).textContent=t,s.value=""):alert("Failed to update price: "+a.message)}).catch(a=>{console.error("Error:",a),alert("An error occurred while updating the price.")})})}),document.querySelectorAll(".delete-button").forEach(e=>{e.addEventListener("click",function(){const n=this.getAttribute("data-id");confirm("Are you sure you want to delete this menu item?")&&fetch(`http://localhost:3000/api/menuItems/item/${n}`,{method:"DELETE"}).then(s=>s.json()).then(s=>{s.success?(alert("Menu item deleted successfully!"),l(r.filter(t=>t.id!==parseInt(n)))):alert("Failed to delete menu item: "+s.message)}).catch(s=>{console.error("Error:",s),alert("An error occurred while deleting the menu item.")})})})}});

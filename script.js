    async function fixlink(link) {
        if (link.includes("/https/")) {
            const match = link.match(/\/https\/(.+)\.png/);
            if (match) {
                const extractedUrl = "https://" + match[1];
                return decodeURIComponent(extractedUrl);
            } else {
                console.error("Invalid URL format for external URL");
                return link;
            }
        } else {
            return link;
        }
    }

    async function fetchPresence() {
        try {
            const response = await fetch("https://grabe-e701e7ba4aaa.herokuapp.com/infinite");
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            return data
        } catch (error) {
            console.error("Error fetching presence:", error);
        }
    }

    async function create() {
        const loader = document.querySelector(".loader");
        const body = document.querySelector("body");
        body.style.overflow = "hidden";


        const data = await fetchPresence();
        const stleft = document.querySelector(".stleft");
        const stdown = document.querySelector(".stdown");
        const mar = document.createElement("div");
        mar.className = "marquee-text";
        
        const img = document.createElement("img");
        img.src = data.avatar;
        if (data.status == "Online") {
            img.style.border = "2px solid #37a65c";
        } else if (data.status == "Offline") {
            img.style.border = "2px solid #545554";
        } else if (data.status == "Idle") {
            img.style.border = "2px solid #ecb03f";
        } else if (data.status == "Dnd") {
            img.style.border = "2px solid #f7595a";
        }
        stleft.appendChild(img);   

        if (data.status == "Offline") {
            const p = document.createElement("p");
            p.className = "marquee"
            p.textContent = "Offline";
            const stpresence = document.querySelector(".stpresence");
            stpresence.style.display = "none";
            mar.appendChild(p);
            stdown.appendChild(mar)
        }
        else {
            if (data.return == "None") {
                const p = document.createElement("p");
                p.className = "marquee"
                p.textContent = "...";
                const stpresence = document.querySelector(".stpresence");
                stpresence.style.display = "none";
                mar.appendChild(p);
                stdown.appendChild(mar)
            }
            if (data.return == "status") {
                const p = document.createElement("p");
                p.className = "marquee"
                p.textContent = data.name;
                const stpresence = document.querySelector(".stpresence");
                stpresence.style.display = "none";
                mar.appendChild(p);
                stdown.appendChild(mar)
            }
            if (data.return == "presence") {
                if (data.image == null) {
                    const stpresence = document.querySelector(".stpresence");
                    stpresence.style.display = "none";
                }
                if (data.image != null) {
                    const stpresence = document.querySelector(".stpresence");
                    const i = document.createElement("img");
                    i.src = await fixlink(data.image);
                    stpresence.appendChild(i);
                }
                const p = document.createElement("p");
                p.className = "marquee"
                if (data.type == "Listening to") {
                    const i = document.createElement("i");
                    i.className = "fa-solid fa-music";
                    stdown.appendChild(i);
                }
                if (data.type == "Playing") {
                    const i = document.createElement("i");
                    i.className = "fa-solid fa-gamepad";
                    stdown.appendChild(i);
                }
                if (data.type == "Watching") {
                    const i = document.createElement("i");
                    i.className = "fa-solid fa-film";
                    stdown.appendChild(i);
                }
                const content = data.type +" "+ data.name;
                p.textContent = content;
                mar.appendChild(p);
                stdown.appendChild(mar)
            }
        }
        const marqueeText = document.querySelector(".marquee");
        const marqueeContainer = document.querySelector(".marquee-text");

        if (!marqueeText || !marqueeContainer) return;

        const containerWidth = marqueeContainer.offsetWidth;
        const maxAllowedWidth = containerWidth

        if ((marqueeText.scrollWidth - containerWidth) > maxAllowedWidth) {
            marqueeText.style.animation = "marquee 10s linear infinite";
        } else {
            marqueeText.style.animation = "none";
            marqueeText.style.paddingLeft = "0px"
        }
        body.style.overflowY = "auto";
        loader.style.opacity = '0%';
        setTimeout(() => {
            loader.style.display = "none";
        }, 1500)
        
    }
    create()

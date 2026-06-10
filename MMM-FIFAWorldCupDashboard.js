Module.register("MMM-FIFAWorldCupDashboard", {

    start() {

        this.dataStore = null;
        this.currentPage = 0;

        this.sendSocketNotification("FIFA_START", this.config);

        setInterval(() => {

            if (!this.isKnockoutAvailable()) return;

            this.currentPage = 1 - this.currentPage;
            this.updateDom(1000);

        }, 20000);
    },

    socketNotificationReceived(n, p) {
        if (n === "FIFA_DATA") {
            this.dataStore = p;
            this.updateDom(1000);
        }
    },

    getStyles() {
        return ["dashboard.css"];
    },

    isKnockoutAvailable() {

        if (this.config?.testMode) return true;

        if (!this.dataStore?.knockoutStart) return false;

        return (
            (new Date(this.dataStore.knockoutStart) - new Date())
            / 86400000
        ) <= 2;
    },

    getDom() {

        const w = document.createElement("div");
        w.className = "fifa-dashboard";

        if (!this.dataStore) return w;

        if (this.currentPage === 0) {

            w.appendChild(this.renderGroups());
            w.appendChild(this.renderBottom());

        } else {

            w.appendChild(this.renderKnockout());
        }

        return w;
    },

    /* ================= GROUPS ================= */

    renderGroups() {

    const c = document.createElement("div");
    c.className = "groups";

    const groupsOrder = "abcdefghijkl".split("");

    groupsOrder.forEach(l => {

        const g = document.createElement("div");
        g.className = "group";

        const groupData = this.dataStore.groups[l.toUpperCase()] || [];

        /* 1. GROUP TITLE (GANZ OBEN) */
        const title = document.createElement("div");
        title.className = "group-title";
        title.innerHTML = `Gruppe ${l.toUpperCase()}`;

        g.appendChild(title);

        /* 2. HEADER ZEILE DIREKT UNTER TITLE */
        const header = document.createElement("div");
        header.className = "group-header";

        header.innerHTML = `
            <span>#</span>
            <span>Team</span>
            <span>S</span>
            <span>GD</span>
            <span>P</span>
        `;

        g.appendChild(header);

        /* 3. TEAMS */
        groupData.forEach(t => {

            const r = document.createElement("div");
            r.className = "row";

            r.innerHTML = `
                <span>${t.rank}</span>

                <span class="team">
                    <img class="flag" src="https://flagcdn.com/w20/${t.flag}.png">
                    ${t.name}
                </span>

                <span>${t.played}</span>
                <span>${t.gd}</span>
                <span>${t.points}</span>
            `;

            g.appendChild(r);
        });

        c.appendChild(g);
    });

    return c;
},

    /* ================= BOTTOM ================= */

    renderBottom() {

        const b = document.createElement("div");
        b.className = "bottom";

        b.appendChild(this.renderNext());
        b.appendChild(this.renderLive());

        return b;
    },

    /* ================= NEXT MATCHES ================= */

    renderNext() {

        const b = document.createElement("div");
        b.className = "next";

        b.innerHTML = "<h2>Nächste Spiele</h2>";

        this.dataStore.matches
            .filter(m => m.status === "scheduled")
            .slice(0, 6)
            .forEach(m => {

                const d = new Date(m.date);

                const el = document.createElement("div");
                el.className = "match";

                el.innerHTML = `
                    <div class="match-left">
                        <img class="flag" src="https://flagcdn.com/w20/${m.homeFlag}.png">
                        ${m.homeName}
                    </div>

                    <div class="match-vs">vs</div>

                    <div class="match-right">
                        ${m.awayName}
                        <img class="flag" src="https://flagcdn.com/w20/${m.awayFlag}.png">
                    </div>

                    <div class="match-date">
                        ${d.toLocaleDateString("de-DE")} 
                        ${d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}
                    </div>
                `;

                b.appendChild(el);
            });

        return b;
    },

    /* ================= LIVE + RSS ================= */

    renderLive() {

        const b = document.createElement("div");
        b.className = "live";

        b.innerHTML = "<h2>Live + News</h2>";

        (this.dataStore.matches || [])
            .filter(m => m.status === "in_progress")
            .forEach(m => {

                const el = document.createElement("div");

                el.innerHTML = `
                    <img class="flag" src="https://flagcdn.com/w20/${m.homeFlag}.png">
                    ${m.homeName} ${m.homeScore ?? 0}
                    - 
                    ${m.awayScore ?? 0} ${m.awayName}
                    <img class="flag" src="https://flagcdn.com/w20/${m.awayFlag}.png">
                `;

                b.appendChild(el);
            });

        (this.dataStore.rssNews || []).forEach(n => {

            const el = document.createElement("div");
            el.className = "rss-item";
            el.innerHTML = n.title;

            b.appendChild(el);
        });

        return b;
    },

    /* ================= KNOCKOUT ================= */

    renderKnockout() {

        const w = document.createElement("div");
        w.className = "knockout";

        const tree = document.createElement("div");
        tree.className = "ko-tree";

        const stages = {
            R32: [],
            R16: [],
            QF: [],
            SF: [],
            F: []
        };

        (this.dataStore.knockoutMatches || []).forEach(m => {
            if (stages[m.stage]) stages[m.stage].push(m);
        });

        Object.keys(stages).forEach(s => {
            tree.appendChild(this.buildRound(s, stages[s]));
        });

        w.appendChild(tree);

        return w;
    },

    buildRound(title, matches) {

        const c = document.createElement("div");
        c.className = "ko-round";

        c.innerHTML = `<div class="ko-round-title">${title}</div>`;

        matches.forEach(m => {

            const el = document.createElement("div");
            el.className = "ko-match";

            el.innerHTML = `
                <div class="ko-team">${m.homeName}</div>
                <div class="ko-score">${m.homeScore ?? "-"} : ${m.awayScore ?? "-"}</div>
                <div class="ko-team">${m.awayName}</div>
            `;

            c.appendChild(el);
        });

        return c;
    }
});
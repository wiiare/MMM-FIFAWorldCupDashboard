const NodeHelper = require("node_helper");
const https = require("https");

const FLAG_MAP = {
    ARG: "ar", ALG: "dz", AUS: "au", AUT: "at",
    BEL: "be", BIH: "ba", BRA: "br",
    CAN: "ca", CIV: "ci", COD: "cd", COL: "co", CPV: "cv",
    CRO: "hr", CUW: "cw", CZE: "cz",
    ECU: "ec", EGY: "eg", ENG: "gb-eng", ESP: "es",
    FRA: "fr", GER: "de", GHA: "gh", HAI: "ht",
    IRN: "ir", IRQ: "iq", JOR: "jo", JPN: "jp",
    KOR: "kr", KSA: "sa",
    MAR: "ma", MEX: "mx",
    NED: "nl", NOR: "no", NZL: "nz",
    PAN: "pa", PAR: "py", POR: "pt",
    QAT: "qa",
    RSA: "za",
    SCO: "gb-sct", SEN: "sn", SUI: "ch", SWE: "se",
    TUN: "tn", TUR: "tr",
    URU: "uy", USA: "us", UZB: "uz"
};

module.exports = NodeHelper.create({

    start() {
        console.log("[FIFA] started");
    },

    socketNotificationReceived(n, p) {

        if (n === "FIFA_START") {

            this.config = p;
            this.loadData();

            setInterval(() => this.loadData(),
                this.config.updateInterval || 300000);
        }
    },

    async loadData() {

        try {

            const roundsRes =
                await fetch("https://play.fifa.com/json/bracket_predictor/rounds.json");

            const squadsRes =
                await fetch("https://play.fifa.com/json/bracket_predictor/squads.json");

            const rounds = await roundsRes.json();
            const squads = await squadsRes.json();

            const map = {};
            squads.forEach(s => map[s.id] = s);

            const matches = [];

            rounds.forEach(r => {

                if (!r.tournaments) return;

                r.tournaments.forEach(m => {

                    const h = map[m.homeSquadId];
                    const a = map[m.awaySquadId];

                    matches.push({
                        id: m.id,
                        stage: r.stage,
                        status: m.status,
                        date: m.date,

                        homeName: m.homeSquadName,
                        awayName: m.awaySquadName,

                        homeFlag: FLAG_MAP[h?.abbr] || "un",
                        awayFlag: FLAG_MAP[a?.abbr] || "un",

                        homeScore: m.homeScore,
                        awayScore: m.awayScore
                    });
                });
            });

            const groups = {};

            squads.forEach(t => {

                const g = t.group.toUpperCase();

                if (!groups[g]) groups[g] = [];

                groups[g].push({
                    id: t.id,
                    name: t.name,
                    flag: FLAG_MAP[t.abbr] || "un",
                    played: t.groupPlayed,
                    points: t.groupPoints,
                    gd: t.groupGoalsDifference,
                    worldRank: t.worldRank
                });
            });

            /* FIFA SORT */
            Object.keys(groups).forEach(g => {

                groups[g].sort((a, b) => {

                    if (b.points !== a.points) return b.points - a.points;
                    if (b.gd !== a.gd) return b.gd - a.gd;
                    if (a.played !== b.played) return a.played - b.played;

                    return a.worldRank - b.worldRank;
                });

                groups[g].forEach((t, i) => t.rank = i + 1);
            });

            const knockoutStages = ["R32", "R16", "QF", "SF", "F"];

            const knockoutMatches =
                matches.filter(m => knockoutStages.includes(m.stage));

            let knockoutStart = null;

            if (knockoutMatches.length) {
                knockoutMatches.sort((a,b) => new Date(a.date)-new Date(b.date));
                knockoutStart = knockoutMatches[0].date;
            }

            const rssNews = await this.fetchRSS();

            this.sendSocketNotification("FIFA_DATA", {
                groups,
                matches,
                knockoutMatches,
                knockoutStart,
                rssNews
            });

        } catch (e) {
            console.error(e);
        }
    },

    fetchRSS() {

        return new Promise((resolve, reject) => {

            https.get("https://newsfeed.kicker.de/news/wm", res => {

                let data = "";

                res.on("data", c => data += c);

                res.on("end", () => {

                    try {

                        const items = [];
                        const xml = data.match(/<item>([\s\S]*?)<\/item>/g) || [];

                        xml.slice(0, 5).forEach(i => {

                            const title =
                                (i.match(/<title><!\[CDATA\[(.*?)\]\]>/) ||
                                 i.match(/<title>(.*?)<\/title>/))[1];

                            const date =
                                (i.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1];

                            if (title) items.push({ title, date });
                        });

                        resolve(items);

                    } catch (e) {
                        reject(e);
                    }
                });

            }).on("error", reject);
        });
    }
});
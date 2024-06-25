const moment = require("moment");

module.exports = {
    convertMS(ms) {

        const message = this.message;
    
        const absoluteSeconds = Math.floor((ms / 1000) % 60);
        const absoluteMinutes = Math.floor((ms / (1000 * 60)) % 60);
        const absoluteHours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const absoluteDays = Math.floor(ms / (1000 * 60 * 60 * 24));
        
        const d = absoluteDays
            ? absoluteDays === 1
                ? "1 jour"
                : `${absoluteDays} jour`
            : null;
        const h = absoluteHours
            ? absoluteHours === 1
                ? "1 heure"
                : `${absoluteHours} heures`
            : null;
        const m = absoluteMinutes
            ? absoluteMinutes === 1
                ? "1 minute"
                : `${absoluteMinutes} minutes`
            : null;
        const s = absoluteSeconds
            ? absoluteSeconds === 1
                ? "1 seconde"
                : `${absoluteSeconds} secondes`
            : null;
        const ams = ms
        ? ms === 1
                ? "1 ms"
                : `${ms} ms`
        : null;
    
        const absoluteTime = [];
        if (d) absoluteTime.push(d);
        if (h) absoluteTime.push(h);
        if (m) absoluteTime.push(m);
        if (s) absoluteTime.push(s);
        if (absoluteTime.length === 0) absoluteTime.push(ams);
    
        return absoluteTime.join(", ");
    },

    printDateFrom(date){
		locale = "fr-FR"
		moment.locale("fr");
		return moment.utc(date).startOf('hour').fromNow();
	},
}


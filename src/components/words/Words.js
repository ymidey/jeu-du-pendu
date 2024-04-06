export function fetchWord(lang) {
    return new Promise((resolve, reject) => {
        fetch('https://node-hangman-api-production.up.railway.app/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'locale': lang
            })
        })
            .then(res => res.json())
            .then(data => {
                resolve(data.word); // Renvoyer le mot à travers la promesse
            })
            .catch(err => {
                reject(err); // Rejeter la promesse en cas d'erreur
                console.log(err);
            });
    });
}

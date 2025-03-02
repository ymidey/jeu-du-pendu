// Liste locale de secours
const LOCAL_FALLBACK_WORDS = [
    'maison', 'soleil', 'ordinateur', 'chien', 'chocolat',
    'avion', 'arbre', 'plage', 'montagne', 'vélo'
];

export async function fetchWord() {
    try {
        const response = await fetch('https://trouve-mot.fr/api/random');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0 || !data[0].name) {
            throw new Error('Invalid API response format');
        }

        return data[0].name.toLowerCase();

    } catch (error) {
        console.error('Erreur avec l\'API, utilisation du fallback local:', error);
        // Retourne un mot aléatoire du tableau local
        return LOCAL_FALLBACK_WORDS[Math.floor(Math.random() * LOCAL_FALLBACK_WORDS.length)];
    }
}

// Version avec paramètres optionnels
export async function fetchMultipleWords(count = 1) {
    try {
        const response = await fetch(`https://trouve-mot.fr/api/random/${count}`);
        const data = await response.json();

        return data.map(entry => entry.name.toLowerCase());

    } catch (error) {
        console.error('Error:', error);
        return LOCAL_FALLBACK_WORDS.slice(0, count);
    }
}
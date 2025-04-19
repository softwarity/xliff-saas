const fs = require('fs');
const path = require('path');
console.log('generate-languages.js');
// Chemin vers le fichier angular.json
const angularJsonPath = path.join(__dirname, '../angular.json');

// Lire le fichier angular.json
fs.readFile(angularJsonPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erreur lors de la lecture du fichier angular.json:', err);
    return;
  }

  // Analyser le contenu JSON
  const config = JSON.parse(data);
  const locales = config.projects['xliff-translator'].i18n.locales; // Remplacez 'your-app-name' par le nom de votre projet

  const {code} = config.projects['xliff-translator'].i18n.sourceLocale;
  // Créer un tableau pour stocker les langues
  const languages = Object.keys(locales).map(locale => ({
    code: locale // Créez un objet avec la clé "code"
  }));
  languages.splice(0, 0, {code});

  // Générer le contenu du fichier JSON
  const outputContent = JSON.stringify(languages, null, 2); // Formater avec une indentation de 2 espaces

  // Écrire le fichier avec la liste des langues
  fs.writeFile(path.join(__dirname, '../src/assets/locales.json'), outputContent, (err) => {
    if (err) {
      console.error('Erreur lors de l\'écriture du fichier locales.json:', err);
    } else {
      console.log('Fichier languages.json généré avec succès.');
    }
  });
});
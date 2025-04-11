#!/bin/bash

# Chemin vers le répertoire browser
BROWSER_DIR="dist/xliff-translator/browser"

# Vérifier si le répertoire existe
if [ ! -d "$BROWSER_DIR" ]; then
    echo "Le répertoire browser n'existe pas: $BROWSER_DIR"
    exit 1
fi

# Récupérer la liste des répertoires (locales) et les mettre en format string
LOCALES=$(ls -d "$BROWSER_DIR"/*/ 2>/dev/null | xargs -n 1 basename)
# Initialiser le tableau de fichiers
FILES="src/assets/locales.json"
for locale in $LOCALES; do
    FILES="$FILES dist/xliff-translator/browser/$locale/assets/locales.json"
done
# Créer le contenu de locales.json avec les codes et noms des langues
for file in $FILES; do
    echo "[" > "$file"
    for locale in $LOCALES; do
        echo "  {\"code\": \"$locale\"}," >> "$file"
    done
    # Supprimer la dernière virgule et fermer le tableau
    sed -i '$ s/,$//' "$file"
    echo "]" >> "$file"
    echo "locales.json créé avec succès dans: $file"
done

# Créer le contenu de index.html avec la liste des locales
cat > "$BROWSER_DIR/index.html" << EOF
<!DOCTYPE html>
<html><head>
<script>
// Redirection pour l'URL sans slash final
if (!window.location.pathname.endsWith('/')) {
    window.location.href = window.location.pathname + '/';
}

const supportedLocales = [$(for locale in $LOCALES; do echo -n "'$locale',"; done | sed 's/,$//')];
// Function to get the language
function getPreferredLanguage() {
    // 1. Check localStorage
    const storedLang = localStorage.getItem('preferredLanguage')?.toLowerCase();
    if (storedLang && supportedLocales.includes(storedLang)) {
        return storedLang;
    }

    // 2. Use browser language
    const browserLang = (navigator.language || navigator.userLanguage).toLowerCase();
    if (supportedLocales.includes(browserLang)) {
        localStorage.setItem('preferredLanguage', browserLang);
        return browserLang;
    }
    const browserLlocale = browserLang.substring(0,2);
    if (supportedLocales.includes(browserLlocale)) {
        localStorage.setItem('preferredLanguage', browserLlocale);
        return browserLlocale;
    }

    // 3. Default to 'en'
    localStorage.setItem('preferredLanguage', 'en');
    return 'en';
}
window.location.href = \`/\${getPreferredLanguage()}/\`;
</script>
</head></html>
EOF

echo "index.html créé avec succès dans: $BROWSER_DIR"

# Créer le contenu de 404.html avec redirection vers index.html
cat > "$BROWSER_DIR/404.html" << EOF
<!DOCTYPE html>
<html><head>
<script>
    const path = window.location.pathname;
    localStorage.setItem('gh-redirect', path);
    window.location.href = \`/\`;
</script>
</head></html>
EOF

echo "404.html créé avec succès dans: $BROWSER_DIR"

# Créer CNAME
echo "xliff.softwarity.io" > "$BROWSER_DIR/CNAME"

echo "CNAME créé avec succès dans: $BROWSER_DIR"

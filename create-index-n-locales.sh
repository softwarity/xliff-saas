#!/bin/bash

# Chemin vers le répertoire browser
BROWSER_DIR="dist/xliff-translator/browser"

cp src/favicon.ico "$BROWSER_DIR"

# Vérifier si le répertoire existe
if [ ! -d "$BROWSER_DIR" ]; then
    echo "Le répertoire browser n'existe pas: $BROWSER_DIR"
    exit 1
fi

# Récupérer la liste des répertoires (locales) et les mettre en format string
FOLDERS=$(ls -d "$BROWSER_DIR"/*/ 2>/dev/null | xargs -n 1 basename)
# Initialiser le tableau de fichiers
JSON_FILE="src/assets/locales.json"
for folder in $FOLDERS; do
    echo "cp $JSON_FILE $BROWSER_DIR/$folder/assets/locales.json"
    cp "$JSON_FILE" "$BROWSER_DIR/$folder/assets/locales.json"
done

cat > "$BROWSER_DIR/preferred-language.js" << EOF
const supportedLocales = [$(cat $JSON_FILE)];
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
EOF


# Créer le contenu de index.html avec la liste des locales
cat > "$BROWSER_DIR/index.html" << EOF
<!DOCTYPE html>
<html><head>
<script src="/preferred-language.js"></script>
<script>
window.location.href = \`/\${getPreferredLanguage()}/\`;
</script>
</head></html>
EOF

echo "index.html créé avec succès dans: $BROWSER_DIR"

# Créer le contenu de 404.html avec redirection vers index.html
cat > "$BROWSER_DIR/404.html" << EOF
<!DOCTYPE html>
<html><head>
<script src="/preferred-language.js"></script>
<script>
let page = window.location.pathname;
if (page.startsWith(\`/\${getPreferredLanguage()}/\`)) {
    page = page.replace(\`/\${getPreferredLanguage()}/\`, '');
}
window.location.href = \`/\${getPreferredLanguage()}/index.html?page=\${page}\`;
</script>
</head></html>
EOF

echo "404.html créé avec succès dans: $BROWSER_DIR"

# Créer CNAME
echo "xliff.softwarity.io" > "$BROWSER_DIR/CNAME"

echo "CNAME créé avec succès dans: $BROWSER_DIR"

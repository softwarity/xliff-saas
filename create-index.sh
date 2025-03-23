#!/bin/bash

# Chemin vers le répertoire browser
BROWSER_DIR="dist/xliff-translator/browser"

# Vérifier si le répertoire existe
if [ ! -d "$BROWSER_DIR" ]; then
    echo "Le répertoire browser n'existe pas: $BROWSER_DIR"
    exit 1
fi

# Récupérer la liste des répertoires (locales) et les mettre en format string
LOCALES=$(ls -d "$BROWSER_DIR"/*/ 2>/dev/null | xargs -n 1 basename | sed "s/^/'/;s/$/'/" | tr '\n' ',' | sed 's/,$//')

# Créer le contenu de index.html avec la liste des locales
cat > "$BROWSER_DIR/index.html" << EOF
<!DOCTYPE html>
<html><head>
<script>
const userLang = navigator.language || navigator.userLanguage;
const lang = userLang.substring(0,2);
const supportedLocales = [${LOCALES}];
const targetLang = supportedLocales.includes(lang) ? lang : 'en';
window.location.href = \`/\${targetLang}/\`;
</script>
</head></html>
EOF

echo "index.html créé avec succès dans: $BROWSER_DIR"
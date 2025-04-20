#!/bin/bash

# Path to the browser directory
BROWSER_DIR="dist/xliff-translator/browser"

cp src/favicon.ico "$BROWSER_DIR"

# Check if the directory exists
if [ ! -d "$BROWSER_DIR" ]; then
    echo "The browser directory does not exist: $BROWSER_DIR"
    exit 1
fi

# Get the list of directories (locales) and put them in a string
FOLDERS=$(ls -d "$BROWSER_DIR"/*/ 2>/dev/null | xargs -n 1 basename)
# Initialize the array of files
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

create_index_page() {
  local source_file="src/index.html"
  local destination_file="$1"
  local insert_content="$2"

  # Read the content of the source file
  {
    # Read until the </head> tag
    while IFS= read -r line; do
      # Check if the line contains </head>
      if [[ "$line" == *"</head>"* ]]; then
        echo "$insert_content"
      fi
      if [[ "$line" != *"app-root></app-root"* ]]; then
        echo "$line"
      fi
    done < "$source_file"



  } > "$destination_file"
}

INSERT_CONTENT_INDEX='    <script src="/preferred-language.js"></script>
    <script>
        window.location.href = `/${getPreferredLanguage()}/`;
    </script>'

# Contenu pour le deuxième cas
INSERT_CONTENT_404='    <script src="/preferred-language.js"></script>
    <script>
      let page = window.location.pathname;
      if (page.startsWith(`/${getPreferredLanguage()}/`)) {
        page = page.replace(`/${getPreferredLanguage()}/`, ``);
      }
      window.location.href = `/${getPreferredLanguage()}/index.html?page=${page}`;
    </script>'

create_index_page "$BROWSER_DIR/index.html" "$INSERT_CONTENT_INDEX"
echo "index.html created successfully in: $BROWSER_DIR"
create_index_page "$BROWSER_DIR/404.html" "$INSERT_CONTENT_404"
echo "404.html created successfully in: $BROWSER_DIR"

# Create CNAME
echo "xliff.softwarity.io" > "$BROWSER_DIR/CNAME"

echo "CNAME created successfully in: $BROWSER_DIR"

# Copy sitemap.xml
cp sitemap.xml "$BROWSER_DIR"
echo "sitemap.xml copied successfully to: $BROWSER_DIR"

# Copy robots.txt
cp robots.txt "$BROWSER_DIR"
echo "robots.txt copied successfully to: $BROWSER_DIR"


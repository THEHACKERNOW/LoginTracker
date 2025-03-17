#!/bin/bash

# Script para preparar los archivos y desplegar en GitHub Pages

echo "=== Instagram Snuff R34 GitHub Pages Deployment ==="
echo "Este script te ayudará a desplegar la aplicación en GitHub Pages."
echo ""

# Preguntar por el repositorio
read -p "Ingresa la URL de tu repositorio de GitHub (ejemplo: https://github.com/usuario/repo): " REPO_URL

# Verificar si git está instalado
if ! command -v git &> /dev/null; then
    echo "Error: git no está instalado. Por favor, instala git primero."
    exit 1
fi

# Clonar el repositorio en una carpeta temporal
TEMP_DIR=$(mktemp -d)
echo "Clonando repositorio a $TEMP_DIR..."
git clone $REPO_URL $TEMP_DIR

if [ $? -ne 0 ]; then
    echo "Error al clonar el repositorio. Verifica la URL y tus credenciales."
    exit 1
fi

# Copiar los archivos al repositorio clonado
echo "Copiando archivos..."
cp index.html $TEMP_DIR/
cp credentials.html $TEMP_DIR/
cp README.md $TEMP_DIR/

# Ir al directorio del repositorio clonado
cd $TEMP_DIR

# Añadir los archivos al repositorio
echo "Añadiendo archivos al repositorio..."
git add .

# Commit de los cambios
echo "Haciendo commit de los cambios..."
git commit -m "Despliegue de Instagram Snuff R34"

# Push de los cambios
echo "Subiendo cambios al repositorio..."
git push

if [ $? -ne 0 ]; then
    echo "Error al subir los cambios. Verifica tus credenciales de GitHub."
    exit 1
fi

echo ""
echo "=== ¡Despliegue completado! ==="
echo "Ahora debes habilitar GitHub Pages en la configuración de tu repositorio:"
echo "1. Ve a la configuración de tu repositorio ($REPO_URL/settings)"
echo "2. Desplázate hacia abajo hasta 'GitHub Pages'"
echo "3. Selecciona la rama principal como fuente"
echo "4. Haz clic en 'Save'"
echo ""
echo "Tu sitio estará disponible en: ${REPO_URL/github.com/github.io}/"
echo ""

# Limpieza
rm -rf $TEMP_DIR
echo "Limpieza completada."
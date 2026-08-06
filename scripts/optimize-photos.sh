#!/bin/bash
# Optimiza las fotos "sin editar" para web.
#
# Como usarlo:
#   1. Arrastra tus fotos nuevas a assets/img/photos/<categoria>/
#      (categorias: bodas, familias, maternidad, bebes, retratos, eventos, marca)
#   2. Corre este script: bash scripts/optimize-photos.sh
#   3. Las versiones listas para la web quedan en assets/img/gallery/<categoria>/
#      (esas si se suben a GitHub; las originales en photos/ nunca se suben)
#
# Ya optimizadas, referencia las fotos en el HTML como:
#   assets/img/gallery/<categoria>/<nombre>.jpg
#
# Para volver a procesar fotos que ya tenian una version optimizada
# (por ejemplo, tras subir la calidad del script), corre:
#   FORCE=1 bash scripts/optimize-photos.sh

set -e

if command -v magick >/dev/null 2>&1; then
  MAGICK="magick"
else
  MAGICK="/c/Program Files/ImageMagick-7.1.2-Q16-HDRI/magick"
fi

MAX_SIZE="2400x2400>"
QUALITY=88
SAMPLING="4:4:4"
CATEGORIES=(bodas familias maternidad bebes retratos eventos marca)
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

total=0

for cat in "${CATEGORIES[@]}"; do
  src_dir="$ROOT/assets/img/photos/$cat"
  dest_dir="$ROOT/assets/img/gallery/$cat"
  [ -d "$src_dir" ] || continue
  mkdir -p "$dest_dir"

  shopt -s nullglob nocaseglob
  for src in "$src_dir"/*.jpg "$src_dir"/*.jpeg "$src_dir"/*.png; do
    base=$(basename "$src")
    name="${base%.*}"
    dest="$dest_dir/${name}.jpg"

    if [ -f "$dest" ] && [ "$dest" -nt "$src" ] && [ "$FORCE" != "1" ]; then
      continue
    fi

    "$MAGICK" "$src" -auto-orient -resize "$MAX_SIZE" -sampling-factor "$SAMPLING" -quality "$QUALITY" -strip "$dest"
    echo "Optimizado: $cat/$base -> $cat/${name}.jpg"
    total=$((total+1))
  done
  shopt -u nullglob nocaseglob
done

echo ""
echo "Listo. $total foto(s) nueva(s) optimizada(s)."

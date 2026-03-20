#!/usr/bin/env bash
set -euo pipefail

# Arranca stripe listen dentro del contenedor y actualiza automáticamente
# backend/policourt-backend/.env con la clave de webhook que entregue Stripe.
#
# Uso:
#   ./scripts/stripe-listen-auto.sh
#
# Requiere: docker y docker compose (v2) instalados.

ENV_FILE="backend/policourt-backend/.env"
FORWARD_URL="http://springboot:4001/api/payments/webhook/stripe"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: no se encontró $ENV_FILE" >&2
  exit 1
fi

update_env_secret() {
  local secret="$1"
  if grep -q '^STRIPE_WEBHOOK_SECRET=' "$ENV_FILE"; then
    sed -i -E "s|^STRIPE_WEBHOOK_SECRET=.*$|STRIPE_WEBHOOK_SECRET=${secret}|" "$ENV_FILE"
  else
    echo "STRIPE_WEBHOOK_SECRET=${secret}" >> "$ENV_FILE"
  fi
  echo "[ok] Actualizado $ENV_FILE con STRIPE_WEBHOOK_SECRET=${secret}"
}

# Empieza stripe listen y captura la salida en un archivo temporal.
tmp=$(mktemp)
cleanup() { rm -f "$tmp"; }
trap cleanup EXIT

# Ejecutamos stripe listen en background y salvamos salida para parsear.
# El contenedor queda en primer plano para poder cancelarlo con Ctrl+C.

docker compose run --rm stripe-cli stripe listen --print-secret --forward-to "$FORWARD_URL" 2>&1 | tee "$tmp" &
stripe_pid=$!

# Esperamos a que aparezca el secret en la salida y actualizamos .env.
# Stripe imprime algo como: "Ready! Your webhook signing secret is whsec_..."

( tail -n +1 -F "$tmp" 2>/dev/null | while IFS= read -r line; do
    if [[ "$line" =~ (whsec_[A-Za-z0-9_]+) ]]; then
      update_env_secret "${BASH_REMATCH[1]}"
      break
    fi
  done
) &

wait $stripe_pid

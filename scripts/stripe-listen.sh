#!/bin/sh
set -eu

# Este script levanta Stripe CLI en modo "listen" y reenvía los webhooks a Spring Boot dentro de Docker Compose.
#
# El endpoint expuesto por la app es:
#   POST /api/payments/webhook/stripe
#
# Stripe envía el header "Stripe-Signature" y el payload JSON.

stripe listen --forward-to http://springboot:4001/api/payments/webhook/stripe

#!/bin/sh
set -eu

stripe listen --forward-to http://host.docker.internal:4001/api/payments/webhook/stripe

#!/bin/sh
set -eu

stripe listen --forward-to http://springboot:4001/api/payments/webhook/stripe

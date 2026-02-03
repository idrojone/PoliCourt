#!/bin/sh
# Esperar a que la BD esté lista si fuera necesario, o simplemente arrancar
uvicorn app.main:app --host 0.0.0.0 --port 4003 --reload

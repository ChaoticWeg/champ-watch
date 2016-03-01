#!/bin/bash

function log () { echo "[+] $1"; };

# install each local module
log "Installing all local modules, hopefully"
npm install --localapp file:lib/database file:lib/riot file:lib/update-champs file:lib/webserver

# run
node index.js

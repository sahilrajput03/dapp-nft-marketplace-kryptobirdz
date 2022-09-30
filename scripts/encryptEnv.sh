#!/bin/bash
SCRIPTS_DIR_PATH=$(dirname -- "${BASH_SOURCE[0]}")
cd $SCRIPTS_DIR_PATH/..
sops -e .env > enc.env

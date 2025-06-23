#!/bin/bash
cd /home/kavia/workspace/code-generation/webtictactoe-33002-0bb8d849/tic_tac_toe_frontend_workspace/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


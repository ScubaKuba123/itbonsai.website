@echo off
cd /d "%~dp0"
echo Starting BonsAI Office at http://localhost:5174/
npm.cmd run dev -- --port 5174

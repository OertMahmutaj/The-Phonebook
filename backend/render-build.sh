#!/bin/bash
cd frontend
npm install
npm run build
cp -r dist ../backend/dist
cd ../backend
npm install
npm start

#!/bin/bash
PID=$(lsof -ti:5000)
if [[ -n $PID ]];
then
  echo "Killing $PID"
  kill $PID
fi
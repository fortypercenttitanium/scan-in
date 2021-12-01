#!/bin/bash
PID=$(lsof -ti:5001)
if [[ -n $PID ]];
then
  echo "Killing $PID"
  kill $PID
fi
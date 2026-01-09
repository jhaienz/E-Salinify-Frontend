#!/bin/bash

# Set Android SDK environment
export ANDROID_HOME=/opt/android-sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin

# Run expo
npx expo run:android "$@"

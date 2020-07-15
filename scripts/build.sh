#!/bin/bash

# variables
basedir=`dirname "${0}"`
workdir=`dirname "${basedir}"`
builddir="${workdir}/lib"
packbin="${basedir}/readpack.js"
repourl=`${packbin} repository.url`
repover=`${packbin} version`

function dev() {
  webpack-dev-server --config ./scripts/config/webpack.dev.js --watch
}

function test() {
  jest
}

function build() {
  rm -rf "${builddir}"
  webpack --config ./scripts/config/webpack.pub.js
  # tsc
}

command="${1}"
if [ "$command" == "dev" ];then
  dev
elif [ "$command" == "test" ];then
  test
else
  build
fi
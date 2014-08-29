#!/bin/sh

export PORT=8099
mvn package
java -cp 'target/classes:target/dependency/*' JettyRunner

DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))


dev:
	hugo server

#!/usr/bin/ruby

$LOAD_PATH.unshift(File.dirname(__FILE__))

require 'rubygems'
require 'json'
require 'digest/md5'
require 'zlib'
require 'fileutils'
require 'parallel'

require 'optparse'
require 'ostruct'

require 'ArgumentParser'
require 'BaseGroup'
require 'MovieGroup'
require 'PublishEnv'
require 'Packs'
require 'SpriteSheet'
require 'FileZip'
require 'Resource'
require 'PreloadGroup'

parser = ArgumentParser.new(ARGV)
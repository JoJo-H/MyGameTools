#!/usr/bin/ruby

$LOAD_PATH.unshift(File.dirname(__FILE__))

require 'rubygems'
require 'json'
require 'digest/md5'
require 'zlib'
require 'fileutils'
require 'parallel'

require 'optparse'
require 'optparse'
require 'ostruct'

require 'PackData'
require 'ArgumentParser'
require 'BaseGroup'
require 'MovieGroup'
require 'PublishEnv'
require 'Packs'
require 'SpriteSheet'
require 'FileZip'
require 'Resource'
require 'Theme'
require 'Otherwise'
require 'PreloadGroup'

publish_env = PublishEnv.new(ARGV)
res = Resource.new(publish_env)
theme = Theme.new(publish_env)
otherwise = Otherwise.new(publish_env, res)

packs = Packs.new(res, publish_env)
packs.generate()
res.checksum



otherwise.save
res.save
theme.save

res_crc = res.get_res_crc32
theme_crc = theme.get_res_crc32


arr = [res_crc]

if theme_crc != nil and not theme_crc.empty?
  arr.push(theme_crc)
end

puts arr.join('.')


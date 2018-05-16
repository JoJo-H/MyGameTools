#!/usr/bin/ruby

$LOAD_PATH.unshift(File.dirname(__FILE__))
require 'rubygems'
require 'json'
require 'digest/md5'
require 'zlib'
require 'fileutils'

require 'optparse'
require 'ostruct'
require 'Resource'
require 'PackData'
require 'ArgumentParser'
require 'PublishEnv'

search_key = ARGV.shift
publish_env = PublishEnv.new(ARGV)
res = Resource.new(publish_env, nil, false)
data = PackData.new(res, publish_env)

if search_key != nil and search_key.strip != ""
  data.groups.each do |k,v|
    found_files = []
    v.each do |file|
      file = File.basename(file)
      if file.index(search_key)
        found_files.push(file)
      end
    end
    if found_files.length > 0
      puts k + ':'
      puts found_files.join("\n")
      puts "\n"
    end
  end
else
  obj = {}
  moreObjs = []
  data.groups.each do |k,v|
    v.each do |file|
      if not obj.has_key?(file)
        obj[file] = []
      end
      obj[file].push(k)
      if obj[file].length > 1
        moreObjs.push(file)
      end
    end
  end

  moreObjs.each do |file|
    puts file
    puts '[' + obj[file].join(' ') + ']'
  end

end


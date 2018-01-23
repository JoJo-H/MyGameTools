require 'rubygems'
require 'zip/filesystem'
require 'fileutils'

class FileZip
  def initialize(file_list, prefix = 'zip')
    @file_list = file_list
    @prefix = prefix
  end

  def files
    @file_list.map do |file|
      get_file_name(file, '_')
    end
  end

  def save()
    tmp_path = '/tmp/bearjoy/' + `uuidgen`.strip!
    if not Dir.exists?(tmp_path)
      FileUtils.mkdir_p(tmp_path)
    end

    zip_path = File.join(tmp_path, @prefix + '.groupfile')

    @zip_path = zip_path

    Zip::File.open zip_path, Zip::File::CREATE do |zip|
      @file_list.each do |file_path|
        content = File.read(file_path)
        zip.file.open(get_file_name(file_path, '_'), 'w') { |f| f << content }
      end
    end
  end

  def get_file_name(path, dot = '.')
    if path =~ /([^\\\/]+)(\_[^\_]+)\.([^\.]+)$/
      $1 + dot + $3
    end
  end

  def zip_path()
    @zip_path
  end
end
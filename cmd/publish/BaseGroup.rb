class BaseGroup
  def initialize(res, env, files, prefix, file_type = 'zip')
    @res = res
    @env = env
    @file_type = file_type
    @prefix = prefix
    @group_files = files
  end

  def zip(output_path)
    if @group_files.length > 0

      if not Dir.exists?(output_path)
        FileUtils.mkdir_p(output_path)
      end

      @zip_file = FileZip.new(@group_files, @prefix)
      @zip_file.save


      if @zip_file.zip_path =~ /([^\\\/]+)\.([^\.]+)$/
        crc32 = Zlib::crc32(File.read(@zip_file.zip_path)).to_s(32)
        save_to_path = File.join(output_path, $1 + '_' + crc32 + '.' + $2)
        FileUtils.copy_entry(@zip_file.zip_path, save_to_path)
        `chmod 444 #{save_to_path}`
      end

      @group_files.each do |filename|
        File.delete(filename)
      end

      @res.add_item({
                        'name' => @prefix + '_groupfile',
                        'type' => @file_type,
                        'url' => save_to_path.gsub(@env.output_path + '/', ''),
                        'subkeys' => @zip_file.files.map {|m| m.gsub('.', '_')}.join(',')
                    })
    end
  end

  def filename
    @prefix + '.zip'
  end

  def zip_path
    @zip_file.zip_path
  end
end
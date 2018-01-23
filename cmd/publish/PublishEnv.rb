class PublishEnv
  def initialize(argv)
    options = ArgumentParser.parse(argv)

    @project_path = options.project_path
    @output_path = options.output_path
    @pack_script = options.pack_script
    @compress_config = options.compress_config
    @compress_packs = options.compress_packs
    @is_runtime = options.is_runtime

    if not (/([\\\/])/ =~ @output_path)
      @output_path = File.join(@project_path, @output_path)
    end


    if not Dir.exists?(@output_path)
      FileUtils.mkdir_p(@output_path)
    end
  end

  def pack_path
    File.join(output_path, 'packs')
  end

  def compress_packs
    @compress_packs
  end

  def is_runtime
    @is_runtime
  end

  def compress_config
    @compress_config
  end

  def project_path
    @project_path
  end

  def output_path
    @output_path
  end

  def pack_tool_path
    @pack_script
  end
end

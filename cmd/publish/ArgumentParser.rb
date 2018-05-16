def format_project_path(project_path)
  if project_path == nil
    if ENV['CURRENT_GAME_PATH'] != nil && ENV['CURRENT_SUB_PATH'] != nil
      project_path = File.join(ENV[ENV['CURRENT_GAME_PATH']], ENV['CURRENT_SUB_PATH'])
    end
  end
  project_path
end

class ArgumentParser
  def self.parse(args)
    options = OpenStruct.new
    options.project_path = nil
    options.compress_packs = true
    options.output_path = "resource_Publish"
    options.compress_config = true
    options.pack_script = nil
    options.is_runtime = false

    opts = OptionParser.new do |opts|
      opts.banner = "Usage: publish.rb [options]"
      opts.separator ""
      opts.separator "参数列表:"

      opts.on("--project-path [PATH]", "项目路径,默认使用已选中游戏的路径") do |a|
        if a != nil
          options.project_path = a
        end
      end

      opts.on("--output-path [KEY]" ,"输出到指定的位置,支持文件夹名和文件夹路径") do |a|
        if a != nil
          options.output_path = a
        end
      end

      opts.on("--is-runtime", "是否为runtime发布") do |a|
        options.is_runtime = true
      end

      opts.on("--pack-script [ScriptPath]", "合图脚本路径") do |a|
        if a != nil
          options.pack_script = a
        end
      end

      opts.on("--no-compress-config", "不压缩配置文件，默认为压缩") do
        options.compress_config = false
      end

      opts.on("--no-compress-packs", "不压缩packs图集，默认为压缩") do
        options.compress_packs = false
      end

      opts.on("-h", "--help", "帮助信息") do
        puts opts
        exit
      end
    end

    opts.parse!(args)

    options.project_path = format_project_path(options.project_path)
    if options.project_path == nil or options.path_script
      puts opts
      exit
    end

    options
  end
end

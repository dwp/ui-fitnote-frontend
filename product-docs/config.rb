require 'govuk_tech_docs'

# Check for broken links
require 'html-proofer'

GovukTechDocs.configure(self)

# Build-specific configuration
configure :build do
  set :build_dir, '../public'
  set :http_prefix, '##PAGES_PATH##'
  set :relative_links, true
end

set :markdown_engine, :kramdown
set :markdown,
    fenced_code_blocks: true,
    tables: true,
    no_intra_emphasis: true

after_build do |builder|
  begin
    HTMLProofer.check_directory(config[:build_dir],
      { :assume_extension => true,
        :disable_external => true,
        :allow_hash_href => true,
        :url_swap => { config[:tech_docs][:host] => "" } }).run
  rescue RuntimeError => e
    abort e.to_s
  end
end
    


xml.instruct! :xml, :version => "1.0" 
xml.rss :version => "2.0" do
  xml.channel do
    xml.title "Abroad Guille"
    xml.description "My adventures abroad"
    xml.link "http://abroadGuille.tk"

    for item in @feed_items
      xml.item do
        xml.title item.title
        xml.description item.content
        xml.pubDate item.updated_at.to_s(:rfc822)
        xml.link "http://abroadGuille.tk"
        xml.guid item.id
      end
    end
  end
end

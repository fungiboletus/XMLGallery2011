#!/usr/bin/zsh

if [ ! -d "icons" ]; then
	mkdir icons
fi

echo '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="GalML.xsl"?>\n<!DOCTYPE gallery SYSTEM "GalML.dtd">\n<gallery name="'$2'">'

for f in $1/**/* ; do

	if [ ! -d "$f" ] ; then
	
	d=${f%/*}
	d=${d// /+}
	d=${d//\./}
	n=${f##*/}
	echo '\t<file name="'$n'">'
	
	echo "\t\t<path>"$f"</path>"

	mimetype=$(file --mime-type --brief "$f")

	if [ "${mimetype:0:5}" = "image" ]; then

		name=$(echo "$f"|sha1sum|awk '{print $1}')

		if [ ! -e icons/"$name".png ] ; then
			convert "$f" -thumbnail 64x64\> icons/"$name".png
		fi

		echo "\t\t<icon type=\"thumbnail\">$name</icon>"
	else
		echo "\t\t<icon>$mimetype</icon>"
	fi
	
	echo "\t\t<size>"$(stat -c%s "$f")"</size>"
	
	echo "\t\t<date>"$(stat -c%y "$f")"</date>"
	
	echo "\t\t<tags>"
	for t in $(echo ${d//\// }) ; do
		echo "\t\t\t<tag name=\"${t//+/ }\" />"
	done
	echo "\t\t</tags>"

	echo "\t</file>"

	fi
done

echo '</gallery>'

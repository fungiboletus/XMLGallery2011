#!/usr/bin/zsh

echo '<?xml version="1.0" encoding="UTF-8"?>\n<gallery>\n'

for f in $1/**/* ; do

	if [ ! -d "$f" ] ; then
	
	d=${f%/*}
	d=${d// /+}
	n=${f##*/}

	echo '\t<file name="'$n'">'
	
	echo "\t\t<mimetype>"$(file --mime-type --brief "$f")"</mimetype>"
	
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

<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
 <xsl:output method="html" omit-xml-declaration="yes" encoding="UTF-8" doctype-system="about:legacy-compat" indent="yes"/>
<xsl:template match="/gallery">
<html>
	<head>
		<title><xsl:value-of select="@name"/> - XMLGallery2011</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<link rel="stylesheet" type="text/css" href="GalML_style.css" />
	</head>
	<body>		
		
	
		<header><h1 id="title"><xsl:value-of select="@name"/> - XMLGallery2011</h1></header>
		
		<ul class="gallery">
		<xsl:for-each select="file">
			<li class="file">
				<a href="{path}">
					<img class="icon" src="mimes/{translate(mimetype,'/','-')}.png" />
					<h4 class="name"><xsl:value-of select="@name"/></h4>
					<p class="size"><xsl:value-of select="size"/></p>
					<p class="date"><xsl:value-of select="date"/></p>
				</a>

				<xsl:if test="tags"><ul class="tags">
				<xsl:for-each select="tags/tag">
					<li class="tag"><xsl:value-of select="@name"/></li>
				</xsl:for-each>
				</ul></xsl:if>
			</li>
		</xsl:for-each>
		</ul>

		<div class="mainview">
			<iframe id="view" src="iframe.html"></iframe>
		</div>
	</body>
</html>
</xsl:template>
</xsl:stylesheet>

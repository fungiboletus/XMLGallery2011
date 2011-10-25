<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
 <xsl:output method="html" omit-xml-declaration="yes" encoding="UTF-8" doctype-system="about:legacy-compat" indent="yes"/>
<xsl:template match="/gallery">
<html>
	<head>
		<title><xsl:value-of select="@name"/> - XMLGallery2011</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<link rel="stylesheet" type="text/css" href="GalML_style.css" />
		<link rel="alternate stylesheet" title="Sombre" href="sombre.css" />
		<link rel="alternate stylesheet" title="Rouge" href="red.css" />
		<script type="text/javascript" src="commun.js"></script>
		<script type="text/javascript" src="scrollbar.js"></script>
		<script type="text/javascript" src="GalML.js"></script>
	</head>
	<body>		
		
	
		<header><h1 id="title"><xsl:value-of select="@name"/> - XMLGallery2011</h1>
		
		<form action="#" id="search">
			<input type="text" id="input_search" name="search" placeholder="Rechercher" />
		</form>

		</header>
	
		<div id="body">
			<ul class="gallery" id="gallery">
			<xsl:for-each select="file">
				<li class="file" id="file_{position()}">
					<a href="{path}">
						<xsl:if test="mimetype"><img class="icon" alt="{mimetype}" src="mimes/{translate(mimetype,'/','-')}.png" /></xsl:if>
						<h4 class="name"><xsl:value-of select="@name"/></h4>
						<p class="size"><xsl:value-of select="size"/></p>
						<p class="date"><xsl:value-of select="date"/></p>
						
						<xsl:if test="tags"><ul class="tags">
						<xsl:for-each select="tags/tag">
							<li class="tag"><xsl:value-of select="@name"/></li>
						</xsl:for-each>
						</ul></xsl:if>
					</a>
				</li>
			</xsl:for-each>
			</ul>

			<div class="mainview">
				<div id="framemainview">
					<iframe id="mainview_iframe" src="iframe.html"></iframe>
					<audio id="mainview_audio" controls="controls">
						<source src="#" type="canard" />
					</audio>
					<video id="mainview_video" controls="controls">
						<source src="#" type="canard" />
					</video>
					<div id="mainview_image_1" class="mainview_image" ></div>
					<div id="mainview_image_2" class="mainview_image" ></div>

					<div class="button" id="button_previous">←</div>
					<div class="button" id="button_next">→</div>
				</div>
			</div>
		</div>
	</body>
</html>
</xsl:template>
</xsl:stylesheet>

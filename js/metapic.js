(function ($) {
	var pluginName = 'metapic';
	var dom, tinyDoc, currentImage, currentMode;

	function mobilecheck() {
		return true;
		(function (a, b) {
			if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))check = true
		})(navigator.userAgent || navigator.vendor || window.opera);
		return check;
	}

	var getTagLink = function(tag) {
		return $( '<a/>', { "class": "mtpc-link", "href": "http://mtpc.se/tags/Link/" + tag.id } ).text( tag.text );
	};

	var getTagsAsList = function(id, tags) {
		var list = $("<ul></ul>");
		var listId = parseInt(id);
		list.addClass("mtpc-product-list");
		list.css("display", "none");
		// Remove both data-metapic-id and data-metapic-related-id for legacy reasons
		tinyDoc.find("ul[data-metapic-id='" + listId + "'],ul[data-metapic-related-id='" + id + "']").remove();
		list.attr("data-metapic-related-id", id);
		for (i = 0; i < tags.length; i++) {
			list.append( $( '<li/>' ).append( getTagLink( tags[i] ) ) );
		}
		return list;
	};

	tinymce.PluginManager.add(pluginName, function (editor, url) {

		editor.on("init", function () {
			dom = editor.dom;
			tinyDoc = $(dom.doc);
			var links = dom.select('a');
			$.each(links, function (index, el) {
				if (el.href.indexOf('mtpc') !== -1) {
					$(el).addClass("mtpc-link");
				}
			});
		});

		$(document).on("metapicClose", function () {
			editor.focus();
		});

		$(document).on("metapicReturn", function (data) {
			var returnData = data.text,
				selection = $(editor.selection.getNode());

			var tags, tagList;
			switch (currentMode) {
				case "image":
					returnData = $(returnData);
					selection = $(editor.selection.getNode());
					selection.attr("data-metapic-id", returnData.attr("data-metapic-id"));
					selection.attr("data-metapic-tags", returnData.attr("data-metapic-tags"));
					selection.addClass("mtpc-img");
					tagList = getTagsAsList(returnData.attr("data-metapic-id"), JSON.parse(returnData.attr("data-metapic-tags")));
					tagList.addClass("mtpc-product-list-img");
					selection.after(tagList);
					break;
				default:
					if (selection.is("img")) {//image tag
						if (selection.parent().is("a")) {
							selection.parent().replaceWith(returnData);
						}
						else {//text link
							selection.replaceWith(returnData);
						}
					}
					else {//collage
						editor.insertContent(returnData);
						tagList = getTagsAsList($(returnData).attr("data-metapic-id"), JSON.parse($(returnData).attr("data-metapic-tags")));
						returnData = tinyDoc.find("img[data-metapic-id='"+$(returnData).attr("data-metapic-id")+"']");
						tagList.addClass("mtpc-product-list-collage");
						returnData.after(tagList);
					}
					break;
			}
			editor.focus();
		});

		var metapicButton;
		var linkButton = pluginName + 'link';
		editor.addButton(linkButton, {
			title: editor.getLang('metapic.linkTitle'),
			image: editor.settings.mtpc_plugin_url + "/images/tag_text_color.svg",
			icon: false,
			onclick: function () {
				currentMode = "text";
				var selection = $(editor.selection.getContent());
				var contentConfig = (selection.is("img")) ? {} : {format: 'text'};

				editor.iframeElement.blur();
				$.getJSON(editor.settings.mtpc_iframe_url, function (data) {
					$.event.trigger({
						type: "metapic",
						text: editor.selection.getContent(contentConfig),
						baseUrl: data['metapicApi'],
						startPage: "find/default",
						hideSidebar: true,
						randomKey: data['access_token']['access_token']
					})
				});
			},
			onPostRender: function () {
				editor.on('nodechange', setupTextButton);
				editor.on('click', setupTextButton);
			}
		});

		function setupTextButton(event) {
			if (!mobilecheck()) {
				if ($.trim(editor.selection.getContent()) == "") {
					editor.controlManager.setDisabled(linkButton, true);
					editor.controlManager.setActive(linkButton, false);
				}
				else {
					editor.controlManager.setDisabled(linkButton, false);
				}
			}
			if (editor.selection.getNode().nodeName == "A") {
				editor.controlManager.setActive(linkButton, true);
			}
			else {
				editor.controlManager.setActive(linkButton, false);
			}
		}

		var imageButton = pluginName + 'img';
		editor.addButton(imageButton, {
			title: editor.getLang('metapic.imageTitle'),
			image: editor.settings.mtpc_plugin_url + "/images/tag_image_color.svg",
			onclick: function () {
				currentMode = "image";
				tinyMCE.get("content").iframeElement.blur();
				$.getJSON(editor.settings.mtpc_iframe_url, function (data) {
					var src = $(editor.selection.getNode()).attr("src");
					$.event.trigger({
						type: "metapic",
						baseUrl: data['metapicApi'],
						startPage: "tag-editor",
						hideSidebar: true,
						imgSrc: src,
						//text:editor.selection.getNode(),
						randomKey: data['access_token']['access_token']
					});
				});
			},
			onPostRender: function () {
				metapicButton = this;
				editor.on('click', setupImageButton);
				editor.on('nodechange', setupImageButton);
			}
		});

		function setupImageButton(event) {
			if (editor.selection.getNode().nodeName != "IMG") {
				editor.controlManager.setDisabled(imageButton, true);
			}
			else {
				editor.controlManager.setDisabled(imageButton, false);
			}

			if ($(editor.selection.getNode()).attr("data-metapic-id")) {
				editor.controlManager.setActive(imageButton, true);

			}
			else {
				editor.controlManager.setActive(imageButton, false);
			}
		}

		var collageButton = pluginName + 'collage';
		editor.addButton(collageButton, {
			title: editor.getLang('metapic.collageTitle'),
//			text: editor.getLang('metapic.collageText'),
			image: editor.settings.mtpc_plugin_url + "/images/create_collage_color.svg",
			onclick: function () {
				currentMode = "collage";
				tinyMCE.get("content").iframeElement.blur();
				$.getJSON(editor.settings.mtpc_iframe_url, function (data) {
					var src = $(editor.selection.getNode()).attr("src");
					$.event.trigger({
						type: "metapic",
						baseUrl: data['metapicApi'],
						startPage: "collage",
						imgSrc: src,
						hideSidebar: true,
						randomKey: data['access_token']['access_token']

					})
				})
			},
			onPostRender: function () {
				metapicButton = this;
				if (!mobilecheck()) {
					editor.on('click', setupCollageButton);
					editor.on('nodechange', setupCollageButton);
				}
			}
		});

		function setupCollageButton(event) {
			if ($.trim(editor.selection.getContent()) != "") {
				editor.controlManager.setDisabled(collageButton, true);
			}
			else {
				editor.controlManager.setDisabled(collageButton, false);
			}
		}

		function removeButtonClasses(button) {
			button.removeClass("metapic-new").removeClass("metapic-image").removeClass("metapic-text");
			return button;
		}
	});


})(jQuery);
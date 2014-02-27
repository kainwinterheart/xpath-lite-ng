(function(){

'use strict';

/* is mostly copied from firebug */

angular.module( 'xpath-lite-ng', [] )

.factory( 'XPath', function()
{
	var $scope = {};

	$scope.getElementXPath = function(element)
	{
	    if (element && element.id)
	        return '//*[@id="' + element.id + '"]';
	    else
	        return this.getElementTreeXPath(element);
	};

	$scope.getElementTreeXPath = function(element)
	{
	    var paths = [];

	    // Use nodeName (instead of localName) so namespace prefix is included (if any).
	    for (; element && element.nodeType == 1; element = element.parentNode)
	    {
	        var index = 0;
	        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling)
	        {
	            // Ignore document type declaration.
	            if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
	                continue;

	            if (sibling.nodeName == element.nodeName)
	                ++index;
	        }

	        var tagName = element.nodeName.toLowerCase();
	        var pathIndex = (index ? "[" + (index+1) + "]" : "");
	        paths.splice(0, 0, tagName + pathIndex);
	    }

	    return paths.length ? "/" + paths.join("/") : null;
	};

	$scope.getElementsByXPath = function(doc, xpath)
	{
	    var nodes = [];

	    try {
	        var result = doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
	        for (var item = result.iterateNext(); item; item = result.iterateNext())
	            nodes.push(item);
	    }
	    catch (exc)
	    {
	        // Invalid xpath expressions make their way here sometimes.  If that happens,
	        // we still want to return an empty set without an exception.
		if( window[ 'console' ] ) console.error(exc);
	    }

	    return nodes;
	};

	return $scope;
})

;

})();


# Open Data Innovation Project (ODIN)

## Introduction

“In a knowledge-rich world, progress does not lie in the direction of reading and writing information faster or storing more of it. Progress lies in the direction of extracting and exploiting the patterns of the world so that far less information needs to be read, written, or stored.” (Herbert Simon, 1971)

While the availability of big data and the advancement of methods to analyze them allow researchers to test hypotheses and validate theories, it is not clear how it can facilitate exploration and inductive understanding of social phenomena especially when data is unstructured, making it less amenable to quantification and computation.

Making complex inter-related information, not just available, but truly accessible, is critical for an informed society. The Open Data Innovation Project (ODIN) project seeks to make textual data repositories useable rather than simply available by processing and visualizing text data for human sensemaking. We encourage you to watch the tutorial video, explore the guided walkthoughs and experience the platform yourself!

## Installation

### Elastic Search

### Analytics
ODIN uses [Matomo](https://matomo.org/) as its open source analytic service.

#### Basic Analytics
After installing Matomo on your server, you need to replace `sid` value to the site id you have created in Matomo, and `u` to the url of your Matomo server. The default configuration is set to the site id of 1, and server url of http://thyme.open-data.stream/.
If you don't need analytics, you can safely remove this script block.
```javascript
<!-- Matomo -->
<script type="text/javascript">
  var _paq = _paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var sid = '1';
    var u="//thyme.open-data.stream/";
    _paq.push(['setTrackerUrl', u+'piwik.php']);
    _paq.push(['setSiteId', sid]);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
  })();
</script>
<!-- End Matomo Code -->
```

#### Detailed Analytics
To enable more analysis (i.e. Matomo Events), make sure `analytics_enabled` is set to `true` in the `/src/assets/files/deafult.config.json` file.
This feature tracks various user actions on the ODIN and places those in "Actions/Events" section of Matomo.
The actions are:
* Query texts
* Menu clicks
* Adding or Removing Concepts
#### Mouse Tracking
ODIN records user mouse movents over the web application by capturing cursor position and timestamps. In order to enable this feature, you need to:

1. Install [custom dimension](https://matomo.org/docs/custom-dimensions/) plugin for Matomo
2. Make sure `track_mouse_movement_enabled` is set to `true` in `/src/assets/files/deafult.config.json` file
2. [Create a custom dimension](https://matomo.org/docs/custom-dimensions/#creating-custom-dimensions)
3. Set `track_mouse_customdimension_id` in the `/src/assets/files/deafult.config.json` file (default value is set to `1`) to the id of the custom dimension you have created in the previous step

## Build and Test

TODO: Describe and show how to build your code and run the tests. 

## Contribute

TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://www.visualstudio.com/en-us/docs/git/create-a-readme). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)
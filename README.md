# html-json

Simple helper to convert HTML content to JSON

Usage
---------------
- Query sytna based on cherrio https://github.com/cheeriojs/cheerio 
- Simple query
```
  json = require('html-json')(pageContent).extract({
    'title' : title: 'div.container > h1' // by default to get
  });
  
  //result 
  {
    'title' : 'Testing'
  }
```

- Function
```
  json = require('html-json')(pageContent).extract({
    author_page_uri: function($body) {
        return $body.find('div.container > div > a').attr('href').trim();
    }
  });
  
  //result 
  {
    'author_page_uri' : '/data?post=1'
  }
```



- LIST
```
  json = require('html-json')(pageContent).extract({
    author_page_uri: function($body) {
      images: {
          'PARENT' : '#thumbnail > div.each_box > div > ul img',
          'LIST' : {
              '348px' : function($image){
                  return $image.attr('src');
              },
              '600px' : function($image){
                  return $image.attr('src').replace('&w=348&h=348', '&w=600&h=600');
              }
          }
      }
    }
  });
  
  //result 
  {
    'images' : [
      {
        '348px' : 'http://image.image/image1.jpg&w=348&h=348'
        '600px' : 'http://image.image/image1.jpg&w=600&h=600'
      },
      {
        '348px' : 'http://image.image/image2.jpg&w=348&h=348'
        '600px' : 'http://image.image/image2.jpg&w=600&h=600'
      }
    ]
  }
```



- OBJECT
```
  json = require('html-json')(pageContent).extract({
    author_page_uri: function($body) {
      'cover': {
        'PARENT' : ' #M201106_0_getTakelook_P00a400040052 > img',
        'OBJECT' : {
            'alt' : function($image){
                return $image.attr('alt');
            },
            'url' : function($image){
                return $image.attr('src');
            } 
        }
      }
    }
  });
  
  //result 
  {
    'cover' : {
      'alt' : 'this is cover',
      'url' : 'http://xxxxxxx'
    }
  }
```

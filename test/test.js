describe('test Html Extractor', function() {

    var pageBody, Parse = require('../index.js');
    before(function() {
        pageBody = require("fs").readFileSync('./test/booksComTw.html');
    });

    it('should return text value with single simple query', function() {
        var extractor = Parse(pageBody);
        var result = extractor.extract({
            title: 'div.container_24.main_wrap.clearfix > div > div.mod.type02_p01_wrap.clearfix > div.grid_10 > div.mod.type02_p002.clearfix > h1'
        });
        result.should.containEql({
            'title' : '怪談'
        });
    });

    it('should return href value with single simple function', function() {
        var extractor = Parse(pageBody);
        var result = extractor.extract({
            author_page_uri: function($body) {
                return $body.find('div.container_24.main_wrap.clearfix > div > div.mod.type02_p01_wrap.clearfix > div.grid_10 > div.type02_p003.clearfix > ul > li:nth-child(1) > a').attr('href').trim();
            }
        });
        result.should.containEql({
            'author_page_uri': 'http://search.books.com.tw/exep/prod_search.php?key=%EF%BC%88%E6%97%A5%EF%BC%89%E5%B0%8F%E6%B3%89%E5%85%AB%E9%9B%B2&f=author'
        });
    });

    it('should return object with multi query', function() {
        var extractor = Parse(pageBody);
        var result = extractor.extract({
            title: 'div.container_24.main_wrap.clearfix > div > div.mod.type02_p01_wrap.clearfix > div.grid_10 > div.mod.type02_p002.clearfix > h1',
            author_page_uri: function($body) {
                return $body.find('div.container_24.main_wrap.clearfix > div > div.mod.type02_p01_wrap.clearfix > div.grid_10 > div.type02_p003.clearfix > ul > li:nth-child(1) > a').attr('href').trim();
            }
        });
        result.should.containEql({
            'title': '怪談',
            'author_page_uri': 'http://search.books.com.tw/exep/prod_search.php?key=%EF%BC%88%E6%97%A5%EF%BC%89%E5%B0%8F%E6%B3%89%E5%85%AB%E9%9B%B2&f=author'
        });
    });
 


    it('should return list of object with LIST query', function () {
        var extractor = Parse(pageBody);
        var tagNames = {};
        var result = extractor.extract(
            {
                images: {
                    'PARENT' : '#thumbnail > div.each_box.M201106_0_getTakelook_P00a400040052_scroll > div > ul img',
                    'LIST' : {
                        '348px' : function($img){
                            return $img.attr('src');
                        },
                        '600px' : function($img){
                            return $img.attr('src').replace('&w=348&h=348', '&w=600&h=600');
                        }
                    }
                }
            }
        );

        result.images.forEach(function(image){
            image['348px'].should.be.startWith('http');
            image['348px'].should.be.endWith('348');
            image['600px'].should.be.startWith('http');
            image['600px'].should.be.endWith('600');
        });
    });
   
    it('should return single object with OBJECT query', function () {
        var extractor = Parse(pageBody);
        var tagNames = {};
        var result = extractor.extract(
            {
                image: {
                    'PARENT' : ' #M201106_0_getTakelook_P00a400040052 > img',
                    'OBJECT' : {
                        '348px' : function($img){
                            return $img.attr('src');
                        },
                        '600px' : function($img){
                            return $img.attr('src').replace('&w=348&h=348', '&w=600&h=600');
                        }
                    }
                }
            }
        );

       
        result.image['348px'].should.be.startWith('http');
        result.image['348px'].should.be.endWith('348');
        result.image['600px'].should.be.startWith('http');
        result.image['600px'].should.be.endWith('600');
       
    });
    





});

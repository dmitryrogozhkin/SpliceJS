/** 
 * desc: Test fixture module, allow logging output to the document
 * dependencies: none
*/
define(function(){
    var divHtml = '<div id="logWindow"></div>';
     
    
    var div = document.createElement('div');
    div.innerHTML = divHtml;
    document.body.appendChild(div);

    var logWindow = document.getElementById('logWindow');
    
    var cssResultRow = 'position:relative; width:50%; padding:1em; padding-bottom:0.2em; padding-top:0.2em';
    var cssResultOk = 'float:right; color:#00ff00';
    var cssResultFail = 'float:right; color:#ff0000';

    function log(text, result){
        var d = document.createElement('div');
        var r = document.createElement('div');

        d.setAttribute('style', cssResultRow);
        d.appendChild(document.createTextNode(text));

        if(result === true){
            r.setAttribute('style', cssResultOk);
            r.appendChild(document.createTextNode('OK'));
        } else if(result == null){
            r.setAttribute('style', cssResultOk);
        }
        else {
            r.setAttribute('style', cssResultFail);
            r.appendChild(document.createTextNode('Fail'));
        }

        d.appendChild(r);

        d.onmouseover = function(){
            d.style.backgroundColor = '#cecece';
        }
        d.onmouseout = function(){
            d.style.backgroundColor = '#ffffff';
        }

        logWindow.appendChild(d);
    }

    //export the log function
    return {log:log};
});
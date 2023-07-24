
// fetching the url from the user
let btnele=document.getElementsByClassName('search-button');

btnele[0].addEventListener('click',function(){
    let inputele=document.getElementsByClassName('search-input');
    let url=inputele[0].value.trim();
    console.log("Consoling the url: ",url);
    if(url=='')
    {
        alert('Please Enter the source url');
        inputele[0].value='';
    }
    else{
        let parent=document.getElementById('all-links');
        parent.innerHTML=`<h1>Kindly wait for the result</h1>`
        console.log(`Entered URL is: ${url}`);
        let data={URL:url};
        console.log(data);
        // making a request to the server once the url is given to the search box
        let request=new XMLHttpRequest();
        request.open('POST','/datarequired');
        request.setRequestHeader('Content-Type','application/json');
        request.send(JSON.stringify(data));
        request.addEventListener('load',function(){
            if(request.status==200)
            {
                let allUrl=JSON.parse(request.responseText);
                console.log(allUrl);
                inputele[0].value='';
                console.log('1here');
                if(allUrl.length==1)
                {
                    
                   parent.innerHTML=`<h1>Error in Scrapping the Given Link</h1>`;
                   console.log('Error in getting the data from the server');
                }
              else{
                parent.innerHTML='';
                
                
                   console.log('2here');
                   addElements(allUrl);
                
            }
            }
            else{
                // let parent=document.getElementById('all-links');
                // parent.innerHTML=`<h1>Error in Scrapping the Given Link</h1>`;

                // console.log('Error in getting the data from the server');
            }
            inputele[0].value='';
        })
    }
})


// function for adding the elements to the user side
function addElements(allUrl)
{
    console.log('3here');
    let ulele=document.getElementById('all-links');
    ulele.innerHTML='';
    for(let i=0;i<allUrl.length;i++)
    {
        console.log('4here');
        let newEle=document.createElement('li');
        newEle.textContent=`${allUrl[i]}`;
        ulele.appendChild(newEle);
    }
}


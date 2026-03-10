const splitChars=()=>{
    let STRING = "onoorbaar";
    let result;
    let a=0;
    let b=3;
    for(let i=0;i<STRING.length;i++){
        console.log(STRING.substring(a,b))
        if(a===STRING.length-3){
            return;
        }
        a++;
        b++;
    }
}
window.addEventListener("load",splitChars)
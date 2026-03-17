const setup = () => {
	let colorDemos=document.getElementsByClassName("colorDemo");
	let sliders = document.getElementsByClassName("slider");

	for (let i = 0; i < sliders.length; i++) {

		sliders[i].addEventListener("change", update)
		sliders[i].addEventListener("input", update)
	}

	// maak het blokje rood
	colorDemos[0].style.backgroundColor= "rgb(255, 0, 0)";
}

const update = () => {
	let sliders = document.getElementsByClassName("slider");
	let valueR=sliders[0].value;
	let valueG=sliders[1].value;
	let valueB=sliders[2].value;

	let value=document.getElementsByClassName("value");
	value[0].innerText = valueR;
	valueG = value[1].innerText = valueG;
	valueB = value[2].innerText = valueB;

	console.log("de waarde van de slider R is momenteel : "+valueR);
	console.log("de waarde van de slider G is momenteel : "+valueG);
	console.log("de waarde van de slider B is momenteel : "+valueB);

	let colorDemos=document.getElementsByClassName("colorDemo");
	colorDemos[0].style.backgroundColor= "rgb("+valueR+","+valueG+", "+valueB+")";

}



window.addEventListener("load", setup);
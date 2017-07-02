window.onload = () => {
    const $h1 = document.querySelector("h1")
    
    document.querySelector(".pure-form").addEventListener("submit", e => {
        e.preventDefault();
        $h1.innerText = "Loading...";
        fetch('/getStats')
            .then(data => data.json())
            .then(json => $h1.textContent = `
            The temperature is ${json.temperature}c.
            The humidity is ${json.humidity}%.`); 
    });
};

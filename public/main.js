window.onload = () => {
    const $h1 = document.querySelector("h1"),
          $zip = document.getElementById("zipcode");
    
    document.querySelector(".pure-form").addEventListener("submit", e => {
        e.preventDefault();
        const zipCode = $zip.value;
        $h1.innerText = "Loading...";
        fetch(`/${zipCode}`)
            .then(data => data.json())
            .then(data => {
                console.log(data)
                return data
            })
            .then(json => $h1.textContent = `The temperature is ${json.temperature} in ${json.city}.`); 
    });
};